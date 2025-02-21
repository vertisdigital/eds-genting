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
      
      // Create empty div (required structure)
      const emptyDiv = document.createElement('div');
      tabsContainer.appendChild(emptyDiv);
      
      // Create tab wrapper
      const tabWrapper = document.createElement('div');
      tabWrapper.className = 'tab-wrapper';
      tabsContainer.appendChild(tabWrapper);
      
      // Move each tab section into the wrapper
      tabElements.forEach(section => {
        // Clone the section with all its content
        const clonedSection = section.cloneNode(true);
        
        // Add tab classes and attributes
        clonedSection.classList.add('tab', 'block');
        clonedSection.setAttribute('data-block-name', 'tab');
        clonedSection.setAttribute('data-block-status', 'loaded');
        
        // Keep the original data-tabtitle
        const tabTitle = section.getAttribute('data-tabtitle');
        if (tabTitle) {
          clonedSection.setAttribute('data-tabtitle', tabTitle);
        }
        
        // Add to wrapper
        tabWrapper.appendChild(clonedSection);
      });

      // Replace main content
      main.innerHTML = '';
      main.appendChild(tabsContainer);
      console.log('Successfully created tabs structure');
    }
  } catch (error) {
    console.error('Error in handleTabStyles:', error);
  }
}

export default function processTabs(main) {
  // Call handleTabStyles to set up the tab structure
  handleTabStyles(main);
  
  // Add click handlers for tab switching
  const tabContainer = main.querySelector('.tab-container');
  if (tabContainer) {
    tabContainer.addEventListener('click', (e) => {
      const clickedTab = e.target.closest('[data-tabtitle]');
      if (clickedTab) {
        // Remove active class from all tabs
        tabContainer.querySelectorAll('[data-tabtitle]').forEach(tab => {
          tab.classList.remove('active');
        });
        
        // Add active class to clicked tab
        clickedTab.classList.add('active');
      }
    });
    
    // Activate first tab by default
    const firstTab = tabContainer.querySelector('[data-tabtitle]');
    if (firstTab) {
      firstTab.classList.add('active');
    }
  }
}
