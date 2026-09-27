// ============================================================================
// MOBİL TAMİRCİM - ACİL YOL YARDIM RADARI & 7/24 NÖBETÇİ ÇEKİCİ / SEYYAR USTA
// ============================================================================

const SOS = {
  requests: [],
  services: [],
  cities: ['İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Kocaeli'],
  activeTab: 'radar', // 'radar' | 'directory'
  feedFilter: 'all', // 'all' | 'active' | 'resolved'
  selectedCity: 'all',
  selectedCategory: 'all',
  currentGps: null,
  activeRespondingSosId: null,

  init(stateSos) {
    this.requests = stateSos || [];
    this.renderSosFeed();
    this.loadEmergencyServices();
  },

  render() {
    this.switchTab(this.activeTab || 'radar');
  },

  switchTab(tabName) {
    this.activeTab = tabName;
    const tabRadarBtn = document.getElementById('sos-tab-btn-radar');
    const tabDirBtn = document.getElementById('sos-tab-btn-dir');
    const sectionRadar = document.getElementById('sos-section-radar');
    const sectionDir = document.getElementById('sos-section-dir');

    if (tabName === 'radar') {
      if (tabRadarBtn) tabRadarBtn.classList.add('active');
      if (tabDirBtn) tabDirBtn.classList.remove('active');
      if (sectionRadar) sectionRadar.style.display = 'block';
      if (sectionDir) sectionDir.style.display = 'none';
      this.renderSosFeed();
    } else {
      if (tabRadarBtn) tabRadarBtn.classList.remove('active');
      if (tabDirBtn) tabDirBtn.classList.add('active');
      if (sectionRadar) sectionRadar.style.display = 'none';
      if (sectionDir) sectionDir.style.display = 'block';
      this.loadEmergencyServices();
    }
  },

  setFeedFilter(filter, btn) {
    this.feedFilter = filter;
    document.querySelectorAll('#sos-feed-filters .filter-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    this.renderSosFeed();
  },

  async loadEmergencyServices() {
    const grid = document.getElementById('sos-services-grid');
    if (!grid) return;

    try {
      const cityParam = encodeURIComponent(this.selectedCity);
      const catParam = encodeURIComponent(this.selectedCategory);
      const res = await fetch(`/api/emergency/services?city=${cityParam}&category=${catParam}`);
      const data = await res.json();
      if (data.success) {
        this.services = data.services || [];
        this.renderServicesGrid();
      }
    } catch (e) {
      console.error('Acil servisler yüklenemedi:', e);
    }
  },

  setCityFilter(city, btn) {
    this.selectedCity = city;
    document.querySelectorAll('#sos-city-filters .filter-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    this.loadEmergencyServices();
  },

  setCategoryFilter(cat, btn) {
    this.selectedCategory = cat;
    document.querySelectorAll('#sos-cat-filters .filter-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    this.loadEmergencyServices();
  },

  renderServicesGrid() {
    const grid = document.getElementById('sos-services-grid');
    if (!grid) return;

    if (this.services.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align:center; padding: 48px 20px; color: var(--text-dim); background: var(--bg-card); border-radius: var(--radius-md); border: 1px dashed var(--border-color);">
          <div style="font-size:2.2rem; margin-bottom:8px;">🚛</div>
          <div style="font-weight:700; color:#FFF; font-size:1.05rem;">Bu Filtrede Nöbetçi Hizmet Bulunamadı</div>
          <p style="font-size:0.85rem; margin-top:4px; color:var(--text-muted);">
            Lütfen şehir veya hizmet kategorisi filtresini "Tümü" olarak değiştirin.
          </p>
        </div>
      `;
      return;
    }

    grid.innerHTML = this.services.map(item => {
      const cleanPhone = (item.phone || '').replace(/[^0-9]/g, '');
      const cleanWa = (item.whatsapp || cleanPhone || '').replace(/[^0-9]/g, '');
      const waText = encodeURIComponent(`Merhaba, yolda kaldım acil desteğe ihtiyacım var! ${item.name} nöbetçi ekibinizden yardım talep ediyorum.`);
      const waUrl = `https://wa.me/${cleanWa}?text=${waText}`;

      let catIcon = '🚛';
      if (item.category === 'tire') catIcon = '🛞';
      else if (item.category === 'battery') catIcon = '⚡';
      else if (item.category === 'locksmith') catIcon = '🔑';
      else if (item.category === 'mechanic') catIcon = '🔧';

      return `
        <div class="emergency-service-card">
          <div class="service-card-header">
            <div>
              <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px; flex-wrap:wrap;">
                <span class="badge" style="background:rgba(16,185,129,0.15); color:#6EE7B7; border:1px solid rgba(16,185,129,0.3); font-size:0.72rem;">
                  🟢 7/24 Nöbetçi
                </span>
                <span class="badge" style="background:rgba(56,189,248,0.12); color:#7DD3FC; border:1px solid rgba(56,189,248,0.25); font-size:0.72rem;">
                  ${catIcon} ${escapeHtml(item.categoryName || item.category)}
                </span>
                <span class="badge" style="background:rgba(245,158,11,0.12); color:#FCD34D; border:1px solid rgba(245,158,11,0.25); font-size:0.72rem;">
                  ⏱️ ${escapeHtml(item.responseTime || '15-20 dk')}
                </span>
              </div>
              <h3 class="service-name">${escapeHtml(item.name)}</h3>
              <div class="service-location">
                📍 <strong>${escapeHtml(item.city)}</strong> • ${escapeHtml(item.district)}
              </div>
            </div>
          </div>

          <p class="service-desc">
            "${escapeHtml(item.description)}"
          </p>

          <div class="service-features-row">
            ${(item.features || []).map(f => `
              <span class="service-feature-tag">✓ ${escapeHtml(f)}</span>
            `).join('')}
          </div>

          <div class="service-pricing-row">
            <span>🏷️ <strong>Tarife:</strong> ${escapeHtml(item.pricing || 'Piyasa standardı şeffaf fiyat')}</span>
            <span style="color:#F59E0B; font-weight:700;">★ ${item.rating || '4.9'} (${item.reviewCount || 40})</span>
          </div>

          <!-- Aksiyon Butonları (Arama & WhatsApp) -->
          <div class="service-actions-grid">
            <a href="tel:${cleanPhone}" class="btn btn-primary btn-sm service-call-btn">
              📞 Hemen Ara (${escapeHtml(item.phone)})
            </a>
            <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm service-wa-btn">
              💬 WhatsApp'tan Konum At
            </a>
          </div>
        </div>
      `;
    }).join('');
  },

  renderSosFeed() {
    const container = document.getElementById('sos-feed');
    if (!container) return;

    let items = [...this.requests];
    if (this.feedFilter === 'active') {
      items = items.filter(s => s.status === 'active');
    } else if (this.feedFilter === 'resolved') {
      items = items.filter(s => s.status === 'resolved');
    }

    if (items.length === 0) {
      container.innerHTML = `
        <div style="text-align:center; padding: 48px 20px; color: var(--text-dim); background: var(--bg-card); border-radius: var(--radius-md); border: 1px dashed var(--border-color);">
          <div style="width:44px; height:44px; border-radius:50%; background:rgba(255,255,255,0.04); display:flex; align-items:center; justify-content:center; margin:0 auto 12px auto; color:var(--text-dim);">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
          </div>
          <div style="font-weight:700; color:#FFF; font-size:1.05rem;">Şu Anda Aktif Acil Çağrı Yok</div>
          <p style="font-size:0.85rem; margin-top:4px; color:var(--text-muted);">Yollar açık, güvenli sürüşler dileriz.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = items.map(item => {
      const isActive = item.status === 'active';
      const hasCoords = item.coordinates && item.coordinates.lat && item.coordinates.lng;
      const lat = hasCoords ? Number(item.coordinates.lat) : null;
      const lng = hasCoords ? Number(item.coordinates.lng) : null;

      // Navigasyon linkleri
      const gmapsUrl = hasCoords 
        ? `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
        : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.locationCity + ' ' + item.locationDetails)}`;
      const appleUrl = hasCoords
        ? `https://maps.apple.com/?daddr=${lat},${lng}&dirflg=d`
        : `https://maps.apple.com/?q=${encodeURIComponent(item.locationCity + ' ' + item.locationDetails)}`;
      const yandexUrl = hasCoords
        ? `https://yandex.com/maps/?rtext=~${lat},${lng}&rtt=auto`
        : `https://yandex.com/maps/?text=${encodeURIComponent(item.locationCity + ' ' + item.locationDetails)}`;

      const phoneClean = (item.phone || '').replace(/[^0-9]/g, '');
      const waUrl = `https://wa.me/${phoneClean}?text=${encodeURIComponent('Merhaba, Mobil Tamircim üzerinden açtığınız acil durum yardım çağrınızı gördüm. Durumunuz nedir, nasıl yardımcı olabilirim?')}`;

      const responses = item.responses || [];

      return `
        <div class="sidebar-card sos-radar-card" style="margin-bottom:16px; border-left: 4px solid ${isActive ? '#EF4444' : '#10B981'};">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px; flex-wrap:wrap; gap:8px;">
            <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
              ${isActive ? `
                <span class="badge" style="background:rgba(239,68,68,0.2); color:#FCA5A5; border:1px solid rgba(239,68,68,0.4); display:inline-flex; align-items:center; gap:5px;">
                  <span class="gps-pulse-dot" style="background:#EF4444;"></span> ACİL YOLDA KALDI
                </span>
              ` : `
                <span class="badge" style="background:rgba(16,185,129,0.15); color:#6EE7B7; border:1px solid rgba(16,185,129,0.3);">
                  ✓ YARDIM ULAŞTI (KAPANDI)
                </span>
              `}
              ${hasCoords ? `
                <span class="badge badge-gps-pill" style="background:rgba(59,130,246,0.15); color:#93C5FD; border:1px solid rgba(59,130,246,0.3); display:inline-flex; align-items:center; gap:5px;">
                  <span class="gps-pulse-dot"></span> GPS: ${lat.toFixed(4)}, ${lng.toFixed(4)}
                </span>
              ` : ''}
              <span style="font-size:0.8rem; color:var(--text-dim);">${formatDate(item.createdAt)}</span>
            </div>
            ${item.plate && window.Auth ? Auth.renderPlate(item.plate, 'sm') : ''}
          </div>

          <h3 style="font-size:1.1rem; font-weight:800; color:#FFF; margin-bottom:6px;">
            📍 ${escapeHtml(item.locationCity)} - ${escapeHtml(item.locationDetails)}
          </h3>

          <div style="font-size:0.85rem; color:var(--text-muted); margin-bottom:10px;">
            <strong>Araç:</strong> ${escapeHtml(item.car || 'Belirtilmedi')} • 
            <strong style="color:#F87171;">Arıza Tipi:</strong> ${escapeHtml((item.issueType || '').toUpperCase())}
          </div>

          <p style="font-size:0.92rem; color:#E2E8F0; line-height:1.5; background:var(--bg-input); padding:12px; border-radius:var(--radius-sm); margin-bottom:12px; border:1px solid rgba(255,255,255,0.05);">
            "${escapeHtml(item.description)}"
          </p>

          <!-- Varsa Yola Çıkan Usta / Çekici Bildirimleri -->
          ${responses.length > 0 ? `
            <div style="background:rgba(16,185,129,0.08); border:1px solid rgba(16,185,129,0.25); border-radius:var(--radius-sm); padding:10px 14px; margin-bottom:12px;">
              <div style="font-size:0.8rem; font-weight:700; color:#34D399; margin-bottom:6px; display:flex; align-items:center; gap:6px;">
                <span>🚀</span> Yola Çıkan Ekipler (${responses.length}):
              </div>
              ${responses.map(r => `
                <div style="font-size:0.82rem; color:#E2E8F0; margin-bottom:4px; display:flex; justify-content:space-between; flex-wrap:wrap; gap:6px;">
                  <span><strong>${escapeHtml(r.responderName)}:</strong> "${escapeHtml(r.note || 'Yardım için hareket edildi.')}"</span>
                  <span class="badge" style="background:#10B981; color:#000; font-weight:700; font-size:0.7rem;">⏱️ Varış: ${escapeHtml(r.eta)}</span>
                </div>
              `).join('')}
            </div>
          ` : ''}

          <!-- Navigasyon Çubuğu -->
          <div style="margin-bottom:12px; background:rgba(0,0,0,0.25); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:10px 12px;">
            <div style="font-size:0.75rem; font-weight:700; color:var(--text-muted); margin-bottom:8px; display:flex; align-items:center; gap:5px;">
              <span>🧭</span> Çekici & Usta İçin Canlı Rota & Navigasyon:
            </div>
            <div style="display:flex; gap:8px; flex-wrap:wrap;">
              <a href="${gmapsUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm" style="font-size:0.78rem; padding:5px 10px; display:inline-flex; align-items:center; gap:5px; border-color:#3B82F6; color:#93C5FD;">
                🗺️ Google Maps
              </a>
              <a href="${appleUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm" style="font-size:0.78rem; padding:5px 10px; display:inline-flex; align-items:center; gap:5px; border-color:#8B5CF6; color:#C4B5FD;">
                🧭 Apple Harita
              </a>
              <a href="${yandexUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm" style="font-size:0.78rem; padding:5px 10px; display:inline-flex; align-items:center; gap:5px; border-color:#EF4444; color:#FCA5A5;">
                🚗 Yandex Navi
              </a>
              ${hasCoords ? `
                <button type="button" class="btn btn-secondary btn-sm" onclick="navigator.clipboard.writeText('${lat},${lng}'); showToast('Koordinatlar panoya kopyalandı!');" style="font-size:0.75rem; padding:5px 10px; margin-left:auto;">
                  📋 Kopyala
                </button>
              ` : ''}
            </div>
          </div>

          <!-- İletişim & Yanıt Butonları -->
          <div style="display:flex; gap:8px; flex-wrap:wrap;">
            ${item.phone ? `
              <a href="tel:${phoneClean}" class="btn btn-primary btn-sm" style="background:#EF4444; color:#FFF; border:none; display:inline-flex; align-items:center; justify-content:center; gap:6px;">
                📞 Hemen Ara
              </a>
              <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm" style="color:#34D399; border-color:rgba(16,185,129,0.3); display:inline-flex; align-items:center; gap:6px;">
                💬 WhatsApp
              </a>
            ` : ''}

            ${isActive && Auth.currentUser && Auth.currentUser.id !== item.userId ? `
              <button class="btn btn-secondary btn-sm" onclick="SOS.openRespondModal('${item.id}')" style="background:rgba(59,130,246,0.15); color:#93C5FD; border-color:rgba(59,130,246,0.3);">
                🚀 Yardıma Geliyorum
              </button>
              <button class="btn btn-secondary btn-sm" onclick="Messages.startConversationWith('${item.userId}', 'Merhaba, Mobil Tamircim üzerindeki acil çağrınızı gördüm. Durumunuz nedir, nasıl yardımcı olabilirim?', 'Acil Yardım Çağrısı: ${item.locationCity}', '#view-sos')">
                💬 Özel Mesaj
              </button>
            ` : ''}

            ${isActive && (Auth.isAdmin() || (Auth.currentUser && Auth.currentUser.id === item.userId)) ? `
              <button class="btn btn-secondary btn-sm" onclick="SOS.resolveAlert('${item.id}')" style="margin-left:auto; border-color:rgba(16,185,129,0.4); color:#34D399;">
                ✓ Yardım Ulaştı (Kapat)
              </button>
            ` : ''}
          </div>
        </div>
      `;
    }).join('');
  },

  openRespondModal(sosId) {
    if (!Auth.currentUser) {
      showToast('Yanıt vermek için lütfen giriş yapın.', 'warning');
      openModal('login-modal');
      return;
    }
    this.activeRespondingSosId = sosId;
    openModal('sos-respond-modal');
  },

  async submitRespond(e) {
    if (e && e.preventDefault) e.preventDefault();
    const sosId = this.activeRespondingSosId;
    if (!sosId) return;

    const eta = document.getElementById('sos-resp-eta')?.value || '15-20 dakika';
    const note = document.getElementById('sos-resp-note')?.value || '';

    try {
      const res = await fetch(`/api/sos/${sosId}/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          responderId: Auth.currentUser.id,
          responderName: Auth.currentUser.name,
          responderPhone: Auth.currentUser.phone || '',
          responderRole: Auth.currentUser.role,
          eta: eta,
          note: note
        })
      });

      const data = await res.json();
      if (data.success) {
        const item = this.requests.find(s => s.id === sosId);
        if (item) {
          if (!Array.isArray(item.responses)) item.responses = [];
          item.responses.push(data.response);
        }
        this.renderSosFeed();
        closeModal('sos-respond-modal');
        showToast('Yardım bildiriminiz sürücüye iletildi! Yolda dikkatli olun.');
      } else {
        showToast(data.error || 'İşlem başarısız.', 'error');
      }
    } catch (err) {
      showToast('Bağlantı hatası.', 'error');
    }
  },

  requestGpsLocation() {
    const btn = document.getElementById('sos-gps-btn');
    const statusEl = document.getElementById('sos-gps-status');
    const latInput = document.getElementById('sos-lat-input');
    const lngInput = document.getElementById('sos-lng-input');
    const locInput = document.getElementById('sos-location-input');

    if (!navigator.geolocation) {
      if (statusEl) statusEl.innerHTML = '<span style="color:#EF4444;">⚠️ Cihazınız veya tarayıcınız GPS desteklemiyor.</span>';
      showToast('Cihazınız konum servisini desteklemiyor.', 'error');
      return;
    }

    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '⏳ Konum alınıyor...';
    }
    if (statusEl) {
      statusEl.innerHTML = '<span style="color:var(--accent-amber);">📡 Uydudan hassas canlı konum alınıyor...</span>';
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const accuracy = Math.round(position.coords.accuracy || 15);

        this.currentGps = { lat, lng, accuracy };

        if (latInput) latInput.value = lat;
        if (lngInput) lngInput.value = lng;

        if (btn) {
          btn.disabled = false;
          btn.innerHTML = '✓ Güncelle';
          btn.style.borderColor = '#10B981';
          btn.style.color = '#34D399';
        }

        if (statusEl) {
          statusEl.innerHTML = `
            <span style="color:#34D399; font-weight:700;">
              ✓ Canlı GPS Alındı! (${lat.toFixed(4)}, ${lng.toFixed(4)} • ±${accuracy}m)
            </span>
          `;
        }

        if (locInput && (!locInput.value || locInput.value.includes('GPS:'))) {
          locInput.value = `📍 GPS Konumu (${lat.toFixed(5)}, ${lng.toFixed(5)})`;
        }

        showToast('Canlı GPS konumunuz başarıyla alındı!');
      },
      (error) => {
        console.warn('Geolocation error:', error);
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = '📍 Konumumu Al';
        }
        if (statusEl) {
          statusEl.innerHTML = `
            <span style="color:#F87171;">
              ⚠️ Konum izni verilmedi veya zaman aşımı. 
              <button type="button" onclick="SOS.useSimulatedGps()" style="background:none; border:none; color:var(--accent-amber); text-decoration:underline; cursor:pointer; font-size:0.75rem; padding:0;">
                (Test Konumu Kullan)
              </button>
            </span>
          `;
        }
        showToast('Konum alınamadı. Manuel adres yazabilir veya test konumunu kullanabilirsiniz.', 'warning');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  },

  useSimulatedGps() {
    const lat = 41.0082;
    const lng = 28.9784;
    this.currentGps = { lat, lng, accuracy: 10 };

    const latInput = document.getElementById('sos-lat-input');
    const lngInput = document.getElementById('sos-lng-input');
    const locInput = document.getElementById('sos-location-input');
    const cityInput = document.getElementById('sos-city-input');
    const statusEl = document.getElementById('sos-gps-status');
    const btn = document.getElementById('sos-gps-btn');

    if (latInput) latInput.value = lat;
    if (lngInput) lngInput.value = lng;
    if (cityInput && !cityInput.value) cityInput.value = 'İstanbul';
    if (locInput && !locInput.value) locInput.value = 'E-5 Karayolu / Haliç Köprüsü Çıkışı';

    if (btn) {
      btn.innerHTML = '✓ Test GPS Seçildi';
      btn.style.borderColor = '#10B981';
      btn.style.color = '#34D399';
    }
    if (statusEl) {
      statusEl.innerHTML = '<span style="color:#34D399; font-weight:700;">✓ Test GPS Konumu Ayarlandı (41.0082, 28.9784)</span>';
    }
    showToast('Örnek GPS konumu eklendi.');
  },

  async createAlert(formData) {
    const user = Auth.currentUser;
    try {
      const res = await fetch('/api/sos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          username: user.name,
          plate: formData.plate || user.plate,
          car: formData.car || user.car,
          locationCity: formData.city,
          locationDetails: formData.locationDetails,
          issueType: formData.issueType,
          description: formData.description,
          phone: formData.phone,
          coordinates: formData.coordinates || null
        })
      });

      const data = await res.json();
      if (data.success) {
        this.requests.unshift(data.sos);
        this.renderSosFeed();
        showToast('Acil durum çağrınız yayınlandı. Çevredeki usta ve çekicilere bildirildi.');
        closeModal('sos-modal');
        if (window.App && window.App.switchView) window.App.switchView('view-sos');
      } else {
        showToast(data.error || 'Hata oluştu', 'error');
      }
    } catch (err) {
      showToast('Bağlantı hatası', 'error');
    }
  },

  async resolveAlert(sosId) {
    try {
      const res = await fetch(`/api/sos/${sosId}/resolve`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        const item = this.requests.find(s => s.id === sosId);
        if (item) item.status = 'resolved';
        this.renderSosFeed();
        showToast('Acil durum çağrısı kapatıldı.');
      }
    } catch (err) {
      showToast('Hata oluştu', 'error');
    }
  }
};

window.SOS = SOS;
