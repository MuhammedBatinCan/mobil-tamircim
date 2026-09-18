// OTO SANAYİ FORUMU - FORUM & KONU & YORUM YÖNETİMİ

const Forum = {
  threads: [],
  comments: [],
  activeFilter: 'all',
  activeBrandFilter: null,
  activeThreadId: null,

  init(stateThreads, stateComments) {
    this.threads = stateThreads || [];
    this.comments = stateComments || [];
    this.renderThreadList();
  },

  setFilter(filter) {
    this.activeFilter = filter;
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

    // Category filter
    if (this.activeFilter === 'ariza-teshis') {
      filtered = filtered.filter(t => t.category === 'ariza-teshis');
    } else if (this.activeFilter === 'solved') {
      filtered = filtered.filter(t => t.isSolved);
    } else if (this.activeFilter === 'unsolved') {
      filtered = filtered.filter(t => !t.isSolved);
    } else if (this.activeFilter === 'mechanics_only') {
      filtered = filtered.filter(t => t.allowCommentsFrom === 'mechanics_only');
    }

    // Brand filter
    if (this.activeBrandFilter) {
      filtered = filtered.filter(t => t.brand && t.brand.toLowerCase() === this.activeBrandFilter.toLowerCase());
    }

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="text-align:center; padding: 40px; color: var(--text-dim); background: var(--bg-card); border-radius: var(--radius-md); border: 1px dashed var(--border-color);">
          <div style="font-size:2.5rem; margin-bottom:10px;">🔍</div>
          <div style="font-size:1.1rem; font-weight:700; color:var(--text-main);">Henüz Konu Bulunamadı</div>
          <p style="font-size:0.85rem; margin-top:4px;">Bu kriterlere uygun konu yok. İlk konuyu sen açabilirsin!</p>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(t => {
      const isMechanicsOnly = t.allowCommentsFrom === 'mechanics_only';
      return `
        <div class="thread-card ${t.isSolved ? 'solved-card' : ''}" onclick="Forum.openThread('${t.id}')">
          <div class="thread-header">
            <div class="author-meta">
              <span class="author-name">${t.authorUsername}</span>
              ${Auth.renderPlate(t.authorPlate, 'sm')}
              ${Auth.renderBadges(t.authorBadges)}
            </div>
            <span class="thread-time">${formatDate(t.createdAt)}</span>
          </div>

          <h2 class="thread-title">
            ${t.isSolved ? '<span style="color:var(--accent-green); margin-right:6px;">[ÇÖZÜLDÜ]</span>' : ''}
            ${escapeHtml(t.title)}
          </h2>

          <p class="thread-snippet">${escapeHtml(t.content)}</p>

          <div class="thread-tags">
            ${t.brand ? `<span class="thread-tag">🚗 ${escapeHtml(t.brand)} ${escapeHtml(t.model || '')}</span>` : ''}
            ${t.obdCode ? `<span class="thread-tag tag-obd">⚠️ OBD: ${escapeHtml(t.obdCode)}</span>` : ''}
            ${isMechanicsOnly ? `<span class="thread-tag tag-mechanic-only">🔒 Yalnızca Tamirciler Yorumlayabilir</span>` : ''}
            ${t.audioUrl ? `<span class="thread-tag" style="background:#1E293B;color:#38BDF8;">🔊 Ses Kaydı Var</span>` : ''}
            ${t.isSolved ? `<span class="thread-tag tag-solved">✓ Çözüldü</span>` : ''}
          </div>

          <div class="thread-footer">
            <div class="thread-stats">
              <span>💬 <strong>${t.commentsCount || 0}</strong> Yorum</span>
              <span>👁️ ${t.views || 0} Görüntülenme</span>
              <span>👍 ${t.likes || 0} Beğeni</span>
            </div>
            <span style="color:var(--accent-amber); font-weight:700;">Detayı Gör &rarr;</span>
          </div>
        </div>
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
            <span>✅ DOĞRULANMIŞ EN İYİ ÇÖZÜM</span>
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
            <div style="font-size:0.82rem; font-weight:700; color:#FFF; margin-bottom:4px;">🔊 Kaput Altı Motor Sesi Kaydı (0:24)</div>
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
            <span style="font-weight:700; font-size:0.9rem;">Cevabınızı Yazın (+10 XP)</span>
            ${isMechanicsOnly ? '<span class="badge badge-mechanic">🔧 Usta Yorum Yetkisiyle Yazıyorsunuz</span>' : ''}
          </div>
          <textarea id="comment-input" class="form-control" rows="3" placeholder="Arıza tespiti, tecrübenizi veya çözüm önerinizi paylaşın..."></textarea>
          <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:10px;">
            <button class="btn btn-primary" onclick="Forum.submitComment('${thread.id}')">
              <span>💬 Yorumu Paylaş</span>
            </button>
          </div>
        </div>
      `;
    } else {
      commentBoxHtml = `
        <div class="mechanics-only-alert">
          <div style="font-size:1.4rem;">🔒</div>
          <div>
            <strong>Yorum Yapma Kısıtlaması:</strong> Bu gönderi sahibi, bilgi kirliliğini önlemek amacıyla 
            <strong>yalnızca Onaylı Tamircilerin ve Ustaların</strong> yorum yapabilmesini talep etmiştir.
            <div style="font-size:0.75rem; color:var(--text-muted); margin-top:2px;">
              Sanayi esnafı veya usta iseniz profilinizden <em>Tamirci Doğrulaması</em> talep edebilirsiniz.
            </div>
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
                  ✓ Çözüm Olarak İşaretle (+50 XP)
                </button>
              ` : ''}
              ${isSol ? `<span style="color:var(--accent-green); font-weight:700; font-size:0.8rem;">✓ EN İYİ ÇÖZÜM</span>` : ''}
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
          ${thread.brand ? `<span class="thread-tag">🚗 ${escapeHtml(thread.brand)} ${escapeHtml(thread.model || '')}</span>` : ''}
          ${thread.obdCode ? `<span class="thread-tag tag-obd">⚠️ OBD: ${escapeHtml(thread.obdCode)}</span>` : ''}
          ${isMechanicsOnly ? `<span class="thread-tag tag-mechanic-only">🔒 Yalnızca Tamirciler Yorumlayabilir</span>` : ''}
          ${thread.isSolved ? `<span class="thread-tag tag-solved">✓ Sorun Çözüldü</span>` : ''}
        </div>

        ${audioBoxHtml}

        <div style="font-size:1rem; line-height:1.7; color:#E2E8F0; margin:16px 0; white-space:pre-wrap;">${escapeHtml(thread.content)}</div>

        ${solvedBoxHtml}
      </div>

      <div style="margin-top:24px;">
        <h3 style="font-size:1.1rem; font-weight:700; margin-bottom:16px;">
          💬 Yorumlar (${threadComments.length})
        </h3>
        
        <div id="comments-feed">
          ${commentsListHtml || '<p style="color:var(--text-dim);">Henüz yorum yapılmamış. İlk teşhisi sen koy!</p>'}
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

        showToast('🎉 Yorumunuz paylaşıldı! +10 XP Kazandınız');
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
        
        showToast('✅ En iyi çözüm onaylandı ve sabitlendi!');
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

        showToast('🚀 Konunuz yayınlandı! +15 XP Kazandınız');
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
      showToast('🔊 Motor sesi kaydı oynatılıyor...');
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
        toggleBtn.textContent = '📋 Listeden Seç';
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
        toggleBtn.textContent = '✏️ Kendim Yazacağım';
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

