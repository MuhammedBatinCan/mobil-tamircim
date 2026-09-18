// OTO SANAYİ FORUMU - SANAYİ & USTA REHBERİ

const Directory = {
  items: [],
  selectedCity: 'all',
  selectedCategory: 'all',

  init(stateDirectory) {
    this.items = stateDirectory || [];
    this.renderDirectory();
    this.populateCityDropdown();
  },

  populateCityDropdown() {
    const select = document.getElementById('dir-city-select');
    if (!select) return;

    const cities = ['Tüm Şehirler', 'İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya'];
    select.innerHTML = cities.map(c => `
      <option value="${c === 'Tüm Şehirler' ? 'all' : c}">${c}</option>
    `).join('');
  },

  filterByCity(city) {
    this.selectedCity = city;
    this.renderDirectory();
  },

  filterByCategory(cat) {
    this.selectedCategory = cat;
    this.renderDirectory();
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
        <div style="text-align:center; padding: 40px; color: var(--text-dim); background: var(--bg-card); border-radius: var(--radius-md);">
          <div style="font-size:2.5rem; margin-bottom:8px;">📍</div>
          <div style="font-weight:700; color:#FFF;">Bu Kriterlerde Kayıtlı Usta Bulunamadı</div>
          <p style="font-size:0.85rem; margin-top:4px;">Farklı bir şehir veya uzmanlık dalı seçebilirsiniz.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = list.map(item => `
      <div class="sidebar-card" style="margin-bottom:16px;">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
          <div>
            <h3 style="font-size:1.15rem; font-weight:800; color:#FFF; margin-bottom:4px;">
              ${escapeHtml(item.shopName)}
            </h3>
            <div style="font-size:0.88rem; color:var(--text-muted); display:flex; align-items:center; gap:8px;">
              <span>👨‍🔧 ${escapeHtml(item.ownerName)}</span>
              ${item.verified ? '<span class="badge badge-mechanic">🔧 Onaylı Usta</span>' : ''}
              ${item.isOpenWeekend ? '<span class="badge" style="background:#166534; color:#86EFAC;">Pazar Açık</span>' : ''}
            </div>
          </div>
          <div style="background:#1E293B; border:1px solid #334155; padding:4px 10px; border-radius:var(--radius-sm); text-align:right;">
            <div style="color:var(--accent-amber); font-weight:800; font-size:1.05rem;">★ ${item.rating}</div>
            <div style="font-size:0.7rem; color:var(--text-dim);">${item.reviewCount} Değerlendirme</div>
          </div>
        </div>

        <div style="font-size:0.85rem; color:var(--text-dim); margin-bottom:12px;">
          📍 <strong>${escapeHtml(item.city)} / ${escapeHtml(item.district)}</strong> — ${escapeHtml(item.sanayiSite)}
          <br/>
          <span style="color:var(--text-muted); font-size:0.8rem;">${escapeHtml(item.address)}</span>
        </div>

        <div style="display:flex; flex-wrap:wrap; gap:6px; margin-bottom:14px;">
          ${item.categories.map(c => `
            <span class="thread-tag" style="background:#1E293B; border-color:#334155; color:#94A3B8;">${c}</span>
          `).join('')}
        </div>

        <div style="display:flex; gap:10px; flex-wrap:wrap;">
          <a href="tel:${item.phone}" class="btn btn-secondary btn-sm" style="flex:1;">
            📞 Ara: ${item.phone}
          </a>
          <a href="https://wa.me/${item.whatsapp}?text=Mobil%20Tamircimden%20ulaşıyorum" target="_blank" class="btn btn-primary btn-sm" style="background:#22C55E; color:#000; border:none; flex:1;">
            💬 WhatsApp ile Yaz
          </a>
        </div>
      </div>
    `).join('');
  }
};
