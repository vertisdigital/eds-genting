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
    // Create main container
    const mainContainer = document.createElement('div');
    mainContainer.classList.add('container-xl', 'container-lg', 'container-md', 'container-sm');

    // Create tabs container
    const tabsContainer = document.createElement('div');
    tabsContainer.classList.add('tabs-container');

    // Create tabs header
    const tabsHeader = document.createElement('div');
    tabsHeader.classList.add('tabs-header');

    // Create tabs content
    const tabsContent = document.createElement('div');
    tabsContent.classList.add('tabs-content-wrapper');

    // Get all tab panels (excluding metadata)
    const tabPanels = Array.from(section.children).filter(
      child => !child.classList.contains('section-metadata')
    );

    // Process each panel
    tabPanels.forEach((panel, index) => {
      // Get tab title
      const metadata = panel.querySelector('.section-metadata');
      let tabTitle = `Tab ${index + 1}`;
      if (metadata) {
        const titleDivs = metadata.querySelectorAll('div > div');
        if (titleDivs.length >= 2) {
          tabTitle = titleDivs[1].textContent.trim();
        }
      }

      // Create tab button
      const tabButton = document.createElement('div');
      tabButton.classList.add('tab-title');
      tabButton.dataset.index = index;
      tabButton.textContent = tabTitle;

      // Create tab panel wrapper
      const tabPanel = document.createElement('div');
      tabPanel.classList.add('tab-panel');

      // Set initial active state
      if (index === 0) {
        tabButton.classList.add('active');
        tabPanel.classList.add('active');
      }

      // Process blocks in the panel
      const blocks = panel.querySelectorAll('div[class]');
      blocks.forEach(block => {
        if (!block.classList.contains('section-metadata')) {
          const blockClasses = Array.from(block.classList);
          const blockName = blockClasses[0]; // Get the first class as block name
          
          if (blockName) {
            const blockWrapper = document.createElement('div');
            blockWrapper.classList.add('block', blockName);
            blockWrapper.dataset.blockName = blockName;
            
            // Copy content and attributes
            blockWrapper.innerHTML = block.innerHTML;
            Array.from(block.attributes).forEach(attr => {
              if (attr.name !== 'class') {
                blockWrapper.setAttribute(attr.name, attr.value);
              }
            });

            // Load block resources for first tab
            if (index === 0) {
              loadBlock(blockWrapper);
            }

            tabPanel.appendChild(blockWrapper);
          }
        }
      });

      tabsHeader.appendChild(tabButton);
      tabsContent.appendChild(tabPanel);
    });

    // Build structure
    tabsContainer.appendChild(tabsHeader);
    tabsContainer.appendChild(tabsContent);
    mainContainer.appendChild(tabsContainer);

    // Replace section content
    section.innerHTML = '';
    section.appendChild(mainContainer);

    // Handle tab switching
    tabsHeader.addEventListener('click', async (event) => {
      const tabButton = event.target.closest('.tab-title');
      if (!tabButton) return;

      const index = parseInt(tabButton.dataset.index, 10);
      if (Number.isNaN(index)) return;

      // Update tabs
      tabsHeader.querySelectorAll('.tab-title').forEach((tab, i) => {
        tab.classList.toggle('active', i === index);
      });

      // Update panels
      const panels = tabsContent.querySelectorAll('.tab-panel');
      panels.forEach((panel, i) => {
        const isVisible = i === index;
        panel.classList.toggle('active', isVisible);

        if (isVisible) {
          // Load blocks in newly visible panel
          const blocks = panel.querySelectorAll('[data-block-name]');
          blocks.forEach(block => loadBlock(block));
        }
      });
    });
  });
}