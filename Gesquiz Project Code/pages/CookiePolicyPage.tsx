import React from 'react';

export const CookiePolicyPage: React.FC = () => {
    return (
        <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white p-8 sm:p-12 rounded-xl shadow-lg">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl tracking-tight">
                        Cookie Policy
                    </h1>
                    <p className="mt-4 text-xl text-gray-600">
                        Last Updated: {new Date().toLocaleDateString()}
                    </p>
                </div>

                <div className="mt-12 space-y-8 text-lg text-gray-700 leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-bold text-gray-800 mb-3">What are cookies?</h2>
                        <p>
                            A cookie is a small text file that a website saves on your computer or mobile device when you visit the site. It enables the website to remember your actions and preferences (such as login, language, font size and other display preferences) over a period of time, so you don’t have to keep re-entering them whenever you come back to the site or browse from one page to another.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-800 mb-3">How we use cookies</h2>
                        <p>
                            GesQuiz uses cookies for essential functions only. We do not use cookies for tracking, advertising, or any non-essential purposes. Our use is limited to:
                        </p>
                        <ul className="list-disc list-inside mt-4 space-y-2">
                            <li>
                                <strong>Authentication:</strong> When you log in to your GesQuiz account, we use a cookie to keep you logged in as you navigate through the application. This allows you to access your dashboard and other protected areas without having to enter your password on every page.
                            </li>
                            <li>
                                <strong>Session Management:</strong> This cookie is fundamental to the operation of the site, helping us maintain your session securely and reliably.
                            </li>
                        </ul>
                    </section>

                     <section>
                        <h2 className="text-2xl font-bold text-gray-800 mb-3">Your Choices</h2>
                        <p>
                            Because our cookies are strictly necessary for the application to function correctly, we do not provide an option to disable them. If you configure your browser to block these cookies, you will not be able to log in or use the GesQuiz platform.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};