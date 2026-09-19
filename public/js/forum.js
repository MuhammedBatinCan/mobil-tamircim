// OTO SANAYİ FORUMU - FORUM & KONU & YORUM YÖNETİMİ

const Forum = {
  threads: [],
  comments: [],
  activeFilter: 'all',
  activeBrandFilter: null,
  activeCategory: null,
  activeThreadId: null,
  searchQuery: '',

  init(stateThreads, stateComments) {
    this.threads = stateThreads || [];
    this.comments = stateComments || [];
    this.renderThreadList();
  },

  onSearch(query) {
    this.searchQuery = (query || '').trim().toLowerCase();
    this.renderThreadList();
  },

  setFilter(filter) {
    this.activeFilter = filter;
    this.activeCategory = null;
    this.renderThreadList();
  },

  setCategory(cat) {
    this.activeCategory = cat;
    this.activeFilter = 'category';
    this.renderThreadList();
  },

  setBrandFilter(brand) {
    this.activeBrandFilter = brand;
    this.renderThreadList();
  },

  // Konu Listesini Render Et
  renderThreadList() {
    const container = document.getElementById('threads-feed');
    if (!container) return;

    let filtered = [...this.threads];

    // Live search query filter
    if (this.searchQuery) {
      filtered = filtered.filter(t => 
        (t.title && t.title.toLowerCase().includes(this.searchQuery)) ||
        (t.content && t.content.toLowerCase().includes(this.searchQuery)) ||
        (t.brand && t.brand.toLowerCase().includes(this.searchQuery)) ||
        (t.model && t.model.toLowerCase().includes(this.searchQuery)) ||
        (t.obdCode && t.obdCode.toLowerCase().includes(this.searchQuery)) ||
        (t.authorUsername && t.authorUsername.toLowerCase().includes(this.searchQuery))
      );
    }

    // Category / Filter filter
    if (this.activeFilter === 'ariza-teshis') {
      filtered = filtered.filter(t => t.category === 'ariza-teshis');
    } else if (this.activeFilter === 'solved') {
      filtered = filtered.filter(t => t.isSolved);
    } else if (this.activeFilter === 'unsolved') {
      filtered = filtered.filter(t => !t.isSolved);
    } else if (this.activeFilter === 'mechanics_only') {
      filtered = filtered.filter(t => t.allowCommentsFrom === 'mechanics_only');
    } else if (this.activeFilter === 'category' && this.activeCategory) {
      filtered = filtered.filter(t => t.category === this.activeCategory || (t.title && t.title.toLowerCase().includes(this.activeCategory.toLowerCase())));
    }

    // Brand filter
    if (this.activeBrandFilter) {
      filtered = filtered.filter(t => t.brand && t.brand.toLowerCase() === this.activeBrandFilter.toLowerCase());
    }

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="text-align:center; padding: 48px 20px; color: var(--text-dim); background: var(--bg-card); border-radius: var(--radius-md); border: 1px dashed var(--border-color);">
          <div style="width:40px; height:40px; border-radius:50%; background:rgba(255,255,255,0.04); display:flex; align-items:center; justify-content:center; margin:0 auto 12px auto; color:var(--text-dim);">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
          </div>
          <div style="font-size:1rem; font-weight:700; color:var(--text-main);">Aramanıza Uygun Konu Bulunamadı</div>
          <p style="font-size:0.82rem; margin-top:4px; color:var(--text-muted);">Farklı bir anahtar kelime deneyebilir veya yeni bir konu açabilirsiniz.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(t => {
      const isMechanicsOnly = t.allowCommentsFrom === 'mechanics_only';
      return `
        <article class="thread-row ${t.isSolved ? 'is-solved' : ''}" onclick="Forum.openThread('${t.id}')">
          <div class="thread-reply-col">
            <span class="reply-num">${t.commentsCount || 0}</span>
            <span class="reply-text">yanıt</span>
          </div>

          <div class="thread-body-col">
            <div class="thread-title-line">
              ${t.isSolved ? '<span class="status-pill-solved">Çözüldü</span>' : ''}
              <h3 class="thread-title-heading">${escapeHtml(t.title)}</h3>
            </div>

            <p class="thread-preview-text">${escapeHtml(t.content)}</p>

            <div class="thread-info-bar">
              <span class="thread-author-name">${escapeHtml(t.authorUsername)}</span>
              ${t.brand ? `<span class="thread-vehicle-tag">${escapeHtml(t.brand)} ${escapeHtml(t.model || '')}</span>` : ''}
              ${t.obdCode ? `<span class="thread-obd-tag">${escapeHtml(t.obdCode)}</span>` : ''}
              ${isMechanicsOnly ? `<span class="thread-mech-tag">Usta Yanıtlı</span>` : ''}
              ${t.audioUrl ? `<span class="thread-audio-tag">Ses Kaydı</span>` : ''}
              <span class="thread-time-tag">${formatDate(t.createdAt)}</span>
            </div>
          </div>
        </article>
      `;
    }).join('');
  },

  // Tek Konu Detayını Aç
  openThread(threadId) {
    this.activeThreadId = threadId;
    const thread = this.threads.find(t => t.id === threadId);
    if (!thread) return;

    // Increment views
    thread.views = (thread.views || 0) + 1;

    // Switch view to thread detail
    window.App.switchView('view-thread-detail');
    this.renderThreadDetail(thread);
  },

  renderThreadDetail(thread) {
    const container = document.getElementById('thread-detail-content');
    if (!container) return;

    const threadComments = this.comments.filter(c => c.threadId === thread.id);
    const solvedComment = threadComments.find(c => c.id === thread.solvedCommentId || c.isSolution);
    const isMechanicsOnly = thread.allowCommentsFrom === 'mechanics_only';
    const canCurrentUserComment = !isMechanicsOnly || Auth.isMechanic();
    const isOwner = Auth.currentUser && Auth.currentUser.id === thread.authorId;

    let solvedBoxHtml = '';
    if (solvedComment) {
      solvedBoxHtml = `
        <div class="solved-highlight-box">
          <div class="solved-header">
            <span>Doğrulanmış En İyi Çözüm</span>
            <span style="font-size:0.75rem; color:var(--text-dim); font-weight:normal; margin-left:auto;">Konu Sahibi Tarafından Onaylandı</span>
          </div>
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:10px;">
            <strong>${escapeHtml(solvedComment.authorUsername)}</strong>
            ${Auth.renderPlate(solvedComment.authorPlate, 'sm')}
            ${Auth.renderBadges(solvedComment.authorBadges, solvedComment.authorLevel)}
          </div>
          <p style="color:#F1F5F9; font-size:0.95rem; line-height:1.6;">${escapeHtml(solvedComment.content)}</p>
        </div>
      `;
    }

    let audioBoxHtml = '';
    if (thread.audioUrl) {
      audioBoxHtml = `
        <div class="audio-player-box">
          <button class="audio-play-btn" onclick="Forum.playDemoAudio(this)">▶</button>
          <div style="flex:1;">
            <div style="font-size:0.82rem; font-weight:700; color:#FFF; margin-bottom:4px;">Motor Sesi Kaydı (0:24)</div>
            <div class="audio-wave">
              <span class="wave-bar" style="height:8px;"></span>
              <span class="wave-bar" style="height:16px;"></span>
              <span class="wave-bar" style="height:22px;"></span>
              <span class="wave-bar" style="height:12px;"></span>
              <span class="wave-bar" style="height:18px;"></span>
              <span class="wave-bar" style="height:24px;"></span>
              <span class="wave-bar" style="height:14px;"></span>
              <span class="wave-bar" style="height:20px;"></span>
              <span class="wave-bar" style="height:10px;"></span>
              <span class="wave-bar" style="height:16px;"></span>
            </div>
          </div>
        </div>
      `;
    }

    // Comment box restriction logic
    let commentBoxHtml = '';
    if (canCurrentUserComment) {
      commentBoxHtml = `
        <div style="background:var(--bg-input); border:1px solid var(--border-color); border-radius:var(--radius-md); padding:16px; margin-top:24px;">
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:10px;">
            <span style="font-weight:700; font-size:0.9rem;">Cevabınızı Yazın</span>
            ${isMechanicsOnly ? '<span class="badge badge-mechanic">Usta Yetkisiyle Yazıyorsunuz</span>' : ''}
          </div>
          <textarea id="comment-input" class="form-control" rows="3" placeholder="Arıza tespiti, tecrübenizi veya çözüm önerinizi paylaşın..."></textarea>
          <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:10px;">
            <button class="btn btn-primary" onclick="Forum.submitComment('${thread.id}')">
              <span>Yorumu Paylaş</span>
            </button>
          </div>
        </div>
      `;
    } else {
      commentBoxHtml = `
        <div class="mechanics-only-alert">
          <div>
            <strong>Yorum Kısıtlaması:</strong> Bu konu sahibi yalnızca 
            <strong>Onaylı Tamircilerin ve Ustaların</strong> yorum yapabilmesini talep etmiştir.
          </div>
        </div>
      `;
    }

    // Render list of comments
    let commentsListHtml = threadComments.map(c => {
      const isSol = c.isSolution || c.id === thread.solvedCommentId;
      return `
        <div class="comment-item ${isSol ? 'is-solution' : ''}" id="comment-${c.id}">
          <div class="comment-header">
            <div class="author-meta">
              <strong>${escapeHtml(c.authorUsername)}</strong>
              ${Auth.renderPlate(c.authorPlate, 'sm')}
              ${Auth.renderBadges(c.authorBadges, c.authorLevel)}
            </div>
            <div style="display:flex; align-items:center; gap:8px;">
              <span class="thread-time">${formatDate(c.createdAt)}</span>
              ${isOwner && !isSol ? `
                <button class="btn btn-sm btn-secondary" style="border-color:var(--accent-green); color:var(--accent-green);" onclick="Forum.markSolution('${thread.id}', '${c.id}')">
                  Çözüm Olarak İşaretle
                </button>
              ` : ''}
              ${isSol ? `<span style="color:var(--accent-green); font-weight:700; font-size:0.8rem;">Doğrulanmış Çözüm</span>` : ''}
            </div>
          </div>
          <p style="font-size:0.9rem; line-height:1.5; color:#F1F5F9;">${escapeHtml(c.content)}</p>
        </div>
      `;
    }).join('');

    container.innerHTML = `
      <div style="margin-bottom:14px;">
        <button class="btn btn-secondary btn-sm" onclick="window.App.switchView('view-forum')">
          &larr; Konulara Geri Dön
        </button>
      </div>

      <div class="thread-detail-container">
        <div class="thread-header" style="margin-bottom:14px;">
          <div class="author-meta">
            <span style="font-size:1rem; font-weight:800;">${escapeHtml(thread.authorUsername)}</span>
            ${Auth.renderPlate(thread.authorPlate)}
            ${Auth.renderBadges(thread.authorBadges)}
          </div>
          <span class="thread-time">${formatDate(thread.createdAt)}</span>
        </div>

        <h1 style="font-size:1.4rem; font-weight:800; color:#FFF; margin-bottom:12px;">
          ${thread.isSolved ? '<span style="color:var(--accent-green);">[ÇÖZÜLDÜ]</span> ' : ''}
          ${escapeHtml(thread.title)}
        </h1>

        <div class="thread-tags" style="margin-bottom:16px;">
          ${thread.brand ? `<span class="thread-tag">${escapeHtml(thread.brand)} ${escapeHtml(thread.model || '')}</span>` : ''}
          ${thread.obdCode ? `<span class="thread-tag tag-obd">OBD: ${escapeHtml(thread.obdCode)}</span>` : ''}
          ${isMechanicsOnly ? `<span class="thread-tag tag-mechanic-only">Sadece Usta Yorumu</span>` : ''}
          ${thread.isSolved ? `<span class="thread-tag tag-solved">Sorun Çözüldü</span>` : ''}
        </div>

        ${audioBoxHtml}

        <div style="font-size:1rem; line-height:1.7; color:#E2E8F0; margin:16px 0; white-space:pre-wrap;">${escapeHtml(thread.content)}</div>

        ${solvedBoxHtml}
      </div>

      <div style="margin-top:24px;">
        <h3 style="font-size:1.1rem; font-weight:700; margin-bottom:16px;">
          Yorumlar (${threadComments.length})
        </h3>
        
        <div id="comments-feed">
          ${commentsListHtml || '<p style="color:var(--text-dim);">Henüz yorum yapılmamış. İlk teşhisi siz koyun.</p>'}
        </div>

        ${commentBoxHtml}
      </div>
    `;
  },

  // Yorum Gönderme
  async submitComment(threadId) {
    const input = document.getElementById('comment-input');
    if (!input || !input.value.trim()) {
      showToast('Lütfen bir yorum yazın.');
      return;
    }

    const content = input.value.trim();
    const user = Auth.currentUser;

    try {
      const res = await fetch(`/api/threads/${threadId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authorId: user.id,
          authorUsername: user.name,
          content: content
        })
      });

      const data = await res.json();
      if (data.success) {
        this.comments.push(data.comment);
        // Update thread count in local state
        const thr = this.threads.find(t => t.id === threadId);
        if (thr) thr.commentsCount = (thr.commentsCount || 0) + 1;
        
        // Award local XP
        user.reputationPoints = (user.reputationPoints || 0) + 10;
        Auth.updateUserUI();

        showToast('Yorumunuz paylaşıldı.');
        this.renderThreadDetail(thr);
      } else {
        showToast(data.error || 'Yorum gönderilemedi', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Bağlantı hatası', 'error');
    }
  },

  // Çözüm Olarak İşaretle
  async markSolution(threadId, commentId) {
    try {
      const res = await fetch(`/api/threads/${threadId}/solve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commentId })
      });

      const data = await res.json();
      if (data.success) {
        const thr = this.threads.find(t => t.id === threadId);
        if (thr) {
          thr.isSolved = true;
          thr.solvedCommentId = commentId;
        }
        this.comments.filter(c => c.threadId === threadId).forEach(c => c.isSolution = (c.id === commentId));
        
        showToast('Çözüm onaylandı ve sabitlendi.');
        this.renderThreadDetail(thr);
      } else {
        showToast(data.error || 'İşlem gerçekleştirilemedi', 'error');
      }
    } catch (err) {
      showToast('Sunucu hatası', 'error');
    }
  },

  // Yeni Konu Oluştur
  async createThread(formData) {
    const user = Auth.currentUser;
    try {
      const res = await fetch('/api/threads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          category: formData.category,
          brand: formData.brand,
          model: formData.model,
          obdCode: formData.obdCode,
          allowCommentsFrom: formData.allowCommentsFrom,
          content: formData.content,
          audioUrl: formData.hasAudio ? 'motor_sesi_yuklendi.mp3' : null,
          authorId: user.id,
          authorUsername: user.name,
          authorPlate: user.plate,
          authorCar: user.car,
          authorBadges: user.badges
        })
      });

      const data = await res.json();
      if (data.success) {
        this.threads.unshift(data.thread);
        user.reputationPoints = (user.reputationPoints || 0) + 15;
        Auth.updateUserUI();

        showToast('Konunuz yayınlandı.');
        this.renderThreadList();
        window.App.switchView('view-forum');
      } else {
        showToast(data.error || 'Konu oluşturulamadı', 'error');
      }
    } catch (err) {
      showToast('Sunucu hatası', 'error');
    }
  },

  playDemoAudio(btn) {
    if (btn.textContent === '▶') {
      btn.textContent = '⏸';
      showToast('Motor sesi kaydı oynatılıyor...');
      setTimeout(() => {
        btn.textContent = '▶';
      }, 3000);
    } else {
      btn.textContent = '▶';
    }
  },

  // OBD-II Manuel Kod Yazma & Liste Geçişi
  toggleCustomObd(enable) {
    const selectWrap = document.getElementById('obd-select-wrap');
    const customWrap = document.getElementById('obd-custom-wrap');
    const customInput = document.getElementById('thread-obd-custom-input');
    const toggleBtn = document.getElementById('btn-toggle-custom-obd');
    const selectEl = document.getElementById('thread-obd-select');

    const shouldEnable = (enable !== undefined) ? enable : (customWrap && customWrap.style.display === 'none');

    if (shouldEnable) {
      if (selectWrap) selectWrap.style.display = 'none';
      if (customWrap) customWrap.style.display = 'block';
      if (toggleBtn) {
        toggleBtn.textContent = 'Listeden Seç';
        toggleBtn.style.borderColor = 'var(--accent-blue)';
        toggleBtn.style.color = 'var(--accent-blue)';
      }
      if (selectEl) selectEl.value = 'CUSTOM';
      if (customInput) {
        customInput.focus();
      }
    } else {
      if (selectWrap) selectWrap.style.display = 'block';
      if (customWrap) customWrap.style.display = 'none';
      if (toggleBtn) {
        toggleBtn.textContent = 'Kendim Yazacağım';
        toggleBtn.style.borderColor = 'var(--accent-amber)';
        toggleBtn.style.color = 'var(--accent-amber)';
      }
      if (selectEl && selectEl.value === 'CUSTOM') {
        selectEl.value = '';
      }
    }
  },

  onObdSelectChange(value) {
    if (value === 'CUSTOM') {
      this.toggleCustomObd(true);
    }
  }
};

