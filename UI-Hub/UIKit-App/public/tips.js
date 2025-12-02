// UI Tips Glossary
const uiTips = {
  "kit-header": {
    title: "UI Kit Header",
    what: "Title and quick links to kit sections.",
    why: "Orientation for designers and devs.",
    tips: [
      "Keep the kit scannable.",
      "Link to tokens and patterns."
    ]
  },
  "intro": {
    title: "What is a UI Kit?",
    what: "A reusable set of tokens and components.",
    why: "Creates consistency and speed.",
    tips: [
      "Document usage rules.",
      "Show examples with states."
    ]
  },
  "palette": {
    title: "Color Palette",
    what: "Brand and semantic colors as tokens.",
    why: "Stable tokens keep UI consistent.",
    tips: [
      "Name tokens by role (primary/success/warn).",
      "Check contrast ratios."
    ]
  },
  "swatch": {
    title: "Swatch",
    what: "A single color chip.",
    why: "Fast reference and copy.",
    tips: [
      "Show hex and token name.",
      "Support copy-to-clipboard."
    ]
  },
  "copy-token": {
    title: "Copy Token",
    what: "Button to copy the CSS variable.",
    why: "Saves time and avoids typos.",
    tips: [
      "Confirm with a small toast.",
      "Copy both var and hex if possible."
    ]
  },
  "type-scale": {
    title: "Typography Scale",
    what: "Headings, body, captions with sizes.",
    why: "Creates rhythm and hierarchy.",
    tips: [
      "Stick to a scale (e.g., 1.25).",
      "Use 60–80ch measure for body."
    ]
  },
  "measure": {
    title: "Measure / Line Length",
    what: "Optimal text width (~60–80 characters).",
    why: "Improves readability.",
    tips: [
      "Adjust with max-width.",
      "Increase line-height for long text."
    ]
  },
  "buttons": {
    title: "Buttons",
    what: "Primary, secondary, ghost in multiple sizes and states.",
    why: "Clear action hierarchy.",
    tips: [
      "Primary gets the highest contrast.",
      "Keep labels short verbs."
    ]
  },
  "button-variant": {
    title: "Button Variant",
    what: "One specific style specimen.",
    why: "Demonstrates hierarchy.",
    tips: [
      "Consistent corner radius.",
      "Accessible focus ring."
    ]
  },
  "button-state": {
    title: "Button States",
    what: "Hover, active, disabled, loading.",
    why: "Communicates system feedback.",
    tips: [
      "Show spinner for loading.",
      "Use aria-disabled when needed."
    ]
  },
  "inputs": {
    title: "Inputs",
    what: "Text, email, select, checkbox, radio with errors.",
    why: "Form UX drives completion.",
    tips: [
      "Pair labels with inputs.",
      "Inline error messages, not alerts."
    ]
  },
  "label-for": {
    title: "Label Association",
    what: "Using for/id to link label to input.",
    why: "Accessibility and larger click target.",
    tips: [
      "Always include a label.",
      "Placeholders are not labels."
    ]
  },
  "input-error": {
    title: "Input Error State",
    what: "Visual + text cue for invalid input.",
    why: "Guides users to fix issues.",
    tips: [
      "Explain briefly what to fix.",
      "Use aria-invalid on the field."
    ]
  },
  "cards": {
    title: "Cards",
    what: "Content, media, and metric cards.",
    why: "Scannable chunks of information.",
    tips: [
      "Consistent padding and titles.",
      "Don't overuse shadow depth."
    ]
  },
  "card-variant": {
    title: "Card Variant",
    what: "One card style specimen.",
    why: "Pattern consistency.",
    tips: [
      "Readable line length.",
      "Clear CTA if interactive."
    ]
  },
  "modals": {
    title: "Modals & Toasts",
    what: "Overlay dialogs and lightweight notifications.",
    why: "Communicate without page changes.",
    tips: [
      "Trap focus in modals.",
      "Use toasts for non-blocking info."
    ]
  },
  "modal-trigger": {
    title: "Modal Trigger",
    what: "Control that opens a modal.",
    why: "Entry point to a blocking message.",
    tips: [
      "Use clear labels.",
      "Close with ESC/X/backdrop."
    ]
  },
  "toast-trigger": {
    title: "Toast Trigger",
    what: "Control that fires a toast.",
    why: "Shows quick feedback.",
    tips: [
      "Auto-dismiss after 3–5s.",
      "Avoid stacking too many."
    ]
  },
  "icons": {
    title: "Icon Set",
    what: "Reusable SVG symbols.",
    why: "Visual shorthand; reduces text load.",
    tips: [
      "Pair with text for clarity.",
      "Maintain consistent stroke/size."
    ]
  },
  "icon": {
    title: "Icon Specimen",
    what: "One icon example.",
    why: "Demonstrates sizing and color usage.",
    tips: [
      "Use currentColor for tint.",
      "Provide <title> for a11y if standalone."
    ]
  },
  "layout-grid": {
    title: "Grid & Spacing",
    what: "12-col grid + 8px spacing scale examples.",
    why: "Consistent layouts across pages.",
    tips: [
      "Snap to grid columns.",
      "Use spacing tokens (4/8/12/16…)."
    ]
  },
  "spacing-scale": {
    title: "Spacing Scale",
    what: "Systemized gaps and paddings.",
    why: "Predictable rhythm.",
    tips: [
      "Don't invent new random sizes.",
      "Document edge cases."
    ]
  },
  "elevation": {
    title: "Elevation / Shadows",
    what: "Depth levels 0–3 with shadows and borders.",
    why: "Separates layers subtly.",
    tips: [
      "Prefer subtle shadows.",
      "Combine with hairline borders."
    ]
  },
  "elevation-level": {
    title: "Elevation Level",
    what: "One tile at a given depth.",
    why: "Shows visual differences clearly.",
    tips: [
      "Use higher depth sparingly.",
      "Keep hover shadows soft."
    ]
  },
  "footer": {
    title: "Footer",
    what: "Small end-of-page utilities.",
    why: "Legitimacy and quick links.",
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

