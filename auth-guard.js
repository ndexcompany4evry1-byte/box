mport { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCiwkEOGzJwplGbdGd35oVk-54fMz0T838",
    authDomain: "poch-ntification.firebaseapp.com",
    databaseURL: "https://poch-ntification-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "poch-ntification",
    storageBucket: "poch-ntification.firebasestorage.app",
    messagingSenderId: "169375707704",
    appId: "1:169375707704:web:cff7f29e9bbaf40ea72ccd",
    measurementId: "G-X3C2EDECME"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

function createOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'auth-guard-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.background = 'rgba(15, 23, 42, 0.92)';
    overlay.style.color = '#f8fafc';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.zIndex = '99999';
    overlay.style.padding = '24px';
    overlay.style.textAlign = 'center';
    overlay.style.backdropFilter = 'blur(8px)';

    const card = document.createElement('div');
    card.style.maxWidth = '500px';
    card.style.width = '100%';
    card.style.padding = '36px 28px';
    card.style.borderRadius = '24px';
    card.style.boxShadow = '0 25px 80px rgba(0, 0, 0, 0.35)';
    card.style.background = 'rgba(15, 23, 42, 0.98)';
    card.style.border = '1px solid rgba(255,255,255,0.08)';

    const title = document.createElement('h2');
    title.textContent = 'نرجو منكم تسجيل دخول للمتابعة';
    title.style.marginBottom = '18px';
    title.style.fontSize = '1.8rem';
    title.style.lineHeight = '1.2';
    title.style.color = '#f8fafc';

    const description = document.createElement('p');
    description.textContent = 'هذه الصفحة محمية، يجب تسجيل الدخول قبل المتابعة.';
    description.style.marginBottom = '24px';
    description.style.fontSize = '1rem';
    description.style.opacity = '0.85';
    description.style.color = '#e2e8f0';

    const button = document.createElement('a');
    button.href = 'login.html';
    button.textContent = 'اذهب إلى تسجيل الدخول';
    button.style.display = 'inline-block';
    button.style.padding = '12px 24px';
    button.style.borderRadius = '999px';
    button.style.background = 'linear-gradient(135deg, #6366F1, #8B5CF6)';
    button.style.color = '#ffffff';
    button.style.fontWeight = '700';
    button.style.boxShadow = '0 16px 36px rgba(99,102,241,0.30)';
    button.style.textDecoration = 'none';
    button.style.transition = 'transform 0.2s ease';
    button.onmouseover = () => button.style.transform = 'translateY(-2px)';
    button.onmouseout = () => button.style.transform = 'translateY(0)';

    card.appendChild(title);
    card.appendChild(description);
    card.appendChild(button);
    overlay.appendChild(card);

    return overlay;
}

function lockPage() {
    if (document.getElementById('auth-guard-overlay')) return;
    document.body.appendChild(createOverlay());
    document.body.style.overflow = 'hidden';
}

function initAuthGuard() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            const authUser = {
                uid: user.uid || '',
                email: user.email || '',
                displayName: user.displayName || '',
                photoURL: user.photoURL || ''
            };
            localStorage.setItem('authUser', JSON.stringify(authUser));
            if (window.refreshProfile) window.refreshProfile();
            return;
        }

        localStorage.removeItem('authUser');
        lockPage();
    }, (error) => {
        console.error('Firebase Auth error:', error);
        localStorage.removeItem('authUser');
        lockPage();
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAuthGuard);
} else {
    initAuthGuard();
}

if (window.refreshProfile) window.refreshProfile();
