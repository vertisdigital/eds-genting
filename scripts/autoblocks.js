/**
 * Process all the tab auto blocks
 * @param {Element} main The container element
 */
export default function processTabs(main, moveInstrumentation) {
  console.log('Starting processTabs');
  
  if (!main) {
    console.warn('Main element is undefined in processTabs');
    return;
  }

  // Find only the top-level tab sections
  const sections = [
    ...main.querySelectorAll('[data-aue-model="tabs"]'),
  ];
  console.log('Found tab sections:', sections.length);
  
  if (!sections.length) return;

  sections.forEach((tabSection) => {
    // Skip if this is a nested tab
    if (tabSection.closest('[data-aue-model="tabs"]') !== tabSection) {
      return;
    }

    console.log(`Processing tab section ${sections.indexOf(tabSection)}`);
    
    // Ensure tab section has the required classes
    tabSection.classList.add('tabs', 'block');
    
    // Create container structure
    const tabsWrapper = document.createElement('div');
    tabsWrapper.classList.add('tabs-container');

    const tabsNav = document.createElement('div');
    tabsNav.classList.add('tabs-header');

    const tabsContent = document.createElement('div');
    tabsContent.classList.add('tabs-content');

    // Get all direct children excluding metadata
    const tabBlocks = Array.from(tabSection.children).filter(child => 
      !child.classList.contains('section-metadata')
    );

    // Create tabs for each block
    tabBlocks.forEach((block, index) => {
      // Create tab button
      const tabButton = document.createElement('button');
      tabButton.classList.add('tab-title');
      
      // Get tab title from the content
      let tabTitle = 'Tab ' + (index + 1);
      if (block.hasAttribute('data-richtext-prop')) {
        // For text blocks, use their content
        tabTitle = block.textContent.trim();
      } else if (block.querySelector('[data-aue-prop="heading"]')) {
        // For container blocks, try to get the heading
        tabTitle = block.querySelector('[data-aue-prop="heading"]').textContent.trim();
      }
      
      tabButton.textContent = tabTitle;
      tabButton.setAttribute('role', 'tab');
      tabButton.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
      tabButton.dataset.index = index.toString();

      // Create tab panel
      const tabPanel = document.createElement('div');
      tabPanel.classList.add('tab-panel');
      tabPanel.setAttribute('role', 'tabpanel');
      tabPanel.id = `tab-panel-${index}`;
      tabButton.setAttribute('aria-controls', `tab-panel-${index}`);

      // Set initial active state for first tab
      if (index === 0) {
        tabButton.classList.add('active');
        tabPanel.classList.add('active');
      }

      // Move the content to panel
      tabPanel.appendChild(block);

      // Add button to nav and panel to content
      tabsNav.appendChild(tabButton);
      tabsContent.appendChild(tabPanel);
    });

    // Add click handlers
    tabsNav.addEventListener('click', (event) => {
      const clickedTab = event.target.closest('.tab-title');
      if (!clickedTab) return;

      const index = parseInt(clickedTab.dataset.index, 10);
      const allTabs = tabsNav.querySelectorAll('.tab-title');
      const allPanels = tabsContent.querySelectorAll('.tab-panel');

      // Remove active class from all tabs and panels
      allTabs.forEach(tab => {
        tab.classList.remove('active');
        tab.setAttribute('aria-selected', 'false');
      });
      allPanels.forEach(panel => panel.classList.remove('active'));

      // Add active class to clicked tab and corresponding panel
      clickedTab.classList.add('active');
      clickedTab.setAttribute('aria-selected', 'true');
      allPanels[index].classList.add('active');
    });

    // Create horizontal line element
    const horizontalLine = document.createElement('div');
    horizontalLine.classList.add('tabs-horizontal-line');

    // Assemble the tabs structure
    tabsWrapper.appendChild(tabsNav);
    tabsWrapper.appendChild(horizontalLine);
    tabsWrapper.appendChild(tabsContent);

    // Clear original content except metadata
    const metadata = tabSection.querySelector('.section-metadata');
    tabSection.innerHTML = '';
    if (metadata) {
      tabSection.appendChild(metadata);
    }
    
    // Add the new structure
    tabSection.appendChild(tabsWrapper);

    // Move instrumentation if needed
    if (moveInstrumentation) {
      moveInstrumentation(tabSection, tabsWrapper);
    }

    // Debug logging
    console.log('Tab section classes:', tabSection.classList);
    console.log('Tab structure:', {
      wrapper: tabsWrapper,
      nav: tabsNav,
      content: tabsContent,
      buttons: tabsNav.querySelectorAll('.tab-title'),
      panels: tabsContent.querySelectorAll('.tab-panel')
    });
  });
}