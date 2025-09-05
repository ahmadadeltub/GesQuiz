import React, { useState, useEffect, useMemo, useCallback, useRef, Fragment } from 'react';
import { useAuth } from '../hooks/useAuth';
import { mockDbService } from '../services/mockDbService';
import { Class, Quiz, NewQuestion, User, Assignment, QuizAttempt, QuestionType, Question, AnswerRecord } from '../types';
import { Leaderboard } from '../components/common/Leaderboard';
import { useNavigate } from 'react-router-dom';
import { CreateClassModal } from '../components/teacher/modals/CreateClassModal';
import { EditClassModal } from '../components/teacher/modals/EditClassModal';
import { QuizEditorModal } from '../components/teacher/modals/QuizEditorModal';
import { AIQuizGeneratorModal } from '../components/teacher/modals/AIQuizGeneratorModal';
import { AssignQuizModal } from '../components/teacher/modals/AssignQuizModal';
import { ManageStudentsModal } from '../components/teacher/modals/ManageStudentsModal';
import { QuizAnalyticsModal } from '../components/teacher/modals/QuizAnalyticsModal';
import { DeleteConfirmationModal } from '../components/teacher/modals/DeleteConfirmationModal';
import { RecycleBinModal } from '../components/teacher/modals/RecycleBinModal';
import { useTranslation } from '../i18n';


// --- Icon Components --- //
const PlusIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" /></svg>);
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.124-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.124-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const AcademicCapIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222 4 2.222V20" /></svg>;
const DocumentTextIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const ClipboardListIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>;
const ClipboardCheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>;
const ArchiveIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 me-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v8m0 0l3-3m-3 3L9 8m-5 5h14" /></svg>;
const PencilIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 me-3" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>;
const DuplicateIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 me-3" viewBox="0 0 20 20" fill="currentColor"><path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z" /><path d="M5 3a2 2 0 00-2 2v6a2 2 0 002 2V5h6a2 2 0 002-2H5z" /></svg>;
const TrashIcon: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-5 w-5 me-3"} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg>;
const RecycleBinIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
const MoreVerticalIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>;
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>;
const EyeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 me-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>;
const SparklesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0V6h-1a1 1 0 110-2h1V3a1 1 0 011-1zm5 10a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" clipRule="evenodd" /></svg>;


// --- Dropdown Menu Component --- //
const DropdownMenu: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const toggle = () => setIsOpen(!isOpen);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={menuRef}>
            <button onClick={toggle} className="p-2 rounded-full text-slate-500 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-primary">
                <MoreVerticalIcon />
            </button>
            {isOpen && (
                <div className="absolute end-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-10 origin-top-right">
                    <div className="py-1" role="menu" aria-orientation="vertical" onClick={() => setIsOpen(false)}>
                        {children}
                    </div>
                </div>
            )}
        </div>
    );
};

const DropdownItem: React.FC<{ onClick?: () => void; children: React.ReactNode; disabled?: boolean; className?: string }> = ({ onClick, children, disabled, className }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        role="menuitem"
        className={`w-full text-start px-4 py-2 text-sm flex items-center transition-colors ${
            disabled ? 'text-slate-400 cursor-not-allowed' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
        } ${className}`}
    >
        {children}
    </button>
);


