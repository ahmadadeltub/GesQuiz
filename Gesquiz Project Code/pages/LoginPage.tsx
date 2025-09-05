import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../types';
import { useTranslation } from '../i18n';

const Illustration = () => {
    const { t } = useTranslation();
    return (
        <div className="hidden md:block w-1/2 bg-gradient-to-br from-primary to-primary-dark p-12 text-white flex flex-col justify-center rounded-l-2xl">
            <h1 className="text-3xl font-bold mb-4">
                <span role="img" aria-label="hand wave">👋</span> {t('welcomeMessage', { name: 'GesQuiz' })}
            </h1>
            <p className="text-cyan-100">
                The future of interactive learning. Log in to manage your classes, create quizzes, and engage your students like never before.
            </p>
            <div className="mt-8 text-center">
                <span className="text-8xl opacity-50">👍</span>
            </div>
        </div>
    );
};

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    // If the user is already logged in, redirect them to their dashboard.
    if (user) {
      let dashboardPath = '/';
      if (user.role === UserRole.SUPER_ADMIN) dashboardPath = '/superadmin';
      else if (user.role === UserRole.TEACHER) dashboardPath = '/teacher';
      else if (user.role === UserRole.STUDENT) dashboardPath = '/student';
      else if (user.role === UserRole.ADMIN) dashboardPath = '/admin';
      navigate(dashboardPath, { replace: true });
    }
  }, [user, navigate]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }
    const success = login(email, password);
    if (!success) {
      setError('Invalid email or password.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-xl flex">
            <Illustration />
            <div className="w-full md:w-1/2 p-8 md:p-12">
                <h2 className="text-3xl font-bold text-slate-800 mb-2">{t('login')}</h2>
                <p className="text-slate-600 mb-8">{t('login_welcome_back')}</p>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && <div role="alert" className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center">{error}</div>}
                    <div>
                        <label htmlFor="email" className="block text-slate-700 font-medium mb-2">
                            {t('email_address')}
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light"
                            placeholder="you@example.com"
                            required
                            autoComplete="email"
                        />
                    </div>
                    <div>
                        <label htmlFor="password-input" className="block text-slate-700 font-medium mb-2">
                            {t('password')}
                        </label>
                        <input
                            type="password"
                            id="password-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light"
                            placeholder="••••••••"
                            required
                            autoComplete="current-password"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary-dark transition-colors duration-300"
                    >
                        {t('login')}
                    </button>
                </form>
                <p className="text-center mt-6 text-slate-600">
                    {t('dont_have_account')}{' '}
                    <Link to="/signup" className="text-primary hover:underline font-medium">
                        {t('signup')}
                    </Link>
                </p>
            </div>
        </div>
    </div>
  );
};
