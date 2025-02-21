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
      tabNav.style.display = 'flex';
      
      const tabWrapper = document.createElement('div');
      tabWrapper.className = 'tab-wrapper';
      
      // Store references to all tabs and panels
      const tabs = [];
      const panels = [];
      
      // Process each tab section
      tabElements.forEach((section, index) => {
        const titleText = section.getAttribute('data-tabtitle');
        console.log('Creating tab:', { index, title: titleText });
        
        const tabTitle = document.createElement('div');
        tabTitle.textContent = titleText;
        tabTitle.className = 'tab-title';
        tabTitle.setAttribute('data-tab-index', index);
        if (index === 0) tabTitle.classList.add('active');
        
        const clonedSection = section.cloneNode(true);
        clonedSection.classList.add('tab', 'block');
        clonedSection.setAttribute('data-block-name', 'tab');
        clonedSection.setAttribute('data-block-status', 'loaded');
        clonedSection.classList.toggle('active', index === 0);
        
        // Store references
        tabs.push(tabTitle);
        panels.push(clonedSection);
        
        tabNav.appendChild(tabTitle);
        tabWrapper.appendChild(clonedSection);
      });

      // Build structure
      tabsContainer.appendChild(tabNav);
      tabsContainer.appendChild(tabWrapper);
      tabElements.forEach(section => section.remove());
      main.prepend(tabsContainer);

      // Add click handlers after DOM is built
      tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => {
          console.log('Tab clicked:', tab.textContent);
          
          // Update tabs
          tabs.forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
          
          // Update panels
          panels.forEach(p => p.classList.remove('active'));
          panels[index].classList.add('active');
        });
      });
      
      console.log('Setup complete:', {
        tabs: tabs.length,
        panels: panels.length,
        activeTab: tabs.find(t => t.classList.contains('active'))?.textContent
      });
    }
  } catch (error) {
    console.error('Error in handleTabStyles:', error);
    throw new Error(`Error in handleTabStyles: ${error.message}`);
  }
}

export default function processTabs(main) {
  handleTabStyles(main);
}
