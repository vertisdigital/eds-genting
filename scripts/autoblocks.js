/**
 * Process all the tab auto blocks
 * @param {Element} main The container element
 */
export default function processTabs(main, moveInstrumentation) {
  const sections = [
    ...main.querySelectorAll('[data-aue-model="tabs"]:not(.section-metadata)'),
  ];
  if (sections.length === 0) return;

  const topContainer = document.createElement('div');
  topContainer.classList = 'container-xl container-lg container-md container-sm';

  const tabsWrapper = document.createElement('div');
  tabsWrapper.classList.add('tabs-container');

  const tabsNav = document.createElement('div');
  tabsNav.classList.add('tabs-header');

  const tabsContent = document.createElement('div');
  tabsContent.classList.add('tabs-content-wrapper');

  sections.forEach((section, index) => {
    // Get tab title from metadata
    const metadata = section.querySelector('.section-metadata');
    let tabTitle = `Tab ${index + 1}`; // Default title
    
    if (metadata) {
      const titleDiv = metadata.querySelector('div:last-child');
      if (titleDiv && titleDiv.textContent.trim()) {
        // Get only the second part after "tabtitle"
        const titleParts = titleDiv.textContent.trim().split(' ');
        if (titleParts.length > 1) {
          tabTitle = titleParts.slice(1).join(' '); // Get everything after "tabtitle"
        }
      }
    }

    // Create tab button
    const tabButton = document.createElement('button');
    tabButton.classList.add('tab-title');
    tabButton.setAttribute('role', 'tab');
    tabButton.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
    tabButton.dataset.tabIndex = index;
    tabButton.textContent = tabTitle;
    tabButton.type = 'button';
    tabButton.style.pointerEvents = 'auto'; // Ensure clicks are captured
    tabButton.style.cursor = 'pointer';

    // Add individual click handler for debugging
    tabButton.addEventListener('click', (e) => {
      console.log('Direct button click:', e.target);
    });

    // Create tab panel
    const tabPanel = document.createElement('div');
    tabPanel.classList.add('tab-panel');
    tabPanel.setAttribute('role', 'tabpanel');
    tabPanel.setAttribute('aria-hidden', index === 0 ? 'false' : 'true');
    
    // Set initial active state
    if (index === 0) {
      tabButton.classList.add('active');
      tabPanel.classList.add('active');
    }

    // Move content to panel
    const contentElements = Array.from(section.children).filter(child => 
      !child.classList?.contains('section-metadata')
    );

    contentElements.forEach(element => {
      const clone = element.cloneNode(true);
      moveInstrumentation(element, clone);
      tabPanel.appendChild(clone);
    });

    tabsNav.appendChild(tabButton);
    tabsContent.appendChild(tabPanel);
  });

  // Remove original sections after cloning content
  sections.forEach(section => section.remove());

  // Build tab structure
  tabsWrapper.appendChild(tabsNav);
  tabsWrapper.appendChild(tabsContent);
  topContainer.appendChild(tabsWrapper);
  main.appendChild(topContainer);

  // Add click handler using event delegation
  tabsWrapper.addEventListener('click', (event) => {
    console.log('Tab click event fired', event.target);
    const clickedTab = event.target.closest('.tab-title');
    if (!clickedTab) {
      console.log('No tab title found');
      return;
    }
    console.log('Clicked tab:', clickedTab);

    const index = parseInt(clickedTab.dataset.tabIndex, 10);
    const allTabs = tabsNav.querySelectorAll('.tab-title');
    const allPanels = tabsContent.querySelectorAll('.tab-panel');
    console.log('Found tabs:', allTabs.length, 'panels:', allPanels.length);

    // Update tabs
    allTabs.forEach((tab, i) => {
      const isSelected = i === index;
      tab.classList.toggle('active', isSelected);
      tab.setAttribute('aria-selected', isSelected);
    });

    // Update panels
    allPanels.forEach((panel, i) => {
      const isVisible = i === index;
      panel.classList.toggle('active', isVisible);
      panel.setAttribute('aria-hidden', !isVisible);
    });
  });
}
