/*
  main.js — General UI: Sidebar toggle, active nav, toasts
  Holiday Package Booking System
*/

// Wait for the DOM to be fully loaded before running any JS
document.addEventListener('DOMContentLoaded', () => {

  // ---- Sidebar Toggle (Mobile hamburger) ----
  const sidebar     = document.getElementById('sidebar');
  const overlay     = document.getElementById('overlay');
  const hamburgerBtn = document.getElementById('hamburger-btn');

  function openSidebar() {
    sidebar.classList.add('open');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // prevent background scroll
  }

  function closeSidebar() {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', () => {
      sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
    });
  }

  if (overlay) {
    overlay.addEventListener('click', closeSidebar);
  }

  // Close sidebar when pressing Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeSidebar();
  });

  // ---- Highlight Active Nav Link ----
  // Figures out the current page filename and marks the matching sidebar link as active
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  const navLinks = document.querySelectorAll('.nav-item[data-page]');
  navLinks.forEach(link => {
    if (link.dataset.page === currentPage) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // ---- Collapsible Nav Sub-menus ----
  const navItemsWithSub = document.querySelectorAll('.nav-item[data-has-sub]');
  navItemsWithSub.forEach(item => {
    item.addEventListener('click', () => {
      const subId = item.dataset.hasSub;
      const subMenu = document.getElementById(subId);
      if (!subMenu) return;

      item.classList.toggle('open');
      subMenu.classList.toggle('open');
    });
  });

  // ---- Toast Notification System ----
  // Usage: showToast('Your message here', 'success' | 'error' | '')
  window.showToast = function(message, type = '') {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    // Pick an icon based on type
    const icons = { success: '✅', error: '❌', '': 'ℹ️' };
    toast.innerHTML = `<span>${icons[type] || icons['']}</span> ${message}`;

    container.appendChild(toast);

    // Auto-remove the toast after 3.5 seconds
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.4s ease';
      setTimeout(() => toast.remove(), 400);
    }, 3500);
  };

  // ---- Animate Stats Cards on Load ----
  // Simple count-up animation for the dashboard stat numbers
  const statValues = document.querySelectorAll('.stat-value[data-target]');
  statValues.forEach(el => {
    const target = parseFloat(el.dataset.target);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const isFloat = String(target).includes('.');

    let current = 0;
    const step = target / 50; // 50 animation frames
    const interval = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(interval);
      }
      el.textContent = prefix + (isFloat ? current.toFixed(1) : Math.floor(current)) + suffix;
    }, 30);
  });

});
