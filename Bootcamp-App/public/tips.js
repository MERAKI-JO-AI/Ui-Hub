// UI Tips Glossary
const uiTips = {
  "top-nav": {
    title: "Top Navigation",
    what: "Logo and links to main sections (Agenda, Speakers, Venue, Register).",
    why: "Orientation reduces friction and bounce.",
    tips: [
      "Keep links few and clear.",
      "Use sticky nav sparingly.",
      "Ensure visible focus states."
    ]
  },
  "event-hero": {
    title: "Event Hero",
    what: "Name, value hook, and instant details.",
    why: "Sets the promise and drives sign-ups.",
    tips: [
      "Lead with a strong benefit line.",
      "Keep copy concise.",
      "Show the primary CTA above the fold."
    ]
  },
  "event-datetime": {
    title: "Date & Time",
    what: "Clear badge or line for when it happens.",
    why: "Time is the first constraint users check.",
    tips: [
      "Use an easy-to-scan format.",
      "Include timezone if relevant."
    ]
  },
  "event-location": {
    title: "Location",
    what: "Venue/city or online link.",
    why: "Affects travel and commitment.",
    tips: [
      "Add a map link or embed.",
      "Mention parking or online platform."
    ]
  },
  "register-cta": {
    title: "Primary CTA (Register)",
    what: "The main conversion action.",
    why: "Removes uncertainty and directs action.",
    tips: [
      "Outcome label (e.g., 'Reserve Your Seat').",
      "Large tap target.",
      "High contrast placement."
    ]
  },
  "quick-facts": {
    title: "Quick Facts",
    what: "Compact cards for essentials (When, Where, Price, Seats).",
    why: "Faster scanning above the fold.",
    tips: [
      "Consistent iconography.",
      "One short line per fact."
    ]
  },
  "fact-card": {
    title: "Fact Card",
    what: "One essential detail.",
    why: "Chunking makes info memorable.",
    tips: [
      "Short label and value.",
      "Avoid long sentences."
    ]
  },
  "agenda": {
    title: "Agenda / Schedule",
    what: "Timeline of sessions and breaks.",
    why: "Sets expectations for pace and content.",
    tips: [
      "Use times + titles.",
      "Allow expand/collapse for details."
    ]
  },
  "agenda-item": {
    title: "Agenda Item",
    what: "A single session entry.",
    why: "Lets attendees plan their day.",
    tips: [
      "Start time first.",
      "Keep descriptions short."
    ]
  },
  "speakers": {
    title: "Speakers",
    what: "People delivering sessions.",
    why: "Authority and relevance drive sign-ups.",
    tips: [
      "Show photo, role, and talk title.",
      "Link to profiles if possible."
    ]
  },
  "speaker-card": {
    title: "Speaker Card",
    what: "One speaker's identity and session.",
    why: "Faces create trust quickly.",
    tips: [
      "Readable names.",
      "Short bios only."
    ]
  },
  "venue": {
    title: "Venue / Map",
    what: "Visual location context.",
    why: "Wayfinding and logistics.",
    tips: [
      "Provide landmarks/transport notes.",
      "Mobile-friendly map area."
    ]
  },
  "map-stage": {
    title: "Map Stage",
    what: "Area that shows map or venue image.",
    why: "Supports decisions about attending.",
    tips: [
      "Good contrast on overlays.",
      "Alt text for images."
    ]
  },
  "registration": {
    title: "Registration Form",
    what: "Collect attendee details.",
    why: "Converts interest into commitment.",
    tips: [
      "Minimal fields.",
      "Clear errors and success states."
    ]
  },
  "reg-fields": {
    title: "Form Fields",
    what: "Inputs with labels + validation.",
    why: "Prevents mistakes and drop-offs.",
    tips: [
      "Use 'email' type.",
      "Label and placeholder are different."
    ]
  },
  "ticket-select": {
    title: "Ticket / Plan Select",
    what: "Choose ticket type if applicable.",
    why: "Aligns price/benefits.",
    tips: [
      "Few options.",
      "Default to the common choice."
    ]
  },
  "reg-consent": {
    title: "Consent / Terms",
    what: "Checkbox for terms/privacy.",
    why: "Trust and compliance.",
    tips: [
      "Clear wording.",
      "Link to policy."
    ]
  },
  "reg-submit": {
    title: "Submit Registration",
    what: "Action to finalize registration.",
    why: "Completes conversion.",
    tips: [
      "Outcome label (e.g., 'Register Now').",
      "Full width on mobile."
    ]
  },
  "faqs": {
    title: "FAQs",
    what: "Answers to common questions.",
    why: "Removes blockers asynchronously.",
    tips: [
      "Concise answers.",
      "Accessible accordion behavior."
    ]
  },
  "faq-item": {
    title: "FAQ Item",
    what: "Single question & answer.",
    why: "Micro-clarifications.",
    tips: [
      "Plain language.",
      "Avoid walls of text."
    ]
  },
  "footer": {
    title: "Footer",
    what: "Policies, secondary links, contact.",
    why: "Legitimacy and last-mile info.",
    tips: [
      "Minimal and clear.",
      "Readable small type."
    ]
  },
  "footer-nav": {
    title: "Footer Navigation",
    what: "Compact utility links row.",
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