// --- UI Components --- //
const StatCard: React.FC<{ icon: React.ReactNode; title: string; value: number | string; }> = ({ icon, title, value }) => (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center">
            <div className="p-3 rounded-lg bg-primary-light/20 text-primary-dark me-4">
                {icon}
            </div>
            <div>
                <p className="text-slate-500 text-sm font-medium">{title}</p>
                <p className="text-2xl font-bold text-slate-900">{value}</p>
            </div>
        </div>
    </div>
);
const ClassCard: React.FC<{ classItem: Class; onManageClick: () => void; onArchiveClick: () => void; onEditClick: () => void; onDeleteClick: () => void; }> = ({ classItem, onManageClick, onArchiveClick, onEditClick, onDeleteClick }) => {
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    useEffect(() => { setAssignments(mockDbService.getAssignmentsByClass(classItem.id)); }, [classItem.id]);
    const { t } = useTranslation();

    return (
        <div className={`bg-white p-5 rounded-xl shadow-sm transition-all duration-300 hover:shadow-lg border border-slate-200 flex flex-col ${classItem.isArchived ? 'opacity-60 bg-slate-50' : ''}`}>
             <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-lg text-slate-800 break-words w-4/5">{classItem.name}</h3>
                <DropdownMenu>
                    <DropdownItem onClick={onEditClick} disabled={!!classItem.isArchived}><PencilIcon /> Edit</DropdownItem>
                    <DropdownItem onClick={onArchiveClick}><ArchiveIcon/> {classItem.isArchived ? 'Unarchive' : 'Archive'}</DropdownItem>
                    <DropdownItem onClick={onDeleteClick} className="text-red-600 hover:bg-red-50"><TrashIcon/> Move to Bin</DropdownItem>
                </DropdownMenu>
             </div>
             {classItem.isArchived && <span className="absolute top-4 end-14 text-xs bg-slate-500 text-white font-bold px-2 py-1 rounded-full z-10">ARCHIVED</span>}
            <div className="flex items-center text-slate-500 text-sm space-x-4 mb-4">
                <span className="flex items-center gap-1.5"><UsersIcon /> {classItem.studentIds.length} Students</span>
                <span className="flex items-center gap-1.5"><ClipboardListIcon /> {assignments.length} Quizzes</span>
            </div>
            <div className="mb-4">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Class Code</span>
                <p className="font-mono text-base text-primary-dark bg-primary-light/20 p-2 rounded-lg text-center mt-1">{classItem.code}</p>
            </div>
            <button onClick={onManageClick} disabled={!!classItem.isArchived} className="mt-auto w-full bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-primary-dark transition disabled:opacity-50 disabled:cursor-not-allowed">
                {t('manage_class')}
            </button>
        </div>
    );
};
const QuizCard: React.FC<{ quiz: Quiz; onAssignClick: () => void; onAnalyticsClick: () => void; onArchiveClick: () => void; onEditClick: () => void; onDuplicateClick: () => void; onDeleteClick: () => void; hasClasses: boolean; onPreviewClick: () => void; }> = ({ quiz, onAssignClick, onAnalyticsClick, onArchiveClick, onEditClick, onDuplicateClick, onDeleteClick, hasClasses, onPreviewClick }) => {
    const [assignedClasses, setAssignedClasses] = useState<Class[]>([]);
    const { t } = useTranslation();
    
    useEffect(() => {
        const quizAssignments = mockDbService.getAssignmentsByQuiz(quiz.id);
        const classIds = quizAssignments.map(a => a.classId);
        setAssignedClasses(mockDbService.getClassesByIds(classIds));
    }, [quiz.id, quiz]);

    return (
        <div className={`bg-white p-5 rounded-xl shadow-sm transition-all duration-300 hover:shadow-lg border border-slate-200 flex flex-col ${quiz.isArchived ? 'opacity-60 bg-slate-50' : ''}`}>
            <div className="flex justify-between items-start mb-3">
                <div className="w-4/5">
                  <h3 className="font-bold text-lg text-slate-800 break-words">{quiz.title}</h3>
                  <p className="text-slate-500 text-sm">{quiz.questions.length} Questions</p>
                </div>
                <DropdownMenu>
                    <DropdownItem onClick={onPreviewClick}><EyeIcon /> Preview</DropdownItem>
                    <DropdownItem onClick={onEditClick} disabled={!!quiz.isArchived}><PencilIcon /> Edit</DropdownItem>
                    <DropdownItem onClick={onDuplicateClick} disabled={!!quiz.isArchived}><DuplicateIcon/> Duplicate</DropdownItem>
                    <DropdownItem onClick={onArchiveClick}><ArchiveIcon/> {quiz.isArchived ? 'Unarchive' : 'Archive'}</DropdownItem>
                    <DropdownItem onClick={onDeleteClick} className="text-red-600 hover:bg-red-50"><TrashIcon/> Move to Bin</DropdownItem>
                </DropdownMenu>
            </div>
             {quiz.isArchived && <span className="absolute top-4 end-14 text-xs bg-slate-500 text-white font-bold px-2 py-1 rounded-full z-10">ARCHIVED</span>}
            
            <div className="flex-grow mb-4 min-h-[50px]">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Assigned To:</h4>
                {assignedClasses.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                        {assignedClasses.map(c => <span key={c.id} className="text-xs bg-green-100 text-green-800 font-medium px-2 py-1 rounded-full">{c.name}</span>)}
                    </div>
                ) : (
                    <div className="text-sm text-slate-400 italic">Not assigned yet.</div>
                )}
            </div>
            
            <div className="grid grid-cols-2 gap-2 mt-auto">
                <button onClick={onAssignClick} disabled={!hasClasses || !!quiz.isArchived} className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-primary-dark transition disabled:opacity-50 disabled:cursor-not-allowed">
                    {t('assign')}
                </button>
                 <button onClick={onAnalyticsClick} className="bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-800 transition">
                    {t('analytics')}
                </button>
            </div>
        </div>
    );
};
const EmptyState: React.FC<{ message: string; buttonText?: string; onButtonClick?: () => void; icon: React.ReactNode; }> = ({ message, buttonText, onButtonClick, icon }) => (
    <div className="text-center py-16 px-6 bg-white rounded-xl shadow-sm border-2 border-dashed border-slate-300 col-span-full">
        <div className="mx-auto h-12 w-12 text-slate-400">{icon}</div>
        <h3 className="mt-2 text-lg font-medium text-slate-900">{message}</h3>
        {buttonText && onButtonClick && (
            <div className="mt-6">
                <button onClick={onButtonClick} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light">
                    <PlusIcon /> <span className="ms-2">{buttonText}</span>
                </button>
            </div>
        )}
    </div>
);

