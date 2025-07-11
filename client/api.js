// API configuration
const API_BASE_URL = 'http://localhost:3001/api';

class API {
    // Pages API
    static async getPages() {
        try {
            const response = await fetch(`${API_BASE_URL}/pages`);
            if (!response.ok) throw new Error('Failed to fetch pages');
            return await response.json();
        } catch (error) {
            console.error('Error fetching pages:', error);
            throw error;
        }
    }
    
    static async getPage(pageId) {
        try {
            const response = await fetch(`${API_BASE_URL}/pages/${pageId}`);
            if (!response.ok) throw new Error('Failed to fetch page');
            return await response.json();
        } catch (error) {
            console.error('Error fetching page:', error);
            throw error;
        }
    }
    
    static async createPage(title, parentId = null) {
        try {
            const response = await fetch(`${API_BASE_URL}/pages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, parentId })
            });
            if (!response.ok) throw new Error('Failed to create page');
            return await response.json();
        } catch (error) {
            console.error('Error creating page:', error);
            throw error;
        }
    }
    
    static async updatePage(pageId, title) {
        try {
            const response = await fetch(`${API_BASE_URL}/pages/${pageId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title })
            });
            if (!response.ok) throw new Error('Failed to update page');
            return await response.json();
        } catch (error) {
            console.error('Error updating page:', error);
            throw error;
        }
    }
    
    static async deletePage(pageId) {
        try {
            const response = await fetch(`${API_BASE_URL}/pages/${pageId}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Failed to delete page');
            return await response.json();
        } catch (error) {
            console.error('Error deleting page:', error);
            throw error;
        }
    }
    
    // Blocks API
    static async getBlocks(pageId) {
        try {
            const response = await fetch(`${API_BASE_URL}/pages/${pageId}/blocks`);
            if (!response.ok) throw new Error('Failed to fetch blocks');
            return await response.json();
        } catch (error) {
            console.error('Error fetching blocks:', error);
            throw error;
        }
    }
    
    static async createBlock(pageId, type, content = '', order = 0, checked = false) {
        try {
            console.log('API createBlock called with:', { pageId, type, content, order, checked });
            const response = await fetch(`${API_BASE_URL}/pages/${pageId}/blocks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ type, content, order, checked })
            });
            console.log('API response status:', response.status);
            if (!response.ok) {
                const errorText = await response.text();
                console.error('API error response:', errorText);
                throw new Error(`Failed to create block: ${response.status} ${errorText}`);
            }
            const result = await response.json();
            console.log('API createBlock result:', result);
            return result;
        } catch (error) {
            console.error('Error creating block:', error);
            throw error;
        }
    }
    
    static async updateBlock(blockId, updates) {
        try {
            const response = await fetch(`${API_BASE_URL}/blocks/${blockId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updates)
            });
            if (!response.ok) throw new Error('Failed to update block');
            return await response.json();
        } catch (error) {
            console.error('Error updating block:', error);
            throw error;
        }
    }
    
    static async deleteBlock(blockId) {
        try {
            const response = await fetch(`${API_BASE_URL}/blocks/${blockId}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Failed to delete block');
            return await response.json();
        } catch (error) {
            console.error('Error deleting block:', error);
            throw error;
        }
    }
    
    static async reorderBlocks(pageId, blocks) {
        try {
            const response = await fetch(`${API_BASE_URL}/pages/${pageId}/blocks/reorder`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ blocks })
            });
            if (!response.ok) throw new Error('Failed to reorder blocks');
            return await response.json();
        } catch (error) {
            console.error('Error reordering blocks:', error);
            throw error;
        }
    }
}

// Export for use in script.js
window.API = API;
console.log('API object attached to window:', window.API);