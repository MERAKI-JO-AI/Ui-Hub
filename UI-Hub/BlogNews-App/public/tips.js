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

  const tipCard = document.getElementById('tip-card');
  const tipModal = document.getElementById('tip-modal');
  const tipLive = document.getElementById('tip-live');
  let currentTarget = null;
  let currentTipKey = null;
  let tipCardTimeout = null;
  let modalOpen = false;
  let lastFocusedElement = null;
  let focusTrapHandler = null;

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
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
          // Store mouse position for cursor-based positioning
          window._lastMouseY = e.clientY;
          window._lastMouseX = e.clientX;
          showTip(element, tipKey);
        }
      });
      
      // Update mouse position as user moves mouse over element
      element.addEventListener('mousemove', (e) => {
        if (!modalOpen && currentTarget === element) {
          window._lastMouseY = e.clientY;
          window._lastMouseX = e.clientX;
          // Reposition tip card as mouse moves
          positionTipCard(element);
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

    // Keep tip card visible when hovering over it (only add once)
    tipCard.addEventListener('mouseenter', () => {
      clearTimeout(tipCardTimeout);
    });

    tipCard.addEventListener('mouseleave', () => {
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

    // Handle window resize/scroll for tip card positioning
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (currentTarget && currentTipKey && !modalOpen) {
          positionTipCard(currentTarget);
        }
      }, 100);
    });

    window.addEventListener('scroll', () => {
      if (currentTarget && currentTipKey && !modalOpen) {
        positionTipCard(currentTarget);
      }
    }, { passive: true });
  }

  function showTip(targetEl, key) {
    if (modalOpen) return;

    currentTarget = targetEl;
    currentTipKey = key;

    const tipData = uiTips[key];
    if (!tipData) return;

    // Populate tip card
    tipCard.querySelector('.tip-title').textContent = tipData.title;
    tipCard.querySelector('.tip-why').textContent = tipData.why;
    
    const tipList = tipCard.querySelector('.tip-list');
    tipList.innerHTML = '';
    tipData.tips.forEach(tip => {
      const li = document.createElement('li');
      li.textContent = tip;
      tipList.appendChild(li);
    });

    // Position and show
    // Make it invisible first but keep it in flow to get dimensions
    tipCard.style.visibility = 'hidden';
    tipCard.style.opacity = '0';
    tipCard.setAttribute('aria-hidden', 'false');
    
    // Position it immediately - use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
      positionTipCard(targetEl);
      // Make it visible after positioning
      tipCard.style.visibility = 'visible';
      requestAnimationFrame(() => {
        tipCard.style.opacity = '1';
      });
    });
  }

  function hideTip() {
    if (tipCardTimeout) {
      clearTimeout(tipCardTimeout);
    }
    tipCardTimeout = setTimeout(() => {
      // Only hide if mouse is not over tip card
      if (!tipCard.matches(':hover')) {
        tipCard.style.opacity = '0';
        tipCard.style.visibility = 'hidden';
        tipCard.setAttribute('aria-hidden', 'true');
        currentTarget = null;
        currentTipKey = null;
      }
    }, 200);
  }

  function positionTipCard(targetEl) {
    if (!targetEl || !tipCard) return;

    // Get tip card dimensions - if not available yet, use defaults
    // Temporarily make it visible to measure
    const wasHidden = tipCard.style.visibility === 'hidden';
    if (wasHidden) {
      tipCard.style.visibility = 'visible';
      tipCard.style.opacity = '0';
    }
    
    const tipRect = tipCard.getBoundingClientRect();
    const tipWidth = tipRect.width > 0 ? tipRect.width : 300;
    const tipHeight = tipRect.height > 0 ? tipRect.height : 150;
    
    if (wasHidden) {
      tipCard.style.visibility = 'hidden';
    }
    
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const offset = 20; // Offset from cursor
    
    // Use mouse position if available, otherwise use element center
    let mouseX = window._lastMouseX;
    let mouseY = window._lastMouseY;
    
    // If no mouse position, use element center
    if (!mouseX || !mouseY) {
      const rect = targetEl.getBoundingClientRect();
      mouseX = rect.left + (rect.width / 2);
      mouseY = rect.top + (rect.height / 2);
    }
    
    // Position tip card near cursor (prefer bottom-right, adjust if needed)
    let top = mouseY + offset;
    let left = mouseX + offset;
    
    // Adjust if tip card would go off-screen to the right
    if (left + tipWidth > viewportWidth - 12) {
      left = mouseX - tipWidth - offset; // Show to the left of cursor
    }
    
    // Adjust if tip card would go off-screen at the bottom
    if (top + tipHeight > viewportHeight - 12) {
      top = mouseY - tipHeight - offset; // Show above cursor
    }
    
    // Clamp to viewport bounds
    top = Math.max(12, Math.min(top, viewportHeight - tipHeight - 12));
    left = Math.max(12, Math.min(left, viewportWidth - tipWidth - 12));
    
    tipCard.style.top = `${top + window.scrollY}px`;
    tipCard.style.left = `${left + window.scrollX}px`;
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

