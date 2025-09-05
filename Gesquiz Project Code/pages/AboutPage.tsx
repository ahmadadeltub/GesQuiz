import React from 'react';

export const AboutPage: React.FC = () => {
    return (
        <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white p-8 sm:p-12 rounded-xl shadow-lg">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl tracking-tight">
                        About GesQuiz
                    </h1>
                    <p className="mt-4 text-xl text-gray-600">
                        Our mission is to make learning active, engaging, and fun.
                    </p>
                </div>

                <div className="mt-12 space-y-8 text-lg text-gray-700 leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-bold text-gray-800 mb-3">Our Story</h2>
                        <p>
                            GesQuiz was born from a simple observation: learning has become too passive. In an age of endless screen time, students are often expected to absorb information through clicks and taps, disconnecting them from the physical world and from the joy of active participation. We wanted to change that.
                        </p>
                        <p className="mt-4">
                            We envisioned a platform where technology didn't just present information, but created an experience. A platform where students could use their bodies to interact with learning materials, transforming a simple quiz into an exciting challenge. By bridging the gap between digital content and physical action, we aim to re-ignite the spark of curiosity in every student.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-800 mb-3">Our Vision</h2>
                        <p>
                            Our vision is a world where every classroom is a hub of energy and engagement. We believe that by incorporating physical interaction into digital learning, we can improve not only knowledge retention but also student well-being. GesQuiz is our first step towards this future—a future where education is not just about knowing, but about doing.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};