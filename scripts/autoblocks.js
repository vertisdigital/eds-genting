import { loadCSS } from './aem.js';

/**
 * Process all the tab auto blocks with enhanced accessibility and error handling
 * @param {Element} main The container element
 * @param {Function} moveInstrumentation Function to move instrumentation
 */
export default async function processTabs(main, moveInstrumentation) {
  // Early return if no tab sections found
  const sections = [...main.querySelectorAll('[data-aue-model="tabs"]:not(.section-metadata)')];
  if (sections.length === 0) return;

  /**
   * Loads block CSS and JS with enhanced error handling
   * @param {Element} block The block element to load resources for
   */
  async function loadBlock(block) {
    const blockName = block.dataset.blockName;
    if (!blockName) return;

    try {
      const cssPath = `${window.hlx.codeBasePath}/blocks/${blockName}/${blockName}.css`;
      await loadCSS(cssPath);

      const jsPath = `${window.hlx.codeBasePath}/blocks/${blockName}/${blockName}.js`;
      const module = await import(jsPath);
      if (module.default) {
        await module.default(block);
      }
    } catch (error) {
      // Only log JS loading errors as errors, CSS/module may not exist
      if (error.message.includes('.js')) {
        console.error(`Error loading block ${blockName}:`, error);
      } else {
        console.debug(`No resources found for block ${blockName}`);
      }
    }
  }

  // Create container following proper grid hierarchy
  const topContainer = document.createElement('div');
  topContainer.className = 'container-xl';

  const row = document.createElement('div');
  row.className = 'row';
  topContainer.appendChild(row);

  const tabsWrapper = document.createElement('div');
  tabsWrapper.className = 'col-12';
  tabsWrapper.setAttribute('role', 'tablist');
  row.appendChild(tabsWrapper);

  const tabsNav = document.createElement('div');
  tabsNav.className = 'tabs-header row';
  
  const tabsContent = document.createElement('div');
  tabsContent.className = 'tabs-content';

  // Process each tab section
  sections.forEach((section, index) => {
    const metadata = section.querySelector('.section-metadata > div :last-child');
    const tabTitle = metadata?.textContent.trim() || `Tab ${index + 1}`;
    const tabId = `tab-${index}`;
    const panelId = `panel-${index}`;

    // Create accessible tab button
    const tabButton = document.createElement('button');
    tabButton.className = 'tab-title col-md-3 col-sm-6';
    tabButton.setAttribute('role', 'tab');
    tabButton.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
    tabButton.setAttribute('aria-controls', panelId);
    tabButton.id = tabId;
    tabButton.textContent = tabTitle;

    // Create accessible tab panel
    const tabPanel = document.createElement('div');
    tabPanel.className = 'tab-panel';
    tabPanel.setAttribute('role', 'tabpanel');
    tabPanel.setAttribute('aria-labelledby', tabId);
    tabPanel.id = panelId;
    tabPanel.hidden = index !== 0;

    moveInstrumentation(section, tabPanel);

    // Process blocks within the section
    const blocks = section.querySelectorAll('div[class]');
    blocks.forEach(block => {
      const blockClasses = Array.from(block.classList)
        .filter(cls => !cls.includes('section-metadata') && 
                      !cls.startsWith('tabs-') && 
                      !cls.startsWith('col-'));

      if (blockClasses.length) {
        const newBlock = document.createElement('div');
        newBlock.className = `${blockClasses[0]} block`;
        newBlock.dataset.blockName = blockClasses[0];
        
        // Copy content and non-class attributes
        newBlock.innerHTML = block.innerHTML;
        Array.from(block.attributes)
          .filter(attr => !attr.name.startsWith('class'))
          .forEach(attr => newBlock.setAttribute(attr.name, attr.value));
        
        block.replaceWith(newBlock);
        
        if (index === 0) {
          loadBlock(newBlock);
        }
      }
    });

    // Move non-metadata content to panel
    Array.from(section.children)
      .filter(child => !child.classList?.contains('section-metadata'))
      .forEach(child => tabPanel.appendChild(child));

    tabsNav.appendChild(tabButton);
    tabsContent.appendChild(tabPanel);
  });

  // Clean up and build structure
  sections.forEach(section => section.remove());
  tabsWrapper.append(tabsNav, tabsContent);
  main.appendChild(topContainer);

  // Handle tab switching with keyboard support
  tabsNav.addEventListener('click', handleTabClick);
  tabsNav.addEventListener('keydown', handleTabKeyboard);
}

/**
 * Handle tab click events
 * @param {Event} event Click event
 */
async function handleTabClick(event) {
  const tabButton = event.target.closest('[role="tab"]');
  if (!tabButton) return;
  
  await switchToTab(tabButton);
}

/**
 * Handle keyboard navigation for tabs
 * @param {KeyboardEvent} event Keyboard event
 */
function handleTabKeyboard(event) {
  const targetTab = event.target.closest('[role="tab"]');
  if (!targetTab) return;

  const tabs = [...targetTab.parentElement.querySelectorAll('[role="tab"]')];
  const index = tabs.indexOf(targetTab);

  let newTab;
  switch (event.key) {
    case 'ArrowLeft':
      newTab = tabs[index - 1] || tabs[tabs.length - 1];
      break;
    case 'ArrowRight':
      newTab = tabs[index + 1] || tabs[0];
      break;
    default:
      return;
  }

  event.preventDefault();
  newTab.focus();
  switchToTab(newTab);
}

/**
 * Switch to the specified tab
 * @param {Element} newTab The tab to switch to
 */
async function switchToTab(newTab) {
  const wrapper = newTab.closest('[role="tablist"]');
  const oldTab = wrapper.querySelector('[aria-selected="true"]');
  
  if (oldTab) {
    oldTab.setAttribute('aria-selected', 'false');
    document.getElementById(oldTab.getAttribute('aria-controls')).hidden = true;
  }

  newTab.setAttribute('aria-selected', 'true');
  const newPanel = document.getElementById(newTab.getAttribute('aria-controls'));
  newPanel.hidden = false;

  // Load blocks in newly visible panel
  const blocks = newPanel.querySelectorAll('[data-block-name]');
  await Promise.all([...blocks].map(block => loadBlock(block)));
}