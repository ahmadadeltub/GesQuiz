import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../types';
import { useTranslation } from '../i18n';

// Icons for role selection
const TeacherIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-8 w-8 mb-2"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.228a4.5 4.5 0 00-1.875-1.875C8.344 12.734 7.234 13.5 6 13.5h-1.5a1.5 1.5 0 00-1.5 1.5v1.5m1.5-1.5l-1.5-1.5m0 0A2.25 2.25 0 014.5 9.75l6-6a2.25 2.25 0 013.182 0l6 6a2.25 2.25 0 01-3.182 3.182m0-3.182l-3.182 3.182m0 0l-3.182-3.182" /></svg>;
const StudentIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-8 w-8 mb-2"><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.905 59.905 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0l-3.32-2.217a1 1 0 01.248-1.631l3.32 2.217zM4.26 10.147l3.32-2.217a1 1 0 011.631.248l3.32 2.217M19.74 10.147l-3.32-2.217a1 1 0 00-1.631.248l-3.32 2.217" /></svg>;

const countries = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan",
  "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi",
  "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo, Democratic Republic of the", "Congo, Republic of the", "Costa Rica", "Cote d'Ivoire", "Croatia", "Cuba", "Cyprus", "Czech Republic",
  "Denmark", "Djibouti", "Dominica", "Dominican Republic",
  "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia",
  "Fiji", "Finland", "France",
  "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana",
  "Haiti", "Honduras", "Hungary",
  "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy",
  "Jamaica", "Japan", "Jordan",
  "Kazakhstan", "Kenya", "Kiribati", "Kosovo", "Kuwait", "Kyrgyzstan",
  "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg",
  "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar",
  "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway",
  "Oman",
  "Pakistan", "Palau", "Palestine State", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal",
  "Qatar",
  "Romania", "Russia", "Rwanda",
  "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria",
  "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu",
  "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States of America", "Uruguay", "Uzbekistan",
  "Vanuatu", "Vatican City", "Venezuela", "Vietnam",
  "Yemen",
  "Zambia", "Zimbabwe"
];

const Illustration = () => (
    <div className="hidden md:block w-1/2 bg-gradient-to-br from-primary to-primary-dark p-12 text-white flex flex-col justify-center rounded-l-2xl">
        <h1 className="text-3xl font-bold mb-4">
             Join the Future of Learning
        </h1>
        <p className="text-blue-100">
            Create an account to start building interactive quizzes or join your organization to participate in gesture-based learning.
        </p>
         <div className="mt-8 text-center">
            <span className="text-8xl opacity-50">✌️</span>
        </div>
    </div>
);

