const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// ================= CRUD APIs =================

// Get all users

app.get('/', async (req, res) => {
    res.status(200).json({ message: 'Hello world' });
    console.log("Hello...");
})
app.get('/api/users', async (req, res) => {
    try {
        const { data, error } = await supabase.from('users').select('*');
        if (error) throw error;
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get user by ID
app.get('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', id)
        if (error) throw error;
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Create a new user
app.post('/api/users', async (req, res) => {
    const { name, email } = req.body;
    try {
        const { data, error } = await supabase.from('users').insert([{ name, email }]).select();
        if (error) throw error;
        res.status(201).json(data[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update user by ID
app.put('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;
    try {
        const { data, error } = await supabase.from('users').update({ name, email }).eq('id', id).select();
        if (error) throw error;
        res.json(data[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete user by ID
app.delete('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const { data, error } = await supabase.from('users').delete().eq('id', id).select();
        if (error) throw error;
        res.json({ message: 'User deleted', user: data[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
