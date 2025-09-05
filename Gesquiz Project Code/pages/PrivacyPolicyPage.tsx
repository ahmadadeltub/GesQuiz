import React from 'react';

export const PrivacyPolicyPage: React.FC = () => {
    return (
        <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white p-8 sm:p-12 rounded-xl shadow-lg">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl tracking-tight">
                        Privacy Policy
                    </h1>
                    <p className="mt-4 text-xl text-gray-600">
                        Your privacy is important to us.
                    </p>
                </div>

                <div className="mt-12 space-y-8 text-lg text-gray-700 leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-bold text-gray-800 mb-3">1. Information We Collect</h2>
                        <p>We collect information to provide and improve our services. This includes:</p>
                        <ul className="list-disc list-inside mt-4 space-y-2">
                            <li><strong>Account Information:</strong> When you sign up as a user (Student, Teacher, or Admin), we collect your name, email address, and password.</li>
                            <li><strong>Organization Information:</strong> When an Admin creates an organization, we collect the organization's name, contact details, and other relevant information required for setup and approval.</li>
                            <li><strong>User-Generated Content:</strong> We store the classes, quizzes, questions, and assignments that teachers and admins create.</li>
                            <li><strong>Quiz Data:</strong> We store students' quiz attempts, scores, and answers to provide teachers and admins with analytics.</li>
                        </ul>
                    </section>

                    <section className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
                        <h2 className="text-2xl font-bold text-gray-800 mb-3">2. Gesture & Camera Data</h2>
                        <p className="font-semibold text-blue-800">
                            Your privacy during quizzes is our top priority. The images captured from your camera are processed in real-time for gesture analysis and are <strong className="underline">never stored on our servers</strong> or saved in any form.
                        </p>
                        <p className="mt-2 text-blue-700">
                            The analysis happens ephemerally; the image data is sent to the AI model, a response is received, and the image is immediately and permanently discarded. We do not have access to, nor can we retrieve, any video or image feed from your sessions.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-800 mb-3">3. How We Use Information</h2>
                        <p>We use the information we collect to:</p>
                        <ul className="list-disc list-inside mt-4 space-y-2">
                            <li>Provide, operate, and maintain our services.</li>
                            <li>Allow teachers to track student progress and performance.</li>
                            <li>Improve and personalize our services.</li>
                            <li>Manage user accounts and organization memberships.</li>
                            <li>Communicate with you, including for customer support and to send important service-related notices.</li>
                        </ul>
                    </section>
                    
                    <section>
                        <h2 className="text-2xl font-bold text-gray-800 mb-3">4. Data Security</h2>
                        <p>
                            We are committed to protecting your data. We use industry-standard practices to safeguard the information we store. All user data is segregated by organization to ensure that users from one school cannot access data from another.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-800 mb-3">5. Changes to This Policy</h2>
                        <p>
                            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};