export const SignupPage: React.FC = () => {
  const [mode, setMode] = useState<'join' | 'create'>('join');
  const [formData, setFormData] = useState({
      firstName: '', middleName: '', lastName: '', email: '', password: '', confirmPassword: '',
      orgName: '', orgCode: '',
      orgWebsite: '', orgMobile: '', orgAddress: '', orgCountry: '',
  });
  const [role, setRole] = useState<UserRole>(UserRole.STUDENT);
  const [error, setError] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setFormData({...formData, [e.target.id]: e.target.value});
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const { email, firstName, lastName, middleName, password, confirmPassword, orgCode, orgName, orgWebsite, orgMobile, orgAddress, orgCountry } = formData;
    
    if (!email || !firstName || !lastName || !password) {
      setError('First name, last name, email, and password are required.'); return;
    }
    if (password !== confirmPassword) {
        setError(t('passwords_do_not_match')); return;
    }
    if (mode === 'join' && !orgCode) {
        setError('Organization code is required to join.'); return;
    }
    if (mode === 'create') {
        if(!orgName || !orgWebsite || !orgMobile || !orgAddress || !orgCountry) {
            setError('All organization details are required.'); return;
        }
    }

    const signupResult = signup({
        email, password_input: password, firstName, middleName, lastName,
        role: mode === 'join' ? role : undefined,
        orgCode: mode === 'join' ? orgCode : undefined,
        orgName: mode === 'create' ? orgName : undefined,
        orgWebsite: mode === 'create' ? orgWebsite : undefined,
        orgMobile: mode === 'create' ? orgMobile : undefined,
        orgAddress: mode === 'create' ? orgAddress : undefined,
        orgCountry: mode === 'create' ? orgCountry : undefined,
    });

    if (signupResult.user) {
        const userRole = signupResult.user.role;
        if(userRole === UserRole.ADMIN) navigate('/admin');
        else if (userRole === UserRole.TEACHER) navigate('/teacher');
        else if (userRole === UserRole.SUPER_ADMIN) navigate('/superadmin');
        else navigate('/student');
    } else {
      setError(signupResult.error || 'An unknown error occurred.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-xl flex">
            <Illustration />
            <div className="w-full md:w-1/2 p-8 md:p-12">
                 <h2 className="text-3xl font-bold text-slate-800 mb-2">{t('create_account')}</h2>
                 <div className="mb-6">
                    <div className="flex w-full bg-slate-200 p-1 rounded-lg">
                        <button onClick={() => setMode('join')} className={`w-1/2 py-2 rounded-md font-semibold transition-colors ${mode === 'join' ? 'bg-white shadow' : 'text-slate-600'}`}>{t('join_organization')}</button>
                        <button onClick={() => setMode('create')} className={`w-1/2 py-2 rounded-md font-semibold transition-colors ${mode === 'create' ? 'bg-white shadow' : 'text-slate-600'}`}>{t('create_organization')}</button>
                    </div>
                 </div>

                 <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-4">
                    {error && <p className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center font-medium">{error}</p>}
                    
                    <h3 className="text-lg font-semibold border-b border-slate-200 pb-2 text-slate-700">{t('your_details')}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                       <div className="sm:col-span-1">
                            <label htmlFor="firstName" className="block text-slate-600 font-medium mb-1 text-sm">{t('first_name')}</label>
                            <input type="text" id="firstName" value={formData.firstName} onChange={handleInputChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg" required />
                       </div>
                       <div className="sm:col-span-1">
                            <label htmlFor="middleName" className="block text-slate-600 font-medium mb-1 text-sm">{t('middle_name')}</label>
                            <input type="text" id="middleName" value={formData.middleName} onChange={handleInputChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg" />
                       </div>
                       <div className="sm:col-span-1">
                            <label htmlFor="lastName" className="block text-slate-600 font-medium mb-1 text-sm">{t('last_name')}</label>
                            <input type="text" id="lastName" value={formData.lastName} onChange={handleInputChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg" required />
                       </div>
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-slate-600 font-medium mb-1 text-sm">{t('email_address')}</label>
                        <input type="email" id="email" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg" required />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="password" className="block text-slate-600 font-medium mb-1 text-sm">{t('password')}</label>
                            <input type="password" id="password" value={formData.password} onChange={handleInputChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg" required />
                        </div>
                        <div>
                            <label htmlFor="confirmPassword" className="block text-slate-600 font-medium mb-1 text-sm">{t('confirm_password')}</label>
                            <input type="password" id="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg" required />
                        </div>
                    </div>

                    <h3 className="text-lg font-semibold border-b border-slate-200 pb-2 pt-4 text-slate-700">{t('organization_details')}</h3>
                    {mode === 'create' ? (
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="orgName" className="block text-slate-600 font-medium mb-1 text-sm">{t('org_name')}</label>
                                <input type="text" id="orgName" value={formData.orgName} onChange={handleInputChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg" required />
                             </div>
                             <div>
                                <label htmlFor="orgWebsite" className="block text-slate-600 font-medium mb-1 text-sm">{t('org_website')}</label>
                                <input type="text" id="orgWebsite" value={formData.orgWebsite} onChange={handleInputChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg" required />
                             </div>
                             <div>
                                <label htmlFor="orgMobile" className="block text-slate-600 font-medium mb-1 text-sm">{t('org_mobile')}</label>
                                <input type="text" id="orgMobile" value={formData.orgMobile} onChange={handleInputChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg" required />
                             </div>
                              <div>
                                <label htmlFor="orgCountry" className="block text-slate-600 font-medium mb-1 text-sm">{t('org_country')}</label>
                                 <select id="orgCountry" value={formData.orgCountry} onChange={handleInputChange} className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg" required>
                                    <option value="" disabled>Select a country...</option>
                                    {countries.map(country => <option key={country} value={country}>{country}</option>)}
                                </select>
                             </div>
                             <div className="sm:col-span-2">
                                <label htmlFor="orgAddress" className="block text-slate-600 font-medium mb-1 text-sm">{t('org_address')}</label>
                                <input type="text" id="orgAddress" value={formData.orgAddress} onChange={handleInputChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg" required />
                             </div>
                             <p className="sm:col-span-2 text-xs text-slate-500">{t('org_approval_note')}</p>
                         </div>
                    ) : (
                         <div>
                            <label htmlFor="orgCode" className="block text-slate-600 font-medium mb-1 text-sm">{t('org_code')}</label>
                            <input type="text" id="orgCode" value={formData.orgCode} onChange={handleInputChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg uppercase" placeholder={t('org_code_placeholder')} required />
                         </div>
                    )}
                    
                    {mode === 'join' && (
                      <div>
                        <label className="block text-slate-600 font-medium mb-2 text-sm">{t('i_am_a')}</label>
                        <div className="grid grid-cols-2 gap-4">
                           <button type="button" onClick={() => setRole(UserRole.STUDENT)} className={`flex flex-col items-center justify-center p-4 rounded-lg text-center transition duration-300 border-2 ${role === UserRole.STUDENT ? 'bg-primary-light/10 border-primary' : 'bg-slate-100 border-slate-200'}`}><StudentIcon /> <span className="font-semibold">{t('student')}</span></button>
                           <button type="button" onClick={() => setRole(UserRole.TEACHER)} className={`flex flex-col items-center justify-center p-4 rounded-lg text-center transition duration-300 border-2 ${role === UserRole.TEACHER ? 'bg-primary-light/10 border-primary' : 'bg-slate-100 border-slate-200'}`}><TeacherIcon /> <span className="font-semibold">{t('teacher')}</span></button>
                        </div>
                      </div>
                    )}
                    
                    <button type="submit" className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary-dark transition-colors duration-300">{t('create_account')}</button>
                </form>

                <p className="text-center mt-6 text-slate-600">
                    {t('already_have_account')}{' '}
                    <Link to="/login" className="text-primary hover:underline font-medium">{t('login')}</Link>
                </p>
            </div>
        </div>
    </div>
  );
};
