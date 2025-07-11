const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database setup
const db = new sqlite3.Database('./notion.db');

// Create tables if they don't exist
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS pages (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            parent_id TEXT,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
        )
    `);
    
    db.run(`
        CREATE TABLE IF NOT EXISTS blocks (
            id TEXT PRIMARY KEY,
            page_id TEXT NOT NULL,
            type TEXT NOT NULL,
            content TEXT,
            order_index INTEGER NOT NULL,
            checked INTEGER DEFAULT 0,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE
        )
    `);
});

// API Routes

// Get all pages
app.get('/api/pages', (req, res) => {
    db.all('SELECT * FROM pages ORDER BY created_at DESC', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Get single page
app.get('/api/pages/:id', (req, res) => {
    db.get('SELECT * FROM pages WHERE id = ?', [req.params.id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ error: 'Page not found' });
            return;
        }
        res.json(row);
    });
});

// Create new page
app.post('/api/pages', (req, res) => {
    const { title, parentId } = req.body;
    const id = uuidv4();
    const now = new Date().toISOString();
    
    db.run(
        'INSERT INTO pages (id, title, parent_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?)',
        [id, title || '無題', parentId || null, now, now],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({
                id,
                title: title || '無題',
                parent_id: parentId || null,
                created_at: now,
                updated_at: now
            });
        }
    );
});

// Update page
app.put('/api/pages/:id', (req, res) => {
    const { title } = req.body;
    const now = new Date().toISOString();
    
    db.run(
        'UPDATE pages SET title = ?, updated_at = ? WHERE id = ?',
        [title, now, req.params.id],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            if (this.changes === 0) {
                res.status(404).json({ error: 'Page not found' });
                return;
            }
            res.json({ id: req.params.id, title, updated_at: now });
        }
    );
});

// Delete page
app.delete('/api/pages/:id', (req, res) => {
    db.run('DELETE FROM pages WHERE id = ?', [req.params.id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ error: 'Page not found' });
            return;
        }
        res.json({ message: 'Page deleted successfully' });
    });
});

// Get blocks for a page
app.get('/api/pages/:pageId/blocks', (req, res) => {
    db.all(
        'SELECT * FROM blocks WHERE page_id = ? ORDER BY order_index',
        [req.params.pageId],
        (err, rows) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json(rows);
        }
    );
});

// Create new block
app.post('/api/pages/:pageId/blocks', (req, res) => {
    const { type, content, order, checked } = req.body;
    const id = uuidv4();
    const now = new Date().toISOString();
    
    db.run(
        'INSERT INTO blocks (id, page_id, type, content, order_index, checked, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [id, req.params.pageId, type, content || '', order || 0, checked ? 1 : 0, now, now],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({
                id,
                page_id: req.params.pageId,
                type,
                content: content || '',
                order_index: order || 0,
                checked: checked ? 1 : 0,
                created_at: now,
                updated_at: now
            });
        }
    );
});

// Update block
app.put('/api/blocks/:id', (req, res) => {
    const { type, content, order, checked } = req.body;
    const now = new Date().toISOString();
    
    let updateFields = [];
    let values = [];
    
    if (type !== undefined) {
        updateFields.push('type = ?');
        values.push(type);
    }
    if (content !== undefined) {
        updateFields.push('content = ?');
        values.push(content);
    }
    if (order !== undefined) {
        updateFields.push('order_index = ?');
        values.push(order);
    }
    if (checked !== undefined) {
        updateFields.push('checked = ?');
        values.push(checked ? 1 : 0);
    }
    
    updateFields.push('updated_at = ?');
    values.push(now);
    values.push(req.params.id);
    
    db.run(
        `UPDATE blocks SET ${updateFields.join(', ')} WHERE id = ?`,
        values,
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            if (this.changes === 0) {
                res.status(404).json({ error: 'Block not found' });
                return;
            }
            res.json({ message: 'Block updated successfully' });
        }
    );
});

// Delete block
app.delete('/api/blocks/:id', (req, res) => {
    db.run('DELETE FROM blocks WHERE id = ?', [req.params.id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ error: 'Block not found' });
            return;
        }
        res.json({ message: 'Block deleted successfully' });
    });
});

// Batch update blocks order
app.put('/api/pages/:pageId/blocks/reorder', (req, res) => {
    const { blocks } = req.body;
    const now = new Date().toISOString();
    
    db.serialize(() => {
        db.run('BEGIN TRANSACTION');
        
        const stmt = db.prepare('UPDATE blocks SET order_index = ?, updated_at = ? WHERE id = ?');
        
        blocks.forEach((block, index) => {
            stmt.run(index, now, block.id);
        });
        
        stmt.finalize();
        
        db.run('COMMIT', (err) => {
            if (err) {
                db.run('ROLLBACK');
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ message: 'Blocks reordered successfully' });
        });
    });
});

// Serve static files
app.use(express.static(path.join(__dirname, 'client')));

// Serve index.html for root path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

// Catch-all handler for SPA routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});