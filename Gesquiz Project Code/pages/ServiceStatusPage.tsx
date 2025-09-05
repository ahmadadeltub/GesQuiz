import React from 'react';

const StatusIndicator: React.FC<{ label: string; }> = ({ label }) => (
    <div className="flex justify-between items-center p-6 bg-white rounded-lg shadow-sm border border-gray-200">
        <p className="text-lg font-medium text-gray-800">{label}</p>
        <div className="flex items-center">
            <div className="h-4 w-4 bg-green-500 rounded-full animate-pulse mr-2"></div>
            <p className="font-semibold text-green-700">Operational</p>
        </div>
    </div>
);

export const ServiceStatusPage: React.FC = () => {
    return (
        <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 min-h-screen">
            <div className="max-w-4xl mx-auto">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl tracking-tight">
                        Service Status
                    </h1>
                    <p className="mt-4 text-xl text-gray-600">
                        Current status of all GesQuiz systems.
                    </p>
                </div>

                <div className="mt-12 bg-green-100 border-l-4 border-green-500 text-green-800 p-4 rounded-r-lg mb-8" role="alert">
                    <p className="font-bold">All Systems Operational</p>
                </div>

                <div className="space-y-4">
                    <StatusIndicator label="Website & Dashboards" />
                    <StatusIndicator label="Gesture Analysis API" />
                    <StatusIndicator label="Database Services" />
                </div>

                 <div className="mt-12 text-center text-gray-500 text-sm">
                    <p>Last checked: {new Date().toLocaleString()}</p>
                 </div>
            </div>
        </div>
    );
};