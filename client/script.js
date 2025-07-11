// データ構造とストレージ管理（API使用版）
class Storage {
    static async getPages() {
        try {
            return await API.getPages();
        } catch (error) {
            console.error('Failed to get pages:', error);
            return [];
        }
    }
    
    static async savePage(page) {
        try {
            if (page.id) {
                // 更新
                await API.updatePage(page.id, page.title);
            } else {
                // 新規作成
                return await API.createPage(page.title, page.parent_id);
            }
        } catch (error) {
            console.error('Failed to save page:', error);
            throw error;
        }
    }
    
    static async deletePage(pageId) {
        try {
            await API.deletePage(pageId);
        } catch (error) {
            console.error('Failed to delete page:', error);
            throw error;
        }
    }
    
    static async getBlocks(pageId) {
        try {
            const blocks = await API.getBlocks(pageId);
            // APIからのデータをフロントエンドの形式に変換
            return blocks.map(block => ({
                id: block.id,
                type: block.type,
                content: block.content,
                order: block.order_index,
                checked: block.checked === 1
            }));
        } catch (error) {
            console.error('Failed to get blocks:', error);
            return [];
        }
    }
    
    static async saveBlocks(pageId, blocks) {
        // バッチ更新用（現在は個別に更新）
        // 実際の更新は各メソッド内で行う
    }
}

// アプリケーションの状態管理
class App {
    constructor() {
        this.currentPageId = null;
        this.pages = [];
        this.blocks = [];
        this.init();
    }
    
    async init() {
        console.log('App initialization started');
        await this.loadPages();
        console.log('Pages loaded:', this.pages.length);
        this.setupEventListeners();
        this.setupTheme();
        
        // 最初のページを選択するか新規作成
        if (this.pages.length > 0) {
            console.log('Selecting first page:', this.pages[0].id);
            await this.selectPage(this.pages[0].id);
        } else {
            console.log('No pages found, creating new page');
            await this.createNewPage();
        }
        console.log('App initialization completed, currentPageId:', this.currentPageId);
    }
    
