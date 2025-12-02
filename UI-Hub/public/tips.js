// UI Tips Glossary
const uiTips = {
  "top-nav": {
    title: "Top Navigation",
    what: "Logo and quick section anchors.",
    why: "Immediate orientation and fast jumps.",
    tips: [
      "Keep links short.",
      "Strong focus states.",
      "Use skip link for a11y."
    ]
  },
  "hero": {
    title: "Hero",
    what: "Big promise + primary actions.",
    why: "Sets direction for the whole hub.",
    tips: [
      "One clear headline.",
      "Two obvious CTAs."
    ]
  },
  "primary-cta": {
    title: "Primary CTA",
    what: "The main action you want the user to take.",
    why: "Clear CTAs increase conversions.",
    tips: [
      "Use a verb and an outcome (e.g., 'Start Learning').",
      "Distinct style vs. secondary actions.",
      "Large click/tap area."
    ]
  },
  "secondary-cta": {
    title: "Secondary CTA",
    what: "Alternative action with less emphasis.",
    why: "Provides options without competing with primary.",
    tips: [
      "Subtle styling difference.",
      "Still accessible and clear."
    ]
  },
  "overview": {
    title: "What is UI?",
    what: "Interface elements users see and use.",
    why: "Clear UI reduces friction and increases trust.",
    tips: [
      "Prefer clarity over novelty.",
      "Use consistent patterns."
    ]
  },
  "figure": {
    title: "Figure / Illustration",
    what: "Visual aid supporting the concept.",
    why: "Explains faster than text for many learners.",
    tips: [
      "Include alt text.",
      "Keep contrast high."
    ]
  },
  "why-ui": {
    title: "Why UI Matters",
    what: "Three concise benefits (clarity, trust, conversion).",
    why: "Motivates the work ahead.",
    tips: [
      "Use benefit-led copy.",
      "Keep cards scannable."
    ]
  },
  "value-card": {
    title: "Benefit Card",
    what: "A single benefit chunk.",
    why: "Improves scanning and recall.",
    tips: [
      "Short headline.",
      "1–2 lines of support."
    ]
  },
  "curriculum": {
    title: "Curriculum",
    what: "The 10 hands-on builds you'll complete.",
    why: "Sets scope and sequence.",
    tips: [
      "Simple step timeline.",
      "Link each step to its app card."
    ]
  },
  "curriculum-step": {
    title: "Step Item",
    what: "One project in the sequence.",
    why: "Keeps progress explicit.",
    tips: [
      "Active verb in the label.",
      "Short descriptor only."
    ]
  },
  "method-note": {
    title: "How We Teach",
    what: "Hover tip + click modal on every app.",
    why: "Micro-learning at the exact element.",
    tips: [
      "Keep tips short.",
      "Open modal for deeper context."
    ]
  },
  "projects-gallery": {
    title: "Projects Gallery",
    what: "Cards linking to each app.",
    why: "Central index to practice areas.",
    tips: [
      "Use tags and search.",
      "Consistent card format."
    ]
  },
  "project-filters": {
    title: "Search & Filters",
    what: "Text search and tag pills.",
    why: "Faster discovery by topic.",
    tips: [
      "Debounce search input.",
      "Visible active tag states."
    ]
  },
  "project-card": {
    title: "Project Card",
    what: "Title, blurb, tags, actions.",
    why: "Quick scan and launch.",
    tips: [
      "One CTA to open app.",
      "Optional preview modal."
    ]
  },
  "faqs": {
    title: "FAQ",
    what: "Answers to common questions.",
    why: "Unblocks learners asynchronously.",
    tips: [
      "Concise answers.",
      "Accessible accordion behavior."
    ]
  },
  "faq-item": {
    title: "FAQ Item",
    what: "Single Q&A.",
    why: "Micro-clarification.",
    tips: [
      "Plain language.",
      "No walls of text."
    ]
  },
  "footer": {
    title: "Footer",
    what: "Legal, small links, ©.",
    why: "Closes the page cleanly.",
    tips: [
      "Keep minimal.",
      "Readable small text."
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

    // Populate tip card with just the title
    tipCard.querySelector('.tip-card-content').textContent = tipData.title;

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
    const tipWidth = tipRect.width > 0 ? tipRect.width : 250;
    const tipHeight = tipRect.height > 0 ? tipRect.height : 50;
    
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
    const modalTitle = document.getElementById('tip-modal-title');
    const modalContent = document.getElementById('tip-modal-content');
    
    modalTitle.textContent = tipData.title;
    
    modalContent.innerHTML = `
      <div>
        <h3>What</h3>
        <p>${tipData.what}</p>
      </div>
      <div>
        <h3>Why</h3>
        <p>${tipData.why}</p>
      </div>
      <div>
        <h3>Tips</h3>
        <ul>
          ${tipData.tips.map(tip => `<li>${tip}</li>`).join('')}
        </ul>
      </div>
    `;

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
  window.positionTipCard = positionTipCard;
})();

