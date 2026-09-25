// OTO SANAYİ FORUMU - SOS ACİL DURUM / YOLDA KALDIM MODÜLÜ

const SOS = {
  requests: [],
  currentGps: null,

  init(stateSos) {
    this.requests = stateSos || [];
    this.renderSosFeed();
  },

  renderSosFeed() {
    const container = document.getElementById('sos-feed');
    if (!container) return;

    if (this.requests.length === 0) {
      container.innerHTML = `
        <div style="text-align:center; padding: 48px 20px; color: var(--text-dim); background: var(--bg-card); border-radius: var(--radius-md); border: 1px dashed var(--border-color);">
          <div style="width:44px; height:44px; border-radius:50%; background:rgba(255,255,255,0.04); display:flex; align-items:center; justify-content:center; margin:0 auto 12px auto; color:var(--text-dim);">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
          </div>
          <div style="font-weight:700; color:#FFF;">Şu Anda Aktif Acil Çağrı Yok</div>
          <p style="font-size:0.85rem; margin-top:4px; color:var(--text-muted);">Yollar açık, güvenli sürüşler dileriz.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = this.requests.map(item => {
      const isActive = item.status === 'active';
      const hasCoords = item.coordinates && item.coordinates.lat && item.coordinates.lng;
      const lat = hasCoords ? Number(item.coordinates.lat) : null;
      const lng = hasCoords ? Number(item.coordinates.lng) : null;

      // Map links for navigation
      const gmapsUrl = hasCoords 
        ? `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
        : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.locationCity + ' ' + item.locationDetails)}`;
      const appleUrl = hasCoords
        ? `https://maps.apple.com/?daddr=${lat},${lng}&dirflg=d`
        : `https://maps.apple.com/?q=${encodeURIComponent(item.locationCity + ' ' + item.locationDetails)}`;
      const yandexUrl = hasCoords
        ? `https://yandex.com/maps/?rtext=~${lat},${lng}&rtt=auto`
        : `https://yandex.com/maps/?text=${encodeURIComponent(item.locationCity + ' ' + item.locationDetails)}`;

      return `
        <div class="sidebar-card" style="margin-bottom:16px; border-left: 3px solid ${isActive ? '#EF4444' : '#10B981'};">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px; flex-wrap:wrap; gap:8px;">
            <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
              ${isActive ? '<span class="badge" style="background:rgba(239,68,68,0.15); color:#FCA5A5; border:1px solid rgba(239,68,68,0.3);">ACİL YOLDA KALDI</span>' : '<span class="badge" style="background:rgba(16,185,129,0.15); color:#6EE7B7; border:1px solid rgba(16,185,129,0.3);">YARDIM ULAŞTI</span>'}
              ${hasCoords ? `
                <span class="badge badge-gps-pill" style="background:rgba(59,130,246,0.15); color:#93C5FD; border:1px solid rgba(59,130,246,0.3); display:inline-flex; align-items:center; gap:5px;">
                  <span class="gps-pulse-dot"></span> GPS: ${lat.toFixed(4)}, ${lng.toFixed(4)}
                </span>
              ` : ''}
              <span style="font-size:0.8rem; color:var(--text-dim);">${formatDate(item.createdAt)}</span>
            </div>
            ${Auth.renderPlate(item.plate, 'sm')}
          </div>

          <h3 style="font-size:1.05rem; font-weight:700; color:#FFF; margin-bottom:6px;">
            ${escapeHtml(item.locationCity)} - ${escapeHtml(item.locationDetails)}
          </h3>

          <div style="font-size:0.85rem; color:var(--text-muted); margin-bottom:10px;">
            <strong>Araç:</strong> ${escapeHtml(item.car || 'Belirtilmedi')} • 
            <strong style="color:#F87171;">Arıza:</strong> ${escapeHtml(item.issueType.toUpperCase())}
          </div>

          <p style="font-size:0.9rem; color:#E2E8F0; line-height:1.5; background:var(--bg-input); padding:10px; border-radius:var(--radius-sm); margin-bottom:12px;">
            "${escapeHtml(item.description)}"
          </p>

          <!-- Navigasyon & Canlı Yol Tarifi Butonları -->
          <div style="margin-bottom:12px; background:rgba(0,0,0,0.25); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:10px 12px;">
            <div style="font-size:0.75rem; font-weight:700; color:var(--text-muted); margin-bottom:8px; display:flex; align-items:center; gap:5px;">
              <span>🧭</span> Çekici & Usta İçin Canlı Navigasyon:
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

          <div style="display:flex; gap:10px; flex-wrap:wrap;">
            <a href="tel:${item.phone}" class="btn btn-primary btn-sm" style="background:#EF4444; color:#FFF; border:none; flex:1; display:inline-flex; align-items:center; justify-content:center; gap:6px;">
              📞 Hemen Ara: ${item.phone}
            </a>
            ${isActive && (Auth.isAdmin() || (Auth.currentUser && Auth.currentUser.id === item.userId)) ? `
              <button class="btn btn-secondary btn-sm" onclick="SOS.resolveAlert('${item.id}')">
                Yardım Ulaştı Olarak Kapat
              </button>
            ` : ''}
          </div>
        </div>
      `;
    }).join('');
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
        else if (typeof App !== 'undefined' && App.switchView) App.switchView('view-sos');
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

// Global Export
window.SOS = SOS;
