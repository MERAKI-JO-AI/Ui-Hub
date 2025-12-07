// UI Tips Glossary
const uiTips = {
  "top-nav": {
    title: "Top Navigation",
    what: "Logo and quick links to key sections (Features, Specs, Reviews).",
    why: "Orientation and fast access improve exploration.",
    tips: [
      "Keep links few and clear.",
      "Use sticky nav sparingly.",
      "Ensure visible focus states."
    ]
  },
  "product-hero": {
    title: "Product Hero",
    what: "Big product visual, concise value line, and primary action.",
    why: "First impression and conversion driver.",
    tips: [
      "One clear value headline.",
      "Show the product in context.",
      "CTA above the fold."
    ]
  },
  "purchase-cta": {
    title: "Primary CTA (Buy / Get Started)",
    what: "The main action to purchase or start a trial.",
    why: "Clear CTAs increase conversions.",
    tips: [
      "Outcome-focused label.",
      "Large tap target.",
      "Prominent placement."
    ]
  },
  "secondary-cta": {
    title: "Secondary CTA",
    what: "An alternative path (e.g., 'Learn more').",
    why: "Captures hesitant users without distraction.",
    tips: [
      "Lower visual weight.",
      "Avoid competing with the primary CTA."
    ]
  },
  "gallery": {
    title: "Product Gallery",
    what: "Thumbnails switch the main stage image.",
    why: "Visuals explain features faster than text.",
    tips: [
      "Consistent image ratios.",
      "Use alt text for accessibility."
    ]
  },
  "gallery-thumb": {
    title: "Thumbnail",
    what: "Small selectable preview.",
    why: "Quickly shows angles/variants.",
    tips: [
      "Highlight active thumb.",
      "Lazy-load if many images."
    ]
  },
  "gallery-stage": {
    title: "Main Image Stage",
    what: "Large display area for the selected image.",
    why: "Primary visual storytelling zone.",
    tips: [
      "Good resolution.",
      "Respect aspect ratio on mobile."
    ]
  },
  "features": {
    title: "Key Features",
    what: "Top 3–6 benefits explained with icons.",
    why: "Helps users map benefits to needs.",
    tips: [
      "One idea per card.",
      "Write benefits, not internals."
    ]
  },
  "feature-card": {
    title: "Feature Card",
    what: "Single benefit with short body text.",
    why: "Scannable chunks improve comprehension.",
    tips: [
      "Short headline.",
      "1–2 sentence support."
    ]
  },
  "specs": {
    title: "Tech Specs",
    what: "Structured details in a readable table.",
    why: "Advanced users validate fit here.",
    tips: [
      "Group related specs.",
      "Keep labels consistent.",
      "Make table scroll on small screens."
    ]
  },
  "spec-row": {
    title: "Spec Row",
    what: "One technical detail and its value.",
    why: "Lets users compare specifics.",
    tips: [
      "Avoid jargon.",
      "Units and formats must be clear."
    ]
  },
  "comparison": {
    title: "Comparison",
    what: "Side-by-side vs. competitor/previous model.",
    why: "Guides decision with clarity.",
    tips: [
      "Honest differences.",
      "Highlight the real win conditions."
    ]
  },
  "comparison-highlight": {
    title: "Highlight Badge",
    what: "Callout for the better value/feature.",
    why: "Directs attention to key advantage.",
    tips: [
      "Use sparingly.",
      "Keep wording neutral."
    ]
  },
  "reviews": {
    title: "Reviews",
    what: "User ratings and short quotes.",
    why: "Social proof reduces risk.",
    tips: [
      "Show average rating.",
      "Keep quotes concise and attributable."
    ]
  },
  "star-rating": {
    title: "Star Rating",
    what: "Visual score (e.g., 4.5/5).",
    why: "Quick trust signal.",
    tips: [
      "Round consistently.",
      "Include count of reviews."
    ]
  },
  "review-card": {
    title: "Review Card",
    what: "One user's feedback.",
    why: "Adds credibility and context.",
    tips: [
      "Avoid anonymous if possible.",
      "1–2 sentences work best."
    ]
  },
  "faqs": {
    title: "Product FAQs",
    what: "Answers to common objections.",
    why: "Handles hesitations async.",
    tips: [
      "Short answers.",
      "Accessible accordion."
    ]
  },
  "faq-item": {
    title: "FAQ Item",
    what: "Single question and answer.",
    why: "Micro-clarification for blockers.",
    tips: [
      "Plain language.",
      "No walls of text."
    ]
  },
  "footer": {
    title: "Footer",
    what: "Policies, secondary links, contact.",
    why: "Legitimacy and final navigation.",
    tips: [
      "Minimal and clear.",
      "Readable small type."
    ]
  },
  "footer-nav": {
    title: "Footer Navigation",
    what: "Compact list of utility links.",
    why: "Orientation at the end of the page.",
    tips: [
      "Don't overstuff.",
      "Accessible labels."
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

