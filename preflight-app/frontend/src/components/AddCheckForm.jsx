import React, { useState } from 'react';

function AddCheckForm({ onAdd }) {
    const [description, setDescription] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (description.trim()) {
            onAdd(description);
            setDescription('');
        }
    };

    return (
        <form className="add-check-form" onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="New check description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <button type="submit">Add Check</button>
        </form>
    );
}

export default AddCheckForm;
