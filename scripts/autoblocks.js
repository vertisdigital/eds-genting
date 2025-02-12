/**
 * Process all the tab auto blocks
 * @param {Element} main The container element
 */
export default function processTabs(main, moveInstrumentation) {
  console.log('Starting processTabs...');
  
  const sections = [
    ...main.querySelectorAll('[data-aue-model="tabs"]:not(.section-metadata)'),
  ];
  console.log('Found tab sections:', sections.length);
  if (sections.length === 0) return;

  const topContainer = document.createElement('div');
  topContainer.classList = 'container-xl container-lg container-md container-sm';

  const tabsWrapper = document.createElement('div');
  tabsWrapper.classList.add('tabs-container');

  const tabsNav = document.createElement('div');
  tabsNav.classList.add('tabs-header');

  const tabsContent = document.createElement('div');
  tabsContent.classList.add('tabs-content-wrapper');

  // Store panels array to maintain reference
  const panels = [];

  sections.forEach((section, index) => {
    console.log(`Processing tab section ${index}`);
    
    // Get tab title from metadata
    const metadata = section.querySelector('.section-metadata');
    let tabTitle = `Tab ${index + 1}`; // Default title
    
    if (metadata) {
      const titleDiv = metadata.querySelector('div:last-child');
      if (titleDiv && titleDiv.textContent.trim()) {
        tabTitle = titleDiv.textContent.trim().replace('tabtitle ', ''); // Remove 'tabtitle ' prefix
      }
    }
    
    console.log('Tab title:', tabTitle);

    // Create tab button
    const tabButton = document.createElement('button');
    tabButton.classList.add('tab-title');
    tabButton.setAttribute('role', 'tab');
    tabButton.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
    tabButton.setAttribute('tabindex', index === 0 ? '0' : '-1');
    tabButton.dataset.tabIndex = index;
    tabButton.textContent = tabTitle;
    tabButton.type = 'button';

    // Create tab panel
    const tabPanel = document.createElement('div');
    tabPanel.classList.add('tab-panel');
    tabPanel.setAttribute('role', 'tabpanel');
    tabPanel.setAttribute('aria-hidden', index === 0 ? 'false' : 'true');
    tabPanel.id = `tab-panel-${index}`; // Add ID for aria-controls
    tabButton.setAttribute('aria-controls', `tab-panel-${index}`); // Link button to panel
    
    // Set initial active state
    if (index === 0) {
      tabButton.classList.add('active');
      tabPanel.classList.add('active');
    }

    // Move content to tab panel
    moveInstrumentation(section, tabPanel);
    
    // Move all non-metadata content to the panel
    Array.from(section.children).forEach(child => {
      if (!child.classList?.contains('section-metadata')) {
        const clonedChild = child.cloneNode(true);
        tabPanel.appendChild(clonedChild);
      }
    });

    // Add click handler to each button individually
    tabButton.addEventListener('click', () => {
      // Remove active class from all tabs and panels
      const allTabs = tabsNav.querySelectorAll('.tab-title');
      allTabs.forEach(tab => {
        tab.classList.remove('active');
        tab.setAttribute('aria-selected', 'false');
        tab.setAttribute('tabindex', '-1');
      });

      panels.forEach(panel => {
        panel.classList.remove('active');
        panel.setAttribute('aria-hidden', 'true');
      });

      // Add active class to clicked tab and its panel
      tabButton.classList.add('active');
      tabButton.setAttribute('aria-selected', 'true');
      tabButton.setAttribute('tabindex', '0');
      tabPanel.classList.add('active');
      tabPanel.setAttribute('aria-hidden', 'false');
    });

    tabsNav.appendChild(tabButton);
    tabsContent.appendChild(tabPanel);
    panels.push(tabPanel);
  });

  // Remove original sections after cloning content
  sections.forEach(section => section.remove());

  // Build tab structure
  tabsWrapper.appendChild(tabsNav);
  tabsWrapper.appendChild(tabsContent);
  topContainer.appendChild(tabsWrapper);
  main.appendChild(topContainer);

  // Add keyboard navigation
  tabsNav.addEventListener('keydown', (event) => {
    const tabs = [...tabsNav.querySelectorAll('.tab-title')];
    const currentTab = document.activeElement;
    if (!tabs.includes(currentTab)) return;

    const currentIndex = tabs.indexOf(currentTab);
    let newIndex;

    switch (event.key) {
      case 'ArrowLeft':
        newIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
        break;
      case 'ArrowRight':
        newIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
        break;
      default:
        return;
    }

    event.preventDefault();
    tabs[newIndex].click();
    tabs[newIndex].focus();
  });

  console.log('Tab initialization complete');
}
