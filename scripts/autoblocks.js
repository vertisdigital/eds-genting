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
 
  // Process each tabs section
  sections.forEach((tabsSection) => {
    // Create tabs container
    const tabsContainer = document.createElement('div');
    tabsContainer.classList.add('tabs-container');
    tabsContainer.dataset.aueModel = 'tabs';
 
    // Create tabs header
    const tabsHeader = document.createElement('div');
    tabsHeader.classList.add('tabs-header');
 
    // Create tabs content
    const tabsContent = document.createElement('div');
    tabsContent.classList.add('tabs-content');
 
    // Get all tab sections
    const tabSections = Array.from(tabsSection.children).filter(
      child => !child.classList.contains('section-metadata')
    );
 
    // Process each tab
    tabSections.forEach((section, index) => {
      // Get tab title from metadata
      const metadata = section.querySelector('.section-metadata');
      let tabTitle = `Tab ${index + 1}`;
      if (metadata) {
        const titleDiv = metadata.querySelector('div:last-child');
        if (titleDiv && titleDiv.textContent.trim()) {
          tabTitle = titleDiv.textContent.trim().replace('tabtitle ', '');
        }
      }
 
      // Create tab button
      const tabButton = document.createElement('div');
      tabButton.classList.add('tab-title');
      tabButton.dataset.index = index;
      tabButton.textContent = tabTitle;
 
      // Create tab panel
      const tabPanel = document.createElement('div');
      tabPanel.classList.add('tab-panel');
      if (index === 0) {
        tabButton.classList.add('active');
        tabPanel.classList.add('active');
      }
 
      // Process blocks in the section
      const blocks = section.querySelectorAll('div[class]');
      blocks.forEach(block => {
        const classes = Array.from(block.classList);
        classes.forEach(className => {
          if (!className.includes('section-metadata') && 
              !className.startsWith('tabs-')) {
            block.dataset.blockName = className;
            if (index === 0) {
              loadBlock(block);
            }
          }
        });
      });
 
      // Move section content to panel
      while (section.firstChild) {
        if (!section.firstChild.classList?.contains('section-metadata')) {
          tabPanel.appendChild(section.firstChild);
        } else {
          section.removeChild(section.firstChild);
        }
      }
 
      tabsHeader.appendChild(tabButton);
      tabsContent.appendChild(tabPanel);
    });
 
    // Build tabs structure
    tabsContainer.appendChild(tabsHeader);
    tabsContainer.appendChild(tabsContent);
 
    // Replace original section with tabs container
    tabsSection.parentNode.replaceChild(tabsContainer, tabsSection);
 
    // Handle tab switching
    tabsContainer.addEventListener('click', async (event) => {
      const tabButton = event.target.closest('.tab-title');
      if (!tabButton) return;
 
      const index = parseInt(tabButton.dataset.index, 10);
      if (Number.isNaN(index)) return;
 
      // Update tabs
      tabsContainer.querySelectorAll('.tab-title').forEach(btn => {
        btn.classList.remove('active');
      });
      tabButton.classList.add('active');
 
      // Update panels
      const panels = tabsContent.querySelectorAll('.tab-panel');
      panels.forEach(panel => {
        panel.classList.remove('active');
      });
 
      const activePanel = panels[index];
      if (activePanel) {
        activePanel.classList.add('active');
        // Load blocks in newly visible panel
        const blocks = activePanel.querySelectorAll('[data-block-name]');
        await Promise.all(Array.from(blocks).map(block => loadBlock(block)));
      }
    });
  });
}