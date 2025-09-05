import React, { useState } from 'react';
import { Quiz, Class } from '../../../types';
import { Modal } from '../../common/Modal';

interface AssignQuizModalProps {
    quiz: Quiz;
    classes: Class[];
    onClose: () => void;
    onAssign: (classIds: string[], availableFrom: number) => void;
}

export const AssignQuizModal: React.FC<AssignQuizModalProps> = ({ quiz, classes, onClose, onAssign }) => {
    const [selectedClassIds, setSelectedClassIds] = useState<string[]>([]);
    const [schedule, setSchedule] = useState('now');
    const [scheduleDate, setScheduleDate] = useState('');
    const [scheduleTime, setScheduleTime] = useState('');

    const handleClassToggle = (classId: string) => {
        setSelectedClassIds(prev =>
            prev.includes(classId) ? prev.filter(id => id !== classId) : [...prev, classId]
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedClassIds.length === 0) return;

        let availableFrom = Date.now();
        if (schedule === 'later' && scheduleDate && scheduleTime) {
            availableFrom = new Date(`${scheduleDate}T${scheduleTime}`).getTime();
        }

        onAssign(selectedClassIds, availableFrom);
        onClose();
    };

    return (
        <Modal title={`Assign Quiz: ${quiz.title}`} onClose={onClose}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Select Classes</h4>
                    <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 border rounded-lg">
                        {classes.length > 0 ? (
                            classes.map(c => (
                                <label key={c.id} className="flex items-center p-2 rounded-md hover:bg-gray-100 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedClassIds.includes(c.id)}
                                        onChange={() => handleClassToggle(c.id)}
                                        className="h-4 w-4 text-primary focus:ring-primary-light border-gray-300 rounded"
                                    />
                                    <span className="ml-2 text-gray-800">{c.name}</span>
                                </label>
                            ))
                        ) : (
                            <p className="text-gray-500 col-span-2 text-center">No unassigned classes available.</p>
                        )}
                    </div>
                </div>

                <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Schedule Assignment</h4>
                    <div className="flex gap-4">
                        <label><input type="radio" name="schedule" value="now" checked={schedule === 'now'} onChange={e => setSchedule(e.target.value)} /> Assign Now</label>
                        <label><input type="radio" name="schedule" value="later" checked={schedule === 'later'} onChange={e => setSchedule(e.target.value)} /> Schedule for Later</label>
                    </div>
                    {schedule === 'later' && (
                        <div className="grid grid-cols-2 gap-4 mt-2 p-3 bg-gray-50 rounded-lg">
                            <input type="date" value={scheduleDate} onChange={e => setScheduleDate(e.target.value)} className="w-full border rounded p-2" required />
                            <input type="time" value={scheduleTime} onChange={e => setScheduleTime(e.target.value)} className="w-full border rounded p-2" required />
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-3 pt-2">
                    <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg">Cancel</button>
                    <button type="submit" className="bg-primary text-white px-6 py-2 rounded-lg" disabled={selectedClassIds.length === 0}>Assign</button>
                </div>
            </form>
        </Modal>
    );
};
