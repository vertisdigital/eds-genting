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

  const topContainer = document.createElement('div');
  topContainer.classList = 'container-xl container-lg container-md container-sm';

  const tabsWrapper = document.createElement('div');
  tabsWrapper.classList.add('tabs-container', 'block');
  tabsWrapper.dataset.blockName = 'tabs';

  const tabsNav = document.createElement('div');
  tabsNav.classList.add('tabs-header', 'row');

  const tabsContent = document.createElement('div');
  tabsContent.classList.add('tabs-content');

  // Store all blocks that need to be loaded
  const blocksToLoad = new Set();

  sections.forEach((section, index) => {
    const metadata = section.querySelector(
      '.section-metadata > div :last-child',
    );
    const tabTitle = metadata
      ? metadata.textContent.trim()
      : `Tab ${index + 1}`;

    const tabButton = document.createElement('div');
    tabButton.classList.add('tab-title', 'col-xl-6', 'col-lg-6', 'col-md-3', 'col-sm-2');
    tabButton.dataset.index = index;
    tabButton.textContent = tabTitle;

    const tabPanel = document.createElement('div');
    tabPanel.classList.add('tab-panel');
    if (index === 0) tabPanel.classList.add('active');

    // Preserve block information and collect blocks to load
    const blocks = section.querySelectorAll('div[class]');
    blocks.forEach(block => {
      const classes = Array.from(block.classList);
      classes.forEach(className => {
        if (!className.includes('section-metadata') && 
            !className.startsWith('tabs-') && 
            !className.startsWith('col-')) {
          block.dataset.blockName = className;
          blocksToLoad.add(className);
        }
      });
    });

    // Clone with block information preserved
    const clonedContent = section.cloneNode(true);
    clonedContent.querySelector('.section-metadata')?.remove();

    // Process blocks in cloned content
    const clonedBlocks = clonedContent.querySelectorAll('div[data-block-name]');
    clonedBlocks.forEach(block => {
      block.classList.add('block', block.dataset.blockName);
    });

    moveInstrumentation(section, tabPanel);

    while (clonedContent.firstChild) {
      tabPanel.appendChild(clonedContent.firstChild);
    }

    tabsNav.appendChild(tabButton);
    tabsContent.appendChild(tabPanel);
  });

  // Remove the original sections
  sections.forEach((section) => section.parentNode.removeChild(section));

  tabsWrapper.appendChild(tabsNav);
  tabsWrapper.appendChild(tabsContent);
  topContainer.appendChild(tabsWrapper);

  // Insert at the original position
  const firstSection = sections[0];
  if (firstSection && firstSection.parentNode) {
    firstSection.parentNode.insertBefore(topContainer, firstSection);
  } else {
    main.appendChild(topContainer);
  }

  // Handle tab switching with block loading
  tabsNav.addEventListener('click', async (event) => {
    const tabButton = event.target.closest('.tab-title');
    if (!tabButton) return;

    const index = parseInt(tabButton.dataset.index, 10);
    if (Number.isNaN(index)) return;

    // Update tabs
    tabsWrapper.querySelectorAll('.tab-title').forEach(btn => {
      btn.classList.remove('active');
    });
    tabButton.classList.add('active');

    // Update panels
    tabsWrapper.querySelectorAll('.tab-panel').forEach(panel => {
      panel.classList.remove('active');
    });
    
    const activePanel = tabsContent.children[index];
    if (activePanel) {
      activePanel.classList.add('active');
      
      // Load blocks in the newly active panel
      const blocks = activePanel.querySelectorAll('[data-block-name]');
      await Promise.all(Array.from(blocks).map(block => loadBlock(block)));
    }
  });

  // Load blocks in the first tab immediately
  const firstPanel = tabsContent.querySelector('.tab-panel.active');
  if (firstPanel) {
    const blocks = firstPanel.querySelectorAll('[data-block-name]');
    Promise.all(Array.from(blocks).map(block => loadBlock(block)));
  }

  // Preload CSS for all blocks
  blocksToLoad.forEach(blockName => {
    const cssPath = `${window.hlx.codeBasePath}/blocks/${blockName}/${blockName}.css`;
    loadCSS(cssPath);
  });
}