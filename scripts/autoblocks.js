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
      
      tabElements.forEach(section => section.remove());
      main.prepend(tabsContainer);

      // Add global click handler
      document.addEventListener('click', function(e) {
        const clickedTab = e.target.closest('.tab-link');
        if (!clickedTab || !tabsContainer.contains(clickedTab)) return;
        
        e.preventDefault();
        
        console.log('Tab clicked:', clickedTab.textContent);
        
        const index = parseInt(clickedTab.getAttribute('data-tab-index'), 10);
        const allTabs = tabNav.querySelectorAll('.tab-link');
        const allContent = tabWrapper.querySelectorAll('.tab');
        
        // Remove active class from all tabs and content
        allTabs.forEach(tab => tab.classList.remove('active'));
        allContent.forEach(content => content.classList.remove('active'));
        
        // Add active class to clicked tab and corresponding content
        clickedTab.classList.add('active');
        allContent[index].classList.add('active');
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
