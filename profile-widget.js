(function() {
  const profileKeys = ['authUser', 'userData', 'user', 'currentUser'];
  const authStorageKeys = [...profileKeys, 'authToken', 'sessionUser', 'loggedInUser'];

  const firebaseConfig = {
    apiKey: "AIzaSyCiwkEOGzJwplGbdGd35oVk-54fMz0T838",
    authDomain: "poch-ntification.firebaseapp.com",
    databaseURL: "https://poch-ntification-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "poch-ntification",
    storageBucket: "poch-ntification.appspot.com",
    messagingSenderId: "169375707704",
    appId: "1:169375707704:web:cff7f29e9bbaf40ea72ccd",
    measurementId: "G-X3C2EDECME"
  };

  function clearLoginData() {
    authStorageKeys.forEach((key) => localStorage.removeItem(key));
    localStorage.removeItem('authUser');
  }

  async function signOutFirebase() {
    try {
      const { initializeApp, getApps, getApp } = await import('https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js');
      const { getAuth, signOut } = await import('https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js');
      let app;
      if (getApps().length > 0) {
        app = getApp();
      } else {
        app = initializeApp(firebaseConfig);
      }
      const auth = getAuth(app);
      await signOut(auth);
    } catch (error) {
      console.warn('Firebase logout failed or not available:', error);
    }
  }

  async function performLogout() {
    clearLoginData();
    await signOutFirebase();
    window.location.href = 'index.html';
  }

  function parseUserData() {
    for (const key of profileKeys) {
      const data = localStorage.getItem(key);
      if (!data) continue;
      try {
        const user = JSON.parse(data);
        if (user && user.email) return user;
      } catch (err) {
        // ignore invalid JSON
      }
    }
    return null;
  }

  function getInitials(text) {
    if (!text) return '??';
    const words = text.trim().split(/\s+/).filter(Boolean);
    if (words.length === 0) return '??';
    if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
    return (words[0][0] + words[1][0]).toUpperCase();
  }

  function createProfileBadge() {
    const badge = document.createElement('div');
    badge.id = 'userProfileBadge';
    badge.className = 'user-profile-badge';
    badge.style.display = 'none';
    badge.style.cursor = 'pointer';
    badge.innerHTML = `
      <div class="user-profile-avatar-wrap">
        <img id="userProfileAvatar" class="user-profile-avatar" alt="Avatar" src="" loading="lazy" />
        <span id="userProfileInitials" class="user-profile-initials"></span>
      </div>
      <div class="user-profile-info">
        <span id="userProfileName" class="user-profile-name"></span>
        <span id="userProfileEmail" class="user-profile-email"></span>
      </div>
    `;

    // Create the profile card modal
    const profileCard = document.createElement('div');
    profileCard.id = 'userProfileCard';
    profileCard.className = 'user-profile-card-overlay';
    profileCard.innerHTML = `
      <div class="user-profile-card">
        <div class="card-close" id="cardClose">&times;</div>
        <div class="card-avatar">
          <img id="cardProfileAvatar" class="card-profile-avatar" alt="Avatar" src="" loading="lazy" />
          <span id="cardProfileInitials" class="card-profile-initials"></span>
        </div>
        <div class="card-email" id="cardProfileEmail"></div>
        <div class="card-buttons">
          <button class="card-btn logout" id="logoutBtn">تسجيل خروج</button>
        </div>
      </div>
    `;

    document.body.appendChild(profileCard);

    const style = document.createElement('style');
    style.textContent = `
      @keyframes badgeToCard {
        0% {
          opacity: 1;
          transform: scale(1);
        }
        100% {
          opacity: 0;
          transform: scale(0.8);
        }
      }
      
      @keyframes cardSlideIn {
        0% {
          opacity: 0;
          transform: scale(0.85);
        }
        100% {
          opacity: 1;
          transform: scale(1);
        }
      }
      
      @keyframes overlayFadeIn {
        0% {
          opacity: 0;
          backdrop-filter: blur(0px);
        }
        100% {
          opacity: 1;
          backdrop-filter: blur(5px);
        }
      }
      
      @keyframes cardSlideOut {
        0% {
          opacity: 1;
          transform: scale(1);
        }
        100% {
          opacity: 0;
          transform: scale(0.85);
        }
      }
      
      @keyframes overlayFadeOut {
        0% {
          opacity: 1;
          backdrop-filter: blur(5px);
        }
        100% {
          opacity: 0;
          backdrop-filter: blur(0px);
        }
      }
      
      .user-profile-badge {
        position: fixed;
        top: 1rem;
        right: 1rem;
        z-index: 99999;
        display: flex;
        align-items: center;
        gap: 0.7rem;
        padding: 0.55rem 0.85rem;
        border-radius: 999px;
        background: rgba(15, 23, 42, 0.88);
        color: #f8fafc;
        font-family: inherit;
        font-size: 0.82rem;
        line-height: 1.2;
        backdrop-filter: blur(14px);
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.22);
        border: 1px solid rgba(255, 255, 255, 0.08);
        pointer-events: auto;
        max-width: 240px;
        overflow: hidden;
        transition: all 0.2s ease;
        touch-action: none;
        user-select: none;
      }
      .user-profile-badge:hover {
        background: rgba(15, 23, 42, 0.95);
        transform: translateY(-2px);
        box-shadow: 0 25px 70px rgba(0, 0, 0, 0.3);
      }
      
      .user-profile-badge.hide-badge {
        animation: badgeToCard 0.3s ease forwards;
        pointer-events: none;
      }
      [dir="rtl"] .user-profile-badge {
        right: auto;
        left: 1rem;
      }
      .user-profile-avatar-wrap {
        position: relative;
        width: 36px;
        height: 36px;
        min-width: 36px;
        min-height: 36px;
        border-radius: 50%;
        overflow: hidden;
        background: rgba(255,255,255,0.08);
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .user-profile-avatar {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: none;
      }
      .user-profile-initials {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        color: #fff;
        font-weight: 700;
        font-size: 0.85rem;
        letter-spacing: 0.04em;
      }
      .user-profile-info {
        display: flex;
        flex-direction: column;
        justify-content: center;
        min-width: 0;
      }
      .user-profile-name,
      .user-profile-email {
        display: block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .user-profile-name {
        font-weight: 700;
        color: #f8fafc;
        margin-bottom: 0.1rem;
      }
      .user-profile-email {
        font-size: 0.78rem;
        color: #d1d5db;
      }
      .user-profile-card-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: none;
        justify-content: center;
        align-items: center;
        z-index: 100000;
        backdrop-filter: blur(5px);
      }
      
      .user-profile-card-overlay.show {
        display: flex;
        animation: overlayFadeIn 0.35s ease forwards;
      }
      
      .user-profile-card-overlay.hide {
        animation: overlayFadeOut 0.35s ease forwards;
      }
      
      .user-profile-card {
        background: rgba(15, 23, 42, 0.98);
        border-radius: 16px;
        padding: 2rem;
        max-width: 300px;
        width: 90%;
        text-align: center;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        border: 1px solid rgba(255, 255, 255, 0.08);
        position: relative;
        animation: cardSlideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }
      
      .user-profile-card-overlay.hide .user-profile-card {
        animation: cardSlideOut 0.35s ease forwards;
      }
      .card-close {
        position: absolute;
        top: 1rem;
        right: 1rem;
        font-size: 1.5rem;
        cursor: pointer;
        color: #d1d5db;
        transition: color 0.2s, transform 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        border-radius: 50%;
      }
      .card-close:hover {
        color: #f8fafc;
        transform: rotate(90deg) scale(1.1);
      }
      [dir="rtl"] .card-close {
        right: auto;
        left: 1rem;
      }
      .card-avatar {
        margin-bottom: 1rem;
      }
      .card-profile-avatar {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        object-fit: cover;
        display: none;
      }
      .card-profile-initials {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        background: rgba(255,255,255,0.08);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-weight: 700;
        font-size: 1.5rem;
        letter-spacing: 0.04em;
      }
      .card-email {
        margin-bottom: 1.5rem;
        color: #d1d5db;
        font-size: 1rem;
      }
      .card-buttons {
        display: flex;
        gap: 0;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
      }
      .card-btn {
        flex: 1;
        padding: 0.75rem 1rem;
        border: none;
        background: rgba(255, 255, 255, 0.08);
        color: #f8fafc;
        font-size: 0.9rem;
        cursor: pointer;
        transition: background 0.2s, transform 0.1s;
      }
      .card-btn:hover {
        background: rgba(255, 255, 255, 0.15);
      }
      .card-btn:active {
        transform: scale(0.96);
      }
      @media (max-width: 720px) {
        .user-profile-badge {
          top: 0.85rem;
          right: 0.85rem;
          left: auto;
          font-size: 0.78rem;
          padding: 0.45rem 0.75rem;
        }
        [dir="rtl"] .user-profile-badge {
          left: 0.85rem;
          right: auto;
        }
      }
      @media (max-width: 520px) {
        .user-profile-badge {
          width: auto;
          max-width: 180px;
          padding: 0.45rem 0.65rem;
        }
        .user-profile-name {
          font-size: 0.78rem;
        }
        .user-profile-email {
          font-size: 0.72rem;
        }
      }
    `;

    document.head.appendChild(style);

    // Add event listeners
    badge.addEventListener('click', () => {
      badge.classList.add('hide-badge');
      profileCard.classList.add('show');
      profileCard.style.display = 'flex';
    });

    document.getElementById('cardClose').addEventListener('click', () => {
      profileCard.classList.remove('show');
      profileCard.classList.add('hide');
      badge.classList.remove('hide-badge');
      setTimeout(() => {
        profileCard.style.display = 'none';
        profileCard.classList.remove('hide');
      }, 350);
    });

    profileCard.addEventListener('click', (e) => {
      if (e.target === profileCard) {
        profileCard.classList.remove('show');
        profileCard.classList.add('hide');
        badge.classList.remove('hide-badge');
        setTimeout(() => {
          profileCard.style.display = 'none';
          profileCard.classList.remove('hide');
        }, 350);
      }
    });

    document.getElementById('logoutBtn').addEventListener('click', async () => {
      await performLogout();
    });

    let dragStartX = 0;
    let dragStartY = 0;
    let badgeStartLeft = 0;
    let badgeStartTop = 0;
    let isDragging = false;

    function clamp(value, min, max) {
      return Math.min(Math.max(value, min), max);
    }

    function onPointerMove(event) {
      if (!isDragging) return;
      event.preventDefault();
      const currentX = event.clientX || (event.touches && event.touches[0].clientX);
      const currentY = event.clientY || (event.touches && event.touches[0].clientY);
      const dx = currentX - dragStartX;
      const dy = currentY - dragStartY;
      const newLeft = clamp(badgeStartLeft + dx, 10, window.innerWidth - badge.offsetWidth - 10);
      const newTop = clamp(badgeStartTop + dy, 10, window.innerHeight - badge.offsetHeight - 10);
      badge.style.left = `${newLeft}px`;
      badge.style.top = `${newTop}px`;
      badge.style.right = 'auto';
      badge.style.bottom = 'auto';

      const hideThreshold = window.innerHeight * 0.55;
      if (newTop > hideThreshold) {
        badge.style.opacity = '0.12';
      } else {
        badge.style.opacity = '1';
      }
    }

    function onPointerUp(event) {
      if (!isDragging) return;
      isDragging = false;
      document.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerup', onPointerUp);
      if (parseFloat(badge.style.top) > window.innerHeight * 0.55) {
        badge.style.display = 'none';
      } else {
        badge.style.opacity = '1';
      }
    }

    function onPointerDown(event) {
      if (event.target.closest('.card-close') || event.target.closest('#logoutBtn')) return;
      isDragging = true;
      dragStartX = event.clientX || (event.touches && event.touches[0].clientX);
      dragStartY = event.clientY || (event.touches && event.touches[0].clientY);
      const rect = badge.getBoundingClientRect();
      badgeStartLeft = rect.left;
      badgeStartTop = rect.top;
      document.addEventListener('pointermove', onPointerMove);
      document.addEventListener('pointerup', onPointerUp);
    }

    badge.addEventListener('pointerdown', onPointerDown);
    badge.addEventListener('click', (event) => {
      if (isDragging) return;
      badge.classList.add('hide-badge');
      profileCard.classList.add('show');
      profileCard.style.display = 'flex';
    });

    return badge;
  }

  function updateProfileBadge() {
    // Don't show badge on profile page
    if (window.location.pathname.includes('profile.html')) {
      const existingBadge = document.getElementById('userProfileBadge');
      if (existingBadge) {
        existingBadge.style.display = 'none';
      }
      return;
    }

    let badge = document.getElementById('userProfileBadge');
    if (!badge) {
      badge = createProfileBadge();
      document.body.appendChild(badge);
    }

    const user = parseUserData();
    const avatar = document.getElementById('userProfileAvatar');
    const initials = document.getElementById('userProfileInitials');
    const nameEl = document.getElementById('userProfileName');
    const emailEl = document.getElementById('userProfileEmail');

    const cardAvatar = document.getElementById('cardProfileAvatar');
    const cardInitials = document.getElementById('cardProfileInitials');
    const cardEmail = document.getElementById('cardProfileEmail');

    if (!user || !user.email) {
      badge.style.display = 'none';
      return;
    }

    badge.style.display = 'flex';
    const displayName = user.displayName || user.name || user.username || user.email;
    nameEl.textContent = displayName;
    emailEl.textContent = user.email;
    cardEmail.textContent = user.email;
    badge.title = displayName;

    if (user.photoURL) {
      avatar.src = user.photoURL;
      avatar.style.display = 'block';
      initials.style.display = 'none';

      cardAvatar.src = user.photoURL;
      cardAvatar.style.display = 'block';
      cardInitials.style.display = 'none';
    } else {
      avatar.style.display = 'none';
      initials.style.display = 'flex';
      initials.textContent = getInitials(displayName);

      cardAvatar.style.display = 'none';
      cardInitials.style.display = 'flex';
      cardInitials.textContent = getInitials(displayName);
    }
  }

  function initProfileWidget() {
    updateProfileBadge();
  }

  window.refreshProfile = initProfileWidget;
  window.addEventListener('storage', initProfileWidget);
  document.addEventListener('DOMContentLoaded', initProfileWidget);
  initProfileWidget();
})();
