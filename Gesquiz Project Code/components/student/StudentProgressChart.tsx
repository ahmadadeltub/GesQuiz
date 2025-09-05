import React, { useMemo } from 'react';
import { Quiz, QuizAttempt } from '../../types';

interface StudentProgressChartProps {
    attempts: QuizAttempt[];
    quizzes: Quiz[];
}

const ChartBar: React.FC<{ percentage: number; label: string; score: number; maxScore: number; }> = ({ percentage, label, score, maxScore }) => (
    <div className="flex flex-col items-center w-full max-w-[60px] group">
        <div className="text-sm font-bold text-slate-600 mb-1">{percentage.toFixed(0)}%</div>
        <div
            className="w-4/5 bg-primary-light hover:bg-primary-dark transition-colors rounded-t-md relative"
            style={{ height: `${percentage > 0 ? (percentage / 100) * 150 : 2}px` }}
        >
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {score}/{maxScore}
            </div>
        </div>
        <div className="text-xs text-slate-500 mt-2 text-center break-words w-full truncate" title={label}>
            {label}
        </div>
    </div>
);

export const StudentProgressChart: React.FC<StudentProgressChartProps> = ({ attempts, quizzes }) => {
    const chartData = useMemo(() => {
        // Sort attempts by completion date and take the last 7
        const recentAttempts = [...attempts].sort((a, b) => a.completedAt - b.completedAt).slice(-7);

        return recentAttempts.map(attempt => {
            const quiz = quizzes.find(q => q.id === attempt.quizId);
            const percentage = attempt.maxScore > 0 ? (attempt.score / attempt.maxScore) * 100 : 0;
            return {
                id: attempt.id,
                label: quiz?.title || 'Unknown Quiz',
                percentage,
                score: attempt.score,
                maxScore: attempt.maxScore,
            };
        });
    }, [attempts, quizzes]);

    return (
        <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/50">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">My Recent Progress</h3>
            {chartData.length > 0 ? (
                <div className="flex justify-around items-end h-[220px] pt-4 border-t border-slate-200">
                    {chartData.map(data => (
                        <ChartBar key={data.id} {...data} />
                    ))}
                </div>
            ) : (
                <div className="flex items-center justify-center h-[220px] text-slate-500 border-t border-slate-200">
                    Complete some quizzes to see your progress here!
                </div>
            )}
        </div>
    );
};
