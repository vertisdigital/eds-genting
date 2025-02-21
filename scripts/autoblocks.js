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
      
      // Process each tab section
      tabElements.forEach((section, index) => {
        const titleText = section.getAttribute('data-tabtitle');
        console.log('Creating tab:', { index, title: titleText });
        
        const tabTitle = document.createElement('div');
        tabTitle.textContent = titleText;
        tabTitle.className = 'tab-title';
        tabTitle.setAttribute('data-tab-index', index);
        
        // Add click handler to each tab title
        tabTitle.addEventListener('click', function() {
          console.log('Tab clicked directly:', this.textContent);
          
          // Remove active class from all tabs and panels
          tabNav.querySelectorAll('.tab-title').forEach(tab => tab.classList.remove('active'));
          tabWrapper.querySelectorAll('.tab').forEach(panel => panel.classList.remove('active'));
          
          // Add active class to clicked tab and corresponding panel
          this.classList.add('active');
          tabWrapper.children[index].classList.add('active');
        });
        
        if (index === 0) tabTitle.classList.add('active');
        
        const clonedSection = section.cloneNode(true);
        clonedSection.classList.add('tab', 'block');
        clonedSection.setAttribute('data-block-name', 'tab');
        clonedSection.setAttribute('data-block-status', 'loaded');
        clonedSection.classList.toggle('active', index === 0);
        
        tabNav.appendChild(tabTitle);
        tabWrapper.appendChild(clonedSection);
      });

      tabsContainer.appendChild(tabNav);
      tabsContainer.appendChild(tabWrapper);
      tabElements.forEach(section => section.remove());
      main.prepend(tabsContainer);
      
      console.log('Tab setup complete with handlers attached');
    }
  } catch (error) {
    console.error('Error in handleTabStyles:', error);
    throw new Error(`Error in handleTabStyles: ${error.message}`);
  }
}

export default function processTabs(main) {
  handleTabStyles(main);
}
