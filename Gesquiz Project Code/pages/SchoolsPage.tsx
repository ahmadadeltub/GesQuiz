import React from 'react';
import { Link } from 'react-router-dom';

const FeaturePill: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <span className="inline-block bg-blue-100 text-blue-800 text-base font-semibold px-4 py-2 rounded-full">
        {children}
    </span>
);

export const SchoolsPage: React.FC = () => {
    return (
        <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white p-8 sm:p-12 rounded-xl shadow-lg">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl tracking-tight">
                        Built for Schools & Districts
                    </h1>
                    <p className="mt-4 text-xl text-gray-600">
                        A powerful, secure, and easy-to-manage platform for your entire institution.
                    </p>
                </div>

                <div className="mt-12 space-y-10 text-lg text-gray-700 leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Centralized Control for Administrators</h2>
                        <p>
                            The GesQuiz Admin Dashboard provides a comprehensive overview of your entire organization. From a single interface, you can manage users, oversee content creation, and monitor platform engagement. Our tools are designed to give you the insights you need without the complexity.
                        </p>
                        <div className="mt-6 flex flex-wrap gap-4">
                            <FeaturePill>User Management</FeaturePill>
                            <FeaturePill>System-Wide Analytics</FeaturePill>
                            <FeaturePill>Content Oversight</FeaturePill>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Data Privacy and Security First</h2>
                        <p>
                            We understand that protecting student and teacher data is paramount. Our platform is built on a multi-tenant architecture, which means your organization's data is completely segregated and inaccessible to other institutions. Each school operates in its own secure environment.
                        </p>
                         <div className="mt-6 flex flex-wrap gap-4">
                            <FeaturePill>Organization Data Segregation</FeaturePill>
                            <FeaturePill>Role-Based Access Control</FeaturePill>
                            <FeaturePill>Secure Signup Process</FeaturePill>
                        </div>
                    </section>
                    
                    <section>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Seamless Onboarding for Everyone</h2>
                        <p>
                           Getting your school started with GesQuiz is simple. As an administrator, you create your organization and receive a unique, shareable code. Teachers and students can then sign up and join your organization instantly using this code, placing them directly into your managed environment. It's a frictionless process designed to get your classes up and running in minutes.
                        </p>
                    </section>

                    <div className="text-center mt-16">
                        <Link 
                            to="/signup" 
                            className="inline-block bg-blue-600 text-white font-bold py-4 px-10 rounded-full hover:bg-blue-700 transition duration-300 ease-in-out shadow-lg transform hover:scale-105"
                        >
                            Create Your Organization Today
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};