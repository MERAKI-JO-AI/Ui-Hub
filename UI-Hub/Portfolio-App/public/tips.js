// UI Tips Glossary
const uiTips = {
  "nav": {
    title: "Site Navigation",
    what: "Top-level links that help users move across key sections.",
    why: "Good nav provides orientation and reduces cognitive load.",
    tips: [
      "Keep link count small and clear.",
      "Use in-page anchors with smooth scrolling.",
      "Ensure visible focus states."
    ]
  },
  "hero": {
    title: "Hero Section",
    what: "The very first impression: headline, subheadline, and main action.",
    why: "Determines if users scroll or bounce.",
    tips: [
      "One sharp value headline, 6–12 words.",
      "Primary CTA visible without scrolling.",
      "Strong contrast and simple visuals."
    ]
  },
  "primary-cta": {
    title: "Primary CTA",
    what: "The main action you want the user to take.",
    why: "Clear CTAs increase conversions.",
    tips: [
      "Use a verb and an outcome (e.g., 'See Projects').",
      "Distinct style vs. secondary actions.",
      "Large click/tap area."
    ]
  },
  "about": {
    title: "About Section",
    what: "Brief introduction and positioning.",
    why: "Builds trust and context.",
    tips: [
      "Lead with outcomes, not biography.",
      "Include a small photo for human connection."
    ]
  },
  "avatar": {
    title: "Profile Image",
    what: "A visual identity cue.",
    why: "Faces build trust quickly.",
    tips: [
      "Clear, well-lit image.",
      "Consistent with your brand tone."
    ]
  },
  "bio": {
    title: "Short Bio",
    what: "One–two sentences that define what you do and for whom.",
    why: "Sets scope and relevance.",
    tips: [
      "Avoid buzzwords; be specific.",
      "Mention tech/tools only if essential."
    ]
  },
  "projects": {
    title: "Projects Section",
    what: "Showcases what you've built.",
    why: "Evidence beats claims.",
    tips: [
      "Consistent card layout and spacing.",
      "Each card: title, short description, actions."
    ]
  },
  "filters": {
    title: "Project Filters",
    what: "Quickly toggle visible projects.",
    why: "Improves findability when you have many items.",
    tips: [
      "Keep options few and mutually exclusive.",
      "Show active state clearly."
    ]
  },
  "project-card": {
    title: "Project Card",
    what: "A compact summary for a single project.",
    why: "Lets users scan quickly.",
    tips: [
      "Use concise titles and 1–2 line descriptions.",
      "Group actions (Live / Code / Case Study)."
    ]
  },
  "card-cta": {
    title: "Card Actions",
    what: "Links to live demo or repository.",
    why: "Direct path to evaluate your work.",
    tips: [
      "Label actions clearly.",
      "Limit to the essentials."
    ]
  },
  "skills": {
    title: "Skills Section",
    what: "Your current competencies.",
    why: "Helps match you to roles.",
    tips: [
      "Group into Frontend / Backend / Tools.",
      "Prioritize what you can ship today."
    ]
  },
  "skills-frontend": {
    title: "Frontend Skills",
    what: "UI, interaction, and browser-side tech.",
    why: "Defines your ability to ship interfaces.",
    tips: [
      "Keep the list curated.",
      "Prefer depth over breadth."
    ]
  },
  "skills-backend": {
    title: "Backend Skills",
    what: "APIs, DBs, and server logic.",
    why: "Enables full product delivery.",
    tips: [
      "Mention frameworks AND DBs.",
      "Stability and security matter."
    ]
  },
  "skills-tools": {
    title: "Tools",
    what: "Dev and collaboration stack.",
    why: "Speeds up delivery and teamwork.",
    tips: [
      "Include deployment tools (Vercel/Render).",
      "Keep versions reasonably current."
    ]
  },
  "testimonials": {
    title: "Testimonials",
    what: "Short quotes from collaborators/clients.",
    why: "Social proof reduces risk.",
    tips: [
      "Use real names and roles.",
      "Keep each quote to 1–2 sentences."
    ]
  },
  "quote": {
    title: "Quote Block",
    what: "A single testimonial.",
    why: "Humanizes your work.",
    tips: [
      "Avoid fluff.",
      "Cite the person with a role."
    ]
  },
  "contact-cta": {
    title: "Contact Call-To-Action",
    what: "Make it easy to reach you.",
    why: "Where interest becomes action.",
    tips: [
      "One primary path (email or form).",
      "Clarify typical response time."
    ]
  },
  "contact-button": {
    title: "Contact Button",
    what: "The actual action control.",
    why: "Bigger target → better clicks.",
    tips: [
      "Use an outcome-focused label.",
      "Ensure good focus/hover states."
    ]
  },
  "footer": {
    title: "Footer",
    what: "Secondary links and socials.",
    why: "Users look here for details.",
    tips: [
      "Keep it minimal and accessible.",
      "Provide clear icon labels."
    ]
  },
  "social-row": {
    title: "Social Links",
    what: "Outbound links to your profiles.",
    why: "Increases credibility and reach.",
    tips: [
      "Link only what you actively maintain.",
      "Use accessible names and titles."
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

