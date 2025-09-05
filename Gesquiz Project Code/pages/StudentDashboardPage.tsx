import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { mockDbService } from '../services/mockDbService';
import { Quiz, QuizAttempt, Assignment, Class, User } from '../types';
import { Link } from 'react-router-dom';
import { Leaderboard } from '../components/common/Leaderboard';
import { StudentProgressChart } from '../components/student/StudentProgressChart';
import { useTranslation } from '../i18n';

type QuizData = {
    quiz: Quiz;
    assignment: Assignment;
    attempt?: QuizAttempt;
};

const floatingIcons = [
    { icon: '👍', style: { top: '15%', left: '5%', animationDelay: '1s', fontSize: '4rem' } },
    { icon: '🖐️', style: { top: '40%', left: '90%', animationDelay: '2.5s', fontSize: '6rem' } },
    { icon: '✌️', style: { top: '65%', left: '10%', animationDelay: '4s', fontSize: '5rem' } },
    { icon: '✊', style: { top: '5%', left: '80%', animationDelay: '5.5s', fontSize: '4.5rem' } },
    { icon: '👍', style: { top: '80%', left: '55%', animationDelay: '3s', fontSize: '5.5rem' } },
    { icon: '🖐️', style: { top: '2%', left: '35%', animationDelay: '6s', fontSize: '3.5rem' } },
];

// --- Icon and Stat Card Components --- //
const CheckCircleIconDetailed = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const ChartPieIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>;
const PencilSquareIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>;
const TrophyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V22"/><path d="M14 14.66V22"/><path d="M17 5v8.67a1 1 0 0 1-.83.98L12 16l-4.17-1.35a1 1 0 0 1-.83-.98V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2z"/></svg>;


const StatCard: React.FC<{ icon: React.ReactNode; title: string; value: number | string; }> = ({ icon, title, value }) => (
    <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/50 transform transition-transform hover:-translate-y-1">
        <div className="flex justify-between items-center">
            <p className="text-gray-600 text-lg font-medium">{title}</p>
            <div className="text-primary">{icon}</div>
        </div>
        <p className="text-4xl font-extrabold text-gray-900 mt-2">{value}</p>
    </div>
);

interface QuizCardProps {
    data: QuizData;
    isArchivedByStudent: boolean;
    onArchiveToggle: (quizId: string) => void;
}

