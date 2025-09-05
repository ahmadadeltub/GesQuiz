import React, { useMemo } from 'react';
import { User } from '../../types';
import { useTranslation } from '../../i18n';

const TrophyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V22"/><path d="M14 14.66V22"/><path d="M17 5v8.67a1 1 0 0 1-.83.98L12 16l-4.17-1.35a1 1 0 0 1-.83-.98V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2z"/></svg>;

interface LeaderboardProps {
    students: User[];
    currentUserId?: string;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ students, currentUserId }) => {
    const { t } = useTranslation();
    const sortedStudents = useMemo(() => {
        return [...students].sort((a, b) => (b.points || 0) - (a.points || 0));
    }, [students]);

    return (
        <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/50 h-full">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <TrophyIcon /> {t('leaderboard')}
            </h3>
             {sortedStudents.length > 0 ? (
                <ol className="space-y-3">
                    {sortedStudents.slice(0, 10).map((student, index) => {
                        const isCurrentUser = student.id === currentUserId;
                        const rank = index + 1;
                        let rankColor = 'bg-gray-200 text-gray-700';
                        if (rank === 1) rankColor = 'bg-yellow-400 text-yellow-900';
                        else if (rank === 2) rankColor = 'bg-gray-300 text-gray-800';
                        else if (rank === 3) rankColor = 'bg-yellow-600/70 text-white';

                        return (
                            <li key={student.id} className={`flex items-center p-3 rounded-lg transition ${isCurrentUser ? 'bg-blue-100 scale-105 shadow-md' : 'bg-white'}`}>
                                <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold me-4 ${rankColor}`}>
                                    {rank}
                                </span>
                                <span className="font-semibold text-gray-800 flex-grow truncate">
                                    {student.firstName} {student.lastName}
                                </span>
                                <span className="font-bold text-blue-600">{student.points || 0} pts</span>
                            </li>
                        );
                    })}
                </ol>
             ) : (
                <div className="flex items-center justify-center h-48">
                    <p className="text-gray-500">No student data to rank yet.</p>
                </div>
             )}
        </div>
    )
}
