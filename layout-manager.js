
const commonHeader = `
  <nav class="fixed top-0 left-0 right-0 z-50 glass border-b border-slate-200/50 dark:border-slate-800/50">
    <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <a href="Home.html" class="flex items-center gap-3">
          <img alt="FinzTrust Logo" class="h-10 w-auto" src="images/Logo.png" />
          <span class="text-xl font-bold tracking-tight text-slate-900 dark:text-white">FinzTrust</span>
        </a>
      </div>
      <div class="hidden md:flex items-center gap-10">
        <a class="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary transition-colors nav-link" href="Home.html" data-route="Home.html">Home</a>
        <a class="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary transition-colors nav-link" href="Finzcore.html" data-route="Finzcore.html">FinzCore 360</a>
        <a class="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary transition-colors nav-link" href="Rci.html" data-route="Rci.html">RCI Field</a>
        <a class="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary transition-colors nav-link" href="B2cApp.html" data-route="B2cApp.html">FinzLoan</a>
        <a class="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary transition-colors nav-link" href="About.html" data-route="About.html">About Us</a>
        <a href="Demo.html" class="bg-primary hover:opacity-90 text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-lg shadow-primary/20 btn-pulse">Request a Demo</a>
      </div>
      <button class="md:hidden text-slate-900 dark:text-white" id="mobile-menu-trigger">
        <span class="material-symbols-outlined">menu</span>
      </button>
    </div>
  </nav>
`;

const commonFooter = `
  <footer class="py-12 px-6 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-background-dark">
    <div class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
      <div class="flex items-center gap-3">
        <img alt="Logo" class="h-8 w-auto grayscale opacity-70" src="images/Logo.png" />
        <span class="text-slate-400 font-semibold tracking-tight text-sm">© 2024 FinzTrust Technology. All rights reserved.</span>
      </div>
      <div class="flex gap-8">
        <a class="text-sm font-medium text-slate-400 hover:text-primary transition-colors" href="#">Privacy Policy</a>
        <a class="text-sm font-medium text-slate-400 hover:text-primary transition-colors" href="#">Terms of Service</a>
        <a class="text-sm font-medium text-slate-400 hover:text-primary transition-colors" href="About.html">Contact</a>
      </div>
    </div>
  </footer>
`;

const injectLayout = () => {
  const headerContainer = document.getElementById('global-header');
  const footerContainer = document.getElementById('global-footer');

  if (headerContainer) {
    headerContainer.innerHTML = commonHeader;
    
    // Highlight active route
    const currentPath = window.location.pathname.split('/').pop() || 'Home.html';
    const activeLink = headerContainer.querySelector(`[data-route="${currentPath}"]`);
    if (activeLink) {
      activeLink.classList.remove('text-slate-600', 'dark:text-slate-300');
      activeLink.classList.add('text-primary', 'font-bold');
    }

    // Initialize Mobile Menu Logic
    const menuBtn = headerContainer.querySelector('#mobile-menu-trigger');
    if (menuBtn) {
      // Check if overlay already exists to avoid duplicates
      let mobileMenu = document.getElementById('mobile-menu-overlay');
      if (!mobileMenu) {
        mobileMenu = document.createElement('div');
        mobileMenu.id = 'mobile-menu-overlay';
        mobileMenu.className = 'fixed inset-0 z-[100] bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl flex flex-col items-center justify-center gap-10 translate-x-full transition-transform duration-500 ease-in-out md:hidden';
        
        // Close Button
        const closeBtn = document.createElement('button');
        closeBtn.className = 'absolute top-6 right-6 text-slate-900 dark:text-white';
        closeBtn.innerHTML = '<span class="material-symbols-outlined text-4xl">close</span>';
        mobileMenu.appendChild(closeBtn);

        // Navigation Links (Cloned from desktop for consistency)
        const links = headerContainer.querySelectorAll('.hidden.md\\:flex a');
        links.forEach(link => {
          const mLink = link.cloneNode(true);
          // Apply mobile styles
          if (mLink.classList.contains('bg-primary')) {
            mLink.className = 'px-10 py-4 bg-primary text-white rounded-2xl text-xl font-bold mt-4 shadow-xl shadow-primary/20';
          } else {
            mLink.className = 'text-3xl font-bold text-slate-900 dark:text-white hover:text-primary transition-colors';
          }
          
          mLink.addEventListener('click', () => {
            mobileMenu.classList.add('translate-x-full');
          });
          mobileMenu.appendChild(mLink);
        });

        document.body.appendChild(mobileMenu);

        // Open Logic
        menuBtn.addEventListener('click', () => {
          mobileMenu.classList.remove('translate-x-full');
        });

        // Close Logic
        closeBtn.addEventListener('click', () => {
          mobileMenu.classList.add('translate-x-full');
        });
      }
    }
  }

  if (footerContainer) {
    footerContainer.innerHTML = commonFooter;
  }
};

document.addEventListener('DOMContentLoaded', injectLayout);
