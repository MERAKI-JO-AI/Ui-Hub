// UI Tips Glossary
const uiTips = {
  // HOME
  "top-nav": {
    title: "Top Navigation",
    what: "Logo and links to key areas.",
    why: "Orientation and quick access.",
    tips: [
      "Keep links few and clear.",
      "Sticky nav only if needed.",
      "Strong focus states."
    ]
  },
  "search-bar": {
    title: "Search & Filter",
    what: "Quick way to find relevant posts.",
    why: "Reduces friction for exploration.",
    tips: [
      "Support clear input labels.",
      "Debounce input for performance."
    ]
  },
  "featured": {
    title: "Featured Post",
    what: "Spotlight article with a large cover.",
    why: "Directs attention to the most important story.",
    tips: [
      "High-quality image.",
      "Tight headline.",
      "Clear 'Read' action."
    ]
  },
  "featured-badge": {
    title: "Featured Badge",
    what: "Small visual tag marking the spotlight.",
    why: "Reinforces hierarchy.",
    tips: [
      "Use sparingly.",
      "Keep contrast high."
    ]
  },
  "post-list": {
    title: "Recent Posts",
    what: "Grid/list of article cards.",
    why: "Supports scanning and discovery.",
    tips: [
      "Consistent card layout.",
      "Readable excerpts (2–3 lines)."
    ]
  },
  "post-card": {
    title: "Post Card",
    what: "Compact preview (title, excerpt, meta).",
    why: "Enables quick scanning.",
    tips: [
      "Short titles.",
      "Clear action target."
    ]
  },
  "post-thumb": {
    title: "Card Thumbnail",
    what: "Cover image in the card.",
    why: "Visual cue to content.",
    tips: [
      "Consistent aspect ratio.",
      "Alt text for meaning, not decoration."
    ]
  },
  "taxonomies": {
    title: "Categories & Tags",
    what: "Filters and discovery paths.",
    why: "Improves findability.",
    tips: [
      "Use clear names, not jargon.",
      "Show active state."
    ]
  },
  "tag-pill": {
    title: "Tag Pill",
    what: "Clickable chip for a tag.",
    why: "Fast topical filtering.",
    tips: [
      "Good hit area on mobile.",
      "Visible focus & active style."
    ]
  },
  "newsletter": {
    title: "Newsletter Sign-up",
    what: "Collect emails for updates.",
    why: "Retains audience attention.",
    tips: [
      "One field + consent note.",
      "Inline errors with 'email' type."
    ]
  },
  "newsletter-form": {
    title: "Newsletter Form",
    what: "Email input and submit.",
    why: "Primary retention mechanic.",
    tips: [
      "Clear label + aria-live errors.",
      "Disable submit while sending."
    ]
  },
  "footer": {
    title: "Footer",
    what: "Secondary links and legal.",
    why: "Legitimacy and last-mile info.",
    tips: [
      "Keep minimal.",
      "Readable small text."
    ]
  },
  "footer-nav": {
    title: "Footer Navigation",
    what: "Compact list of utility links.",
    why: "Orientation at the end of page.",
    tips: [
      "Don't overstuff.",
      "Accessible labels."
    ]
  },
  // POST
  "post-nav": {
    title: "Post Nav / Breadcrumb",
    what: "Back to list and context.",
    why: "Helps users not get lost.",
    tips: [
      "Keep short labels.",
      "Maintain visual hierarchy."
    ]
  },
  "post-meta": {
    title: "Title & Meta",
    what: "Article title, author, date, reading time.",
    why: "Sets expectations before reading.",
    tips: [
      "Readable date format.",
      "Show author identity."
    ]
  },
  "author-chip": {
    title: "Author Chip",
    what: "Avatar + name + role.",
    why: "Builds trust.",
    tips: [
      "Use a real photo.",
      "Readable name at small sizes."
    ]
  },
  "publish-date": {
    title: "Published Date",
    what: "When the article was published.",
    why: "Signals freshness.",
    tips: [
      "Use a consistent format.",
      "Consider relative time sparingly."
    ]
  },
  "lead-image": {
    title: "Lead Image",
    what: "Hero image for the article.",
    why: "Sets tone and draws in the reader.",
    tips: [
      "High-resolution.",
      "Relevant to the topic."
    ]
  },
  "post-content": {
    title: "Article Body",
    what: "Text content with headings, images, code, quotes.",
    why: "Main reading experience.",
    tips: [
      "Keep measure 60–80ch.",
      "Use subheadings for structure."
    ]
  },
  "inline-image": {
    title: "Inline Image",
    what: "Supporting image in the body.",
    why: "Breaks monotony and illustrates ideas.",
    tips: [
      "Use captions when helpful.",
      "Alt text for accessibility."
    ]
  },
  "code-block": {
    title: "Code Block",
    what: "Preformatted code snippet.",
    why: "Teaches implementation details.",
    tips: [
      "Provide copy button.",
      "Maintain monospace legibility."
    ]
  },
  "pull-quote": {
    title: "Pull Quote",
    what: "Visually highlighted quote.",
    why: "Emphasizes a key idea.",
    tips: [
      "Use sparingly.",
      "Keep it short."
    ]
  },
  "progress-bar": {
    title: "Reading Progress",
    what: "Top bar showing how far you've read.",
    why: "Sets expectations and encourages completion.",
    tips: [
      "Smooth updates.",
      "Don't cover content."
    ]
  },
  "share-row": {
    title: "Share Row",
    what: "Buttons to share the article.",
    why: "Extends reach.",
    tips: [
      "Label icons for a11y.",
      "Avoid excessive networks."
    ]
  },
  "next-prev": {
    title: "Next / Previous",
    what: "Links to adjacent articles.",
    why: "Encourages continued reading.",
    tips: [
      "Short titles.",
      "Clear direction arrows."
    ]
  },
  "comments": {
    title: "Comments (Static)",
    what: "Non-functional placeholder for discussion.",
    why: "Sets expectation for community without backend.",
    tips: [
      "Keep concise.",
      "Moderation rules note is fine."
    ]
  }
};

