/* ============================================================
   Metta site assistant — fully scripted, no external API,
   no backend, no ongoing cost. Keyword-matched FAQ answers +
   quick navigation, persisted per-tab via sessionStorage.
   ============================================================ */
(function () {

  var PAGES = {
    home: 'index.html', about: 'about.html', services: 'services.html',
    cdcp: 'cdcp.html', faq: 'faq.html', contact: 'contact.html'
  };

  // Order matters — first matching rule wins. Keep specific rules above generic ones.
  var KB = [
    {
      keywords: ['cdcp', 'dental care plan', 'insurance', 'coverage', 'covered'],
      reply: "We're registered CDCP providers at both our Steveston and New Westminster clinics, and we also work with many private insurance plans. CDCP covers a large portion of complete dentures, partials, relines and repairs — how much depends on your household income. Bring any plan details to your free consultation and we'll help you understand your exact coverage.",
      link: { label: 'See the full CDCP breakdown', href: PAGES.cdcp }
    },
    {
      keywords: ['cost', 'price', 'how much', 'expensive', 'fee', 'afford'],
      reply: "Cost depends on your specific needs, so we offer a free, no-obligation consultation to give you an accurate quote after examining your denture and oral cavity in person.",
      link: { label: 'Book a Free Consultation', href: PAGES.contact }
    },
    {
      keywords: ['first visit', 'first appointment', 'new patient', 'what to expect', 'what happens at'],
      reply: "Your first visit is a free, no-obligation consultation — we'll examine your current denture or oral cavity in person, talk through your options, and give you an accurate price before any treatment begins. No sales pitch, just a conversation.",
      link: { label: 'Book Your Free Consultation', href: PAGES.contact }
    },
    {
      keywords: ['how many visits', 'how many appointments', 'how long does it take', 'how long will it take', 'timeline'],
      reply: "It varies by treatment — a straightforward reline can be a single visit, while a new complete denture usually involves a few appointments for fitting and adjustments. We'll map out the exact timeline for you at your free consultation.",
      link: { label: 'Book a Free Consultation', href: PAGES.contact }
    },
    {
      keywords: ['flexible denture', 'valplast', 'bps'],
      reply: "Flexible dentures are a clasp-free, virtually invisible option made from a flexible nylon resin — ideal for replacing one or two teeth or a short span, without visible metal clasps.",
      link: { label: 'Learn more about our services', href: PAGES.services }
    },
    {
      keywords: ['implant'],
      reply: "Implant overdentures snap onto implants anchored in the jawbone for a secure, stable fit — much stronger than a traditional denture that just rests on the gums.",
      link: { label: 'See all denture services', href: PAGES.services }
    },
    {
      keywords: ['extraction', 'pull my tooth', 'pull teeth', 'pulling teeth', 'remove my tooth', 'wisdom tooth'],
      reply: "Denturists don't perform extractions — for that we work alongside your dentist or an oral surgeon. If teeth need to come out, we can design an immediate denture in advance so you're not without teeth while you heal.",
      link: { label: 'Learn about Immediate Dentures', href: PAGES.services }
    },
    {
      keywords: ['reline', 'rebase', 'repair', 'broken', 'crack', 'fix my denture', 'loose', 'slipping', "won't stay in", 'wont stay in', 'falls out', 'fall out', 'shifting', "doesn't fit", 'dont fit'],
      reply: 'A denture that has gotten loose, shifts, or slips is usually a sign it needs a reline (or in some cases a repair) as your gums and jawbone change shape over time — very fixable, and often covered in part by CDCP.',
      link: { label: 'See all denture services', href: PAGES.services }
    },
    {
      keywords: ['sore spot', 'sore gum', 'hurts', 'painful', 'pain', 'rubbing', 'irritat'],
      reply: "Some soreness while you adjust to a new denture is common, but you shouldn't have to just live with it — come back in and we'll adjust the fit. Small tweaks make a big difference.",
      link: { label: 'Book an adjustment', href: PAGES.contact }
    },
    {
      keywords: ['service', 'denture type', 'complete denture', 'partial', 'immediate denture', 'kind of denture'],
      reply: 'We offer complete dentures, partial dentures, flexible dentures, immediate dentures, implant overdentures, and relines/repairs — every plan is tailored to you.',
      link: { label: 'Explore Services', href: PAGES.services }
    },
    {
      keywords: ['location', 'address', 'where are you', 'steveston', 'richmond', 'new westminster', 'direction', 'map'],
      reply: 'We have two locations: Unit 103 – 3811 Chatham St in Richmond (Steveston), and 442 6th St in New Westminster.',
      link: { label: 'Get directions to either clinic', href: PAGES.contact }
    },
    {
      keywords: ['hour', 'open', 'when are you', 'appointment only'],
      reply: "Both locations are appointment only — there aren't fixed drop-in hours. Text or call and we'll find a time that works.",
      link: { label: 'Book Now', href: PAGES.contact }
    },
    {
      keywords: ['sleep'],
      reply: "It's generally not recommended to sleep in your dentures — removing them overnight lets your gums rest and reduces the risk of irritation or infection.",
      link: { label: 'More FAQs', href: PAGES.faq }
    },
    {
      keywords: ['clean', 'care for', 'maintain', 'care instruction', 'soak'],
      reply: 'Clean dentures daily with a denture brush and denture cleaner (not regular toothpaste), rinse after meals, and soak overnight in a denture-cleaning solution.',
      link: { label: 'More FAQs', href: PAGES.faq }
    },
    {
      keywords: ['last', 'lifespan', 'how long do', 'replace my denture'],
      reply: 'Dentures are generally recommended to be replaced every 5 years, though it varies based on materials used and how your mouth changes over time.',
      link: { label: 'More FAQs', href: PAGES.faq }
    },
    {
      keywords: ['what is a denturist', 'denturist mean', 'denturist vs dentist'],
      reply: 'A denturist is a denture specialist, licensed to fabricate, repair and fit dentures directly for the public — no referral needed.',
      link: { label: 'More FAQs', href: PAGES.faq }
    },
    {
      keywords: ['team', 'staff', 'wolf', 'claire', 'kelly', ' ben ', 'owner', 'who works', 'meet the'],
      reply: 'Our team includes Wolf (denturist & owner, 30+ years of experience), Claire (office), and denturists-in-training Ben and Kelly.',
      link: { label: 'Meet the Team', href: PAGES.about }
    },
    {
      keywords: ['language', 'speak cantonese', 'speak mandarin', 'speak chinese', 'mandarin', 'cantonese', 'chinese speaking', 'chinese-speaking'],
      reply: 'Yes — our denturist Wolf speaks Cantonese, Mandarin, and English, and our receptionist Claire speaks English and Mandarin too.',
      link: { label: 'Meet the Team', href: PAGES.about }
    },
    {
      keywords: ['metta', 'name mean', 'loving-kindness', 'loving kindness'],
      reply: "Metta is Pali for loving-kindness — the simple wish for another being's happiness. It's the philosophy behind how we care for every patient.",
      link: { label: 'Our Story', href: PAGES.about }
    },
    {
      keywords: ['phone', 'call', 'text', 'email', 'reach you', 'contact'],
      reply: 'Texting (778) 751-9613 is the fastest way to reach us. You can also call either office or email mettadentures@gmail.com.',
      link: { label: 'Full contact details', href: PAGES.contact }
    },
    {
      keywords: ['book', 'appointment', 'consult', 'visit'],
      reply: "We'd love to see you — consultations are free and no-obligation.",
      link: { label: 'Book Now', href: PAGES.contact }
    },
    {
      keywords: ['faq', 'question'],
      reply: "Good place to check — we've answered the questions patients ask us most.",
      link: { label: 'Visit the FAQ page', href: PAGES.faq }
    }
  ];

  var FALLBACK = {
    reply: "I don't have a scripted answer for that one yet — our Contact page has both clinics' numbers to call or text, our email, and a quick message form, so you can reach a real person directly.",
    link: { label: 'Go to Contact', href: PAGES.contact }
  };

  var QUICK_REPLIES = [
    { label: 'Our Services', query: 'what services do you offer' },
    { label: 'Do you accept CDCP?', query: 'do you accept cdcp insurance' },
    { label: 'Where are you located?', query: 'where are your locations' },
    { label: 'Book an appointment', query: 'i want to book an appointment' },
    { label: 'What happens at my first visit?', query: 'what happens at my first visit' },
    { label: 'Meet the team', query: 'meet the team' }
  ];

  var PINNED = [
    { label: 'Services', href: PAGES.services },
    { label: 'CDCP', href: PAGES.cdcp },
    { label: 'Contact', href: PAGES.contact }
  ];

  function matchReply(text) {
    var lower = ' ' + text.toLowerCase() + ' ';
    for (var i = 0; i < KB.length; i++) {
      var rule = KB[i];
      for (var j = 0; j < rule.keywords.length; j++) {
        if (lower.indexOf(rule.keywords[j]) !== -1) return rule;
      }
    }
    return FALLBACK;
  }

  var STORE_KEY = 'metta_assistant_state_v1';
  function loadState() {
    try {
      var raw = sessionStorage.getItem(STORE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return { open: false, messages: [] };
  }
  function saveState(state) {
    try {
      var trimmed = { open: state.open, messages: state.messages.slice(-24) };
      sessionStorage.setItem(STORE_KEY, JSON.stringify(trimmed));
    } catch (e) {}
  }

  document.addEventListener('DOMContentLoaded', function () {
    var state = loadState();

    var root = document.createElement('div');
    root.id = 'metta-assistant';
    root.innerHTML =
      '<div class="assistant-panel" role="dialog" aria-label="Metta site assistant">' +
        '<div class="assistant-header">' +
          '<img src="images/logo-transparent.png" alt="">' +
          '<div><strong>Ask Metta</strong><span>Usually replies instantly</span></div>' +
        '</div>' +
        '<div class="assistant-messages" id="a-messages"></div>' +
        '<div class="a-pinned" id="a-pinned"></div>' +
        '<form class="assistant-inputrow" id="a-form">' +
          '<input type="text" id="a-input" placeholder="Type a question…" autocomplete="off">' +
          '<button type="submit" aria-label="Send">' +
            '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="white" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l18-8-8 18-2-8-8-2Z"/></svg>' +
          '</button>' +
        '</form>' +
      '</div>' +
      '<button class="assistant-toggle" id="a-toggle" aria-expanded="false">' +
        '<svg class="chat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z"/></svg>' +
        '<svg class="close-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>' +
        '<span class="a-toggle-label">Ask a question</span>' +
      '</button>';
    document.body.appendChild(root);

    var messagesEl = root.querySelector('#a-messages');
    var pinnedEl = root.querySelector('#a-pinned');
    var toggleEl = root.querySelector('#a-toggle');
    var formEl = root.querySelector('#a-form');
    var inputEl = root.querySelector('#a-input');

    PINNED.forEach(function (p) {
      var a = document.createElement('a');
      a.href = p.href; a.className = 'a-pin'; a.textContent = p.label;
      pinnedEl.appendChild(a);
    });

    function scrollToBottom() { messagesEl.scrollTop = messagesEl.scrollHeight; }

    function renderMessage(msg) {
      var bubble = document.createElement('div');
      bubble.className = 'a-msg ' + (msg.role === 'user' ? 'user' : 'bot');
      var p = document.createElement('p');
      p.textContent = msg.text;
      bubble.appendChild(p);
      if (msg.link) {
        var a = document.createElement('a');
        a.href = msg.link.href; a.className = 'a-link'; a.textContent = msg.link.label + ' →';
        bubble.appendChild(a);
      }
      messagesEl.appendChild(bubble);
    }

    function pushMessage(role, text, link) {
      var msg = { role: role, text: text, link: link || null };
      state.messages.push(msg);
      renderMessage(msg);
      saveState(state);
      scrollToBottom();
    }

    function showQuickReplies() {
      var wrap = document.createElement('div');
      wrap.className = 'a-quick';
      QUICK_REPLIES.forEach(function (q) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = q.label;
        btn.addEventListener('click', function () { handleUserQuery(q.label, q.query); });
        wrap.appendChild(btn);
      });
      messagesEl.appendChild(wrap);
      scrollToBottom();
    }

    function botTypingThenReply(displayLabel, matchText) {
      var typing = document.createElement('div');
      typing.className = 'a-msg bot a-typing';
      typing.innerHTML = '<span></span><span></span><span></span>';
      messagesEl.appendChild(typing);
      scrollToBottom();
      setTimeout(function () {
        typing.remove();
        var rule = matchReply(matchText);
        pushMessage('bot', rule.reply, rule.link);
      }, 450 + Math.random() * 300);
    }

    function handleUserQuery(displayLabel, matchText) {
      pushMessage('user', displayLabel);
      botTypingThenReply(displayLabel, matchText);
    }

    function openPanel() {
      root.classList.add('open');
      toggleEl.setAttribute('aria-expanded', 'true');
      state.open = true; saveState(state);
      setTimeout(function () { inputEl.focus(); }, 150);
    }
    function closePanel() {
      root.classList.remove('open');
      toggleEl.setAttribute('aria-expanded', 'false');
      state.open = false; saveState(state);
    }

    toggleEl.addEventListener('click', function () {
      root.classList.contains('open') ? closePanel() : openPanel();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && root.classList.contains('open')) closePanel();
    });

    formEl.addEventListener('submit', function (e) {
      e.preventDefault();
      var val = inputEl.value.trim();
      if (!val) return;
      inputEl.value = '';
      handleUserQuery(val, val);
    });

    // restore prior conversation, or greet fresh
    if (state.messages.length) {
      state.messages.forEach(renderMessage);
      scrollToBottom();
    } else {
      pushMessage('bot', "Hi! I'm the Metta assistant 🌸 Ask me about services, CDCP coverage, our locations, or anything else — or tap a question below.");
      showQuickReplies();
    }
    if (state.open) openPanel();
  });
})();
