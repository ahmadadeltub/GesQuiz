import React from 'react';
import { Quiz, QuizAttempt, QuestionType } from '../../../types';
import { mockDbService } from '../../../services/mockDbService';
import { Modal } from '../../common/Modal';

const AnalyticsBar: React.FC<{ percent: number }> = ({ percent }) => (
    <div className="w-full bg-gray-200 rounded-full h-4">
        <div className="bg-green-500 h-4 rounded-full" style={{ width: `${percent}%` }}></div>
    </div>
);

export const QuizAnalyticsModal: React.FC<{ quiz: Quiz; onClose: () => void }> = ({ quiz, onClose }) => {
    const attempts = mockDbService.getAttemptsByQuiz(quiz.id);
    const attemptsCount = attempts.length;

    const getQuestionStats = () => {
        return quiz.questions.map(question => {
            let correctCount = 0;
            attempts.forEach(attempt => {
                const answer = attempt.answers.find(a => a.questionId === question.id);
                if (!answer) return;

                if (question.type === QuestionType.DRAG_AND_DROP) {
                    // For DnD, we can consider it "correct" if all mappings are perfect
                    if(answer.mapping && question.correctMapping) {
                        const isPerfect = Object.keys(question.correctMapping).every(
                            key => question.correctMapping![parseInt(key)] === answer.mapping![parseInt(key)]
                        );
                        if(isPerfect) correctCount++;
                    }
                } else {
                    if (answer.isCorrect) {
                        correctCount++;
                    }
                }
            });
            return {
                id: question.id,
                text: question.questionText,
                correctPercent: attemptsCount > 0 ? (correctCount / attemptsCount) * 100 : 0,
            };
        });
    };

    const questionStats = getQuestionStats();
    const averageScore = attempts.reduce((sum, a) => sum + (a.score / a.maxScore), 0) / (attemptsCount || 1) * 100;

    return (
        <Modal title={`Analytics for "${quiz.title}"`} onClose={onClose} size="xl">
            {attemptsCount > 0 ? (
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="bg-gray-100 p-4 rounded-lg">
                            <p className="text-sm text-gray-600">Total Attempts</p>
                            <p className="text-3xl font-bold">{attemptsCount}</p>
                        </div>
                        <div className="bg-gray-100 p-4 rounded-lg">
                            <p className="text-sm text-gray-600">Average Score</p>
                            <p className="text-3xl font-bold">{averageScore.toFixed(1)}%</p>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-semibold text-lg mb-2">Question Breakdown</h4>
                        <div className="space-y-3">
                            {questionStats.map(stat => (
                                <div key={stat.id} className="p-3 bg-gray-50 rounded-md">
                                    <p className="font-medium text-gray-800">{stat.text}</p>
                                    <div className="flex items-center gap-4 mt-1">
                                        <AnalyticsBar percent={stat.correctPercent} />
                                        <span className="font-semibold text-sm w-16 text-right">{stat.correctPercent.toFixed(0)}%</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <p className="text-center text-gray-500 py-10">There are no attempts for this quiz yet.</p>
            )}
        </Modal>
    );
};
