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
    setupGallery();
    setupSpecsTable();
    setupComparison();
    setupStarRatings();
    setupFAQAccordion();
    setupSmoothScroll();
    setupCurrentYear();
    setupTipCardRepositioning();
    setupScrollToTop();
  }

  // Gallery: thumbnail click updates main image
  function setupGallery() {
    const thumbs = document.querySelectorAll('.thumb');
    const mainImage = document.getElementById('main-image');
    
    if (!thumbs.length || !mainImage) return;

    thumbs.forEach(thumb => {
      thumb.addEventListener('click', () => {
        const imageSrc = thumb.getAttribute('data-image');
        if (imageSrc) {
          // Update main image
          mainImage.src = imageSrc;
          mainImage.alt = thumb.querySelector('img').alt;
          
          // Update active state
          thumbs.forEach(t => t.classList.remove('active'));
          thumb.classList.add('active');
        }
      });
    });
  }

  // Specs table: make horizontally scrollable on small screens
  function setupSpecsTable() {
    const specsWrapper = document.querySelector('.specs-wrapper');
    if (!specsWrapper) return;

    // Add scroll indicator on mobile
    const checkScroll = () => {
      if (specsWrapper.scrollWidth > specsWrapper.clientWidth) {
        specsWrapper.style.background = 'linear-gradient(to right, transparent 0%, rgba(168, 85, 247, 0.1) 100%)';
      }
    };

    window.addEventListener('resize', checkScroll);
    checkScroll();
  }

  // Comparison: highlight "best choice" cells
  function setupComparison() {
    const comparisonTable = document.querySelector('.comparison-table');
    if (!comparisonTable) return;

    // Find the "Pro" column (index 2) and highlight it
    const rows = comparisonTable.querySelectorAll('tbody tr');
    rows.forEach(row => {
      const cells = row.querySelectorAll('td');
      if (cells.length >= 2) {
        // Highlight the Pro column (second cell)
        cells[1].style.color = 'var(--accent)';
        cells[1].style.fontWeight = '600';
      }
    });
  }

  // Star ratings: render visually from data attribute
  function setupStarRatings() {
    const starRatings = document.querySelectorAll('[data-rating]');
    
    starRatings.forEach(ratingEl => {
      const rating = parseFloat(ratingEl.getAttribute('data-rating'));
      if (isNaN(rating)) return;

      // For star-rating element (main rating)
      if (ratingEl.classList.contains('star-rating')) {
        const starsEl = ratingEl.querySelector('.stars');
        if (starsEl) {
          starsEl.textContent = renderStars(rating);
        }
      }
      
      // For review-stars elements
      if (ratingEl.classList.contains('review-stars')) {
        ratingEl.textContent = renderStars(rating);
      }
    });
  }

  function renderStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let stars = '★'.repeat(fullStars);
    if (hasHalfStar) {
      stars += '☆';
    }
    stars += '☆'.repeat(emptyStars);
    
    return stars;
  }

  // FAQ Accordion
  function setupFAQAccordion() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
      question.addEventListener('click', () => {
        const isExpanded = question.getAttribute('aria-expanded') === 'true';
        const faqItem = question.closest('.faq-item');
        const answer = faqItem.querySelector('.faq-answer');
        
        // Close all other FAQs (optional - can be removed if multiple should be open)
        faqQuestions.forEach(q => {
          if (q !== question) {
            q.setAttribute('aria-expanded', 'false');
            const otherItem = q.closest('.faq-item');
            const otherAnswer = otherItem.querySelector('.faq-answer');
            if (otherAnswer) {
              otherAnswer.style.maxHeight = '0';
            }
          }
        });
        
        // Toggle current FAQ
        if (isExpanded) {
          question.setAttribute('aria-expanded', 'false');
          answer.style.maxHeight = '0';
        } else {
          question.setAttribute('aria-expanded', 'true');
          // Set max-height to a large value to allow expansion
          answer.style.maxHeight = answer.scrollHeight + 'px';
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

