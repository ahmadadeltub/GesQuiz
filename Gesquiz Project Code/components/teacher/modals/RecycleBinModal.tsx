import React, { useState, useEffect, useCallback } from 'react';
import { mockDbService } from '../../../services/mockDbService';
import { User, Class, Quiz } from '../../../types';
import { Modal } from '../../common/Modal';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';

export const RecycleBinModal: React.FC<{ user: User; onClose: () => void; onUpdate: () => void }> = ({ user, onClose, onUpdate }) => {
    const [deletedContent, setDeletedContent] = useState<{ deletedClasses: Class[], deletedQuizzes: Quiz[] }>({ deletedClasses: [], deletedQuizzes: [] });
    const [itemToPermanentlyDelete, setItemToPermanentlyDelete] = useState<{ type: 'class' | 'quiz' | 'all', id?: string, name: string } | null>(null);

    const fetchDeleted = useCallback(() => {
        setDeletedContent(mockDbService.getDeletedContent(user.id));
    }, [user.id]);

    useEffect(() => {
        fetchDeleted();
    }, [fetchDeleted]);
    
    const handleRestore = (type: 'class' | 'quiz', id: string) => {
        if (type === 'class') mockDbService.restoreClass(id);
        else mockDbService.restoreQuiz(id);
        onUpdate();
        fetchDeleted();
    };

    const handlePermanentDeleteConfirm = () => {
        if (!itemToPermanentlyDelete) return;
        if (itemToPermanentlyDelete.type === 'all') {
            mockDbService.emptyRecycleBin(user.id);
        } else if (itemToPermanentlyDelete.type === 'class' && itemToPermanentlyDelete.id) {
            mockDbService.permanentlyDeleteClass(itemToPermanentlyDelete.id);
        } else if (itemToPermanentlyDelete.type === 'quiz' && itemToPermanentlyDelete.id) {
            mockDbService.permanentlyDeleteQuiz(itemToPermanentlyDelete.id);
        }
        setItemToPermanentlyDelete(null);
        onUpdate();
        fetchDeleted();
    };
    
    const hasContent = deletedContent.deletedClasses.length > 0 || deletedContent.deletedQuizzes.length > 0;

    return (
        <>
            <Modal title="Recycle Bin" onClose={onClose} size="lg">
                <div className="flex justify-between items-center mb-4">
                    <p className="text-sm text-gray-600">Items here will be permanently deleted after 30 days.</p>
                    <button
                        onClick={() => setItemToPermanentlyDelete({ type: 'all', name: 'all items in the bin' })}
                        disabled={!hasContent}
                        className="bg-red-600 text-white px-3 py-1 rounded-md text-sm font-semibold hover:bg-red-700 transition disabled:bg-red-300"
                    >
                        Empty Bin
                    </button>
                </div>

                <div className="space-y-4 max-h-96 overflow-y-auto">
                    <h4 className="font-semibold text-gray-700">Deleted Classes</h4>
                    {deletedContent.deletedClasses.length > 0 ? (
                        deletedContent.deletedClasses.map(c => (
                            <div key={c.id} className="flex justify-between items-center p-2 bg-gray-100 rounded">
                                <span>{c.name}</span>
                                <div className="space-x-2">
                                    <button onClick={() => handleRestore('class', c.id)} className="text-sm font-semibold text-green-600">Restore</button>
                                    <button onClick={() => setItemToPermanentlyDelete({ type: 'class', id: c.id, name: c.name })} className="text-sm font-semibold text-red-600">Delete Permanently</button>
                                </div>
                            </div>
                        ))
                    ) : <p className="text-sm text-gray-500">No deleted classes.</p>}
                    
                    <h4 className="font-semibold text-gray-700 pt-4 border-t">Deleted Quizzes</h4>
                    {deletedContent.deletedQuizzes.length > 0 ? (
                        deletedContent.deletedQuizzes.map(q => (
                             <div key={q.id} className="flex justify-between items-center p-2 bg-gray-100 rounded">
                                <span>{q.title}</span>
                                <div className="space-x-2">
                                    <button onClick={() => handleRestore('quiz', q.id)} className="text-sm font-semibold text-green-600">Restore</button>
                                    <button onClick={() => setItemToPermanentlyDelete({ type: 'quiz', id: q.id, name: q.title })} className="text-sm font-semibold text-red-600">Delete Permanently</button>
                                </div>
                            </div>
                        ))
                    ) : <p className="text-sm text-gray-500">No deleted quizzes.</p>}
                </div>
            </Modal>
            {itemToPermanentlyDelete && (
                <DeleteConfirmationModal
                    title="Confirm Permanent Deletion"
                    message={`Are you sure you want to permanently delete "${itemToPermanentlyDelete.name}"? This action cannot be undone.`}
                    onConfirm={handlePermanentDeleteConfirm}
                    onClose={() => setItemToPermanentlyDelete(null)}
                    confirmText="Yes, Delete Permanently"
                />
            )}
        </>
    );
};
