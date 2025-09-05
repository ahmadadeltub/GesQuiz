import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { mockDbService } from '../services/mockDbService';
import { Class, Quiz, User, UserRole, NewQuestion, Assignment, QuizAttempt, QuestionType, Organization } from '../types';
import { useTranslation } from '../i18n';

// --- Icon Components (copied for simplicity) --- //
const PlusIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" /></svg>);
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.124-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.124-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const AcademicCapIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222 4 2.222V20" /></svg>;
const DocumentTextIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const BriefcaseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 me-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg>;
const ArchiveIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 me-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v8m0 0l3-3m-3 3L9 8m-5 5h14" /></svg>;
const PencilIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 me-3" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>;
const MoreVerticalIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>;
const TrophyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V22"/><path d="M14 14.66V22"/><path d="M17 5v8.67a1 1 0 0 1-.83.98L12 16l-4.17-1.35a1 1 0 0 1-.83-.98V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2z"/></svg>;
const RecycleBinIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
const EyeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 me-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>;
const ClockIcon: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-8 w-8 text-yellow-500"} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" /></svg>;
const XCircleIcon: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-8 w-8 text-red-500"} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>;

// --- Modals and Helper Components ---
// FIX: Removed incorrect import from './TeacherDashboardPage' and defined QuizAnalyticsModal locally.

// Minimal component definitions to avoid full duplication if possible.
const Modal: React.FC<{ children: React.ReactNode; title: string; onClose: () => void; size?: 'md' | 'lg' | 'xl' | 'full' }> = ({ children, title, onClose, size='lg' }) => {
    const sizeClasses = { md: 'max-w-md', lg: 'max-w-3xl', xl: 'max-w-5xl', full: 'max-w-full' };
    return(
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className={`bg-white rounded-lg shadow-xl w-full ${sizeClasses[size]} transform transition-all`} onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <div className="p-6 max-h-[80vh] overflow-y-auto">{children}</div>
            </div>
        </div>
    );
}

// FIX: Added local definition for QuizAnalyticsModal for consistency and to fix the import error.
const QuizAnalyticsModal: React.FC<{ quiz: Quiz; onClose: () => void }> = ({ quiz, onClose }) => {
    // This is a simplified version for the admin dashboard.
    // A full implementation would be in its own component file.
    const attempts = mockDbService.getAttemptsByQuiz(quiz.id);

    return (
        <Modal title={`Analytics for "${quiz.title}"`} onClose={onClose} size="xl">
            <div className="p-2">
                {attempts.length > 0 ? (
                    <div>
                        <p className="mb-4">{attempts.length} attempt(s) found for this quiz.</p>
                        <p>Detailed, question-by-question analytics are available on the teacher's dashboard.</p>
                    </div>
                ) : (
                    <p>There are no attempts for this quiz yet.</p>
                )}
            </div>
        </Modal>
    );
};

const DeleteConfirmationModal: React.FC<{ title: string; message: string; onConfirm: () => void; onClose: () => void; confirmText?: string; }> = ({ title, message, onConfirm, onClose, confirmText = "Delete" }) => (
    <Modal title={title} onClose={onClose} size="md">
        <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            </div>
            <div className="mt-3 text-center sm:mt-5">
                 <h3 className="text-lg leading-6 font-medium text-gray-900">{message}</h3>
                <div className="mt-2">
                    <p className="text-sm text-gray-500">
                        This action is permanent and cannot be undone.
                    </p>
                </div>
            </div>
        </div>
        <div className="mt-5 sm:mt-6 grid grid-cols-2 gap-3">
            <button type="button" onClick={onConfirm} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm">
                {confirmText}
            </button>
            <button type="button" onClick={onClose} className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm">
                Cancel
            </button>
        </div>
    </Modal>
);

const DropdownMenu: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = React.useRef<HTMLDivElement>(null);
    const toggle = () => setIsOpen(!isOpen);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) setIsOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={menuRef}>
            <button onClick={toggle} className="p-2 rounded-full text-slate-500 hover:bg-slate-200"><MoreVerticalIcon /></button>
            {isOpen && <div className="absolute end-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-20 origin-top-right"><div className="py-1" onClick={() => setIsOpen(false)}>{children}</div></div>}
        </div>
    );
};

