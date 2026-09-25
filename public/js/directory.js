// OTO SANAYİ FORUMU - SANAYİ & USTA REHBERİ (DIRECTORY.JS)

const Directory = {
  items: [],
  selectedCity: 'all',
  selectedCategory: 'all',
  currentMapItem: null,

  init(stateDirectory) {
    this.items = stateDirectory || [];
    this.populateCityDropdown();
    this.renderDirectory();
  },

  populateCityDropdown() {
    const select = document.getElementById('dir-city-select');
    if (!select) return;

    const cities = ['Tüm Şehirler', 'İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya'];
    
    select.innerHTML = cities.map(c => {
      const val = c === 'Tüm Şehirler' ? 'all' : c;
      const count = val === 'all' 
        ? this.items.length 
        : this.items.filter(i => i.city === val).length;
      return `<option value="${val}">${c} (${count})</option>`;
    }).join('');

    if (this.selectedCity) {
      select.value = this.selectedCity;
    }
  },

  filterByCity(city) {
    this.selectedCity = city;
    this.renderDirectory();
  },

  filterByCategory(cat) {
    this.selectedCategory = cat;
    this.renderDirectory();
  },

  getNavUrls(item) {
    const coords = item.coordinates || { lat: 41.0, lng: 29.0 };
    const lat = coords.lat;
    const lng = coords.lng;
    const title = encodeURIComponent(item.shopName || 'Oto Tamir Servisi');

    return {
      lat,
      lng,
      // Google Maps doğrudan rota ve sürüş modu
      google: `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=&travelmode=driving`,
      // Apple Haritalar (iOS/macOS ve tarayıcı yönlendirmesi)
      apple: `https://maps.apple.com/?daddr=${lat},${lng}&dirflg=d&q=${title}`,
      // Yandex Navigasyon (mobil uygulama açılışı ve web trafik rotası)
      yandex: `https://yandex.com.tr/haritalar/?rtext=~${lat}%2C${lng}&rtt=auto`,
      // OpenStreetMap interaktif gömülü önizleme
      osmEmbed: `https://www.openstreetmap.org/export/embed.html?bbox=${lng-0.008}%2C${lat-0.005}%2C${lng+0.008}%2C${lat+0.005}&layer=mapnik&marker=${lat}%2C${lng}`
    };
  },

  openMapModal(itemId) {
    const item = this.items.find(i => String(i.id) === String(itemId));
    if (!item) return;

    this.currentMapItem = item;
    const nav = this.getNavUrls(item);

    const titleEl = document.getElementById('dir-map-title');
    const subtitleEl = document.getElementById('dir-map-subtitle');
    const addressEl = document.getElementById('dir-map-address');
    const iframeEl = document.getElementById('dir-map-iframe');
    const actionsEl = document.getElementById('dir-map-actions');

    if (titleEl) titleEl.textContent = item.shopName;
    if (subtitleEl) subtitleEl.textContent = `${item.city} / ${item.district} — ${item.sanayiSite}`;
    if (addressEl) addressEl.textContent = item.address;
    if (iframeEl) iframeEl.src = nav.osmEmbed;

    if (actionsEl) {
      actionsEl.innerHTML = `
        <a href="${nav.google}" target="_blank" rel="noopener noreferrer" class="btn-nav btn-google-maps" title="Google Haritalar ile Yol Tarifi Al">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
          <span>Google Haritalar</span>
        </a>
        <a href="${nav.apple}" target="_blank" rel="noopener noreferrer" class="btn-nav btn-apple-maps" title="Apple Haritalar ile Aç">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-1.99.6-2.61 1.35-.55.63-.99 1.68-.86 2.7.99.08 2.01-.52 2.55-1.2"/></svg>
          <span>Apple Haritalar</span>
        </a>
        <a href="${nav.yandex}" target="_blank" rel="noopener noreferrer" class="btn-nav btn-yandex-nav" title="Yandex Navigasyon ile Git">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M2.5 12l19-9-9 19-2-8z"/></svg>
          <span>Yandex Navigasyon</span>
        </a>
      `;
    }

    openModal('dir-map-modal');
  },

  copyCoords() {
    if (!this.currentMapItem || !this.currentMapItem.coordinates) return;
    const { lat, lng } = this.currentMapItem.coordinates;
    const str = `${lat}, ${lng}`;
    navigator.clipboard.writeText(str).then(() => {
      showToast(`Koordinatlar panoya kopyalandı: ${str}`, 'success');
    }).catch(() => {
      showToast(`Koordinat: ${str}`);
    });
  },

  renderDirectory() {
    const container = document.getElementById('directory-feed');
    if (!container) return;

    let list = [...this.items];

    if (this.selectedCity !== 'all') {
      list = list.filter(item => item.city === this.selectedCity);
    }

    if (this.selectedCategory !== 'all') {
      list = list.filter(item => item.categories.some(c => c.toLowerCase().includes(this.selectedCategory.toLowerCase())));
    }

    if (list.length === 0) {
      container.innerHTML = `
        <div style="text-align:center; padding: 48px 20px; color: var(--text-dim); background: var(--bg-card); border-radius: var(--radius-md); border: 1px dashed var(--border-color);">
          <div style="width:44px; height:44px; border-radius:50%; background:rgba(255,255,255,0.04); display:flex; align-items:center; justify-content:center; margin:0 auto 12px auto; color:var(--text-dim);">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>
          </div>
          <div style="font-weight:700; color:#FFF;">Bu Kriterlerde Kayıtlı Usta Bulunamadı</div>
          <p style="font-size:0.85rem; margin-top:4px; color:var(--text-muted);">Farklı bir şehir veya uzmanlık dalı seçebilirsiniz.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = list.map(item => {
      const nav = this.getNavUrls(item);
      const lat = nav.lat;
      const lng = nav.lng;

      return `
        <div class="sidebar-card dir-card" style="margin-bottom:18px;">
          <!-- Kart Üst Başlık & Puanlama -->
          <div class="dir-card-header">
            <div class="dir-header-main">
              <div class="dir-shop-title-row">
                <h3 class="dir-shop-name">${escapeHtml(item.shopName)}</h3>
                ${item.verified ? '<span class="badge badge-mechanic">✓ Onaylı Esnaf</span>' : ''}
                ${item.isOpenWeekend ? '<span class="badge badge-weekend">Pazar Açık</span>' : ''}
              </div>
              <div class="dir-owner-row">
                <span class="dir-owner-name">Usta: <strong>${escapeHtml(item.ownerName)}</strong></span>
                ${item.experienceYears ? `<span class="dir-exp-tag">${item.experienceYears} Yıl Deneyim</span>` : ''}
              </div>
            </div>
            <div class="dir-rating-box clickable" onclick="Directory.openReviewsList('${item.id}')" title="Müşteri Değerlendirmelerini ve Yorumları Oku">
              <div class="dir-rating-star">★ ${item.rating}</div>
              <div class="dir-review-count">${item.reviewCount} Değerlendirme &rarr;</div>
            </div>
          </div>

          <!-- Uzmanlık Dalları -->
          <div style="display:flex; flex-wrap:wrap; gap:6px; margin-bottom:12px;">
            ${item.categories.map(c => `
              <span class="thread-tag">${escapeHtml(c)}</span>
            `).join('')}
          </div>

          <!-- Adres & Koordinat Kartı -->
          <div class="dir-location-card">
            <div class="dir-loc-icon-wrap" title="Doğrulanmış Sanayi Konumu">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
            <div class="dir-loc-info">
              <div class="dir-loc-city">
                <strong>${escapeHtml(item.city)} / ${escapeHtml(item.district)}</strong> — ${escapeHtml(item.sanayiSite)}
              </div>
              <div class="dir-loc-address">
                ${escapeHtml(item.address)}
              </div>
              <div class="dir-loc-coords">
                <span>📍 Konum: <code>${lat.toFixed(4)}, ${lng.toFixed(4)}</code></span>
              </div>
            </div>
          </div>

          <!-- Navigasyon Uygulamaları Bölümü (Google Maps, Apple Haritalar, Yandex Navi) -->
          <div class="dir-navigation-section">
            <div class="dir-nav-header">
              <div class="dir-nav-title">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="3 11 22 2 13 21 11 13 3 11"></polygon></svg>
                <span>Yol Tarifi & Navigasyon Seçin:</span>
              </div>
            </div>
            <div class="dir-nav-buttons">
              <!-- 1. Google Haritalar -->
              <a href="${nav.google}" target="_blank" rel="noopener noreferrer" class="btn-nav btn-google-maps" title="Google Haritalar ile Yol Tarifi Al">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                <span>Google Maps</span>
              </a>

              <!-- 2. Apple Haritalar -->
              <a href="${nav.apple}" target="_blank" rel="noopener noreferrer" class="btn-nav btn-apple-maps" title="Apple Haritalar ile Aç">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-1.99.6-2.61 1.35-.55.63-.99 1.68-.86 2.7.99.08 2.01-.52 2.55-1.2"/>
                </svg>
                <span>Apple Haritalar</span>
              </a>

              <!-- 3. Yandex Navigasyon -->
              <a href="${nav.yandex}" target="_blank" rel="noopener noreferrer" class="btn-nav btn-yandex-nav" title="Yandex Navigasyon ile Başlat">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2.5 12l19-9-9 19-2-8z"/>
                </svg>
                <span>Yandex Navi</span>
              </a>

              <!-- 4. Harita Önizle -->
              <button type="button" class="btn-nav btn-map-preview" onclick="Directory.openMapModal('${item.id}')" title="Canlı Haritada Görüntüle">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/>
                </svg>
                <span>Harita Önizle</span>
              </button>
            </div>
          </div>

          <!-- Doğrudan İletişim Butonları -->
          <div class="dir-contact-footer">
            <a href="tel:${item.phone}" class="btn btn-secondary btn-sm" style="flex:1;">
              📞 Ara: ${item.phone}
            </a>
            <a href="https://wa.me/${item.whatsapp}?text=${encodeURIComponent('Merhaba ' + item.ownerName + ', Mobil Tamircim üzerinden ulaşıyorum.')}" target="_blank" class="btn btn-primary btn-sm btn-whatsapp" style="flex:1;">
              💬 WhatsApp ile Yaz
            </a>
          </div>

          <!-- Usta Değerlendirme & Yorum Yap Eylemi -->
          <div style="display:flex; gap:8px; margin-top:10px;">
            <button type="button" class="btn btn-secondary btn-sm" onclick="Directory.openReviewsList('${item.id}')" style="flex:1; font-size:0.8rem; background:rgba(255,255,255,0.04);">
              💬 Yorumları Gör (${item.reviewCount || 0})
            </button>
            <button type="button" class="btn btn-warning btn-sm" onclick="Directory.openReviewModal('${item.id}')" style="flex:1.2; font-size:0.8rem; background:rgba(245,158,11,0.12); color:#F59E0B; border:1px solid rgba(245,158,11,0.3); font-weight:600;">
              ⭐ Ustayı Değerlendir
            </button>
          </div>
        </div>
      `;
    }).join('');
  },

  currentReviewMechanicId: null,
  selectedStarRating: 5,

  openReviewModal(mechanicId) {
    const item = this.items.find(i => String(i.id) === String(mechanicId));
    if (!item) return;

    this.currentReviewMechanicId = mechanicId;
    this.selectedStarRating = 5;

    const titleEl = document.getElementById('dir-review-mechanic-name') || document.getElementById('review-modal-shop-title');
    const descEl = document.getElementById('dir-review-mechanic-shop') || document.getElementById('review-modal-shop-desc');
    const idInput = document.getElementById('dir-review-mechanic-id');
    if (idInput) idInput.value = mechanicId;

    if (titleEl) titleEl.textContent = `${item.shopName} - ${item.ownerName}`;
    if (descEl) descEl.textContent = `${item.city} / ${item.sanayiSite}`;

    this.updateStarRatingUi(5);

    // Auto fill user car if logged in
    const carInput = document.getElementById('dir-review-car-input') || document.getElementById('review-user-car');
    if (carInput && window.Auth && Auth.currentUser && Auth.currentUser.car) {
      carInput.value = Auth.currentUser.car;
    }

    if (typeof openModal === 'function') openModal('dir-review-modal');
    else {
      const modal = document.getElementById('dir-review-modal');
      if (modal) modal.classList.add('active');
    }
  },

  closeReviewModal() {
    if (typeof closeModal === 'function') closeModal('dir-review-modal');
    else {
      const modal = document.getElementById('dir-review-modal');
      if (modal) modal.classList.remove('active');
    }
    this.currentReviewMechanicId = null;
  },

  setStarRating(rating) {
    this.selectedStarRating = rating;
    this.updateStarRatingUi(rating);
  },

  updateStarRatingUi(rating) {
    const stars = document.querySelectorAll('.star-picker-btn');
    const label = document.getElementById('dir-star-label') || document.getElementById('star-rating-label');
    stars.forEach((s, idx) => {
      const r = parseInt(s.getAttribute('data-rating') || (idx + 1));
      if (r <= rating) {
        s.classList.add('active');
        s.style.color = '#F59E0B';
      } else {
        s.classList.remove('active');
        s.style.color = 'var(--text-dim)';
      }
    });

    const labels = {
      1: '1 Yıldız - Memnun Kalmadım',
      2: '2 Yıldız - Yetersiz / Geliştirilmeli',
      3: '3 Yıldız - Ortalama İşçilik',
      4: '4 Yıldız - İyi ve Temiz Esnaf',
      5: '5 Yıldız - Mükemmel Ustalık & Kesinlikle Tavsiye'
    };
    if (label) label.textContent = labels[rating] || `${rating} Yıldız`;
  },

  async submitReview(event) {
    if (event) event.preventDefault();
    const idInput = document.getElementById('dir-review-mechanic-id');
    const mechanicId = this.currentReviewMechanicId || (idInput ? idInput.value : null);
    if (!mechanicId) return;

    const rating = this.selectedStarRating;
    const serviceType = (document.getElementById('dir-review-service-input')?.value || document.getElementById('review-service-type')?.value || 'Genel Bakım & Onarım').trim();
    const cost = (document.getElementById('dir-review-cost-input')?.value || document.getElementById('review-cost')?.value || '').trim();
    const comment = (document.getElementById('dir-review-comment-input')?.value || document.getElementById('review-comment')?.value || '').trim();
    const userCar = (document.getElementById('dir-review-car-input')?.value || document.getElementById('review-user-car')?.value || '').trim();

    if (!comment) {
      showToast('Lütfen ustanın işçiliği veya deneyiminiz hakkında bir yorum yazın.', 'error');
      return;
    }

    const currentUser = (window.Auth && Auth.currentUser) ? Auth.currentUser : { id: 'usr_anon', name: 'Ziyaretçi Sürücü' };

    try {
      const res = await fetch(`/api/directory/${mechanicId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          authorName: currentUser.name,
          authorCar: userCar || currentUser.car || '',
          rating,
          serviceType,
          cost,
          comment
        })
      });

      const data = await res.json();
      if (data.success) {
        showToast('Değerlendirmeniz ve yorumunuz başarıyla kaydedildi! Teşekkür ederiz.');
        this.closeReviewModal();

        // Update local item rating
        const item = this.items.find(i => String(i.id) === String(mechanicId));
        if (item && data.mechanic) {
          item.rating = data.mechanic.rating;
          item.reviewCount = data.mechanic.reviewCount;
        }
        this.renderDirectory();
      } else {
        showToast(data.error || 'Yorum kaydedilirken bir hata oluştu', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Bağlantı hatası oluştu', 'error');
    }
  },

  async openReviewsList(mechanicId) {
    const item = this.items.find(i => String(i.id) === String(mechanicId));
    if (!item) return;

    const titleEl = document.getElementById('dir-list-mechanic-name') || document.getElementById('reviews-list-shop-title');
    const badgeEl = document.getElementById('dir-list-mechanic-stats') || document.getElementById('reviews-list-rating-badge');
    const feedEl = document.getElementById('dir-reviews-items-container') || document.getElementById('reviews-list-feed');
    const addBtn = document.getElementById('dir-list-add-review-btn') || document.getElementById('reviews-list-add-btn');

    if (titleEl) titleEl.textContent = `${item.shopName} - Müşteri Yorumları`;
    if (badgeEl) badgeEl.innerHTML = `★ ${item.rating} (${item.reviewCount || 0} Değerlendirme)`;
    if (addBtn) addBtn.onclick = () => {
      this.closeReviewsListModal();
      this.openReviewModal(item.id);
    };

    if (feedEl) {
      feedEl.innerHTML = `
        <div style="text-align:center; padding:30px; color:var(--text-muted);">
          Yorumlar yükleniyor...
        </div>
      `;
    }

    if (typeof openModal === 'function') openModal('dir-reviews-list-modal');
    else {
      const modal = document.getElementById('dir-reviews-list-modal');
      if (modal) modal.classList.add('active');
    }

    try {
      const res = await fetch(`/api/directory/${mechanicId}/reviews`);
      const data = await res.json();
      const reviews = (data && data.reviews) ? data.reviews : [];

      if (!feedEl) return;

      if (reviews.length === 0) {
        feedEl.innerHTML = `
          <div style="text-align:center; padding: 36px 20px; color: var(--text-dim); background: var(--bg-card); border-radius: var(--radius-md); border: 1px dashed var(--border-color);">
            <div style="font-size:2rem; margin-bottom:8px;">💬</div>
            <div style="font-weight:700; color:#FFF;">Henüz Değerlendirme Yapılmamış</div>
            <p style="font-size:0.85rem; margin-top:4px; color:var(--text-muted);">
              Bu ustadan hizmet aldıysanız ilk deneyim yorumunu siz paylaşın.
            </p>
            <button class="btn btn-primary btn-sm" style="margin-top:12px;" onclick="Directory.closeReviewsListModal(); Directory.openReviewModal('${item.id}');">
              İlk Yorumu Sen Yap &rarr;
            </button>
          </div>
        `;
        return;
      }

      feedEl.innerHTML = reviews.map(r => `
        <div class="sidebar-card review-item-card" style="margin-bottom:12px; padding:14px; background:var(--bg-input);">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:6px;">
            <div>
              <div style="font-weight:700; color:#FFF; font-size:0.95rem;">${escapeHtml(r.authorName)}</div>
              ${r.authorCar ? `<div style="font-size:0.75rem; color:var(--accent-amber);">🚗 ${escapeHtml(r.authorCar)}</div>` : ''}
            </div>
            <div style="text-align:right;">
              <span class="badge" style="background:rgba(245,158,11,0.15); color:#F59E0B; border:1px solid rgba(245,158,11,0.3); font-weight:700;">
                ★ ${r.rating}.0
              </span>
              <div style="font-size:0.7rem; color:var(--text-dim); margin-top:2px;">${formatDate(r.createdAt)}</div>
            </div>
          </div>

          <div style="display:flex; gap:8px; flex-wrap:wrap; margin:8px 0;">
            ${r.serviceType ? `<span class="thread-tag" style="background:rgba(59,130,246,0.12); color:#60A5FA; border:1px solid rgba(59,130,246,0.25);">${escapeHtml(r.serviceType)}</span>` : ''}
            ${r.cost ? `<span class="thread-tag" style="background:rgba(16,185,129,0.12); color:#34D399; border:1px solid rgba(16,185,129,0.25);">💰 ${escapeHtml(r.cost)}</span>` : ''}
          </div>

          <p style="font-size:0.88rem; color:#E2E8F0; line-height:1.5; margin:0;">
            "${escapeHtml(r.comment)}"
          </p>
        </div>
      `).join('');
    } catch (err) {
      console.error(err);
      if (feedEl) feedEl.innerHTML = `<div style="color:#EF4444; padding:20px; text-align:center;">Yorumlar yüklenirken bir hata oluştu.</div>`;
    }
  },

  closeReviewsListModal() {
    if (typeof closeModal === 'function') closeModal('dir-reviews-list-modal');
    else {
      const modal = document.getElementById('dir-reviews-list-modal');
      if (modal) modal.classList.remove('active');
    }
  }
};

// Global Export
window.Directory = Directory;