// Tip Engine
(function() {
  'use strict';

  // === Shared tip state (singleton) ===
  const TIP = {
    el: null,
    visible: false,
    lastX: 0,
    lastY: 0,
    margin: 20,
  };

  const tipModal = document.getElementById('tip-modal');
  const tipLive = document.getElementById('tip-live');
  let currentTarget = null;
  let currentTipKey = null;
  let tipCardTimeout = null;
  let modalOpen = false;
  let lastFocusedElement = null;
  let focusTrapHandler = null;

  function ensureTipEl() {
    if (TIP.el) return TIP.el;
    const el = document.getElementById('tip-card');
    if (!el) {
      const newEl = document.createElement('div');
      newEl.id = 'tip-card';
      newEl.className = 'tip-card';
      newEl.setAttribute('role', 'tooltip');
      newEl.setAttribute('aria-live', 'polite');
      newEl.setAttribute('aria-hidden', 'true');
      newEl.innerHTML = '<div class="tip-title"></div><div class="tip-why"></div><ul class="tip-list"></ul>';
      document.body.appendChild(newEl);
      TIP.el = newEl;
    } else {
      TIP.el = el;
    }
    return TIP.el;
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    ensureTipEl();
    
    // Find all elements with data-tip
    const tipElements = document.querySelectorAll('[data-tip]');
    
    tipElements.forEach(element => {
      const tipKey = element.getAttribute('data-tip');
      
      if (!uiTips[tipKey]) {
        console.warn(`No tip data found for key: ${tipKey}`);
        return;
      }

      // Desktop: hover for tip card
      element.addEventListener('mouseenter', (e) => {
        if (!modalOpen) {
          clearTimeout(tipCardTimeout);
          TIP.lastX = e.clientX;
          TIP.lastY = e.clientY;
          showTip(element, tipKey);
        }
      });

      element.addEventListener('mouseleave', () => {
        hideTip();
      });

      // Click/tap for modal
      element.addEventListener('click', (e) => {
        // Don't open modal if clicking on a link/button inside
        if (e.target.closest('a, button') && e.target !== element) {
          return;
        }
        e.preventDefault();
        openTipModal(tipKey, element);
      });

      // Keyboard: Enter/Space to open modal
      element.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openTipModal(tipKey, element);
        }
      });

      // Make focusable if not already
      if (!element.hasAttribute('tabindex') && 
          !['A', 'BUTTON', 'INPUT', 'TEXTAREA', 'SELECT'].includes(element.tagName)) {
        element.setAttribute('tabindex', '0');
      }
    });

    // Keep tip card visible when hovering over it
    TIP.el.addEventListener('mouseenter', () => {
      clearTimeout(tipCardTimeout);
    });

    TIP.el.addEventListener('mouseleave', () => {
      hideTip();
    });

    // Modal close handlers
    const modalCloseBtn = tipModal.querySelector('.modal-close');
    const modalBackdrop = tipModal.querySelector('.modal-backdrop');

    modalCloseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeTipModal();
    });
    modalBackdrop.addEventListener('click', (e) => {
      // Only close if clicking directly on backdrop, not content
      if (e.target === modalBackdrop) {
        closeTipModal();
      }
    });

    // ESC key to close modal
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalOpen) {
        closeTipModal();
      }
    });

    // Track pointer globally for smooth follow
    window.addEventListener('pointermove', (e) => {
      TIP.lastX = e.clientX;
      TIP.lastY = e.clientY;
      if (TIP.visible) {
        positionTipFixed();
      }
    }, { passive: true });

    // Keep position sane on scroll/resize even if pointer doesn't move
    ['scroll', 'resize'].forEach(evt => {
      window.addEventListener(evt, () => {
        if (TIP.visible) {
          positionTipFixed();
        }
      }, { passive: true });
    });
  }

  function showTip(targetEl, key) {
    if (modalOpen) return;

    currentTarget = targetEl;
    currentTipKey = key;

    const tipData = uiTips[key];
    if (!tipData) return;

    ensureTipEl();
    
    // Populate tip card
    TIP.el.querySelector('.tip-title').textContent = tipData.title;
    TIP.el.querySelector('.tip-why').textContent = tipData.why;
    
    const tipList = TIP.el.querySelector('.tip-list');
    tipList.innerHTML = '';
    tipData.tips.forEach(tip => {
      const li = document.createElement('li');
      li.textContent = tip;
      tipList.appendChild(li);
    });

    TIP.visible = true;
    TIP.el.setAttribute('aria-hidden', 'false');
    TIP.el.classList.add('is-visible');
    positionTipFixed();
  }

  function hideTip() {
    if (tipCardTimeout) {
      clearTimeout(tipCardTimeout);
    }
    tipCardTimeout = setTimeout(() => {
      // Only hide if mouse is not over tip card
      if (!TIP.el.matches(':hover')) {
        TIP.visible = false;
        TIP.el.classList.remove('is-visible');
        TIP.el.style.transform = 'translate(-9999px, -9999px)';
        TIP.el.setAttribute('aria-hidden', 'true');
        currentTarget = null;
        currentTipKey = null;
      }
    }, 200);
  }

  // Core positioning (viewport coordinates; no scroll offsets needed)
  function positionTipFixed() {
    if (!TIP.el) return;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const rect = TIP.el.getBoundingClientRect();
    const m = TIP.margin;

    // Default: bottom-right of cursor
    let x = TIP.lastX + m;
    let y = TIP.lastY + m;

    // Flip horizontally if overflowing right
    if (x + rect.width > vw - 12) {
      x = TIP.lastX - rect.width - m;
    }
    // Flip vertically if overflowing bottom
    if (y + rect.height > vh - 12) {
      y = TIP.lastY - rect.height - m;
    }

    // Clamp
    x = Math.max(12, Math.min(x, vw - rect.width - 12));
    y = Math.max(12, Math.min(y, vh - rect.height - 12));

    TIP.el.style.transform = `translate(${x}px, ${y}px)`;
  }

  function openTipModal(key, triggerEl) {
    const tipData = uiTips[key];
    if (!tipData) return;

    // Hide tip card
    hideTip();
    modalOpen = true;

    // Store focus
    lastFocusedElement = triggerEl;

    // Populate modal
    document.getElementById('modal-title').textContent = tipData.title;
    tipModal.querySelector('.modal-what').textContent = tipData.what;
    tipModal.querySelector('.modal-why').textContent = tipData.why;
    
    const modalTips = tipModal.querySelector('.modal-tips');
    modalTips.innerHTML = '';
    tipData.tips.forEach(tip => {
      const li = document.createElement('li');
      li.textContent = tip;
      modalTips.appendChild(li);
    });

    // Show modal
    tipModal.setAttribute('aria-hidden', 'false');
    
    // Announce to screen readers
    if (tipLive) {
      tipLive.textContent = `Opened ${tipData.title} modal`;
    }

    // Focus trap
    trapFocus(tipModal);

    // Focus close button
    const closeBtn = tipModal.querySelector('.modal-close');
    closeBtn.focus();
  }

  function closeTipModal() {
    if (!modalOpen) return;

    modalOpen = false;
    tipModal.setAttribute('aria-hidden', 'true');

    // Return focus to trigger
    if (lastFocusedElement) {
      lastFocusedElement.focus();
      lastFocusedElement = null;
    }

    // Clear focus trap
    releaseFocus();
  }

  function trapFocus(container) {
    const focusableElements = container.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    focusTrapHandler = function handleTabKey(e) {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    container.addEventListener('keydown', focusTrapHandler);
  }

  function releaseFocus() {
    // Remove focus trap listener
    if (focusTrapHandler) {
      tipModal.removeEventListener('keydown', focusTrapHandler);
      focusTrapHandler = null;
    }
  }

  // Expose functions globally
  window.showTip = showTip;
  window.openTipModal = openTipModal;
  window.hideTip = hideTip;
  window.closeTipModal = closeTipModal;
})();

