import React, { useState } from 'react';
import { Quiz, NewQuestion, QuestionType, User } from '../../../types';
import { Modal } from '../../common/Modal';

// --- Icon Components --- //
const PlusIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" /></svg>);
const TrashIcon: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-5 w-5 mr-3"} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg>;


const getNewQuestionTemplate = (): NewQuestion => ({
    questionText: '',
    type: QuestionType.MULTIPLE_CHOICE,
    options: ['', '', '', ''],
    correctAnswerIndex: 0,
    items: ['', ''],
    targets: ['', ''],
    correctMapping: {},
});

interface QuizEditorModalProps {
    mode: 'create' | 'edit';
    initialQuiz?: Quiz;
    initialTitle?: string; // For AI generation
    initialQuestions?: NewQuestion[]; // For AI generation
    user: User;
    onClose: () => void;
    onSave: (data: any) => void;
}

export const QuizEditorModal: React.FC<QuizEditorModalProps> = ({ mode, initialQuiz, initialTitle, initialQuestions, user, onClose, onSave }) => {
    const [title, setTitle] = useState(initialQuiz?.title || initialTitle || '');
    const [questions, setQuestions] = useState<NewQuestion[]>(initialQuiz?.questions || initialQuestions || [getNewQuestionTemplate()]);

    const handleQuestionChange = (qIndex: number, field: keyof NewQuestion, value: any) => {
        setQuestions(prev => {
            const newQuestions = [...prev];
            const q = { ...newQuestions[qIndex] };

            if (field === 'type') {
                q.type = value;
                if (value === QuestionType.TRUE_FALSE) {
                    q.options = ['True', 'False'];
                    q.correctAnswerIndex = 0;
                } else if (value === QuestionType.MULTIPLE_CHOICE) {
                    q.options = ['', '', '', ''];
                }
            } else if (field === 'options') {
                const { optIndex, optValue } = value;
                q.options![optIndex] = optValue;
            } else if (field === 'items' || field === 'targets') {
                const { index, val } = value;
                (q as any)[field][index] = val;
            } else {
                (q as any)[field] = value;
            }

            newQuestions[qIndex] = q;
            return newQuestions;
        });
    };

    const handleMappingChange = (qIndex: number, itemIndex: number, targetIndex: string) => {
        setQuestions(prev => {
            const newQuestions = [...prev];
            const q = { ...newQuestions[qIndex] };
            if (!q.correctMapping) q.correctMapping = {};
            q.correctMapping[itemIndex] = parseInt(targetIndex);
            newQuestions[qIndex] = q;
            return newQuestions;
        })
    }

    const addRemoveDndField = (qIndex: number, field: 'items' | 'targets', action: 'add' | 'remove', index?: number) => {
        setQuestions(prev => {
            const newQuestions = [...prev];
            const q = { ...newQuestions[qIndex] };
            const currentFields = q[field] ? [...q[field]!] : [];
            if (action === 'add') {
                currentFields.push('');
            } else if (action === 'remove' && index !== undefined && currentFields.length > 2) {
                currentFields.splice(index, 1);
            }
            (q as any)[field] = currentFields;
            newQuestions[qIndex] = q;
            return newQuestions;
        });
    };

    const addQuestion = () => setQuestions(prev => [...prev, getNewQuestionTemplate()]);
    const removeQuestion = (index: number) => { if (questions.length > 1) setQuestions(prev => prev.filter((_, i) => i !== index)); };

    const handleSaveClick = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Add validation
        if (mode === 'create') {
            onSave({ title, questions });
        } else if (mode === 'edit' && initialQuiz) {
            onSave({ quizId: initialQuiz.id, data: { title, questions } });
        }
    };

    return (
        <Modal title={mode === 'create' ? 'Create New Quiz' : `Edit Quiz: ${initialQuiz?.title}`} onClose={onClose} size="xl">
            <form onSubmit={handleSaveClick} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quiz Title</label>
                    <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full px-3 py-2 border rounded-lg" placeholder="e.g., World Capitals" required />
                </div>
                <div className="space-y-4">
                    {questions.map((q, qIndex) => (
                        <div key={qIndex} className="p-4 border rounded-lg bg-gray-50 relative space-y-3">
                            {questions.length > 1 && (
                                <button type="button" onClick={() => removeQuestion(qIndex)} className="absolute top-2 right-2 text-red-500 hover:text-red-700" aria-label={`Remove question ${qIndex + 1}`}><TrashIcon className="h-5 w-5" /></button>
                            )}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Question {qIndex + 1}</label>
                                <input type="text" value={q.questionText} onChange={e => handleQuestionChange(qIndex, 'questionText', e.target.value)} className="w-full px-3 py-2 border rounded-lg" placeholder="e.g., What is the capital of France?" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Question Type</label>
                                <select value={q.type} onChange={e => handleQuestionChange(qIndex, 'type', e.target.value as QuestionType)} className="w-full px-3 py-2 border rounded-lg bg-white">
                                    <option value={QuestionType.MULTIPLE_CHOICE}>Multiple Choice</option>
                                    <option value={QuestionType.TRUE_FALSE}>True / False</option>
                                    <option value={QuestionType.DRAG_AND_DROP}>Drag and Drop</option>
                                </select>
                            </div>

                            {q.type === QuestionType.DRAG_AND_DROP ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Items */}
                                    <div className="space-y-2">
                                        <label className="font-medium text-sm">Draggable Items</label>
                                        {q.items?.map((item, iIndex) => (
                                            <div key={iIndex} className="flex items-center gap-2">
                                                <span className="font-mono text-sm">{String.fromCharCode(65 + iIndex)}:</span>
                                                <input type="text" value={item} onChange={(e) => handleQuestionChange(qIndex, 'items', { index: iIndex, val: e.target.value })} className="w-full px-2 py-1 border rounded-md text-sm" placeholder={`Item ${iIndex + 1}`} required />
                                                <button type="button" onClick={() => addRemoveDndField(qIndex, 'items', 'remove', iIndex)} className="text-red-500 hover:text-red-700 disabled:opacity-50" disabled={(q.items?.length || 0) <= 2} aria-label={`Remove item ${iIndex + 1}`}>&times;</button>
                                            </div>
                                        ))}
                                        <button type="button" onClick={() => addRemoveDndField(qIndex, 'items', 'add')} className="text-xs text-blue-600 hover:underline">+ Add Item</button>
                                    </div>
                                    {/* Targets */}
                                    <div className="space-y-2">
                                        <label className="font-medium text-sm">Drop Targets</label>
                                        {q.targets?.map((target, tIndex) => (
                                            <div key={tIndex} className="flex items-center gap-2">
                                                <span className="font-mono text-sm">{String.fromCharCode(65 + tIndex)}:</span>
                                                <input type="text" value={target} onChange={(e) => handleQuestionChange(qIndex, 'targets', { index: tIndex, val: e.target.value })} className="w-full px-2 py-1 border rounded-md text-sm" placeholder={`Target ${tIndex + 1}`} required />
                                                <button type="button" onClick={() => addRemoveDndField(qIndex, 'targets', 'remove', tIndex)} className="text-red-500 hover:text-red-700 disabled:opacity-50" disabled={(q.targets?.length || 0) <= 2} aria-label={`Remove target ${tIndex + 1}`}>&times;</button>
                                            </div>
                                        ))}
                                        <button type="button" onClick={() => addRemoveDndField(qIndex, 'targets', 'add')} className="text-xs text-blue-600 hover:underline">+ Add Target</button>
                                    </div>
                                    {/* Mapping */}
                                    <div className="md:col-span-2 space-y-2 border-t pt-3">
                                        <label className="font-medium text-sm">Correct Mappings</label>
                                        {q.items?.map((item, itemIndex) => (
                                            <div key={itemIndex} className="flex items-center gap-2">
                                                <span className="font-semibold w-1/3 truncate">{item || `Item ${itemIndex + 1}`}</span>
                                                <span>&rarr;</span>
                                                <select value={q.correctMapping?.[itemIndex] ?? ''} onChange={(e) => handleMappingChange(qIndex, itemIndex, e.target.value)} className="w-2/3 p-1 border rounded bg-white text-sm">
                                                    <option value="" disabled>Select target...</option>
                                                    {q.targets?.map((target, targetIndex) => (
                                                        <option key={targetIndex} value={targetIndex}>{target || `Target ${targetIndex + 1}`}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-2">
                                    {q.options?.map((opt, optIndex) => (
                                        <div key={optIndex} className="flex items-center">
                                            <input type="radio" name={`correctAnswer-${qIndex}`} checked={q.correctAnswerIndex === optIndex} onChange={() => handleQuestionChange(qIndex, 'correctAnswerIndex', optIndex)} className="h-4 w-4 text-primary focus:ring-primary-light border-gray-300" />
                                            <input type="text" value={opt} onChange={e => handleQuestionChange(qIndex, 'options', { optIndex: optIndex, optValue: e.target.value })} disabled={q.type === QuestionType.TRUE_FALSE} className="ml-2 w-full px-2 py-1 border rounded-md text-sm disabled:bg-gray-200" placeholder={`Option ${String.fromCharCode(65 + optIndex)}`} required />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                <div className="flex justify-between items-center">
                    <button type="button" onClick={addQuestion} className="bg-green-100 text-green-700 px-4 py-2 rounded-lg hover:bg-green-200 transition text-sm font-medium flex items-center gap-1"><PlusIcon /> Add Question</button>
                    <div className="flex gap-3">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg">Cancel</button>
                        <button type="submit" className="bg-primary text-white px-6 py-2 rounded-lg">{mode === 'create' ? 'Save Quiz' : 'Save Changes'}</button>
                    </div>
                </div>
            </form>
        </Modal>
    )
}