    setupEventListeners() {
        // 新規ページ作成
        document.getElementById('new-page-btn').addEventListener('click', () => {
            this.createNewPage();
        });
        
        // ページタイトル変更
        let titleUpdateTimer;
        const pageTitle = document.getElementById('page-title');
        
        pageTitle.addEventListener('input', (e) => {
            if (this.currentPageId) {
                const page = this.pages.find(p => p.id === this.currentPageId);
                if (page) {
                    page.title = e.target.value || '無題';
                    page.updatedAt = new Date().toISOString();
                    
                    // デバウンスしてAPIコールを減らす
                    clearTimeout(titleUpdateTimer);
                    titleUpdateTimer = setTimeout(async () => {
                        try {
                            await Storage.savePage(page);
                            this.renderPageTree();
                        } catch (error) {
                            console.error('Failed to update page title:', error);
                        }
                    }, 500);
                }
            }
        });
        
        // ページタイトルでEnterキーを押した時にブロックを追加
        pageTitle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                
                // 最初のブロックを追加してフォーカス
                this.addBlock('text', '');
            }
        });
        
        // ブロック追加
        document.getElementById('add-block-btn').addEventListener('click', () => {
            console.log('Add block button clicked, currentPageId:', this.currentPageId);
            this.addBlock('text', '');
        });
        
        // テーマ切り替え
        document.getElementById('theme-toggle').addEventListener('click', () => {
            this.toggleTheme();
        });
        
        // スラッシュコマンド
        this.setupSlashCommand();
    }
    
    setupTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.updateThemeIcon(savedTheme);
    }
    
    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        this.updateThemeIcon(newTheme);
    }
    
    updateThemeIcon(theme) {
        const icon = document.querySelector('#theme-toggle i');
        icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
    
    async loadPages() {
        try {
            this.pages = await Storage.getPages();
            this.renderPageTree();
        } catch (error) {
            console.error('Failed to load pages:', error);
            this.pages = [];
        }
    }
    
    async createNewPage(parentId = null) {
        try {
            const page = await API.createPage('無題', parentId);
            
            // APIレスポンスをフロントエンドの形式に変換
            const newPage = {
                id: page.id,
                title: page.title,
                parentId: page.parent_id,
                createdAt: page.created_at,
                updatedAt: page.updated_at
            };
            
            this.pages.push(newPage);
            this.renderPageTree();
            await this.selectPage(newPage.id);
            
            // タイトル入力にフォーカス
            setTimeout(() => {
                document.getElementById('page-title').focus();
                document.getElementById('page-title').select();
            }, 100);
        } catch (error) {
            console.error('Failed to create new page:', error);
        }
    }
    
    async selectPage(pageId) {
        this.currentPageId = pageId;
        const page = this.pages.find(p => p.id === pageId);
        
        if (page) {
            document.getElementById('page-title').value = page.title;
            await this.loadBlocks();
            this.renderPageTree();
        }
    }
    
    renderPageTree() {
        const container = document.getElementById('page-tree');
        container.innerHTML = '';
        
        const renderPage = (page, level = 0) => {
            const pageItem = document.createElement('div');
            pageItem.className = 'page-item';
            if (page.id === this.currentPageId) {
                pageItem.classList.add('active');
            }
            pageItem.style.paddingLeft = `${level * 16 + 8}px`;
            
            pageItem.innerHTML = `
                <i class="fas fa-file-alt page-item-icon"></i>
                <span class="page-item-title">${page.title || '無題'}</span>
            `;
            
            pageItem.addEventListener('click', () => {
                this.selectPage(page.id);
            });
            
            container.appendChild(pageItem);
            
            // 子ページをレンダリング
            const children = this.pages.filter(p => p.parentId === page.id);
            children.forEach(child => renderPage(child, level + 1));
        };
        
        // ルートページをレンダリング
        const rootPages = this.pages.filter(p => !p.parentId);
        rootPages.forEach(page => renderPage(page));
    }
    
    async loadBlocks() {
        try {
            this.blocks = await Storage.getBlocks(this.currentPageId);
            this.renderBlocks();
        } catch (error) {
            console.error('Failed to load blocks:', error);
            this.blocks = [];
            this.renderBlocks();
        }
    }
    
    async saveBlocks() {
        // APIでは個別に更新するため、このメソッドは使用しない
        // 必要に応じてバッチ更新APIを実装可能
    }
    
    async addBlock(type, content = '', index = null) {
        console.log('addBlock called:', { type, content, index, currentPageId: this.currentPageId });
        
        if (!this.currentPageId) {
            console.error('No current page ID, cannot add block');
            return;
        }
        
        try {
            const order = index !== null ? index : this.blocks.length;
            console.log('Creating block with order:', order);
            console.log('API object exists:', typeof API !== 'undefined');
            console.log('API.createBlock exists:', typeof API.createBlock === 'function');
            const newBlock = await API.createBlock(this.currentPageId, type, content, order);
            console.log('Block created successfully:', newBlock);
            
            const block = {
                id: newBlock.id,
                type: newBlock.type,
                content: newBlock.content,
                order: newBlock.order_index,
                checked: newBlock.checked === 1
            };
            
            if (index !== null) {
                this.blocks.splice(index, 0, block);
                // 順序を更新
                this.blocks.forEach((b, i) => b.order = i);
                // 順序の更新をAPIに送信
                await this.updateBlocksOrder();
            } else {
                this.blocks.push(block);
            }
            
            this.renderBlocks();
            console.log('Blocks after adding:', this.blocks.length);
            
            // 新しいブロックにフォーカス
            setTimeout(() => {
                const newBlockElement = document.querySelector(`[data-block-id="${block.id}"]`);
                if (newBlockElement) {
                    const editableElement = newBlockElement.querySelector('[contenteditable]');
                    if (editableElement) {
                        editableElement.focus();
                        // カーソルを最初に移動
                        const range = document.createRange();
                        const selection = window.getSelection();
                        range.selectNodeContents(editableElement);
                        range.collapse(true);
                        selection.removeAllRanges();
                        selection.addRange(range);
                    }
                }
            }, 50);
        } catch (error) {
            console.error('Failed to add block:', error);
            console.error('Error details:', error.message);
        }
    }
    
    async updateBlock(blockId, content) {
        const block = this.blocks.find(b => b.id === blockId);
        if (block) {
            block.content = content;
            try {
                await API.updateBlock(blockId, { content });
            } catch (error) {
                console.error('Failed to update block:', error);
            }
        }
    }
    
    async deleteBlock(blockId) {
        const index = this.blocks.findIndex(b => b.id === blockId);
        if (index >= 0) {
            try {
                await API.deleteBlock(blockId);
                this.blocks.splice(index, 1);
                // 順序を更新
                this.blocks.forEach((b, i) => b.order = i);
                await this.updateBlocksOrder();
                this.renderBlocks();
            } catch (error) {
                console.error('Failed to delete block:', error);
            }
        }
    }
    
    async updateBlocksOrder() {
        try {
            const blocksForReorder = this.blocks.map(b => ({ id: b.id }));
            await API.reorderBlocks(this.currentPageId, blocksForReorder);
        } catch (error) {
            console.error('Failed to update blocks order:', error);
        }
    }
    
    renderBlocks() {
        const container = document.getElementById('editor-container');
        console.log('renderBlocks called, container:', container);
        console.log('Blocks to render:', this.blocks.length);
        
        if (!container) {
            console.error('Editor container not found!');
            return;
        }
        
        container.innerHTML = '';
        
        this.blocks.forEach((block, index) => {
            console.log('Rendering block:', block.id, block.type);
            const blockElement = this.createBlockElement(block);
            container.appendChild(blockElement);
        });
        
        console.log('Blocks rendered, container children:', container.children.length);
        
        // ドラッグ＆ドロップの設定
        this.setupDragAndDrop();
    }
    
    createBlockElement(block) {
        console.log('createBlockElement called for:', block.id, block.type);
        const blockDiv = document.createElement('div');
        blockDiv.className = 'block';
        blockDiv.setAttribute('data-block-id', block.id);
        blockDiv.draggable = true;
        
        // ブロックタイプ変更ボタン（左側）
        const typeActions = document.createElement('div');
        typeActions.className = 'block-type-actions';
        typeActions.innerHTML = `
            <button class="btn-icon block-type-btn" data-block-id="${block.id}" title="ブロックタイプを変更">
                ${this.getBlockTypeIcon(block.type)}
            </button>
        `;
        
        // ブロックタイプ変更ボタンのイベントリスナー
        const typeBtn = typeActions.querySelector('button');
        typeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.showBlockTypeMenu(e, block.id);
        });
        
        const content = document.createElement('div');
        content.className = 'block-content';
        
        const actions = document.createElement('div');
        actions.className = 'block-actions';
        actions.innerHTML = `
            <button class="btn-icon" data-block-id="${block.id}" title="削除">
                <i class="fas fa-trash"></i>
            </button>
        `;
        
        // 削除ボタンのイベントリスナー
        const deleteBtn = actions.querySelector('button');
        deleteBtn.addEventListener('click', () => this.deleteBlock(block.id));
        
        let editableElement;
        
        switch (block.type) {
            case 'heading1':
                editableElement = document.createElement('h1');
                editableElement.className = 'block-heading1';
                editableElement.contentEditable = true;
                editableElement.textContent = block.content;
                break;
                
            case 'heading2':
                editableElement = document.createElement('h2');
                editableElement.className = 'block-heading2';
                editableElement.contentEditable = true;
                editableElement.textContent = block.content;
                break;
                
            case 'heading3':
                editableElement = document.createElement('h3');
                editableElement.className = 'block-heading3';
                editableElement.contentEditable = true;
                editableElement.textContent = block.content;
                break;
                
            case 'bullet':
                editableElement = document.createElement('div');
                editableElement.className = 'block-bullet';
                editableElement.contentEditable = true;
                editableElement.textContent = block.content;
                break;
                
            case 'numbered':
                editableElement = document.createElement('div');
                editableElement.className = 'block-numbered';
                editableElement.contentEditable = true;
                editableElement.textContent = block.content;
                break;
                
            case 'todo':
                editableElement = document.createElement('div');
                editableElement.className = 'block-todo';
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.className = 'todo-checkbox';
                checkbox.checked = block.checked || false;
                checkbox.addEventListener('change', async (e) => {
                    block.checked = e.target.checked;
                    todoContent.classList.toggle('completed', e.target.checked);
                    try {
                        await API.updateBlock(block.id, { checked: e.target.checked });
                    } catch (error) {
                        console.error('Failed to update todo status:', error);
                    }
                });
                
                const todoContent = document.createElement('div');
                todoContent.className = 'todo-content';
                todoContent.contentEditable = true;
                todoContent.textContent = block.content;
                if (block.checked) {
                    todoContent.classList.add('completed');
                }
                
                editableElement.appendChild(checkbox);
                editableElement.appendChild(todoContent);
                
                let todoUpdateTimer;
                todoContent.addEventListener('input', () => {
                    clearTimeout(todoUpdateTimer);
                    todoUpdateTimer = setTimeout(() => {
                        this.updateBlock(block.id, todoContent.textContent);
                    }, 300);
                });
                break;
                
            case 'code':
                editableElement = document.createElement('pre');
                editableElement.className = 'block-code';
                editableElement.contentEditable = true;
                editableElement.textContent = block.content;
                break;
                
            case 'quote':
                editableElement = document.createElement('blockquote');
                editableElement.className = 'block-quote';
                editableElement.contentEditable = true;
                editableElement.textContent = block.content;
                break;
                
            case 'divider':
                editableElement = document.createElement('hr');
                editableElement.className = 'block-divider';
                break;
                
            default: // text
                editableElement = document.createElement('div');
                editableElement.className = 'block-text';
                editableElement.contentEditable = true;
                editableElement.textContent = block.content;
                console.log('Created text editable element:', editableElement);
        }
        
        console.log('editableElement after switch:', editableElement);
        
        // コンテンツ編集イベント
        if (editableElement && editableElement.contentEditable === 'true' && block.type !== 'todo') {
            let updateTimer;
            editableElement.addEventListener('input', () => {
                // デバウンスしてAPIコールを減らす
                clearTimeout(updateTimer);
                updateTimer = setTimeout(() => {
                    this.updateBlock(block.id, editableElement.textContent);
                }, 300);
                
                // スラッシュメニューを閉じる
                if (!editableElement.textContent.endsWith('/')) {
                    this.hideSlashMenu();
                }
            });
            
            // キーボードイベント
            editableElement.addEventListener('keydown', (e) => {
                // スラッシュコマンドの検出
                if (e.key === '/' && editableElement.textContent === '') {
                    const selection = window.getSelection();
                    const range = selection.getRangeAt(0);
                    const rect = range.getBoundingClientRect();
                    
                    setTimeout(() => {
                        if (editableElement.textContent === '/') {
                            this.showSlashMenu(rect.left, rect.bottom, block.id);
                        }
                    }, 10);
                }
                
                // Enter キーでブロック追加
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    const blockIndex = this.blocks.findIndex(b => b.id === block.id);
                    this.addBlock('text', '', blockIndex + 1);
                }
                
                // Backspace でブロック削除
                if (e.key === 'Backspace' && editableElement.textContent === '') {
                    e.preventDefault();
                    const blockIndex = this.blocks.findIndex(b => b.id === block.id);
                    if (blockIndex > 0) {
                        this.deleteBlock(block.id);
                        // 前のブロックにフォーカス
                        setTimeout(() => {
                            const blocks = document.querySelectorAll('.block');
                            if (blocks[blockIndex - 1]) {
                                const prevEditable = blocks[blockIndex - 1].querySelector('[contenteditable]');
                                if (prevEditable) {
                                    prevEditable.focus();
                                    // カーソルを最後に移動
                                    const range = document.createRange();
                                    const selection = window.getSelection();
                                    range.selectNodeContents(prevEditable);
                                    range.collapse(false);
                                    selection.removeAllRanges();
                                    selection.addRange(range);
                                }
                            }
                        }, 50);
                    } else if (blockIndex === 0 && this.blocks.length === 1) {
                        // 最後のブロックの場合は削除せずに内容をクリア
                        editableElement.textContent = '';
                        this.updateBlock(block.id, '');
                    }
                }
            });
        }
        
        // To-doブロックのキーボードイベント
        if (block.type === 'todo') {
            const todoContent = editableElement.querySelector('.todo-content');
            if (todoContent) {
                todoContent.addEventListener('keydown', (e) => {
                    // Enter キーでブロック追加
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        const blockIndex = this.blocks.findIndex(b => b.id === block.id);
                        this.addBlock('text', '', blockIndex + 1);
                    }
                    
                    // Backspace でブロック削除
                    if (e.key === 'Backspace' && todoContent.textContent === '') {
                        e.preventDefault();
                        const blockIndex = this.blocks.findIndex(b => b.id === block.id);
                        if (blockIndex > 0) {
                            this.deleteBlock(block.id);
                            // 前のブロックにフォーカス
                            setTimeout(() => {
                                const blocks = document.querySelectorAll('.block');
                                if (blocks[blockIndex - 1]) {
                                    const prevEditable = blocks[blockIndex - 1].querySelector('[contenteditable]');
                                    if (prevEditable) {
                                        prevEditable.focus();
                                        // カーソルを最後に移動
                                        const range = document.createRange();
                                        const selection = window.getSelection();
                                        range.selectNodeContents(prevEditable);
                                        range.collapse(false);
                                        selection.removeAllRanges();
                                        selection.addRange(range);
                                    }
                                }
                            }, 50);
                        }
                    }
                });
            }
        }
        
        content.appendChild(typeActions);
        if (editableElement) {
            console.log('Appending editableElement to content:', editableElement);
            content.appendChild(editableElement);
        } else {
            console.error('No editableElement to append for block:', block.id, block.type);
        }
        content.appendChild(actions);
        
        blockDiv.appendChild(content);
        
        console.log('Block element created:', blockDiv);
        console.log('Block content HTML:', blockDiv.innerHTML);
        return blockDiv;
    }
    
    setupSlashCommand() {
        const slashMenu = document.getElementById('slash-menu');
        
        // メニューアイテムのクリックイベント
        document.querySelectorAll('.slash-menu-item').forEach(item => {
            item.addEventListener('click', () => {
                const blockType = item.getAttribute('data-block-type');
                const currentBlockId = window.currentSlashBlockId;
                
                if (currentBlockId) {
                    const blockIndex = this.blocks.findIndex(b => b.id === currentBlockId);
                    const block = this.blocks[blockIndex];
                    
                    if (block) {
                        // スラッシュを削除
                        const editable = document.querySelector(`[data-block-id="${currentBlockId}"] [contenteditable]`);
                        if (editable) {
                            const content = editable.textContent.slice(0, -1);
                            // コンテンツを保持してブロックタイプを変更
                            block.type = blockType;
                            block.content = content;
                            
                            // APIに更新を送信
                            API.updateBlock(block.id, { type: blockType, content }).then(() => {
                                this.renderBlocks();
                            }).catch(error => {
                                console.error('Failed to change block type:', error);
                            });
                            
                            // フォーカスを戻す
                            setTimeout(() => {
                                const newEditable = document.querySelector(`[data-block-id="${currentBlockId}"] [contenteditable]`);
                                if (newEditable) {
                                    newEditable.focus();
                                    // カーソルを最後に移動
                                    const range = document.createRange();
                                    const selection = window.getSelection();
                                    range.selectNodeContents(newEditable);
                                    range.collapse(false);
                                    selection.removeAllRanges();
                                    selection.addRange(range);
                                }
                            }, 50);
                        }
                    }
                }
                
                this.hideSlashMenu();
            });
        });
        
        // メニュー外クリックで閉じる
        document.addEventListener('click', (e) => {
            if (!slashMenu.contains(e.target) && !e.target.closest('[contenteditable]')) {
                this.hideSlashMenu();
            }
        });
        
        // ブロックタイプメニューのイベントリスナー
        this.setupBlockTypeMenu();
    }
    
    showSlashMenu(x, y, blockId) {
        const slashMenu = document.getElementById('slash-menu');
        slashMenu.style.left = `${x}px`;
        slashMenu.style.top = `${y + 5}px`;
        slashMenu.style.display = 'block';
        
        // 現在のブロックIDを保存
        window.currentSlashBlockId = blockId;
    }
    
    hideSlashMenu() {
        const slashMenu = document.getElementById('slash-menu');
        slashMenu.style.display = 'none';
        window.currentSlashBlockId = null;
    }
    
    setupDragAndDrop() {
        let draggedBlock = null;
        let draggedBlockId = null;
        
        document.querySelectorAll('.block').forEach(block => {
            block.addEventListener('dragstart', (e) => {
                draggedBlock = block;
                draggedBlockId = block.getAttribute('data-block-id');
                block.classList.add('dragging');
            });
            
            block.addEventListener('dragend', () => {
                block.classList.remove('dragging');
                draggedBlock = null;
                draggedBlockId = null;
            });
            
            block.addEventListener('dragover', (e) => {
                e.preventDefault();
                if (draggedBlock && draggedBlock !== block) {
                    block.classList.add('drag-over');
                }
            });
            
            block.addEventListener('dragleave', () => {
                block.classList.remove('drag-over');
            });
            
            block.addEventListener('drop', (e) => {
                e.preventDefault();
                block.classList.remove('drag-over');
                
                if (draggedBlock && draggedBlock !== block) {
                    const draggedIndex = this.blocks.findIndex(b => b.id === draggedBlockId);
                    const targetId = block.getAttribute('data-block-id');
                    const targetIndex = this.blocks.findIndex(b => b.id === targetId);
                    
                    if (draggedIndex >= 0 && targetIndex >= 0) {
                        // ブロックを移動
                        const [removed] = this.blocks.splice(draggedIndex, 1);
                        this.blocks.splice(targetIndex, 0, removed);
                        
                        // 順序を更新
                        this.blocks.forEach((b, i) => b.order = i);
                        
                        // APIに順序更新を送信
                        this.updateBlocksOrder().then(() => {
                            this.renderBlocks();
                        }).catch(error => {
                            console.error('Failed to reorder blocks:', error);
                        });
                    }
                }
            });
        });
    }
    
    getBlockTypeIcon(type) {
        const icons = {
            'text': '<i class="fas fa-align-left"></i>',
            'heading1': '<i class="fas fa-heading"></i>',
            'heading2': '<i class="fas fa-heading"></i>',
            'heading3': '<i class="fas fa-heading"></i>',
            'bullet': '<i class="fas fa-list"></i>',
            'numbered': '<i class="fas fa-list-ol"></i>',
            'todo': '<i class="fas fa-check-square"></i>',
            'code': '<i class="fas fa-code"></i>',
            'quote': '<i class="fas fa-quote-left"></i>',
            'divider': '<i class="fas fa-minus"></i>'
        };
        return icons[type] || icons['text'];
    }
    
    showBlockTypeMenu(event, blockId) {
        console.log('showBlockTypeMenu called with blockId:', blockId);
        const menu = document.getElementById('block-type-menu');
        const rect = event.target.getBoundingClientRect();
        
        // メニューの位置を調整
        menu.style.left = `${rect.left - 10}px`;
        menu.style.top = `${rect.bottom + 5}px`;
        menu.style.display = 'block';
        
        // 現在のブロックIDを保存
        window.currentTypeChangeBlockId = blockId;
        
        // 現在のブロックタイプをハイライト
        const block = this.blocks.find(b => b.id === blockId);
        if (block) {
            const items = menu.querySelectorAll('.block-type-menu-item');
            items.forEach(item => {
                item.classList.remove('selected');
                if (item.getAttribute('data-block-type') === block.type) {
                    item.classList.add('selected');
                }
            });
        }
        
        console.log('Block type menu should be visible now');
    }
    
    hideBlockTypeMenu() {
        const menu = document.getElementById('block-type-menu');
        menu.style.display = 'none';
        window.currentTypeChangeBlockId = null;
    }
    
    setupBlockTypeMenu() {
        const menu = document.getElementById('block-type-menu');
        
        // メニューアイテムのクリックイベント
        menu.querySelectorAll('.block-type-menu-item').forEach(item => {
            item.addEventListener('click', async () => {
                const blockType = item.getAttribute('data-block-type');
                const blockId = window.currentTypeChangeBlockId;
                
                if (blockId) {
                    await this.changeBlockType(blockId, blockType);
                }
                
                this.hideBlockTypeMenu();
            });
        });
        
        // メニュー外クリックで閉じる
        document.addEventListener('click', (e) => {
            if (!menu.contains(e.target) && !e.target.closest('.block-type-btn')) {
                this.hideBlockTypeMenu();
            }
        });
    }
    
    async changeBlockType(blockId, newType) {
        const block = this.blocks.find(b => b.id === blockId);
        if (block && block.type !== newType) {
            const oldContent = block.content;
            
            // ブロックタイプを変更
            block.type = newType;
            
            try {
                await API.updateBlock(blockId, { type: newType });
                this.renderBlocks();
                
                // 変更後のブロックにフォーカス
                setTimeout(() => {
                    const blockElement = document.querySelector(`[data-block-id="${blockId}"]`);
                    if (blockElement) {
                        const editable = blockElement.querySelector('[contenteditable]');
                        if (editable) {
                            editable.focus();
                            // カーソルを最後に移動
                            const range = document.createRange();
                            const selection = window.getSelection();
                            range.selectNodeContents(editable);
                            range.collapse(false);
                            selection.removeAllRanges();
                            selection.addRange(range);
                        }
                    }
                }, 50);
            } catch (error) {
                console.error('Failed to change block type:', error);
                // エラー時は元に戻す
                block.type = block.type;
            }
        }
    }
    
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
}

// アプリケーションを初期化
let app;
window.addEventListener('DOMContentLoaded', () => {
    app = new App();
    window.app = app; // グローバルアクセス用
});