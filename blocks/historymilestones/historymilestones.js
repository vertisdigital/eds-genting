import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  // Process images
  const imageLinks = block.querySelectorAll('a[href*="delivery-"], a[href*="/adobe/assets/"]');
  imageLinks.forEach(link => {
    const picture = createOptimizedPicture(link.href, '', false, [
      { media: '(min-width: 768px)', width: '400' },
      { width: '320' },
    ]);
    link.parentNode.replaceChild(picture, link);
  });
}
