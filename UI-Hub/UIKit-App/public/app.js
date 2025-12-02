// Page Interactions
(function() {
  'use strict';

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    setupCopyToken();
    setupButtonStates();
    setupInputValidation();
    setupModalDemo();
    setupToastDemo();
    setupSmoothScroll();
    setupCurrentYear();
    setupTipCardRepositioning();
    setupScrollToTop();
  }

  // Copy Token Functionality
  function setupCopyToken() {
    const copyButtons = document.querySelectorAll('.copy-token');
    
    copyButtons.forEach(button => {
      button.addEventListener('click', async (e) => {
        e.stopPropagation(); // Prevent modal from opening
        const textToCopy = button.getAttribute('data-copy');
        
        if (!textToCopy) return;

        try {
          await navigator.clipboard.writeText(textToCopy);
          
          // Visual feedback
          const originalText = button.textContent;
          button.textContent = 'Copied!';
          button.style.background = 'var(--accent)';
          
          // Show toast
          showToast(`Copied ${textToCopy} to clipboard`);
          
          // Reset after 2 seconds
          setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
          }, 2000);
        } catch (err) {
          console.error('Failed to copy:', err);
          // Fallback for older browsers
          const textArea = document.createElement('textarea');
          textArea.value = textToCopy;
          textArea.style.position = 'fixed';
          textArea.style.opacity = '0';
          document.body.appendChild(textArea);
          textArea.select();
          try {
            document.execCommand('copy');
            button.textContent = 'Copied!';
            showToast(`Copied ${textToCopy} to clipboard`);
            setTimeout(() => {
              button.textContent = 'Copy';
            }, 2000);
          } catch (fallbackErr) {
            console.error('Fallback copy failed:', fallbackErr);
          }
          document.body.removeChild(textArea);
        }
      });
    });
  }

  // Button States Demo
  function setupButtonStates() {
    const hoverDemo = document.getElementById('hover-demo');
    const activeDemo = document.getElementById('active-demo');
    const loadingDemo = document.getElementById('loading-demo');
    
    if (hoverDemo) {
      hoverDemo.addEventListener('mouseenter', () => {
        hoverDemo.style.transform = 'translateY(-2px)';
        hoverDemo.style.boxShadow = '0 6px 20px rgba(129, 140, 248, 0.4)';
      });
      hoverDemo.addEventListener('mouseleave', () => {
        hoverDemo.style.transform = '';
        hoverDemo.style.boxShadow = '';
      });
    }
    
    if (activeDemo) {
      activeDemo.addEventListener('mousedown', () => {
        activeDemo.style.transform = 'translateY(0)';
      });
      activeDemo.addEventListener('mouseup', () => {
        activeDemo.style.transform = 'translateY(-2px)';
      });
    }
    
    if (loadingDemo) {
      let isLoading = false;
      loadingDemo.addEventListener('click', () => {
        if (!isLoading) {
          isLoading = true;
          loadingDemo.classList.add('loading');
          loadingDemo.disabled = true;
          
          setTimeout(() => {
            isLoading = false;
            loadingDemo.classList.remove('loading');
            loadingDemo.disabled = false;
          }, 3000);
        }
      });
    }
  }

  // Input Validation Demo
  function setupInputValidation() {
    const toggleErrorBtn = document.getElementById('toggle-error');
    const errorInput = document.getElementById('demo-error');
    const errorMsg = document.getElementById('error-msg');
    
    if (toggleErrorBtn && errorInput && errorMsg) {
      let hasError = true;
      
      toggleErrorBtn.addEventListener('click', () => {
        hasError = !hasError;
        
        if (hasError) {
          errorInput.classList.add('error');
          errorInput.setAttribute('aria-invalid', 'true');
          errorMsg.textContent = 'This field is required';
        } else {
          errorInput.classList.remove('error');
          errorInput.setAttribute('aria-invalid', 'false');
          errorMsg.textContent = '';
        }
      });
    }
  }

  // Modal Demo
  function setupModalDemo() {
    const openModalBtn = document.getElementById('open-modal');
    const closeModalBtn = document.getElementById('close-demo-modal');
    const demoModal = document.getElementById('demo-modal');
    const modalBackdrop = demoModal?.querySelector('.modal-backdrop');
    const modalClose = demoModal?.querySelector('.modal-close');
    
    if (openModalBtn && demoModal) {
      openModalBtn.addEventListener('click', () => {
        demoModal.setAttribute('aria-hidden', 'false');
        // Focus trap
        trapFocusDemo(demoModal);
        // Focus close button
        if (modalClose) {
          modalClose.focus();
        }
      });
    }
    
    if (closeModalBtn) {
      closeModalBtn.addEventListener('click', () => {
        closeDemoModal();
      });
    }
    
    if (modalClose) {
      modalClose.addEventListener('click', () => {
        closeDemoModal();
      });
    }
    
    if (modalBackdrop) {
      modalBackdrop.addEventListener('click', (e) => {
        if (e.target === modalBackdrop) {
          closeDemoModal();
        }
      });
    }
    
    // ESC key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && demoModal.getAttribute('aria-hidden') === 'false') {
        closeDemoModal();
      }
    });
    
    function closeDemoModal() {
      demoModal.setAttribute('aria-hidden', 'true');
      releaseFocusDemo();
      if (openModalBtn) {
        openModalBtn.focus();
      }
    }
    
    function trapFocusDemo(container) {
      const focusableElements = container.querySelectorAll(
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      
      container._focusTrapHandler = function handleTabKey(e) {
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
      
      container.addEventListener('keydown', container._focusTrapHandler);
    }
    
    function releaseFocusDemo() {
      const demoModal = document.getElementById('demo-modal');
      if (demoModal && demoModal._focusTrapHandler) {
        demoModal.removeEventListener('keydown', demoModal._focusTrapHandler);
        demoModal._focusTrapHandler = null;
      }
    }
  }

  // Toast Demo
  function setupToastDemo() {
    const showToastBtn = document.getElementById('show-toast');
    
    if (showToastBtn) {
      showToastBtn.addEventListener('click', () => {
        showToast('This is a demo toast notification!');
      });
    }
  }

  // Show Toast Function
  function showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.setAttribute('role', 'alert');
    
    container.appendChild(toast);
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      toast.style.animation = 'slideOut 0.3s ease-out';
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, 5000);
  }

  // Smooth Scroll for in-page links
  function setupSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        
        // Skip if it's just "#"
        if (href === '#' || href === '') return;

        const target = document.querySelector(href);
        
        if (target) {
          e.preventDefault();
          
          // Calculate offset for sticky header
          const header = document.querySelector('.kit-header');
          const headerHeight = header ? header.offsetHeight : 0;
          const targetPosition = target.offsetTop - headerHeight;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });

          // Update URL without jumping
          if (history.pushState) {
            history.pushState(null, null, href);
          }
        }
      });
    });
  }

  // Current Year in Footer
  function setupCurrentYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear();
    }
  }

  // Reposition tip cards on scroll/resize
  function setupTipCardRepositioning() {
    let scrollTimeout;
    let resizeTimeout;

    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        // Tip card repositioning is handled in tips.js
        // This is just a placeholder for any additional scroll handling
      }, 100);
    }, { passive: true });

    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        // Tip card repositioning is handled in tips.js
        // This is just a placeholder for any additional resize handling
      }, 100);
    });
  }

  // Scroll to Top Button
  function setupScrollToTop() {
    const scrollButton = document.getElementById('scroll-to-top');
    if (!scrollButton) return;

    // Show/hide button based on scroll position
    function toggleScrollButton() {
      if (window.scrollY > 300) {
        scrollButton.setAttribute('aria-hidden', 'false');
      } else {
        scrollButton.setAttribute('aria-hidden', 'true');
      }
    }

    // Initial check
    toggleScrollButton();

    // Listen for scroll events
    window.addEventListener('scroll', toggleScrollButton, { passive: true });

    // Scroll to top on click
    scrollButton.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
})();

