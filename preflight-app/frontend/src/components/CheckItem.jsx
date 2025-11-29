import React, { useState } from 'react';

function CheckItem({ check, onUpdate, onDelete }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editDescription, setEditDescription] = useState(check.description);

    const handleStatusChange = (e) => {
        onUpdate(check.id, { status: e.target.value });
    };

    const handleCommentChange = (e) => {
        onUpdate(check.id, { comment: e.target.value }); // Auto-save comment on blur or change? Let's do onBlur for perf, or just onChange
    };

    const handleSaveDescription = () => {
        if (editDescription.trim()) {
            onUpdate(check.id, { description: editDescription });
            setIsEditing(false);
        }
    };

    return (
        <div className={`check-item ${check.status.toLowerCase()}`}>
            <div className="check-description">
                {isEditing ? (
                    <div className="edit-mode">
                        <input
                            type="text"
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                        />
                        <button onClick={handleSaveDescription}>Save</button>
                        <button onClick={() => setIsEditing(false)}>Cancel</button>
                    </div>
                ) : (
                    <span onClick={() => setIsEditing(true)} title="Click to edit">
                        {check.description}
                    </span>
                )}
            </div>

            <div className="check-status">
                <select value={check.status} onChange={handleStatusChange}>
                    <option value="Pending">Pending</option>
                    <option value="Passed">Passed</option>
                    <option value="Failed">Failed</option>
                </select>
            </div>

            <div className="check-comment">
                <input
                    type="text"
                    placeholder="Add comment..."
                    value={check.comment}
                    onChange={handleCommentChange}
                />
            </div>

            <div className="check-actions">
                <button className="delete-btn" onClick={() => onDelete(check.id)}>
                    &times;
                </button>
            </div>
        </div>
    );
}

export default CheckItem;
