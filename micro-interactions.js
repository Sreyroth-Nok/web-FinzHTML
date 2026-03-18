// Load external scripts (GSAP, ScrollTrigger, Lenis, VanillaTilt) dynamically
const loadScripts = async () => {
    const scripts = [
        "https://unpkg.com/@studio-freight/lenis@1.0.33/dist/lenis.min.js",
        "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js",
        "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js",
        "https://cdnjs.cloudflare.com/ajax/libs/vanilla-tilt/1.8.0/vanilla-tilt.min.js"
    ];

    for (let src of scripts) {
        await new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    // Mobile Menu Logic
  const createMobileMenus = () => {
    const navs = document.querySelectorAll('nav, header');
    
    navs.forEach(nav => {
      // Find mobile menu button
      const menuBtn = nav.querySelector('button .material-symbols-outlined:contains("menu")') || 
                      nav.querySelector('button[class*="md:hidden"]') ||
                      nav.querySelector('button:has(.material-symbols-outlined)');
      
      if (!menuBtn) return;

      // Find desktop links to clone
      const desktopLinksContainer = nav.querySelector('.hidden.md\\:flex');
      if (!desktopLinksContainer) return;

      // Create Mobile Menu Overlay
      const mobileMenu = document.createElement('div');
      mobileMenu.className = 'fixed inset-0 z-[60] bg-white/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8 translate-x-full transition-transform duration-500 ease-in-out md:hidden';
      mobileMenu.id = 'mobile-menu-overlay';

      // Close Button
      const closeBtn = document.createElement('button');
      closeBtn.className = 'absolute top-6 right-6 text-slate-900';
      closeBtn.innerHTML = '<span class="material-symbols-outlined text-3xl">close</span>';
      mobileMenu.appendChild(closeBtn);

      // Clone Links
      const links = desktopLinksContainer.querySelectorAll('a, button');
      links.forEach(link => {
        const mobileLink = link.cloneNode(true);
        mobileLink.className = 'text-2xl font-bold text-slate-900 hover:text-primary transition-colors';
        if (mobileLink.tagName === 'BUTTON') {
          mobileLink.className = 'px-8 py-3 bg-primary text-white rounded-full text-xl font-bold';
        }
        mobileMenu.appendChild(mobileLink);
      });

      document.body.appendChild(mobileMenu);

      // Toggle Logic
      menuBtn.addEventListener('click', () => {
        mobileMenu.classList.remove('translate-x-full');
      });

      closeBtn.addEventListener('click', () => {
        mobileMenu.classList.add('translate-x-full');
      });

      // Close on link click
      mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          mobileMenu.classList.add('translate-x-full');
        });
      });
    });
  };

  createMobileMenus();

    // Scroll Reveal Observer
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));

  initMicroInteractions();
};

const initMicroInteractions = () => {
    // 1. Smooth Scrolling with Lenis
    if (typeof Lenis !== 'undefined') {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smooth: true,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    }

    // 2. GSAP ScrollTrigger
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // General Fade Up on Scroll
        const revealElements = document.querySelectorAll('section, .premium-card, h2, h3, p');
        revealElements.forEach((elem) => {
            // Apply a default fade-up to most elements softly
            if (!elem.classList.contains('no-gsap')) {
                gsap.from(elem, {
                    scrollTrigger: {
                        trigger: elem,
                        start: "top 90%",
                        toggleActions: "play none none reverse",
                    },
                    y: 30,
                    opacity: 0,
                    duration: 0.8,
                    ease: "power2.out"
                });
            }
        });
    }

    // 3. Vanilla Tilt
    if (typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelectorAll(".premium-card:not(.no-tilt)"), {
            max: 5,
            speed: 400,
            glare: true,
            "max-glare": 0.05,
        });
        
        VanillaTilt.init(document.querySelectorAll(".tilt-graphic"), {
            max: 10,
            speed: 400,
            glare: false,
            scale: 1.05,
        });
    }

    // 4. Magnetic Buttons
    document.querySelectorAll('button:not(.no-magnetic)').forEach(btn => {
        btn.classList.add('magnetic-btn'); // Add base class for transition
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const deltaX = (x - centerX) / 4;
            const deltaY = (y - centerY) / 4;
            
            if(typeof gsap !== 'undefined') {
                gsap.to(btn, {
                    x: deltaX,
                    y: deltaY,
                    duration: 0.3,
                    ease: "power2.out"
                });
            } else {
                btn.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
            }
        });

        btn.addEventListener('mouseleave', () => {
            if(typeof gsap !== 'undefined') {
                gsap.to(btn, {
                    x: 0,
                    y: 0,
                    duration: 0.5,
                    ease: "elastic.out(1, 0.3)"
                });
            } else {
                 btn.style.transform = `translate(0px, 0px)`;
            }
        });
    });

    // 5. Add Custom Cursor (Optional premium touch)
    const cursor = document.createElement('div');
    cursor.style.width = '20px';
    cursor.style.height = '20px';
    cursor.style.border = '2px solid rgba(75, 155, 75, 0.5)';
    cursor.style.borderRadius = '50%';
    cursor.style.position = 'fixed';
    cursor.style.pointerEvents = 'none';
    cursor.style.zIndex = '9999';
    cursor.style.transform = 'translate(-50%, -50%)';
    cursor.style.transition = 'width 0.2s, height 0.2s, background-color 0.2s';
    
    // Check if device is not touch (simple check)
    if (window.matchMedia("(pointer: fine)").matches) {
       document.body.appendChild(cursor);
       
       document.addEventListener('mousemove', (e) => {
          gsap.to(cursor, {
              x: e.clientX,
              y: e.clientY,
              duration: 0.1,
              ease: "power2.out"
          });
       });

       document.querySelectorAll('a, button, .premium-card').forEach(el => {
          el.addEventListener('mouseenter', () => {
             cursor.style.width = '40px';
             cursor.style.height = '40px';
             cursor.style.backgroundColor = 'rgba(75, 155, 75, 0.1)';
          });
          el.addEventListener('mouseleave', () => {
             cursor.style.width = '20px';
             cursor.style.height = '20px';
             cursor.style.backgroundColor = 'transparent';
          });
       });
    }

    // Add classes to nav links automatically
    document.querySelectorAll('nav a').forEach(a => a.classList.add('nav-link'));
    
    // Automatically add premium-card to specific grouped items to rely less on manual HTML injection
    const cardSelectors = [
        '.group.p-8', 
        '.bg-white.rounded-3xl.shadow-sm', 
        '.bg-background-light.border',
        '.rounded-2xl.border',
        '.p-6.rounded-2xl.bg-white\\/5'
    ];
    document.querySelectorAll(cardSelectors.join(', ')).forEach(card => {
         card.classList.add('premium-card');
    });
};

// Check if DOM is purely loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadScripts);
} else {
    loadScripts();
}
