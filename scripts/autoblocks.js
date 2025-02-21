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
        
        // Add click handler when creating the link
        tabLink.onclick = function(e) {
          console.log('Tab clicked via onclick:', this.textContent);
          e.preventDefault();
          
          // Remove active class from all tabs and content
          tabNav.querySelectorAll('.tab-link').forEach(t => t.classList.remove('active'));
          tabWrapper.querySelectorAll('.tab').forEach(c => c.classList.remove('active'));
          
          // Add active class to clicked tab and content
          this.classList.add('active');
          tabWrapper.children[index].classList.add('active');
          
          return false; // Prevent default and stop propagation
        };
        
        if (index === 0) tabLink.classList.add('active');
        
        const clonedSection = section.cloneNode(true);
        clonedSection.classList.add('tab', 'block');
        clonedSection.setAttribute('data-block-name', 'tab');
        clonedSection.setAttribute('data-block-status', 'loaded');
        clonedSection.classList.toggle('active', index === 0);
        
        tabNav.appendChild(tabLink);
        tabWrapper.appendChild(clonedSection);
        
        console.log('Added tab:', {
          index,
          title: tabTitle,
          link: tabLink,
          content: clonedSection
        });
      });

      tabsContainer.appendChild(tabNav);
      tabsContainer.appendChild(tabWrapper);
      
      // Also try click handler on nav container
      tabNav.onclick = function(e) {
        console.log('Tab nav clicked:', e.target);
        const clickedTab = e.target.closest('.tab-link');
        if (clickedTab) {
          console.log('Found clicked tab:', clickedTab.textContent);
        }
      };
      
      tabElements.forEach(section => section.remove());
      main.prepend(tabsContainer);
      
      console.log('Tab setup complete:', {
        container: tabsContainer,
        tabs: tabNav.children.length,
        content: tabWrapper.children.length
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
