/**
 * Creates the basic tab structure
 * @param {Element} main The container element
 * @returns {Object|null} The created container elements or null
 */
function createTabStructure(main) {
  const tabElements = main.querySelectorAll('div[data-tabtitle]');
  if (tabElements.length === 0) return null;

  const tabsContainer = document.createElement('div');
  tabsContainer.className = 'tabs-container section tab-container';
  tabsContainer.setAttribute('data-section-status', 'loaded');
  
  const tabNav = document.createElement('div');
  tabNav.className = 'tab-nav';
  tabNav.style.display = 'flex';
  
  const tabWrapper = document.createElement('div');
  tabWrapper.className = 'tab-wrapper';

  return {
    tabElements,
    tabsContainer,
    tabNav,
    tabWrapper
  };
}

/**
 * Creates individual tab elements
 * @param {Element} section The section to create tab from
 * @param {number} index Tab index
 * @returns {Object} Created tab elements
 */
function createTabElement(section, index) {
  const titleText = section.getAttribute('data-tabtitle');
  
  const tabTitle = document.createElement('div');
  tabTitle.textContent = titleText;
  tabTitle.className = 'tab-title';
  tabTitle.setAttribute('role', 'tab');
  tabTitle.setAttribute('data-tab-index', index);
  tabTitle.setAttribute('tabindex', '0');
  if (index === 0) tabTitle.classList.add('active');
  
  const tabPanel = section.cloneNode(true);
  tabPanel.classList.add('tab', 'block');
  tabPanel.setAttribute('data-block-name', 'tab');
  tabPanel.setAttribute('data-block-status', 'loaded');
  tabPanel.setAttribute('role', 'tabpanel');
  tabPanel.setAttribute('data-tab-index', index);
  tabPanel.classList.toggle('active', index === 0);

  return { tabTitle, tabPanel };
}

/**
 * Assembles the tab structure
 * @param {Object} elements The tab elements to assemble
 * @returns {Object} References to assembled elements
 */
function assembleTabStructure({ tabElements, tabsContainer, tabNav, tabWrapper }) {
  const tabs = [];
  const panels = [];

  tabElements.forEach((section, index) => {
    const { tabTitle, tabPanel } = createTabElement(section, index);
    
    tabs.push(tabTitle);
    panels.push(tabPanel);
    
    tabNav.appendChild(tabTitle);
    tabWrapper.appendChild(tabPanel);
  });

  tabsContainer.appendChild(tabNav);
  tabsContainer.appendChild(tabWrapper);

  return { tabs, panels, container: tabsContainer };
}

/**
 * Updates tab states
 * @param {Array} tabs Tab elements
 * @param {Array} panels Panel elements
 * @param {number} activeIndex Index to activate
 */
function updateTabStates(tabs, panels, activeIndex) {
  console.log('Updating tab states:', {
    activeIndex,
    totalTabs: tabs.length,
    totalPanels: panels.length
  });

  // Update tabs
  tabs.forEach(tab => tab.classList.remove('active'));
  tabs[activeIndex].classList.add('active');
  
  // Update panels
  panels.forEach(panel => panel.classList.remove('active'));
  panels[activeIndex].classList.add('active');

  console.log('States updated:', {
    activeTab: tabs[activeIndex].textContent,
    activePanel: panels[activeIndex].getAttribute('data-tabtitle')
  });
}

/**
 * Adds click functionality to tabs
 * @param {Object} elements References to tab elements
 */
function addTabFunctionality({ tabs, panels, container }) {
  if (!tabs || !panels || !container) {
    console.warn('Missing required elements:', { tabs, panels, container });
    return;
  }
  
  console.log('Adding click handlers to tabs:', {
    numTabs: tabs.length,
    numPanels: panels.length,
    container: container.outerHTML
  });

  // Add direct click handlers to each tab
  tabs.forEach((tab, index) => {
    console.log('Setting up tab:', {
      index,
      tab: tab.outerHTML,
      panel: panels[index].outerHTML
    });

    // Add click handler directly to tab
    tab.onclick = (e) => {
      console.log('Tab clicked directly:', {
        index,
        target: e.target,
        currentTarget: e.currentTarget
      });

      // Update tabs
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Update panels
      panels.forEach(p => p.classList.remove('active'));
      panels[index].classList.add('active');
    };

    // Also add click handler using addEventListener
    tab.addEventListener('click', function(e) {
      console.log('Tab clicked via event listener:', {
        index,
        target: e.target,
        currentTarget: e.currentTarget
      });
    });

    // Make tab clickable
    tab.style.cursor = 'pointer';
    tab.setAttribute('role', 'button');
    tab.setAttribute('tabindex', '0');
  });

  // Also add container-level delegation as backup
  container.addEventListener('click', (e) => {
    const clickedTab = e.target.closest('.tab-title');
    if (!clickedTab) return;

    console.log('Tab clicked via delegation:', {
      target: e.target,
      clickedTab: clickedTab,
      index: clickedTab.getAttribute('data-tab-index')
    });
  });

  // Log final setup
  console.log('Tab handlers attached:', {
    container: container.outerHTML,
    tabs: tabs.map(t => t.outerHTML),
    panels: panels.map(p => p.outerHTML)
  });
}

/**
 * Main function to process tabs
 * @param {Element} main The container element
 */
function processTabs(main) {
  try {
    console.log('Processing tabs for:', main);
    
    // Create basic structure
    const structure = createTabStructure(main);
    if (!structure) {
      console.log('No tab elements found');
      return;
    }

    console.log('Tab structure created:', structure);

    // Assemble the structure
    const elements = assembleTabStructure(structure);
    console.log('Tab elements assembled:', elements);

    // Add to DOM first
    main.prepend(elements.container);

    // Remove original sections
    structure.tabElements.forEach(section => section.remove());

    // Add functionality after DOM insertion
    addTabFunctionality(elements);

    console.log('Tab setup complete');
  } catch (error) {
    console.error('Error processing tabs:', error);
  }
}

export default processTabs;
