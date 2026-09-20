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
        (t.engine && t.engine.toLowerCase().includes(this.searchQuery)) ||
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
          <div class="thread-reply-col" onclick="event.stopPropagation(); Forum.openThread('${t.id}')" title="Yorumları ve Detayı Aç">
            <span class="reply-num">${t.commentsCount || 0}</span>
            <span class="reply-text">yanıt</span>
          </div>

          <div class="thread-body-col">
            <div class="thread-title-line">
              ${t.isSolved ? '<span class="status-pill-solved">Çözüldü</span>' : ''}
              <h3 class="thread-title-heading" onclick="event.stopPropagation(); Forum.openThread('${t.id}')">${escapeHtml(t.title)}</h3>
            </div>

            <p class="thread-preview-text">${escapeHtml(t.content)}</p>

            <div class="thread-info-bar">
              <span class="thread-author-name" onclick="event.stopPropagation(); Profile.open('${t.authorId}')" title="Kullanıcı Profilini Aç" style="cursor:pointer;">${escapeHtml(t.authorUsername)}</span>
              ${t.brand ? `<span class="thread-vehicle-tag">${escapeHtml(t.brand)} ${escapeHtml(t.model || '')}${t.engine ? ' • ' + escapeHtml(t.engine) : ''}</span>` : ''}
              ${t.obdCode ? `<span class="thread-obd-tag">${escapeHtml(t.obdCode)}</span>` : ''}
              ${isMechanicsOnly ? `<span class="thread-mech-tag">Usta Yanıtlı</span>` : ''}
              ${t.audioUrl ? `<span class="thread-audio-tag">Ses Kaydı</span>` : ''}
              <span class="thread-time-tag">${formatDate(t.createdAt)}</span>
            </div>

            <div class="thread-action-footer">
              <button class="btn-thread-open" onclick="event.stopPropagation(); Forum.openThread('${t.id}')">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:4px;"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                <span>Yorumları & Detayı Gör (${t.commentsCount || 0})</span>
                <span class="btn-arrow">&rarr;</span>
              </button>
            </div>
          </div>
        </article>
      `;
    }).join('');
  },

  // Tek Konu Detayını Aç
  openThread(threadId) {
    this.activeThreadId = threadId;
    const thread = this.threads.find(t => String(t.id) === String(threadId));
    if (!thread) {
      console.warn('Konu bulunamadı:', threadId);
      return;
    }

    // Increment views
    thread.views = (thread.views || 0) + 1;

    // Switch view to thread detail safely
    if (window.App && typeof window.App.switchView === 'function') {
      window.App.switchView('view-thread-detail');
    } else if (typeof App !== 'undefined' && App.switchView) {
      App.switchView('view-thread-detail');
    } else {
      document.querySelectorAll('.view-section').forEach(el => el.classList.remove('active'));
      const target = document.getElementById('view-thread-detail');
      if (target) target.classList.add('active');
    }

    this.renderThreadDetail(thread);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  goBackToForum() {
    if (window.App && typeof window.App.switchView === 'function') {
      window.App.switchView('view-forum');
    } else if (typeof App !== 'undefined' && App.switchView) {
      App.switchView('view-forum');
    } else {
      document.querySelectorAll('.view-section').forEach(el => el.classList.remove('active'));
      const target = document.getElementById('view-forum');
      if (target) target.classList.add('active');
    }
  },

  renderThreadDetail(thread) {
    const container = document.getElementById('thread-detail-content');
    if (!container || !thread) return;

    const threadComments = (this.comments || []).filter(c => String(c.threadId) === String(thread.id));
    const solvedComment = threadComments.find(c => c.id === thread.solvedCommentId || c.isSolution);
    const isMechanicsOnly = thread.allowCommentsFrom === 'mechanics_only';
    const canCurrentUserComment = !isMechanicsOnly || (typeof Auth !== 'undefined' && Auth.isMechanic());
    const isOwner = typeof Auth !== 'undefined' && Auth.currentUser && Auth.currentUser.id === thread.authorId;

    let solvedBoxHtml = '';
    if (solvedComment) {
      solvedBoxHtml = `
        <div class="solved-highlight-box">
          <div class="solved-header">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
            <span>Doğrulanmış En İyi Çözüm</span>
            <span style="font-size:0.75rem; color:var(--text-dim); font-weight:normal; margin-left:auto;">Konu Sahibi Tarafından Onaylandı</span>
          </div>
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:10px;">
            <div class="comment-author-avatar" style="background:#065F46; color:#6EE7B7; border-color:#059669;">
              ${escapeHtml(solvedComment.authorUsername ? solvedComment.authorUsername.charAt(0).toUpperCase() : 'U')}
            </div>
            <strong>${escapeHtml(solvedComment.authorUsername)}</strong>
            ${typeof Auth !== 'undefined' ? Auth.renderBadges(solvedComment.authorBadges, solvedComment.authorLevel) : ''}
          </div>
          <p style="color:#F1F5F9; font-size:0.95rem; line-height:1.6; margin:0;">${escapeHtml(solvedComment.content)}</p>
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
      const curUser = (typeof Auth !== 'undefined' && Auth.currentUser) ? Auth.currentUser : null;
      commentBoxHtml = `
        <div class="detail-reply-box">
          <div class="reply-box-header">
            <div style="display:flex; align-items:center; gap:8px;">
              <span style="font-weight:700; font-size:0.95rem; color:#FFF;">Cevap / Çözüm Yaz</span>
              ${isMechanicsOnly ? '<span class="badge badge-mechanic">Usta Yetkisiyle Yazıyorsunuz</span>' : ''}
            </div>
            <span style="font-size:0.75rem; color:var(--accent-amber); font-weight:600;">+10 İtibar Puanı</span>
          </div>
          <textarea id="comment-input" class="form-control" rows="3" placeholder="Arıza tespiti, tecrübenizi veya çözüm önerinizi paylaşın..."></textarea>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:12px; flex-wrap:wrap; gap:10px;">
            <span style="font-size:0.76rem; color:var(--text-muted);">
              ${curUser ? `Yanıtlayan: <strong>${escapeHtml(curUser.name)}</strong>` : 'Yorum yazarak konuya katkıda bulunuyorsunuz.'}
            </span>
            <button class="btn btn-primary" id="btn-submit-comment" onclick="Forum.submitComment('${thread.id}')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:6px;"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
              <span>Yorumu Paylaş</span>
            </button>
          </div>
        </div>
      `;
    } else {
      commentBoxHtml = `
        <div class="mechanics-only-alert">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="flex-shrink:0;"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
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
      const initial = (c.authorUsername || 'U').charAt(0).toUpperCase();
      return `
        <div class="comment-item ${isSol ? 'is-solution' : ''}" id="comment-${c.id}">
          <div class="comment-header">
            <div class="author-meta" style="display:flex; align-items:center; gap:8px;">
              <div class="comment-author-avatar">${initial}</div>
              <div>
                <strong style="cursor:pointer;" onclick="Profile.open('${c.authorId}')" title="Kullanıcı Profilini Aç">${escapeHtml(c.authorUsername)}</strong>
                ${typeof Auth !== 'undefined' ? Auth.renderBadges(c.authorBadges, c.authorLevel) : ''}
              </div>
            </div>
            <div style="display:flex; align-items:center; gap:8px;">
              <span class="thread-time">${formatDate(c.createdAt)}</span>
              ${isOwner && !isSol ? `
                <button class="btn btn-sm btn-secondary" style="border-color:var(--accent-green); color:var(--accent-green);" onclick="Forum.markSolution('${thread.id}', '${c.id}')">
                  ✓ Çözüm Olarak İşaretle
                </button>
              ` : ''}
              ${isSol ? `<span style="color:var(--accent-green); font-weight:700; font-size:0.8rem; display:flex; align-items:center; gap:4px;">✓ Doğrulanmış Çözüm</span>` : ''}
            </div>
          </div>
          <p style="font-size:0.92rem; line-height:1.6; color:#F1F5F9; margin-top:8px; white-space:pre-wrap;">${escapeHtml(c.content)}</p>
        </div>
      `;
    }).join('');

    const emptyCommentsHtml = `
      <div class="empty-comments-box">
        <div class="empty-comments-icon">💭</div>
        <div style="font-weight:700; color:#FFF; font-size:1rem; margin-bottom:4px;">Henüz Yorum Yapılmamış</div>
        <div style="font-size:0.85rem; color:var(--text-muted); margin-bottom:6px;">Bu arıza veya durum hakkında ilk tespiti siz koyun, deneyiminizi paylaşarak puan kazanın.</div>
      </div>
    `;

    const authorInitial = (thread.authorUsername || 'U').charAt(0).toUpperCase();

    container.innerHTML = `
      <div class="thread-detail-nav">
        <button class="btn btn-secondary btn-sm" onclick="Forum.goBackToForum()">
          &larr; Konulara Geri Dön
        </button>
        <span class="thread-detail-cat-pill">${thread.category === 'ariza-teshis' ? 'Arıza & Teşhis' : (thread.category || 'Genel Forum')}</span>
      </div>

      <div class="thread-detail-container">
        <div class="thread-header" style="margin-bottom:14px;">
          <div class="detail-author-box">
            <div class="author-avatar-badge" onclick="Profile.open('${thread.authorId}')" style="cursor:pointer;" title="Profilini Aç">
              ${authorInitial}
            </div>
            <div>
              <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
                <span style="font-size:1.05rem; font-weight:800; color:#FFF; cursor:pointer;" onclick="Profile.open('${thread.authorId}')" title="Kullanıcı Profilini Aç">${escapeHtml(thread.authorUsername)}</span>
                ${typeof Auth !== 'undefined' ? Auth.renderBadges(thread.authorBadges) : ''}
              </div>
              <div style="font-size:0.75rem; color:var(--text-dim); margin-top:2px;">
                <span>${formatDate(thread.createdAt)}</span>
                <span> • 👁️ ${thread.views || 1} görüntülenme</span>
              </div>
            </div>
          </div>
        </div>

        <h1 style="font-size:1.4rem; font-weight:800; color:#FFF; margin-bottom:12px; line-height:1.35;">
          ${thread.isSolved ? '<span style="color:var(--accent-green); font-size:1.1rem;">[ÇÖZÜLDÜ]</span> ' : ''}
          ${escapeHtml(thread.title)}
        </h1>

        <div class="thread-tags" style="margin-bottom:16px;">
          ${thread.brand ? `<span class="thread-tag">${escapeHtml(thread.brand)} ${escapeHtml(thread.model || '')}${thread.engine ? ' • ' + escapeHtml(thread.engine) : ''}</span>` : ''}
          ${thread.obdCode ? `<span class="thread-tag tag-obd">OBD: ${escapeHtml(thread.obdCode)}</span>` : ''}
          ${isMechanicsOnly ? `<span class="thread-tag tag-mechanic-only">Sadece Usta Yorumu</span>` : ''}
          ${thread.isSolved ? `<span class="thread-tag tag-solved">Sorun Çözüldü</span>` : ''}
        </div>

        ${audioBoxHtml}

        <div style="font-size:0.98rem; line-height:1.75; color:#E2E8F0; margin:16px 0; white-space:pre-wrap; background:rgba(255,255,255,0.02); padding:14px; border-radius:var(--radius-sm); border:1px solid rgba(255,255,255,0.04);">${escapeHtml(thread.content)}</div>

        ${solvedBoxHtml}
      </div>

      <div style="margin-top:24px;">
        <div class="thread-comments-heading-wrap">
          <div style="display:flex; align-items:center; gap:8px;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--accent-amber);"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            <h3 style="font-size:1.15rem; font-weight:800; color:#FFF; margin:0;">
              Gelen Yanıtlar ve Çözüm Önerileri (${threadComments.length})
            </h3>
          </div>
          <span style="font-size:0.8rem; color:var(--text-dim);">${threadComments.length} yanıt</span>
        </div>
        
        <div id="comments-feed">
          ${commentsListHtml || emptyCommentsHtml}
        </div>

        ${commentBoxHtml}

        <div class="detail-bottom-nav">
          <button class="btn btn-secondary btn-sm" onclick="Forum.goBackToForum()">
            &larr; Konulara Geri Dön
          </button>
          <button class="btn btn-secondary btn-sm" onclick="window.scrollTo({top:0, behavior:'smooth'})">
            &uarr; Sayfa Başına Dön
          </button>
        </div>
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
    const user = (typeof Auth !== 'undefined' && Auth.currentUser) ? Auth.currentUser : null;
    if (!user) {
      showToast('Yorum yapabilmek için lütfen giriş yapınız.', 'error');
      if (typeof openModal === 'function') openModal('auth-modal');
      return;
    }

    const submitBtn = document.getElementById('btn-submit-comment');
    if (submitBtn) submitBtn.disabled = true;

    try {
      const res = await fetch(`/api/threads/${threadId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authorId: user.id,
          authorUsername: user.name || user.username,
          content: content
        })
      });

      const data = await res.json();
      if (data.success) {
        this.comments.push(data.comment);
        // Update thread count in local state
        const thr = this.threads.find(t => String(t.id) === String(threadId));
        if (thr) thr.commentsCount = (thr.commentsCount || 0) + 1;
        
        // Award local XP
        user.reputationPoints = (user.reputationPoints || 0) + 10;
        if (typeof Auth !== 'undefined' && Auth.updateUserUI) Auth.updateUserUI();

        showToast('Yorumunuz başarıyla paylaşıldı (+10 XP).');
        if (thr) this.renderThreadDetail(thr);
      } else {
        showToast(data.error || 'Yorum gönderilemedi', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Bağlantı hatası', 'error');
    } finally {
      if (submitBtn) submitBtn.disabled = false;
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
          engine: formData.engine || '',
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
        if (window.App && window.App.switchView) window.App.switchView('view-forum');
        else if (typeof App !== 'undefined' && App.switchView) App.switchView('view-forum');
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

// Global Export
window.Forum = Forum;

