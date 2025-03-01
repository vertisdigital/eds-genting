import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  // Remove data-gen attributes and historymilestones-nested classes
  const cleanupElements = block.querySelectorAll('[class*="historymilestones-nested"], [data-gen-prop], [data-gen-type], [data-gen-model], [data-gen-label]');
  cleanupElements.forEach(element => {
    // Remove data-gen attributes
    const attrs = element.attributes;
    for(let i = attrs.length - 1; i >= 0; i--) {
      const attr = attrs[i];
      if(attr.name.startsWith('data-gen') || attr.name === 'class' && attr.value.includes('historymilestones-nested')) {
        element.removeAttribute(attr.name);
      }
    }
  });

  // Process images
  const imageLinks = block.querySelectorAll('a[href*="delivery-"], a[href*="/adobe/assets/"]');
  imageLinks.forEach(link => {
    // Get the base delivery URL and asset URN
    const fullUrl = link.href;
    const assetPath = fullUrl.match(/\/adobe\/assets\/.*$/)[0];
    const deliveryUrl = fullUrl.replace(assetPath, '');

    // Create picture element with optimized sources
    const picture = createOptimizedPicture(link.href, '', false, [
      { media: '(min-width: 768px)', width: '800' },
      { width: '400' }
    ]);

    // Function to fix the image source URLs
    const fixImageSrc = (img, width) => {
      if (img) {
        const src = img.getAttribute('src');
        if (src) {
          const newSrc = src.replace(
            /\/adobe\/assets\/(.*?)(?:\?|$)/g,
            `${deliveryUrl}/adobe/assets/$1/as/img.png?width=${width}`
          );
          img.setAttribute('src', newSrc);
        }
      }
    };

    // Update image paths with correct delivery URL format for sources
    const sources = picture.querySelectorAll('source');
    sources.forEach(source => {
      const srcset = source.getAttribute('srcset');
      if (srcset) {
        // Determine the width from the media query or use a default
        const media = source.getAttribute('media');
        const width = media && media.includes('min-width: 768px') ? '800' : '400'; // Dynamic width

        const newSrcset = srcset.replace(
          /\/adobe\/assets\/(.*?)(?:\?|$)/g,
          `${deliveryUrl}/adobe/assets/$1/as/img.png?width=${width}`
        );
        source.setAttribute('srcset', newSrcset);
      }
    });

    // Update image path for the img tag
    const img = picture.querySelector('img');
    fixImageSrc(img, 400);

    link.parentNode.replaceChild(picture, link);
  });
}