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
    setupLinkReordering();
    setupLinkPinning();
    setupHighlightPulse();
    setupSocialCopy();
    setupSmoothScroll();
    setupCurrentYear();
    setupScrollToTop();
    setupTipCardRepositioning();
  }

  // Link Reordering
  function setupLinkReordering() {
    const linkStack = document.querySelector('.link-stack');
    if (!linkStack) return;

    const moveUpButtons = document.querySelectorAll('.link-move-up');
    const moveDownButtons = document.querySelectorAll('.link-move-down');

    moveUpButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const linkItem = button.closest('.link-item');
        const prevItem = linkItem.previousElementSibling;
        
        if (prevItem && !prevItem.classList.contains('pinned')) {
          linkStack.insertBefore(linkItem, prevItem);
          // Visual feedback
          linkItem.style.transform = 'translateY(-4px)';
          setTimeout(() => {
            linkItem.style.transform = '';
          }, 200);
        }
      });
    });

    moveDownButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const linkItem = button.closest('.link-item');
        const nextItem = linkItem.nextElementSibling;
        
        if (nextItem) {
          linkStack.insertBefore(nextItem, linkItem);
          // Visual feedback
          linkItem.style.transform = 'translateY(4px)';
          setTimeout(() => {
            linkItem.style.transform = '';
          }, 200);
        }
      });
    });
  }

  // Link Pinning
  function setupLinkPinning() {
    const pinButtons = document.querySelectorAll('.link-pin');
    
    pinButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const linkItem = button.closest('.link-item');
        const isPinned = linkItem.classList.contains('pinned');
        
        // Unpin all other items first
        document.querySelectorAll('.link-item.pinned').forEach(item => {
          if (item !== linkItem) {
            item.classList.remove('pinned');
            const pinBtn = item.querySelector('.link-pin');
            if (pinBtn) {
              pinBtn.classList.remove('active');
            }
          }
        });
        
        // Toggle current item
        if (isPinned) {
          linkItem.classList.remove('pinned');
          button.classList.remove('active');
        } else {
          linkItem.classList.add('pinned');
          button.classList.add('active');
          
          // Move pinned item to top (after highlight)
          const linkStack = document.querySelector('.link-stack');
          if (linkStack && linkItem.parentElement === linkStack) {
            const firstNonPinned = Array.from(linkStack.children).find(
              child => child !== linkItem && !child.classList.contains('pinned')
            );
            if (firstNonPinned) {
              linkStack.insertBefore(linkItem, firstNonPinned);
            } else {
              linkStack.appendChild(linkItem);
            }
          }
        }
      });
    });
  }

  // Highlight CTA Pulse Animation
  function setupHighlightPulse() {
    const highlightCta = document.querySelector('.highlight-cta');
    if (!highlightCta) return;

    // Add pulse animation on page load
    highlightCta.classList.add('pulse');
    
    // Remove pulse after 5 seconds
    setTimeout(() => {
      highlightCta.classList.remove('pulse');
    }, 5000);

    // Toggle pulse on click
    highlightCta.addEventListener('click', () => {
      highlightCta.classList.toggle('pulse');
    });
  }

  // Social Copy to Clipboard
  function setupSocialCopy() {
    const socialIcons = document.querySelectorAll('.social-icon');
    
    socialIcons.forEach(icon => {
      icon.addEventListener('click', async (e) => {
        // Only copy if Ctrl/Cmd is held
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          const handle = icon.getAttribute('aria-label') || icon.getAttribute('data-handle') || '';
          
          if (handle) {
            try {
              await navigator.clipboard.writeText(handle);
              showToast(`Copied ${handle} to clipboard`);
            } catch (err) {
              console.error('Failed to copy:', err);
            }
          }
        }
      });
    });
  }

  // Toast Notification
  function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      bottom: 4rem;
      right: 2rem;
      background: var(--accent);
      color: white;
      padding: 0.75rem 1.5rem;
      border-radius: 999px;
      box-shadow: 0 4px 16px rgba(236, 72, 153, 0.4);
      z-index: 10000;
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.3s, transform 0.3s;
    `;
    
    document.body.appendChild(toast);
    
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    });
    
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(20px)';
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 2000);
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
          const header = document.querySelector('.top-nav');
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

  // Reposition tip cards on scroll/resize
  function setupTipCardRepositioning() {
    let scrollTimeout;
    let resizeTimeout;

    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        // Tip card repositioning is handled in tips.js
      }, 100);
    }, { passive: true });

    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        // Tip card repositioning is handled in tips.js
      }, 100);
    });
  }
})();

