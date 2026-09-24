document.addEventListener('DOMContentLoaded', () => {
  // mobile nav toggle
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('open');
      toggle.classList.toggle('active');
    });
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        toggle.classList.remove('active');
      });
    });
  }

  // accordions (services + faq)
  document.querySelectorAll('.accordion-item').forEach(item => {
    const trigger = item.querySelector('.accordion-trigger');
    const panel = item.querySelector('.accordion-panel');
    if (!trigger || !panel) return;
    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      item.closest('.accordion').querySelectorAll('.accordion-item').forEach(other => {
        other.classList.remove('open');
        other.querySelector('.accordion-panel').style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add('open');
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });

  // open first accordion item by default
  document.querySelectorAll('.accordion').forEach(acc => {
    const first = acc.querySelector('.accordion-item');
    if (first) {
      first.classList.add('open');
      first.querySelector('.accordion-panel').style.maxHeight = first.querySelector('.accordion-panel').scrollHeight + 'px';
    }
  });

  // contact form — submits to FormSubmit.co; just show a "sending" state
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', () => {
      const btn = contactForm.querySelector('button[type="submit"]');
      if (btn) {
        btn.textContent = 'Sending…';
        btn.disabled = true;
      }
    });
  }

  // scroll reveal
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }
});

/* ============================================================
   Local live-edit mode — only runs when served from localhost
   via serve.ps1. Never appears on the deployed/live site.
   ============================================================ */
(function () {
  if (!['localhost', '127.0.0.1'].includes(location.hostname)) return;

  document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.id = '__edit_styles';
    style.textContent = `
      #__edit_toolbar{position:fixed;bottom:20px;right:20px;z-index:99999;display:flex;gap:8px;font-family:Karla,sans-serif;}
      #__edit_toolbar button{border:none;border-radius:100px;padding:0.7em 1.3em;font-weight:700;font-size:0.85rem;cursor:pointer;box-shadow:0 8px 20px -8px rgba(0,0,0,0.5);}
      #__edit_toolbar .__edit-start{background:#8c4a5c;color:#fff;}
      #__edit_toolbar .__edit-save{background:#3a6b3f;color:#fff;}
      #__edit_toolbar .__edit-cancel{background:#333;color:#fff;}
      #__edit_toolbar .__edit-push{background:#2f3c64;color:#fff;}
      #__edit_toolbar button:disabled{opacity:0.6;cursor:wait;}
      #__edit_status{position:fixed;bottom:72px;right:20px;z-index:99999;background:#222;color:#fff;padding:0.7em 1.1em;border-radius:10px;font-size:0.82rem;font-family:Karla,sans-serif;max-width:340px;box-shadow:0 8px 20px -8px rgba(0,0,0,0.5);}
      body[data-editing="true"] .reveal{opacity:1 !important;transform:none !important;}
      body[data-editing="true"] [contenteditable="true"]:hover{outline:1.5px dashed #cf9f4d;outline-offset:2px;}
    `;
    document.head.appendChild(style);

    const toolbar = document.createElement('div');
    toolbar.id = '__edit_toolbar';
    toolbar.setAttribute('contenteditable', 'false');
    document.body.appendChild(toolbar);

    const status = document.createElement('div');
    status.id = '__edit_status';
    status.style.display = 'none';
    document.body.appendChild(status);

    function showStatus(msg, isError, holdMs) {
      status.textContent = msg;
      status.style.display = 'block';
      status.style.whiteSpace = 'pre-wrap';
      status.style.background = isError ? '#8c2e2e' : '#3a6b3f';
      clearTimeout(showStatus._t);
      showStatus._t = setTimeout(() => { status.style.display = 'none'; }, holdMs || 5000);
    }

    function renderStart() {
      toolbar.innerHTML = '<button class="__edit-start">✏️ Edit This Page</button><button class="__edit-push">⬆️ Push to GitHub</button>';
      toolbar.querySelector('.__edit-start').addEventListener('click', startEdit);
      toolbar.querySelector('.__edit-push').addEventListener('click', pushToGitHub);
    }

    function renderEditing() {
      toolbar.innerHTML = '<button class="__edit-save">💾 Save Changes</button><button class="__edit-cancel">✖ Exit</button>';
      toolbar.querySelector('.__edit-save').addEventListener('click', saveEdit);
      toolbar.querySelector('.__edit-cancel').addEventListener('click', stopEdit);
    }

    function pushToGitHub() {
      const btn = toolbar.querySelector('.__edit-push');
      if (btn) { btn.textContent = '⬆️ Pushing…'; btn.disabled = true; }
      showStatus('Pushing to GitHub… if a browser login window opens, sign in there first.', false, 30000);
      fetch('/__push', { method: 'POST' })
        .then(r => r.text().then(text => ({ ok: r.ok, text })))
        .then(({ ok, text }) => {
          showStatus((ok ? 'Pushed to GitHub ✓\n' : 'Push had a problem:\n') + text, !ok, 12000);
        })
        .catch(err => showStatus('Push failed — ' + err.message, true, 12000))
        .finally(() => { if (btn) { btn.textContent = '⬆️ Push to GitHub'; btn.disabled = false; } });
    }

    function startEdit() {
      document.designMode = 'on';
      document.body.setAttribute('data-editing', 'true');
      renderEditing();
      showStatus('Edit mode on — click any text and type. Avoid editing the nav/footer links.');
    }

    function stopEdit() {
      document.designMode = 'off';
      document.body.removeAttribute('data-editing');
      renderStart();
    }

    // safety net: never let clicks navigate away while editing
    document.addEventListener('click', (e) => {
      if (document.body.getAttribute('data-editing') === 'true') {
        const a = e.target.closest('a');
        if (a) e.preventDefault();
      }
    }, true);

    function saveEdit() {
      const clone = document.documentElement.cloneNode(true);
      clone.querySelector('#__edit_toolbar')?.remove();
      clone.querySelector('#__edit_status')?.remove();
      clone.querySelector('#__edit_styles')?.remove();
      const body = clone.querySelector('body');
      body?.removeAttribute('data-editing');
      body?.removeAttribute('contenteditable');
      clone.removeAttribute('contenteditable');
      // strip JS-added runtime state so the saved file matches a fresh page load
      clone.querySelectorAll('.reveal.in').forEach(el => el.classList.remove('in'));
      clone.querySelectorAll('.accordion-item.open').forEach(el => {
        el.classList.remove('open');
        el.querySelector('.accordion-panel')?.removeAttribute('style');
      });
      clone.querySelector('.main-nav.open')?.classList.remove('open');
      clone.querySelector('.nav-toggle.active')?.classList.remove('active');

      const html = '<!DOCTYPE html>\n' + clone.outerHTML;
      const savePath = (location.pathname.replace(/^\//, '') || 'index.html');

      fetch('/__save?path=' + encodeURIComponent(savePath), {
        method: 'POST',
        headers: { 'Content-Type': 'text/html' },
        body: html
      }).then(r => {
        if (!r.ok) return r.text().then(t => { throw new Error(t || ('HTTP ' + r.status)); });
        showStatus('Saved ✓ (' + savePath + '). A backup of the old version was kept too.');
      }).catch(err => showStatus('Save failed — ' + err.message, true));
    }

    renderStart();
  });
})();
