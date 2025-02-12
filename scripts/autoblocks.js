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
    // Skip if already processed or is a nested tab
    if (tabSection.dataset.tabsProcessed || tabSection.closest('[data-aue-model="tabs"]') !== tabSection) {
      return;
    }

    // Mark as processed
    tabSection.dataset.tabsProcessed = 'true';

    const topContainer = document.createElement('div');
    topContainer.classList = 'container-xl container-lg container-md container-sm';

    const tabsWrapper = document.createElement('div');
    tabsWrapper.classList.add('tabs-container');

    const tabsNav = document.createElement('div');
    tabsNav.classList.add('tabs-header','row');

    const tabsContent = document.createElement('div');
    tabsContent.classList.add('tabs-content');

    const metadata = tabSection.querySelector(
      '.section-metadata > div :last-child',
    );
    const tabTitle = metadata
      ? metadata.textContent.trim()
      : `CustTitle ${sections.indexOf(tabSection) + 1}`;

    const tabButton = document.createElement('div');
    tabButton.classList.add('tab-title','col-xl-6','col-lg-6','col-md-3','col-sm-2');
    tabButton.dataset.index = sections.indexOf(tabSection);
    tabButton.textContent = tabTitle;

    const tabPanel = document.createElement('div');
    tabPanel.classList.add('tab-panel');
    if (sections.indexOf(tabSection) === 0) tabPanel.classList.add('active');

    moveInstrumentation(tabSection, tabPanel);
    // Clone the section content instead of moving it
    const clonedContent = tabSection.cloneNode(true);
    clonedContent.querySelector('.section-metadata')?.remove(); // Remove metadata from content

    while (clonedContent.firstChild) {
      tabPanel.appendChild(clonedContent.firstChild);
    }
    tabsNav.appendChild(tabButton);
    tabsContent.appendChild(tabPanel);

    // Remove the original section after moving content
    tabSection.parentNode.removeChild(tabSection);

    tabsWrapper.appendChild(tabsNav);
    tabsWrapper.appendChild(tabsContent);
    topContainer.appendChild(tabsWrapper);
    main.appendChild(topContainer);

    // Handle tab switching
    tabsNav.addEventListener('click', (event) => {
      const tabButton = event.target.closest('.tab-title'); // Ensure we target the correct element
      if (!tabButton) return;

      const index = parseInt(
        tabButton.dataset.index ?? tabButton.parentNode.dataset.index,
        10,
      ); // Convert to integer
      if (Number.isNaN(index)) return; // Prevent errors if index is undefined 

      tabsWrapper
        .querySelectorAll('.tab-title')
        .forEach((btn) => btn.classList.remove('active'));
      tabsWrapper
        .querySelectorAll('.tab-panel')
        .forEach((panel) => panel.classList.remove('active'));

      tabButton.classList.add('active');
      tabsContent.children[index]?.classList.add('active'); // Ensure safe access
    });

    // Activate the first tab by default
    tabsNav.children[0]?.classList.add('active');

    // After assembling the structure, add a class to mark this as a tabs block
    tabsWrapper.classList.add('tabs-block-wrapper');
  });
}