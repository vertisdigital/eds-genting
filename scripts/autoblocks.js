/**
 * Process all the tab auto blocks
 * @param {Element} main The container element
 */
function handleTabStyles(main) {
  try {
    const tabElements = main.querySelectorAll('div[data-tabtitle]');
    console.log('Found tab elements:', tabElements.length);
    
    if (tabElements.length > 0) {
      const tabsContainer = document.createElement('div');
      tabsContainer.className = 'tabs-container section tab-container';
      tabsContainer.setAttribute('data-section-status', 'loaded');
      
      const tabNav = document.createElement('div');
      tabNav.className = 'tab-nav';
      
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
        
        // Add click handler with debugging
        tabLink.addEventListener('click', function clickHandler(e) {
          console.log('Tab clicked:', {
            index,
            title: tabTitle,
            target: e.target,
            currentTarget: e.currentTarget
          });
          
          e.preventDefault();
          e.stopPropagation();
          
          // Get fresh references to elements
          const currentTabs = tabNav.querySelectorAll('.tab-link');
          const currentContent = tabWrapper.querySelectorAll('.tab');
          
          console.log('Found elements:', {
            tabs: currentTabs.length,
            content: currentContent.length
          });
          
          // Update active states
          currentTabs.forEach(t => t.classList.remove('active'));
          currentContent.forEach(c => c.classList.remove('active'));
          
          this.classList.add('active');
          currentContent[index].classList.add('active');
          
          console.log('Tab switch complete');
          return false;
        });
        
        if (index === 0) tabLink.classList.add('active');
        
        const clonedSection = section.cloneNode(true);
        clonedSection.classList.add('tab', 'block');
        clonedSection.setAttribute('data-block-name', 'tab');
        clonedSection.setAttribute('data-block-status', 'loaded');
        clonedSection.classList.toggle('active', index === 0);
        
        tabNav.appendChild(tabLink);
        tabWrapper.appendChild(clonedSection);
      });

      tabsContainer.appendChild(tabNav);
      tabsContainer.appendChild(tabWrapper);
      
      // Test click handler after DOM is built
      const firstTab = tabNav.querySelector('.tab-link');
      console.log('Testing click on first tab:', firstTab);
      if (firstTab) {
        firstTab.click();
      }
      
      tabElements.forEach(section => section.remove());
      main.prepend(tabsContainer);
    }
  } catch (error) {
    console.error('Error in handleTabStyles:', error);
    throw new Error(`Error in handleTabStyles: ${error.message}`);
  }
}

export default function processTabs(main) {
  handleTabStyles(main);
}
