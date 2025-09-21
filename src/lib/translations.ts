// Simple translation system for Karigar.AI

export type Language = 'en' | 'hi';

export const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.dashboard': 'Dashboard',
    'nav.products': 'Products',
    'nav.tips': 'Business Tips',
    'nav.chat': 'AI Assistant',
    'nav.analytics': 'Analytics',
    'nav.logout': 'Logout',

    // Auth
    'auth.login': 'Login',
    'auth.signup': 'Sign Up',
    'auth.username': 'Username',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.name': 'Full Name',
    'auth.language': 'Preferred Language',
    'auth.login_button': 'Login to Karigar.AI',
    'auth.signup_button': 'Create Account',
    'auth.switch_login': 'Already have an account? Login',
    'auth.switch_signup': "Don't have an account? Sign up",

    // Hero
    'hero.title': 'Empower Your Artisan Business with AI',
    'hero.subtitle': 'Transform your traditional crafts into thriving online businesses with AI-powered tools designed for local artisans.',
    'hero.cta': 'Start Your Journey',
    'hero.feature1': 'AI Product Listings',
    'hero.feature2': 'Business Insights',
    'hero.feature3': 'Customer Support',

    // Dashboard
    'dashboard.welcome': 'Welcome back',
    'dashboard.total_products': 'Total Products',
    'dashboard.total_views': 'Product Views',
    'dashboard.total_chats': 'AI Conversations',
    'dashboard.recent_products': 'Recent Products',
    'dashboard.view_all': 'View All',

    // Products
    'products.title': 'My Products',
    'products.add_new': 'Add New Product',
    'products.name': 'Product Name',
    'products.description': 'Description',
    'products.price': 'Price',
    'products.category': 'Category',
    'products.image': 'Product Image',
    'products.generate': 'Generate AI Listing',
    'products.save': 'Save Product',
    'products.edit': 'Edit',
    'products.delete': 'Delete',
    'products.views': 'views',

    // Business Tips
    'tips.title': 'Business Tips',
    'tips.generate': 'Get AI Tips',
    'tips.category': 'Category',
    'tips.priority': 'Priority',
    'tips.high': 'High',
    'tips.medium': 'Medium',
    'tips.low': 'Low',

    // Chat
    'chat.title': 'AI Assistant',
    'chat.placeholder': 'Ask me anything about your business...',
    'chat.send': 'Send',
    'chat.thinking': 'Thinking...',

    // Analytics
    'analytics.title': 'Analytics',
    'analytics.overview': 'Overview',
    'analytics.weekly_trend': 'Weekly Trend',

    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.view': 'View',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.close': 'Close',
  },
  hi: {
    // Navigation
    'nav.home': 'होम',
    'nav.dashboard': 'डैशबोर्ड',
    'nav.products': 'उत्पाद',
    'nav.tips': 'व्यापारिक सुझाव',
    'nav.chat': 'AI सहायक',
    'nav.analytics': 'विश्लेषण',
    'nav.logout': 'लॉग आउट',

    // Auth
    'auth.login': 'लॉगिन',
    'auth.signup': 'साइन अप',
    'auth.username': 'उपयोगकर्ता नाम',
    'auth.email': 'ईमेल',
    'auth.password': 'पासवर्ड',
    'auth.name': 'पूरा नाम',
    'auth.language': 'पसंदीदा भाषा',
    'auth.login_button': 'Karigar.AI में लॉगिन',
    'auth.signup_button': 'खाता बनाएं',
    'auth.switch_login': 'पहले से खाता है? लॉगिन करें',
    'auth.switch_signup': 'खाता नहीं है? साइन अप करें',

    // Hero
    'hero.title': 'AI के साथ अपने शिल्प व्यवसाय को सशक्त बनाएं',
    'hero.subtitle': 'स्थानीय कारीगरों के लिए डिज़ाइन किए गए AI-संचालित उपकरणों के साथ अपने पारंपरिक शिल्प को फलते-फूलते ऑनलाइन व्यवसायों में बदलें।',
    'hero.cta': 'अपनी यात्रा शुरू करें',
    'hero.feature1': 'AI उत्पाद सूची',
    'hero.feature2': 'व्यापारिक अंतर्दृष्टि',
    'hero.feature3': 'ग्राहक सहायता',

    // Dashboard
    'dashboard.welcome': 'वापस स्वागत है',
    'dashboard.total_products': 'कुल उत्पाद',
    'dashboard.total_views': 'उत्पाद दृश्य',
    'dashboard.total_chats': 'AI बातचीत',
    'dashboard.recent_products': 'हाल के उत्पाद',
    'dashboard.view_all': 'सभी देखें',

    // Products
    'products.title': 'मेरे उत्पाद',
    'products.add_new': 'नया उत्पाद जोड़ें',
    'products.name': 'उत्पाद का नाम',
    'products.description': 'विवरण',
    'products.price': 'मूल्य',
    'products.category': 'श्रेणी',
    'products.image': 'उत्पाद छवि',
    'products.generate': 'AI सूची उत्पन्न करें',
    'products.save': 'उत्पाद सहेजें',
    'products.edit': 'संपादित करें',
    'products.delete': 'हटाएं',
    'products.views': 'दृश्य',

    // Business Tips
    'tips.title': 'व्यापारिक सुझाव',
    'tips.generate': 'AI सुझाव प्राप्त करें',
    'tips.category': 'श्रेणी',
    'tips.priority': 'प्राथमिकता',
    'tips.high': 'उच्च',
    'tips.medium': 'मध्यम',
    'tips.low': 'कम',

    // Chat
    'chat.title': 'AI सहायक',
    'chat.placeholder': 'अपने व्यवसाय के बारे में कुछ भी पूछें...',
    'chat.send': 'भेजें',
    'chat.thinking': 'सोच रहे हैं...',

    // Analytics
    'analytics.title': 'विश्लेषण',
    'analytics.overview': 'अवलोकन',
    'analytics.weekly_trend': 'साप्ताहिक प्रवृत्ति',

    // Common
    'common.loading': 'लोड हो रहा है...',
    'common.error': 'त्रुटि',
    'common.success': 'सफलता',
    'common.cancel': 'रद्द करें',
    'common.save': 'सहेजें',
    'common.delete': 'हटाएं',
    'common.edit': 'संपादित करें',
    'common.view': 'देखें',
    'common.back': 'वापस',
    'common.next': 'अगला',
    'common.previous': 'पिछला',
    'common.close': 'बंद करें',
  }
};

export function translate(key: string, language: Language = 'en'): string {
  return translations[language][key as keyof typeof translations['en']] || key;
}

export class TranslationService {
  private currentLanguage: Language = 'en';

  setLanguage(language: Language): void {
    this.currentLanguage = language;
  }

  getCurrentLanguage(): Language {
    return this.currentLanguage;
  }

  t(key: string): string {
    return translate(key, this.currentLanguage);
  }
}

export const translationService = new TranslationService();