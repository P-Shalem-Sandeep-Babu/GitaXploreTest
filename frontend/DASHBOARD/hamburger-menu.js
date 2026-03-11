// Hamburger Menu - Responsive Navigation
(function() {
    'use strict';

    // Create hamburger menu HTML
    function createHamburgerMenu() {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;

        const navContent = navbar.querySelector('.nav-content');
        if (!navContent) return;

        // Check if hamburger already exists
        if (document.querySelector('.hamburger-menu')) return;

        // Create hamburger button
        const hamburger = document.createElement('button');
        hamburger.className = 'hamburger-menu';
        hamburger.setAttribute('aria-label', 'Toggle navigation menu');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.innerHTML = `
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
        `;

        // Insert hamburger after logo
        const logo = navContent.querySelector('.logo');
        if (logo) {
            logo.insertAdjacentElement('afterend', hamburger);
        }

        // Add mobile class to right section
        const rightSection = navContent.querySelector('.right-section');
        if (rightSection) {
            rightSection.classList.add('mobile-nav');
        }

        return hamburger;
    }

    // Toggle menu
    function toggleMenu(hamburger) {
        const rightSection = document.querySelector('.right-section');
        const isOpen = hamburger.classList.contains('active');

        if (isOpen) {
            hamburger.classList.remove('active');
            rightSection.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        } else {
            hamburger.classList.add('active');
            rightSection.classList.add('active');
            hamburger.setAttribute('aria-expanded', 'true');
            document.body.style.overflow = 'hidden';
        }
    }

    // Close menu when clicking outside
    function handleOutsideClick(event) {
        const hamburger = document.querySelector('.hamburger-menu');
        const rightSection = document.querySelector('.right-section');
        
        if (!hamburger || !rightSection) return;
        
        if (hamburger.classList.contains('active') && 
            !rightSection.contains(event.target) && 
            !hamburger.contains(event.target)) {
            toggleMenu(hamburger);
        }
    }

    // Close menu when clicking on a link
    function handleLinkClick() {
        const hamburger = document.querySelector('.hamburger-menu');
        if (hamburger && hamburger.classList.contains('active')) {
            toggleMenu(hamburger);
        }
    }

    // Initialize
    function init() {
        const hamburger = createHamburgerMenu();
        if (!hamburger) return;

        // Toggle on hamburger click
        hamburger.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleMenu(hamburger);
        });

        // Close on outside click
        document.addEventListener('click', handleOutsideClick);

        // Close on link click
        const navLinks = document.querySelectorAll('.right-section a');
        navLinks.forEach(link => {
            link.addEventListener('click', handleLinkClick);
        });

        // Close on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && hamburger.classList.contains('active')) {
                toggleMenu(hamburger);
            }
        });

        // Handle window resize
        let resizeTimer;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                if (window.innerWidth > 768 && hamburger.classList.contains('active')) {
                    toggleMenu(hamburger);
                }
            }, 250);
        });
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
