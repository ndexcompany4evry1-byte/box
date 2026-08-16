(function() {
  const supportedLangs = [
    'ar', 'en', 'fr', 'es', 'de', 'it', 'pt', 'tr', 'ru', 'zh', 'ja',
    'ko', 'hi', 'ur', 'nl', 'pl', 'id', 'fa', 'bn', 'vi'
  ];
  const defaultLang = 'ar';
  const storageKey = 'ndex-language';
  const settingsStorageKey = 'ndex-settings';
  const defaultSettings = {
    theme: 'dark',
    region: 'auto',
    scale: 'normal'
  };

  const translations = {
    ar: {
      toggleLang: 'English',
      about: 'من نحن',
      contact: 'اتصل بنا',
      privacy: 'الخصوصية',
      terms: 'الشروط',
      orderProduct: 'طلب المنتج',
      copyright: '© 2026 جميع الحقوق محفوظة',
      heroTitle: 'منتجاتي الاحترافية',
      heroDesc: 'تصميمات فاخرة، تنفيذ دقيق، وتجربة مستخدم لا تُضاهى',
      serviceBusinessTitle: 'بطاقة مهنية فاخرة',
      serviceBusinessDesc: 'تصميم أنيق يعكس هويتك الاحترافية — جاهزة للطباعة أو المشاركة الرقمية',
      serviceNfcTitle: 'بطاقة NFC ذكية',
      serviceNfcDesc: 'انقر مرة واحدة لفتح صفحتك المهنية — تدعم روابط ديناميكية وتحديثات لحظية',
      serviceDashboardTitle: 'لوحة مهنية شخصية',
      serviceDashboardDesc: 'صفحة مخصصة تعرض معلوماتك، خدماتك، وروابط التواصل — مع دعم QR وNFC',
      loginTitle: 'مرحباً بعودتك',
      loginSubtitle: 'سجّل دخولك للمتابعة',
      registerTitle: 'إنشاء حساب جديد',
      registerSubtitle: 'انضم إلينا وابدأ رحلتك الرقمية',
      forgotTitle: 'نسيت كلمة المرور؟',
      forgotSubtitle: 'أدخل بريدك الإلكتروني وسنرسل لك تعليمات الاستعادة',
      authEmailLabel: 'البريد الإلكتروني',
      authPasswordLabel: 'كلمة المرور',
      authConfirmPasswordLabel: 'تأكيد كلمة المرور',
      authRememberText: 'تذكرني',
      authForgotLink: 'نسيت كلمة المرور؟',
      authLoginButton: 'تسجيل الدخول',
      authRegisterButton: 'إنشاء الحساب',
      authResetButton: 'إرسال رابط الاستعادة',
      authSignupText: 'لديك حساب بالفعل؟',
      authSignupLink: 'سجّل دخولك',
      authLoginText: 'ليس لديك حساب؟',
      authLoginLink: 'إنشئ حساباً',
      orderBusinessAr: 'طلب بطاقة مهنية فاخرة',
      orderNfcAr: 'طلب بطاقة NFC ذكية',
      orderDashboardAr: 'طلب لوحة مهنية شخصية',
      redirectMessageAr: 'شكراً لاهتمامك! سيتم تحويلك الآن...',
      rememberText: 'تذكرني',
      searchPlaceholder: 'ابحث عن صفحة، مطعم أو مقهى...',
      profileName: 'الملف الشخصي',
      logout: 'تسجيل خروج',
      settingsLink: 'الإعدادات',
      settingsTitle: 'الإعدادات',
      settingsLanguage: 'لغة الواجهة',
      settingsChooseLanguage: 'اختر اللغة التي تريد استخدامها في الموقع',
      settingsBack: 'العودة إلى الصفحة الرئيسية',
      settingsAppearance: 'المظهر',
      settingsTheme: 'نمط الواجهة',
      settingsThemeDescription: 'اختر طريقة عرض الموقع بالكامل',
      themeDark: 'داكن',
      themeLight: 'فاتح',
      themeSystem: 'حسب النظام',
      settingsRegion: 'اللغة والمنطقة',
      settingsRegionDescription: 'تستخدم المنطقة لتنسيق التواريخ والعملات',
      settingsDateFormat: 'المنطقة',
      settingsScale: 'حجم النص والواجهة',
      settingsScaleDescription: 'كبّر أو صغّر عناصر الموقع لتناسب شاشتك',
      settingsScaleSmall: 'صغير',
      settingsScaleNormal: 'عادي',
      settingsScaleLarge: 'كبير',
      settingsSaved: 'تم حفظ الإعدادات'
    },
    en: {
      toggleLang: 'عربي',
      about: 'About',
      contact: 'Contact',
      privacy: 'Privacy',
      terms: 'Terms',
      orderProduct: 'Order Product',
      copyright: '© 2026 All rights reserved',
      heroTitle: 'My Premium Products',
      heroDesc: 'Luxurious designs, precise execution, unmatched user experience',
      serviceBusinessTitle: 'Premium Business Card',
      serviceBusinessDesc: 'Elegant design that reflects your professional identity — ready for print or digital sharing',
      serviceNfcTitle: 'Smart NFC Card',
      serviceNfcDesc: 'Tap once to open your profile — supports dynamic links and real-time updates',
      serviceDashboardTitle: 'Personal Professional Dashboard',
      serviceDashboardDesc: 'Custom page showcasing your info, services, and contact links — with QR & NFC support',
      loginTitle: 'Welcome Back',
      loginSubtitle: 'Sign in to continue',
      registerTitle: 'Create New Account',
      registerSubtitle: 'Join us and start your digital journey',
      forgotTitle: 'Forgot Password?',
      forgotSubtitle: 'Enter your email and we will send recovery instructions',
      authEmailLabel: 'Email',
      authPasswordLabel: 'Password',
      authConfirmPasswordLabel: 'Confirm Password',
      authRememberText: 'Remember me',
      authForgotLink: 'Forgot password?',
      authLoginButton: 'Login',
      authRegisterButton: 'Create Account',
      authResetButton: 'Send Reset Link',
      authSignupText: 'Already have an account?',
      authSignupLink: 'Login',
      authLoginText: 'Don’t have an account?',
      authLoginLink: 'Create one',
      orderBusinessAr: 'Order Premium Business Card',
      orderNfcAr: 'Order Smart NFC Card',
      orderDashboardAr: 'Order Personal Professional Dashboard',
      redirectMessageAr: 'Thank you! Redirecting you now...',
      rememberText: 'Remember me',
      searchPlaceholder: 'Search page, restaurant or cafe...',
      profileName: 'Profile',
      logout: 'Logout',
      settingsLink: 'Settings',
      settingsTitle: 'Settings',
      settingsLanguage: 'Interface language',
      settingsChooseLanguage: 'Choose the language you want to use across the site',
      settingsBack: 'Back to home',
      settingsAppearance: 'Appearance',
      settingsTheme: 'Interface theme',
      settingsThemeDescription: 'Choose how the entire site should look',
      themeDark: 'Dark',
      themeLight: 'Light',
      themeSystem: 'System',
      settingsRegion: 'Language & region',
      settingsRegionDescription: 'The region controls date and currency formatting',
      settingsDateFormat: 'Region',
      settingsScale: 'Text & interface size',
      settingsScaleDescription: 'Scale the site to fit your screen',
      settingsScaleSmall: 'Small',
      settingsScaleNormal: 'Normal',
      settingsScaleLarge: 'Large',
      settingsSaved: 'Settings saved'
    }
  };

  const languageNames = {
    ar: 'العربية',
    en: 'English',
    fr: 'Français',
    es: 'Español',
    de: 'Deutsch',
    it: 'Italiano',
    pt: 'Português',
    tr: 'Türkçe',
    ru: 'Русский',
    zh: '中文',
    ja: '日本語',
    ko: '한국어',
    hi: 'हिन्दी',
    ur: 'اردو',
    nl: 'Nederlands',
    pl: 'Polski',
    id: 'Bahasa Indonesia',
    fa: 'فارسی',
    bn: 'বাংলা',
    vi: 'Tiếng Việt'
  };

  const localizedSettings = {
    fr: { settingsTitle: 'Paramètres', settingsAppearance: 'Apparence', settingsThemeDescription: 'Choisissez l’apparence de tout le site', settingsRegion: 'Langue et région', settingsRegionDescription: 'La région contrôle le format des dates et des devises', settingsDateFormat: 'Région', settingsScale: 'Taille du texte et de l’interface', settingsScaleDescription: 'Adaptez le site à votre écran', themeDark: 'Sombre', themeLight: 'Clair', themeSystem: 'Système', settingsScaleSmall: 'Petite', settingsScaleNormal: 'Normale', settingsScaleLarge: 'Grande', settingsBack: 'Retour à l’accueil' },
    es: { settingsTitle: 'Configuración', settingsAppearance: 'Apariencia', settingsThemeDescription: 'Elige el aspecto de todo el sitio', settingsRegion: 'Idioma y región', settingsRegionDescription: 'La región controla el formato de fechas y monedas', settingsDateFormat: 'Región', settingsScale: 'Tamaño del texto y la interfaz', settingsScaleDescription: 'Adapta el sitio a tu pantalla', themeDark: 'Oscuro', themeLight: 'Claro', themeSystem: 'Sistema', settingsScaleSmall: 'Pequeño', settingsScaleNormal: 'Normal', settingsScaleLarge: 'Grande', settingsBack: 'Volver al inicio' },
    de: { settingsTitle: 'Einstellungen', settingsAppearance: 'Darstellung', settingsThemeDescription: 'Wähle das Erscheinungsbild der gesamten Website', settingsRegion: 'Sprache und Region', settingsRegionDescription: 'Die Region steuert das Format von Datum und Währung', settingsDateFormat: 'Region', settingsScale: 'Text- und Oberflächengröße', settingsScaleDescription: 'Passe die Website an deinen Bildschirm an', themeDark: 'Dunkel', themeLight: 'Hell', themeSystem: 'System', settingsScaleSmall: 'Klein', settingsScaleNormal: 'Normal', settingsScaleLarge: 'Groß', settingsBack: 'Zur Startseite' },
    it: { settingsTitle: 'Impostazioni', settingsAppearance: 'Aspetto', settingsThemeDescription: 'Scegli l’aspetto dell’intero sito', settingsRegion: 'Lingua e regione', settingsRegionDescription: 'La regione controlla il formato di date e valute', settingsDateFormat: 'Regione', settingsScale: 'Dimensione del testo e dell’interfaccia', settingsScaleDescription: 'Adatta il sito al tuo schermo', themeDark: 'Scuro', themeLight: 'Chiaro', themeSystem: 'Sistema', settingsScaleSmall: 'Piccola', settingsScaleNormal: 'Normale', settingsScaleLarge: 'Grande', settingsBack: 'Torna alla home' },
    pt: { settingsTitle: 'Configurações', settingsAppearance: 'Aparência', settingsThemeDescription: 'Escolha a aparência de todo o site', settingsRegion: 'Idioma e região', settingsRegionDescription: 'A região controla o formato de datas e moedas', settingsDateFormat: 'Região', settingsScale: 'Tamanho do texto e da interface', settingsScaleDescription: 'Ajuste o site à sua tela', themeDark: 'Escuro', themeLight: 'Claro', themeSystem: 'Sistema', settingsScaleSmall: 'Pequeno', settingsScaleNormal: 'Normal', settingsScaleLarge: 'Grande', settingsBack: 'Voltar ao início' },
    tr: { settingsTitle: 'Ayarlar', settingsAppearance: 'Görünüm', settingsThemeDescription: 'Tüm sitenin görünümünü seçin', settingsRegion: 'Dil ve bölge', settingsRegionDescription: 'Bölge, tarih ve para birimi biçimini belirler', settingsDateFormat: 'Bölge', settingsScale: 'Metin ve arayüz boyutu', settingsScaleDescription: 'Siteyi ekranınıza göre ölçeklendirin', themeDark: 'Koyu', themeLight: 'Açık', themeSystem: 'Sistem', settingsScaleSmall: 'Küçük', settingsScaleNormal: 'Normal', settingsScaleLarge: 'Büyük', settingsBack: 'Ana sayfaya dön' },
    ru: { settingsTitle: 'Настройки', settingsAppearance: 'Внешний вид', settingsThemeDescription: 'Выберите оформление всего сайта', settingsRegion: 'Язык и регион', settingsRegionDescription: 'Регион определяет формат дат и валют', settingsDateFormat: 'Регион', settingsScale: 'Размер текста и интерфейса', settingsScaleDescription: 'Настройте сайт под свой экран', themeDark: 'Тёмная', themeLight: 'Светлая', themeSystem: 'Системная', settingsScaleSmall: 'Маленький', settingsScaleNormal: 'Обычный', settingsScaleLarge: 'Большой', settingsBack: 'На главную' },
    zh: { settingsTitle: '设置', settingsAppearance: '外观', settingsThemeDescription: '选择整个网站的显示方式', settingsRegion: '语言和地区', settingsRegionDescription: '地区决定日期和货币格式', settingsDateFormat: '地区', settingsScale: '文字和界面大小', settingsScaleDescription: '调整网站以适应屏幕', themeDark: '深色', themeLight: '浅色', themeSystem: '跟随系统', settingsScaleSmall: '小', settingsScaleNormal: '标准', settingsScaleLarge: '大', settingsBack: '返回首页' },
    ja: { settingsTitle: '設定', settingsAppearance: '外観', settingsThemeDescription: 'サイト全体の表示方法を選択', settingsRegion: '言語と地域', settingsRegionDescription: '地域によって日付と通貨の形式が変わります', settingsDateFormat: '地域', settingsScale: '文字とインターフェースのサイズ', settingsScaleDescription: '画面に合わせてサイトを調整', themeDark: 'ダーク', themeLight: 'ライト', themeSystem: 'システム', settingsScaleSmall: '小', settingsScaleNormal: '標準', settingsScaleLarge: '大', settingsBack: 'ホームに戻る' },
    ko: { settingsTitle: '설정', settingsAppearance: '모양', settingsThemeDescription: '사이트 전체의 표시 방식을 선택하세요', settingsRegion: '언어 및 지역', settingsRegionDescription: '지역에 따라 날짜와 통화 형식이 결정됩니다', settingsDateFormat: '지역', settingsScale: '텍스트 및 인터페이스 크기', settingsScaleDescription: '화면에 맞게 사이트 크기를 조절하세요', themeDark: '어두운 테마', themeLight: '밝은 테마', themeSystem: '시스템', settingsScaleSmall: '작게', settingsScaleNormal: '보통', settingsScaleLarge: '크게', settingsBack: '홈으로 돌아가기' },
    hi: { settingsTitle: 'सेटिंग्स', settingsAppearance: 'दिखावट', settingsThemeDescription: 'पूरी साइट का रूप चुनें', settingsRegion: 'भाषा और क्षेत्र', settingsRegionDescription: 'क्षेत्र दिनांक और मुद्रा का प्रारूप तय करता है', settingsDateFormat: 'क्षेत्र', settingsScale: 'टेक्स्ट और इंटरफ़ेस आकार', settingsScaleDescription: 'साइट को अपनी स्क्रीन के अनुसार बदलें', themeDark: 'डार्क', themeLight: 'लाइट', themeSystem: 'सिस्टम', settingsScaleSmall: 'छोटा', settingsScaleNormal: 'सामान्य', settingsScaleLarge: 'बड़ा', settingsBack: 'होम पर लौटें' },
    ur: { settingsTitle: 'ترتیبات', settingsAppearance: 'ظاہری شکل', settingsThemeDescription: 'پوری سائٹ کی ظاہری شکل منتخب کریں', settingsRegion: 'زبان اور خطہ', settingsRegionDescription: 'خطہ تاریخ اور کرنسی کی شکل متعین کرتا ہے', settingsDateFormat: 'خطہ', settingsScale: 'متن اور انٹرفیس کا سائز', settingsScaleDescription: 'سائٹ کو اپنی اسکرین کے مطابق کریں', themeDark: 'ڈارک', themeLight: 'لائٹ', themeSystem: 'سسٹم', settingsScaleSmall: 'چھوٹا', settingsScaleNormal: 'عام', settingsScaleLarge: 'بڑا', settingsBack: 'ہوم پر واپس جائیں' },
    nl: { settingsTitle: 'Instellingen', settingsAppearance: 'Weergave', settingsThemeDescription: 'Kies het uiterlijk van de hele site', settingsRegion: 'Taal en regio', settingsRegionDescription: 'De regio bepaalt de notatie van datums en valuta', settingsDateFormat: 'Regio', settingsScale: 'Tekst- en interfacegrootte', settingsScaleDescription: 'Pas de site aan je scherm aan', themeDark: 'Donker', themeLight: 'Licht', themeSystem: 'Systeem', settingsScaleSmall: 'Klein', settingsScaleNormal: 'Normaal', settingsScaleLarge: 'Groot', settingsBack: 'Terug naar home' },
    pl: { settingsTitle: 'Ustawienia', settingsAppearance: 'Wygląd', settingsThemeDescription: 'Wybierz wygląd całej witryny', settingsRegion: 'Język i region', settingsRegionDescription: 'Region określa format dat i walut', settingsDateFormat: 'Region', settingsScale: 'Rozmiar tekstu i interfejsu', settingsScaleDescription: 'Dopasuj witrynę do ekranu', themeDark: 'Ciemny', themeLight: 'Jasny', themeSystem: 'Systemowy', settingsScaleSmall: 'Mały', settingsScaleNormal: 'Normalny', settingsScaleLarge: 'Duży', settingsBack: 'Wróć do strony głównej' },
    id: { settingsTitle: 'Pengaturan', settingsAppearance: 'Tampilan', settingsThemeDescription: 'Pilih tampilan seluruh situs', settingsRegion: 'Bahasa dan wilayah', settingsRegionDescription: 'Wilayah mengatur format tanggal dan mata uang', settingsDateFormat: 'Wilayah', settingsScale: 'Ukuran teks dan antarmuka', settingsScaleDescription: 'Sesuaikan situs dengan layar Anda', themeDark: 'Gelap', themeLight: 'Terang', themeSystem: 'Sistem', settingsScaleSmall: 'Kecil', settingsScaleNormal: 'Normal', settingsScaleLarge: 'Besar', settingsBack: 'Kembali ke beranda' },
    fa: { settingsTitle: 'تنظیمات', settingsAppearance: 'ظاهر', settingsThemeDescription: 'ظاهر کل سایت را انتخاب کنید', settingsRegion: 'زبان و منطقه', settingsRegionDescription: 'منطقه قالب تاریخ و ارز را تعیین می‌کند', settingsDateFormat: 'منطقه', settingsScale: 'اندازه متن و رابط کاربری', settingsScaleDescription: 'اندازه سایت را با صفحه خود هماهنگ کنید', themeDark: 'تیره', themeLight: 'روشن', themeSystem: 'سیستم', settingsScaleSmall: 'کوچک', settingsScaleNormal: 'عادی', settingsScaleLarge: 'بزرگ', settingsBack: 'بازگشت به خانه' },
    bn: { settingsTitle: 'সেটিংস', settingsAppearance: 'চেহারা', settingsThemeDescription: 'পুরো সাইটের চেহারা বেছে নিন', settingsRegion: 'ভাষা ও অঞ্চল', settingsRegionDescription: 'অঞ্চল তারিখ ও মুদ্রার বিন্যাস নির্ধারণ করে', settingsDateFormat: 'অঞ্চল', settingsScale: 'টেক্সট ও ইন্টারফেসের আকার', settingsScaleDescription: 'আপনার স্ক্রিন অনুযায়ী সাইট সামঞ্জস্য করুন', themeDark: 'ডার্ক', themeLight: 'লাইট', themeSystem: 'সিস্টেম', settingsScaleSmall: 'ছোট', settingsScaleNormal: 'স্বাভাবিক', settingsScaleLarge: 'বড়', settingsBack: 'হোমে ফিরে যান' },
    vi: { settingsTitle: 'Cài đặt', settingsAppearance: 'Giao diện', settingsThemeDescription: 'Chọn giao diện cho toàn bộ trang web', settingsRegion: 'Ngôn ngữ và khu vực', settingsRegionDescription: 'Khu vực quyết định định dạng ngày và tiền tệ', settingsDateFormat: 'Khu vực', settingsScale: 'Cỡ chữ và giao diện', settingsScaleDescription: 'Điều chỉnh trang web theo màn hình của bạn', themeDark: 'Tối', themeLight: 'Sáng', themeSystem: 'Theo hệ thống', settingsScaleSmall: 'Nhỏ', settingsScaleNormal: 'Bình thường', settingsScaleLarge: 'Lớn', settingsBack: 'Về trang chủ' }
  };

  const localizedCommon = {
    fr: { about: 'À propos', contact: 'Contact', privacy: 'Confidentialité', terms: 'Conditions', copyright: '© 2026 Tous droits réservés', orderProduct: 'Commander' },
    es: { about: 'Sobre nosotros', contact: 'Contacto', privacy: 'Privacidad', terms: 'Términos', copyright: '© 2026 Todos los derechos reservados', orderProduct: 'Pedir producto' },
    de: { about: 'Über uns', contact: 'Kontakt', privacy: 'Datenschutz', terms: 'Bedingungen', copyright: '© 2026 Alle Rechte vorbehalten', orderProduct: 'Produkt bestellen' },
    it: { about: 'Chi siamo', contact: 'Contatti', privacy: 'Privacy', terms: 'Termini', copyright: '© 2026 Tutti i diritti riservati', orderProduct: 'Ordina prodotto' },
    pt: { about: 'Sobre nós', contact: 'Contato', privacy: 'Privacidade', terms: 'Termos', copyright: '© 2026 Todos os direitos reservados', orderProduct: 'Pedir produto' },
    tr: { about: 'Hakkımızda', contact: 'İletişim', privacy: 'Gizlilik', terms: 'Koşullar', copyright: '© 2026 Tüm hakları saklıdır', orderProduct: 'Ürün sipariş et' },
    ru: { about: 'О нас', contact: 'Контакты', privacy: 'Конфиденциальность', terms: 'Условия', copyright: '© 2026 Все права защищены', orderProduct: 'Заказать товар' },
    zh: { about: '关于我们', contact: '联系我们', privacy: '隐私', terms: '条款', copyright: '© 2026 版权所有', orderProduct: '订购产品' },
    ja: { about: '私たちについて', contact: 'お問い合わせ', privacy: 'プライバシー', terms: '利用規約', copyright: '© 2026 All rights reserved', orderProduct: '商品を注文' },
    ko: { about: '회사 소개', contact: '문의', privacy: '개인정보 보호', terms: '약관', copyright: '© 2026 모든 권리 보유', orderProduct: '제품 주문' },
    hi: { about: 'हमारे बारे में', contact: 'संपर्क', privacy: 'गोपनीयता', terms: 'शर्तें', copyright: '© 2026 सर्वाधिकार सुरक्षित', orderProduct: 'उत्पाद ऑर्डर करें' },
    ur: { about: 'ہمارے بارے میں', contact: 'رابطہ', privacy: 'رازداری', terms: 'شرائط', copyright: '© 2026 جملہ حقوق محفوظ ہیں', orderProduct: 'پروڈکٹ آرڈر کریں' },
    nl: { about: 'Over ons', contact: 'Contact', privacy: 'Privacy', terms: 'Voorwaarden', copyright: '© 2026 Alle rechten voorbehouden', orderProduct: 'Product bestellen' },
    pl: { about: 'O nas', contact: 'Kontakt', privacy: 'Prywatność', terms: 'Warunki', copyright: '© 2026 Wszelkie prawa zastrzeżone', orderProduct: 'Zamów produkt' },
    id: { about: 'Tentang kami', contact: 'Kontak', privacy: 'Privasi', terms: 'Ketentuan', copyright: '© 2026 Hak cipta dilindungi', orderProduct: 'Pesan produk' },
    fa: { about: 'درباره ما', contact: 'تماس', privacy: 'حریم خصوصی', terms: 'شرایط', copyright: '© ۲۰۲۶ تمامی حقوق محفوظ است', orderProduct: 'سفارش محصول' },
    bn: { about: 'আমাদের সম্পর্কে', contact: 'যোগাযোগ', privacy: 'গোপনীয়তা', terms: 'শর্তাবলি', copyright: '© ২০২৬ সর্বস্বত্ব সংরক্ষিত', orderProduct: 'পণ্য অর্ডার করুন' },
    vi: { about: 'Về chúng tôi', contact: 'Liên hệ', privacy: 'Quyền riêng tư', terms: 'Điều khoản', copyright: '© 2026 Đã đăng ký bản quyền', orderProduct: 'Đặt sản phẩm' }
  };

  supportedLangs.forEach((lang) => {
    if (!translations[lang]) {
      translations[lang] = { ...translations.en, toggleLang: languageNames.en };
    }
    Object.assign(translations[lang], localizedSettings[lang] || {});
    Object.assign(translations[lang], localizedCommon[lang] || {});
  });

  const rtlLangs = new Set(['ar', 'fa', 'ur']);

  const titleMap = {
    '/home.html': {
      ar: 'منتجاتي الاحترافية | Black Luxury',
      en: 'My Premium Products | Black Luxury'
    },
    '/index.html': {
      ar: "N'dex - Modern Landing Page",
      en: "N'dex - Modern Landing Page"
    },
    '/login.html': {
      ar: "تسجيل الدخول - N'dex Card",
      en: 'Login - N\'dex Card'
    },
    '/register.html': {
      ar: 'إنشاء حساب - N\'dex Card',
      en: 'Register - N\'dex Card'
    },
    '/forgot-password.html': {
      ar: 'نسيان كلمة المرور - N\'dex Card',
      en: 'Forgot Password - N\'dex Card'
    },
    '/privacy.html': {
      ar: 'سياسة الخصوصية الشاملة - N\'dex Card',
      en: 'Privacy Policy - N\'dex Card'
    },
    '/terms.html': {
      ar: 'الشروط والأحكام - N\'dex Card',
      en: 'Terms & Conditions - N\'dex Card'
    },
    '/sell-card.html': {
      ar: 'N\'dex – Business Card Generator',
      en: 'N\'dex – Business Card Generator'
    },
    '/settings.html': {
      ar: 'الإعدادات - N\'dex Card',
      en: 'Settings - N\'dex Card'
    }
  };

  const arToEn = {
    'من نحن': 'About',
    'اتصل بنا': 'Contact',
    'الخصوصية': 'Privacy',
    'الشروط': 'Terms',
    '© 2026 جميع الحقوق محفوظة': '© 2026 All rights reserved',
    'منتجاتي الاحترافية': 'My Premium Products',
    'تصميمات فاخرة، تنفيذ دقيق، وتجربة مستخدم لا تُضاهى': 'Luxurious designs, precise execution, unmatched user experience',
    'بطاقة مهنية فاخرة': 'Premium Business Card',
    'تصميم أنيق يعكس هويتك الاحترافية — جاهزة للطباعة أو المشاركة الرقمية': 'Elegant design that reflects your professional identity — ready for print or digital sharing',
    'بطاقة NFC ذكية': 'Smart NFC Card',
    'انقر مرة واحدة لفتح صفحتك المهنية — تدعم روابط ديناميكية وتحديثات لحظية': 'Tap once to open your profile — supports dynamic links and real-time updates',
    'لوحة مهنية شخصية': 'Personal Professional Dashboard',
    'صفحة مخصصة تعرض معلوماتك، خدماتك، وروابط التواصل — مع دعم QR وNFC': 'Custom page showcasing your info, services, and contact links — with QR & NFC support',
    'مرحباً بعودتك': 'Welcome Back',
    'سجّل دخولك للمتابعة': 'Sign in to continue',
    'جوجل': 'Google',
    'GitHub': 'GitHub',
    'البريد الإلكتروني': 'Email',
    'كلمة المرور': 'Password',
    'تذكرني': 'Remember me',
    'نسيت كلمة المرور؟': 'Forgot password?',
    'سجّل دخولك': 'Login',
    'إنشاء حساب جديد': 'Create New Account',
    'انضم إلينا وابدأ رحلتك الرقمية': 'Join us and start your digital journey',
    'نسيت كلمة المرور؟': 'Forgot Password?',
    'أدخل بريدك الإلكتروني وسنرسل لك تعليمات الاستعادة': 'Enter your email and we will send recovery instructions',
    'طلب المنتج': 'Order Product',
    'سيتم التواصل معك قريبًا.': 'We will contact you shortly.',
    'طلب بطاقة مهنية فاخرة': 'Order Premium Business Card',
    'طلب بطاقة NFC ذكية': 'Order Smart NFC Card',
    'طلب لوحة مهنية شخصية': 'Order Personal Professional Dashboard',
    'شكراً لاهتمامك! سيتم تحويلك الآن...': 'Thank you! Redirecting you now...'
  };
  const enToAr = Object.fromEntries(Object.entries(arToEn).map(([ar, en]) => [en, ar]));

  const ignoreTags = ['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA', 'CODE', 'PRE', 'OPTION'];

  function parseQueryLang() {
    const params = new URLSearchParams(location.search);
    const lang = params.get('lang');
    return supportedLangs.includes(lang) ? lang : null;
  }

  function parsePathLang(pathname) {
    const normalized = pathname.replace(/^\/+/, '');
    const parts = normalized.split('/');
    if (parts.length >= 2 && supportedLangs.includes(parts[0])) {
      return parts[0];
    }
    return null;
  }

  function stripLangPrefix(pathname) {
    const normalized = pathname.replace(/^\/+/, '');
    const parts = normalized.split('/');
    if (parts.length >= 2 && supportedLangs.includes(parts[0])) {
      return '/' + parts.slice(1).join('/');
    }
    return pathname.startsWith('/') ? pathname : '/' + pathname;
  }

  const arCountryCodes = new Set(['AE', 'BH', 'DZ', 'EG', 'IQ', 'JO', 'KW', 'LB', 'LY', 'MA', 'MR', 'OM', 'PS', 'QA', 'SA', 'SD', 'SY', 'TN', 'YE']);

  async function detectLangByIp() {
    if (location.protocol !== 'https:') return null;
    try {
      const response = await fetch('https://ipapi.co/json/', { cache: 'force-cache' });
      if (!response.ok) return null;
      const data = await response.json();
      const countryCode = (data.country_code || '').toUpperCase();
      return arCountryCodes.has(countryCode) ? 'ar' : 'en';
    } catch {
      return null;
    }
  }

  function getBrowserLang() {
    const navLang = navigator.language || navigator.userLanguage || '';
    const browserLang = navLang.split('-')[0].toLowerCase();
    if (supportedLangs.includes(browserLang)) return browserLang;
    return 'en';
  }

  function buildLangPath(lang) {
    let actualPath = stripLangPrefix(location.pathname);
    actualPath = actualPath === '/' ? '/index.html' : actualPath;
    const params = new URLSearchParams(location.search);
    params.set('lang', lang);
    return actualPath + (params.toString() ? '?' + params.toString() : '');
  }

  function getStoredLang() {
    try {
      const storedLang = localStorage.getItem(storageKey);
      return supportedLangs.includes(storedLang) ? storedLang : null;
    } catch {
      return null;
    }
  }

  function getSettings() {
    try {
      const stored = JSON.parse(localStorage.getItem(settingsStorageKey) || '{}');
      return { ...defaultSettings, ...stored, theme: 'dark' };
    } catch {
      return { ...defaultSettings };
    }
  }

  function saveSettings(settings) {
    try {
      const settingsToStore = {
        region: settings.region,
        scale: settings.scale
      };
      localStorage.setItem(settingsStorageKey, JSON.stringify(settingsToStore));
    } catch {
      // Private browsing can disable localStorage.
    }
  }

  function resolveTheme(theme) {
    return 'dark';
  }

  function getRegion(settings) {
    if (settings.region !== 'auto') return settings.region;
    return navigator.language || (currentLang === 'ar' ? 'ar-SA' : 'en-US');
  }

  function ensureGlobalSettingsStyles() {
    if (document.getElementById('ndex-global-settings-styles')) return;
    const style = document.createElement('style');
    style.id = 'ndex-global-settings-styles';
    style.textContent = `
      body {
        background-color: #0b0c10 !important;
        color: #f8fafc !important;
      }
    `;
    document.head.appendChild(style);
  }

  function applySystemSettings() {
    const settings = getSettings();
    const root = document.documentElement;
    ensureGlobalSettingsStyles();
    const theme = resolveTheme(settings.theme);
    const scale = { small: '0.9', normal: '1', large: '1.1' }[settings.scale] || '1';

    root.dataset.theme = theme;
    root.dataset.themePreference = 'dark';
    root.style.setProperty('--ndex-ui-scale', scale);
    root.style.setProperty('--ndex-locale', getRegion(settings));
    root.style.colorScheme = theme;
    root.style.fontSize = `${Number(scale) * 100}%`;
  }

  function applySettings(settings) {
    const nextSettings = { ...defaultSettings, ...settings };
    saveSettings(nextSettings);
    applySystemSettings();
    window.dispatchEvent(new CustomEvent('settingschange', { detail: nextSettings }));
  }

  function formatDate(value, options) {
    return new Intl.DateTimeFormat(getRegion(getSettings()), options).format(new Date(value));
  }

  function formatCurrency(value, currency, options) {
    const locale = getRegion(getSettings());
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency || (locale.startsWith('ar') ? 'SAR' : 'USD'),
      ...options
    }).format(value);
  }

  function getPageKey() {
    const pathname = stripLangPrefix(location.pathname);
    const actualPath = pathname === '/' ? '/index.html' : pathname;
    if (titleMap[actualPath]) return actualPath;
    const fileName = actualPath.split('/').pop();
    return titleMap['/' + fileName] ? '/' + fileName : actualPath;
  }

  function setDocumentTitle(lang) {
    const pageKey = getPageKey();
    const titles = titleMap[pageKey] || {};
    document.title = titles[lang] || titles.en || document.title;
  }

  function translateByAttributes(lang) {
    document.querySelectorAll('[data-ar][data-en]').forEach(el => {
      const text = lang === 'ar' ? el.dataset.ar : el.dataset.en;
      if (text !== undefined) {
        el.textContent = text;
      }
    });

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      const value = (translations[lang] && translations[lang][key]) || translations.en[key];
      if (value !== undefined) {
        el.textContent = value;
      }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.dataset.i18nPlaceholder;
      const value = (translations[lang] && translations[lang][key]) || translations.en[key];
      if (value !== undefined) {
        el.placeholder = value;
      }
    });
  }

  function translateTextNodes(lang) {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const parent = node.parentElement;
        if (!parent || ignoreTags.includes(parent.tagName)) return NodeFilter.FILTER_REJECT;
        if (!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });

    while (walker.nextNode()) {
      const node = walker.currentNode;
      const original = node.nodeValue.trim();
      if (lang === 'en' && arToEn[original]) {
        node.nodeValue = node.nodeValue.replace(original, arToEn[original]);
      } else if (lang === 'ar' && enToAr[original]) {
        node.nodeValue = node.nodeValue.replace(original, enToAr[original]);
      }
    }
  }

  function updatePageDirection(lang) {
    document.documentElement.lang = lang;
    document.documentElement.dir = rtlLangs.has(lang) ? 'rtl' : 'ltr';
  }

  function applyTranslations(lang) {
    updatePageDirection(lang);
    setDocumentTitle(lang);
    translateByAttributes(lang);
    translateTextNodes(lang);
  }

  function rememberLang(lang) {
    try {
      localStorage.setItem(storageKey, lang);
    } catch {
      // Private browsing can disable localStorage.
    }
  }

  function isHtmlLink(href) {
    if (!href) return false;
    if (href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:') || href.startsWith('#')) return false;
    const url = new URL(href, location.origin + location.pathname);
    return url.origin === location.origin && url.pathname.endsWith('.html');
  }

  function updateInternalLinks(lang) {
    document.querySelectorAll('a[href]').forEach(anchor => {
      const href = anchor.getAttribute('href');
      if (!isHtmlLink(href)) return;
      const url = new URL(href, location.origin + location.pathname);
      const pathname = stripLangPrefix(url.pathname);
      const actualPath = pathname === '/' ? '/index.html' : pathname;
      anchor.href = actualPath + '?lang=' + lang + url.hash;
    });
  }

  function setHistoryPath(lang, replace = false) {
    const path = buildLangPath(lang);
    const state = { lang, pathname: path };
    if (replace) {
      history.replaceState(state, '', path);
    } else {
      history.pushState(state, '', path);
    }
  }

  function refreshPage(lang, replaceState = false) {
    currentLang = lang;
    window.currentLang = lang;
    applyTranslations(lang);
    window.dispatchEvent(new CustomEvent('languagechange', {
      detail: { lang, initial: isInitializing }
    }));
    updateInternalLinks(lang);
    if (replaceState) {
      setHistoryPath(lang, true);
    }
  }

  async function getInitialLang() {
    const queryLang = parseQueryLang();
    if (queryLang) return queryLang;

    const pathLang = parsePathLang(location.pathname);
    if (supportedLangs.includes(pathLang)) return pathLang;

    const storedLang = getStoredLang();
    if (storedLang) return storedLang;

    const ipLang = await detectLangByIp();
    if (supportedLangs.includes(ipLang)) return ipLang;

    return getBrowserLang();
  }

  let currentLang = defaultLang;
  let isInitializing = true;
  window.currentLang = currentLang;

  async function initLanguage() {
    applySystemSettings();
    currentLang = await getInitialLang();
    window.currentLang = currentLang;
    rememberLang(currentLang);
    refreshPage(currentLang, true);
    isInitializing = false;
  }

  initLanguage();

  window.addEventListener('popstate', async event => {
    const stateLang = event.state?.lang;
    currentLang = supportedLangs.includes(stateLang) ? stateLang : await getInitialLang();
    window.currentLang = currentLang;
    rememberLang(currentLang);
    refreshPage(currentLang, true);
  });

  window.setLanguage = function(lang) {
    if (!supportedLangs.includes(lang)) return;
    rememberLang(lang);
    refreshPage(lang, true);
  };

  window.getNDEXSettings = getSettings;
  window.setNDEXSettings = applySettings;
  window.getNDEXLanguages = () => supportedLangs.map((code) => ({ code, name: languageNames[code] }));
  window.formatNDEXDate = formatDate;
  window.formatNDEXCurrency = formatCurrency;

})();
