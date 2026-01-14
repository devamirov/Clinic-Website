/**
* Template Name: MediTrust
* Template URL: https://bootstrapmade.com/meditrust-bootstrap-hospital-website-template/
* Updated: Jul 04 2025 with Bootstrap v5.3.7
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/

(function() {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener('click', mobileNavToogle);
  }

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Initiate Pure Counter
   */
  new PureCounter();

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Init isotope layout and filters
   */
  document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope;
    imagesLoaded(isotopeItem.querySelector('.isotope-container'), function() {
      initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort
      });
    });

    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {
      filters.addEventListener('click', function() {
        isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
        this.classList.add('filter-active');
        initIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        if (typeof aosInit === 'function') {
          aosInit();
        }
      }, false);
    });

  });

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Frequently Asked Questions Toggle
   */
  document.querySelectorAll('.faq-item h3, .faq-item .faq-toggle, .faq-item .faq-header').forEach((faqItem) => {
    faqItem.addEventListener('click', () => {
      faqItem.parentNode.classList.toggle('faq-active');
    });
  });

  /**
   * Doctor availability badges (Lebanon time)
   * Show "Available" from 09:00-17:00 Asia/Beirut; otherwise "Next: Tomorrow 9AM"
   */
  function getBeirutDate() {
    // Create a Date reflecting current time in Asia/Beirut
    return new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Beirut' }));
  }

  function updateDoctorAvailability() {
    const now = getBeirutDate();
    const hour = now.getHours();

    const badges = document.querySelectorAll('#find-a-doctor .availability-badge');
    badges.forEach((badge) => {
      const card = badge.closest('.doctor-card');
      const fromHour = parseInt(card?.getAttribute('data-available-from-hour') || '9', 10);
      const untilHour = parseInt(card?.getAttribute('data-available-until-hour') || '17', 10);
      const isAvailable = hour >= fromHour && hour < untilHour;

      badge.classList.remove('online', 'busy', 'offline');
      if (isAvailable) {
        badge.textContent = 'Available';
        badge.classList.add('online');
      } else {
        // Construct next available label using fromHour, defaulting to 9AM format
        const displayFrom = (fromHour === 12 ? '12PM' : fromHour === 0 ? '12AM' : fromHour > 12 ? `${fromHour - 12}PM` : `${fromHour}AM`);
        badge.textContent = `Next: Tomorrow ${displayFrom}`;
        badge.classList.add('offline');
      }
    });
  }

  window.addEventListener('load', () => {
    updateDoctorAvailability();
    // Refresh every minute in case the page stays open across the threshold
    setInterval(updateDoctorAvailability, 60 * 1000);
  });

  /**
   * Emergency tips pills - continuous horizontal autoplay
   */
  function initEmergencyTicker() {
    const lists = document.querySelectorAll('.emergency-tips .emergency-list');
    lists.forEach((list) => {
      if (list.dataset.tickerInitialized === 'true') return;
      list.dataset.tickerInitialized = 'true';

      // Only activate if content overflows
      if (list.scrollWidth <= list.clientWidth) return;

      // Duplicate content for seamless loop
      const original = list.innerHTML;
      list.innerHTML = original + original;

      let position = 0;
      const speedPxPerFrame = 0.6; // adjust speed here

      function step() {
        // Half of scrollWidth corresponds to one full set
        const loopWidth = list.scrollWidth / 2;
        position += speedPxPerFrame;
        if (position >= loopWidth) position = 0;
        list.scrollLeft = position;
        requestAnimationFrame(step);
      }

      requestAnimationFrame(step);
    });
  }

  window.addEventListener('load', initEmergencyTicker);

})();