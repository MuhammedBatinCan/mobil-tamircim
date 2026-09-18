// OTO SANAYİ FORUMU - MOBİL YÖNETİCİ KONTROL MOTORU (ADMIN-APP.JS)

const AdminApp = {
  state: null,
  activeTab: 'tab-users',
  selectedUserId: null,
  currentAdmin: null,
  deferredPrompt: null,

  async init() {
    this.setupPwa();

    if (!this.checkAuth()) {
      return;
    }
    await this.fetchData();
    this.renderStats();
    this.renderUsers();
    this.renderVerifications();
    this.renderModeration();
    this.renderSos();
    this.updateBadgeCounts();
    this.initAiDeveloper();
  },

  setupPwa() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/admin/sw.js', { scope: '/admin/' })
          .then(reg => console.log('✓ Mobil Admin Service Worker kayıtlı:', reg.scope))
          .catch(err => console.log('Admin Service worker hatası:', err));
      });
    }

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      const isDismissed = sessionStorage.getItem('admin_pwa_dismissed');
      const banner = document.getElementById('admin-mobile-install-banner');
      if (banner && !isDismissed && window.innerWidth <= 768) {
        banner.style.display = 'flex';
      }
      const nativeWrap = document.getElementById('admin-pwa-native-install-wrap');
      if (nativeWrap) nativeWrap.style.display = 'block';
    });

    window.addEventListener('appinstalled', () => {
      this.deferredPrompt = null;
      const banner = document.getElementById('admin-mobile-install-banner');
      if (banner) banner.style.display = 'none';
      alert('🎉 Mobil Admin Konsolu telefonunuza başarıyla kuruldu!');
    });
  },

  openMobileAppModal() {
    const host = window.location.hostname === 'localhost' ? '192.168.1.5' : window.location.hostname;
    const port = window.location.port ? `:${window.location.port}` : '';
    const mobileUrl = `http://${host}${port}/admin`;
    
    const qrImg = document.getElementById('admin-mobile-qr-img');
    if (qrImg) {
      qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(mobileUrl)}&color=EF4444&bgcolor=0B0F19`;
    }
    const modal = document.getElementById('admin-mobile-app-modal');
    if (modal) modal.style.display = 'flex';
  },

  closeMobileAppModal() {
    const modal = document.getElementById('admin-mobile-app-modal');
    if (modal) modal.style.display = 'none';
  },

  async triggerPwaInstall() {
    if (this.deferredPrompt) {
      this.deferredPrompt.prompt();
      const { outcome } = await this.deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        alert('🚀 Mobil Admin uygulaması kuruluyor...');
      }
      this.deferredPrompt = null;
      const banner = document.getElementById('admin-mobile-install-banner');
      if (banner) banner.style.display = 'none';
      this.closeMobileAppModal();
    } else {
      this.openMobileAppModal();
    }
  },

  dismissInstallBanner() {
    const banner = document.getElementById('admin-mobile-install-banner');
    if (banner) banner.style.display = 'none';
    sessionStorage.setItem('admin_pwa_dismissed', 'true');
  },

  checkAuth() {
    const localAdmin = localStorage.getItem('mobil_tamircim_admin');
    const sessionAdmin = sessionStorage.getItem('mobil_tamircim_admin');
    let admin = null;
    if (localAdmin) {
      try { admin = JSON.parse(localAdmin); } catch(e){}
    } else if (sessionAdmin) {
      try { admin = JSON.parse(sessionAdmin); } catch(e){}
    }

    const overlay = document.getElementById('admin-login-overlay');
    const badge = document.getElementById('admin-badge-logged');
    const logoutBtn = document.getElementById('admin-logout-btn');
    const nameSpan = document.getElementById('admin-logged-name');

    if (admin) {
      this.currentAdmin = admin;
      if (overlay) overlay.style.display = 'none';
      if (badge) badge.style.display = 'inline-flex';
      if (logoutBtn) logoutBtn.style.display = 'inline-block';
      if (nameSpan) nameSpan.textContent = admin.name || admin.username || 'Yönetici';
      return true;
    } else {
      this.currentAdmin = null;
      if (overlay) overlay.style.display = 'flex';
      if (badge) badge.style.display = 'none';
      if (logoutBtn) logoutBtn.style.display = 'none';
      return false;
    }
  },

  async handleLogin(event) {
    if (event) event.preventDefault();
    const userInput = document.getElementById('admin-user-input');
    const passInput = document.getElementById('admin-pass-input');
    const rememberInput = document.getElementById('admin-remember-input');
    const errEl = document.getElementById('admin-login-error');

    const username = userInput ? userInput.value.trim() : '';
    const password = passInput ? passInput.value : '';
    const rememberMe = rememberInput ? rememberInput.checked : true;

    if (errEl) {
      errEl.style.display = 'none';
      errEl.textContent = '';
    }

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();

      if (data.success) {
        const adminData = data.admin || { username, name: 'Platform Yöneticisi', role: 'admin' };
        if (rememberMe) {
          localStorage.setItem('mobil_tamircim_admin', JSON.stringify(adminData));
          sessionStorage.removeItem('mobil_tamircim_admin');
        } else {
          sessionStorage.setItem('mobil_tamircim_admin', JSON.stringify(adminData));
          localStorage.removeItem('mobil_tamircim_admin');
        }

        this.checkAuth();
        await this.init();
      } else {
        if (errEl) {
          errEl.textContent = data.error || 'Giriş başarısız! Bilgilerinizi kontrol ediniz.';
          errEl.style.display = 'block';
        }
      }
    } catch (err) {
      if (errEl) {
        errEl.textContent = 'Sunucuya bağlanılamadı. Lütfen sunucunun çalıştığından emin olun.';
        errEl.style.display = 'block';
      }
    }
  },

  logout() {
    localStorage.removeItem('mobil_tamircim_admin');
    sessionStorage.removeItem('mobil_tamircim_admin');
    this.currentAdmin = null;
    this.checkAuth();
  },

  togglePassword(inputId, btnEl) {
    const input = document.getElementById(inputId);
    if (!input) return;
    if (input.type === 'password') {
      input.type = 'text';
      btnEl.innerHTML = '🙈';
      btnEl.title = 'Şifreyi Gizle';
    } else {
      input.type = 'password';
      btnEl.innerHTML = '👁️';
      btnEl.title = 'Şifreyi Göster';
    }
  },

  fillDemoAdmin() {
    const userInput = document.getElementById('admin-user-input');
    const passInput = document.getElementById('admin-pass-input');
    if (userInput) userInput.value = 'admin';
    if (passInput) passInput.value = 'admin123';
  },

  async fetchData() {
    try {
      const res = await fetch('/api/state');
      const data = await res.json();
      if (data.success) {
        this.state = data.data;
      }
    } catch (err) {
      console.error('Fetch error:', err);
      alert('Sunucu verisi alınamadı.');
    }
  },

  switchTab(tabId) {
    this.activeTab = tabId;
    document.querySelectorAll('.admin-view').forEach(v => v.classList.remove('active'));
    document.querySelectorAll('.admin-nav-item').forEach(n => n.classList.remove('active'));
    document.querySelectorAll('.admin-top-tab').forEach(t => t.classList.remove('active'));

    const target = document.getElementById(tabId);
    if (target) target.classList.add('active');

    const navBtn = document.querySelector(`.admin-nav-item[data-tab="${tabId}"]`);
    if (navBtn) navBtn.classList.add('active');

    const topBtn = document.querySelector(`.admin-top-tab[data-tab="${tabId}"]`);
    if (topBtn) topBtn.classList.add('active');

    if (tabId === 'tab-ai-dev') {
      this.scrollAiChatToBottom();
      const input = document.getElementById('ai-dev-prompt-input');
      if (input && window.innerWidth > 768) {
        setTimeout(() => input.focus(), 150);
      }
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  updateBadgeCounts() {
    if (!this.state) return;

    const pendingVerifs = (this.state.verifications || []).filter(v => v.status === 'pending').length;
    const pendingMods = (this.state.moderationQueue || []).filter(m => m.status === 'pending').length;
    const activeSos = (this.state.sosRequests || []).filter(s => s.status === 'active').length;

    // Mobil rozetler
    const vBadge = document.getElementById('badge-verifs-count');
    const mBadge = document.getElementById('badge-mod-count');
    const sBadge = document.getElementById('badge-sos-count');

    if (vBadge) {
      vBadge.textContent = pendingVerifs;
      vBadge.style.display = pendingVerifs > 0 ? 'inline-block' : 'none';
    }
    if (mBadge) {
      mBadge.textContent = pendingMods;
      mBadge.style.display = pendingMods > 0 ? 'inline-block' : 'none';
    }
    if (sBadge) {
      sBadge.textContent = activeSos;
      sBadge.style.display = activeSos > 0 ? 'inline-block' : 'none';
    }

    // Masaüstü sekme rozetleri
    const topV = document.getElementById('top-badge-verifs');
    const topM = document.getElementById('top-badge-mod');
    const topS = document.getElementById('top-badge-sos');

    if (topV) {
      topV.textContent = pendingVerifs;
      topV.style.display = pendingVerifs > 0 ? 'inline-block' : 'none';
    }
    if (topM) {
      topM.textContent = pendingMods;
      topM.style.display = pendingMods > 0 ? 'inline-block' : 'none';
    }
    if (topS) {
      topS.textContent = activeSos;
      topS.style.display = activeSos > 0 ? 'inline-block' : 'none';
    }
  },

  renderStats() {
    if (!this.state) return;
    const usersCount = (this.state.users || []).length;
    const mechCount = (this.state.users || []).filter(u => u.badges && u.badges.includes('verified_mechanic')).length;
    const pendingVerifs = (this.state.verifications || []).filter(v => v.status === 'pending').length;
    const activeSos = (this.state.sosRequests || []).filter(s => s.status === 'active').length;

    document.getElementById('stat-total-users').textContent = usersCount;
    document.getElementById('stat-verified-mechanics').textContent = mechCount;
    document.getElementById('stat-pending-verifs').textContent = pendingVerifs;
    document.getElementById('stat-active-sos').textContent = activeSos;
  },

  // 1. KULLANICILAR SEKMESİ
  renderUsers(filterQuery = '') {
    const container = document.getElementById('users-list-container');
    if (!container || !this.state.users) return;

    let users = [...this.state.users];
    if (filterQuery.trim()) {
      const q = filterQuery.toLowerCase().trim();
      users = users.filter(u => 
        (u.name && u.name.toLowerCase().includes(q)) ||
        (u.username && u.username.toLowerCase().includes(q)) ||
        (u.plate && u.plate.toLowerCase().includes(q)) ||
        (u.car && u.car.toLowerCase().includes(q))
      );
    }

    container.innerHTML = users.map(u => {
      const isBanned = u.isBanned;
      return `
        <div class="user-card" style="${isBanned ? 'border-color:var(--admin-red); opacity:0.85;' : ''}">
          <div class="user-card-header">
            <div class="user-card-info">
              <img class="user-card-avatar" src="${u.avatar}" />
              <div>
                <div class="user-card-name">
                  ${escapeHtml(u.name)}
                  ${isBanned ? '<span class="badge badge-banned">YASAKLI / BANLI</span>' : ''}
                </div>
                <div class="user-card-meta">
                  @${escapeHtml(u.username)} • <strong>${u.reputationPoints || 0} XP (${u.level})</strong>
                </div>
              </div>
            </div>
            ${this.renderPlate(u.plate)}
          </div>

          <div style="font-size:0.82rem; color:var(--text-secondary);">
            🚗 <strong>Araç:</strong> ${escapeHtml(u.car || 'Belirtilmedi')}
            ${u.shopName ? `<br/>🏢 <strong>Dükkan:</strong> ${escapeHtml(u.shopName)} (${escapeHtml(u.city || '')})` : ''}
          </div>

          <div class="user-card-badges">
            ${this.renderBadges(u.badges)}
          </div>

          <div class="user-card-actions">
            <button class="admin-btn admin-btn-primary" style="flex:1;" onclick="AdminApp.openBadgeModal('${u.id}')">
              🎖️ Rozet & Rol Yönet
            </button>
            <button class="admin-btn ${isBanned ? 'admin-btn-success' : 'admin-btn-danger'}" onclick="AdminApp.toggleBan('${u.id}')">
              ${isBanned ? 'Kullanıcı Yasağını Kaldır' : 'Yasakla (Ban)'}
            </button>
          </div>
        </div>
      `;
    }).join('');
  },

  // 2. DOĞRULAMA MASASI (VERIFICATIONS)
  renderVerifications() {
    const container = document.getElementById('verifications-container');
    if (!container || !this.state.verifications) return;

    const list = this.state.verifications;
    if (list.length === 0) {
      container.innerHTML = `<div style="text-align:center; padding:30px; color:var(--text-muted);">Bekleyen başvuru bulunmamaktadır.</div>`;
      return;
    }

    container.innerHTML = list.map(v => {
      const isPending = v.status === 'pending';
      let typeTitle = 'Kullanıcı Doğrulama';
      if (v.type === 'mechanic') typeTitle = '🔧 Tamirci / Esnaf Doğrulaması';
      if (v.type === 'dealer') typeTitle = '🏢 Galerici Doğrulaması';

      return `
        <div class="vrf-card" style="border-left-color:${isPending ? 'var(--admin-amber)' : (v.status === 'approved' ? 'var(--admin-green)' : 'var(--admin-red)')}">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <span class="badge" style="background:#21262D; color:#FFF;">${typeTitle}</span>
            <span style="font-size:0.75rem; color:var(--text-muted);">${formatDate(v.submittedAt)}</span>
          </div>

          <div style="font-size:1rem; font-weight:800; color:#FFF; margin-bottom:4px;">
            ${escapeHtml(v.username)} (ID: ${v.userId})
          </div>

          ${v.shopName ? `<div style="font-size:0.85rem; color:var(--text-secondary);">🏢 <strong>Dükkan:</strong> ${escapeHtml(v.shopName)} - ${escapeHtml(v.sanayiSite || '')} (${escapeHtml(v.city || '')})</div>` : ''}
          ${v.dealerName ? `<div style="font-size:0.85rem; color:var(--text-secondary);">🏢 <strong>Galeri:</strong> ${escapeHtml(v.dealerName)}</div>` : ''}
          ${v.taxNumber ? `<div style="font-size:0.85rem; color:var(--text-secondary);">📑 <strong>Vergi / Yetki No:</strong> <code>${escapeHtml(v.taxNumber)}</code></div>` : ''}
          ${v.notes ? `<div style="font-size:0.85rem; color:var(--text-muted); background:var(--admin-input); padding:8px; border-radius:4px; margin:8px 0;">"${escapeHtml(v.notes)}"</div>` : ''}

          <div style="margin-top:12px; display:flex; gap:8px;">
            ${isPending ? `
              <button class="admin-btn admin-btn-success" style="flex:1;" onclick="AdminApp.decideVerification('${v.id}', 'approve')">
                ✓ Başvuruyu Onayla ve Rozeti Tanımla
              </button>
              <button class="admin-btn admin-btn-danger" onclick="AdminApp.decideVerification('${v.id}', 'reject')">
                ✕ Reddet
              </button>
            ` : `
              <span class="badge" style="background:${v.status === 'approved' ? 'var(--admin-green)' : 'var(--admin-red)'}; color:#000; font-weight:800;">
                DURUM: ${v.status === 'approved' ? 'ONAYLANDI' : 'REDDEDİLDİ'}
              </span>
            `}
          </div>
        </div>
      `;
    }).join('');
  },

  async decideVerification(vrfId, decision) {
    try {
      const res = await fetch(`/api/verifications/${vrfId}/decision`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decision })
      });
      const data = await res.json();
      if (data.success) {
        await this.fetchData();
        this.renderVerifications();
        this.renderUsers();
        this.renderStats();
        this.updateBadgeCounts();
        alert(decision === 'approve' ? 'Başvuru onaylandı ve kullanıcıya rozet tanımlandı!' : 'Başvuru reddedildi.');
      }
    } catch (err) {
      alert('İşlem başarısız');
    }
  },

  // 3. YAPAY ZEKA DENETİM & BAN MASASI (HUMAN-IN-THE-LOOP)
  renderModeration() {
    const container = document.getElementById('moderation-container');
    if (!container || !this.state.moderationQueue) return;

    const list = this.state.moderationQueue;
    if (list.length === 0) {
      container.innerHTML = `<div style="text-align:center; padding:30px; color:var(--text-muted);">Yapay zeka tarafından bayraklanan şüpheli içerik bulunmamaktadır. Sistem tertemiz!</div>`;
      return;
    }

    container.innerHTML = list.map(item => {
      const isPending = item.status === 'pending';
      return `
        <div class="ai-mod-card">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <span class="ai-risk-tag">🤖 YAPAY ZEKA UYARISI (${item.severity.toUpperCase()})</span>
            <span style="font-size:0.75rem; color:var(--text-muted);">${formatDate(item.flaggedAt)}</span>
          </div>

          <div style="font-size:0.95rem; font-weight:800; color:#FFF; margin-bottom:4px;">
            Kullanıcı: <strong>${escapeHtml(item.username)}</strong>
          </div>

          <div style="font-size:0.85rem; color:#F87171; font-weight:700; margin-bottom:8px;">
            ⚠️ Tespit Nedeni: ${escapeHtml(item.reason)}
          </div>

          <div style="background:var(--admin-input); border:1px solid rgba(239,68,68,0.3); border-radius:6px; padding:10px; font-size:0.9rem; color:#FFF; margin-bottom:12px;">
            "${escapeHtml(item.content)}"
          </div>

          <div style="font-size:0.78rem; color:var(--text-muted); margin-bottom:10px;">
            💡 <em>Not: Yapay zeka kullanıcıyı otomatik banlamamıştır. Son karar için yetkinize sunulmuştur.</em>
          </div>

          ${isPending ? `
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
              <button class="admin-btn admin-btn-danger" onclick="AdminApp.decideModeration('${item.id}', 'ban')">
                🔨 Kullanıcıyı Banla
              </button>
              <button class="admin-btn admin-btn-danger" style="background:rgba(245,158,11,0.2); color:#FCD34D; border-color:#F59E0B;" onclick="AdminApp.decideModeration('${item.id}', 'delete')">
                🗑️ Sadece Yorumu Sil
              </button>
              <button class="admin-btn admin-btn-secondary" onclick="AdminApp.decideModeration('${item.id}', 'warn')">
                ⚠️ Uyarı Gönder
              </button>
              <button class="admin-btn admin-btn-success" onclick="AdminApp.decideModeration('${item.id}', 'ignore')">
                ✓ Hatalı Alarm (Yoksay)
              </button>
            </div>
          ` : `
            <div style="font-weight:700; color:var(--admin-green); font-size:0.85rem;">
              ✓ Karar Verildi: ${item.status.toUpperCase()}
            </div>
          `}
        </div>
      `;
    }).join('');
  },

  async decideModeration(modId, action) {
    try {
      const res = await fetch(`/api/moderation/${modId}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });
      const data = await res.json();
      if (data.success) {
        await this.fetchData();
        this.renderModeration();
        this.renderUsers();
        this.renderStats();
        this.updateBadgeCounts();
        alert('Yönetici kararı uygulandı: ' + action);
      }
    } catch (err) {
      alert('Hata oluştu');
    }
  },

  // 4. SOS RADARI SEKMESİ
  renderSos() {
    const container = document.getElementById('sos-monitor-container');
    if (!container || !this.state.sosRequests) return;

    const list = this.state.sosRequests;
    if (list.length === 0) {
      container.innerHTML = `<div style="text-align:center; padding:30px; color:var(--text-muted);">Aktif yardım çağrısı bulunmamaktadır.</div>`;
      return;
    }

    container.innerHTML = list.map(item => {
      const isActive = item.status === 'active';
      return `
        <div class="vrf-card" style="border-left-color:${isActive ? 'var(--admin-red)' : 'var(--admin-green)'}">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <span class="badge" style="background:${isActive ? 'var(--admin-red)' : 'var(--admin-green)'}; color:#FFF;">
              ${isActive ? '🚨 AKTİF ACİL ÇAĞRI' : '✓ ÇÖZÜLDÜ'}
            </span>
            ${this.renderPlate(item.plate)}
          </div>

          <h3 style="font-size:1.05rem; font-weight:800; color:#FFF; margin-bottom:4px;">
            📍 ${escapeHtml(item.locationCity)} - ${escapeHtml(item.locationDetails)}
          </h3>

          <div style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:6px;">
            Sürücü: <strong>${escapeHtml(item.username)}</strong> • Araç: ${escapeHtml(item.car)} • Sorun: <span style="color:#F87171;">${item.issueType.toUpperCase()}</span>
          </div>

          <div style="background:var(--admin-input); padding:8px; border-radius:4px; font-size:0.85rem; color:#FFF; margin-bottom:10px;">
            "${escapeHtml(item.description)}"
          </div>

          <div style="display:flex; gap:8px;">
            <a href="tel:${item.phone}" class="admin-btn admin-btn-primary" style="flex:1;">
              📞 Sürücüyü Ara (${item.phone})
            </a>
            ${isActive ? `
              <button class="admin-btn admin-btn-success" onclick="AdminApp.resolveSos('${item.id}')">
                ✓ Çözüldü
              </button>
            ` : ''}
          </div>
        </div>
      `;
    }).join('');
  },

  async resolveSos(sosId) {
    try {
      await fetch(`/api/sos/${sosId}/resolve`, { method: 'POST' });
      await this.fetchData();
      this.renderSos();
      this.renderStats();
      this.updateBadgeCounts();
    } catch (err) {
      alert('Hata oluştu');
    }
  },

  // ROZET YÖNETİM MODALI
  openBadgeModal(userId) {
    this.selectedUserId = userId;
    const user = this.state.users.find(u => u.id === userId);
    if (!user) return;

    document.getElementById('modal-user-name').textContent = user.name;
    document.getElementById('modal-user-username').textContent = '@' + user.username;
    document.getElementById('modal-plate-input').value = user.plate || '';
    document.getElementById('modal-car-input').value = user.car || '';

    // Set checkboxes
    const badges = user.badges || [];
    document.getElementById('chk-mechanic').checked = badges.includes('verified_mechanic');
    document.getElementById('chk-developer').checked = badges.includes('developer');
    document.getElementById('chk-beta').checked = badges.includes('beta_tester');
    document.getElementById('chk-dealer').checked = badges.includes('verified_dealer');
    document.getElementById('chk-user').checked = badges.includes('verified_user');

    document.getElementById('badge-modal').classList.add('active');
  },

  closeBadgeModal() {
    document.getElementById('badge-modal').classList.remove('active');
  },

  async saveBadges() {
    if (!this.selectedUserId) return;

    const newBadges = [];
    if (document.getElementById('chk-mechanic').checked) newBadges.push('verified_mechanic');
    if (document.getElementById('chk-developer').checked) newBadges.push('developer');
    if (document.getElementById('chk-beta').checked) newBadges.push('beta_tester');
    if (document.getElementById('chk-dealer').checked) newBadges.push('verified_dealer');
    if (document.getElementById('chk-user').checked) newBadges.push('verified_user');

    const plate = document.getElementById('modal-plate-input').value.trim();
    const car = document.getElementById('modal-car-input').value.trim();

    let role = 'user';
    if (newBadges.includes('developer')) role = 'developer';
    else if (newBadges.includes('verified_mechanic')) role = 'mechanic';
    else if (newBadges.includes('verified_dealer')) role = 'dealer';

    try {
      const res = await fetch('/api/users/update-badges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: this.selectedUserId,
          badges: newBadges,
          role, plate, car
        })
      });

      const data = await res.json();
      if (data.success) {
        await this.fetchData();
        this.renderUsers();
        this.renderStats();
        this.closeBadgeModal();
        alert('Rozetler ve plaka bilgisi güncellendi!');
      }
    } catch (err) {
      alert('Güncelleme yapılamadı');
    }
  },

  async toggleBan(userId) {
    const user = this.state.users.find(u => u.id === userId);
    if (!user) return;

    const shouldBan = !user.isBanned;
    if (confirm(shouldBan ? `${user.name} kullanıcısını banlamak istediğinize emin misiniz?` : `${user.name} kullanıcısının banını kaldırmak istiyor musunuz?`)) {
      user.isBanned = shouldBan;
      try {
        await fetch('/api/users/update-badges', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, badges: user.badges })
        });
        await this.fetchData();
        this.renderUsers();
      } catch (err) {
        alert('İşlem başarısız');
      }
    }
  },

  // Helpers
  renderPlate(plate) {
    if (!plate) return '';
    return `
      <div class="license-plate">
        <div class="plate-blue-strip">TR</div>
        <div class="plate-text">${escapeHtml(plate.toUpperCase().trim())}</div>
      </div>
    `;
  },

  renderBadges(badges = []) {
    let html = '';
    if (badges.includes('verified_mechanic')) html += `<span class="badge badge-mechanic">🔧 Onaylı Tamirci</span>`;
    if (badges.includes('developer')) html += `<span class="badge badge-developer">💻 Developer</span>`;
    if (badges.includes('beta_tester')) html += `<span class="badge badge-beta">🧪 Beta Tester</span>`;
    if (badges.includes('verified_dealer')) html += `<span class="badge badge-dealer">🏢 Galerici</span>`;
    if (badges.includes('verified_user')) html += `<span class="badge" style="background:#0284C7; color:#FFF;">🛡️ Doğrulanmış</span>`;
    if (badges.includes('email_verified')) html += `<span class="badge" style="background:#065F46; color:#D1FAE5;">✓ E-Posta Onaylı</span>`;
    return html || '<span style="font-size:0.75rem; color:var(--text-muted);">Özel rozet yok</span>';
  },

  // ==========================================================
  // ANTIGRAVITY AI CANLI GELİŞTİRİCİ KONSOLU İSTEMCİ YÖNETİMİ
  // ==========================================================
  aiChatHistory: [],

  initAiDeveloper() {
    try {
      const stored = localStorage.getItem('admin_ai_chat_history');
      if (stored) {
        this.aiChatHistory = JSON.parse(stored);
      }
    } catch (e) {
      this.aiChatHistory = [];
    }

    if (!Array.isArray(this.aiChatHistory) || this.aiChatHistory.length === 0) {
      this.aiChatHistory = [
        {
          sender: 'ai',
          text: "👋 **Selam Sayın Yönetici! Ben Antigravity — Mobil Tamircim Canlı Platform Mimarı ve Geliştirici Ajanınızım.**\n\nAdmin paneli üzerinde tam sistem yetkisine sahibim. Hem bilgisayarınızdan hem de telefonunuzdan bana dilediğiniz an yazabilirsiniz.\n\nSistemde düzeltmek veya değiştirmek istediğiniz yeri söylemeniz yeterli:\n- 👤 *'Ahmet ustanın puanını 2500 yap'*\n- 📑 *'Bekleyen tüm onayları tamamla'*\n- 🛡️ *'AliEmre'nin cezasını kaldır'*\n- ✉️ *'Tüm e-postaları onayla'*\n- 🛠️ *'Sistemi kontrol et ve hataları tara'*\n- 💾 *'Veritabanını hemen yedekle'*\n\nNe yapmamı istersiniz?",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ];
      this.saveAiChatHistory();
    }

    this.renderAiChatMessages();
  },

  saveAiChatHistory() {
    try {
      localStorage.setItem('admin_ai_chat_history', JSON.stringify(this.aiChatHistory));
    } catch(e){}
  },

  clearAiChat() {
    this.aiChatHistory = [
      {
        sender: 'ai',
        text: "⚡ **Sohbet temizlendi.** Antigravity Canlı Geliştirici Ajanı aktif ve hazır. Dilediğiniz düzeltmeyi veya sistem talimatını yazabilirsiniz.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
    this.saveAiChatHistory();
    this.renderAiChatMessages();
  },

  renderAiChatMessages() {
    const container = document.getElementById('ai-dev-chat-messages');
    if (!container) return;

    container.innerHTML = this.aiChatHistory.map(msg => {
      const isUser = msg.sender === 'user';
      let actionHtml = '';
      if (msg.actionResult && msg.actionResult.executed) {
        actionHtml = `
          <div class="ai-action-card">
            <span class="ai-action-pill">✓ İŞLEM GERÇEKLEŞTİRİLDİ</span>
            <div style="font-weight:700; color:#FFF; margin-bottom:4px;">${escapeHtml(msg.actionResult.summary)}</div>
            <div style="font-size:0.75rem; color:#A7F3D0; line-height:1.4;">${this.formatMarkdown(msg.actionResult.details)}</div>
          </div>
        `;
      }

      return `
        <div class="ai-msg-row ${isUser ? 'user' : 'ai'}">
          <div class="ai-msg-bubble">
            <div style="font-size:0.7rem; color:rgba(255,255,255,0.5); margin-bottom:4px; font-weight:700;">
              ${isUser ? '🛡️ Sen (Yönetici)' : '⚡ Antigravity AI Platform Mühendisi'} • ${msg.time || ''}
            </div>
            <div>${this.formatMarkdown(msg.text)}</div>
            ${actionHtml}
          </div>
        </div>
      `;
    }).join('');

    this.scrollAiChatToBottom();
  },

  scrollAiChatToBottom() {
    const container = document.getElementById('ai-dev-chat-messages');
    if (container) {
      setTimeout(() => {
        container.scrollTop = container.scrollHeight;
      }, 50);
    }
  },

  handleAiInputKey(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.handleAiDeveloperSubmit(event);
    }
  },

  async handleAiDeveloperSubmit(event) {
    if (event) event.preventDefault();
    const input = document.getElementById('ai-dev-prompt-input');
    const sendBtn = document.getElementById('ai-dev-send-btn');
    if (!input) return;

    const text = input.value.trim();
    if (!text) return;

    input.value = '';
    if (sendBtn) sendBtn.disabled = true;

    const userMsg = {
      sender: 'user',
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    this.aiChatHistory.push(userMsg);
    this.renderAiChatMessages();

    const typingPlaceholder = {
      sender: 'ai',
      text: '⚡ *Antigravity komutunuzu inceliyor ve sistemde uyguluyor...*',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isTyping: true
    };
    this.aiChatHistory.push(typingPlaceholder);
    this.renderAiChatMessages();

    try {
      const res = await fetch('/api/admin/ai-developer/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });
      const data = await res.json();

      this.aiChatHistory = this.aiChatHistory.filter(m => !m.isTyping);

      if (data.success) {
        this.aiChatHistory.push({
          sender: 'ai',
          text: data.reply || 'İşlem tamamlandı.',
          actionResult: data.actionResult || null,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });

        if (data.actionResult && data.actionResult.executed) {
          await this.fetchData();
          this.renderStats();
          this.renderUsers();
          this.renderVerifications();
          this.renderModeration();
          this.renderSos();
          this.updateBadgeCounts();
        }
      } else {
        this.aiChatHistory.push({
          sender: 'ai',
          text: `⚠️ **Hata:** ${data.error || 'İşlem gerçekleştirilemedi.'}`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
      }
    } catch (err) {
      this.aiChatHistory = this.aiChatHistory.filter(m => !m.isTyping);
      this.aiChatHistory.push({
        sender: 'ai',
        text: `⚠️ **Bağlantı Hatası:** Sunucuya erişilemedi. Lütfen bağlantınızı kontrol edin.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    } finally {
      if (sendBtn) sendBtn.disabled = false;
      this.saveAiChatHistory();
      this.renderAiChatMessages();
    }
  },

  async runAiQuickAction(actionName) {
    const input = document.getElementById('ai-dev-prompt-input');
    let promptTitle = 'Sistem Kontrolü';
    if (actionName === 'audit_and_heal') promptTitle = '🛠️ Sistemi Tara & Onar';
    else if (actionName === 'approve_all') promptTitle = '👥 Tüm Bekleyen Onayları Ver';
    else if (actionName === 'clean_spam') promptTitle = '🧹 Spam Yorumları Temizle';
    else if (actionName === 'backup_db') promptTitle = '💾 Veritabanını Yedekle';
    else if (actionName === 'verify_emails') promptTitle = '✉️ Tüm E-Postaları Onayla';

    if (input) input.value = promptTitle;
    await this.handleAiDeveloperSubmit();
  },

  formatMarkdown(str) {
    if (!str) return '';
    let res = escapeHtml(str);
    res = res.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    res = res.replace(/\*(.*?)\*/g, '<em>$1</em>');
    res = res.replace(/`([^`]+)`/g, '<code style="background:rgba(255,255,255,0.1); padding:2px 5px; border-radius:4px; font-family:monospace; color:#38BDF8;">$1</code>');
    res = res.replace(/\n/g, '<br>');
    return res;
  }
};

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function formatDate(isoStr) {
  if (!isoStr) return '';
  const d = new Date(isoStr);
  return `${d.toLocaleDateString('tr-TR')} ${d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}`;
}

document.addEventListener('DOMContentLoaded', () => {
  AdminApp.init();

  // Search input
  const search = document.getElementById('user-search-input');
  if (search) {
    search.addEventListener('input', (e) => {
      AdminApp.renderUsers(e.target.value);
    });
  }
});
