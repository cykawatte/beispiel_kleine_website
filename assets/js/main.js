/**
 * MUSTERBETRIEB - Main JavaScript
 * Mobile-first interactions and animations
 */

(function() {
  'use strict';

  // ========================================
  // DOM Elements
  // ========================================
  const header = document.querySelector('.header');
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');
  const navLinks = document.querySelectorAll('.nav__link');
  const animatedElements = document.querySelectorAll('.animate');
  const contactForm = document.getElementById('contact-form');

  // ========================================
  // Check for reduced motion preference
  // ========================================
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ========================================
  // Mobile Navigation
  // ========================================
  function initMobileNav() {
    if (!navToggle || !nav) return;

    navToggle.addEventListener('click', toggleNav);

    // Close nav when clicking a link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (nav.classList.contains('nav--open')) {
          closeNav();
        }
      });
    });

    // Close nav on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('nav--open')) {
        closeNav();
      }
    });

    // Close nav when clicking outside
    document.addEventListener('click', (e) => {
      if (nav.classList.contains('nav--open') &&
          !nav.contains(e.target) &&
          !navToggle.contains(e.target)) {
        closeNav();
      }
    });
  }

  function toggleNav() {
    const isOpen = nav.classList.toggle('nav--open');
    navToggle.classList.toggle('nav-toggle--active', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen);

    // Prevent body scroll when nav is open
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  function closeNav() {
    nav.classList.remove('nav--open');
    navToggle.classList.remove('nav-toggle--active');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  // ========================================
  // Header Scroll Effect
  // ========================================
  function initHeaderScroll() {
    if (!header) return;

    let lastScrollY = window.scrollY;
    let ticking = false;

    function updateHeader() {
      const scrollY = window.scrollY;

      if (scrollY > 50) {
        header.classList.add('header--scrolled');
      } else {
        header.classList.remove('header--scrolled');
      }

      lastScrollY = scrollY;
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(updateHeader);
        ticking = true;
      }
    }, { passive: true });
  }

  // ========================================
  // Scroll Animations (IntersectionObserver)
  // ========================================
  function initScrollAnimations() {
    if (prefersReducedMotion || animatedElements.length === 0) {
      // If reduced motion is preferred, make all elements visible
      animatedElements.forEach(el => {
        el.classList.add('animate--visible');
      });
      return;
    }

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate--visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    animatedElements.forEach(el => {
      observer.observe(el);
    });
  }

  // ========================================
  // Active Navigation State
  // ========================================
  function initActiveNavState() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    navLinks.forEach(link => {
      const href = link.getAttribute('href');

      if (href === currentPage ||
          (currentPage === '' && href === 'index.html') ||
          (currentPage === '/' && href === 'index.html')) {
        link.classList.add('nav__link--active');
      } else {
        link.classList.remove('nav__link--active');
      }
    });
  }

  // ========================================
  // Contact Form Validation & Submission
  // ========================================
  function initContactForm() {
    if (!contactForm) return;

    const formInputs = contactForm.querySelectorAll('.form-input, .form-textarea');
    const submitButton = contactForm.querySelector('button[type="submit"]');

    // Real-time validation on blur
    formInputs.forEach(input => {
      input.addEventListener('blur', () => {
        validateField(input);
      });

      input.addEventListener('input', () => {
        // Remove error state on input
        if (input.classList.contains('form-input--error') ||
            input.classList.contains('form-textarea--error')) {
          clearFieldError(input);
        }
      });
    });

    // Form submission
    contactForm.addEventListener('submit', handleFormSubmit);
  }

  function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';

    // Required field check
    if (field.hasAttribute('required') && !value) {
      isValid = false;
      errorMessage = 'Dieses Feld ist erforderlich.';
    }
    // Email validation
    else if (fieldName === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        errorMessage = 'Bitte geben Sie eine gültige E-Mail-Adresse ein.';
      }
    }
    // Phone validation (optional, basic format)
    else if (fieldName === 'phone' && value) {
      const phoneRegex = /^[\d\s\-\+\(\)]{6,}$/;
      if (!phoneRegex.test(value)) {
        isValid = false;
        errorMessage = 'Bitte geben Sie eine gültige Telefonnummer ein.';
      }
    }
    // Message min length
    else if (fieldName === 'message' && value && value.length < 10) {
      isValid = false;
      errorMessage = 'Ihre Nachricht sollte mindestens 10 Zeichen enthalten.';
    }

    if (!isValid) {
      showFieldError(field, errorMessage);
    } else {
      clearFieldError(field);
    }

    return isValid;
  }

  function showFieldError(field, message) {
    const formGroup = field.closest('.form-group');
    const isTextarea = field.tagName === 'TEXTAREA';

    field.classList.add(isTextarea ? 'form-textarea--error' : 'form-input--error');

    // Remove existing error message
    const existingError = formGroup.querySelector('.form-error');
    if (existingError) {
      existingError.remove();
    }

    // Add new error message
    const errorEl = document.createElement('span');
    errorEl.className = 'form-error';
    errorEl.textContent = message;
    formGroup.appendChild(errorEl);
  }

  function clearFieldError(field) {
    const formGroup = field.closest('.form-group');
    const isTextarea = field.tagName === 'TEXTAREA';

    field.classList.remove(isTextarea ? 'form-textarea--error' : 'form-input--error');

    const existingError = formGroup.querySelector('.form-error');
    if (existingError) {
      existingError.remove();
    }
  }

  function handleFormSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const formInputs = form.querySelectorAll('.form-input, .form-textarea');
    const consentCheckbox = form.querySelector('input[name="consent"]');
    const submitButton = form.querySelector('button[type="submit"]');
    let isFormValid = true;

    // Validate all fields
    formInputs.forEach(input => {
      if (!validateField(input)) {
        isFormValid = false;
      }
    });

    // Validate consent checkbox
    if (consentCheckbox && !consentCheckbox.checked) {
      isFormValid = false;
      const checkboxGroup = consentCheckbox.closest('.form-checkbox');

      // Show error for checkbox
      let existingError = checkboxGroup.parentElement.querySelector('.form-error');
      if (!existingError) {
        const errorEl = document.createElement('span');
        errorEl.className = 'form-error';
        errorEl.textContent = 'Bitte stimmen Sie der Datenschutzerklärung zu.';
        checkboxGroup.parentElement.appendChild(errorEl);
      }
    } else if (consentCheckbox) {
      const checkboxGroup = consentCheckbox.closest('.form-checkbox');
      const existingError = checkboxGroup.parentElement.querySelector('.form-error');
      if (existingError) {
        existingError.remove();
      }
    }

    if (!isFormValid) {
      // Focus first invalid field
      const firstInvalid = form.querySelector('.form-input--error, .form-textarea--error');
      if (firstInvalid) {
        firstInvalid.focus();
      }
      return;
    }

    // Simulate form submission
    submitButton.disabled = true;
    submitButton.innerHTML = 'Wird gesendet...';

    // Simulate API call
    setTimeout(() => {
      // Show success message
      const successMessage = document.createElement('div');
      successMessage.className = 'form-success';
      successMessage.innerHTML = `
        <strong>Vielen Dank für Ihre Nachricht!</strong><br>
        Wir werden uns schnellstmöglich bei Ihnen melden.
      `;

      form.innerHTML = '';
      form.appendChild(successMessage);

      // Scroll to success message
      successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 1500);
  }

  // ========================================
  // Smooth Scroll for Anchor Links
  // ========================================
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');

        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);

        if (targetElement) {
          e.preventDefault();

          const headerHeight = header ? header.offsetHeight : 0;
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;

          if (prefersReducedMotion) {
            window.scrollTo(0, targetPosition);
          } else {
            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth'
            });
          }
        }
      });
    });
  }

  // ========================================
  // Button Hover Micro-interactions
  // ========================================
  function initButtonInteractions() {
    const buttons = document.querySelectorAll('.btn');

    buttons.forEach(button => {
      button.addEventListener('mouseenter', function() {
        if (!prefersReducedMotion) {
          this.style.transform = 'translateY(-2px)';
        }
      });

      button.addEventListener('mouseleave', function() {
        this.style.transform = '';
      });

      // Ripple effect on click (optional enhancement)
      button.addEventListener('click', function(e) {
        if (prefersReducedMotion) return;

        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();

        ripple.style.cssText = `
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          width: 100px;
          height: 100px;
          left: ${e.clientX - rect.left - 50}px;
          top: ${e.clientY - rect.top - 50}px;
          transform: scale(0);
          animation: ripple 0.6s linear;
          pointer-events: none;
        `;

        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
      });
    });

    // Add ripple animation keyframes
    if (!document.getElementById('ripple-styles')) {
      const style = document.createElement('style');
      style.id = 'ripple-styles';
      style.textContent = `
        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  // ========================================
  // Lazy Loading Images
  // ========================================
  function initLazyLoading() {
    const lazyImages = document.querySelectorAll('img[data-src]');

    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        });
      });

      lazyImages.forEach(img => imageObserver.observe(img));
    } else {
      // Fallback for browsers without IntersectionObserver
      lazyImages.forEach(img => {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
      });
    }
  }

  // ========================================
  // Initialize All Functions
  // ========================================
  function init() {
    initMobileNav();
    initHeaderScroll();
    initScrollAnimations();
    initActiveNavState();
    initContactForm();
    initSmoothScroll();
    initButtonInteractions();
    initLazyLoading();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
