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
    setupTOCHighlighting();
    setupSmoothScroll();
    setupAnchorLinks();
    setupFeatureTabs();
    setupFAQ();
    setupCodeCopy();
    setupBackToTop();
    setupThemeToggle();
    setupCurrentYear();
    setupTipCardRepositioning();
  }

  // TOC Highlighting (IntersectionObserver)
  function setupTOCHighlighting() {
    const tocItems = document.querySelectorAll('.toc-item');
    const sections = document.querySelectorAll('.section');
    
    if (tocItems.length === 0 || sections.length === 0) return;

    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          // Remove active class from all TOC items
          tocItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${id}`) {
              item.classList.add('active');
            }
          });
        }
      });
    }, observerOptions);

    // Observe all sections
    sections.forEach(section => {
      observer.observe(section);
    });
  }

  // Smooth Scroll for TOC anchors
  function setupSmoothScroll() {
    const tocLinks = document.querySelectorAll('.toc-item, .mini-toc a');
    
    tocLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        
        // Skip if it's just "#"
        if (!href || href === '#' || href === '') return;

        const target = document.querySelector(href);
        
        if (target) {
          e.preventDefault();
          
          // Calculate offset for sticky header
          const topbar = document.querySelector('.topbar');
          const topbarHeight = topbar ? topbar.offsetHeight : 0;
          const targetPosition = target.offsetTop - topbarHeight - 20;

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

  // Anchor Links (¶) - Copy section URL
  function setupAnchorLinks() {
    const anchorLinks = document.querySelectorAll('.anchor-link');
    
    anchorLinks.forEach(link => {
      link.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const href = link.getAttribute('href');
        if (!href || href === '#') return;

        const url = window.location.origin + window.location.pathname + href;
        
        try {
          await navigator.clipboard.writeText(url);
          showToast('Link copied to clipboard');
        } catch (err) {
          console.error('Failed to copy:', err);
          // Fallback for older browsers
          const textArea = document.createElement('textarea');
          textArea.value = url;
          textArea.style.position = 'fixed';
          textArea.style.opacity = '0';
          document.body.appendChild(textArea);
          textArea.select();
          try {
            document.execCommand('copy');
            showToast('Link copied to clipboard');
          } catch (err2) {
            console.error('Fallback copy failed:', err2);
          }
          document.body.removeChild(textArea);
        }
      });
    });
  }

  // Feature Tabs
  function setupFeatureTabs() {
    const featureTabs = document.querySelectorAll('.feature-tab');
    const featurePanels = document.querySelectorAll('.feature-panel');
    
    if (featureTabs.length === 0) return;

    featureTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const tabName = tab.getAttribute('data-tab');
        
        // Remove active class from all tabs
        featureTabs.forEach(t => t.classList.remove('active'));
        // Add active class to clicked tab
        tab.classList.add('active');
        
        // Hide all panels
        featurePanels.forEach(panel => {
          panel.classList.remove('active');
        });
        
        // Show selected panel
        const selectedPanel = document.querySelector(`[data-panel="${tabName}"]`);
        if (selectedPanel) {
          selectedPanel.classList.add('active');
        }
      });
    });
  }

  // FAQ Accordion
  function setupFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
      question.addEventListener('click', () => {
        const faqItem = question.closest('.faq-item');
        const isExpanded = faqItem.getAttribute('aria-expanded') === 'true';
        
        // Close all other FAQ items (optional - can allow multiple open)
        // document.querySelectorAll('.faq-item').forEach(item => {
        //   if (item !== faqItem) {
        //     item.setAttribute('aria-expanded', 'false');
        //   }
        // });
        
        // Toggle current item
        faqItem.setAttribute('aria-expanded', !isExpanded);
      });

      // Keyboard support
      question.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          question.click();
        }
      });
    });
  }

  // Code Block Copy
  function setupCodeCopy() {
    const codeCopyButtons = document.querySelectorAll('.code-copy');
    
    codeCopyButtons.forEach(button => {
      button.addEventListener('click', async () => {
        const codeBlock = button.closest('.code-block');
        const code = codeBlock.querySelector('code');
        
        if (!code) return;

        const text = code.textContent || code.innerText;
        
        try {
          await navigator.clipboard.writeText(text);
          button.textContent = 'Copied!';
          button.style.background = 'var(--accent)';
          button.style.color = 'white';
          
          setTimeout(() => {
            button.textContent = 'Copy';
            button.style.background = '';
            button.style.color = '';
          }, 2000);
        } catch (err) {
          console.error('Failed to copy:', err);
          // Fallback
          const textArea = document.createElement('textarea');
          textArea.value = text;
          textArea.style.position = 'fixed';
          textArea.style.opacity = '0';
          document.body.appendChild(textArea);
          textArea.select();
          try {
            document.execCommand('copy');
            button.textContent = 'Copied!';
            setTimeout(() => {
              button.textContent = 'Copy';
            }, 2000);
          } catch (err2) {
            console.error('Fallback copy failed:', err2);
          }
          document.body.removeChild(textArea);
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
      border-radius: 8px;
      box-shadow: 0 4px 16px rgba(6, 182, 212, 0.4);
      z-index: 10000;
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.3s, transform 0.3s;
      font-size: 0.875rem;
      font-weight: 500;
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
        if (document.body.contains(toast)) {
          document.body.removeChild(toast);
        }
      }, 300);
    }, 2000);
  }

  // Back to Top Button
  function setupBackToTop() {
    const backToTopBtn = document.getElementById('scroll-to-top');
    if (!backToTopBtn) return;

    // Show/hide button based on scroll position
    function toggleBackToTop() {
      if (window.scrollY > 300) {
        backToTopBtn.setAttribute('aria-hidden', 'false');
      } else {
        backToTopBtn.setAttribute('aria-hidden', 'true');
      }
    }

    // Initial check
    toggleBackToTop();

    // Listen for scroll events
    window.addEventListener('scroll', toggleBackToTop, { passive: true });

    // Scroll to top on click
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // Theme Toggle (Mock)
  function setupThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    if (!themeToggle) return;

    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
    }

    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      
      showToast(`Switched to ${newTheme} theme`);
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

