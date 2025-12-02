// Projects Data
const projects = [
  {
    title: 'Portfolio',
    slug: 'Portfolio-App',
    path: '../Portfolio-App/public/index.html',
    tags: ['Personal', 'Branding'],
    blurb: 'Show your work with interactive teaching tips.',
    icon: '💼'
  },
  {
    title: 'Landing Course',
    slug: 'LandingCourse-App',
    path: '../LandingCourse-App/public/index.html',
    tags: ['Marketing', 'Course'],
    blurb: 'Sell a course with value props and trust cues.',
    icon: '📚'
  },
  {
    title: 'Product Showcase',
    slug: 'ProductShowcase-App',
    path: '../ProductShowcase-App/public/index.html',
    tags: ['E-commerce', 'Features'],
    blurb: 'Show product hero, gallery, specs, reviews.',
    icon: '🛍️'
  },
  {
    title: 'Bootcamp Event',
    slug: 'Bootcamp-App',
    path: '../Bootcamp-App/public/index.html',
    tags: ['Event', 'Workshop'],
    blurb: 'Agenda, speakers, venue, and registration.',
    icon: '🎓'
  },
  {
    title: 'Lead / Contact',
    slug: 'LeadContact-App',
    path: '../LeadContact-App/public/index.html',
    tags: ['Forms', 'CRM'],
    blurb: 'Conversion-focused contact/lead capture.',
    icon: '📧'
  },
  {
    title: 'UI Kit',
    slug: 'UIKit-App',
    path: '../UIKit-App/public/index.html',
    tags: ['Design System', 'Tokens'],
    blurb: 'Colors, type, buttons, inputs, cards, modals.',
    icon: '🎨'
  },
  {
    title: 'Blog / News',
    slug: 'BlogNews-App',
    path: '../BlogNews-App/public/index.html',
    tags: ['Editorial', 'Content'],
    blurb: 'Editorial home + article with reading progress.',
    icon: '📝'
  },
  {
    title: 'Link in Bio',
    slug: 'LinkInBio-App',
    path: '../LinkInBio-App/public/index.html',
    tags: ['Campaign', 'Social'],
    blurb: 'Profile, highlight link, stack, social row.',
    icon: '🔗'
  },
  {
    title: 'Dashboard Mock',
    slug: 'DashboardMock-App',
    path: '../DashboardMock-App/public/index.html',
    tags: ['Data', 'Admin'],
    blurb: 'KPI cards, chart area, table with sort/paging.',
    icon: '📊'
  },
  {
    title: 'Info Pages',
    slug: 'InfoMultiSection-App',
    path: '../InfoMultiSection-App/public/index.html',
    tags: ['Docs', 'Multi-Section'],
    blurb: 'Docs-style page with TOC, tabs, code copy.',
    icon: '📖'
  }
];

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

function init() {
  renderProjects();
  setupSearch();
  setupTagFilters();
  setupSmoothScroll();
  setupFAQ();
  setupScrollToTop();
  updateCurrentYear();
}

