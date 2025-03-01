import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  // Add container classes only if not in tabs
  if (!block.closest('.tabs')) {
    block.classList.add('container-xl', 'container-lg', 'container-md', 'container-sm');
  }

  // Process milestone items
  const milestoneItems = block.querySelectorAll('div:nth-child(n+3)');
  milestoneItems.forEach((item) => {
    // Handle image
    const imgLink = item.querySelector('a');
    if (imgLink) {
      const picture = createOptimizedPicture(imgLink.href, '', false, [
        { media: '(min-width: 768px)', width: '400' },
        { width: '320' },
      ]);
      const imgContainer = imgLink.parentElement;
      imgContainer.replaceChild(picture, imgLink);
    }
  });

  // Add accessibility attributes
  block.setAttribute('role', 'region');
  block.setAttribute('aria-label', 'History and Milestones');
} 