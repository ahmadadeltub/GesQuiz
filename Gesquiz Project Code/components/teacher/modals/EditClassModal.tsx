import React, { useState } from 'react';
import { Class } from '../../../types';
import { Modal } from '../../common/Modal';

interface EditClassModalProps {
    classItem: Class;
    onClose: () => void;
    onSave: (id: string, name: string) => void;
}

export const EditClassModal: React.FC<EditClassModalProps> = ({ classItem, onClose, onSave }) => {
    const [className, setClassName] = useState(classItem.name);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (className.trim()) {
            onSave(classItem.id, className.trim());
            onClose();
        }
    };

    return (
        <Modal title={`Edit Class: ${classItem.name}`} onClose={onClose} size="md">
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
                        className="w-full px-3 py-2 border rounded-lg"
                        autoFocus
                        required
                    />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                    <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg">
                        Cancel
                    </button>
                    <button type="submit" className="bg-primary text-white px-6 py-2 rounded-lg">
                        Save Changes
                    </button>
                </div>
            </form>
        </Modal>
    );
};
