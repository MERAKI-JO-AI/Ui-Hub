// UI Tips Glossary
const uiTips = {
  "topbar": {
    title: "Top Bar",
    what: "Compact header with brand and quick controls.",
    why: "Orientation without stealing focus.",
    tips: [
      "Keep it minimal.",
      "Show clear focus states."
    ]
  },
  "theme-toggle": {
    title: "Theme Toggle",
    what: "Switch between light/dark (mock).",
    why: "Comfort for long reading.",
    tips: [
      "Remember choice per user.",
      "Keep icon and label clear."
    ]
  },
  "sidebar-toc": {
    title: "Sidebar Table of Contents",
    what: "Clickable outline of page sections.",
    why: "Lets readers jump quickly and see scope.",
    tips: [
      "Highlight active section.",
      "Avoid deep nesting beyond 2–3 levels."
    ]
  },
  "toc-item": {
    title: "TOC Item",
    what: "One link to a section/anchor.",
    why: "Fast navigation.",
    tips: [
      "Short labels.",
      "Indicate current item."
    ]
  },
  "section-overview": {
    title: "Overview Section",
    what: "Short summary and what the page covers.",
    why: "Sets expectations and context.",
    tips: [
      "Use a 2–3 paragraph intro.",
      "Link to key sections."
    ]
  },
  "mini-toc": {
    title: "On This Page",
    what: "Local anchor list for the section.",
    why: "Micro-orientation inside long pages.",
    tips: [
      "Keep it short.",
      "Use in-page anchors."
    ]
  },
  "callout": {
    title: "Callout / Alert",
    what: "Highlighted box for tips/warnings.",
    why: "Draws attention to critical notes.",
    tips: [
      "Use neutral/warn/success tones.",
      "Keep text concise."
    ]
  },
  "section-concepts": {
    title: "Concepts / How It Works",
    what: "Core ideas and mental model.",
    why: "Improves comprehension before details.",
    tips: [
      "Use diagrams and steps.",
      "Limit jargon."
    ]
  },
  "figure": {
    title: "Figure / Diagram",
    what: "Visual explanation.",
    why: "Faster than text for many ideas.",
    tips: [
      "Add informative alt text.",
      "Caption when needed."
    ]
  },
  "steps": {
    title: "Numbered Steps",
    what: "Ordered list that teaches a flow.",
    why: "Guides readers through tasks.",
    tips: [
      "One action per step.",
      "Keep steps short."
    ]
  },
  "step-item": {
    title: "Step Item",
    what: "A single action in the sequence.",
    why: "Reduces cognitive load.",
    tips: [
      "Active verb at start.",
      "Optional sub-bullets ok."
    ]
  },
  "section-features": {
    title: "Features Section",
    what: "Highlights benefits and capabilities.",
    why: "Shows value compactly.",
    tips: [
      "Use tabs or cards.",
      "Avoid redundant copy."
    ]
  },
  "feature-tabs": {
    title: "Feature Tabs",
    what: "Switch between feature groups.",
    why: "Prevents long scrolling walls.",
    tips: [
      "2–4 tabs are ideal.",
      "Maintain keyboard focus order."
    ]
  },
  "feature-card": {
    title: "Feature Card",
    what: "Single feature chunk.",
    why: "Scannable and comparable.",
    tips: [
      "Short headline + 1–2 lines.",
      "Optional icon helps."
    ]
  },
  "section-setup": {
    title: "Setup / Quickstart",
    what: "Minimal steps to get started.",
    why: "Removes friction to first success.",
    tips: [
      "Keep dependencies clear.",
      "Provide copy buttons for commands."
    ]
  },
  "code-block": {
    title: "Code Block",
    what: "Preformatted snippet with copy.",
    why: "Reduces errors when pasting.",
    tips: [
      "Monospace font.",
      "Copy button with confirmation."
    ]
  },
  "inline-note": {
    title: "Inline Note",
    what: "Small in-flow tip.",
    why: "Adds context without a full callout.",
    tips: [
      "Keep to a single sentence.",
      "Use sparingly."
    ]
  },
  "section-examples": {
    title: "Examples / Use Cases",
    what: "Concrete scenarios showing value.",
    why: "Bridges theory to practice.",
    tips: [
      "One idea per card.",
      "Link to deeper pages if needed."
    ]
  },
  "example-card": {
    title: "Example Card",
    what: "One scenario tile.",
    why: "Quick scanning.",
    tips: [
      "Short title and 1–2 lines.",
      "Optional 'See more' link."
    ]
  },
  "section-pricing": {
    title: "Pricing (Optional)",
    what: "Plan summary and key limits.",
    why: "Sets expectations early.",
    tips: [
      "Simple tiers.",
      "Highlight most common plan."
    ]
  },
  "plan-card": {
    title: "Plan Card",
    what: "Price, features, CTA.",
    why: "Decision helper.",
    tips: [
      "Readable numbers.",
      "Short bullet list."
    ]
  },
  "section-faq": {
    title: "FAQ Section",
    what: "Answers to common questions.",
    why: "Removes blockers.",
    tips: [
      "Concise answers.",
      "Accessible accordion behavior."
    ]
  },
  "faq-item": {
    title: "FAQ Item",
    what: "Single question and answer.",
    why: "Micro-clarification.",
    tips: [
      "Plain language.",
      "Avoid walls of text."
    ]
  },
  "anchor-link": {
    title: "Anchor Link",
    what: "'¶' icon to copy section URL.",
    why: "Easy sharing and deep links.",
    tips: [
      "Show on hover/focus.",
      "Confirm copy with a toast."
    ]
  },
  "footnote": {
    title: "Footnote",
    what: "Inline reference marker.",
    why: "Adds detail without breaking flow.",
    tips: [
      "Keep footnotes brief.",
      "Link back to marker."
    ]
  },
  "back-to-top": {
    title: "Back to Top",
    what: "Quick jump to the page header.",
    why: "Saves time on long pages.",
    tips: [
      "Show after scroll.",
      "Large tap target on mobile."
    ]
  },
  "footer": {
    title: "Footer",
    what: "Legal and small links.",
    why: "Closes the document cleanly.",
    tips: [
      "Keep minimal.",
      "Readable small text."
    ]
  },
  "footer-nav": {
    title: "Footer Navigation",
    what: "Compact utility links row.",
    why: "Orientation at the end.",
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

