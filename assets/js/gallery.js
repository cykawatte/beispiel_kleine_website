/**
 * MUSTERBETRIEB - Gallery JavaScript
 * Filtering and lightbox functionality
 */

(function() {
  'use strict';

  // ========================================
  // DOM Elements
  // ========================================
  const filterButtons = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const galleryGrid = document.querySelector('.gallery-grid');

  // ========================================
  // Check for reduced motion preference
  // ========================================
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ========================================
  // Gallery Filtering
  // ========================================
  function initGalleryFilter() {
    if (filterButtons.length === 0 || galleryItems.length === 0) return;

    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        const filter = button.dataset.filter;

        // Update active button state
        filterButtons.forEach(btn => btn.classList.remove('filter-btn--active'));
        button.classList.add('filter-btn--active');

        // Filter gallery items
        filterGalleryItems(filter);
      });
    });
  }

  function filterGalleryItems(filter) {
    galleryItems.forEach((item, index) => {
      const category = item.dataset.category;
      const shouldShow = filter === 'all' || category === filter;

      if (prefersReducedMotion) {
        // Instant show/hide without animation
        item.style.display = shouldShow ? '' : 'none';
        item.setAttribute('data-visible', shouldShow);
      } else {
        // Animated show/hide
        if (shouldShow) {
          item.style.display = '';
          item.setAttribute('data-visible', 'true');

          // Staggered animation
          item.style.opacity = '0';
          item.style.transform = 'scale(0.8)';

          setTimeout(() => {
            item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, index * 50);
        } else {
          item.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
          item.style.opacity = '0';
          item.style.transform = 'scale(0.8)';

          setTimeout(() => {
            item.style.display = 'none';
            item.setAttribute('data-visible', 'false');
          }, 200);
        }
      }
    });
  }

  // ========================================
  // Simple Lightbox
  // ========================================
  let lightbox = null;
  let currentImageIndex = 0;
  let visibleImages = [];

  function initLightbox() {
    if (galleryItems.length === 0) return;

    // Create lightbox elements
    createLightbox();

    // Add click listeners to gallery items
    galleryItems.forEach((item, index) => {
      item.addEventListener('click', () => {
        openLightbox(item);
      });

      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(item);
        }
      });
    });
  }

  function createLightbox() {
    lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
      <div class="lightbox__overlay"></div>
      <div class="lightbox__content">
        <button class="lightbox__close" aria-label="Schließen">&times;</button>
        <button class="lightbox__prev" aria-label="Vorheriges Bild">&#10094;</button>
        <button class="lightbox__next" aria-label="Nächstes Bild">&#10095;</button>
        <div class="lightbox__image-container">
          <img class="lightbox__image" src="" alt="">
        </div>
        <div class="lightbox__caption"></div>
      </div>
    `;

    // Add styles
    const styles = document.createElement('style');
    styles.textContent = `
      .lightbox {
        position: fixed;
        inset: 0;
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.3s ease, visibility 0.3s ease;
      }

      .lightbox--open {
        opacity: 1;
        visibility: visible;
      }

      .lightbox__overlay {
        position: absolute;
        inset: 0;
        background-color: rgba(0, 0, 0, 0.9);
      }

      .lightbox__content {
        position: relative;
        max-width: 90vw;
        max-height: 90vh;
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .lightbox__image-container {
        display: flex;
        align-items: center;
        justify-content: center;
        max-height: 80vh;
      }

      .lightbox__image {
        max-width: 100%;
        max-height: 80vh;
        object-fit: contain;
        border-radius: 4px;
      }

      .lightbox__close {
        position: absolute;
        top: -40px;
        right: 0;
        background: none;
        border: none;
        color: white;
        font-size: 32px;
        cursor: pointer;
        padding: 8px;
        line-height: 1;
        transition: transform 0.2s ease;
      }

      .lightbox__close:hover {
        transform: scale(1.1);
      }

      .lightbox__prev,
      .lightbox__next {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        background: rgba(255, 255, 255, 0.1);
        border: none;
        color: white;
        font-size: 24px;
        cursor: pointer;
        padding: 16px;
        border-radius: 4px;
        transition: background-color 0.2s ease;
      }

      .lightbox__prev:hover,
      .lightbox__next:hover {
        background: rgba(255, 255, 255, 0.2);
      }

      .lightbox__prev {
        left: -60px;
      }

      .lightbox__next {
        right: -60px;
      }

      @media (max-width: 768px) {
        .lightbox__prev,
        .lightbox__next {
          padding: 12px;
          font-size: 20px;
        }

        .lightbox__prev {
          left: 10px;
        }

        .lightbox__next {
          right: 10px;
        }
      }

      .lightbox__caption {
        color: white;
        text-align: center;
        padding: 16px;
        font-size: 14px;
      }
    `;

    document.head.appendChild(styles);
    document.body.appendChild(lightbox);

    // Event listeners
    lightbox.querySelector('.lightbox__overlay').addEventListener('click', closeLightbox);
    lightbox.querySelector('.lightbox__close').addEventListener('click', closeLightbox);
    lightbox.querySelector('.lightbox__prev').addEventListener('click', showPrevImage);
    lightbox.querySelector('.lightbox__next').addEventListener('click', showNextImage);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('lightbox--open')) return;

      switch (e.key) {
        case 'Escape':
          closeLightbox();
          break;
        case 'ArrowLeft':
          showPrevImage();
          break;
        case 'ArrowRight':
          showNextImage();
          break;
      }
    });
  }

  function openLightbox(item) {
    // Get all visible gallery items
    visibleImages = Array.from(galleryItems).filter(
      galleryItem => galleryItem.getAttribute('data-visible') !== 'false'
    );

    currentImageIndex = visibleImages.indexOf(item);

    updateLightboxImage();
    lightbox.classList.add('lightbox--open');
    document.body.style.overflow = 'hidden';

    // Focus trap
    lightbox.querySelector('.lightbox__close').focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('lightbox--open');
    document.body.style.overflow = '';
  }

  function updateLightboxImage() {
    const item = visibleImages[currentImageIndex];
    const img = item.querySelector('img');
    const title = item.querySelector('.gallery-item__title');

    const lightboxImage = lightbox.querySelector('.lightbox__image');
    const lightboxCaption = lightbox.querySelector('.lightbox__caption');

    // Use full-size image if available, otherwise use thumbnail
    lightboxImage.src = item.dataset.fullImage || img.src;
    lightboxImage.alt = img.alt;
    lightboxCaption.textContent = title ? title.textContent : '';

    // Update navigation buttons visibility
    const prevBtn = lightbox.querySelector('.lightbox__prev');
    const nextBtn = lightbox.querySelector('.lightbox__next');

    prevBtn.style.display = visibleImages.length > 1 ? '' : 'none';
    nextBtn.style.display = visibleImages.length > 1 ? '' : 'none';
  }

  function showPrevImage() {
    currentImageIndex = (currentImageIndex - 1 + visibleImages.length) % visibleImages.length;
    updateLightboxImage();
  }

  function showNextImage() {
    currentImageIndex = (currentImageIndex + 1) % visibleImages.length;
    updateLightboxImage();
  }

  // ========================================
  // Masonry-like Layout (Optional)
  // ========================================
  function initMasonryLayout() {
    if (!galleryGrid) return;

    // This is a simple CSS-based approach
    // For true masonry, you'd need a library or more complex JS
    const items = galleryGrid.querySelectorAll('.gallery-item');

    items.forEach((item, index) => {
      // Add random aspect ratios for visual interest
      // Comment this out if you want uniform grid
      // const aspectRatios = ['1/1', '4/3', '3/4', '16/9'];
      // item.style.aspectRatio = aspectRatios[index % aspectRatios.length];
    });
  }

  // ========================================
  // Initialize
  // ========================================
  function init() {
    initGalleryFilter();
    initLightbox();
    initMasonryLayout();

    // Set initial visibility attribute
    galleryItems.forEach(item => {
      item.setAttribute('data-visible', 'true');
      item.setAttribute('tabindex', '0');
      item.setAttribute('role', 'button');
    });
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
