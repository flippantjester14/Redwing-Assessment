import React from 'react';
import CheckItem from './CheckItem';

function Checklist({ checks, onUpdate, onDelete }) {
    if (checks.length === 0) {
        return <p className="empty-state">No checks found. Add one above.</p>;
    }

    return (
        <div className="checklist">
            <div className="checklist-header">
                <span>Description</span>
                <span>Status</span>
                <span>Comments</span>
                <span>Actions</span>
            </div>
            {checks.map(check => (
                <CheckItem
                    key={check.id}
                    check={check}
                    onUpdate={onUpdate}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}

export default Checklist;
