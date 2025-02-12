/**
 * Process all the tab auto blocks
 * @param {Element} main The container element
 */
export default function processTabs(main, moveInstrumentation) {
  // Find only the top-level tab sections
  const sections = [
    ...main.querySelectorAll('[data-aue-model="tabs"]'),
  ];
  
  if (!sections.length) return;

  sections.forEach((tabSection) => {
    // Skip if this is a nested tab
    if (tabSection.closest('[data-aue-model="tabs"]') !== tabSection) {
      return;
    }

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

    // Store original content references
    const tabContents = tabBlocks.map(block => ({
      content: block,
      title: block.hasAttribute('data-richtext-prop') ? 
        block.textContent.trim() : 
        (block.querySelector('[data-aue-prop="heading"]')?.textContent.trim() || `Tab ${index + 1}`)
    }));

    // Create tabs for each content block
    tabContents.forEach(({ content, title }, index) => {
      // Create tab button
      const tabButton = document.createElement('button');
      tabButton.classList.add('tab-title');
      tabButton.textContent = title;
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
      tabPanel.appendChild(content);

      // Add button to nav and panel to content
      tabsNav.appendChild(tabButton);
      tabsContent.appendChild(tabPanel);
    });

    // Add click handlers
    tabsNav.addEventListener('click', (event) => {
      const clickedTab = event.target.closest('.tab-title');
      if (!clickedTab) return;

      // Store the index before any DOM modifications
      const index = parseInt(clickedTab.dataset.index, 10);
      const allTabs = tabsNav.querySelectorAll('.tab-title');
      const allPanels = tabsContent.querySelectorAll('.tab-panel');

      // Update tab states
      allTabs.forEach(tab => {
        tab.classList.remove('active');
        tab.setAttribute('aria-selected', 'false');
      });
      clickedTab.classList.add('active');
      clickedTab.setAttribute('aria-selected', 'true');

      // Update panel states
      allPanels.forEach(panel => panel.classList.remove('active'));
      if (allPanels[index]) {
        allPanels[index].classList.add('active');
      }

      // Prevent any default behavior
      event.preventDefault();
      event.stopPropagation();
    });

    // Assemble the tabs structure
    tabsWrapper.appendChild(tabsNav);
    tabsWrapper.appendChild(tabsContent);

    // Clear original content except metadata
    const metadata = tabSection.querySelector('.section-metadata');
    tabSection.innerHTML = '';
    if (metadata) {
      tabSection.appendChild(metadata);
    }
    
    // Add the new structure
    tabSection.appendChild(tabsWrapper);

    // Mark this section as processed
    tabSection.dataset.tabsProcessed = 'true';

    // Move instrumentation if needed
    if (moveInstrumentation) {
      moveInstrumentation(tabSection, tabsWrapper);
    }
  });
}