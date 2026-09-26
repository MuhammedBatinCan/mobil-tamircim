// MOBİL TAMİRCİM - YEDEK PARÇA & ÇIKMA PARÇA PAZARYERİ (PARÇA BORSASI)

const Parts = {
  items: [],
  activeCategory: 'all',
  activeCondition: 'all',
  activeBrand: 'all',
  searchQuery: '',
  pendingImageData: null,
  activeDetailPartId: null,

  init(initialParts) {
    this.items = Array.isArray(initialParts) ? initialParts : [];
    this.render();
  },

  setCategory(category, btn) {
    this.activeCategory = category;
    if (btn) {
      document.querySelectorAll('#parts-category-filters .filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    }
    this.render();
  },

  setCondition(condition, btn) {
    this.activeCondition = condition;
    if (btn) {
      document.querySelectorAll('#parts-condition-filters .filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    }
    this.render();
  },

  setBrand(brand) {
    this.activeBrand = brand || 'all';
    this.render();
  },

  onSearch(val) {
    this.searchQuery = (val || '').toLowerCase().trim();
    this.render();
  },

  getFilteredParts() {
    return this.items.filter(part => {
      if (this.activeCategory !== 'all' && part.category !== this.activeCategory) return false;
      if (this.activeCondition !== 'all' && part.condition !== this.activeCondition) return false;
      if (this.activeBrand !== 'all' && (part.brand || '').toLowerCase() !== this.activeBrand.toLowerCase()) return false;
      if (this.searchQuery) {
        const fullText = `${part.title} ${part.oemCode || ''} ${part.brand || ''} ${part.model || ''} ${part.description || ''} ${part.city || ''}`.toLowerCase();
        if (!fullText.includes(this.searchQuery)) return false;
      }
      return true;
    });
  },

  render() {
    const grid = document.getElementById('parts-grid');
    if (!grid) return;

    const parts = this.getFilteredParts();
    const countBadge = document.getElementById('parts-count-badge');
    if (countBadge) countBadge.textContent = `${parts.length} İlan`;

    if (parts.length === 0) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1; padding: 40px 20px; text-align: center;">
          <div style="font-size: 2.8rem; margin-bottom: 12px;">🔍</div>
          <h3 style="color:#FFF; font-size:1.1rem; margin-bottom:6px;">Aradığınız Kriterlere Uygun Parça Bulunamadı</h3>
          <p style="color:var(--text-muted); font-size:0.85rem; max-width:420px; margin:0 auto 16px;">
            Farklı bir arama terimi deneyebilir, filtreleri sıfırlayabilir veya aradığınız parçayı bulmak için ilan açabilirsiniz.
          </p>
          <button class="btn btn-primary btn-sm" onclick="Parts.openNewPartModal()">+ Aradığınız Parça İçin İlan Ver</button>
        </div>
      `;
      return;
    }

    grid.innerHTML = parts.map(part => {
      const conditionBadgeClass = part.condition === 'Sıfır Orijinal' ? 'badge-primary' : 
                                 part.condition === 'Çıkma Orijinal' ? 'badge-cikma' : 'badge-yan-sanayi';
      
      const priceFormatted = new Intl.NumberFormat('tr-TR').format(part.price);

      return `
        <div class="part-card" onclick="Parts.openDetail('${part.id}')">
          <div class="part-card-img-wrap">
            <img class="part-card-img" src="${part.image || 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600'}" alt="${escapeHtml(part.title)}" loading="lazy">
            <span class="part-condition-tag ${conditionBadgeClass}">${escapeHtml(part.condition)}</span>
            ${part.oemCode ? `<span class="part-oem-tag" title="OEM / Parça Kodu">OEM: ${escapeHtml(part.oemCode)}</span>` : ''}
          </div>
          <div class="part-card-body">
            <div class="part-brand-row">
              <span class="part-brand-name">${escapeHtml(part.brand || 'Genel')} ${part.model ? '• ' + escapeHtml(part.model) : ''}</span>
              <span class="part-category-tag">${escapeHtml(part.category)}</span>
            </div>
            <h4 class="part-card-title">${escapeHtml(part.title)}</h4>
            <div class="part-seller-row">
              <div style="display:flex; align-items:center; gap:6px; min-width:0;">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--text-dim); flex-shrink:0;"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                <span class="part-seller-name">${escapeHtml(part.sellerName || 'Satıcı')}</span>
              </div>
              <span class="part-city">${escapeHtml(part.city || 'Türkiye')}</span>
            </div>
            <div class="part-card-footer">
              <div class="part-price-wrap">
                <span class="part-price">${priceFormatted} <small>TL</small></span>
              </div>
              <button class="btn btn-secondary btn-sm" onclick="event.stopPropagation(); Parts.openDetail('${part.id}')">
                İncele
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  },

  openDetail(partId) {
    const part = this.items.find(p => p.id === partId);
    if (!part) return;

    this.activeDetailPartId = partId;
    const container = document.getElementById('part-detail-container');
    if (!container) return;

    const conditionBadgeClass = part.condition === 'Sıfır Orijinal' ? 'badge-primary' : 
                               part.condition === 'Çıkma Orijinal' ? 'badge-cikma' : 'badge-yan-sanayi';
    const priceFormatted = new Intl.NumberFormat('tr-TR').format(part.price);
    const cleanPhone = (part.sellerPhone || '').replace(/[^0-9]/g, '');
    const whatsappUrl = cleanPhone ? `https://wa.me/90${cleanPhone.replace(/^0/, '')}?text=${encodeURIComponent('Merhaba ustam, Mobil Tamircim üzerinden ' + part.title + ' ilanınız için yazıyorum.')}` : '#';

    container.innerHTML = `
      <div class="part-detail-header-nav">
        <button class="btn btn-secondary btn-sm" onclick="App.switchView('view-parts')">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-2px; margin-right:4px;"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          Parça Borsasına Dön
        </button>
        <span style="font-size:0.8rem; color:var(--text-muted);">İlan No: #${part.id}</span>
      </div>

      <div class="part-detail-layout">
        <!-- Sol: Görsel ve Galeri -->
        <div class="part-detail-media">
          <div class="part-detail-main-img-wrap">
            <img class="part-detail-main-img" src="${part.image || 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800'}" alt="${escapeHtml(part.title)}">
            <span class="part-condition-tag ${conditionBadgeClass}" style="top:16px; left:16px; font-size:0.82rem; padding:4px 10px;">${escapeHtml(part.condition)}</span>
          </div>
          
          <!-- Satıcı Güven Kutusu -->
          <div class="part-seller-card sidebar-card" style="margin-top:16px;">
            <div style="display:flex; align-items:center; gap:12px; margin-bottom:12px;">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100" style="width:48px; height:48px; border-radius:50%; object-fit:cover; border:2px solid var(--accent-amber);" alt="Satıcı">
              <div>
                <h4 style="color:#FFF; font-size:1rem; margin:0 0 2px 0;">${escapeHtml(part.sellerName || 'Satıcı')}</h4>
                <span style="font-size:0.75rem; color:var(--accent-amber); font-weight:600;">${escapeHtml(part.sellerShop || 'Doğrulanmış Yedek Parça & Usta')}</span>
              </div>
            </div>
            <div style="font-size:0.8rem; color:var(--text-secondary); margin-bottom:14px; line-height:1.5;">
              📍 <strong>Konum:</strong> ${escapeHtml(part.city || 'İstanbul')} ${part.district ? '• ' + escapeHtml(part.district) : ''}<br>
              🚚 <strong>Teslimat:</strong> ${escapeHtml(part.shipping || 'Elden Teslim / Kargo')}
            </div>
            <div style="display:flex; gap:8px;">
              ${part.sellerPhone ? `
                <a href="tel:${part.sellerPhone}" class="btn btn-secondary btn-sm" style="flex:1; text-align:center; text-decoration:none; justify-content:center;">
                  📞 Hemen Ara
                </a>
                <a href="${whatsappUrl}" target="_blank" class="btn btn-primary btn-sm" style="flex:1.2; text-align:center; text-decoration:none; justify-content:center; background:#25D366; border-color:#25D366; color:#FFF;">
                  💬 WhatsApp
                </a>
              ` : `
                <button class="btn btn-primary btn-sm" style="width:100%;" onclick="showToast('Satıcı ile profil üzerinden iletişime geçebilirsiniz.')">Satıcıya Mesaj At</button>
              `}
            </div>
          </div>
        </div>

        <!-- Sağ: Başlık, Fiyat, Özellikler ve Teklif Formu -->
        <div class="part-detail-info">
          <div class="part-brand-row" style="margin-bottom:8px;">
            <span class="part-category-tag">${escapeHtml(part.category)}</span>
            <span class="part-brand-name">${escapeHtml(part.brand)} ${part.model ? '• ' + escapeHtml(part.model) : ''}</span>
          </div>

          <h2 class="part-detail-title">${escapeHtml(part.title)}</h2>

          <div class="part-detail-price-box">
            <div>
              <span style="font-size:0.75rem; color:var(--text-muted); display:block;">İlan Fiyatı</span>
              <span class="part-detail-price">${priceFormatted} <small style="font-size:1.1rem; color:var(--accent-amber);">TL</small></span>
            </div>
            <button class="btn btn-primary" onclick="document.getElementById('part-offer-input').focus();" style="border-radius:24px; padding:10px 20px;">
              💰 Teklif Ver / Fiyat İste
            </button>
          </div>

          <!-- Teknik Özellikler Tablosu -->
          <div class="sidebar-card" style="margin:20px 0; padding:16px;">
            <h4 style="color:#FFF; font-size:0.9rem; margin-bottom:12px; font-weight:700;">Parça Teknik Bilgileri</h4>
            <div class="part-specs-grid">
              <div class="part-spec-item">
                <span class="spec-label">OEM / Parça Kodu</span>
                <span class="spec-value" style="color:var(--accent-amber); font-weight:700;">${escapeHtml(part.oemCode || 'Belirtilmedi')}</span>
              </div>
              <div class="part-spec-item">
                <span class="spec-label">Parça Durumu</span>
                <span class="spec-value">${escapeHtml(part.condition)}</span>
              </div>
              <div class="part-spec-item">
                <span class="spec-label">Uyumlu Marka / Kasa</span>
                <span class="spec-value">${escapeHtml(part.brand)} ${escapeHtml(part.model || '')}</span>
              </div>
              <div class="part-spec-item">
                <span class="spec-label">İlan Tarihi</span>
                <span class="spec-value">${new Date(part.createdAt).toLocaleDateString('tr-TR')}</span>
              </div>
            </div>
          </div>

          <!-- Açıklama -->
          <div class="sidebar-card" style="margin-bottom:20px; padding:16px;">
            <h4 style="color:#FFF; font-size:0.9rem; margin-bottom:10px; font-weight:700;">İlan Açıklaması</h4>
            <p style="color:var(--text-secondary); font-size:0.88rem; line-height:1.6; margin:0;">
              ${escapeHtml(part.description || 'Detaylı bilgi için satıcı ile iletişime geçiniz.')}
            </p>
          </div>

          <!-- Teklif Bırakma Kutusu -->
          <div class="sidebar-card" style="padding:16px;">
            <h4 style="color:#FFF; font-size:0.92rem; margin-bottom:6px; font-weight:700;">Satıcıya Teklif veya Soru Bırak</h4>
            <p style="color:var(--text-muted); font-size:0.78rem; margin-bottom:14px;">
              Ciddi alıcıysanız satıcının değerlendirmesi için nakit teklifinizi ve mesajınızı iletebilirsiniz.
            </p>

            <form onsubmit="Parts.submitOffer(event, '${part.id}')">
              <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-bottom:10px;">
                <input id="part-offer-name" class="form-control" type="text" placeholder="Adınız Soyadınız" value="${Auth.currentUser ? Auth.currentUser.name : ''}" required>
                <input id="part-offer-phone" class="form-control" type="tel" placeholder="Telefon Numaranız" value="${Auth.currentUser ? (Auth.currentUser.phone || '') : ''}" required>
              </div>
              <div style="margin-bottom:10px;">
                <input id="part-offer-input" class="form-control" type="number" placeholder="Teklif Ettiğiniz Tutar (TL)" required>
              </div>
              <div style="margin-bottom:12px;">
                <textarea id="part-offer-msg" class="form-control" rows="2" placeholder="Satıcıya notunuz (örn: Maslak'tan elden teslim alabilirim)..."></textarea>
              </div>
              <button type="submit" class="btn btn-primary btn-sm" style="width:100%;">Teklifi Satıcıya Gönder</button>
            </form>

            <!-- Varsa Yapılan Teklifler -->
            ${(part.offers && part.offers.length > 0) ? `
              <div style="margin-top:16px; border-top:1px solid rgba(255,255,255,0.08); padding-top:12px;">
                <span style="font-size:0.75rem; color:var(--text-muted); font-weight:600; display:block; margin-bottom:8px;">Gelen Son Teklifler (${part.offers.length})</span>
                <div style="display:flex; flex-direction:column; gap:6px;">
                  ${part.offers.map(o => `
                    <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.06); border-radius:8px; padding:8px 12px; display:flex; justify-content:space-between; align-items:center;">
                      <div>
                        <strong style="font-size:0.8rem; color:#FFF;">${escapeHtml(o.userName)}:</strong>
                        <span style="font-size:0.76rem; color:var(--text-secondary); margin-left:4px;">"${escapeHtml(o.message || 'Fiyat teklifi')}"</span>
                      </div>
                      <span style="font-size:0.85rem; font-weight:700; color:var(--accent-amber);">${new Intl.NumberFormat('tr-TR').format(o.offerAmount)} TL</span>
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    `;

    App.switchView('view-part-detail');
  },

  openNewPartModal() {
    if (!Auth.currentUser) {
      showToast('İlan vermek için lütfen giriş yapın veya demo kullanıcı seçin.', 'error');
      openModal('auth-modal');
      return;
    }
    this.pendingImageData = null;
    const preview = document.getElementById('new-part-img-preview');
    if (preview) {
      preview.style.display = 'none';
      preview.src = '';
    }
    const form = document.getElementById('new-part-form');
    if (form) form.reset();
    openModal('new-part-modal');
  },

  handleImageUpload(input) {
    if (!input.files || !input.files[0]) return;
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      this.pendingImageData = e.target.result;
      const preview = document.getElementById('new-part-img-preview');
      if (preview) {
        preview.src = this.pendingImageData;
        preview.style.display = 'block';
      }
    };
    reader.readAsDataURL(file);
  },

  async submitPart(e) {
    e.preventDefault();
    const btn = document.getElementById('btn-submit-part');
    if (btn) btn.disabled = true;

    const title = document.getElementById('part-title-input').value.trim();
    const category = document.getElementById('part-category-select').value;
    const brand = document.getElementById('part-brand-input').value.trim();
    const model = document.getElementById('part-model-input').value.trim();
    const condition = document.getElementById('part-condition-select').value;
    const oemCode = document.getElementById('part-oem-input').value.trim();
    const price = document.getElementById('part-price-input').value.trim();
    const city = document.getElementById('part-city-input').value.trim();
    const shipping = document.getElementById('part-shipping-input').value.trim();
    const phone = document.getElementById('part-phone-input').value.trim();
    const desc = document.getElementById('part-desc-input').value.trim();

    const payload = {
      title,
      category,
      brand,
      model,
      condition,
      oemCode,
      price: Number(price),
      city,
      shipping,
      sellerPhone: phone,
      description: desc,
      image: this.pendingImageData || 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600',
      user: Auth.currentUser
    };

    try {
      const res = await fetch('/api/parts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success && data.part) {
        this.items.unshift(data.part);
        closeModal('new-part-modal');
        showToast('Parça ilanınız başarıyla yayına alındı! 🛒');
        this.render();
        App.switchView('view-parts');
      } else {
        showToast(data.error || 'İlan kaydedilemedi.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('İlan kaydedilirken bir hata oluştu.', 'error');
    } finally {
      if (btn) btn.disabled = false;
    }
  },

  async submitOffer(e, partId) {
    e.preventDefault();
    const name = document.getElementById('part-offer-name').value.trim();
    const phone = document.getElementById('part-offer-phone').value.trim();
    const amount = document.getElementById('part-offer-input').value.trim();
    const message = document.getElementById('part-offer-msg').value.trim();

    if (!amount) {
      showToast('Lütfen geçerli bir teklif tutarı girin.', 'error');
      return;
    }

    try {
      const res = await fetch(`/api/parts/${partId}/offer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName: name,
          userPhone: phone,
          offerAmount: Number(amount),
          message
        })
      });
      const data = await res.json();
      if (data.success && data.part) {
        const idx = this.items.findIndex(p => p.id === partId);
        if (idx !== -1) this.items[idx] = data.part;
        showToast('Teklifiniz satıcıya başarıyla iletildi! 🤝');
        this.openDetail(partId);
      } else {
        showToast(data.error || 'Teklif gönderilemedi.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Teklif iletilirken bir hata oluştu.', 'error');
    }
  }
};
