import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  // Remove data-gen attributes
  const elementsWithDataGen = block.querySelectorAll('[data-gen-prop], [data-gen-type], [data-gen-model], [data-gen-label]');
  elementsWithDataGen.forEach(element => {
    const attrs = element.attributes;
    for(let i = attrs.length - 1; i >= 0; i--) {
      if(attrs[i].name.startsWith('data-gen')) {
        element.removeAttribute(attrs[i].name);
      }
    }
  });

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
