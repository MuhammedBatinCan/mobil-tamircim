// MOBİL TAMİRCİM - SANAYİ & OTOMOTİV BLOG / REHBERLER MODÜLÜ

const Blog = {
  posts: [],
  activeCategory: 'all',
  activePost: null,

  init(initialPosts) {
    this.posts = Array.isArray(initialPosts) ? initialPosts : [];
    this.render();
  },

  setCategory(category, btn) {
    this.activeCategory = category;
    if (btn) {
      document.querySelectorAll('#blog-category-filters .filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    }
    this.render();
  },

  getFilteredPosts() {
    if (this.activeCategory === 'all') return this.posts;
    return this.posts.filter(p => p.category === this.activeCategory);
  },

  render() {
    const container = document.getElementById('blog-feed');
    if (!container) return;

    const list = this.getFilteredPosts();
    if (list.length === 0) {
      container.innerHTML = `
        <div class="empty-state" style="padding:40px; text-align:center;">
          <p style="color:var(--text-muted);">Bu kategoride henüz yazı bulunmuyor.</p>
        </div>
      `;
      return;
    }

    // İlk makaleyi manşet (featured), kalanları ızgara (grid) olarak göster
    const featured = list[0];
    const rest = list.slice(1);

    container.innerHTML = `
      <!-- Öne Çıkan Manşet Makale (Hero Card) -->
      ${featured ? `
        <div class="blog-hero-card sidebar-card" onclick="Blog.openPost('${featured.slug}')">
          <div class="blog-hero-img-wrap">
            <img class="blog-hero-img" src="${featured.coverImage || 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=1000'}" alt="${escapeHtml(featured.title)}">
            <span class="blog-category-badge">${escapeHtml(featured.category)}</span>
          </div>
          <div class="blog-hero-body">
            <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px; font-size:0.75rem; color:var(--text-muted);">
              <span>⏱️ ${escapeHtml(featured.readTime || '5 dk okuma')}</span>
              <span>•</span>
              <span>👀 ${new Intl.NumberFormat('tr-TR').format(featured.views || 0)} Okunma</span>
              <span>•</span>
              <span>❤️ ${featured.likes || 0} Beğeni</span>
            </div>
            <h2 class="blog-hero-title">${escapeHtml(featured.title)}</h2>
            <p class="blog-hero-excerpt">${escapeHtml(featured.excerpt || '')}</p>
            <div class="blog-author-row">
              <img src="${featured.authorAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'}" class="blog-author-img" alt="Yazar">
              <div>
                <span class="blog-author-name">${escapeHtml(featured.author || 'Mobil Tamircim')}</span>
                <span class="blog-date">${featured.createdAt}</span>
              </div>
            </div>
          </div>
        </div>
      ` : ''}

      <!-- Diğer Makaleler Izgarası (Grid) -->
      <div class="blog-grid" style="margin-top:20px;">
        ${rest.map(post => `
          <div class="blog-card sidebar-card" onclick="Blog.openPost('${post.slug}')">
            <div class="blog-card-img-wrap">
              <img class="blog-card-img" src="${post.coverImage || 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=600'}" alt="${escapeHtml(post.title)}" loading="lazy">
              <span class="blog-category-badge">${escapeHtml(post.category)}</span>
            </div>
            <div class="blog-card-body">
              <div style="display:flex; align-items:center; gap:6px; margin-bottom:6px; font-size:0.72rem; color:var(--text-muted);">
                <span>⏱️ ${escapeHtml(post.readTime || '4 dk')}</span>
                <span>•</span>
                <span>👀 ${new Intl.NumberFormat('tr-TR').format(post.views || 0)}</span>
                <span>•</span>
                <span>❤️ ${post.likes || 0}</span>
              </div>
              <h4 class="blog-card-title">${escapeHtml(post.title)}</h4>
              <p class="blog-card-excerpt">${escapeHtml(post.excerpt || '')}</p>
              <div class="blog-author-row" style="margin-top:auto;">
                <img src="${post.authorAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80'}" class="blog-author-img-sm" alt="Yazar">
                <div>
                  <span class="blog-author-name" style="font-size:0.75rem;">${escapeHtml(post.author || 'Mobil Tamircim')}</span>
                  <span class="blog-date" style="font-size:0.7rem;">${post.createdAt}</span>
                </div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  },

  async openPost(slug) {
    let post = this.posts.find(p => p.slug === slug || p.id === slug);
    if (!post) return;

    this.activePost = post;
    const container = document.getElementById('blog-detail-content');
    if (!container) return;

    // Fetch full post details from server (for fresh views, likes, and comments)
    try {
      const res = await fetch(`/api/blog/${slug}`);
      const data = await res.json();
      if (data.success && data.post) {
        Object.assign(post, data.post);
        this.activePost = post;
      }
    } catch (e) {
      post.views = (post.views || 0) + 1;
    }

    const currentUser = (typeof App !== 'undefined' && App.currentUser) || null;
    const isLiked = currentUser && Array.isArray(post.likedBy) && post.likedBy.includes(currentUser.id);

    container.innerHTML = `
      <div class="blog-detail-nav">
        <button class="btn btn-secondary btn-sm" onclick="App.switchView('view-blog')">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-2px; margin-right:4px;"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          Rehberlere Dön
        </button>
        <span class="badge badge-primary">${escapeHtml(post.category)}</span>
      </div>

      <article class="blog-article sidebar-card" style="padding:28px 24px; margin-top:14px;">
        <h1 class="blog-article-title">${escapeHtml(post.title)}</h1>
        
        <div class="blog-article-meta">
          <div style="display:flex; align-items:center; gap:10px;">
            <img src="${post.authorAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'}" style="width:42px; height:42px; border-radius:50%; object-fit:cover; border:2px solid var(--accent-amber);" alt="Yazar">
            <div>
              <strong style="color:#FFF; font-size:0.88rem; display:block;">${escapeHtml(post.author)}</strong>
              <span style="font-size:0.75rem; color:var(--text-muted);">${post.createdAt} • ${escapeHtml(post.readTime)}</span>
            </div>
          </div>

          <div style="display:flex; align-items:center; gap:10px;">
            <button id="blog-like-btn" class="btn btn-secondary btn-sm ${isLiked ? 'liked' : ''}" onclick="Blog.likeCurrentPost('${post.id}')" style="display:flex; align-items:center; gap:6px; ${isLiked ? 'color:#EF4444; border-color:rgba(239,68,68,0.4); background:rgba(239,68,68,0.12);' : ''}">
              <span>❤️</span> <span id="blog-like-count">${post.likes || 0}</span>
            </button>
            <button class="btn btn-secondary btn-sm" onclick="navigator.clipboard.writeText(window.location.href); showToast('Bağlantı kopyalandı! 📋');" title="Paylaş">
              🔗 Paylaş
            </button>
          </div>
        </div>

        <div class="blog-article-cover-wrap">
          <img class="blog-article-cover" src="${post.coverImage || 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=1200'}" alt="${escapeHtml(post.title)}">
        </div>

        <div class="blog-article-body">
          ${post.content || `<p>${escapeHtml(post.excerpt)}</p>`}
        </div>

        <!-- Etiketler -->
        ${(post.tags && post.tags.length > 0) ? `
          <div class="blog-tags-row" style="margin-top:24px; padding-top:16px; border-top:1px solid rgba(255,255,255,0.08); display:flex; flex-wrap:wrap; gap:6px;">
            ${post.tags.map(t => `<span class="badge badge-secondary" style="font-size:0.75rem;">#${escapeHtml(t)}</span>`).join('')}
          </div>
        ` : ''}

        <!-- Alt Forum Tartışması Kutusu -->
        <div class="blog-forum-cta" style="margin-top:28px; background:linear-gradient(135deg, rgba(245,158,11,0.1), rgba(15,23,42,0.8)); border:1px solid rgba(245,158,11,0.3); border-radius:12px; padding:18px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
          <div>
            <h4 style="color:#FFF; font-size:1rem; margin:0 0 4px 0;">Bu Konuda Yaşadığınız Bir Arıza mı Var?</h4>
            <p style="color:var(--text-secondary); font-size:0.82rem; margin:0;">
              Mobil Tamircim forumunda diğer araç sahipleri ve ustalara ücretsiz danışabilirsiniz.
            </p>
          </div>
          <button class="btn btn-primary btn-sm" onclick="App.switchView('view-forum')">
            Forumda Tartış & Konu Aç
          </button>
        </div>

        <!-- ========================================== -->
        <!-- BLOG YORUMLARI & GÖRÜŞLER BÖLÜMÜ -->
        <!-- ========================================== -->
        <section class="blog-comments-wrap" style="margin-top:32px; padding-top:24px; border-top:1px solid rgba(255,255,255,0.08);">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:18px;">
            <h3 style="font-size:1.15rem; font-weight:800; color:#FFF; margin:0; display:flex; align-items:center; gap:8px;">
              💬 Okuyucu & Usta Yorumları
              <span id="blog-comments-counter" class="badge badge-primary" style="font-size:0.75rem;">${(post.comments || []).length}</span>
            </h3>
            <span style="font-size:0.75rem; color:var(--text-muted);">Deneyimlerinizi veya sorularınızı paylaşın</span>
          </div>

          <!-- Yorum Ekleme Formu -->
          <div class="blog-comment-form-card" style="background:rgba(15,23,42,0.6); border:1px solid rgba(255,255,255,0.08); border-radius:12px; padding:16px; margin-bottom:24px;">
            <div style="display:flex; gap:12px; align-items:flex-start;">
              <img src="${(currentUser && currentUser.avatar) ? currentUser.avatar : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}" style="width:40px; height:40px; border-radius:50%; object-fit:cover; border:2px solid var(--accent-amber);" alt="Avatar">
              <div style="flex:1;">
                ${!currentUser ? `
                  <div style="margin-bottom:8px;">
                    <input type="text" id="blog-guest-name" class="form-control" placeholder="Adınız / Usta Unvanınız (İsteğe bağlı)" style="font-size:0.85rem; padding:8px 12px; margin-bottom:8px; background:rgba(255,255,255,0.04); border:1px solid var(--border-color); color:#FFF; border-radius:8px; width:100%;">
                  </div>
                ` : `
                  <div style="font-size:0.82rem; font-weight:700; color:var(--accent-amber); margin-bottom:6px;">
                    ${escapeHtml(currentUser.name)} ${currentUser.isMechanicVerified ? '🔧 (Onaylı Usta)' : ''}
                  </div>
                `}
                <textarea id="blog-comment-input" rows="3" class="form-control" placeholder="Bu rehber hakkında düşünceleriniz, eklemek istediğiniz usta tecrübeleri veya sorularınız..." style="width:100%; font-size:0.88rem; padding:10px 12px; background:rgba(255,255,255,0.04); border:1px solid var(--border-color); color:#FFF; border-radius:8px; resize:vertical;"></textarea>
                <div style="display:flex; justify-content:flex-end; margin-top:10px;">
                  <button class="btn btn-primary btn-sm" onclick="Blog.submitComment('${post.id}')" style="display:inline-flex; align-items:center; gap:6px;">
                    <span>Yorumu Yayınla</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Yorumlar Listesi -->
          <div id="blog-comments-list" class="blog-comments-list" style="display:flex; flex-direction:column; gap:14px;">
            ${this.renderCommentsList(post.comments || [])}
          </div>
        </section>
      </article>
    `;

    App.switchView('view-blog-detail');
  },

  async submitComment(postId) {
    const input = document.getElementById('blog-comment-input');
    if (!input) return;
    const content = input.value.trim();
    if (!content) {
      showToast('Lütfen bir yorum yazın.');
      input.focus();
      return;
    }
    const guestInput = document.getElementById('blog-guest-name');
    const guestName = guestInput ? guestInput.value.trim() : '';
    const currentUser = (typeof App !== 'undefined' && App.currentUser) || null;

    try {
      const res = await fetch(`/api/blog/${postId}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          authorName: guestName,
          user: currentUser
        })
      });
      const data = await res.json();
      if (data.success && data.comment) {
        if (!this.activePost.comments) this.activePost.comments = [];
        this.activePost.comments.unshift(data.comment);
        input.value = '';
        if (guestInput) guestInput.value = '';
        
        const counter = document.getElementById('blog-comments-counter');
        if (counter) counter.textContent = this.activePost.comments.length;
        
        const listContainer = document.getElementById('blog-comments-list');
        if (listContainer) {
          listContainer.innerHTML = this.renderCommentsList(this.activePost.comments);
        }
        showToast('Yorumunuz başarıyla yayınlandı! 💬');
      } else {
        showToast(data.error || 'Yorum eklenemedi.');
      }
    } catch (err) {
      console.error(err);
      showToast('Sunucu bağlantı hatası oluştu.');
    }
  },

  renderCommentsList(comments) {
    if (!comments || comments.length === 0) {
      return `
        <div class="empty-state" style="padding:28px; text-align:center; background:rgba(255,255,255,0.02); border-radius:10px; border:1px dashed rgba(255,255,255,0.1);">
          <div style="font-size:1.8rem; margin-bottom:6px;">✍️</div>
          <p style="color:var(--text-muted); font-size:0.85rem; margin:0;">Henüz bu yazıya yorum yapılmamış. İlk yorumu siz yazarak tartışmayı başlatın!</p>
        </div>
      `;
    }

    return comments.map(c => `
      <div class="blog-comment-item sidebar-card" style="padding:14px 16px; margin:0; background:rgba(19,25,36,0.85); border:1px solid rgba(255,255,255,0.06); border-radius:10px;">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
          <div style="display:flex; align-items:center; gap:10px;">
            <img src="${c.authorAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80'}" style="width:34px; height:34px; border-radius:50%; object-fit:cover; border:1.5px solid ${c.isMechanicVerified ? 'var(--accent-amber)' : 'rgba(255,255,255,0.15)'};" alt="Avatar">
            <div>
              <div style="display:flex; align-items:center; gap:6px;">
                <strong style="color:#FFF; font-size:0.85rem;">${escapeHtml(c.authorName)}</strong>
                ${c.isMechanicVerified ? '<span class="status-pill-solved" style="font-size:0.68rem; padding:1px 6px;">🔧 Onaylı Usta</span>' : ''}
              </div>
              <span style="font-size:0.72rem; color:var(--text-dim);">${formatDate(c.createdAt)}</span>
            </div>
          </div>
          ${c.shopName ? `<span style="font-size:0.72rem; color:var(--text-muted); background:rgba(255,255,255,0.05); padding:2px 8px; border-radius:4px;">${escapeHtml(c.shopName)}</span>` : ''}
        </div>
        <p style="color:#E2E8F0; font-size:0.88rem; line-height:1.5; margin:0 0 4px 44px; white-space:pre-line;">
          ${escapeHtml(c.content)}
        </p>
      </div>
    `).join('');
  },

  async likeCurrentPost(postId) {
    if (!this.activePost) return;
    const currentUser = (typeof App !== 'undefined' && App.currentUser) || null;
    const btn = document.getElementById('blog-like-btn');
    try {
      const res = await fetch(`/api/blog/${postId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser ? currentUser.id : null })
      });
      const data = await res.json();
      if (data.success) {
        this.activePost.likes = data.likes;
        const countEl = document.getElementById('blog-like-count');
        if (countEl) countEl.textContent = data.likes;
        if (btn) {
          if (data.liked) {
            btn.classList.add('liked');
            btn.style.color = '#EF4444';
            btn.style.borderColor = 'rgba(239, 68, 68, 0.4)';
            btn.style.background = 'rgba(239, 68, 68, 0.12)';
          } else {
            btn.classList.remove('liked');
            btn.style.color = '';
            btn.style.borderColor = '';
            btn.style.background = '';
          }
        }
        showToast(data.liked ? 'Yazıyı beğendiniz! ❤️' : 'Beğeni geri alındı.');
      }
    } catch (err) {
      console.error(err);
    }
  }
};