const DropdownItem: React.FC<{ onClick?: () => void; children: React.ReactNode; disabled?: boolean; className?: string }> = ({ onClick, children, disabled, className }) => (
    <button onClick={onClick} disabled={disabled} className={`w-full text-start px-4 py-2 text-sm flex items-center transition-colors ${disabled ? 'text-slate-400 cursor-not-allowed' : 'text-slate-700 hover:bg-slate-100'} ${className}`}>{children}</button>
);


const AdminStatCard: React.FC<{ icon: React.ReactNode; title: string; value: number | string; }> = ({ icon, title, value }) => (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-100 text-blue-600 me-4">{icon}</div>
            <div>
                <p className="text-slate-500 text-sm font-medium">{title}</p>
                <p className="text-2xl font-bold text-slate-900">{value}</p>
            </div>
        </div>
    </div>
);

const BarChart: React.FC<{ title: string; data: { label: string; value: number }[] }> = ({ title, data }) => {
    const maxValue = Math.max(...data.map(d => d.value), 0);
    if (data.length === 0) return <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-[300px] flex items-center justify-center text-slate-500">{title}: No data available.</div>;
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-4">{title}</h3>
            <div className="flex justify-around items-end" style={{ height: '250px'}}>
                {data.map((item, index) => (
                    <div key={index} className="flex flex-col items-center w-full max-w-[60px]">
                        <div className="text-sm font-bold text-slate-600">{item.value.toFixed(1)}%</div>
                        <div className="w-4/5 bg-blue-400 hover:bg-blue-600 transition-colors rounded-t-md" style={{ height: `${maxValue > 0 ? (item.value / maxValue) * (250 - 40) : 0}px` }} title={`${item.label}: ${item.value.toFixed(1)}%`}></div>
                        <div className="text-xs text-slate-500 mt-2 text-center break-words w-full truncate" title={item.label}>{item.label}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const Leaderboard: React.FC<{ users: User[], title: string, valueKey: 'points' | 'quizCount' }> = ({ users, title, valueKey }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-full">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><TrophyIcon /> {title}</h3>
        <ol className="space-y-2">
            {[...users].sort((a,b) => (b[valueKey] || 0) - (a[valueKey] || 0)).slice(0, 5).map((user, index) => (
                <li key={user.id} className="flex items-center p-2 rounded-lg bg-slate-50">
                    <span className="font-bold text-slate-500 w-6">{index + 1}.</span>
                    <span className="font-semibold text-slate-700 flex-grow truncate">{user.firstName} {user.lastName}</span>
                    <span className="font-bold text-blue-600">{user[valueKey] || 0}</span>
                </li>
            ))}
        </ol>
    </div>
);


const CreateClassModal: React.FC<{ teachers: User[]; onClose: () => void; onClassCreated: () => void; adminId: string; }> = ({ teachers, onClose, onClassCreated, adminId }) => {
    const [name, setName] = useState('');
    const [teacherId, setTeacherId] = useState(teachers[0]?.id || '');
    
    useEffect(() => {
        if (!teacherId && teachers.length > 0) {
            setTeacherId(teachers[0].id);
        }
    }, [teacherId, teachers]);
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim() && teacherId) {
            // Admin can create a class and assign any teacher from the org.
            mockDbService.createClass(name, teacherId);
            onClassCreated();
            onClose();
        } else if (name.trim() && !teacherId && teachers.length === 0) {
            // If no teachers exist, admin can create it for themselves.
            mockDbService.createClass(name, adminId);
            onClassCreated();
            onClose();
        }
    };
    return (
        <Modal title="Create New Class" onClose={onClose} size="md">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Class Name</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2 border rounded-lg" placeholder="e.g., Grade 10 History" autoFocus/>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Assign Teacher</label>
                    {teachers.length > 0 ? (
                        <select value={teacherId} onChange={e => setTeacherId(e.target.value)} className="w-full px-3 py-2 border rounded-lg bg-white">
                            {teachers.map(t => <option key={t.id} value={t.id}>{t.firstName} {t.lastName}</option>)}
                        </select>
                    ) : (
                        <p className="text-sm text-gray-500 p-2 bg-gray-100 rounded-md">No other teachers in this organization. The class will be assigned to you.</p>
                    )}
                </div>
                <div className="flex justify-end gap-3 pt-2">
                    <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg">Cancel</button>
                    <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg">Create</button>
                </div>
            </form>
        </Modal>
    );
};

const ManageClassModal: React.FC<{ classItem: Class; allStudents: User[]; allTeachers: User[]; onClose: () => void; onUpdate: () => void; }> = ({ classItem, allStudents, allTeachers, onClose, onUpdate }) => {
    const [enrolledStudents, setEnrolledStudents] = useState<User[]>([]);
    const [currentTeacherId, setCurrentTeacherId] = useState(classItem.teacherId);

    useEffect(() => {
        setEnrolledStudents(mockDbService.getStudentsByClassId(classItem.id));
    }, [classItem.id]);
    
    const unenrolledStudents = allStudents.filter(s => !enrolledStudents.some(es => es.id === s.id));
    
    const handleAddStudent = (studentId: string) => {
        mockDbService.addStudentToClass(classItem.id, studentId);
        setEnrolledStudents(mockDbService.getStudentsByClassId(classItem.id));
        onUpdate();
    };
    const handleRemoveStudent = (studentId: string) => {
        mockDbService.removeStudentFromClass(classItem.id, studentId);
        setEnrolledStudents(mockDbService.getStudentsByClassId(classItem.id));
        onUpdate();
    };
    const handleTeacherChange = (teacherId: string) => {
        mockDbService.updateClassTeacher(classItem.id, teacherId);
        setCurrentTeacherId(teacherId);
        onUpdate();
    };
    
    return (
        <Modal title={`Manage Class: ${classItem.name}`} onClose={onClose} size="xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Student Management */}
                <div className="space-y-4">
                    <h4 className="font-semibold text-gray-700">Manage Students</h4>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-600">Add Student</label>
                        <select onChange={e => e.target.value && handleAddStudent(e.target.value)} value="" className="w-full bg-white border rounded-lg p-2">
                            <option value="">Select a student to add...</option>
                            {unenrolledStudents.map(s => <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>)}
                        </select>
                    </div>
                    <div className="space-y-2 border rounded-lg p-2 h-64 overflow-y-auto">
                        <h5 className="text-sm font-medium text-gray-600">Enrolled Students ({enrolledStudents.length})</h5>
                        {enrolledStudents.length > 0 ? enrolledStudents.map(s => (
                            <div key={s.id} className="flex justify-between items-center bg-gray-100 p-2 rounded">
                               <span>{s.firstName} {s.lastName}</span>
                               <button onClick={() => handleRemoveStudent(s.id)} className="text-red-500 text-xs font-bold">REMOVE</button>
                            </div>
                        )) : <p className="text-sm text-gray-400 text-center p-4">No students enrolled.</p>}
                    </div>
                </div>
                {/* Teacher Management */}
                <div className="space-y-4">
                     <h4 className="font-semibold text-gray-700">Manage Teacher</h4>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Current Teacher</label>
                        <select value={currentTeacherId} onChange={e => handleTeacherChange(e.target.value)} className="w-full bg-white border rounded-lg p-2">
                            {allTeachers.map(t => <option key={t.id} value={t.id}>{t.firstName} {t.lastName}</option>)}
                        </select>
                    </div>
                </div>
            </div>
        </Modal>
    )
};

const SystemRecycleBinModal: React.FC<{ onClose: () => void; onUpdate: () => void; organizationId: string; }> = ({ onClose, onUpdate, organizationId }) => {
    const [activeTab, setActiveTab] = useState<'classes' | 'quizzes'>('classes');
    const [deletedContent, setDeletedContent] = useState<{ classes: Class[], quizzes: Quiz[] }>({ classes: [], quizzes: [] });
    const [itemToPermanentlyDelete, setItemToPermanentlyDelete] = useState<{type: 'class' | 'quiz' | 'all', id?: string, name: string} | null>(null);

    const fetchDeletedContent = useCallback(() => {
        const { deletedClasses, deletedQuizzes } = mockDbService.getSystemWideDeletedContent(organizationId);
        setDeletedContent({ classes: deletedClasses, quizzes: deletedQuizzes });
    }, [organizationId]);

    useEffect(fetchDeletedContent, [fetchDeletedContent]);

    const handleRestore = (type: 'class' | 'quiz', id: string) => {
        if (type === 'class') mockDbService.restoreClass(id);
        else mockDbService.restoreQuiz(id);
        onUpdate();
        fetchDeletedContent();
    };

    const handlePermanentDelete = () => {
        if (!itemToPermanentlyDelete) return;
        if (itemToPermanentlyDelete.type === 'class' && itemToPermanentlyDelete.id) {
            mockDbService.permanentlyDeleteClass(itemToPermanentlyDelete.id);
        } else if (itemToPermanentlyDelete.type === 'quiz' && itemToPermanentlyDelete.id) {
            mockDbService.permanentlyDeleteQuiz(itemToPermanentlyDelete.id);
        } else if (itemToPermanentlyDelete.type === 'all') {
            mockDbService.emptySystemWideRecycleBin(organizationId);
        }
        setItemToPermanentlyDelete(null);
        onUpdate();
        fetchDeletedContent();
    };

    const hasContent = deletedContent.classes.length > 0 || deletedContent.quizzes.length > 0;
    const tabStyle = "px-4 py-2 text-sm font-medium rounded-t-lg transition-colors";
    const activeTabStyle = "text-blue-600 bg-white border-b-2 border-blue-600";
    const inactiveTabStyle = "text-gray-500 hover:text-gray-700 hover:bg-gray-100";
    
    return (
        <>
            <Modal title="System-Wide Recycle Bin" onClose={onClose} size="xl">
                <div className="border-b border-gray-200 mb-4 flex justify-between items-center">
                    <div className="flex -mb-px">
                        <button onClick={() => setActiveTab('classes')} className={`${tabStyle} ${activeTab === 'classes' ? activeTabStyle : inactiveTabStyle}`}>
                            Classes ({deletedContent.classes.length})
                        </button>
                        <button onClick={() => setActiveTab('quizzes')} className={`${tabStyle} ${activeTab === 'quizzes' ? activeTabStyle : inactiveTabStyle}`}>
                            Quizzes ({deletedContent.quizzes.length})
                        </button>
                    </div>
                    <button
                        onClick={() => setItemToPermanentlyDelete({ type: 'all', name: "all items" })}
                        disabled={!hasContent}
                        className="bg-red-600 text-white px-3 py-1 rounded-md text-sm font-semibold hover:bg-red-700 transition disabled:bg-red-300 disabled:cursor-not-allowed flex items-center gap-1">
                        <TrashIcon /> Empty Bin
                    </button>
                </div>

                <div className="space-y-3">
                    {activeTab === 'classes' && (
                        deletedContent.classes.length > 0 ? deletedContent.classes.map(c => (
                            <div key={c.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <span className="font-semibold text-gray-800">{c.name}</span>
                                <div className="flex gap-2">
                                    <button onClick={() => handleRestore('class', c.id)} className="text-green-600 hover:text-green-800 font-semibold text-sm">Restore</button>
                                    <button onClick={() => setItemToPermanentlyDelete({type: 'class', id: c.id, name: c.name})} className="text-red-600 hover:text-red-800 font-semibold text-sm">Delete Permanently</button>
                                </div>
                            </div>
                        )) : <p className="text-center text-gray-500 py-8">No deleted classes.</p>
                    )}
                     {activeTab === 'quizzes' && (
                        deletedContent.quizzes.length > 0 ? deletedContent.quizzes.map(q => (
                             <div key={q.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <span className="font-semibold text-gray-800">{q.title}</span>
                                <div className="flex gap-2">
                                    <button onClick={() => handleRestore('quiz', q.id)} className="text-green-600 hover:text-green-800 font-semibold text-sm">Restore</button>
                                    <button onClick={() => setItemToPermanentlyDelete({type: 'quiz', id: q.id, name: q.title})} className="text-red-600 hover:text-red-800 font-semibold text-sm">Delete Permanently</button>
                                </div>
                            </div>
                        )) : <p className="text-center text-gray-500 py-8">No deleted quizzes.</p>
                    )}
                </div>
            </Modal>
            {itemToPermanentlyDelete && (
                <DeleteConfirmationModal
                    title={itemToPermanentlyDelete.type === 'all' ? "Empty Recycle Bin" : `Permanently Delete ${itemToPermanentlyDelete.type}`}
                    message={`Are you sure you want to permanently delete "${itemToPermanentlyDelete.name}"?`}
                    onConfirm={handlePermanentDelete}
                    onClose={() => setItemToPermanentlyDelete(null)}
                />
            )}
        </>
    )
};

// Main Admin Dashboard Component
export const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'classes' | 'quizzes' | 'users'>('dashboard');
  
  // Data states
  const [stats, setStats] = useState({ totalTeachers: 0, totalStudents: 0, totalClasses: 0, totalQuizzes: 0 });
  const [allClasses, setAllClasses] = useState<Class[]>([]);
  const [allQuizzes, setAllQuizzes] = useState<Quiz[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [allAttempts, setAllAttempts] = useState<QuizAttempt[]>([]);
  
  // UI states
  const [modalState, setModalState] = useState<{ type: string, data?: any } | null>(null);
  const [showArchived, setShowArchived] = useState(false);
  const [searchTerms, setSearchTerms] = useState({ classes: '', quizzes: '' });
  const [itemToDelete, setItemToDelete] = useState<{type: 'class' | 'quiz', id: string, name: string} | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<{text: string; type: 'success' | 'error'} | null>(null);

  const fetchData = useCallback(() => {
    if (user?.role === UserRole.ADMIN && user.organizationId) {
      const orgId = user.organizationId;
      setOrganization(mockDbService.getOrganizationById(orgId) || null);
      setStats(mockDbService.getSystemStats(orgId));
      setAllClasses(mockDbService.getAllClasses(orgId));
      setAllQuizzes(mockDbService.getAllQuizzes(orgId));
      setAllUsers(mockDbService.getAllUsers(orgId));
      setAllAttempts(mockDbService.getAllAttempts(orgId));
    }
  }, [user]);

  useEffect(fetchData, [fetchData]);

  const teachers = useMemo(() => {
    const teacherUsers = allUsers.filter(u => u.role === UserRole.TEACHER || u.role === UserRole.ADMIN);
    return teacherUsers.map(teacher => ({
        ...teacher,
        quizCount: allQuizzes.filter(q => q.teacherId === teacher.id).length,
    }));
  }, [allUsers, allQuizzes]);

  const students = useMemo(() => allUsers.filter(u => u.role === UserRole.STUDENT), [allUsers]);
  
  const chartData = useMemo(() => {
    const quizPerformance = allQuizzes.filter(q => !q.isArchived).map(quiz => {
        const quizAttempts = allAttempts.filter(a => a.quizId === quiz.id);
        if (quizAttempts.length === 0) return { label: quiz.title, value: 0 };
        const avgScore = quizAttempts.reduce((sum, a) => sum + (a.score / a.maxScore), 0) / quizAttempts.length;
        return { label: quiz.title, value: avgScore * 100 };
    });
    const classPerformance = allClasses.filter(c => !c.isArchived).map(c => {
        const studentIds = new Set(c.studentIds);
        const classAttempts = allAttempts.filter(a => studentIds.has(a.studentId));
        if (classAttempts.length === 0) return { label: c.name, value: 0 };
        const avgScore = classAttempts.reduce((sum, a) => sum + (a.score / a.maxScore), 0) / classAttempts.length;
        return { label: c.name, value: avgScore * 100 };
    });
    return { quizPerformance, classPerformance };
  }, [allQuizzes, allClasses, allAttempts]);
  
  const handleConfirmDelete = () => {
      if (!itemToDelete) return;
      if (itemToDelete.type === 'class') mockDbService.deleteClass(itemToDelete.id);
      else mockDbService.deleteQuiz(itemToDelete.id);
      fetchData();
      setItemToDelete(null);
  };

  const handleConfirmUserDelete = () => {
    if (!userToDelete || !user) return;
    const result = mockDbService.deleteUser(userToDelete.id, user.id);
    setFeedbackMessage({ text: result.message, type: result.success ? 'success' : 'error' });
    if(result.success) {
        fetchData();
    }
    setUserToDelete(null);
    setTimeout(() => setFeedbackMessage(null), 5000);
  };


  const handleSearch = (type: 'classes' | 'quizzes', term: string) => {
    setSearchTerms(prev => ({...prev, [type]: term}));
  };

  const filteredClasses = useMemo(() => allClasses.filter(c => c.name.toLowerCase().includes(searchTerms.classes.toLowerCase()) && (showArchived || !c.isArchived)), [allClasses, searchTerms.classes, showArchived]);
  const filteredQuizzes = useMemo(() => allQuizzes.filter(q => q.title.toLowerCase().includes(searchTerms.quizzes.toLowerCase()) && (showArchived || !q.isArchived)), [allQuizzes, searchTerms.quizzes, showArchived]);
  
  const TabButton: React.FC<{ tabId: string, children: React.ReactNode}> = ({ tabId, children }) => (
      <button onClick={() => setCurrentTab(tabId as any)} className={`px-4 py-2 font-semibold rounded-t-lg transition-colors border-b-2 ${currentTab === tabId ? 'text-blue-600 border-blue-600' : 'text-slate-500 border-transparent hover:text-blue-600'}`}>{children}</button>
  );

  if (!user || !organization) return <div className="text-center p-8">Loading...</div>

  // --- Render based on organization status ---
  if (organization.status === 'pending') {
      return (
          <div className="bg-slate-100 min-h-screen flex items-center justify-center p-8">
              <div className="text-center bg-white p-10 rounded-xl shadow-lg max-w-lg">
                  <ClockIcon className="mx-auto h-12 w-12" />
                  <h1 className="text-2xl font-bold text-slate-800 mt-4">Organization Pending Approval</h1>
                  <p className="text-slate-600 mt-2">Your organization, "{organization.name}", has been submitted for approval. You will be notified once the super admin has reviewed your application. You can log out and check back later.</p>
              </div>
          </div>
      )
  }
  if (organization.status === 'rejected') {
       return (
          <div className="bg-slate-100 min-h-screen flex items-center justify-center p-8">
              <div className="text-center bg-white p-10 rounded-xl shadow-lg max-w-lg">
                  <XCircleIcon className="mx-auto h-12 w-12" />
                  <h1 className="text-2xl font-bold text-slate-800 mt-4">Organization Rejected</h1>
                  <p className="text-slate-600 mt-2">Unfortunately, your application for the organization "{organization.name}" was not approved. Please contact support if you believe this is an error.</p>
              </div>
          </div>
      )
  }


  return (
    <>
    <div className="bg-slate-100 min-h-screen p-8">
      {feedbackMessage && (
        <div className={`p-4 rounded-lg mb-6 text-center font-semibold border ${feedbackMessage.type === 'success' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'}`}>
            {feedbackMessage.text}
        </div>
      )}
      <header className="mb-6">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">{t('admin_dashboard', { name: organization.name })}</h1>
        <p className="text-slate-600 mt-2">{t('admin_welcome')}</p>
        <div className="text-slate-600 mt-2 bg-slate-200 inline-flex p-2 rounded-lg">
          {t('your_org_code')}: <strong className="font-mono ms-2">{organization.code}</strong>
        </div>
      </header>

      <div className="border-b border-slate-200 mb-6">
        <nav className="flex space-x-4">
            <TabButton tabId="dashboard">{t('dashboard')}</TabButton>
            <TabButton tabId="classes">{t('classes')}</TabButton>
            <TabButton tabId="quizzes">{t('quizzes')}</TabButton>
            <TabButton tabId="users">{t('users')}</TabButton>
        </nav>
      </div>

      {currentTab === 'dashboard' && (
          <div className="space-y-8">
              <p className="text-slate-600">The dashboard provides a high-level overview of your institution's activity. Monitor key stats, compare performance across quizzes and classes, and see who your top performers are.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <AdminStatCard icon={<BriefcaseIcon />} title={t('teachers')} value={stats.totalTeachers} />
                  <AdminStatCard icon={<UsersIcon />} title={t('students')} value={stats.totalStudents} />
                  <AdminStatCard icon={<AcademicCapIcon />} title={t('classes')} value={stats.totalClasses} />
                  <AdminStatCard icon={<DocumentTextIcon />} title={t('quizzes')} value={stats.totalQuizzes} />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <BarChart title={t('quiz_performance')} data={chartData.quizPerformance} />
                  <BarChart title={t('class_performance')} data={chartData.classPerformance} />
              </div>
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                   <Leaderboard users={students} title="Top Students" valueKey="points" />
                   <Leaderboard users={teachers} title="Top Teachers (by Quizzes Created)" valueKey="quizCount" />
               </div>
          </div>
      )}

      {currentTab === 'classes' && (
          <div className="space-y-4">
              <div className="flex justify-between items-center">
                  <p className="text-slate-600">View and manage all classes within your organization.</p>
                  <div className="flex gap-4 items-center">
                    <div className="relative w-full max-w-xs"><div className="absolute inset-y-0 start-0 ps-3 flex items-center pointer-events-none"><SearchIcon /></div><input type="text" placeholder={t('search_classes')} value={searchTerms.classes} onChange={(e) => handleSearch('classes', e.target.value)} className="w-full ps-10 pe-4 py-2 border rounded-lg"/></div>
                    <button onClick={() => setModalState({ type: 'createClass' })} className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2"><PlusIcon /> {t('create_class')}</button>
                  </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredClasses.map(c => (
                      <div key={c.id} className={`bg-white p-5 rounded-xl shadow-sm border ${c.isArchived ? 'opacity-60 bg-slate-50' : ''}`}>
                          <div className="flex justify-between items-start mb-2"><h3 className="font-bold text-lg text-slate-800 break-words w-4/5">{c.name}</h3><DropdownMenu><DropdownItem onClick={() => setModalState({ type: 'manageClass', data: c })}><UsersIcon/> Manage</DropdownItem><DropdownItem onClick={() => {mockDbService.archiveClass(c.id, !c.isArchived); fetchData();}}><ArchiveIcon /> {c.isArchived ? 'Unarchive' : 'Archive'}</DropdownItem><DropdownItem onClick={() => setItemToDelete({type: 'class', id: c.id, name: c.name})} className="text-red-600 hover:bg-red-50"><TrashIcon /> Move to Bin</DropdownItem></DropdownMenu></div>
                          <p className="text-sm text-slate-500">Teacher: {teachers.find(t => t.id === c.teacherId)?.firstName || 'N/A'}</p>
                          <p className="text-sm text-slate-500">Students: {c.studentIds.length}</p>
                          <p className="text-sm text-slate-500 mt-2">Code: <span className="font-mono bg-slate-200 text-slate-800 px-2 py-0.5 rounded">{c.code}</span></p>
                      </div>
                  ))}
              </div>
          </div>
      )}

       {currentTab === 'quizzes' && (
          <div className="space-y-4">
              <div className="flex justify-between items-center">
                  <p className="text-slate-600">Browse and oversee all quizzes created by teachers in your organization.</p>
                  <div className="relative w-full max-w-xs"><div className="absolute inset-y-0 start-0 ps-3 flex items-center pointer-events-none"><SearchIcon /></div><input type="text" placeholder={t('search_quizzes')} value={searchTerms.quizzes} onChange={(e) => handleSearch('quizzes', e.target.value)} className="w-full ps-10 pe-4 py-2 border rounded-lg"/></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                 {filteredQuizzes.map(q => (
                      <div key={q.id} className={`bg-white p-5 rounded-xl shadow-sm border ${q.isArchived ? 'opacity-60 bg-slate-50' : ''}`}>
                          <div className="flex justify-between items-start mb-2"><h3 className="font-bold text-lg text-slate-800 break-words w-4/5">{q.title}</h3><DropdownMenu><DropdownItem onClick={() => navigate(`/preview/${q.id}`)}><EyeIcon /> Preview</DropdownItem><DropdownItem onClick={() => setModalState({ type: 'analytics', data: q })}><AcademicCapIcon /> Analytics</DropdownItem><DropdownItem onClick={() => { mockDbService.archiveQuiz(q.id, !q.isArchived); fetchData(); }}><ArchiveIcon /> {q.isArchived ? 'Unarchive' : 'Archive'}</DropdownItem><DropdownItem onClick={() => setItemToDelete({type: 'quiz', id: q.id, name: q.title})} className="text-red-600 hover:bg-red-50"><TrashIcon /> Move to Bin</DropdownItem></DropdownMenu></div>
                          <p className="text-sm text-slate-500">Teacher: {teachers.find(t => t.id === q.teacherId)?.firstName || 'N/A'}</p>
                          <p className="text-sm text-slate-500">Questions: {q.questions.length}</p>
                      </div>
                  ))}
              </div>
          </div>
      )}

        {currentTab === 'users' && (
            <div className="space-y-4">
                 <p className="text-slate-600">Manage all teacher and student accounts in your organization.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h2 className="font-bold text-xl mb-2">Teachers & Admins ({teachers.length})</h2>
                        <div className="bg-white rounded-lg shadow-sm p-4 space-y-2 max-h-[60vh] overflow-y-auto">
                            {teachers.map(t => (
                                <div key={t.id} className="flex justify-between items-center p-2 bg-slate-50 rounded">
                                    <div>
                                        <p className="font-semibold">{t.firstName} {t.lastName} <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${t.role === UserRole.ADMIN ? 'bg-blue-200 text-blue-800' : 'bg-green-200 text-green-800'}`}>{t.role}</span></p>
                                        <p className="text-sm text-slate-600">{t.email}</p>
                                    </div>
                                    {t.role !== UserRole.ADMIN && (
                                        <button onClick={() => setUserToDelete(t)} className="bg-red-100 text-red-700 px-3 py-1 rounded text-xs font-bold hover:bg-red-200 transition">DELETE</button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                     <div>
                        <h2 className="font-bold text-xl mb-2">Students ({students.length})</h2>
                        <div className="bg-white rounded-lg shadow-sm p-4 space-y-2 max-h-[60vh] overflow-y-auto">
                            {students.map(s => (
                                <div key={s.id} className="flex justify-between items-center p-2 bg-slate-50 rounded">
                                    <div>
                                        <p className="font-semibold">{s.firstName} {s.lastName}</p>
                                        <p className="text-sm text-slate-600">{s.email}</p>
                                    </div>
                                    <button onClick={() => setUserToDelete(s)} className="bg-red-100 text-red-700 px-3 py-1 rounded text-xs font-bold hover:bg-red-200 transition">DELETE</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )}

        <div className="mt-8 flex justify-end gap-4">
             <button onClick={() => setModalState({type: 'recycleBin'})} className="flex items-center text-slate-600 font-semibold px-4 py-2 rounded-lg hover:bg-slate-200 transition"><RecycleBinIcon/> {t('recycle_bin')}</button>
             <label className="flex items-center cursor-pointer text-slate-600 font-semibold px-4 py-2 rounded-lg hover:bg-slate-200 transition"><span>{t('show_archived')}</span><input type="checkbox" checked={showArchived} onChange={() => setShowArchived(!showArchived)} className="ms-2 h-5 w-5"/></label>
        </div>

    </div>
    
    {modalState?.type === 'createClass' && <CreateClassModal teachers={teachers.filter(t => t.role === UserRole.TEACHER)} adminId={user.id} onClose={() => setModalState(null)} onClassCreated={fetchData} />}
    {modalState?.type === 'manageClass' && <ManageClassModal classItem={modalState.data} allStudents={students} allTeachers={teachers} onClose={() => setModalState(null)} onUpdate={fetchData} />}
    {modalState?.type === 'analytics' && <QuizAnalyticsModal quiz={modalState.data} onClose={() => setModalState(null)} />}
    {modalState?.type === 'recycleBin' && user.organizationId && <SystemRecycleBinModal onClose={() => setModalState(null)} onUpdate={fetchData} organizationId={user.organizationId}/>}
    {itemToDelete && <DeleteConfirmationModal title={`Move ${itemToDelete.type} to Recycle Bin`} message={`Are you sure you want to move "${itemToDelete.name}" to the bin?`} onConfirm={handleConfirmDelete} onClose={() => setItemToDelete(null)} confirmText="Move to Bin"/>}
    {userToDelete && (
        <DeleteConfirmationModal
            title={`Delete User: ${userToDelete.firstName} ${userToDelete.lastName}`}
            message={`Are you sure you want to permanently delete this user? This is irreversible and will remove all associated data. ${userToDelete.role === UserRole.TEACHER ? 'You can only delete teachers who have no active classes or quizzes.' : ''}`}
            onConfirm={handleConfirmUserDelete}
            onClose={() => setUserToDelete(null)}
            confirmText="Yes, Permanently Delete"
        />
    )}

    </>
  );
};
