import React, { useState, useEffect } from 'react';
import { mockDbService } from '../../../services/mockDbService';
import { Class, User } from '../../../types';
import { Modal } from '../../common/Modal';
import { Spinner } from '../../common/Spinner';

interface ManageStudentsModalProps {
    classItem: Class;
    onClose: () => void;
}

export const ManageStudentsModal: React.FC<ManageStudentsModalProps> = ({ classItem, onClose }) => {
    const [students, setStudents] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [uploadFeedback, setUploadFeedback] = useState<{ message: string, errors: string[] } | null>(null);

    useEffect(() => {
        setStudents(mockDbService.getStudentsByClassId(classItem.id));
        setIsLoading(false);
    }, [classItem.id]);

    const handleCsvUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result as string;
            // Basic CSV parsing
            const rows = text.split('\n').slice(1); // Skip header
            const studentsData = rows
                .map(row => {
                    const [firstName, middleName, lastName, email] = row.split(',').map(s => s.trim());
                    return { firstName, middleName, lastName, email };
                })
                .filter(s => s.email);

            if (studentsData.length > 0) {
                const result = mockDbService.addStudentsToClassFromCSV(classItem.id, studentsData);
                setUploadFeedback({
                    message: `Added ${result.added} new students. Skipped ${result.skipped} existing students.`,
                    errors: result.errors,
                });
                // Refresh student list
                setStudents(mockDbService.getStudentsByClassId(classItem.id));
            }
        };
        reader.readAsText(file);
    };

    return (
        <Modal title={`Manage Students: ${classItem.name}`} onClose={onClose} size="xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h4 className="font-semibold text-lg mb-2">Enrolled Students ({students.length})</h4>
                    <div className="border rounded-lg p-2 h-80 overflow-y-auto">
                        {isLoading ? <Spinner /> : (
                            students.length > 0 ? (
                                <ul className="divide-y">
                                    {students.map(student => (
                                        <li key={student.id} className="p-2">{student.firstName} {student.lastName} ({student.email})</li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-center text-gray-500 p-8">No students have joined this class yet.</p>
                            )
                        )}
                    </div>
                </div>
                <div className="space-y-4">
                    <div>
                        <h4 className="font-semibold text-lg mb-2">Add Students via CSV</h4>
                        <p className="text-sm text-gray-600 mb-2">Upload a CSV file with columns: <code>firstName,middleName,lastName,email</code>. The first row should be the header.</p>
                        <input type="file" accept=".csv" onChange={handleCsvUpload} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-light/20 file:text-primary-dark hover:file:bg-primary-light/30"/>
                    </div>
                    {uploadFeedback && (
                        <div className="p-3 bg-blue-50 rounded-lg">
                            <p className="font-semibold text-blue-800">{uploadFeedback.message}</p>
                            {uploadFeedback.errors.length > 0 && (
                                <ul className="text-xs text-red-700 list-disc list-inside mt-2">
                                    {uploadFeedback.errors.map((err, i) => <li key={i}>{err}</li>)}
                                </ul>
                            )}
                        </div>
                    )}
                     <div>
                        <h4 className="font-semibold text-lg mb-2">Share Class Code</h4>
                        <p className="text-sm text-gray-600 mb-2">Students can also join by using this code on the signup page:</p>
                        <p className="font-mono text-xl text-primary-dark bg-primary-light/20 p-3 rounded-lg text-center tracking-widest">{classItem.code}</p>
                    </div>
                </div>
            </div>
        </Modal>
    );
};
