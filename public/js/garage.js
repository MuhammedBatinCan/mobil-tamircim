// MOBİL TAMİRCİM - DİJİTAL ARAÇ CÜZDANI & GARAJ MASRAF TAKİPÇİSİ

const Garage = {
  vehicles: [],
  records: [],
  activeVehicleId: null,

  init(initialVehicles, initialRecords) {
    this.vehicles = Array.isArray(initialVehicles) ? initialVehicles : [];
    this.records = Array.isArray(initialRecords) ? initialRecords : [];
    if (this.vehicles.length > 0 && !this.activeVehicleId) {
      this.activeVehicleId = this.vehicles[0].id;
    }
    this.render();
  },

  getActiveVehicle() {
    return this.vehicles.find(v => v.id === this.activeVehicleId) || this.vehicles[0] || null;
  },

  selectVehicle(vehId) {
    this.activeVehicleId = vehId;
    this.render();
  },

  getVehicleRecords(vehId) {
    return this.records.filter(r => r.vehicleId === vehId);
  },

  getDaysUntil(dateStr) {
    if (!dateStr) return null;
    const target = new Date(dateStr);
    const today = new Date();
    today.setHours(0,0,0,0);
    const diffTime = target - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  },

  render() {
    const container = document.getElementById('garage-content');
    if (!container) return;

    if (this.vehicles.length === 0) {
      container.innerHTML = `
        <div class="empty-state" style="padding:50px 20px; text-align:center;">
          <div style="font-size:3rem; margin-bottom:12px;">🚗</div>
          <h3 style="color:#FFF; font-size:1.2rem; margin-bottom:8px;">Garajınızda Henüz Kayıtlı Bir Araç Yok</h3>
          <p style="color:var(--text-muted); font-size:0.88rem; max-width:460px; margin:0 auto 20px;">
            Aracınızı dijital garaja ekleyerek TÜVTÜRK muayene hatırlatıcısı alabilir, servis bakım geçmişinizi ve sanayi masraflarınızı kuruşu kuruşuna takip edebilirsiniz.
          </p>
          <button class="btn btn-primary" onclick="Garage.openAddVehicleModal()">+ Garajıma İlk Aracımı Ekle</button>
        </div>
      `;
      return;
    }

    const currentVeh = this.getActiveVehicle();
    const vehRecords = currentVeh ? this.getVehicleRecords(currentVeh.id) : [];

    // Toplam masraf hesabı
    const totalCost = vehRecords.reduce((sum, r) => sum + (Number(r.cost) || 0), 0);
    const totalCostFormatted = new Intl.NumberFormat('tr-TR').format(totalCost);

    // Muayene & Sigorta kalan günler
    const inspDays = currentVeh ? this.getDaysUntil(currentVeh.inspectionDate) : null;
    const insDays = currentVeh ? this.getDaysUntil(currentVeh.insuranceDate) : null;

    container.innerHTML = `
      <!-- Üst Araç Seçim / Sekme Barı -->
      <div class="garage-vehicle-tabs">
        <div class="garage-tabs-list">
          ${this.vehicles.map(v => `
            <button class="garage-tab-btn ${v.id === currentVeh.id ? 'active' : ''}" onclick="Garage.selectVehicle('${v.id}')">
              <span class="plate-mini">${escapeHtml(v.plate)}</span>
              <span class="veh-tab-name">${escapeHtml(v.brand)} ${escapeHtml(v.model)}</span>
            </button>
          `).join('')}
        </div>
        <button class="btn btn-secondary btn-sm" onclick="Garage.openAddVehicleModal()" style="flex-shrink:0;">
          + Yeni Araç Ekle
        </button>
      </div>

      <!-- Aktif Araç Vitrin Kartı -->
      <div class="garage-hero-card sidebar-card" style="margin-top:16px; position:relative; overflow:hidden;">
        <div class="garage-hero-bg" style="background-image: linear-gradient(to right, rgba(15,23,42,0.95) 40%, rgba(15,23,42,0.6)), url('${currentVeh.image || 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800'}');"></div>
        <div class="garage-hero-content">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:12px;">
            <div>
              <div style="display:flex; align-items:center; gap:10px; margin-bottom:8px;">
                <span class="garage-plate-badge">${escapeHtml(currentVeh.plate)}</span>
                <span class="badge badge-primary">${escapeHtml(currentVeh.fuelType)}</span>
                <span style="font-size:0.8rem; color:var(--text-muted);">${currentVeh.year} Model</span>
              </div>
              <h2 style="color:#FFF; font-size:1.4rem; font-weight:800; margin:0 0 4px 0;">${escapeHtml(currentVeh.brand)} ${escapeHtml(currentVeh.model)}</h2>
              <span style="font-size:0.85rem; color:var(--text-secondary);">${escapeHtml(currentVeh.engine || 'Standart Motor')}</span>
            </div>
            
            <div style="text-align:right;">
              <span style="font-size:0.75rem; color:var(--text-muted); display:block;">Güncel Kilometre</span>
              <span style="font-size:1.6rem; font-weight:900; color:var(--accent-amber); font-family:monospace; letter-spacing:1px;">
                ${new Intl.NumberFormat('tr-TR').format(currentVeh.currentKm)} <small style="font-size:0.9rem; color:#FFF;">KM</small>
              </span>
            </div>
          </div>

          <!-- Kritik Tarih ve Hatırlatıcı Kartları -->
          <div class="garage-reminders-grid" style="margin-top:20px;">
            <!-- Muayene -->
            <div class="reminder-card ${inspDays !== null && inspDays <= 30 ? 'reminder-urgent' : ''}">
              <div class="reminder-icon">🛡️</div>
              <div>
                <span class="reminder-label">TÜVTÜRK Muayenesi</span>
                <strong class="reminder-value">${currentVeh.inspectionDate ? new Date(currentVeh.inspectionDate).toLocaleDateString('tr-TR') : 'Belirtilmedi'}</strong>
                ${inspDays !== null ? `
                  <span class="reminder-status ${inspDays <= 30 ? 'status-urgent' : 'status-ok'}">
                    ${inspDays < 0 ? `${Math.abs(inspDays)} gün geçti!` : `${inspDays} gün kaldı`}
                  </span>
                ` : ''}
              </div>
            </div>

            <!-- Sigorta -->
            <div class="reminder-card">
              <div class="reminder-icon">📑</div>
              <div>
                <span class="reminder-label">Trafik Sigortası</span>
                <strong class="reminder-value">${currentVeh.insuranceDate ? new Date(currentVeh.insuranceDate).toLocaleDateString('tr-TR') : 'Belirtilmedi'}</strong>
                ${insDays !== null ? `
                  <span class="reminder-status ${insDays <= 30 ? 'status-urgent' : 'status-ok'}">
                    ${insDays < 0 ? `${Math.abs(insDays)} gün geçti!` : `${insDays} gün kaldı`}
                  </span>
                ` : ''}
              </div>
            </div>

            <!-- Sonraki Yağ Bakımı -->
            <div class="reminder-card">
              <div class="reminder-icon">🛢️</div>
              <div>
                <span class="reminder-label">Sonraki Yağ / Filtre</span>
                <strong class="reminder-value">${currentVeh.nextOilKm ? new Intl.NumberFormat('tr-TR').format(currentVeh.nextOilKm) + ' KM' : 'Belirtilmedi'}</strong>
                ${currentVeh.nextOilKm ? `
                  <span class="reminder-status ${currentVeh.nextOilKm - currentVeh.currentKm <= 2000 ? 'status-urgent' : 'status-ok'}">
                    ${currentVeh.nextOilKm - currentVeh.currentKm > 0 ? `${new Intl.NumberFormat('tr-TR').format(currentVeh.nextOilKm - currentVeh.currentKm)} km kaldı` : 'Bakım zamanı geldi!'}
                  </span>
                ` : ''}
              </div>
            </div>

            <!-- Toplam Harcama -->
            <div class="reminder-card" style="border-color:rgba(245,158,11,0.3); background:rgba(245,158,11,0.06);">
              <div class="reminder-icon">💰</div>
              <div>
                <span class="reminder-label">Kayıtlı Masraf Toplamı</span>
                <strong class="reminder-value" style="color:var(--accent-amber);">${totalCostFormatted} TL</strong>
                <span class="reminder-status status-ok">${vehRecords.length} Servis İşlemi</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bakım & Masraf Zaman Çizelgesi (Timeline) -->
      <div class="garage-records-section" style="margin-top:24px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
          <div>
            <h3 style="color:#FFF; font-size:1.1rem; font-weight:800; margin:0 0 4px 0;">Servis & Bakım Defteri</h3>
            <span style="font-size:0.8rem; color:var(--text-muted);">Yapılan periyodik bakımlar, değişen parçalar ve usta masrafları</span>
          </div>
          <button class="btn btn-primary btn-sm" onclick="Garage.openAddRecordModal('${currentVeh.id}')">
            + Bakım / Masraf Ekle
          </button>
        </div>

        ${vehRecords.length === 0 ? `
          <div class="sidebar-card" style="padding:30px; text-align:center;">
            <p style="color:var(--text-muted); font-size:0.85rem; margin:0 0 12px 0;">Bu araç için henüz servis veya masraf kaydı girilmedi.</p>
            <button class="btn btn-secondary btn-sm" onclick="Garage.openAddRecordModal('${currentVeh.id}')">+ İlk Kaydı Oluştur</button>
          </div>
        ` : `
          <div class="garage-timeline">
            ${vehRecords.map(rec => {
              const recCostFormatted = new Intl.NumberFormat('tr-TR').format(rec.cost);
              return `
                <div class="timeline-item">
                  <div class="timeline-dot"></div>
                  <div class="timeline-content sidebar-card">
                    <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:8px;">
                      <div>
                        <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px;">
                          <span class="badge badge-secondary" style="font-size:0.7rem;">${escapeHtml(rec.category)}</span>
                          <span style="font-size:0.8rem; font-weight:700; color:var(--accent-amber); font-family:monospace;">${new Intl.NumberFormat('tr-TR').format(rec.km)} KM</span>
                          <span style="font-size:0.75rem; color:var(--text-muted);">• ${new Date(rec.date).toLocaleDateString('tr-TR')}</span>
                        </div>
                        <h4 style="color:#FFF; font-size:0.95rem; font-weight:700; margin:0 0 4px 0;">${escapeHtml(rec.title)}</h4>
                        <span style="font-size:0.8rem; color:var(--text-secondary); display:block;">📍 ${escapeHtml(rec.serviceShop || 'Özel Servis')}</span>
                      </div>
                      <div style="text-align:right;">
                        <span style="font-size:1.1rem; font-weight:800; color:#FFF;">${recCostFormatted} <small style="font-size:0.75rem; color:var(--accent-amber);">TL</small></span>
                      </div>
                    </div>
                    ${rec.notes ? `
                      <p style="font-size:0.82rem; color:var(--text-muted); line-height:1.5; margin:8px 0 0 0; border-top:1px solid rgba(255,255,255,0.06); padding-top:8px;">
                        ${escapeHtml(rec.notes)}
                      </p>
                    ` : ''}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        `}
      </div>
    `;
  },

  openAddVehicleModal() {
    if (!Auth.currentUser) {
      showToast('Garajınıza araç eklemek için lütfen giriş yapın.', 'error');
      openModal('auth-modal');
      return;
    }
    const form = document.getElementById('new-vehicle-form');
    if (form) form.reset();
    openModal('new-vehicle-modal');
  },

  async saveVehicle(e) {
    e.preventDefault();
    const btn = document.getElementById('btn-save-vehicle');
    if (btn) btn.disabled = true;

    const plate = document.getElementById('veh-plate-input').value.trim();
    const brand = document.getElementById('veh-brand-input').value.trim();
    const model = document.getElementById('veh-model-input').value.trim();
    const year = document.getElementById('veh-year-input').value.trim();
    const engine = document.getElementById('veh-engine-input').value.trim();
    const km = document.getElementById('veh-km-input').value.trim();
    const fuel = document.getElementById('veh-fuel-select').value;
    const inspection = document.getElementById('veh-inspection-input').value;
    const insurance = document.getElementById('veh-insurance-input').value;
    const nextOilKm = document.getElementById('veh-oil-input').value.trim();

    try {
      const res = await fetch('/api/garage/vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: Auth.currentUser ? Auth.currentUser.id : 'usr_dev_1',
          plate,
          brand,
          model,
          year: Number(year),
          engine,
          currentKm: Number(km),
          fuelType: fuel,
          inspectionDate: inspection,
          insuranceDate: insurance,
          nextOilKm: nextOilKm ? Number(nextOilKm) : null,
          image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=600'
        })
      });
      const data = await res.json();
      if (data.success && data.vehicle) {
        this.vehicles.unshift(data.vehicle);
        this.activeVehicleId = data.vehicle.id;
        closeModal('new-vehicle-modal');
        showToast(`${data.vehicle.brand} ${data.vehicle.model} garajınıza eklendi! 🚗`);
        this.render();
      } else {
        showToast(data.error || 'Araç kaydedilemedi.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Araç kaydedilirken bir hata oluştu.', 'error');
    } finally {
      if (btn) btn.disabled = false;
    }
  },

  openAddRecordModal(vehicleId) {
    this.activeVehicleId = vehicleId || this.activeVehicleId;
    const form = document.getElementById('new-maintenance-form');
    if (form) form.reset();
    openModal('new-maintenance-modal');
  },

  async saveRecord(e) {
    e.preventDefault();
    const btn = document.getElementById('btn-save-record');
    if (btn) btn.disabled = true;

    const title = document.getElementById('rec-title-input').value.trim();
    const km = document.getElementById('rec-km-input').value.trim();
    const cost = document.getElementById('rec-cost-input').value.trim();
    const date = document.getElementById('rec-date-input').value;
    const category = document.getElementById('rec-category-select').value;
    const shop = document.getElementById('rec-shop-input').value.trim();
    const notes = document.getElementById('rec-notes-input').value.trim();

    try {
      const res = await fetch('/api/garage/records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehicleId: this.activeVehicleId,
          userId: Auth.currentUser ? Auth.currentUser.id : 'usr_dev_1',
          title,
          km: Number(km),
          cost: Number(cost),
          date,
          category,
          serviceShop: shop,
          notes
        })
      });
      const data = await res.json();
      if (data.success && data.record) {
        this.records.unshift(data.record);
        const veh = this.getActiveVehicle();
        if (veh && Number(km) > veh.currentKm) veh.currentKm = Number(km);
        closeModal('new-maintenance-modal');
        showToast('Bakım ve masraf kaydı eklendi! 📝');
        this.render();
      } else {
        showToast(data.error || 'Kayıt eklenemedi.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Kayıt eklenirken bir hata oluştu.', 'error');
    } finally {
      if (btn) btn.disabled = false;
    }
  }
};
