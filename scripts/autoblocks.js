/**
 * Process all the tab auto blocks
 * @param {Element} main The container element
 */
function handleTabStyles(main) {
  try {
    const tabElements = main.querySelectorAll('div[data-tabtitle]');
    
    if (tabElements.length > 0) {
      // Create main container
      const tabsContainer = document.createElement('div');
      tabsContainer.className = 'tabs-container section tab-container';
      tabsContainer.setAttribute('data-section-status', 'loaded');
      
      // Create tab navigation
      const tabNav = document.createElement('div');
      tabNav.className = 'tab-nav';
      
      // Create content wrapper
      const tabWrapper = document.createElement('div');
      tabWrapper.className = 'tab-wrapper';
      
      // Process each tab section
      tabElements.forEach((section, index) => {
        const tabTitle = section.getAttribute('data-tabtitle');
        
        const tabLink = document.createElement('a');
        tabLink.textContent = tabTitle;
        tabLink.href = '#';
        tabLink.className = 'tab-link';
        tabLink.setAttribute('data-tab-index', index);
        
        // Add click handler to each tab link
        tabLink.onclick = function(e) {
          console.log('Tab clicked:', this.textContent);
          e.preventDefault();
          
          // Get all tabs and content
          const allTabs = tabNav.querySelectorAll('.tab-link');
          const allContent = tabWrapper.querySelectorAll('.tab');
          
          // Remove active class from all
          allTabs.forEach(t => t.classList.remove('active'));
          allContent.forEach(c => c.classList.remove('active'));
          
          // Add active class to clicked tab and content
          this.classList.add('active');
          allContent[index].classList.add('active');
          
          console.log('Tab switch complete');
        };
        
        if (index === 0) tabLink.classList.add('active');
        
        const clonedSection = section.cloneNode(true);
        clonedSection.classList.add('tab', 'block');
        clonedSection.setAttribute('data-block-name', 'tab');
        clonedSection.setAttribute('data-block-status', 'loaded');
        clonedSection.classList.toggle('active', index === 0);
        
        tabNav.appendChild(tabLink);
        tabWrapper.appendChild(clonedSection);
      });

      // Build final structure
      tabsContainer.appendChild(tabNav);
      tabsContainer.appendChild(tabWrapper);
      
      tabElements.forEach(section => section.remove());
      main.prepend(tabsContainer);
      
      console.log('Tab setup complete, click handlers attached to:', 
        tabNav.querySelectorAll('.tab-link').length, 'tabs');
    }
  } catch (error) {
    throw new Error(`Error in handleTabStyles: ${error.message}`);
  }
}

export default function processTabs(main) {
  handleTabStyles(main);
}
