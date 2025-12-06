// Dashboard Interactions
(function() {
  'use strict';

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    console.log('Dashboard initializing...');
    setupSidebar();
    setupSearch();
    setupDateRange();
    setupKPICards();
    setupChartTabs();
    setupTable();
    setupSmoothScroll();
    setupCurrentYear();
    setupScrollToTop();
    setupTipCardRepositioning();
    console.log('Dashboard initialized');
  }

  // Sidebar Toggle
  function setupSidebar() {
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.querySelector('[data-sidebar-toggle]') || document.getElementById('sidebar-toggle');
    const shell = document.documentElement; // or a top container
    const KEY = 'dash_sidebar_collapsed';
    
    if (!sidebar || !sidebarToggle) return;

    function applySidebarState() {
      const collapsed = localStorage.getItem(KEY) === '1';
      shell.classList.toggle('sidebar-collapsed', collapsed);
      sidebar.classList.toggle('collapsed', collapsed);
    }

    // Load and apply saved state
    applySidebarState();

    sidebarToggle.addEventListener('click', () => {
      const next = !(localStorage.getItem(KEY) === '1');
      localStorage.setItem(KEY, next ? '1' : '0');
      applySidebarState();
    });
  }

  // Search Filter
  function setupSearch() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;

    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      const query = e.target.value.toLowerCase().trim();
      
      // Debounce search
      searchTimeout = setTimeout(() => {
        filterTableRows(query);
      }, 300);
    });
  }

  function filterTableRows(query) {
    const tableBody = document.getElementById('table-body');
    if (!tableBody) return;

    const rows = tableBody.querySelectorAll('tr');
    let visibleCount = 0;

    rows.forEach(row => {
      const text = row.textContent.toLowerCase();
      if (query === '' || text.includes(query)) {
        row.style.display = '';
        visibleCount++;
      } else {
        row.style.display = 'none';
      }
    });

    // Update pagination if needed
    updatePaginationInfo();
  }

  // Date Range Picker (Mock)
  function setupDateRange() {
    const dateButtons = document.querySelectorAll('.date-btn');
    
    dateButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Remove active class from all buttons
        dateButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');
        // In a real app, this would update the data
        showToast(`Date range updated to ${button.textContent}`);
      });
    });
  }

  // KPI Cards Animation
  function setupKPICards() {
    const kpiValues = document.querySelectorAll('.kpi-value');
    
    kpiValues.forEach(element => {
      const target = parseFloat(element.getAttribute('data-target')) || 0;
      const isDecimal = target % 1 !== 0;
      const duration = 2000; // 2 seconds
      const steps = 60;
      const increment = target / steps;
      let current = 0;
      let step = 0;

      const animate = () => {
        step++;
        current += increment;
        
        if (step >= steps) {
          element.textContent = isDecimal ? target.toFixed(2) : Math.round(target).toLocaleString();
        } else {
          const value = isDecimal ? current.toFixed(2) : Math.round(current).toLocaleString();
          element.textContent = value;
          requestAnimationFrame(animate);
        }
      };

      // Start animation after a short delay
      setTimeout(() => {
        animate();
      }, 100);
    });
  }

  // Chart Tabs
  function setupChartTabs() {
    const chartTabs = document.querySelectorAll('.chart-tab');
    const chartImage = document.getElementById('chart-image');
    
    if (!chartImage) return;

    chartTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        // Remove active class from all tabs
        chartTabs.forEach(t => t.classList.remove('active'));
        // Add active class to clicked tab
        tab.classList.add('active');
        
        // In a real app, this would switch the actual chart
        const chartType = tab.getAttribute('data-chart');
        // Save preference to localStorage
        localStorage.setItem('chart-type', chartType);
        
        // Update chart placeholder (in real app, this would render a chart)
        showToast(`Switched to ${chartType} chart`);
      });
    });

    // Load saved chart type
    const savedChartType = localStorage.getItem('chart-type');
    if (savedChartType) {
      const savedTab = document.querySelector(`[data-chart="${savedChartType}"]`);
      if (savedTab) {
        chartTabs.forEach(t => t.classList.remove('active'));
        savedTab.classList.add('active');
      }
    }
  }

  // Table Sorting & Pagination
  function setupTable() {
    // Generate table data
    generateTableData();
    
    // Setup sorting
    setupTableSorting();
    
    // Setup pagination
    setupPagination();
  }

  // Table Data
  let tableData = [];
  let currentSort = { column: 'id', order: 'asc' };
  let currentPage = 1;
  const rowsPerPage = 10;

  function generateTableData() {
    const names = ['John Doe', 'Jane Smith', 'Bob Johnson', 'Alice Williams', 'Charlie Brown', 'Diana Prince', 'Edward Norton', 'Fiona Apple', 'George Lucas', 'Helen Mirren', 'Ian McKellen', 'Julia Roberts', 'Kevin Spacey', 'Laura Linney', 'Michael Caine', 'Natalie Portman', 'Oscar Isaac', 'Penelope Cruz', 'Quentin Tarantino', 'Rachel Weisz', 'Samuel Jackson', 'Tilda Swinton', 'Uma Thurman', 'Viggo Mortensen', 'Winona Ryder', 'Xavier Dolan', 'Yara Shahidi', 'Zoe Saldana', 'Adam Sandler', 'Ben Affleck', 'Chris Evans', 'Dwayne Johnson', 'Emma Stone', 'Famous Person', 'Great Actor', 'Hollywood Star', 'Iconic Performer', 'Jazz Musician', 'Killer Performance', 'Legendary Artist', 'Master Director', 'Notable Celebrity', 'Outstanding Talent', 'Prolific Writer', 'Quality Actor', 'Renowned Artist', 'Star Performer', 'Talented Individual', 'Unique Person', 'Versatile Actor', 'World Class'];
    const statuses = ['success', 'pending', 'failed'];
    
    tableData = [];
    for (let i = 1; i <= 50; i++) {
      tableData.push({
        id: i,
        name: names[i % names.length] || names[0], // Use modulo to ensure we always have a name
        amount: (Math.random() * 1000 + 10).toFixed(2),
        date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        status: statuses[Math.floor(Math.random() * statuses.length)]
      });
    }
    
    console.log('Generated', tableData.length, 'table rows');
    
    // Ensure table body exists before rendering
    const tableBody = document.getElementById('table-body');
    if (tableBody) {
      console.log('Table body found, rendering...');
      renderTable();
    } else {
      console.error('Table body not found! Retrying...');
      // Retry after a short delay if table body doesn't exist yet
      setTimeout(() => {
        const retryTableBody = document.getElementById('table-body');
        if (retryTableBody) {
          console.log('Table body found on retry, rendering...');
          renderTable();
        } else {
          console.error('Table body still not found after retry!');
        }
      }, 100);
    }
  }

  function renderTable() {
    const tableBody = document.getElementById('table-body');
    if (!tableBody) {
      console.error('Table body not found!');
      return;
    }

    if (!tableData || tableData.length === 0) {
      console.error('No table data available!');
      return;
    }

    console.log('Rendering table with', tableData.length, 'rows');

    // Sort data
    const sortedData = [...tableData].sort((a, b) => {
      let aVal = a[currentSort.column];
      let bVal = b[currentSort.column];
      
      if (currentSort.column === 'amount') {
        aVal = parseFloat(aVal);
        bVal = parseFloat(bVal);
      } else if (currentSort.column === 'date') {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      } else if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }
      
      if (currentSort.order === 'asc') {
        return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
      } else {
        return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
      }
    });

    // Paginate data
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const paginatedData = sortedData.slice(startIndex, endIndex);

    // Render rows
    tableBody.innerHTML = '';
    
    if (paginatedData.length === 0) {
      const tr = document.createElement('tr');
      tr.innerHTML = '<td colspan="6" style="text-align: center; padding: 2rem; color: var(--muted);">No data available</td>';
      tableBody.appendChild(tr);
    } else {
      paginatedData.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${row.id}</td>
          <td>${row.name}</td>
          <td>$${row.amount}</td>
          <td>${row.date}</td>
          <td><span class="status-badge ${row.status}">${row.status}</span></td>
          <td>
            <div class="row-actions" data-tip="row-actions">
              <button class="row-action-btn" data-action="view">View</button>
              <button class="row-action-btn" data-action="edit">Edit</button>
            </div>
          </td>
        `;
        tableBody.appendChild(tr);
      });
    }

    console.log('Table rendered with', paginatedData.length, 'rows visible');

    // Setup row action buttons
    setupRowActions();
    
    // Update pagination info
    updatePaginationInfo();
  }

  function setupTableSorting() {
    const sortHeaders = document.querySelectorAll('.table-sort');
    
    sortHeaders.forEach(header => {
      header.addEventListener('click', () => {
        const column = header.getAttribute('data-sort');
        if (!column) return;

        // Reset all headers
        sortHeaders.forEach(h => {
          h.setAttribute('data-order', '');
        });

        // Toggle sort order
        if (currentSort.column === column) {
          currentSort.order = currentSort.order === 'asc' ? 'desc' : 'asc';
        } else {
          currentSort.column = column;
          currentSort.order = 'asc';
        }

        // Update header
        header.setAttribute('data-order', currentSort.order);
        
        // Re-render table
        currentPage = 1; // Reset to first page
        renderTable();
      });
    });
  }

  function setupPagination() {
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');
    
    if (!prevBtn || !nextBtn) return;

    prevBtn.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        renderTable();
      }
    });

    nextBtn.addEventListener('click', () => {
      const totalPages = Math.ceil(tableData.length / rowsPerPage);
      if (currentPage < totalPages) {
        currentPage++;
        renderTable();
      }
    });
  }

  function updatePaginationInfo() {
    const currentPageEl = document.getElementById('current-page');
    const totalPagesEl = document.getElementById('total-pages');
    const tableRangeEl = document.getElementById('table-range');
    const tableTotalEl = document.getElementById('table-total');
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');

    const totalPages = Math.ceil(tableData.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage + 1;
    const endIndex = Math.min(currentPage * rowsPerPage, tableData.length);

    if (currentPageEl) currentPageEl.textContent = currentPage;
    if (totalPagesEl) totalPagesEl.textContent = totalPages;
    if (tableRangeEl) tableRangeEl.textContent = `${startIndex}-${endIndex}`;
    if (tableTotalEl) tableTotalEl.textContent = tableData.length;
    
    if (prevBtn) prevBtn.disabled = currentPage === 1;
    if (nextBtn) nextBtn.disabled = currentPage >= totalPages;
  }

  function setupRowActions() {
    const actionButtons = document.querySelectorAll('.row-action-btn');
    
    actionButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.stopPropagation();
        const action = button.getAttribute('data-action');
        const row = button.closest('tr');
        const rowId = row.querySelector('td:first-child').textContent;
        
        if (action === 'view') {
          showToast(`Viewing row #${rowId}`);
        } else if (action === 'edit') {
          showToast(`Editing row #${rowId}`);
        }
      });
    });
  }

  // Toast Notification
  function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      bottom: 4rem;
      right: 2rem;
      background: var(--accent);
      color: white;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      box-shadow: 0 4px 16px rgba(59, 130, 246, 0.4);
      z-index: 10000;
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.3s, transform 0.3s;
      font-size: 0.875rem;
      font-weight: 500;
    `;
    
    document.body.appendChild(toast);
    
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    });
    
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(20px)';
      setTimeout(() => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast);
        }
      }, 300);
    }, 2000);
  }

  // Smooth Scroll for in-page links
  function setupSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        
        // Prevent default for all sidebar links
        if (href === '#') {
          e.preventDefault();
          // For sidebar items, just update active state
          if (link.classList.contains('sidebar-item')) {
            document.querySelectorAll('.sidebar-item').forEach(item => {
              item.classList.remove('active');
            });
            link.classList.add('active');
          }
          return;
        }

        const target = document.querySelector(href);
        
        if (target) {
          e.preventDefault();
          
          // Calculate offset for sticky header
          const topbar = document.querySelector('.topbar');
          const topbarHeight = topbar ? topbar.offsetHeight : 0;
          const targetPosition = target.offsetTop - topbarHeight;

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

  // Scroll to Top Button
  function setupScrollToTop() {
    const scrollButton = document.getElementById('scroll-to-top');
    const mainContent = document.querySelector('.main-content');
    if (!scrollButton) return;

    // Show/hide button based on scroll position
    function toggleScrollButton() {
      // Dashboard uses .main-content for scrolling, not window
      const scrollElement = mainContent || window;
      const scrollTop = mainContent ? mainContent.scrollTop : window.scrollY;
      
      if (scrollTop > 300) {
        scrollButton.setAttribute('aria-hidden', 'false');
      } else {
        scrollButton.setAttribute('aria-hidden', 'true');
      }
    }

    // Initial check
    toggleScrollButton();

    // Listen for scroll events on the correct element
    const scrollElement = mainContent || window;
    scrollElement.addEventListener('scroll', toggleScrollButton, { passive: true });

    // Scroll to top on click
    scrollButton.addEventListener('click', () => {
      if (mainContent) {
        mainContent.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      } else {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
    });
  }

  // Reposition tip cards on scroll/resize
  function setupTipCardRepositioning() {
    let scrollTimeout;
    let resizeTimeout;

    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        // Tip card repositioning is handled in tips.js
      }, 100);
    }, { passive: true });

    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        // Tip card repositioning is handled in tips.js
      }, 100);
    });
  }
})();

