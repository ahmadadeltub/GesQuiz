import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../i18n';

// --- SVG Icons for a professional look ---
const TeacherIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-10 w-10"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.228a4.5 4.5 0 00-1.875-1.875C8.344 12.734 7.234 13.5 6 13.5h-1.5a1.5 1.5 0 00-1.5 1.5v1.5m1.5-1.5l-1.5-1.5m0 0A2.25 2.25 0 014.5 9.75l6-6a2.25 2.25 0 013.182 0l6 6a2.25 2.25 0 01-3.182 3.182m0-3.182l-3.182 3.182m0 0l-3.182-3.182" /></svg>;
const StudentIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-10 w-10"><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.905 59.905 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0l-3.32-2.217a1 1 0 01.248-1.631l3.32 2.217zM4.26 10.147l3.32-2.217a1 1 0 011.631.248l3.32 2.217M19.74 10.147l-3.32-2.217a1 1 0 00-1.631.248l-3.32 2.217" /></svg>;
const AiIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-10 w-10"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 01-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 013.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 013.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 01-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.575L16.5 21.75l-.398-1.175a3.375 3.375 0 00-2.456-2.456L12.5 18l1.175-.398a3.375 3.375 0 002.456-2.456L16.5 14.25l.398 1.175a3.375 3.375 0 002.456 2.456L20.5 18l-1.175.398a3.375 3.375 0 00-2.456 2.456z" /></svg>;

const FacebookIcon = () => <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v2.385z"/></svg>;
const XIcon = () => <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>;
const LinkedInIcon = () => <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zM5 8H0v16h5V8zm7.982 0H8.014v16h4.969v-8.399c0-2.198.718-3.694 2.834-3.694 1.948 0 2.518 1.22 2.518 3.792v8.301h4.969v-9.09c0-4.484-2.336-6.615-5.34-6.615-2.512 0-3.878 1.4-4.524 2.585V8z"/></svg>;
const InstagramIcon = () => <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.012 3.584-.07 4.85c-.148 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.85s.012-3.584.07-4.85c.148-3.225 1.664-4.771 4.919-4.919C8.416 2.175 8.796 2.163 12 2.163zm0 1.442c-3.117 0-3.488.012-4.71.068-2.827.128-4.113 1.4-4.24 4.24-.056 1.22-.067 1.583-.067 4.59s.011 3.37.067 4.59c.127 2.834 1.413 4.113 4.24 4.24 1.222.056 1.593.067 4.71.067s3.488-.011 4.71-.067c2.827-.127 4.113-1.406 4.24-4.24.056-1.22.067-1.583.067-4.59s-.011-3.37-.067-4.59c-.127-2.827-1.413-4.113-4.24-4.24-1.222-.056-1.593-.068-4.71-.068zm0 5.838a4.928 4.928 0 100 9.856 4.928 4.928 0 000-9.856zm0 8.414a3.486 3.486 0 110-6.972 3.486 3.486 0 010 6.972zm6.406-9.84a1.2 1.2 0 100 2.4 1.2 1.2 0 000-2.4z"/></svg>;
const YouTubeIcon = () => <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.823v-7.008l6.09 3.503-6.09 3.505z"/></svg>;


const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
    <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
        <div className="flex items-center justify-center bg-primary/10 rounded-full h-16 w-16 mb-6 text-primary">
            {icon}
        </div>
        <h3 className="text-xl font-bold mb-3 text-gray-900">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{children}</p>
    </div>
);

const HowItWorksStep: React.FC<{ number: string; title: string; description: string; }> = ({ number, title, description }) => (
    <div className="flex flex-col items-center text-center">
        <div className="flex items-center justify-center bg-primary/10 rounded-full h-16 w-16 mb-4 text-primary-dark font-bold text-2xl">
            {number}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 max-w-xs">{description}</p>
    </div>
);

