import React, { useState } from 'react';
import { mockDbService } from '../../../services/mockDbService';
import { User } from '../../../types';
import { Modal } from '../../common/Modal';

interface CreateClassModalProps {
    user: User;
    onClose: () => void;
    onClassCreated: () => void;
}

export const CreateClassModal: React.FC<CreateClassModalProps> = ({ user, onClose, onClassCreated }) => {
    const [className, setClassName] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (className.trim()) {
            mockDbService.createClass(className.trim(), user.id);
            onClassCreated();
            onClose();
        }
    };

    return (
        <Modal title="Create New Class" onClose={onClose} size="md">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="className" className="block text-sm font-medium text-gray-700 mb-1">
                        Class Name
                    </label>
                    <input
                        type="text"
                        id="className"
                        value={className}
                        onChange={e => setClassName(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="e.g., Grade 5 Science"
                        autoFocus
                        required
                    />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                    <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition">
                        Cancel
                    </button>
                    <button type="submit" className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition">
                        Create Class
                    </button>
                </div>
            </form>
        </Modal>
    );
};