const QuizCard: React.FC<QuizCardProps> = ({ data, isArchivedByStudent, onArchiveToggle }) => {
    const { quiz, assignment, attempt } = data;
    const isCompleted = !!attempt;
    const now = Date.now();
    const isAvailable = assignment.availableFrom <= now;
    const isScheduled = !isCompleted && !isAvailable;

    let cardStyle = 'bg-white';
    let statusText = 'To Do';
    let statusStyle = 'bg-primary-light/20 text-primary-dark';
    if (isCompleted) {
        cardStyle = 'bg-green-50/70 border-green-200';
        statusText = 'Completed';
        statusStyle = 'bg-green-100 text-green-800';
    } else if (isScheduled) {
        cardStyle = 'bg-yellow-50/70 border-yellow-200';
        statusText = 'Scheduled';
        statusStyle = 'bg-yellow-100 text-yellow-800';
    }

    return (
        <div className={`p-6 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 border ${cardStyle} flex flex-col ${isArchivedByStudent ? 'opacity-60 bg-gray-100' : ''}`}>
            {/* Info Section */}
            <div className="flex-grow">
                <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full mb-3 ${statusStyle}`}>{statusText}</span>
                <h3 className="text-xl font-bold text-gray-900">{quiz.title}</h3>
                <p className="text-gray-500 text-sm mt-1 mb-2">{quiz.questions.length} questions</p>

                {isCompleted && attempt && (
                    <div className="mt-3 text-sm space-y-1">
                        <p className="font-semibold text-green-800">Score: {attempt.score}/{attempt.maxScore}</p>
                        <p className="text-gray-600">Completed: {new Date(attempt.completedAt).toLocaleDateString()}</p>
                    </div>
                )}
                {isScheduled && (
                    <div className="mt-3 text-sm text-yellow-800 font-medium">
                       Available on: {new Date(assignment.availableFrom).toLocaleString()}
                   </div>
                )}
            </div>

            {/* Action Section */}
            <div className="mt-auto pt-4 border-t border-gray-200/60">
                {!isCompleted && isAvailable && (
                    <Link to={`/quiz/${quiz.id}`} className="w-full text-center bg-gradient-to-r from-primary to-primary-dark text-white font-bold py-3 px-6 rounded-xl hover:shadow-lg hover:from-primary-dark transition shadow-md transform hover:-translate-y-0.5 inline-block">
                        Start Quiz
                    </Link>
                )}
                 {isCompleted && attempt && (
                     <div className="flex flex-col gap-2">
                        <Link to={`/review/${attempt.id}`} className="w-full text-center bg-secondary text-white font-semibold py-3 px-6 rounded-xl hover:bg-secondary-dark transition text-base inline-block">
                            View Report
                        </Link>
                         <button onClick={() => onArchiveToggle(quiz.id)} className="w-full text-center bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-xl hover:bg-gray-300 transition text-sm">
                            {isArchivedByStudent ? 'Unarchive' : 'Archive'}
                         </button>
                    </div>
                )}
                {isScheduled && (
                     <div className="text-yellow-600 font-bold flex items-center justify-center p-3 bg-yellow-100 rounded-xl">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 me-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" /></svg>
                        Scheduled
                    </div>
                )}
            </div>
        </div>
    )
};

export const StudentDashboardPage: React.FC = () => {
    const { user } = useAuth();
    const { t } = useTranslation();
    const [quizzesData, setQuizzesData] = useState<QuizData[]>([]);
    const [allQuizzes, setAllQuizzes] = useState<Quiz[]>([]);
    const [allAttempts, setAllAttempts] = useState<QuizAttempt[]>([]);
    const [studentsByClass, setStudentsByClass] = useState<Record<string, User[]>>({});
    const [classCode, setClassCode] = useState('');
    const [joinMessage, setJoinMessage] = useState({ text: '', type: '' });
    const [showMyArchived, setShowMyArchived] = useState(false);
    const [studentArchivedQuizIds, setStudentArchivedQuizIds] = useState<string[]>([]);

    const fetchData = () => {
        if (user) {
            const studentClasses = mockDbService.getClassesByIds(user.classIds || []);
            const studentQuizzes = mockDbService.getQuizzesForStudent(user.id);
            const studentAttempts = mockDbService.getAttemptsByStudent(user.id);
            setAllAttempts(studentAttempts);

            // Fetch all quizzes in the org to get titles for the progress chart
            const orgId = user.organizationId;
            if (orgId) {
                setAllQuizzes(mockDbService.getAllQuizzes(orgId));
            }

            const combinedData = studentQuizzes.map(({ quiz, assignment }) => ({
                quiz,
                assignment,
                attempt: studentAttempts.find(a => a.quizId === quiz.id),
            }));
            setQuizzesData(combinedData);
            setStudentArchivedQuizIds(mockDbService.getStudentArchivedQuizIds(user.id));

            const studentDataByClass: Record<string, User[]> = {};
            studentClasses.forEach(c => {
                studentDataByClass[c.id] = mockDbService.getStudentsByClassId(c.id);
            });
            setStudentsByClass(studentDataByClass);
        }
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);
    
    const { visibleQuizzes, myArchivedQuizzes } = useMemo(() => {
        const visible = quizzesData.filter(d => !studentArchivedQuizIds.includes(d.quiz.id));
        const archived = quizzesData.filter(d => studentArchivedQuizIds.includes(d.quiz.id));
        return {
            visibleQuizzes,
            myArchivedQuizzes,
        };
    }, [quizzesData, studentArchivedQuizIds]);

    const stats = useMemo(() => {
        const completedQuizzes = quizzesData.filter(d => !!d.attempt).length;
        if (!user) return { completedQuizzes: 0, totalQuizzes: 0, points: 0, averageScore: 'N/A' };

        const totalQuizzes = quizzesData.length;
        const averageScore = completedQuizzes > 0
            ? quizzesData.reduce((acc, curr) => {
                if (curr.attempt && curr.attempt.maxScore > 0) {
                    return acc + (curr.attempt.score / curr.attempt.maxScore * 100);
                }
                return acc;
            }, 0) / completedQuizzes
            : 0;

        return {
            completedQuizzes,
            totalQuizzes,
            points: user.points || 0,
            averageScore: completedQuizzes > 0 ? averageScore.toFixed(0) + '%' : 'N/A'
        };
    }, [quizzesData, user]);

    const handleJoinClass = (e: React.FormEvent) => {
        e.preventDefault();
        if (!classCode.trim() || !user) return;
        const result = mockDbService.joinClass(classCode.trim(), user.id);
        if (result.class) {
            setJoinMessage({ text: `Successfully joined ${result.class.name}!`, type: 'success' });
            fetchData();
        } else {
            setJoinMessage({ text: result.error || 'Failed to join class.', type: 'error' });
        }
        setClassCode('');
        setTimeout(() => setJoinMessage({ text: '', type: '' }), 5000);
    };

    const handleArchiveToggle = (quizId: string) => {
        if (!user) return;
        mockDbService.toggleArchiveForStudent(user.id, quizId);
        fetchData();
    };

    const allStudentsInClasses = useMemo(() => {
        const allStudentsMap = new Map<string, User>();
        Object.values(studentsByClass).flat().forEach(student => {
            allStudentsMap.set(student.id, student);
        });
        return Array.from(allStudentsMap.values());
    }, [studentsByClass]);

    return (
        <div className="bg-gray-100 min-h-screen relative overflow-hidden">
            <div className="absolute inset-0 z-0">
                {floatingIcons.map((item, index) => (
                    <span key={index} className="absolute float-icon opacity-10" style={item.style}>{item.icon}</span>
                ))}
            </div>

            <div className="container mx-auto p-4 md:p-8 relative z-10">
                <header className="mb-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">{t('student_dashboard')}</h1>
                    <p className="text-lg text-gray-600 mt-2">{t('student_welcome', { name: user?.firstName })}</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <StatCard icon={<PencilSquareIcon />} title={t('quizzes_to_do')} value={quizzesData.length - stats.completedQuizzes} />
                    <StatCard icon={<CheckCircleIconDetailed />} title={t('quizzes_completed')} value={stats.completedQuizzes} />
                    <StatCard icon={<ChartPieIcon />} title={t('average_score')} value={stats.averageScore} />
                    <StatCard icon={<TrophyIcon />} title={t('total_points')} value={stats.points} />
                </div>
                
                <section className="mb-12">
                    <StudentProgressChart attempts={allAttempts} quizzes={allQuizzes} />
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <main className="lg:col-span-2 space-y-12">
                        <section>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('my_quizzes_student')}</h2>
                            {visibleQuizzes.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {visibleQuizzes.map(d => (
                                        <QuizCard key={d.quiz.id} data={d} isArchivedByStudent={false} onArchiveToggle={handleArchiveToggle} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center p-10 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50">
                                    <p className="text-gray-500">{t('no_active_quizzes')}</p>
                                </div>
                            )}
                        </section>
                        
                        {showMyArchived && myArchivedQuizzes.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-bold text-gray-800 mb-4">Archived Quizzes</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {myArchivedQuizzes.map(d => (
                                        <QuizCard key={d.quiz.id} data={d} isArchivedByStudent={true} onArchiveToggle={handleArchiveToggle} />
                                    ))}
                                </div>
                            </section>
                        )}
                    </main>

                    <aside className="space-y-8">
                        <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/50">
                            <h3 className="text-xl font-bold text-gray-800 mb-3">{t('join_new_class')}</h3>
                            <form onSubmit={handleJoinClass} className="space-y-3">
                                <input
                                    type="text"
                                    value={classCode}
                                    onChange={e => setClassCode(e.target.value.toUpperCase())}
                                    placeholder={t('enter_class_code')}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    aria-label="Class Code Input"
                                />
                                <button type="submit" className="w-full bg-primary text-white font-semibold py-2 rounded-lg hover:bg-primary-dark transition">
                                    {t('join_class')}
                                </button>
                                {joinMessage.text && (
                                    <p role="alert" className={`text-sm text-center font-medium ${joinMessage.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                                        {joinMessage.text}
                                    </p>
                                )}
                            </form>
                        </div>
                        
                        <Leaderboard students={allStudentsInClasses} currentUserId={user?.id} />

                        <div className="bg-white/70 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-white/50">
                            <label className="flex items-center justify-between cursor-pointer">
                                <span className="font-semibold text-gray-700">{t('show_my_archived_quizzes')}</span>
                                <div className="relative">
                                    <input type="checkbox" checked={showMyArchived} onChange={e => setShowMyArchived(e.target.checked)} className="sr-only peer" />
                                    <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-primary transition-colors"></div>
                                    <div className="absolute start-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-full"></div>
                                </div>
                            </label>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};
