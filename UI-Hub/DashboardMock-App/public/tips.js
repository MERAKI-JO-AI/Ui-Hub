// UI Tips Glossary
const uiTips = {
  "sidebar": {
    title: "Sidebar Navigation",
    what: "Primary wayfinding with grouped links.",
    why: "Provides stable orientation in data apps.",
    tips: [
      "Use clear icons + labels.",
      "Allow collapse to save space."
    ]
  },
  "sidebar-item": {
    title: "Sidebar Item",
    what: "Single destination in the app.",
    why: "Predictable navigation reduces errors.",
    tips: [
      "Short labels.",
      "Active state must be obvious."
    ]
  },
  "sidebar-toggle": {
    title: "Sidebar Collapse",
    what: "Control to shrink/expand the sidebar.",
    why: "Gives more room to data.",
    tips: [
      "Remember state per user.",
      "Keep hit area large."
    ]
  },
  "topbar": {
    title: "Topbar",
    what: "Global actions (search, filters, user).",
    why: "Quick access to common tasks.",
    tips: [
      "Avoid overcrowding.",
      "Provide keyboard focus order."
    ]
  },
  "search": {
    title: "Search",
    what: "Keyword filter for data.",
    why: "Speeds up finding rows.",
    tips: [
      "Debounce input.",
      "Show 'no results' states."
    ]
  },
  "date-range": {
    title: "Date Range",
    what: "Time window selector.",
    why: "Common axis for dashboards.",
    tips: [
      "Keep presets (7d/30d/QTD).",
      "Indicate the active range."
    ]
  },
  "user-menu": {
    title: "User Menu",
    what: "Profile and quick settings.",
    why: "Personal tasks in one spot.",
    tips: [
      "Make menu accessible via keyboard.",
      "Close on outside click/ESC."
    ]
  },
  "kpi-cards": {
    title: "KPI Cards",
    what: "At-a-glance metrics (4–6).",
    why: "Summarizes performance quickly.",
    tips: [
      "Use consistent units.",
      "Show context deltas."
    ]
  },
  "kpi-card": {
    title: "Single KPI Card",
    what: "One metric with label and value.",
    why: "Highlights what matters now.",
    tips: [
      "Readable numbers.",
      "Avoid unnecessary decimals."
    ]
  },
  "kpi-delta": {
    title: "Delta / Trend",
    what: "Change vs. prior period.",
    why: "Gives direction, not just value.",
    tips: [
      "Use arrows + color coding.",
      "Explain period basis."
    ]
  },
  "chart-area": {
    title: "Chart Area",
    what: "Space for charts/visualizations.",
    why: "Supports pattern recognition.",
    tips: [
      "Don't overload with charts.",
      "Use tabs to switch types."
    ]
  },
  "chart-tabs": {
    title: "Chart Tabs",
    what: "Switch between chart types.",
    why: "Lets users explore views.",
    tips: [
      "Keep 2–3 options.",
      "Remember last choice."
    ]
  },
  "data-table": {
    title: "Data Table",
    what: "Sortable, paginated dataset.",
    why: "Detailed inspection of records.",
    tips: [
      "Zebra rows & hover states.",
      "Sticky header on long lists."
    ]
  },
  "table-sort": {
    title: "Sortable Header",
    what: "Click to sort asc/desc.",
    why: "Quick reordering of data.",
    tips: [
      "Show sort icons.",
      "Persist sort until changed."
    ]
  },
  "row-actions": {
    title: "Row Actions",
    what: "Per-row controls like view/edit.",
    why: "Inline task completion.",
    tips: [
      "Use icons + labels on desktop.",
      "Provide large targets on mobile."
    ]
  },
  "pagination": {
    title: "Pagination",
    what: "Navigate pages of results.",
    why: "Prevents infinite scrolling fatigue.",
    tips: [
      "Show total count.",
      "Keep controls near the table bottom."
    ]
  },
  "activity-panel": {
    title: "Activity / Notes",
    what: "Recent events or annotations.",
    why: "Adds context to the current page.",
    tips: [
      "Show timestamps.",
      "Keep it collapsible."
    ]
  },
  "footer": {
    title: "Footer",
    what: "Legal, versions, and small links.",
    why: "Closes the layout & gives status.",
    tips: [
      "Keep minimal.",
      "Readable small text."
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

