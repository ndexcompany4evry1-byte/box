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
      let app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
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

    const settingsPath = /\/(N-dex|NFC)\//.test(window.location.pathname) ? '../settings.html' : 'settings.html';
    const profileCard = document.createElement('div');
    profileCard.id = 'userProfileCard';
    profileCard.className = 'user-profile-card-overlay';
    profileCard.setAttribute('role', 'dialog');
    profileCard.setAttribute('aria-modal', 'true');
    profileCard.innerHTML = `
      <div class="user-profile-card" id="userProfileCard">
        <button class="card-close" id="cardClose" aria-label="إغلاق">&times;</button>

        <div class="card-header">
          <div class="card-cover"></div>
          <div class="card-avatar-wrapper">
            <img id="cardProfileAvatar" class="card-profile-avatar" alt="صورة المستخدم" src="" loading="lazy">
            <span id="cardProfileInitials" class="card-profile-initials" style="display: none;"></span>
            <span class="status-indicator online" title="نشط الآن"></span>
          </div>
        </div>

        <div class="card-body">
          <h3 class="card-name" id="cardProfileName">المستخدم</h3>
          <p class="card-role" id="cardProfileRole">المطور الرئيسي • Ndex</p>
          <div class="card-email-badge">
            <span class="email-icon">✉</span>
            <span class="card-email" id="cardProfileEmail"></span>
          </div>

        </div>

        <div class="card-footer">
          <div class="card-buttons">
            <a class="card-btn settings" data-i18n="settingsLink" href="${settingsPath}">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
              الإعدادات
            </a>
            <button class="card-btn logout" id="logoutBtn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
              تسجيل خروج
            </button>
          </div>
        </div>
      </div>
    `;

    const dismissPanel = document.createElement('div');
    dismissPanel.id = 'userProfileDismissPanel';
    dismissPanel.className = 'user-profile-dismiss-panel';
    dismissPanel.setAttribute('aria-hidden', 'true');
    dismissPanel.innerHTML = `
      <button type="button" class="user-profile-dismiss-btn" aria-label="Close widget">×</button>
    `;

    document.body.appendChild(profileCard);
    document.body.appendChild(dismissPanel);

    const style = document.createElement('style');
    style.textContent = `
      @keyframes badgeToCard {
        0% { opacity: 1; transform: scale(1); }
        100% { opacity: 0; transform: scale(0.8); }
      }
      @keyframes cardSlideIn {
        0% { opacity: 0; transform: scale(0.85); }
        100% { opacity: 1; transform: scale(1); }
      }
      @keyframes overlayFadeIn {
        0% { opacity: 0; backdrop-filter: blur(0px); }
        100% { opacity: 1; backdrop-filter: blur(5px); }
      }
      @keyframes cardSlideOut {
        0% { opacity: 1; transform: scale(1); }
        100% { opacity: 0; transform: scale(0.85); }
      }
      @keyframes overlayFadeOut {
        0% { opacity: 1; backdrop-filter: blur(5px); }
        100% { opacity: 0; backdrop-filter: blur(0px); }
      }
      @keyframes dismissPulse {
        0% { transform: translateX(-50%) scale(1); }
        100% { transform: translateX(-50%) scale(1.04); }
      }
      @keyframes badgeStuck {
        0% { transform: translateY(0px); }
        100% { transform: translateY(-6px); }
      }
      .user-profile-dismiss-panel {
        position: fixed;
        left: 50%;
        bottom: 1.4rem;
        z-index: 99998;
        width: 150px;
        height: 60px;
        border-radius: 999px;
        background: transparent;
        border: 1px solid rgba(255, 255, 255, 0.12);
        backdrop-filter: none;
        box-shadow: none;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transform: translateX(-50%) translateY(16px) scale(0.94);
        pointer-events: none;
        transition: all 0.24s ease;
      }
      .user-profile-dismiss-panel.show {
        opacity: 1;
        transform: translateX(-50%) translateY(0) scale(1);
        pointer-events: auto;
      }
      .user-profile-dismiss-panel.pulling {
        animation: dismissPulse 0.35s ease-in-out infinite alternate;
        border-color: rgba(255, 255, 255, 0.28);
      }
      .user-profile-dismiss-btn {
        border: none;
        background: transparent;
        color: #f8fafc;
        font-size: 1.8rem;
        font-weight: 300;
        cursor: pointer;
        width: 100%;
        height: 100%;
        border-radius: inherit;
        display: flex;
        align-items: center;
        justify-content: center;
        line-height: 1;
        transition: color 0.2s ease, transform 0.2s ease;
      }
      .user-profile-dismiss-btn:hover {
        color: #ef4444;
        transform: scale(1.15);
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
        transition: opacity 0.2s ease, transform 0.2s ease;
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
      .user-profile-badge.drag-repel {
        animation: badgeStuck 0.2s ease-in-out infinite alternate;
        opacity: 0.72;
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
      .user-profile-name, .user-profile-email {
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
        background: #071630; /* ازرق ليلي */
        border-radius: 28px;
        overflow: hidden;
        width: min(100%, 440px);
        max-width: 440px;
        text-align: right;
        box-shadow: 0 12px 36px rgba(4, 10, 25, 0.5);
        border: 1px solid rgba(255, 255, 255, 0.06);
        color: #e6eef8;
        position: relative;
        animation: cardSlideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }
      .user-profile-card-overlay.hide .user-profile-card {
        animation: cardSlideOut 0.35s ease forwards;
      }
      .card-close {
        position: absolute;
        top: 16px;
        right: 16px;
        width: 38px;
        height: 38px;
        border-radius: 50%;
        border: 1px solid rgba(148, 163, 184, 0.4);
        background: #ffffff;
        color: #475569;
        font-size: 1.4rem;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: transform 0.2s ease, background 0.2s ease;
      }
      .card-close:hover {
        background: #f1f5f9;
        transform: scale(1.04);
      }
      [dir="rtl"] .card-close {
        right: auto;
        left: 16px;
      }
      .card-header {
        position: relative;
        height: 70px;
        background: linear-gradient(135deg, rgba(3,12,30,0.9) 0%, rgba(7,22,48,0.95) 100%);
      }
      .card-cover {
        position: absolute;
        inset: 0;
        background: linear-gradient(180deg, rgba(6,18,36,0.6), rgba(3,9,24,0.6));
        mix-blend-mode: overlay;
      }
      .card-avatar-wrapper {
        position: absolute;
        left: 50%;
        bottom: -34px;
        transform: translateX(-50%);
        width: 72px;
        height: 72px;
        border-radius: 999px;
        background: #ffffff;
        border: 3px solid #ffffff;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 10px 18px rgba(15, 23, 42, 0.10);
      }
      .card-profile-avatar {
        width: 66px;
        height: 66px;
        border-radius: 999px;
        object-fit: cover;
        display: block;
      }
      .card-profile-initials {
        width: 72px;
        height: 72px;
        border-radius: 999px;
        background: #e2e8f0;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        color: #0f172a;
        font-weight: 700;
        font-size: 1.1rem;
        letter-spacing: 0.04em;
      }
      .status-indicator {
        position: absolute;
        right: 6px;
        bottom: 6px;
        width: 16px;
        height: 16px;
        border-radius: 999px;
        border: 3px solid #ffffff;
        background: #22c55e;
      }
      .card-body {
        padding: 42px 18px 14px;
      }
      .card-name {
        margin: 0;
        font-size: 1.2rem;
        font-weight: 700;
        color: #0f172a;
      }
      .card-role {
        margin: 0.35rem 0 1rem 0;
        font-size: 0.95rem;
        color: #64748b;
        line-height: 1.5;
      }
      .card-email-badge {
        display: flex;
        align-items: center;
        gap: 0.6rem;
        padding: 0.75rem 0.9rem;
        border-radius: 14px;
        background: rgba(255,255,255,0.03);
        border: 1px solid rgba(255,255,255,0.04);
        margin-bottom: 0.85rem;
      }
      .email-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 30px;
        height: 30px;
        border-radius: 12px;
        background: #e2e8f0;
        color: #0f172a;
        font-size: 0.85rem;
      }
      .card-email-badge .card-email {
        margin: 0;
        font-size: 0.95rem;
        color: #334155;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .card-footer {
        padding: 0 28px 22px;
      }
      .card-footer .card-buttons {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
        margin-top: 0.75rem;
      }
      .card-buttons {
        display: flex;
        gap: 0.75rem;
      }
      .card-btn {
        flex: 1;
        min-width: 0;
        padding: 0.75rem 0.9rem;
        border: none;
        border-radius: 12px;
        background: linear-gradient(135deg, #0f3b66, #0b2a52);
        color: #e6eef8;
        font-size: 0.95rem;
        cursor: pointer;
        text-decoration: none;
        transition: background 0.18s ease, transform 0.08s ease;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
      }
      .card-btn:hover {
        background: linear-gradient(135deg, #153f72, #0d2f5f);
      }
      .card-btn:active {
        transform: scale(0.98);
      }
      .card-btn.logout {
        background: rgba(255,50,50,0.12);
        color: #ffd7d7;
      }
      .card-btn.logout:hover {
        background: rgba(255,50,50,0.18);
      }

      @media (max-width: 720px) {
        .user-profile-badge {
          top: 0.85rem; right: 0.85rem; left: auto;
          font-size: 0.78rem; padding: 0.45rem 0.75rem;
        }
        [dir="rtl"] .user-profile-badge { left: 0.85rem; right: auto; }
      }
      @media (max-width: 520px) {
        .user-profile-badge {
          width: auto; max-width: 180px; padding: 0.45rem 0.65rem;
        }
        .user-profile-name { font-size: 0.78rem; }
        .user-profile-email { font-size: 0.72rem; }
      }
    `;

    document.head.appendChild(style);

    function closeProfileCard() {
      profileCard.classList.remove('show');
      profileCard.classList.add('hide');
      badge.classList.remove('hide-badge');
      setTimeout(() => {
        profileCard.style.display = 'none';
        profileCard.classList.remove('hide');
      }, 350);
    }

    function openProfileCard() {
      badge.classList.add('hide-badge');
      profileCard.classList.add('show');
      profileCard.style.display = 'flex';
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && profileCard.classList.contains('show')) {
        closeProfileCard();
      }
    });

    document.getElementById('cardClose').addEventListener('click', closeProfileCard);

    profileCard.addEventListener('click', (e) => {
      if (e.target === profileCard) closeProfileCard();
    });

    document.getElementById('logoutBtn').addEventListener('click', async () => {
      await performLogout();
    });

    const dismissPanelEl = document.getElementById('userProfileDismissPanel');
    const dismissButton = dismissPanelEl.querySelector('.user-profile-dismiss-btn');

    function showDismissPanel() {
      dismissPanelEl.classList.add('show');
      dismissPanelEl.setAttribute('aria-hidden', 'false');
    }

    function hideDismissPanel() {
      dismissPanelEl.classList.remove('show');
      dismissPanelEl.setAttribute('aria-hidden', 'true');
    }

    dismissButton.addEventListener('click', () => {
      badge.style.display = 'none';
      hideDismissPanel();
    });

    function isPointerInsideDismissPanel(clientX, clientY) {
      const rect = dismissPanelEl.getBoundingClientRect();
      return clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom;
    }

    let dragStartX = 0;
    let dragStartY = 0;
    let badgeStartLeft = 0;
    let badgeStartTop = 0;
    let isDragging = false;
    let hasMoved = false;

    function clamp(value, min, max) {
      return Math.min(Math.max(value, min), max);
    }

    function onPointerMove(event) {
      if (!isDragging) return;
      const currentX = event.clientX;
      const currentY = event.clientY;
      const dx = currentX - dragStartX;
      const dy = currentY - dragStartY;

      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
        hasMoved = true;
      }

      const newLeft = clamp(badgeStartLeft + dx, 10, window.innerWidth - badge.offsetWidth - 10);
      const newTop = clamp(badgeStartTop + dy, 10, window.innerHeight - badge.offsetHeight - 10);
      
      badge.style.left = `${newLeft}px`;
      badge.style.top = `${newTop}px`;
      badge.style.right = 'auto';
      badge.style.bottom = 'auto';

      const hideThreshold = window.innerHeight * 0.55;
      const panelRect = dismissPanelEl.getBoundingClientRect();
      const isNearDismissPanel = currentX >= panelRect.left - 40
        && currentX <= panelRect.right + 40
        && currentY >= panelRect.top - 40
        && currentY <= panelRect.bottom + 40;

      if (newTop > hideThreshold) {
        showDismissPanel();
        if (isNearDismissPanel) {
          badge.classList.add('drag-repel');
          dismissPanelEl.classList.add('pulling');
          badge.style.opacity = '0.72';
          badge.style.top = `${Math.max(10, newTop - 10)}px`;
          badge.style.left = `${Math.max(10, newLeft - 8)}px`;
        } else {
          badge.classList.remove('drag-repel');
          dismissPanelEl.classList.remove('pulling');
          badge.style.opacity = '0.4';
        }
      } else {
        badge.classList.remove('drag-repel');
        dismissPanelEl.classList.remove('pulling');
        badge.style.opacity = '1';
        hideDismissPanel();
      }
    }

    function onPointerUp(event) {
      if (!isDragging) return;
      isDragging = false;
      
      if (badge.hasPointerCapture(event.pointerId)) {
        badge.releasePointerCapture(event.pointerId);
      }

      document.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerup', onPointerUp);

      const currentX = event.clientX;
      const currentY = event.clientY;

      badge.classList.remove('drag-repel');
      dismissPanelEl.classList.remove('pulling');

      if (parseFloat(badge.style.top) > window.innerHeight * 0.55 && isPointerInsideDismissPanel(currentX, currentY)) {
        badge.style.display = 'none';
        hideDismissPanel();
      } else {
        badge.style.opacity = '1';
        hideDismissPanel();
      }

      if (!hasMoved) {
        openProfileCard();
      }
    }

    function onPointerDown(event) {
      if (event.target.closest('.card-close') || event.target.closest('#logoutBtn')) return;
      isDragging = true;
      hasMoved = false;
      
      dragStartX = event.clientX;
      dragStartY = event.clientY;
      const rect = badge.getBoundingClientRect();
      badgeStartLeft = rect.left;
      badgeStartTop = rect.top;

      badge.setPointerCapture(event.pointerId);
      document.addEventListener('pointermove', onPointerMove);
      document.addEventListener('pointerup', onPointerUp);
    }

    badge.addEventListener('pointerdown', onPointerDown);

    return badge;
  }

  function updateProfileBadge() {
    if (window.location.pathname.includes('profile.html')) {
      const existingBadge = document.getElementById('userProfileBadge');
      if (existingBadge) existingBadge.style.display = 'none';
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
    const cardName = document.getElementById('cardProfileName');
    const cardRole = document.getElementById('cardProfileRole');

    if (!user || !user.email) {
      badge.style.display = 'none';
      return;
    }

    badge.style.display = 'flex';
    const displayName = user.displayName || user.name || user.username || user.email;
    nameEl.textContent = displayName;
    emailEl.textContent = user.email;
    cardName.textContent = displayName;
    cardEmail.textContent = user.email;
    if (cardRole) {
      cardRole.textContent = user.role || 'المطور الرئيسي • Ndex';
    }
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