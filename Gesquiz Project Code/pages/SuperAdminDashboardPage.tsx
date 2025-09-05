import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { mockDbService } from '../services/mockDbService';
import { Organization } from '../types';
import { DeleteConfirmationModal } from '../components/teacher/modals/DeleteConfirmationModal';

// Icons
const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>;
const XCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg>;

// Component to render a list of organizations
const OrgList: React.FC<{
    orgs: Organization[];
    onApprove?: (id: string) => void;
    onReject?: (id: string) => void;
    onDelete: (org: Organization) => void;
}> = ({ orgs, onApprove, onReject, onDelete }) => {
    if (orgs.length === 0) {
        return <p className="p-10 text-center text-slate-500">No organizations in this category.</p>;
    }
    return (
        <div className="divide-y divide-slate-200">
            {orgs.map(org => (
                <div key={org.id} className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <div className="md:col-span-2 space-y-2">
                        <h3 className="text-lg font-bold text-blue-700">{org.name}</h3>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-slate-600">
                            <p><strong className="font-medium text-slate-800">Website:</strong> {org.website}</p>
                            <p><strong className="font-medium text-slate-800">Mobile:</strong> {org.mobile}</p>
                            <p><strong className="font-medium text-slate-800">Country:</strong> {org.country}</p>
                            <p><strong className="font-medium text-slate-800">Address:</strong> {org.address}</p>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-3 justify-end">
                        {onApprove && onReject && (
                            <>
                                <button
                                    onClick={() => onApprove(org.id)}
                                    className="bg-green-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center justify-center"
                                >
                                    <CheckCircleIcon /> Approve
                                </button>
                                 <button
                                    onClick={() => onReject(org.id)}
                                    className="bg-orange-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-orange-600 transition flex items-center justify-center"
                                >
                                    <XCircleIcon /> Reject
                                </button>
                            </>
                        )}
                        <button
                            onClick={() => onDelete(org)}
                            className="bg-red-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-red-700 transition flex items-center justify-center"
                        >
                            <TrashIcon /> Delete
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};


export const SuperAdminDashboardPage: React.FC = () => {
    const { user } = useAuth();
    const [allOrgs, setAllOrgs] = useState<Organization[]>([]);
    const [orgToDelete, setOrgToDelete] = useState<Organization | null>(null);

    const fetchOrgs = useCallback(() => {
        setAllOrgs(mockDbService.getAllOrganizations());
    }, []);

    useEffect(() => {
        fetchOrgs();
    }, [fetchOrgs]);

    const { pendingOrgs, approvedOrgs, rejectedOrgs } = useMemo(() => {
        return {
            pendingOrgs: allOrgs.filter(o => o.status === 'pending'),
            approvedOrgs: allOrgs.filter(o => o.status === 'approved'),
            rejectedOrgs: allOrgs.filter(o => o.status === 'rejected'),
        };
    }, [allOrgs]);

    const handleApprove = (orgId: string) => {
        mockDbService.approveOrganization(orgId);
        fetchOrgs(); // Refresh the list
    };

    const handleReject = (orgId: string) => {
        mockDbService.rejectOrganization(orgId);
        fetchOrgs(); // Refresh the list
    };
    
    const handleConfirmDelete = () => {
        if (!orgToDelete) return;
        mockDbService.deleteOrganization(orgToDelete.id);
        fetchOrgs();
        setOrgToDelete(null);
    }

    if (!user) {
        return <p>Loading...</p>;
    }

    return (
        <>
            <div className="bg-slate-100 min-h-screen p-8">
                <header className="mb-8">
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Super Admin Dashboard</h1>
                    <p className="text-slate-600 mt-1">Review and manage all organizations.</p>
                </header>

                <div className="space-y-8">
                    {/* Pending Organizations */}
                    <div className="bg-white rounded-xl shadow-lg border border-slate-200">
                        <div className="p-6 border-b">
                            <h2 className="text-xl font-bold text-slate-800">Pending Approvals ({pendingOrgs.length})</h2>
                        </div>
                        <OrgList 
                            orgs={pendingOrgs}
                            onApprove={handleApprove}
                            onReject={handleReject}
                            onDelete={setOrgToDelete}
                        />
                    </div>
                    
                    {/* Approved Organizations */}
                    <div className="bg-white rounded-xl shadow-lg border border-slate-200">
                        <div className="p-6 border-b bg-green-50 rounded-t-xl">
                            <h2 className="text-xl font-bold text-green-800">Approved Organizations ({approvedOrgs.length})</h2>
                        </div>
                         <OrgList 
                            orgs={approvedOrgs}
                            onDelete={setOrgToDelete}
                        />
                    </div>
                    
                    {/* Rejected Organizations */}
                    <div className="bg-white rounded-xl shadow-lg border border-slate-200">
                        <div className="p-6 border-b bg-red-50 rounded-t-xl">
                            <h2 className="text-xl font-bold text-red-800">Rejected Organizations ({rejectedOrgs.length})</h2>
                        </div>
                         <OrgList 
                            orgs={rejectedOrgs}
                            onDelete={setOrgToDelete}
                        />
                    </div>
                </div>
            </div>
            
            {orgToDelete && (
                <DeleteConfirmationModal
                    title={`Delete Organization: ${orgToDelete.name}`}
                    message="Are you sure you want to permanently delete this organization? This will remove all associated users, classes, quizzes, and data. This action cannot be undone."
                    onConfirm={handleConfirmDelete}
                    onClose={() => setOrgToDelete(null)}
                    confirmText="Yes, Delete Permanently"
                />
            )}
        </>
    );
};