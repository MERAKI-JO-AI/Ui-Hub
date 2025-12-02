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
    setupFormValidation();
    setupFAQAccordion();
    setupCopyToClipboard();
    setupSmoothScroll();
    setupCurrentYear();
    setupTipCardRepositioning();
    setupScrollToTop();
  }

  // Form Validation
  function setupFormValidation() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const consentInput = document.getElementById('consent');
    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const messageError = document.getElementById('message-error');
    const consentError = document.getElementById('consent-error');

    // Real-time validation
    nameInput.addEventListener('blur', () => validateName());
    emailInput.addEventListener('blur', () => validateEmail());
    messageInput.addEventListener('blur', () => validateMessage());
    consentInput.addEventListener('change', () => validateConsent());

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const isNameValid = validateName();
      const isEmailValid = validateEmail();
      const isMessageValid = validateMessage();
      const isConsentValid = validateConsent();

      if (isNameValid && isEmailValid && isMessageValid && isConsentValid) {
        // Form is valid - you can submit here
        console.log('Form submitted:', {
          name: nameInput.value,
          email: emailInput.value,
          message: messageInput.value,
          consent: consentInput.checked
        });
        
        // Show success message (you can customize this)
        alert('Thank you! Your message has been sent. We\'ll get back to you within 24 hours.');
        form.reset();
        clearErrors();
      } else {
        // Focus first invalid field
        if (!isNameValid) {
          nameInput.focus();
        } else if (!isEmailValid) {
          emailInput.focus();
        } else if (!isMessageValid) {
          messageInput.focus();
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

    function validateMessage() {
      // Message is optional, so always valid
      clearError(messageInput, messageError);
      return true;
    }

    function validateConsent() {
      if (!consentInput.checked) {
        showError(consentInput, consentError, 'You must agree to the privacy policy and terms');
        return false;
      }
      clearError(consentInput, consentError);
      return true;
    }

    function showError(input, errorElement, message) {
      input.classList.add('error');
      if (errorElement) {
        errorElement.textContent = message;
        // Announce to screen readers
        errorElement.setAttribute('aria-live', 'polite');
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
      clearError(messageInput, messageError);
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

  // Copy to Clipboard
  function setupCopyToClipboard() {
    const copyButtons = document.querySelectorAll('.copy-btn');
    
    copyButtons.forEach(button => {
      button.addEventListener('click', async (e) => {
        e.preventDefault();
        const textToCopy = button.getAttribute('data-copy-target');
        
        if (!textToCopy) return;

        try {
          await navigator.clipboard.writeText(textToCopy);
          
          // Visual feedback
          const originalText = button.textContent;
          button.textContent = 'Copied!';
          button.classList.add('copied');
          
          // Announce to screen readers
          const announcement = document.getElementById('tip-live');
          if (announcement) {
            announcement.textContent = `Copied ${textToCopy} to clipboard`;
          }
          
          // Reset after 2 seconds
          setTimeout(() => {
            button.textContent = originalText;
            button.classList.remove('copied');
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
            button.classList.add('copied');
            setTimeout(() => {
              button.textContent = 'Copy';
              button.classList.remove('copied');
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

