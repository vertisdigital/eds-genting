import { createOptimizedPicture } from '../../scripts/aem.js';
import SvgIcon from '../../shared-components/SvgIcon.js';

/**
 * Decorates the tiles block
 * @param {Element} block The tiles block element
 */
export default function decorate(block) {
  // Set background images for image tiles (skip first tile)
  const imageTiles = Array.from(block.children).slice(1);
  imageTiles.forEach((tile) => {
    const imageLink = tile.querySelector('a[href*="/content/dam/"][href$=".png"], a[href*="/content/dam/"][href$=".jpeg"], a[href*="/content/dam/"][href$=".jpg"], a[href*="/content/dam/"][href$=".gif"]');
    if (imageLink) {
      // Create optimized picture element
      const picture = createOptimizedPicture(imageLink.href, '', false);
      // Set as background
      tile.style.backgroundImage = `url(${picture.querySelector('img').src})`;
      // Remove original link
      imageLink.remove();
    }

    // Handle CTA link
    const buttonContainer = tile.querySelector('.button-container');
    const ctaCaption = tile.querySelector('[data-aue-prop="ctaCaption"]');
    if (buttonContainer && ctaCaption) {
      const link = buttonContainer.querySelector('a');
      if (link) {
        // Create new anchor with CTA text and button link
        const ctaLink = document.createElement('a');
        ctaLink.href = link.href;
        ctaLink.className = 'button';
        ctaLink.textContent = ctaCaption.textContent;
        // Replace CTA caption with link
        ctaCaption.parentNode.replaceChild(ctaLink, ctaCaption);
      }
      // Remove button container
      buttonContainer.remove();
    }
  });

  // Handle first tile's download button separately
  const firstTile = block.children[0];
  if (firstTile) {
    const buttonContainer = firstTile.querySelector('.button-container');
    const ctaCaption = firstTile.querySelector('[data-aue-prop="ctaCaption"]');
    if (buttonContainer && ctaCaption) {
      const link = buttonContainer.querySelector('a');
      if (link) {
        // Create new anchor with CTA text and button link
        const ctaLink = document.createElement('a');
        ctaLink.href = link.href;
        ctaLink.className = 'button';
        ctaLink.textContent = ctaCaption.textContent;

        // Add download icon
        const downloadIcon = new SvgIcon('download');
        ctaLink.insertBefore(downloadIcon, ctaLink.firstChild);

        // Add arrow icon
        const arrowIcon = new SvgIcon('arrow-right');
        ctaLink.appendChild(arrowIcon);

        // Replace CTA caption with link
        ctaCaption.parentNode.replaceChild(ctaLink, ctaCaption);
      }
      // Remove button container
      buttonContainer.remove();
    }
  }

  // Add list role for accessibility
  block.setAttribute('role', 'list');
}
