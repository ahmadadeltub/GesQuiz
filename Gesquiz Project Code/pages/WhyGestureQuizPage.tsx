import React from 'react';

const Feature: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-3">{title}</h2>
        <p>{children}</p>
    </div>
);

export const WhyGestureQuizPage: React.FC = () => {
    return (
        <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white p-8 sm:p-12 rounded-xl shadow-lg">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl tracking-tight">
                        Why GesQuiz?
                    </h1>
                    <p className="mt-4 text-xl text-gray-600">
                        We're transforming passive screen time into active learning experiences.
                    </p>
                </div>

                <div className="mt-12 space-y-8 text-lg text-gray-700 leading-relaxed">
                    <Feature title="Boost Engagement with Kinesthetic Learning">
                        Learning isn't just a mental exercise; it's a physical one too. Studies show that when students use their bodies to learn, they are more engaged, retain information longer, and develop a deeper understanding of the material. GesQuiz turns every question into an opportunity for physical participation, converting passive quizzes into active, memorable challenges.
                    </Feature>

                    <Feature title="Intuitive for Students, Powerful for Teachers">
                        For students, it's as simple as showing a hand gesture. The fun, game-like experience reduces test anxiety and makes learning exciting. For teachers, our platform offers a streamlined way to create and assign quizzes, track student progress with detailed analytics, and identify areas where students are struggling, all from one intuitive dashboard.
                    </Feature>

                    <Feature title="Powered by Cutting-Edge AI">
                        At the heart of GesQuiz is a powerful AI model that provides instant, accurate feedback on hand gestures. This real-time interaction keeps students focused and motivated, providing the immediate reinforcement that is crucial for effective learning. It's a seamless blend of pedagogy and technology, designed for the modern classroom.
                    </Feature>
                </div>
            </div>
        </div>
    );
};