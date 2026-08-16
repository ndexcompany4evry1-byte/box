import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";
import { ensureUserProfile, recordLoginEvent } from './database/db-service.js';

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
    overlay.style.background = 'rgba(255, 255, 255, 0.10)';
    overlay.style.color = '#0f172a';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.zIndex = '99999';
    overlay.style.padding = '24px';
    overlay.style.textAlign = 'center';
    overlay.style.backdropFilter = 'blur(8px)';

    const card = document.createElement('div');
    card.style.maxWidth = '440px';
    card.style.width = '100%';
    card.style.padding = '40px 32px';
    card.style.borderRadius = '16px';
    card.style.backgroundColor = '#ffffff';
    card.style.border = '1px solid #e2e8f0';
    card.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)';
    card.style.fontFamily = "system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
    card.style.direction = 'rtl';
    card.style.textAlign = 'right';

    const iconWrapper = document.createElement('div');
    iconWrapper.style.width = '48px';
    iconWrapper.style.height = '48px';
    iconWrapper.style.backgroundColor = '#f1f5f9';
    iconWrapper.style.borderRadius = '12px';
    iconWrapper.style.display = 'flex';
    iconWrapper.style.alignItems = 'center';
    iconWrapper.style.justifyContent = 'center';
    iconWrapper.style.marginBottom = '20px';

    iconWrapper.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#334155" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
      </svg>
    `;

    const title = document.createElement('h2');
    title.textContent = 'تسجيل الدخول مطلوب';
    title.style.margin = '0 0 8px 0';
    title.style.fontSize = '1.35rem';
    title.style.fontWeight = '700';
    title.style.color = '#0f172a';
    title.style.lineHeight = '1.3';

    const description = document.createElement('p');
    description.textContent = 'هذه الصفحة محمية. يرجى تسجيل الدخول باستخدام حسابك للمتابعة والوصول إلى المحتوى.';
    description.style.margin = '0 0 28px 0';
    description.style.fontSize = '0.95rem';
    description.style.color = '#64748b';
    description.style.lineHeight = '1.6';

    const button = document.createElement('a');
    button.href = new URL('/login.html', location.origin).href;
    button.textContent = 'المتابعة إلى تسجيل الدخول';
    button.style.display = 'block';
    button.style.width = '100%';
    button.style.padding = '12px 0';
    button.style.borderRadius = '8px';
    button.style.backgroundColor = '#1e293b';
    button.style.color = '#ffffff';
    button.style.fontSize = '0.95rem';
    button.style.fontWeight = '600';
    button.style.textAlign = 'center';
    button.style.textDecoration = 'none';
    button.style.transition = 'background-color 0.2s ease';
    button.style.boxSizing = 'border-box';
    button.onmouseover = () => button.style.backgroundColor = '#0f172a';
    button.onmouseout = () => button.style.backgroundColor = '#1e293b';

    card.appendChild(iconWrapper);
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

async function getClientIp() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        if (!response.ok) return null;
        const data = await response.json();
        return data.ip || null;
    } catch (error) {
        console.warn('Unable to fetch client IP:', error);
        return null;
    }
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
            (async () => {
                const providerId = user.providerData && user.providerData[0] ? user.providerData[0].providerId : null;
                const authRecord = {
                    ...authUser,
                    provider: providerId,
                };
                const ip = await getClientIp();
                const ensureResult = await ensureUserProfile(authRecord);
                if (!ensureResult.success) {
                    console.warn('Unable to persist logged-in user to database:', ensureResult.error);
                }
                const loginResult = await recordLoginEvent(authRecord, {
                    ip,
                    userAgent: navigator.userAgent,
                    provider: providerId,
                });
                if (!loginResult.success) {
                    console.warn('Unable to record login event:', loginResult.error);
                }
            })();
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
