import React, { useState } from 'react';
import { geminiService } from '../../../services/geminiService';
import { NewQuestion } from '../../../types';
import { Modal } from '../../common/Modal';
import { Spinner } from '../../common/Spinner';

interface AIQuizGeneratorModalProps {
    onClose: () => void;
    onQuestionsGenerated: (questions: NewQuestion[], topic: string) => void;
}

const gradeLevels = ["1st Grade", "2nd Grade", "3rd Grade", "4th Grade", "5th Grade", "6th Grade", "7th Grade", "8th Grade", "9th Grade (High School)", "10th Grade (High School)", "11th Grade (High School)", "12th Grade (High School)", "University Level"];

export const AIQuizGeneratorModal: React.FC<AIQuizGeneratorModalProps> = ({ onClose, onQuestionsGenerated }) => {
    const [topic, setTopic] = useState('');
    const [numQuestions, setNumQuestions] = useState(5);
    const [gradeLevel, setGradeLevel] = useState('5th Grade');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!topic.trim()) {
            setError('Please enter a topic.');
            return;
        }
        setIsLoading(true);
        setError('');
        try {
            const questions = await geminiService.generateQuizQuestions(topic, numQuestions, gradeLevel);
            onQuestionsGenerated(questions, topic);
            onClose();
        } catch (err) {
            console.error(err);
            setError('Failed to generate questions. The AI might be busy. Please try again in a moment.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal title="✨ Generate Quiz with AI" onClose={onClose} size="md">
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && <div role="alert" className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">{error}</div>}
                <div>
                    <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1">
                        Topic
                    </label>
                    <input
                        type="text"
                        id="topic"
                        value={topic}
                        onChange={e => setTopic(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="e.g., The Solar System, World War II, Photosynthesis"
                        autoFocus
                        required
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="numQuestions" className="block text-sm font-medium text-gray-700 mb-1">
                            Number of Questions
                        </label>
                        <input
                            type="number"
                            id="numQuestions"
                            value={numQuestions}
                            onChange={e => setNumQuestions(Math.max(1, Math.min(10, parseInt(e.target.value, 10) || 1)))}
                            className="w-full px-3 py-2 border rounded-lg"
                            min="1"
                            max="10"
                        />
                    </div>
                    <div>
                        <label htmlFor="gradeLevel" className="block text-sm font-medium text-gray-700 mb-1">
                            Grade Level
                        </label>
                         <select
                            id="gradeLevel"
                            value={gradeLevel}
                            onChange={e => setGradeLevel(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg bg-white"
                        >
                            {gradeLevels.map(level => (
                                <option key={level} value={level}>{level}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                    <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition" disabled={isLoading}>
                        Cancel
                    </button>
                    <button type="submit" className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition flex items-center" disabled={isLoading}>
                        {isLoading ? <><Spinner size="sm" /> <span className="ml-2">Generating...</span></> : 'Generate Quiz'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};