const BarChart: React.FC<{ title: string; data: { label: string; value: number }[] }> = ({ title, data }) => {
    const maxValue = Math.max(...data.map(d => d.value), 0);
    const chartHeight = 250; // in pixels

    if (data.length === 0) {
        return (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="font-bold text-slate-800 mb-4">{title}</h3>
                <div className="flex items-center justify-center h-[250px] text-slate-500">
                    No data available to display.
                </div>
            </div>
        );
    }
    
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-4">{title}</h3>
            <div className="flex justify-around items-end" style={{ height: `${chartHeight}px`}}>
                {data.map((item, index) => (
                    <div key={index} className="flex flex-col items-center w-full max-w-[60px]">
                        <div className="text-sm font-bold text-slate-600">{item.value.toFixed(1)}%</div>
                        <div 
                            className="w-4/5 bg-primary-light hover:bg-primary-dark transition-colors rounded-t-md" 
                            style={{ height: `${maxValue > 0 ? (item.value / maxValue) * (chartHeight - 40) : 0}px` }}
                            title={`${item.label}: ${item.value.toFixed(1)}%`}
                        ></div>
                        <div className="text-xs text-slate-500 mt-2 text-center break-words w-full truncate" title={item.label}>
                            {item.label}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};


// --- Main Dashboard Page --- //
type ModalState = 
    | { type: 'createClass' }
    | { type: 'createQuiz', data?: { title: string, questions: NewQuestion[] } }
    | { type: 'aiQuizGenerator' }
    | { type: 'assignQuiz', data: Quiz }
    | { type: 'manageStudents', data: Class }
    | { type: 'analytics', data: Quiz }
    | { type: 'editClass', data: Class }
    | { type: 'editQuiz', data: Quiz }
    | { type: 'recycleBin' }
    | null;


export const TeacherDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [classes, setClasses] = useState<Class[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  
  const [modalState, setModalState] = useState<ModalState>(null);

  const [showArchived, setShowArchived] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{type: 'class' | 'quiz', id: string, name: string} | null>(null);
  const [classSearch, setClassSearch] = useState('');
  const [quizSearch, setQuizSearch] = useState('');

  const fetchData = useCallback(() => {
    if (user) {
      const teacherClasses = mockDbService.getClassesByTeacher(user.id);
      setClasses(teacherClasses);

      const teacherQuizzes = mockDbService.getQuizzesByTeacher(user.id);
      setQuizzes(teacherQuizzes);
      
      const allAttempts = teacherQuizzes.flatMap(quiz => mockDbService.getAttemptsByQuiz(quiz.id));
      setAttempts(allAttempts);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const stats = useMemo(() => ({
    totalClasses: classes.filter(c => !c.isArchived).length,
    totalQuizzes: quizzes.filter(q => !q.isArchived).length,
    totalStudents: classes.filter(c => !c.isArchived).reduce((sum, c) => sum + c.studentIds.length, 0),
    totalAttempts: attempts.length,
  }), [classes, quizzes, attempts]);

  const chartData = useMemo(() => {
    const quizPerformance = quizzes
        .filter(q => !q.isArchived)
        .map(quiz => {
            const quizAttempts = attempts.filter(a => a.quizId === quiz.id);
            if (quizAttempts.length === 0) return { label: quiz.title, value: 0 };
            const avgScore = quizAttempts.reduce((sum, a) => sum + (a.score / a.maxScore), 0) / quizAttempts.length;
            return { label: quiz.title, value: avgScore * 100 };
        });

    const classPerformance = classes
        .filter(c => !c.isArchived)
        .map(c => {
            const studentIds = new Set(c.studentIds);
            const classAttempts = attempts.filter(a => studentIds.has(a.studentId));
            if(classAttempts.length === 0) return { label: c.name, value: 0 };
            const avgScore = classAttempts.reduce((sum, a) => sum + (a.score / a.maxScore), 0) / classAttempts.length;
            return { label: c.name, value: avgScore * 100 };
        });

    return { quizPerformance, classPerformance };
  }, [quizzes, classes, attempts]);

  const { activeClasses, archivedClasses, activeQuizzes, archivedQuizzes } = useMemo(() => {
    const lowerClassSearch = classSearch.toLowerCase();
    const lowerQuizSearch = quizSearch.toLowerCase();
    
    const filteredClasses = classes.filter(c => c.name.toLowerCase().includes(lowerClassSearch));
    const filteredQuizzes = quizzes.filter(q => q.title.toLowerCase().includes(lowerQuizSearch));

    return {
        activeClasses: filteredClasses.filter(c => !c.isArchived),
        archivedClasses: filteredClasses.filter(c => c.isArchived),
        activeQuizzes: filteredQuizzes.filter(q => !q.isArchived),
        archivedQuizzes: filteredQuizzes.filter(q => q.isArchived),
    }
  }, [classes, quizzes, classSearch, quizSearch]);
  
  const handleArchive = (type: 'class' | 'quiz', id: string, archive: boolean) => {
    if (type === 'class') mockDbService.archiveClass(id, archive);
    else mockDbService.archiveQuiz(id, archive);
    fetchData();
  };
  
  const handleAssignQuiz = (quizId: string, classIds: string[], availableFrom: number) => {
      classIds.forEach(classId => mockDbService.assignQuizToClass(quizId, classId, availableFrom));
      fetchData();
  }
  
  const handleDuplicateQuiz = (quizId: string) => {
    mockDbService.duplicateQuiz(quizId);
    fetchData();
  };

  const handleConfirmDelete = () => {
    if (!itemToDelete) return;
    if (itemToDelete.type === 'class') mockDbService.deleteClass(itemToDelete.id);
    else mockDbService.deleteQuiz(itemToDelete.id);
    fetchData();
    setItemToDelete(null);
  };
  
  const closeModal = () => {
    setModalState(null);
    setItemToDelete(null);
  };
  
  const handleAIQuestionsGenerated = (questions: NewQuestion[], topic: string) => {
    setModalState({ type: 'createQuiz', data: { questions, title: `Quiz on ${topic}` } });
  };

  const handleSaveQuiz = ({ title, questions }: { title: string; questions: NewQuestion[] }) => {
    if (user) {
        const newQuiz = mockDbService.createQuiz(user.id, title, questions);
        fetchData();
        closeModal();
        setModalState({ type: 'assignQuiz', data: newQuiz }); // Proceed to assignment
    }
  };

  const handleUpdateQuiz = (quizId: string, data: { title: string; questions: NewQuestion[] }) => {
      mockDbService.updateQuiz(quizId, data);
      fetchData();
      closeModal();
  };


  if (!user) return <div className="flex justify-center items-center h-screen"><p>Loading...</p></div>;

  return (
    <>
      <div className="bg-slate-100 min-h-screen">
        <div className="flex">
            {/* --- Sidebar --- */}
            <aside className="w-64 bg-white border-e border-slate-200 p-6 flex-col hidden lg:flex">
                <h1 className="text-2xl font-bold text-primary">
                  <span role="img" aria-label="hand wave">👋</span> {t('gesquiz')}
                </h1>
                <nav className="flex flex-col space-y-2 mt-8">
                    <button onClick={() => setModalState({ type: 'createClass' })} className="w-full flex items-center bg-primary text-white font-semibold px-4 py-2.5 rounded-lg hover:bg-primary-dark transition">
                        <PlusIcon/> <span className="ms-2">{t('create_class')}</span>
                    </button>
                    <button onClick={() => setModalState({ type: 'createQuiz' })} className="w-full flex items-center bg-secondary text-white font-semibold px-4 py-2.5 rounded-lg hover:bg-secondary-dark transition">
                        <PlusIcon/> <span className="ms-2">{t('create_quiz')}</span>
                    </button>
                    <button onClick={() => setModalState({ type: 'aiQuizGenerator' })} className="w-full flex items-center bg-indigo-600 text-white font-semibold px-4 py-2.5 rounded-lg hover:bg-indigo-700 transition">
                        <SparklesIcon/> <span className="ms-2">{t('create_with_ai')}</span>
                    </button>
                </nav>

                <div className="mt-auto">
                     <div className="border-t border-slate-200 pt-4 space-y-3">
                         <button onClick={() => setModalState({ type: 'recycleBin' })} className="w-full flex items-center text-slate-600 font-semibold px-4 py-2 rounded-lg hover:bg-slate-200 transition">
                            <RecycleBinIcon /> <span className="ms-2">{t('recycle_bin')}</span>
                        </button>
                        <label className="flex items-center justify-between cursor-pointer w-full text-slate-600 font-semibold px-4 py-2 rounded-lg hover:bg-slate-200 transition">
                            <span>{t('show_archived')}</span>
                            <div className="relative">
                                <input type="checkbox" checked={showArchived} onChange={() => setShowArchived(!showArchived)} className="sr-only peer" />
                                <div className="w-11 h-6 bg-slate-300 rounded-full peer-checked:bg-primary transition-colors"></div>
                                <div className="absolute start-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-full"></div>
                            </div>
                        </label>
                    </div>
                </div>
            </aside>
            
            {/* --- Main Content --- */}
            <main className="flex-1 p-6 lg:p-10">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{t('teacher_dashboard')}</h1>
                    <p className="text-slate-600 mt-1">{t('teacher_welcome', { name: user.firstName })}</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <StatCard icon={<AcademicCapIcon />} title={t('active_classes')} value={stats.totalClasses} />
                    <StatCard icon={<DocumentTextIcon />} title={t('active_quizzes')} value={stats.totalQuizzes} />
                    <StatCard icon={<UsersIcon />} title={t('total_students')} value={stats.totalStudents} />
                    <StatCard icon={<ClipboardCheckIcon />} title={t('total_attempts')} value={stats.totalAttempts} />
                </div>
                
                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-slate-800 mb-4">{t('analytics')}</h2>
                    <p className="text-slate-600 mb-6 max-w-3xl">{t('analytics_desc')}</p>
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <BarChart title={t('quiz_performance')} data={chartData.quizPerformance} />
                        <BarChart title={t('class_performance')} data={chartData.classPerformance} />
                    </div>
                </section>

                <div className="space-y-12">
                    <section>
                         <div className="flex justify-between items-center mb-4">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-800">{t('my_classes')}</h2>
                                <p className="text-slate-600 mt-1">{t('my_classes_desc')}</p>
                            </div>
                            <div className="relative w-full max-w-xs">
                                <div className="absolute inset-y-0 start-0 ps-3 flex items-center pointer-events-none">
                                    <SearchIcon />
                                </div>
                                <input type="text" placeholder={t('search_classes')} value={classSearch} onChange={(e) => setClassSearch(e.target.value)} className="w-full ps-10 pe-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"/>
                            </div>
                        </div>
                        {activeClasses.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {activeClasses.map(c => <ClassCard key={c.id} classItem={c} onManageClick={() => setModalState({ type: 'manageStudents', data: c })} onArchiveClick={() => handleArchive('class', c.id, !c.isArchived)} onEditClick={() => setModalState({ type: 'editClass', data: c })} onDeleteClick={() => setItemToDelete({type: 'class', id: c.id, name: c.name})} />)}
                            </div>
                        ) : (
                            <EmptyState message={classSearch ? 'No classes match your search.' : "You haven't created any classes yet."} buttonText={classSearch ? undefined : "Create Your First Class"} onButtonClick={() => setModalState({type: 'createClass'})} icon={<AcademicCapIcon />} />
                        )}
                    </section>
                    <section>
                        <div className="flex justify-between items-center mb-4">
                             <div>
                                <h2 className="text-2xl font-bold text-slate-800">{t('my_quizzes')}</h2>
                                <p className="text-slate-600 mt-1">{t('my_quizzes_desc')}</p>
                             </div>
                             <div className="relative w-full max-w-xs">
                                <div className="absolute inset-y-0 start-0 ps-3 flex items-center pointer-events-none">
                                    <SearchIcon />
                                </div>
                                <input type="text" placeholder={t('search_quizzes')} value={quizSearch} onChange={(e) => setQuizSearch(e.target.value)} className="w-full ps-10 pe-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"/>
                            </div>
                        </div>
                        {activeQuizzes.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {activeQuizzes.map(q => <QuizCard key={q.id} quiz={q} onAssignClick={() => setModalState({ type: 'assignQuiz', data: q })} onAnalyticsClick={() => setModalState({ type: 'analytics', data: q })} onArchiveClick={() => handleArchive('quiz', q.id, !q.isArchived)} onEditClick={() => setModalState({ type: 'editQuiz', data: q })} onDuplicateClick={() => handleDuplicateQuiz(q.id)} onDeleteClick={() => setItemToDelete({type: 'quiz', id: q.id, name: q.title})} hasClasses={classes.filter(c => !c.isArchived).length > 0} onPreviewClick={() => navigate(`/preview/${q.id}`)} />)}
                            </div>
                        ) : (
                            <EmptyState message={quizSearch ? 'No quizzes match your search.' : "No quizzes created yet."} buttonText={quizSearch ? undefined : "Create a New Quiz"} onButtonClick={() => setModalState({ type: 'createQuiz' })} icon={<DocumentTextIcon />} />
                        )}
                    </section>
                    
                    {showArchived && (
                      <div className="space-y-12 mt-12 pt-8 border-t-2 border-dashed border-slate-300">
                        <section>
                          <h2 className="text-2xl font-bold text-slate-500 mb-4">Archived Classes</h2>
                          {archivedClasses.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                              {archivedClasses.map(c => <ClassCard key={c.id} classItem={c} onManageClick={() => setModalState({ type: 'manageStudents', data: c })} onArchiveClick={() => handleArchive('class', c.id, !c.isArchived)} onEditClick={() => setModalState({ type: 'editClass', data: c })} onDeleteClick={() => setItemToDelete({type: 'class', id: c.id, name: c.name})} />)}
                            </div>
                          ) : (
                            <EmptyState message="No archived classes." icon={<ArchiveIcon/>}/>
                          )}
                        </section>
                        <section>
                          <h2 className="text-2xl font-bold text-slate-500 mb-4">Archived Quizzes</h2>
                           {archivedQuizzes.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {archivedQuizzes.map(q => <QuizCard key={q.id} quiz={q} onAssignClick={() => setModalState({ type: 'assignQuiz', data: q })} onAnalyticsClick={() => setModalState({ type: 'analytics', data: q })} onArchiveClick={() => handleArchive('quiz', q.id, !q.isArchived)} onEditClick={() => setModalState({ type: 'editQuiz', data: q })} onDuplicateClick={() => handleDuplicateQuiz(q.id)} onDeleteClick={() => setItemToDelete({type: 'quiz', id: q.id, name: q.title})} hasClasses={classes.filter(c => !c.isArchived).length > 0} onPreviewClick={() => navigate(`/preview/${q.id}`)} />)}
                            </div>
                        ) : (
                             <EmptyState message="No archived quizzes." icon={<ArchiveIcon />} />
                        )}
                        </section>
                      </div>
                    )}
                </div>
            </main>
        </div>
      </div>
      
      {/* --- Modals --- */}
      {modalState?.type === 'createClass' && user && <CreateClassModal user={user} onClose={closeModal} onClassCreated={fetchData} />}
      {modalState?.type === 'editClass' && modalState.data && <EditClassModal classItem={modalState.data} onClose={closeModal} onSave={(id, name) => { mockDbService.updateClass(id, name); fetchData(); }} />}
      
      {modalState?.type === 'createQuiz' && user && <QuizEditorModal mode="create" user={user} onClose={closeModal} onSave={handleSaveQuiz} initialQuestions={modalState.data?.questions} initialTitle={modalState.data?.title} />}
      {/* FIX: The onSave handler for QuizEditorModal in 'edit' mode must accept a single object argument and destructure it. */}
      {modalState?.type === 'editQuiz' && modalState.data && user && <QuizEditorModal mode="edit" initialQuiz={modalState.data} user={user} onClose={closeModal} onSave={({ quizId, data }) => handleUpdateQuiz(quizId, data)} />}
      
      {modalState?.type === 'aiQuizGenerator' && <AIQuizGeneratorModal onClose={closeModal} onQuestionsGenerated={handleAIQuestionsGenerated} />}
      
      {modalState?.type === 'assignQuiz' && modalState.data && <AssignQuizModal quiz={modalState.data} classes={activeClasses.filter(c => !mockDbService.getAssignmentsByClass(c.id).some(a => a.quizId === modalState.data.id))} onClose={closeModal} onAssign={(classIds, date) => handleAssignQuiz(modalState.data.id, classIds, date)} />}
      
      {modalState?.type === 'manageStudents' && modalState.data && <ManageStudentsModal classItem={modalState.data} onClose={closeModal} />}
      
      {modalState?.type === 'analytics' && modalState.data && <QuizAnalyticsModal quiz={modalState.data} onClose={closeModal} />}
      
      {modalState?.type === 'recycleBin' && user && <RecycleBinModal user={user} onClose={closeModal} onUpdate={fetchData} />}

      {itemToDelete && (
            <DeleteConfirmationModal
                title={`Move ${itemToDelete.type} to Recycle Bin`}
                message={`Move "${itemToDelete.name}" to the recycle bin? You can restore it later.`}
                onConfirm={handleConfirmDelete}
                onClose={() => setItemToDelete(null)}
                confirmText='Move to Bin'
            />
        )}
    </>
  );
};