// Render project cards
function renderProjects(filteredProjects = projects) {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  grid.innerHTML = '';

  if (filteredProjects.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--muted);">
        <p style="font-size: 1.1rem;">No projects found matching your filters.</p>
        <p style="margin-top: 0.5rem;">Try adjusting your search or tags.</p>
      </div>
    `;
    return;
  }

  filteredProjects.forEach(project => {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.setAttribute('data-tip', 'project-card');
    card.setAttribute('data-project-slug', project.slug);

    const tagsHtml = project.tags
      .map(tag => `<span class="project-tag">${tag}</span>`)
      .join('');

    card.innerHTML = `
      <div class="project-icon">${project.icon}</div>
      <h3 class="project-title">${project.title}</h3>
      <p class="project-blurb">${project.blurb}</p>
      <div class="project-tags">${tagsHtml}</div>
      <div class="project-actions">
        <a href="${project.path}" class="btn btn-primary btn-small" target="_blank" rel="noopener noreferrer">Open App</a>
      </div>
    `;

    grid.appendChild(card);
  });

  // Re-initialize tip engine for new cards
  if (window.showTip) {
    const newTipElements = grid.querySelectorAll('[data-tip]');
    newTipElements.forEach(element => {
      const tipKey = element.getAttribute('data-tip');
      if (uiTips && uiTips[tipKey]) {
        // Re-attach event listeners (tip engine will handle this on next hover)
        // The tip engine already listens to all [data-tip] elements, so this should work
      }
    });
  }
}

// Setup search
function setupSearch() {
  const searchInput = document.getElementById('project-search');
  if (!searchInput) return;

  let searchTimeout;
  searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      filterProjects();
    }, 300);
  });
}

// Setup tag filters
function setupTagFilters() {
  const tagFiltersContainer = document.getElementById('tag-filters');
  if (!tagFiltersContainer) return;

  // Get all unique tags
  const allTags = [...new Set(projects.flatMap(p => p.tags))].sort();

  // Create tag filter buttons
  allTags.forEach(tag => {
    const button = document.createElement('button');
    button.className = 'tag-filter';
    button.textContent = tag;
    button.setAttribute('data-tag', tag);
    button.setAttribute('aria-pressed', 'false');
    button.addEventListener('click', () => {
      const isActive = button.classList.contains('active');
      button.classList.toggle('active');
      button.setAttribute('aria-pressed', !isActive ? 'true' : 'false');
      filterProjects();
    });
    tagFiltersContainer.appendChild(button);
  });
}

// Filter projects based on search and tags
function filterProjects() {
  const searchInput = document.getElementById('project-search');
  const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
  
  const activeTags = Array.from(document.querySelectorAll('.tag-filter.active'))
    .map(btn => btn.getAttribute('data-tag'));

  const filtered = projects.filter(project => {
    // Text search (title + blurb)
    const matchesSearch = !searchTerm || 
      project.title.toLowerCase().includes(searchTerm) ||
      project.blurb.toLowerCase().includes(searchTerm);

    // Tag filter (OR logic - project must have at least one active tag, or no tags selected)
    const matchesTags = activeTags.length === 0 ||
      project.tags.some(tag => activeTags.includes(tag));

    return matchesSearch && matchesTags;
  });

  renderProjects(filtered);
}

// Setup smooth scroll for navigation
function setupSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') {
        e.preventDefault();
        return;
      }

      const targetId = href.substring(1);
      const target = document.getElementById(targetId);
      
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        
        // Update URL without jumping
        history.pushState(null, '', href);
      }
    });
  });
}

// Setup FAQ accordion
function setupFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (!question) return;

    question.addEventListener('click', () => {
      const isExpanded = question.getAttribute('aria-expanded') === 'true';
      const answer = item.querySelector('.faq-answer');
      
      // Close all other items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          const otherQuestion = otherItem.querySelector('.faq-question');
          const otherAnswer = otherItem.querySelector('.faq-answer');
          if (otherQuestion && otherAnswer) {
            otherQuestion.setAttribute('aria-expanded', 'false');
            otherItem.setAttribute('aria-expanded', 'false');
            otherAnswer.style.maxHeight = '0';
          }
        }
      });

      // Toggle current item
      question.setAttribute('aria-expanded', !isExpanded ? 'true' : 'false');
      item.setAttribute('aria-expanded', !isExpanded ? 'true' : 'false');
      
      if (answer) {
        if (!isExpanded) {
          answer.style.maxHeight = answer.scrollHeight + 'px';
        } else {
          answer.style.maxHeight = '0';
        }
      }
    });

    // Keyboard support
    question.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        question.click();
      }
    });
  });
}

// Update current year in footer
function updateCurrentYear() {
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

// Setup scroll to top button
function setupScrollToTop() {
  const scrollButton = document.getElementById('scroll-to-top');
  if (!scrollButton) return;

  function toggleScrollButton() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    if (scrollTop > 300) {
      scrollButton.setAttribute('aria-hidden', 'false');
    } else {
      scrollButton.setAttribute('aria-hidden', 'true');
    }
  }

  toggleScrollButton();
  window.addEventListener('scroll', toggleScrollButton, { passive: true });

  scrollButton.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// Keep tooltip positions updated on scroll/resize
window.addEventListener('scroll', () => {
  if (window.positionTipCard && window.currentTarget) {
    window.positionTipCard(window.currentTarget);
  }
}, { passive: true });

window.addEventListener('resize', () => {
  if (window.positionTipCard && window.currentTarget) {
    window.positionTipCard(window.currentTarget);
  }
});

