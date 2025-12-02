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
    setupSmoothScroll();
    setupAgendaExpand();
    setupSpeakerFilter();
    setupRegistrationValidation();
    setupFAQAccordion();
    setupCurrentYear();
    setupTipCardRepositioning();
    setupScrollToTop();
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

  // Agenda: expand/collapse long descriptions
  function setupAgendaExpand() {
    const agendaItems = document.querySelectorAll('.agenda-item');
    
    agendaItems.forEach(item => {
      const description = item.querySelector('.agenda-description');
      if (!description) return;

      // Check if description is long enough to need expand/collapse
      const originalHeight = description.scrollHeight;
      const maxHeight = 60; // Approx 2 lines

      if (originalHeight > maxHeight) {
        // Add expand/collapse functionality
        description.style.maxHeight = maxHeight + 'px';
        description.style.overflow = 'hidden';
        description.style.transition = 'max-height 0.3s ease-out';
        
        // Add click handler to toggle
        item.style.cursor = 'pointer';
        item.addEventListener('click', (e) => {
          // Don't trigger if clicking on a link/button
          if (e.target.closest('a, button')) return;
          
          const isExpanded = description.style.maxHeight === originalHeight + 'px' || 
                           description.style.maxHeight === 'none';
          
          if (isExpanded) {
            description.style.maxHeight = maxHeight + 'px';
            item.setAttribute('aria-expanded', 'false');
          } else {
            description.style.maxHeight = originalHeight + 'px';
            item.setAttribute('aria-expanded', 'true');
          }
        });

        // Make keyboard accessible
        item.setAttribute('tabindex', '0');
        item.setAttribute('role', 'button');
        item.setAttribute('aria-expanded', 'false');
        
        item.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            item.click();
          }
        });
      }
    });
  }

  // Speakers: basic filter by tag (optional - simple grid for now)
  function setupSpeakerFilter() {
    const speakerCards = document.querySelectorAll('.speaker-card');
    
    // Add focus ring on keyboard navigation
    speakerCards.forEach(card => {
      card.addEventListener('focus', () => {
        card.style.outline = '2px solid var(--accent)';
        card.style.outlineOffset = '4px';
      });
      
      card.addEventListener('blur', () => {
        card.style.outline = '';
        card.style.outlineOffset = '';
      });
    });
  }

  // Registration: client-side validation
  function setupRegistrationValidation() {
    const form = document.getElementById('reg-form');
    if (!form) return;

    const nameInput = document.getElementById('reg-name');
    const emailInput = document.getElementById('reg-email');
    const ticketSelect = document.getElementById('ticket-type');
    const consentInput = document.getElementById('reg-consent');
    const nameError = document.getElementById('reg-name-error');
    const emailError = document.getElementById('reg-email-error');
    const ticketError = document.getElementById('ticket-error');
    const consentError = document.getElementById('consent-error');

    // Real-time validation
    nameInput.addEventListener('blur', () => validateName());
    emailInput.addEventListener('blur', () => validateEmail());
    ticketSelect.addEventListener('change', () => validateTicket());
    consentInput.addEventListener('change', () => validateConsent());

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const isNameValid = validateName();
      const isEmailValid = validateEmail();
      const isTicketValid = validateTicket();
      const isConsentValid = validateConsent();

      if (isNameValid && isEmailValid && isTicketValid && isConsentValid) {
        // Form is valid - you can submit here
        console.log('Form submitted:', {
          name: nameInput.value,
          email: emailInput.value,
          ticket: ticketSelect.value,
          consent: consentInput.checked
        });
        
        // Show success message (you can customize this)
        alert('Thank you! Your registration has been received. We\'ll send you a confirmation email shortly.');
        form.reset();
        clearErrors();
      } else {
        // Focus first invalid field
        if (!isNameValid) {
          nameInput.focus();
        } else if (!isEmailValid) {
          emailInput.focus();
        } else if (!isTicketValid) {
          ticketSelect.focus();
        } else if (!isConsentValid) {
          consentInput.focus();
        }
      }
    });

    function validateName() {
      const value = nameInput.value.trim();
      if (value === '') {
        showError(nameInput, nameError, 'Name is required');
        return false;
      }
      if (value.length < 2) {
        showError(nameInput, nameError, 'Name must be at least 2 characters');
        return false;
      }
      clearError(nameInput, nameError);
      return true;
    }

    function validateEmail() {
      const value = emailInput.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      if (value === '') {
        showError(emailInput, emailError, 'Email is required');
        return false;
      }
      if (!emailRegex.test(value)) {
        showError(emailInput, emailError, 'Please enter a valid email address');
        return false;
      }
      clearError(emailInput, emailError);
      return true;
    }

    function validateTicket() {
      const value = ticketSelect.value;
      if (value === '') {
        showError(ticketSelect, ticketError, 'Please select a ticket type');
        return false;
      }
      clearError(ticketSelect, ticketError);
      return true;
    }

    function validateConsent() {
      if (!consentInput.checked) {
        showError(consentInput, consentError, 'You must agree to the terms and conditions');
        return false;
      }
      clearError(consentInput, consentError);
      return true;
    }

    function showError(input, errorElement, message) {
      input.classList.add('error');
      if (errorElement) {
        errorElement.textContent = message;
      }
    }

    function clearError(input, errorElement) {
      input.classList.remove('error');
      if (errorElement) {
        errorElement.textContent = '';
      }
    }

    function clearErrors() {
      clearError(nameInput, nameError);
      clearError(emailInput, emailError);
      clearError(ticketSelect, ticketError);
      clearError(consentInput, consentError);
    }
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

      // Keyboard support: Enter/Space toggles
      question.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          question.click();
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

