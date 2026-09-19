// OTO SANAYİ FORUMU - ANA UYGULAMA KONTROL MERKEZİ (APP.JS)

const App = {
  currentView: 'view-forum',
  state: null,
  deferredPrompt: null,

  async init() {
    try {
      this.setupPwa();

      const res = await fetch('/api/state');
      const json = await res.json();
      if (json.success) {
        this.state = json.data;
        
        // Initialize sub-modules with fresh server state
        Auth.init(this.state.users);
        Forum.init(this.state.threads, this.state.comments);
        Directory.init(this.state.directory);
        PriceAnalysis.init(this.state.priceBenchmarks);
        SOS.init(this.state.sosRequests);

        this.setupEventListeners();
        this.renderBrandGrid();
        this.renderUserSwitcherOptions();
      }
    } catch (err) {
      console.error('State fetch error:', err);
      showToast('Sunucuya bağlanılamadı, lütfen sayfayı yenileyin.', 'error');
    }
  },

  setupPwa() {
    // 1. Service Worker Kaydı
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then(reg => console.log('✓ Mobil Tamircim Service Worker kayıtlı:', reg.scope))
          .catch(err => console.log('Service worker kaydı:', err));
      });
    }

    // 2. Yerel PWA Kurulum Tetikleyicisi
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      const isDismissed = sessionStorage.getItem('pwa_banner_dismissed');
      const banner = document.getElementById('mobile-install-banner');
      if (banner && !isDismissed && window.innerWidth <= 768) {
        banner.style.display = 'flex';
      }
      const nativeWrap = document.getElementById('pwa-native-install-wrap');
      if (nativeWrap) nativeWrap.style.display = 'block';
    });

    window.addEventListener('appinstalled', () => {
      this.deferredPrompt = null;
      const banner = document.getElementById('mobile-install-banner');
      if (banner) banner.style.display = 'none';
      showToast('Mobil Tamircim telefonunuza başarıyla yüklendi.');
    });
  },

  openMobileAppModal() {
    const host = window.location.hostname === 'localhost' ? '192.168.1.5' : window.location.hostname;
    const port = window.location.port ? `:${window.location.port}` : '';
    const mobileUrl = `http://${host}${port}`;
    
    const qrImg = document.getElementById('mobile-qr-img');
    if (qrImg) {
      qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(mobileUrl)}&color=F59E0B&bgcolor=0F172A`;
    }
    openModal('mobile-app-modal');
  },

  async triggerPwaInstall() {
    if (this.deferredPrompt) {
      this.deferredPrompt.prompt();
      const { outcome } = await this.deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        showToast('Mobil Tamircim kuruluyor...');
      }
      this.deferredPrompt = null;
      const banner = document.getElementById('mobile-install-banner');
      if (banner) banner.style.display = 'none';
      closeModal('mobile-app-modal');
    } else {
      this.openMobileAppModal();
    }
  },

  dismissInstallBanner() {
    const banner = document.getElementById('mobile-install-banner');
    if (banner) banner.style.display = 'none';
    sessionStorage.setItem('pwa_banner_dismissed', 'true');
  },

  mobileNavigate(viewId, btn) {
    this.switchView(viewId);
    document.querySelectorAll('.mobile-nav-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
  },

  switchView(viewId) {
    this.currentView = viewId;
    document.querySelectorAll('.view-section').forEach(el => el.classList.remove('active'));
    
    const target = document.getElementById(viewId);
    if (target) {
      target.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Update active nav links
    document.querySelectorAll('.nav-link, .mobile-nav-item').forEach(link => {
      if (link.getAttribute('data-view') === viewId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Update mobile bottom nav buttons
    document.querySelectorAll('.mobile-nav-btn').forEach(b => {
      const id = b.id;
      if (id === 'mnav-forum' && viewId === 'view-forum') b.classList.add('active');
      else if (id === 'mnav-obd' && viewId === 'view-obd') b.classList.add('active');
      else if (id !== 'mnav-profile' && id !== 'mnav-ai') b.classList.remove('active');
    });

    if (viewId === 'view-forum') {
      Forum.activeBrandFilter = null;
      Forum.renderThreadList();
    }
  },

  refreshCurrentView() {
    if (this.currentView === 'view-forum') {
      Forum.renderThreadList();
    } else if (this.currentView === 'view-thread-detail' && Forum.activeThreadId) {
      const thread = Forum.threads.find(t => t.id === Forum.activeThreadId);
      if (thread) Forum.renderThreadDetail(thread);
    }
  },

  renderBrandGrid() {
    const container = document.getElementById('brands-grid');
    if (!container) return;

    container.innerHTML = APP_DATA.brands.map(b => `
      <div class="sidebar-card brand-card" style="cursor:pointer; transition:transform 0.15s, border-color 0.15s; margin-bottom:0;" onclick="App.filterByBrand('${b.name}')">
        <div class="brand-monogram-badge">${b.logo}</div>
        <h3 style="font-size:1.05rem; font-weight:700; color:#FFF; margin-bottom:4px;">${b.name} Kulübü</h3>
        <p style="font-size:0.78rem; color:var(--text-dim); margin-bottom:12px;">
          ${b.popularModels.join(', ')}
        </p>
        <div style="font-size:0.8rem; color:var(--accent-amber); font-weight:600;">
          Tartışmaları İncele &rarr;
        </div>
      </div>
    `).join('');
  },

  filterByBrand(brandName) {
    Forum.setBrandFilter(brandName);
    this.switchView('view-forum');
    showToast(`${brandName} Kulübü Konuları Filtrelendi`);
  },

  renderUserSwitcherOptions() {
    const container = document.getElementById('user-switcher-list');
    if (!container || !this.state.users) return;

    container.innerHTML = this.state.users.map(u => {
      const isSelected = Auth.currentUser && Auth.currentUser.id === u.id;
      return `
        <div class="user-switch-card ${isSelected ? 'selected' : ''}" onclick="Auth.switchUser('${u.id}'); closeModal('user-switcher-modal');">
          <div class="user-switch-top">
            <div class="user-switch-identity">
              <img src="${u.avatar}" class="user-switch-avatar" alt="${escapeHtml(u.name)}" />
              <div class="user-switch-names">
                <div class="user-switch-name">
                  <span>${escapeHtml(u.name)}</span>
                  <span class="user-switch-handle">@${escapeHtml(u.username)}</span>
                </div>
                <div class="user-switch-car">${escapeHtml(u.car || 'Araç tanımlanmadı')}</div>
              </div>
            </div>
            <div class="user-switch-plate-wrap">
              ${Auth.renderPlate(u.plate, 'sm')}
            </div>
          </div>

          <div class="user-switch-badges">
            ${Auth.renderBadges(u.badges, u.level)}
            ${u.isEmailVerified === false ? `<button type="button" class="badge" style="background:rgba(245,158,11,0.12); color:#FCD34D; border:1px solid rgba(245,158,11,0.3); cursor:pointer; font-weight:600;" onclick="event.stopPropagation(); Auth.openVerifyModalForUser('${u.id}')" title="Doğrulama kodunu girmek için tıklayın">E-Postayı Doğrula</button>` : ''}
            ${isSelected ? '<span class="active-pill-tag">Aktif Profil</span>' : ''}
          </div>
        </div>
      `;
    }).join('');
  },

  setupEventListeners() {
    // Navigation items
    document.querySelectorAll('[data-view]').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const view = item.getAttribute('data-view');
        if (view) this.switchView(view);
      });
    });

    // Populate OBD codes in thread creation (Categorized optgroups + Custom Code Option)
    const obdSelect = document.getElementById('thread-obd-select');
    if (obdSelect) {
      const groups = {};
      APP_DATA.obdCodes.forEach(item => {
        const cat = item.category || 'Diğer / Genel';
        if (!groups[cat]) groups[cat] = [];
        groups[cat].push(item);
      });

      let html = `
        <option value="">-- OBD-II Kodu Yok / Bilinmiyor --</option>
        <option value="CUSTOM" style="font-weight:700; color:var(--accent-amber); background:rgba(245,158,11,0.12);">
          Listede Yok - Kendi Kodumu Yazmak İstiyorum (Özel Kod)
        </option>
      `;

      for (const [catName, codes] of Object.entries(groups)) {
        html += `<optgroup label="${catName} (${codes.length} Kod)">`;
        codes.forEach(c => {
          html += `<option value="${c.code}">${c.code} - ${c.title}</option>`;
        });
        html += `</optgroup>`;
      }

      obdSelect.innerHTML = html;
    }

    // Populate Brand in thread creation
    const brandSelect = document.getElementById('thread-brand-select');
    if (brandSelect) {
      brandSelect.innerHTML = `<option value="">-- Marka Seçin --</option>` +
        APP_DATA.brands.map(b => `<option value="${b.name}">${b.name}</option>`).join('');
    }
  }
};

// Global Helpers
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatDate(isoStr) {
  if (!isoStr) return '';
  const d = new Date(isoStr);
  const now = new Date();
  const diffSec = Math.floor((now - d) / 1000);

  if (diffSec < 60) return 'Az önce';
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)} dakika önce`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} saat önce`;
  return `${d.getDate().toString().padStart(2, '0')}.${(d.getMonth() + 1).toString().padStart(2, '0')}.${d.getFullYear()}`;
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  if (type === 'error') {
    toast.style.borderLeftColor = 'var(--accent-red)';
  }
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add('active');
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('active');
}

// Global Form Submissions
document.addEventListener('DOMContentLoaded', () => {
  App.init();

  // New Thread Form
  const newThreadForm = document.getElementById('new-thread-form');
  if (newThreadForm) {
    newThreadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('thread-title-input').value.trim();
      const category = document.getElementById('thread-cat-select').value;
      const brand = document.getElementById('thread-brand-select').value;
      const model = document.getElementById('thread-model-input').value.trim();
      // OBD-II Kodu: Seçim listesinden veya manuel özel yazımdan al
      let obdCode = document.getElementById('thread-obd-select').value;
      const customWrap = document.getElementById('obd-custom-wrap');
      const customInput = document.getElementById('thread-obd-custom-input');
      const isCustomActive = customWrap && customWrap.style.display !== 'none';

      if (isCustomActive || obdCode === 'CUSTOM') {
        obdCode = customInput ? customInput.value.trim().toUpperCase() : '';
      }

      const content = document.getElementById('thread-content-input').value.trim();
      const allowCommentsFrom = document.querySelector('input[name="allowCommentsFrom"]:checked').value;
      const hasAudio = document.getElementById('thread-audio-check').checked;

      if (!title || !content) {
        showToast('Lütfen başlık ve açıklama giriniz.', 'error');
        return;
      }

      Forum.createThread({
        title, category, brand, model, obdCode, content, allowCommentsFrom, hasAudio
      });

      newThreadForm.reset();
      if (typeof Forum.toggleCustomObd === 'function') {
        Forum.toggleCustomObd(false);
      }
      closeModal('new-thread-modal');
    });
  }

  // Price Form
  const priceForm = document.getElementById('new-price-form');
  if (priceForm) {
    priceForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const brand = document.getElementById('price-brand-input').value.trim();
      const model = document.getElementById('price-model-input').value.trim();
      const operation = document.getElementById('price-op-input').value.trim();
      const partCost = document.getElementById('price-part-input').value;
      const laborCost = document.getElementById('price-labor-input').value;
      const city = document.getElementById('price-city-input').value.trim();

      PriceAnalysis.submitNewPrice({ brand, model, operation, partCost, laborCost, city });
      priceForm.reset();
    });
  }

  // SOS Form
  const sosForm = document.getElementById('sos-form');
  if (sosForm) {
    sosForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const city = document.getElementById('sos-city-input').value.trim();
      const locationDetails = document.getElementById('sos-location-input').value.trim();
      const plate = document.getElementById('sos-plate-input').value.trim();
      const car = document.getElementById('sos-car-input').value.trim();
      const issueType = document.getElementById('sos-issue-select').value;
      const phone = document.getElementById('sos-phone-input').value.trim();
      const description = document.getElementById('sos-desc-input').value.trim();

      SOS.createAlert({ city, locationDetails, plate, car, issueType, phone, description });
      sosForm.reset();
    });
  }

  // Verification Form
  const vrfForm = document.getElementById('verification-form');
  if (vrfForm) {
    vrfForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const type = document.getElementById('vrf-type-select').value;
      const shopName = document.getElementById('vrf-shop-input').value.trim();
      const sanayiSite = document.getElementById('vrf-sanayi-input').value.trim();
      const city = document.getElementById('vrf-city-input').value.trim();
      const district = document.getElementById('vrf-district-input').value.trim();
      const taxNumber = document.getElementById('vrf-tax-input').value.trim();
      const notes = document.getElementById('vrf-notes-input').value.trim();

      try {
        const res = await fetch('/api/verifications/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: Auth.currentUser.id,
            username: Auth.currentUser.name,
            type, shopName, sanayiSite, city, district, taxNumber, notes
          })
        });
        const data = await res.json();
        if (data.success) {
          showToast('Başvurunuz alındı. İnceleme sonrası rozetiniz tanımlanacaktır.');
          closeModal('verification-modal');
          vrfForm.reset();
        }
      } catch (err) {
        showToast('Başvuru gönderilemedi', 'error');
      }
    });
  }
});

// ==========================================================
// AUTH & GİRİŞ / KAYIT YARDIMCILARI (GÖZ BUTONU & BENİ UNUTMA)
// ==========================================================
function openAuthModal(tab = 'login') {
  switchAuthTab(tab);
  openModal('auth-modal');
}

function switchAuthTab(tab) {
  const loginBtn = document.getElementById('auth-tab-login-btn');
  const regBtn = document.getElementById('auth-tab-register-btn');
  const loginPane = document.getElementById('auth-login-pane');
  const regPane = document.getElementById('auth-register-pane');

  if (tab === 'login') {
    if (loginBtn) loginBtn.classList.add('active');
    if (regBtn) regBtn.classList.remove('active');
    if (loginPane) loginPane.classList.add('active');
    if (regPane) regPane.classList.remove('active');
  } else {
    if (regBtn) regBtn.classList.add('active');
    if (loginBtn) loginBtn.classList.remove('active');
    if (regPane) regPane.classList.add('active');
    if (loginPane) loginPane.classList.remove('active');
  }
}

function quickFillLogin(username, password) {
  const uInput = document.getElementById('login-username');
  const pInput = document.getElementById('login-password');
  if (uInput) uInput.value = username;
  if (pInput) pInput.value = password;
  showToast(`Giriş bilgileri dolduruldu: ${username}`);
}

function handleRoleChange(role) {
  const mechFields = document.getElementById('reg-mechanic-fields');
  const dealerFields = document.getElementById('reg-dealer-fields');
  if (mechFields) mechFields.style.display = role === 'mechanic' ? 'block' : 'none';
  if (dealerFields) dealerFields.style.display = role === 'dealer' ? 'block' : 'none';
}

async function handleAuthLogin(event) {
  event.preventDefault();
  const username = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value;
  const rememberMe = document.getElementById('login-remember-me').checked;

  if (!username || !password) {
    showToast('Lütfen kullanıcı adınızı veya e-postanızı ve şifrenizi giriniz.', 'error');
    return;
  }

  const res = await Auth.login(username, password, rememberMe);
  if (res && res.success) {
    document.getElementById('auth-login-form').reset();
  }
}

async function handleAuthRegister(event) {
  event.preventDefault();
  const name = document.getElementById('reg-name').value.trim();
  const username = document.getElementById('reg-username').value.trim();
  const email = document.getElementById('reg-email') ? document.getElementById('reg-email').value.trim() : '';
  const password = document.getElementById('reg-password').value;
  const role = document.getElementById('reg-role').value;
  const plate = document.getElementById('reg-plate').value.trim();
  const car = document.getElementById('reg-car').value.trim();
  const city = document.getElementById('reg-city').value.trim();
  const shopName = document.getElementById('reg-shop-name') ? document.getElementById('reg-shop-name').value.trim() : '';
  const sanayiSite = document.getElementById('reg-sanayi') ? document.getElementById('reg-sanayi').value.trim() : '';
  const taxNumber = document.getElementById('reg-tax') ? document.getElementById('reg-tax').value.trim() : '';
  const dealerName = document.getElementById('reg-dealer-name') ? document.getElementById('reg-dealer-name').value.trim() : '';
  const rememberMe = document.getElementById('reg-remember-me').checked;

  if (!name || !username || !email || !password) {
    showToast('Lütfen ad, kullanıcı adı, e-posta ve şifre alanlarını eksiksiz doldurunuz.', 'error');
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showToast('Lütfen geçerli bir e-posta adresi giriniz.', 'error');
    return;
  }

  const formData = {
    name, username, email, password, role, plate, car, city, shopName, sanayiSite, taxNumber, dealerName
  };

  const res = await Auth.register(formData, rememberMe);
  if (res && res.success) {
    document.getElementById('auth-register-form').reset();
  }
}

async function handleEmailVerifySubmit(event) {
  event.preventDefault();
  const codeInput = document.getElementById('verify-code-input');
  const code = codeInput ? codeInput.value.trim() : '';

  if (!code || code.length !== 6) {
    showToast('Lütfen 6 haneli doğrulama kodunu giriniz.', 'error');
    return;
  }

  const btn = document.getElementById('verify-submit-btn');
  if (btn) btn.disabled = true;

  try {
    await Auth.verifyEmail(code);
  } finally {
    if (btn) btn.disabled = false;
  }
}

