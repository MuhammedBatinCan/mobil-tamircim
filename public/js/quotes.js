// MOBİL TAMİRCİM - USTALARDAN FİYAT TEKLİFİ İSTEME SİSTEMİ (TEKLİF AL)

const Quotes = {
  requests: [],
  activeFilter: 'all', // 'all', 'my_quotes'
  selectedRequestId: null,

  init(initialRequests) {
    this.requests = Array.isArray(initialRequests) ? initialRequests : [];
    this.render();
  },

  setFilter(filter, btn) {
    this.activeFilter = filter;
    if (btn) {
      document.querySelectorAll('#quotes-filters .filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    }
    this.render();
  },

  render() {
    const feed = document.getElementById('quotes-feed');
    if (!feed) return;

    let list = [...this.requests];
    if (this.activeFilter === 'my_quotes') {
      const currentUserId = Auth.currentUser ? Auth.currentUser.id : null;
      list = list.filter(r => r.userId === currentUserId);
    }

    if (list.length === 0) {
      feed.innerHTML = `
        <div class="empty-state" style="padding:40px 20px; text-align:center;">
          <div style="font-size:3rem; margin-bottom:12px;">🏷️</div>
          <h3 style="color:#FFF; font-size:1.15rem; margin-bottom:6px;">Aktif Fiyat Talebi Bulunamadı</h3>
          <p style="color:var(--text-muted); font-size:0.85rem; max-width:440px; margin:0 auto 16px;">
            Aracınızın arızası, periyodik bakımı veya kaporta/boya işlemi için bölgenizdeki ustalardan ücretsiz fiyat teklifi alabilirsiniz.
          </p>
          <button class="btn btn-primary btn-sm" onclick="Quotes.openNewRequestModal()">+ Hemen Fiyat Teklifi İste</button>
        </div>
      `;
      return;
    }

    feed.innerHTML = list.map(req => {
      const offersCount = (req.offers || []).length;
      return `
        <div class="quote-card sidebar-card" style="margin-bottom:16px; padding:18px;">
          <!-- Üst Bilgi Satırı -->
          <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:10px; margin-bottom:12px;">
            <div>
              <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px;">
                <span class="badge badge-primary" style="font-size:0.75rem;">${escapeHtml(req.city || 'Türkiye')} ${req.district ? '• ' + escapeHtml(req.district) : ''}</span>
                <span style="font-size:0.75rem; color:var(--text-muted);">${new Date(req.createdAt).toLocaleDateString('tr-TR')}</span>
                <span class="badge ${req.status === 'open' ? 'badge-cikma' : 'badge-secondary'}" style="font-size:0.7rem;">
                  ${req.status === 'open' ? '🟢 Tekliflere Açık' : 'Tamamlandı'}
                </span>
              </div>
              <h3 style="color:#FFF; font-size:1.12rem; font-weight:800; margin:0 0 2px 0;">${escapeHtml(req.serviceType)}</h3>
              <div style="font-size:0.84rem; color:var(--accent-amber); font-weight:600;">
                🚗 ${escapeHtml(req.car)} ${req.userPlate ? `<span class="plate-mini" style="margin-left:6px;">${escapeHtml(req.userPlate)}</span>` : ''}
              </div>
            </div>

            <div style="text-align:right;">
              <span style="font-size:0.75rem; color:var(--text-muted); display:block;">Hedef Bütçe</span>
              <strong style="font-size:1rem; color:#FFF;">${escapeHtml(req.budget || 'Teklife Göre')}</strong>
            </div>
          </div>

          <!-- Açıklama ve Tercihler -->
          <div style="background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:12px; margin-bottom:14px;">
            <p style="color:var(--text-secondary); font-size:0.86rem; line-height:1.5; margin:0 0 8px 0;">
              ${escapeHtml(req.description || 'Açıklama belirtilmedi.')}
            </p>
            <div style="font-size:0.78rem; color:var(--text-dim);">
              ⚙️ <strong>Parça Tercihi:</strong> ${escapeHtml(req.partPreference || 'Farketmez')}
            </div>
          </div>

          <!-- Gelen Usta Teklifleri Karşılaştırma Alanı -->
          <div class="quote-offers-box" style="border-top:1px solid rgba(255,255,255,0.08); padding-top:14px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
              <strong style="font-size:0.88rem; color:#FFF;">
                🛠️ Gelen Usta Teklifleri (${offersCount})
              </strong>
              <button class="btn btn-secondary btn-sm" onclick="Quotes.openBidModal('${req.id}')" style="font-size:0.75rem; padding:4px 10px;">
                + Ustaysanız Teklif Verin
              </button>
            </div>

            ${offersCount === 0 ? `
              <p style="color:var(--text-muted); font-size:0.8rem; margin:6px 0; font-style:italic;">
                Henüz ustanın teklifi yok. Bölgedeki ustalara bildirim iletildi.
              </p>
            ` : `
              <div class="offers-grid" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap:10px;">
                ${req.offers.map(off => {
                  const totalFormatted = new Intl.NumberFormat('tr-TR').format(off.totalCost);
                  const laborFormatted = new Intl.NumberFormat('tr-TR').format(off.laborCost);
                  const partFormatted = new Intl.NumberFormat('tr-TR').format(off.partCost);

                  return `
                    <div class="offer-item-card" style="background:rgba(255,255,255,0.03); border:1px solid rgba(245,158,11,0.25); border-radius:10px; padding:12px;">
                      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:6px;">
                        <div>
                          <strong style="font-size:0.88rem; color:#FFF; display:block;">${escapeHtml(off.mechanicName)}</strong>
                          <span style="font-size:0.72rem; color:var(--text-muted);">${escapeHtml(off.mechanicShop)}</span>
                        </div>
                        <span style="font-size:1.15rem; font-weight:800; color:var(--accent-amber);">${totalFormatted} <small style="font-size:0.7rem;">TL</small></span>
                      </div>
                      <div style="font-size:0.75rem; color:var(--text-secondary); display:flex; justify-content:space-between; margin-bottom:6px; border-bottom:1px dashed rgba(255,255,255,0.06); padding-bottom:6px;">
                        <span>İşçilik: <strong>${laborFormatted} TL</strong></span>
                        <span>Parça: <strong>${partFormatted} TL</strong></span>
                      </div>
                      <div style="font-size:0.74rem; color:var(--text-muted); line-height:1.4; margin-bottom:8px;">
                        ⏱️ Süre: <strong>${escapeHtml(off.duration)}</strong> • 🛡️ Garanti: <strong>${escapeHtml(off.warranty)}</strong>
                        ${off.note ? `<div style="margin-top:4px; color:var(--text-secondary);">"${escapeHtml(off.note)}"</div>` : ''}
                      </div>
                      <button class="btn btn-primary btn-sm" style="width:100%; font-size:0.75rem; padding:4px;" onclick="showToast('Ustayla iletişime geçildi! Telefon ile aranıyor...')">
                        Ustayı Ara & Randevu Al
                      </button>
                    </div>
                  `;
                }).join('')}
              </div>
            `}
          </div>
        </div>
      `;
    }).join('');
  },

  openNewRequestModal() {
    if (!Auth.currentUser) {
      showToast('Teklif talebi oluşturmak için lütfen giriş yapın.', 'error');
      openModal('auth-modal');
      return;
    }
    const form = document.getElementById('new-quote-form');
    if (form) form.reset();
    openModal('new-quote-modal');
  },

  async submitRequest(e) {
    e.preventDefault();
    const btn = document.getElementById('btn-submit-quote-req');
    if (btn) btn.disabled = true;

    const car = document.getElementById('q-car-input').value.trim();
    const plate = document.getElementById('q-plate-input').value.trim();
    const city = document.getElementById('q-city-input').value.trim();
    const district = document.getElementById('q-district-input').value.trim();
    const serviceType = document.getElementById('q-service-input').value.trim();
    const partPref = document.getElementById('q-part-pref-select').value;
    const budget = document.getElementById('q-budget-input').value.trim();
    const desc = document.getElementById('q-desc-input').value.trim();

    try {
      const res = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: Auth.currentUser ? Auth.currentUser.id : 'usr_dev_1',
          userName: Auth.currentUser ? Auth.currentUser.name : 'Mobil Tamircim Üyesi',
          userPlate: plate,
          car,
          city,
          district,
          serviceType,
          partPreference: partPref,
          budget,
          description: desc
        })
      });
      const data = await res.json();
      if (data.success && data.request) {
        this.requests.unshift(data.request);
        closeModal('new-quote-modal');
        showToast('Fiyat teklif talebiniz oluşturuldu! Ustalara iletildi. 🔔');
        this.render();
      } else {
        showToast(data.error || 'Talep oluşturulamadı.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Talep oluşturulurken bir hata oluştu.', 'error');
    } finally {
      if (btn) btn.disabled = false;
    }
  },

  openBidModal(requestId) {
    this.selectedRequestId = requestId;
    const form = document.getElementById('quote-bid-form');
    if (form) form.reset();
    openModal('quote-bid-modal');
  },

  async submitBid(e) {
    e.preventDefault();
    const btn = document.getElementById('btn-submit-bid');
    if (btn) btn.disabled = true;

    const labor = document.getElementById('bid-labor-input').value.trim();
    const part = document.getElementById('bid-part-input').value.trim();
    const duration = document.getElementById('bid-duration-input').value.trim();
    const warranty = document.getElementById('bid-warranty-input').value.trim();
    const note = document.getElementById('bid-note-input').value.trim();

    const currentMechanicName = Auth.currentUser ? Auth.currentUser.name : 'Çelik Kardeşler VAG Servis';
    const currentShopName = Auth.currentUser && Auth.currentUser.shopName ? Auth.currentUser.shopName : 'Maslak Sanayi';

    try {
      const res = await fetch(`/api/quotes/${this.selectedRequestId}/offer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          laborCost: Number(labor),
          partCost: Number(part),
          totalCost: Number(labor) + Number(part),
          duration,
          warranty,
          note,
          mechanicName: currentMechanicName,
          mechanicShop: currentShopName
        })
      });
      const data = await res.json();
      if (data.success && data.quoteRequest) {
        const idx = this.requests.findIndex(q => q.id === this.selectedRequestId);
        if (idx !== -1) this.requests[idx] = data.quoteRequest;
        closeModal('quote-bid-modal');
        showToast('Teklifiniz araç sahibine başarıyla iletildi! 💼');
        this.render();
      } else {
        showToast(data.error || 'Teklif iletilemedi.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Teklif iletilirken bir hata oluştu.', 'error');
    } finally {
      if (btn) btn.disabled = false;
    }
  }
};
