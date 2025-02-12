import { loadCSS } from './aem.js';
 
/**
 * Process all the tab auto blocks
 * @param {Element} main The container element
 */
export default function processTabs(main, moveInstrumentation) {
  const sections = [
    ...main.querySelectorAll('[data-aue-model="tabs"]:not(.section-metadata)'),
  ];
  if (sections.length === 0) return;
 
  // Function to load block CSS and JS
  async function loadBlock(block) {
    const blockName = block.dataset.blockName;
    if (!blockName) return;
 
    try {
      // Load block CSS
      const cssPath = `${window.hlx.codeBasePath}/blocks/${blockName}/${blockName}.css`;
      await loadCSS(cssPath);
 
      // Load block JS
      const jsPath = `${window.hlx.codeBasePath}/blocks/${blockName}/${blockName}.js`;
      try {
        const module = await import(jsPath);
        if (module.default) {
          module.default(block);
        }
      } catch (error) {
        // JS file might not exist, which is ok
        console.debug(`No JS module for block ${blockName}`);
      }
    } catch (error) {
      console.error(`Error loading block ${blockName}:`, error);
    }
  }
 
  sections.forEach((section) => {
    // Create outer container for width control
    const outerContainer = document.createElement('div');
    outerContainer.classList.add('container-xl', 'container-lg', 'container-md', 'container-sm');

    // Create tabs container
    const tabsContainer = document.createElement('div');
    tabsContainer.classList.add('tabs-container');

    // Create tabs header with row for alignment
    const tabsHeader = document.createElement('div');
    tabsHeader.classList.add('tabs-header', 'row');

    // Create tabs content
    const tabsContent = document.createElement('div');
    tabsContent.classList.add('tabs-content-wrapper');

    // Get all tab sections (excluding metadata)
    const tabSections = Array.from(section.children).filter(
      child => !child.classList.contains('section-metadata')
    );

    // Process each section
    tabSections.forEach((tabSection, index) => {
      // Get tab title
      const metadata = tabSection.querySelector('.section-metadata');
      let tabTitle = `Tab ${index + 1}`;
      if (metadata) {
        const titleDivs = metadata.querySelectorAll('div > div');
        if (titleDivs.length >= 2) {
          tabTitle = titleDivs[1].textContent.trim();
        }
      }

      // Create tab button with column classes
      const tabCol = document.createElement('div');
      tabCol.classList.add('col-6');

      const tabButton = document.createElement('div');
      tabButton.classList.add('tab-title');
      tabButton.dataset.index = index;
      tabButton.textContent = tabTitle;

      // Create tab panel
      const tabPanel = document.createElement('div');
      tabPanel.classList.add('tab-panel');

      // Set initial active state
      if (index === 0) {
        tabButton.classList.add('active');
        tabPanel.classList.add('active');
      }

      // Move content to panel
      Array.from(tabSection.children).forEach(child => {
        if (!child.classList?.contains('section-metadata')) {
          const clone = child.cloneNode(true);
          if (clone.classList && clone.classList.length > 0) {
            const blockName = clone.classList[0];
            clone.classList.add('block');
            clone.dataset.blockName = blockName;
            
            // Load block resources for first tab
            if (index === 0) {
              loadBlock(clone);
            }
          }
          tabPanel.appendChild(clone);
        }
      });

      // Add button to column and column to header
      tabCol.appendChild(tabButton);
      tabsHeader.appendChild(tabCol);
      tabsContent.appendChild(tabPanel);
    });

    // Build structure
    tabsContainer.appendChild(tabsHeader);
    tabsContainer.appendChild(tabsContent);
    outerContainer.appendChild(tabsContainer);

    // Replace section content
    section.innerHTML = '';
    section.appendChild(outerContainer);

    // Handle tab switching
    tabsHeader.addEventListener('click', (event) => {
      const clickedTab = event.target.closest('.tab-title');
      if (!clickedTab) return;

      const index = parseInt(clickedTab.dataset.index, 10);
      if (Number.isNaN(index)) return;

      // Update tabs
      const allTabs = tabsHeader.querySelectorAll('.tab-title');
      const allPanels = tabsContent.querySelectorAll('.tab-panel');

      // Remove active state from all tabs and panels
      allTabs.forEach(tab => tab.classList.remove('active'));
      allPanels.forEach(panel => panel.classList.remove('active'));

      // Add active state to clicked tab and corresponding panel
      clickedTab.classList.add('active');
      allPanels[index].classList.add('active');

      // Load blocks in newly visible panel
      const blocks = allPanels[index].querySelectorAll('[data-block-name]');
      blocks.forEach(block => {
        if (!block.classList.contains('block-loaded')) {
          loadBlock(block);
          block.classList.add('block-loaded');
        }
      });
    });
  });
}