import { loadCSS } from './aem.js';
import Heading from '../shared-components/Heading.js';
import stringToHTML from '../shared-components/Utility.js';
/**
 * Process all the tab auto blocks
 * @param {Element} main The container element
 */
function handleTabStyles(main) {
  try {
    console.log('Starting handleTabStyles');
    console.log('Current main HTML:', main.innerHTML);

    // Look for sections with data-tabtitle attribute
    const tabElements = main.querySelectorAll('div[data-tabtitle]');
    console.log('Found tab elements:', tabElements.length, tabElements);
    
    if (tabElements.length > 0) {
      // Create tabs container
      const tabsContainer = document.createElement('div');
      tabsContainer.className = 'tabs-container section tab-container';
      tabsContainer.setAttribute('data-section-status', 'loaded');
      
      // Create tab navigation
      const tabNav = document.createElement('div');
      tabNav.className = 'tab-nav';
      
      // Create tab wrapper for content
      const tabWrapper = document.createElement('div');
      tabWrapper.className = 'tab-wrapper';
      
      // Process each tab
      tabElements.forEach((section, index) => {
        const tabTitle = section.getAttribute('data-tabtitle');
        
        // Create tab link
        const tabLink = document.createElement('a');
        tabLink.textContent = tabTitle;
        tabLink.href = '#';
        tabLink.className = 'tab-link';
        tabLink.setAttribute('data-tab-index', index);
        
        // Clone and prepare content
        const clonedSection = section.cloneNode(true);
        clonedSection.classList.add('tab', 'block');
        clonedSection.setAttribute('data-block-name', 'tab');
        clonedSection.setAttribute('data-block-status', 'loaded');
        
        // Set initial active states
        if (index === 0) {
          tabLink.classList.add('active');
          clonedSection.classList.add('active');
        }
        
        tabNav.appendChild(tabLink);
        tabWrapper.appendChild(clonedSection);
      });

      // Build structure
      tabsContainer.appendChild(tabNav);
      tabsContainer.appendChild(tabWrapper);
      
      // Add click handler to tab navigation
      tabNav.addEventListener('click', (e) => {
        e.preventDefault();
        const link = e.target.closest('.tab-link');
        if (!link) return;
        
        const index = parseInt(link.getAttribute('data-tab-index'), 10);
        
        // Update active states
        tabNav.querySelectorAll('.tab-link').forEach(lnk => lnk.classList.remove('active'));
        link.classList.add('active');
        
        // Show/hide content using classes instead of style
        tabWrapper.querySelectorAll('.tab').forEach((tab, i) => {
          if (i === index) {
            tab.classList.add('active');
          } else {
            tab.classList.remove('active');
          }
        });
      });
      
      // Replace only the tab sections
      tabElements.forEach(section => section.remove());
      main.prepend(tabsContainer);
    }
  } catch (error) {
    console.error('Error in handleTabStyles:', error);
  }
}

export default function processTabs(main) {
  handleTabStyles(main);
}
