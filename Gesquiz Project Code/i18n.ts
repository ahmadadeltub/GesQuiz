import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

// 1. All text strings for the application
export const translations = {
    en: {
        // Header & General
        gesquiz: "GesQuiz",
        home: "Home",
        login: "Login",
        signup: "Sign Up",
        logout: "Logout",
        dashboard: "Dashboard",
        welcome: "Welcome",
        viewNotifications: "View notifications",
        // Home Page
        home_hero_title: "The Future of Interactive Quizzes",
        home_hero_subtitle: "Engage your students like never before. Create and take quizzes using simple hand gestures, powered by AI.",
        getStartedForFree: "Get Started for Free",
        features_title: "A Revolutionary Tool for Modern Education",
        features_subtitle: "GesQuiz is designed to be powerful for teachers and fun for students.",
        feature_1_title: "Seamless for Teachers",
        feature_1_desc: "Effortlessly create classes and quizzes. Track student progress with powerful analytics and export reports with ease.",
        feature_2_title: "Engaging for Students",
        feature_2_desc: "Say goodbye to boring tests. Students experience a fun, kinesthetic way to learn by answering with simple hand gestures.",
        feature_3_title: "AI-Powered Recognition",
        feature_3_desc: "Our cutting-edge AI analyzes hand gestures in real-time, delivering instant and accurate feedback for an engaging quiz experience.",
        howitworks_title: "Simple Steps to Get Started",
        step_1_title: "Create or Join",
        step_1_desc: "Admins create an organization. Teachers and students join using a unique organization code.",
        step_2_title: "Show Your Answer",
        step_2_desc: "Students open a quiz and use their camera to answer questions with hand gestures.",
        step_3_title: "Get Instant Results",
        step_3_desc: "Our AI instantly checks the gesture, provides feedback, and records the score.",
        cta_title: "Ready to transform your classroom?",
        cta_subtitle: "Join hundreds of innovative educators and students today.",
        signUpNow: "Sign Up Now",
        // Footer
        footer_product: "Product",
        footer_why: "Why GesQuiz?",
        footer_schools: "For Schools & Districts",
        footer_status: "Service Status",
        footer_company: "Company",
        footer_about: "About",
        footer_legal: "Legal",
        footer_privacy: "Privacy Policy",
        footer_cookie: "Cookie Policy",
        footer_contact: "Contact",
        // Login Page
        // FIX: Add missing translation key for login page.
        welcomeMessage: "Welcome to {{name}}",
        login_welcome_back: "Welcome back! Please enter your details.",
        email_address: "Email Address",
        password: "Password",
        dont_have_account: "Don't have an account?",
        // Signup Page
        create_account: "Create Account",
        join_organization: "Join Organization",
        create_organization: "Create Organization",
        your_details: "Your Details",
        first_name: "First Name",
        middle_name: "Middle Name",
        last_name: "Last Name",
        confirm_password: "Confirm Password",
        organization_details: "Organization Details",
        org_name: "Organization Name",
        org_website: "Website",
        org_mobile: "Mobile Number",
        org_country: "Country",
        org_address: "Address",
        org_approval_note: "Your organization will be submitted for approval. You will be notified via email.",
        org_code: "Organization Code",
        org_code_placeholder: "ASK YOUR ADMIN FOR THIS CODE",
        i_am_a: "I am a...",
        student: "Student",
        teacher: "Teacher",
        already_have_account: "Already have an account?",
        passwords_do_not_match: "Passwords do not match.",
        // Teacher Dashboard
        teacher_dashboard: "Teacher Dashboard",
        teacher_welcome: "Welcome back, {{name}}! This is your command center for creating engaging, gesture-based learning experiences.",
        active_classes: "Active Classes",
        active_quizzes: "Active Quizzes",
        total_students: "Total Students",
        total_attempts: "Total Attempts",
        analytics: "Analytics",
        analytics_desc: "Get a quick overview of how your quizzes and classes are performing. Use this data to identify topics that need more attention and to see which classes are most engaged.",
        quiz_performance: "Quiz Performance (Avg. Score %)",
        class_performance: "Class Performance (Avg. Score %)",
        my_classes: "My Classes",
        my_classes_desc: "Manage your student groups, view rosters, and monitor leaderboards.",
        search_classes: "Search classes...",
        my_quizzes: "My Quizzes",
        my_quizzes_desc: "Create, edit, assign, and review analytics for all your quizzes.",
        search_quizzes: "Search quizzes...",
        create_class: "Create Class",
        create_quiz: "Create Quiz",
        create_with_ai: "Create with AI",
        recycle_bin: "Recycle Bin",
        show_archived: "Show Archived",
        manage_class: "Manage Class",
        assign: "Assign",
        // Student Dashboard
        student_dashboard: "Student Dashboard",
        student_welcome: "Welcome, {{name}}! Ready to test your knowledge?",
        quizzes_to_do: "Quizzes To Do",
        quizzes_completed: "Quizzes Completed",
        average_score: "Average Score",
        total_points: "Total Points",
        my_recent_progress: "My Recent Progress",
        my_quizzes_student: "My Quizzes",
        no_active_quizzes: "You have no active quizzes right now. Join a class to get started!",
        join_new_class: "Join a New Class",
        enter_class_code: "Enter Class Code",
        join_class: "Join Class",
        leaderboard: "Leaderboard",
        show_my_archived_quizzes: "Show My Archived Quizzes",
        // Admin Dashboard
        admin_dashboard: "Admin: {{name}}",
        admin_welcome: "Welcome! This is your central hub for managing your entire organization's classes, quizzes, users, and analytics.",
        your_org_code: "Your Organization Code",
        teachers: "Teachers",
        // FIX: Add missing translation key for admin dashboard.
        students: "Students",
        classes: "Classes",
        quizzes: "Quizzes",
        users: "Users",
    },
    ar: {
        // Header & General
        gesquiz: "جيس كويز",
        home: "الرئيسية",
        login: "تسجيل الدخول",
        signup: "إنشاء حساب",
        logout: "تسجيل الخروج",
        dashboard: "لوحة التحكم",
        welcome: "أهلاً بك",
        viewNotifications: "عرض الإشعارات",
        // Home Page
        home_hero_title: "مستقبل الاختبارات التفاعلية",
        home_hero_subtitle: "أشرك طلابك بشكل لم يسبق له مثيل. أنشئ وشارك في الاختبارات باستخدام إيماءات اليد البسيطة، المدعومة بالذكاء الاصطناعي.",
        getStartedForFree: "ابدأ مجانًا",
        features_title: "أداة ثورية للتعليم الحديث",
        features_subtitle: "تم تصميم GesQuiz ليكون قويًا للمعلمين وممتعًا للطلاب.",
        feature_1_title: "سلس للمعلمين",
        feature_1_desc: "أنشئ الفصول والاختبارات بسهولة. تتبع تقدم الطلاب بتحليلات قوية وقم بتصدير التقارير بسهولة.",
        feature_2_title: "جذاب للطلاب",
        feature_2_desc: "وداعًا للاختبارات المملة. يختبر الطلاب طريقة ممتعة وحركية للتعلم من خلال الإجابة بإيماءات اليد البسيطة.",
        feature_3_title: "مدعوم بالذكاء الاصطناعي",
        feature_3_desc: "يقوم الذكاء الاصطناعي المتطور لدينا بتحليل إيماءات اليد في الوقت الفعلي، مما يوفر ملاحظات فورية ودقيقة لتجربة اختبار جذابة.",
        howitworks_title: "خطوات بسيطة للبدء",
        step_1_title: "أنشئ أو انضم",
        step_1_desc: "يقوم المسؤولون بإنشاء منظمة. ينضم المعلمون والطلاب باستخدام رمز منظمة فريد.",
        step_2_title: "أظهر إجابتك",
        step_2_desc: "يفتح الطلاب اختبارًا ويستخدمون الكاميرا للإجابة على الأسئلة بإيماءات اليد.",
        step_3_title: "احصل على نتائج فورية",
        step_3_desc: "يتحقق الذكاء الاصطناعي لدينا على الفور من الإيماءة، ويقدم ملاحظات، ويسجل النتيجة.",
        cta_title: "هل أنت مستعد لتغيير فصلك الدراسي؟",
        cta_subtitle: "انضم إلى مئات المعلمين والطلاب المبتكرين اليوم.",
        signUpNow: "سجل الآن",
        // Footer
        footer_product: "المنتج",
        footer_why: "لماذا GesQuiz؟",
        footer_schools: "للمدارس والمناطق التعليمية",
        footer_status: "حالة الخدمة",
        footer_company: "الشركة",
        footer_about: "من نحن",
        footer_legal: "قانوني",
        footer_privacy: "سياسة الخصوصية",
        footer_cookie: "سياسة ملفات تعريف الارتباط",
        footer_contact: "اتصل بنا",
        // Login Page
        // FIX: Add missing translation key for login page.
        welcomeMessage: "أهلاً بك في {{name}}",
        login_welcome_back: "مرحبًا بعودتك! الرجاء إدخال التفاصيل الخاصة بك.",
        email_address: "البريد الإلكتروني",
        password: "كلمة المرور",
        dont_have_account: "ليس لديك حساب؟",
        // Signup Page
        create_account: "إنشاء حساب",
        join_organization: "الانضمام إلى منظمة",
        create_organization: "إنشاء منظمة",
        your_details: "تفاصيلك الشخصية",
        first_name: "الاسم الأول",
        middle_name: "الاسم الأوسط",
        last_name: "الاسم الأخير",
        confirm_password: "تأكيد كلمة المرور",
        organization_details: "تفاصيل المنظمة",
        org_name: "اسم المنظمة",
        org_website: "الموقع الإلكتروني",
        org_mobile: "رقم الجوال",
        org_country: "الدولة",
        org_address: "العنوان",
        org_approval_note: "سيتم تقديم منظمتك للموافقة عليها. سيتم إعلامك عبر البريد الإلكتروني.",
        org_code: "رمز المنظمة",
        org_code_placeholder: "اطلب هذا الرمز من المسؤول",
        i_am_a: "أنا...",
        student: "طالب",
        teacher: "معلم",
        already_have_account: "هل لديك حساب بالفعل؟",
        passwords_do_not_match: "كلمات المرور غير متطابقة.",
        // Teacher Dashboard
        teacher_dashboard: "لوحة تحكم المعلم",
        teacher_welcome: "مرحباً بعودتك، {{name}}! هذا هو مركز قيادتك لإنشاء تجارب تعليمية تفاعلية قائمة على الإيماءات.",
        active_classes: "الفصول النشطة",
        active_quizzes: "الاختبارات النشطة",
        total_students: "إجمالي الطلاب",
        total_attempts: "إجمالي المحاولات",
        analytics: "التحليلات",
        analytics_desc: "احصل على نظرة عامة سريعة على أداء اختباراتك وفصولك الدراسية. استخدم هذه البيانات لتحديد الموضوعات التي تحتاج إلى مزيد من الاهتمام ولمعرفة الفصول الأكثر تفاعلاً.",
        quiz_performance: "أداء الاختبارات (متوسط الدرجات %)",
        class_performance: "أداء الفصول (متوسط الدرجات %)",
        my_classes: "فصولي الدراسية",
        my_classes_desc: "قم بإدارة مجموعات طلابك، وعرض القوائم، ومراقبة لوحات المتصدرين.",
        search_classes: "ابحث عن الفصول...",
        my_quizzes: "اختباراتي",
        my_quizzes_desc: "أنشئ وحرر وعيّن وراجع تحليلات جميع اختباراتك.",
        search_quizzes: "ابحث عن الاختبارات...",
        create_class: "إنشاء فصل",
        create_quiz: "إنشاء اختبار",
        create_with_ai: "إنشاء بواسطة الذكاء الاصطناعي",
        recycle_bin: "سلة المحذوفات",
        show_archived: "عرض المؤرشفة",
        manage_class: "إدارة الفصل",
        assign: "تعيين",
        // Student Dashboard
        student_dashboard: "لوحة تحكم الطالب",
        student_welcome: "أهلاً بك، {{name}}! هل أنت مستعد لاختبار معلوماتك؟",
        quizzes_to_do: "اختبارات قادمة",
        quizzes_completed: "اختبارات مكتملة",
        average_score: "متوسط الدرجات",
        total_points: "مجموع النقاط",
        my_recent_progress: "تقدمي الأخير",
        my_quizzes_student: "اختباراتي",
        no_active_quizzes: "ليس لديك اختبارات نشطة في الوقت الحالي. انضم إلى فصل للبدء!",
        join_new_class: "الانضمام إلى فصل جديد",
        enter_class_code: "أدخل رمز الفصل",
        join_class: "انضم للفصل",
        leaderboard: "لوحة المتصدرين",
        show_my_archived_quizzes: "عرض اختباراتي المؤرشفة",
        // Admin Dashboard
        admin_dashboard: "مسؤول: {{name}}",
        admin_welcome: "أهلاً بك! هذا هو مركزك الرئيسي لإدارة فصول مؤسستك واختباراتها ومستخدميها وتحليلاتها بالكامل.",
        your_org_code: "رمز منظمتك",
        teachers: "المعلمون",
        // FIX: Add missing translation key for admin dashboard.
        students: "الطلاب",
        classes: "الفصول",
        quizzes: "الاختبارات",
        users: "المستخدمون",
    }
};

type Language = 'en' | 'ar';

// 2. Context for language
interface LanguageContextType {
    language: Language;
    setLanguage: (language: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// 3. Provider component
export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<Language>(
        (localStorage.getItem('gesquiz_language') as Language) || 'en'
    );

    useEffect(() => {
        localStorage.setItem('gesquiz_language', language);
        document.documentElement.lang = language;
        document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    }, [language]);
    
    const value = { language, setLanguage };

    // FIX: A .ts file cannot contain JSX. Replaced with React.createElement to fix parsing errors.
    return React.createElement(LanguageContext.Provider, { value }, children);
};

// 4. Custom hooks
export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};

export const useTranslation = () => {
    const { language } = useLanguage();
    
    const t = (key: keyof typeof translations.en, params?: { [key: string]: string | number }) => {
        let text = translations[language][key] || translations.en[key] || key;
        if (params) {
            Object.keys(params).forEach(paramKey => {
                text = text.replace(`{{${paramKey}}}`, String(params[paramKey]));
            });
        }
        return text;
    };

    return { t, language };
};