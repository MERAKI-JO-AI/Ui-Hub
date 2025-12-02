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
    setupSearchFilter();
    setupPostFilter();
    setupReadingProgress();
    setupCodeCopy();
    setupSmoothScroll();
    setupCurrentYear();
    setupScrollToTop();
    setupTipCardRepositioning();
  }

  // Search & Filter
  function setupSearchFilter() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.querySelector('.search-btn');
    if (!searchInput) return;

    let searchTimeout;
    
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      const query = e.target.value.toLowerCase().trim();
      
      searchTimeout = setTimeout(() => {
        filterPosts(query);
      }, 300);
    });

    if (searchBtn) {
      searchBtn.addEventListener('click', () => {
        const query = searchInput.value.toLowerCase().trim();
        filterPosts(query);
      });
    }
  }

  // Post Filter by Tags
  function setupPostFilter() {
    const tagPills = document.querySelectorAll('.tag-pill[data-filter]');
    const postCards = document.querySelectorAll('.post-card[data-category]');
    
    if (tagPills.length === 0 || postCards.length === 0) return;

    tagPills.forEach(pill => {
      pill.addEventListener('click', () => {
        const filter = pill.getAttribute('data-filter');
        
        // Update active state
        tagPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        
        // Filter posts
        postCards.forEach(card => {
          const category = card.getAttribute('data-category');
          
          if (filter === 'all' || category === filter) {
            card.style.display = '';
            // Fade in animation
            card.style.opacity = '0';
            setTimeout(() => {
              card.style.transition = 'opacity 0.3s';
              card.style.opacity = '1';
            }, 10);
          } else {
            card.style.transition = 'opacity 0.3s';
            card.style.opacity = '0';
            setTimeout(() => {
              card.style.display = 'none';
            }, 300);
          }
        });
      });
    });
  }

  // Filter Posts by Search Query
  function filterPosts(query) {
    const postCards = document.querySelectorAll('.post-card[data-title]');
    
    postCards.forEach(card => {
      const title = card.getAttribute('data-title').toLowerCase();
      const excerpt = card.querySelector('.post-excerpt')?.textContent.toLowerCase() || '';
      
      if (query === '' || title.includes(query) || excerpt.includes(query)) {
        card.style.display = '';
        card.style.opacity = '0';
        setTimeout(() => {
          card.style.transition = 'opacity 0.3s';
          card.style.opacity = '1';
        }, 10);
      } else {
        card.style.transition = 'opacity 0.3s';
        card.style.opacity = '0';
        setTimeout(() => {
          card.style.display = 'none';
        }, 300);
      }
    });
  }

  // Reading Progress Bar
  function setupReadingProgress() {
    const progressBar = document.querySelector('.progress-bar');
    const progressFill = document.querySelector('.progress-fill');
    
    if (!progressBar || !progressFill) return;

    function updateProgress() {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const scrollableHeight = documentHeight - windowHeight;
      const progress = scrollableHeight > 0 ? (scrollTop / scrollableHeight) * 100 : 0;
      
      progressFill.style.width = `${Math.min(100, Math.max(0, progress))}%`;
    }

    // Initial update
    updateProgress();

    // Update on scroll
    window.addEventListener('scroll', updateProgress, { passive: true });
    
    // Update on resize
    window.addEventListener('resize', updateProgress);
  }

  // Code Copy Functionality
  function setupCodeCopy() {
    const copyButtons = document.querySelectorAll('.copy-code');
    
    copyButtons.forEach(button => {
      button.addEventListener('click', async (e) => {
        e.stopPropagation();
        const codeBlock = button.closest('.code-block');
        const code = codeBlock.querySelector('code')?.textContent || '';
        
        if (!code) return;

        try {
          await navigator.clipboard.writeText(code);
          
          // Visual feedback
          const originalText = button.textContent;
          button.textContent = 'Copied!';
          button.style.background = 'hsl(350, 84%, 63%)';
          
          // Reset after 2 seconds
          setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
          }, 2000);
        } catch (err) {
          console.error('Failed to copy:', err);
          // Fallback for older browsers
          const textArea = document.createElement('textarea');
          textArea.value = code;
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
          } catch (fallbackErr) {
            console.error('Fallback copy failed:', fallbackErr);
          }
          document.body.removeChild(textArea);
        }
      });
    });
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
          const header = document.querySelector('.site-header');
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
})();

