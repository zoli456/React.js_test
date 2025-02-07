import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/items';

function App() {
    const [items, setItems] = useState([]);
    const [newItem, setNewItem] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    const showMessage = (msg, type) => {
        setMessage(msg);
        setMessageType(type);
        setTimeout(() => {
            setMessage('');
            setMessageType('');
        }, 3000);
    };

    fetch('/api/data')
        .then(res => res.json())
        .then(data => console.log(data));

    // Fetch items from the server
    const fetchItems = useCallback(async () => {
        try {
            const response = await axios.get(API_URL);
            setItems(response.data);
        } catch (error) {
            showMessage('Failed to fetch items.', 'error');
        }
    }, []); // Empty dependency array since no dependencies are needed

    useEffect(() => {
        fetchItems(); // Call fetchItems when the component mounts
    }, [fetchItems]);

    // Handle adding a new item
    const handleAddItem = async () => {
        if (newItem.trim() === '') {
            showMessage('Please enter a valid item.', 'error');
            return;
        }

        try {
            const response = await axios.post(API_URL, { text: newItem });
            setItems([response.data, ...items]); // Add the new item to the list
            setNewItem('');
            showMessage('Item added successfully!', 'success');
        } catch (error) {
            showMessage('Failed to add item.', 'error');
        }
    };

    // Handle deleting an item
    const handleDeleteItem = async (id) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
            setItems(items.filter((item) => item.id !== id));
            showMessage('Item deleted successfully.', 'success');
        } catch (error) {
            showMessage('Failed to delete item.', 'error');
        }
    };

    // Handle editing an item
    const handleEditItem = (id, text) => {
        setEditingId(id);
        setEditText(text);
        showMessage('You can now edit the item.', 'info');
    };

    // Save the edited item
    const handleSaveEdit = async () => {
        if (editText.trim() === '') {
            showMessage('Edited text cannot be empty.', 'error');
            return;
        }

        try {
            await axios.put(`${API_URL}/${editingId}`, { text: editText });
            setItems(items.map((item) => (item.id === editingId ? { ...item, text: editText } : item)));
            setEditingId(null);
            setEditText('');
            showMessage('Item updated successfully!', 'success');
        } catch (error) {
            showMessage('Failed to update item.', 'error');
        }
    };

    // Cancel editing
    const handleCancelEdit = () => {
        setEditingId(null);
        setEditText('');
        showMessage('Edit canceled.', 'info');
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1>React + MySQL Item List</h1>

            {/* Message Box */}
            {message && (
                <div
                    style={{
                        padding: '10px',
                        marginBottom: '15px',
                        color: messageType === 'success' ? 'green' : messageType === 'error' ? 'red' : 'blue',
                        backgroundColor:
                            messageType === 'success'
                                ? '#d4edda'
                                : messageType === 'error'
                                    ? '#f8d7da'
                                    : '#d1ecf1',
                        borderRadius: '5px',
                        border: `1px solid ${
                            messageType === 'success'
                                ? '#c3e6cb'
                                : messageType === 'error'
                                    ? '#f5c6cb'
                                    : '#bee5eb'
                        }`,
                    }}
                >
                    {message}
                </div>
            )}

            {/* Item List */}
            <ul>
                {items.map((item) => (
                    <li key={item.id} style={{ marginBottom: '10px' }}>
                        {editingId === item.id ? (
                            <>
                                <input
                                    type="text"
                                    value={editText}
                                    onChange={(e) => setEditText(e.target.value)}
                                    style={{ marginRight: '10px' }}
                                />
                                <button onClick={handleSaveEdit}>Save</button>
                                <button onClick={handleCancelEdit} style={{ marginLeft: '5px' }}>
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <>
                                <span>{item.text}</span>
                                <button onClick={() => handleEditItem(item.id, item.text)} style={{ marginLeft: '10px' }}>
                                    Edit
                                </button>
                                <button onClick={() => handleDeleteItem(item.id)} style={{ marginLeft: '5px' }}>
                                    Delete
                                </button>
                            </>
                        )}
                    </li>
                ))}
            </ul>

            {/* Add Item */}
            <div style={{ marginTop: '20px' }}>
                <input
                    type="text"
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    placeholder="Add a new item"
                    style={{ marginRight: '10px' }}
                />
                <button onClick={handleAddItem}>Add</button>
            </div>
        </div>
    );
}

export default App;
