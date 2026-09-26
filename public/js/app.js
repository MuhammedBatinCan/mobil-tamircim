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
        if (typeof OBD !== 'undefined' && OBD.init) {
          OBD.init(this.state.obdCodes || (typeof APP_DATA !== 'undefined' ? APP_DATA.obdCodes : []));
        }
        if (typeof Parts !== 'undefined') Parts.init(this.state.parts);
        if (typeof Garage !== 'undefined') Garage.init(this.state.garageVehicles, this.state.maintenanceRecords);
        if (typeof Quotes !== 'undefined') Quotes.init(this.state.quoteRequests);
        if (typeof Blog !== 'undefined') Blog.init(this.state.blogPosts);

        this.setupEventListeners();
        this.initUsernameLiveCheck();
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
      else if (id === 'mnav-profile' && viewId === 'view-profile') b.classList.add('active');
      else if (id !== 'mnav-ai') b.classList.remove('active');
    });

    if (viewId === 'view-forum') {
      Forum.activeBrandFilter = null;
      Forum.renderThreadList();
    } else if (viewId === 'view-profile' && typeof Profile !== 'undefined') {
      Profile.render();
    } else if (viewId === 'view-obd' && typeof OBD !== 'undefined') {
      OBD.render();
    } else if (viewId === 'view-parts' && typeof Parts !== 'undefined') {
      Parts.render();
    } else if (viewId === 'view-garage' && typeof Garage !== 'undefined') {
      Garage.render();
    } else if (viewId === 'view-quotes' && typeof Quotes !== 'undefined') {
      Quotes.render();
    } else if (viewId === 'view-blog' && typeof Blog !== 'undefined') {
      Blog.render();
    }
  },

  openUserProfile(userId) {
    if (typeof Profile !== 'undefined' && Profile.open) {
      Profile.open(userId);
    } else {
      this.switchView('view-profile');
    }
  },

  refreshCurrentView() {
    if (this.currentView === 'view-forum') {
      Forum.renderThreadList();
    } else if (this.currentView === 'view-profile' && typeof Profile !== 'undefined') {
      Profile.render();
    } else if (this.currentView === 'view-thread-detail' && Forum.activeThreadId) {
      const thread = Forum.threads.find(t => t.id === Forum.activeThreadId);
      if (thread) Forum.renderThreadDetail(thread);
    }
  },

  brandSearchQuery: '',

  onBrandSearch(query) {
    this.brandSearchQuery = (query || '').trim().toLowerCase();
    this.renderBrandGrid();
  },

  renderBrandGrid() {
    const container = document.getElementById('brands-grid');
    if (!container) return;

    let list = APP_DATA.brands;
    if (this.brandSearchQuery) {
      list = list.filter(b => 
        b.name.toLowerCase().includes(this.brandSearchQuery) ||
        (b.popularModels && b.popularModels.some(m => m.toLowerCase().includes(this.brandSearchQuery)))
      );
    }

    if (list.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align:center; padding: 40px 20px; color: var(--text-dim);">
          <p style="font-size:0.95rem; color:var(--text-main); font-weight:600;">Aradığınız marka bulunamadı</p>
          <p style="font-size:0.8rem; color:var(--text-muted);">Konu eklerken "Manuel Giriş" veya "Diğer" seçeneğini kullanarak istediğiniz markayı yazabilirsiniz.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = list.map(b => `
      <div class="sidebar-card brand-card" onclick="App.filterByBrand('${escapeHtml(b.name)}')">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
          <div class="brand-logo-wrap">
            <img class="brand-logo-img" src="${b.logoUrl || ('/img/brands/' + b.id + '.png')}" alt="${escapeHtml(b.name)}" loading="lazy" onerror="this.style.display='none'; if(this.nextElementSibling) this.nextElementSibling.style.display='inline-flex';" />
            <div class="brand-monogram-badge fallback" style="display:none;">${b.logo || b.name.substring(0,3).toUpperCase()}</div>
          </div>
          ${b.popular ? '<span class="brand-popular-tag">Popüler</span>' : ''}
        </div>
        <h3 class="brand-card-title">${escapeHtml(b.name)} Kulübü</h3>
        <p class="brand-card-models">
          ${b.popularModels && b.popularModels.length ? b.popularModels.slice(0, 4).join(', ') : 'Model tartışmaları ve teknik destek'}
        </p>
        <div class="brand-card-link">
          Tartışmaları İncele &rarr;
        </div>
      </div>
    `).join('');
  },

  filterByBrand(brandName) {
    this.switchView('view-forum');
    Forum.setBrandFilter(brandName);
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
      const popularBrands = APP_DATA.brands.filter(b => b.popular);
      const allBrandsSorted = [...APP_DATA.brands].sort((a, b) => a.name.localeCompare(b.name, 'tr'));

      let html = `<option value="">-- Araç Markası Seçin --</option>`;

      html += `<optgroup label="⭐ Popüler Markalar">`;
      popularBrands.forEach(b => {
        html += `<option value="${b.name}">${b.name}</option>`;
      });
      html += `</optgroup>`;

      html += `<optgroup label="🚗 Tüm Markalar (A-Z - ${allBrandsSorted.length} Marka)">`;
      allBrandsSorted.forEach(b => {
        html += `<option value="${b.name}">${b.name}</option>`;
      });
      html += `</optgroup>`;

      html += `<optgroup label="✨ Diğer">`;
      html += `<option value="Diğer">Diğer (Listede Yoksa - Kendin Yaz)</option>`;
      html += `</optgroup>`;

      brandSelect.innerHTML = html;
    }

    // Populate Datalist for prices and search inputs
    const allBrandsDatalist = document.getElementById('all-brands-datalist');
    if (allBrandsDatalist) {
      allBrandsDatalist.innerHTML = APP_DATA.brands.map(b => `<option value="${b.name}">`).join('');
    }
  },

  onBrandSelectChange(brandName) {
    const customWrap = document.getElementById('brand-custom-wrap');
    const customInput = document.getElementById('thread-brand-custom-input');
    const modelInput = document.getElementById('thread-model-input');
    const modelSuggestions = document.getElementById('model-suggestions');

    if (brandName === 'Diğer') {
      if (customWrap) customWrap.style.display = 'block';
      if (customInput) {
        customInput.focus();
        customInput.required = true;
      }
      if (modelInput) modelInput.placeholder = 'Örn: Özel Model Adı';
      if (modelSuggestions) modelSuggestions.innerHTML = '';
      this.updateEngineOptions('', '');
      return;
    }

    if (customWrap) customWrap.style.display = 'none';
    if (customInput) {
      customInput.value = '';
      customInput.required = false;
    }

    const brandObj = APP_DATA.brands.find(b => b.name.toLowerCase() === (brandName || '').toLowerCase());
    if (brandObj && brandObj.popularModels && brandObj.popularModels.length > 0) {
      if (modelInput) {
        modelInput.placeholder = `Örn: ${brandObj.popularModels.slice(0, 3).join(', ')}...`;
      }
      if (modelSuggestions) {
        // Hem baz modelleri hem de o modelin bilinen motor kombinasyonlarını datalist'e ekle
        const allSuggestions = [];
        brandObj.popularModels.forEach(m => {
          allSuggestions.push(m);
          // Modelin motorlarını getir
          const engines = APP_DATA.getEnginesFor ? APP_DATA.getEnginesFor(brandName, m) : [];
          if (engines && engines.length > 0) {
            engines.slice(0, 4).forEach(eng => {
              // "Superb 1.5 TSI ACT (150 HP)" gibi bileşik öneriler
              const cleanEng = eng.split('DSG')[0].split('EDC')[0].split('DCT')[0].split('Benzin')[0].split('Dizel')[0].trim();
              const combo = `${m} ${cleanEng}`;
              if (!allSuggestions.includes(combo)) {
                allSuggestions.push(combo);
              }
            });
          }
        });
        modelSuggestions.innerHTML = allSuggestions.map(s => `<option value="${s}">`).join('');
      }
    } else {
      if (modelInput) modelInput.placeholder = 'Örn: Megane, Golf, Egea, Superb...';
      if (modelSuggestions) modelSuggestions.innerHTML = '';
    }

    // Seçilen markaya göre motor alanını ve hızlı çipleri yenile
    const currentModel = modelInput ? modelInput.value.trim() : '';
    this.updateEngineOptions(brandName, currentModel);
  },

  onModelInputChange(modelVal) {
    const brandSelect = document.getElementById('thread-brand-select');
    let brandName = brandSelect ? brandSelect.value : '';
    const customBrandWrap = document.getElementById('brand-custom-wrap');
    const customBrandInput = document.getElementById('thread-brand-custom-input');
    if (customBrandWrap && customBrandWrap.style.display !== 'none') {
      brandName = customBrandInput ? customBrandInput.value.trim() : '';
    }

    const modelInput = document.getElementById('thread-model-input');
    const engineInput = document.getElementById('thread-engine-input');

    // Eğer kullanıcı datalist'ten bileşik seçim yaptıysa (örn: "Superb 1.5 TSI ACT (150 HP)")
    if (modelVal && modelVal.includes(' ')) {
      const parts = modelVal.split(' ');
      const firstWord = parts[0];
      const rest = parts.slice(1).join(' ');

      if (/TSI|TDI|dCi|Multijet|EcoBoost|PureTech|BlueHDi|CRDi|HP|kW|Hybrid|Hibrit|d\b|i\b/i.test(rest)) {
        if (modelInput) modelInput.value = firstWord;
        if (engineInput) engineInput.value = rest;
        modelVal = firstWord;
      }
    }

    this.updateEngineOptions(brandName, modelVal);
  },

  updateEngineOptions(brandName, modelName) {
    const engineInput = document.getElementById('thread-engine-input');
    const engineSuggestions = document.getElementById('engine-suggestions');
    const chipsContainer = document.getElementById('quick-engine-chips');
    if (!engineSuggestions) return;

    const engines = APP_DATA.getEnginesFor ? APP_DATA.getEnginesFor(brandName, modelName) : (APP_DATA.genericEngines || []);

    // 1. Motor datalist'ini doldur
    engineSuggestions.innerHTML = engines.map(e => `<option value="${e}">`).join('');

    // 2. Placeholder ayarla
    if (engineInput && engines.length > 0) {
      const sample = engines.slice(0, 2).map(e => e.split('(')[0].trim()).join(', ');
      engineInput.placeholder = `Örn: ${sample}...`;
    }

    // 3. Tek tıkla hızlı motor seçim çipleri (Hızlı Seçim)
    if (chipsContainer) {
      if (engines.length === 0) {
        chipsContainer.innerHTML = '';
        return;
      }

      const topEngines = engines.slice(0, 6);
      chipsContainer.innerHTML = topEngines.map(e => {
        let chipLabel = e.split('DSG')[0].split('EDC')[0].split('DCT')[0].split('Benzin')[0].split('Dizel')[0].trim();
        if (chipLabel.length > 22) {
          chipLabel = chipLabel.substring(0, 22) + '...';
        }
        const safeEngineStr = e.replace(/'/g, "\\'");
        return `<span class="engine-quick-chip" onclick="App.setEngine('${safeEngineStr}', this)">${chipLabel}</span>`;
      }).join('');
    }
  },

  setEngine(engineStr, chipEl) {
    const engineInput = document.getElementById('thread-engine-input');
    if (engineInput) {
      engineInput.value = engineStr;
      engineInput.focus();
    }
    if (chipEl && chipEl.parentElement) {
      chipEl.parentElement.querySelectorAll('.engine-quick-chip').forEach(c => c.classList.remove('active'));
      chipEl.classList.add('active');
    }
  },


  toggleCustomBrand(forceShow) {
    const selectWrap = document.getElementById('brand-select-wrap');
    const customWrap = document.getElementById('brand-custom-wrap');
    const brandSelect = document.getElementById('thread-brand-select');
    const customInput = document.getElementById('thread-brand-custom-input');
    const btn = document.getElementById('btn-toggle-custom-brand');

    const shouldShow = forceShow !== undefined ? forceShow : (customWrap && customWrap.style.display === 'none');

    if (shouldShow) {
      if (selectWrap) selectWrap.style.display = 'none';
      if (customWrap) customWrap.style.display = 'block';
      if (btn) btn.textContent = 'Listeden Seç';
      if (customInput) {
        customInput.focus();
        customInput.required = true;
      }
      if (brandSelect) brandSelect.value = '';
    } else {
      if (selectWrap) selectWrap.style.display = 'block';
      if (customWrap) customWrap.style.display = 'none';
      if (btn) btn.textContent = 'Manuel Giriş';
      if (customInput) {
        customInput.value = '';
        customInput.required = false;
      }
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
      // Araç Markası: Listeden veya manuel özel girişten al
      let brand = document.getElementById('thread-brand-select').value;
      const customBrandWrap = document.getElementById('brand-custom-wrap');
      const customBrandInput = document.getElementById('thread-brand-custom-input');
      const isCustomBrandActive = customBrandWrap && customBrandWrap.style.display !== 'none';

      if (isCustomBrandActive || brand === 'Diğer') {
        brand = (customBrandInput && customBrandInput.value.trim()) || 'Diğer';
      }

      let model = document.getElementById('thread-model-input').value.trim();
      let engine = document.getElementById('thread-engine-input') ? document.getElementById('thread-engine-input').value.trim() : '';

      // Model kutusuna bileşik yazıldıysa (örn: Superb 1.5 TSI ACT) ve motor boşsa akıllı ayrıştır:
      if (model && !engine && model.includes(' ') && /TSI|TDI|dCi|Multijet|EcoBoost|PureTech|BlueHDi|CRDi|HP|kW|Hybrid|Hibrit|d\b|i\b/i.test(model)) {
        const parts = model.split(' ');
        model = parts[0];
        engine = parts.slice(1).join(' ');
      }

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
        title, category, brand, model, engine, obdCode, content, allowCommentsFrom, hasAudio
      });

      newThreadForm.reset();
      const chipsContainer = document.getElementById('quick-engine-chips');
      if (chipsContainer) chipsContainer.innerHTML = '';
      if (typeof Forum.toggleCustomObd === 'function') {
        Forum.toggleCustomObd(false);
      }
      if (typeof App.toggleCustomBrand === 'function') {
        App.toggleCustomBrand(false);
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

      const latVal = document.getElementById('sos-lat-input') ? document.getElementById('sos-lat-input').value : '';
      const lngVal = document.getElementById('sos-lng-input') ? document.getElementById('sos-lng-input').value : '';
      const coordinates = (latVal && lngVal) ? { lat: parseFloat(latVal), lng: parseFloat(lngVal) } : null;

      SOS.createAlert({ city, locationDetails, plate, car, issueType, phone, description, coordinates });
      sosForm.reset();
      const statusEl = document.getElementById('sos-gps-status');
      if (statusEl) statusEl.innerHTML = 'Konumunuzu tek tıkla çekici ve ustalara navigasyon olarak iletin.';
      const gpsBtn = document.getElementById('sos-gps-btn');
      if (gpsBtn) {
        gpsBtn.innerHTML = '📍 Konumumu Al';
        gpsBtn.style.borderColor = 'rgba(239,68,68,0.4)';
        gpsBtn.style.color = '#FCA5A5';
      }
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

  const usernameInput = document.getElementById('reg-username');
  if (usernameInput && usernameInput.dataset.valid === 'false') {
    showToast('Lütfen müsait ve geçerli bir kullanıcı adı seçiniz.', 'error');
    usernameInput.focus();
    return;
  }

  const formData = {
    name, username, email, password, role, plate, car, city, shopName, sanayiSite, taxNumber, dealerName
  };

  const res = await Auth.register(formData, rememberMe);
  if (res && res.success) {
    document.getElementById('auth-register-form').reset();
    const feedbackEl = document.getElementById('reg-username-feedback');
    if (feedbackEl) feedbackEl.style.display = 'none';
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

// ==========================================
// CANLI KULLANICI ADI KONTROLÜ (DEBOUNCE)
// ==========================================
App.initUsernameLiveCheck = function() {
  const regUserEl = document.getElementById('reg-username');
  const feedbackEl = document.getElementById('reg-username-feedback');
  if (!regUserEl || !feedbackEl) return;

  let checkTimer = null;
  regUserEl.addEventListener('input', () => {
    clearTimeout(checkTimer);
    const val = regUserEl.value.trim().replace(/^@/, '');
    
    if (!val) {
      feedbackEl.style.display = 'none';
      regUserEl.style.borderColor = '';
      regUserEl.removeAttribute('data-valid');
      return;
    }

    if (val.length < 3) {
      feedbackEl.style.display = 'block';
      feedbackEl.style.color = '#F59E0B';
      feedbackEl.textContent = '⚠️ Kullanıcı adı en az 3 karakter olmalıdır.';
      regUserEl.style.borderColor = '#F59E0B';
      regUserEl.dataset.valid = 'false';
      return;
    }

    feedbackEl.style.display = 'block';
    feedbackEl.style.color = '#94A3B8';
    feedbackEl.textContent = '⏳ Kontrol ediliyor...';

    checkTimer = setTimeout(async () => {
      try {
        const res = await fetch('/api/auth/check-username?username=' + encodeURIComponent(val));
        const data = await res.json();
        if (data.available) {
          feedbackEl.style.display = 'block';
          feedbackEl.style.color = '#10B981';
          feedbackEl.textContent = '✓ ' + (data.message || 'Bu kullanıcı adı kullanılabilir!');
          regUserEl.style.borderColor = '#10B981';
          regUserEl.dataset.valid = 'true';
        } else {
          feedbackEl.style.display = 'block';
          feedbackEl.style.color = '#EF4444';
          feedbackEl.textContent = '✕ ' + (data.error || 'Bu kullanıcı adı kullanılamaz!');
          regUserEl.style.borderColor = '#EF4444';
          regUserEl.dataset.valid = 'false';
        }
      } catch (e) {
        feedbackEl.style.display = 'none';
      }
    }, 300);
  });
};

// ==========================================
// YAZILIMCIYA BİLDİR (DEVELOPER REPORT)
// ==========================================
App.reportImageBase64 = null;

App.openReportDeveloperModal = function() {
  const user = (window.Auth && window.Auth.currentUser) ? window.Auth.currentUser : null;
  const emailInput = document.getElementById('dev-report-email');
  if (emailInput && user && user.email) {
    emailInput.value = user.email;
  }
  openModal('report-developer-modal');
};

App.handleReportImageUpload = function(input) {
  if (input.files && input.files[0]) {
    const file = input.files[0];
    if (file.size > 5 * 1024 * 1024) {
      showToast('Görsel boyutu 5 MB altında olmalıdır.', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      App.reportImageBase64 = e.target.result;
      const previewWrap = document.getElementById('dev-report-img-preview');
      const previewImg = document.getElementById('dev-report-preview-img');
      const clearBtn = document.getElementById('dev-report-clear-img');
      if (previewImg && previewWrap) {
        previewImg.src = App.reportImageBase64;
        previewWrap.style.display = 'block';
      }
      if (clearBtn) clearBtn.style.display = 'inline-block';
    };
    reader.readAsDataURL(file);
  }
};

App.clearReportImage = function() {
  App.reportImageBase64 = null;
  const previewWrap = document.getElementById('dev-report-img-preview');
  const clearBtn = document.getElementById('dev-report-clear-img');
  const fileInput = document.getElementById('dev-report-file');
  if (previewWrap) previewWrap.style.display = 'none';
  if (clearBtn) clearBtn.style.display = 'none';
  if (fileInput) fileInput.value = '';
};

App.submitDeveloperReport = async function(event) {
  event.preventDefault();
  const category = document.getElementById('dev-report-category').value;
  const title = document.getElementById('dev-report-title').value.trim();
  const message = document.getElementById('dev-report-message').value.trim();
  const email = document.getElementById('dev-report-email') ? document.getElementById('dev-report-email').value.trim() : '';

  if (!title || !message) {
    showToast('Lütfen başlık ve açıklama alanlarını doldurunuz.', 'error');
    return;
  }

  const btn = document.getElementById('btn-submit-dev-report');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<span>⏳ Gönderiliyor...</span>';
  }

  try {
    const user = (window.Auth && window.Auth.currentUser) ? window.Auth.currentUser : null;
    const payload = {
      category,
      title,
      message,
      image: App.reportImageBase64 || '',
      userEmail: email || (user ? user.email : ''),
      userName: user ? user.name : 'Ziyaretçi',
      userUsername: user ? user.username : 'ziyaretci',
      userId: user ? user.id : 'usr_anon',
      userRole: user ? user.role : 'guest',
      pageUrl: window.location.href,
      userAgent: navigator.userAgent,
      screenResolution: `${window.innerWidth}x${window.innerHeight}`
    };

    const res = await fetch('/api/feedback/report-developer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (data.success) {
      showToast('Bildiriminiz yazılımcıya başarıyla iletildi ve e-posta bildirimi oluşturuldu! Teşekkür ederiz.');
      closeModal('report-developer-modal');
      document.getElementById('report-developer-form').reset();
      App.clearReportImage();
    } else {
      showToast(data.error || 'Bildirim iletilemedi.', 'error');
    }
  } catch (err) {
    showToast('Sunucu bağlantı hatası oluştu.', 'error');
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '<span>✉️ Yazılımcıya Gönder</span>';
    }
  }
};

// Global Export
window.App = App;

