// UI Tips Glossary
const uiTips = {
  "top-nav": {
    title: "Top Navigation",
    what: "Logo and quick links to key sections.",
    why: "Orientation and lower friction.",
    tips: [
      "Keep links few and clear.",
      "Use smooth in-page anchors.",
      "Provide visible focus states."
    ]
  },
  "hero": {
    title: "Hero Area",
    what: "Immediate value promise for your course/business.",
    why: "Decides if visitors keep reading.",
    tips: [
      "6–12 word value headline.",
      "Short clarifying subheadline.",
      "Show the primary CTA above the fold."
    ]
  },
  "enroll-cta": {
    title: "Primary CTA",
    what: "Main action (Enroll / Book / Start).",
    why: "Clear actions increase conversions.",
    tips: [
      "Verb + outcome label.",
      "Large click/tap area.",
      "Distinct visual style."
    ]
  },
  "trust-row": {
    title: "Trust Bar",
    what: "Logos or quick stat for credibility.",
    why: "Reduces hesitation early.",
    tips: [
      "Keep subtle but visible.",
      "Use real, verifiable items."
    ]
  },
  "value-props": {
    title: "Value Proposition Cards",
    what: "Three concise benefits that matter most.",
    why: "Helps users scan and decide.",
    tips: [
      "Benefits, not features.",
      "One idea per card.",
      "Consistent layout & icons."
    ]
  },
  "value-card": {
    title: "Benefit Card",
    what: "A single benefit and short explainer.",
    why: "Chunking boosts readability.",
    tips: [
      "Short headline.",
      "1–2 sentences of support."
    ]
  },
  "curriculum": {
    title: "Curriculum Overview",
    what: "Visual outline of the topics/steps.",
    why: "Sets scope and expectations.",
    tips: [
      "Simple timeline/steps.",
      "Scannable item titles."
    ]
  },
  "curriculum-step": {
    title: "Curriculum Step",
    what: "A single lesson or module preview.",
    why: "Lets users gauge level and flow.",
    tips: [
      "Actionable titles.",
      "Avoid jargon."
    ]
  },
  "instructor": {
    title: "Instructor Block",
    what: "Photo and a short, credibility-driven bio.",
    why: "Trust and authority.",
    tips: [
      "Professional photo.",
      "One paragraph focused on outcomes."
    ]
  },
  "instructor-photo": {
    title: "Instructor Photo",
    what: "A clear headshot builds confidence.",
    why: "Humans trust faces.",
    tips: [
      "Neutral background.",
      "Good lighting."
    ]
  },
  "instructor-bio": {
    title: "Instructor Bio",
    what: "Concise statement of experience and results.",
    why: "Explains why you're qualified.",
    tips: [
      "Mention results, not a long story.",
      "Keep it specific."
    ]
  },
  "pricing": {
    title: "Pricing",
    what: "Simple, transparent price presentation.",
    why: "Removes uncertainty.",
    tips: [
      "One plan here is enough.",
      "State what's included.",
      "Add a risk-reversal if possible."
    ]
  },
  "price-card": {
    title: "Plan Card",
    what: "Price, features, and CTA.",
    why: "Clear, comparison-free choice.",
    tips: [
      "Readable numbers.",
      "Short bullet list."
    ]
  },
  "guarantee": {
    title: "Guarantee / Risk Reversal",
    what: "Short text that reduces risk.",
    why: "Improves conversion.",
    tips: [
      "Keep it honest and short."
    ]
  },
  "faqs": {
    title: "FAQs",
    what: "Answers to common objections.",
    why: "Handles hesitation without calls.",
    tips: [
      "Keep answers brief.",
      "Accessible accordion UI."
    ]
  },
  "faq-item": {
    title: "FAQ Item",
    what: "One question and answer.",
    why: "Micro-clarifications.",
    tips: [
      "Avoid walls of text.",
      "Use plain language."
    ]
  },
  "lead-form": {
    title: "Lead Capture",
    what: "Collect name and email for follow-up.",
    why: "Converts interest to a lead.",
    tips: [
      "Explicit labels & inline errors.",
      "Minimal fields.",
      "Privacy note."
    ]
  },
  "form-fields": {
    title: "Form Fields",
    what: "Inputs with labels and validation.",
    why: "Prevents frustration.",
    tips: [
      "Use 'email' type.",
      "Show inline errors.",
      "Respect autofill."
    ]
  },
  "consent": {
    title: "Consent / Privacy",
    what: "Checkbox with a short privacy note.",
    why: "Trust + compliance.",
    tips: [
      "Clear wording.",
      "Link to policy if available."
    ]
  },
  "submit-btn": {
    title: "Submit Button",
    what: "Action to send the lead.",
    why: "Finishes the flow.",
    tips: [
      "Outcome label (e.g., 'Get Syllabus').",
      "Full-width on mobile."
    ]
  },
  "footer": {
    title: "Footer",
    what: "Secondary nav and contact details.",
    why: "Users look here for legitimacy.",
    tips: [
      "Keep it minimal.",
      "Accessible link labels."
    ]
  },
  "footer-nav": {
    title: "Footer Navigation",
    what: "Compact list of utility links.",
    why: "Last-chance orientation.",
    tips: [
      "Avoid clutter.",
      "Keep labels clear."
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