export const HomePage: React.FC = () => {
    const { t } = useTranslation();
    const floatingIcons = [
        { icon: '👍', style: { top: '20%', left: '10%', animationDelay: '0s', fontSize: '4rem' } },
        { icon: '🖐️', style: { top: '50%', left: '85%', animationDelay: '1.5s', fontSize: '6rem' } },
        { icon: '✌️', style: { top: '70%', left: '15%', animationDelay: '3s', fontSize: '5rem' } },
        { icon: '✊', style: { top: '10%', left: '90%', animationDelay: '4.5s', fontSize: '4.5rem' } },
        { icon: '👍', style: { top: '85%', left: '50%', animationDelay: '2s', fontSize: '5.5rem' } },
        { icon: '🖐️', style: { top: '5%', left: '40%', animationDelay: '5s', fontSize: '3.5rem' } },
    ];

    return (
        <div className="bg-white flex flex-col min-h-screen">
            <main className="flex-grow">
                {/* Hero Section */}
                <section className="relative text-white min-h-[70vh] flex items-center justify-center text-center overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-dark z-0"></div>
                    <div className="absolute inset-0 bg-black opacity-10 z-0"></div>

                    <div className="absolute inset-0 z-10" aria-hidden="true">
                        {floatingIcons.map((item, index) => (
                            <span
                                key={index}
                                className="absolute float-icon opacity-20"
                                style={item.style}
                            >
                                {item.icon}
                            </span>
                        ))}
                    </div>

                    <div className="container mx-auto px-6 relative z-20 flex justify-center items-center h-full">
                        <div className="bg-white/20 backdrop-blur-lg p-8 sm:p-12 rounded-2xl shadow-2xl text-center max-w-3xl border border-white/20">
                            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 tracking-tight text-white">{t('home_hero_title')}</h1>
                            <p className="text-lg sm:text-xl max-w-3xl mx-auto mb-8 text-cyan-100">{t('home_hero_subtitle')}</p>
                            <Link to="/signup" className="bg-white text-primary-dark font-bold py-3 px-8 rounded-full hover:bg-cyan-100 transition duration-300 ease-in-out shadow-xl transform hover:scale-105">
                                {t('getStartedForFree')}
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-20 bg-gray-50" aria-labelledby="features-heading">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 id="features-heading" className="text-3xl md:text-4xl font-bold text-gray-900">{t('features_title')}</h2>
                            <p className="text-lg text-gray-600 mt-2 max-w-2xl mx-auto">{t('features_subtitle')}</p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8 text-center md:text-start">
                            <FeatureCard icon={<TeacherIcon />} title={t('feature_1_title')}>
                                {t('feature_1_desc')}
                            </FeatureCard>
                            <FeatureCard icon={<StudentIcon />} title={t('feature_2_title')}>
                                {t('feature_2_desc')}
                            </FeatureCard>
                            <FeatureCard icon={<AiIcon />} title={t('feature_3_title')}>
                                {t('feature_3_desc')}
                            </FeatureCard>
                        </div>
                    </div>
                </section>

                {/* How it works Section */}
                <section className="py-20 bg-white" aria-labelledby="how-it-works-heading">
                    <div className="container mx-auto px-6 text-center">
                         <h2 id="how-it-works-heading" className="text-3xl md:text-4xl font-bold mb-16 text-gray-900">{t('howitworks_title')}</h2>
                         <div className="relative">
                            <div className="hidden md:block absolute top-8 left-0 w-full h-0.5 bg-gray-200" aria-hidden="true"></div>
                            <div className="grid md:grid-cols-3 gap-y-12 md:gap-x-8">
                                <HowItWorksStep number="1" title={t('step_1_title')} description={t('step_1_desc')}/>
                                <HowItWorksStep number="2" title={t('step_2_title')} description={t('step_2_desc')}/>
                                <HowItWorksStep number="3" title={t('step_3_title')} description={t('step_3_desc')}/>
                            </div>
                         </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="bg-gray-50">
                    <div className="container mx-auto px-6 py-20 text-center">
                        <h2 className="text-3xl font-bold text-gray-900">{t('cta_title')}</h2>
                        <p className="text-lg text-gray-600 mt-2 mb-8">{t('cta_subtitle')}</p>
                        <Link to="/signup" className="bg-secondary text-white font-bold py-3 px-8 rounded-full hover:bg-secondary-dark transition duration-300 ease-in-out shadow-lg transform hover:scale-105">
                            {t('signUpNow')}
                        </Link>
                    </div>
                </section>
            </main>
            
             <footer className="bg-gray-800 text-white">
                <div className="container mx-auto px-6 py-12">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8">
                        {/* Column 1: Logo */}
                        <div className="col-span-2 sm:col-span-3 md:col-span-1">
                            <h3 className="text-xl font-bold">
                                <span role="img" aria-label="hand wave">👋</span> {t('gesquiz')}
                            </h3>
                            <p className="text-gray-400 text-sm mt-2">Interactive learning, redefined.</p>
                        </div>

                        {/* Column 2: Product */}
                        <div>
                            <h4 className="font-semibold text-gray-300 tracking-wider uppercase">{t('footer_product')}</h4>
                            <ul className="mt-4 space-y-2 text-gray-400 text-sm">
                                <li><Link to="/why-gesquiz" className="hover:text-white transition-colors">{t('footer_why')}</Link></li>
                                <li><Link to="/schools" className="hover:text-white transition-colors">{t('footer_schools')}</Link></li>
                                <li><Link to="/service-status" className="hover:text-white transition-colors">{t('footer_status')}</Link></li>
                            </ul>
                        </div>

                        {/* Column 3: Company */}
                        <div>
                            <h4 className="font-semibold text-gray-300 tracking-wider uppercase">{t('footer_company')}</h4>
                            <ul className="mt-4 space-y-2 text-gray-400 text-sm">
                                <li><Link to="/about" className="hover:text-white transition-colors">{t('footer_about')}</Link></li>
                            </ul>
                        </div>

                        {/* Column 4: Legal */}
                        <div>
                            <h4 className="font-semibold text-gray-300 tracking-wider uppercase">{t('footer_legal')}</h4>
                            <ul className="mt-4 space-y-2 text-gray-400 text-sm">
                                <li><Link to="/privacy-policy" className="hover:text-white transition-colors">{t('footer_privacy')}</Link></li>
                                <li><Link to="/cookie-policy" className="hover:text-white transition-colors">{t('footer_cookie')}</Link></li>
                            </ul>
                        </div>
                         {/* Column 5: Contact */}
                        <div>
                            <h4 className="font-semibold text-gray-300 tracking-wider uppercase">{t('footer_contact')}</h4>
                            <ul className="mt-4 space-y-2 text-gray-400 text-sm">
                                <li><a href="mailto:ahmadadeltub@gmail.com" className="hover:text-white transition">ahmadadeltub@gmail.com</a></li>
                                <li><a href="tel:+97466983311" className="hover:text-white transition">🇶🇦 +974-66983311</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-12 border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
                        <div className="text-sm text-gray-400 text-center md:text-start mb-4 md:mb-0">
                            &copy; {new Date().getFullYear()} {t('gesquiz')}. All rights reserved. Developed by Eng.Ahmad Tubaishat.
                        </div>
                        <div className="flex space-x-5">
                            <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Facebook"><FacebookIcon /></a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="X"><XIcon /></a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="LinkedIn"><LinkedInIcon /></a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Instagram"><InstagramIcon /></a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="YouTube"><YouTubeIcon /></a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};
