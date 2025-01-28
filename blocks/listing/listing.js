import ImageComponent from '../../shared-components/ImageComponent.js';

export default function decorate(block) {
  // Add container classes from styles.css
  block.classList.add('container-xl', 'container-md', 'container-sm');

  // Process list items
  const listItems = block.querySelectorAll('[data-aue-model="listitem"]');
  listItems.forEach((item) => {
    // Create row from styles.css
    const row = document.createElement('div');
    row.classList.add('row');

    // Process images
    const imgContainer = item.querySelector('div:first-child');
    if (imgContainer) {
      imgContainer.classList.add('col-xl-4', 'col-md-2', 'col-sm-4');

      const link = imgContainer.querySelector('a');
      if (link) {
        const picture = document.createElement('picture');
        const img = document.createElement('img');
        img.src = link.href;
        img.alt = '';
        picture.appendChild(img);

        ImageComponent({
          element: img,
          src: link.href,
          alt: '',
          lazy: true,
        });

        link.innerHTML = '';
        link.appendChild(picture);
      }
      row.appendChild(imgContainer);
    }

    // Process text content
    const textElements = item.querySelectorAll('[data-aue-type="text"]');
    if (textElements.length > 0) {
      const textContainer = document.createElement('div');
      textContainer.classList.add('col-xl-8', 'col-md-6', 'col-sm-4');
      textElements.forEach((element) => {
        textContainer.appendChild(element.cloneNode(true));
      });
      row.appendChild(textContainer);
    }

    // Process arrow icons
    const arrowContainer = item.querySelector('div:last-child');
    if (arrowContainer) {
      const arrowImg = arrowContainer.querySelector('img[data-aue-prop="arrowIcon"]');
      if (arrowImg) {
        const picture = document.createElement('picture');
        const img = document.createElement('img');
        img.src = arrowImg.src;
        img.alt = '';
        img.setAttribute('data-aue-prop', 'arrowIcon');
        img.setAttribute('data-aue-label', 'Arrow Icon');
        picture.appendChild(img);

        ImageComponent({
          element: img,
          src: arrowImg.src,
          alt: '',
          lazy: false,
        });

        arrowImg.closest('picture').replaceWith(picture);
      }
      item.appendChild(arrowContainer);
    }

    // Add row to item
    item.insertBefore(row, item.firstChild);

    // Make item clickable
    const ctaLink = item.querySelector('div:nth-child(5) a');
    if (ctaLink) {
      const href = ctaLink.getAttribute('href');
      item.addEventListener('click', () => {
        window.location.href = href;
      });
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          window.location.href = href;
        }
      });
    }

    // Add accessibility attributes
    item.setAttribute('role', 'listitem');
    item.setAttribute('tabindex', '0');
  });

  // Process CTA section
  const ctaContainer = block.querySelector('[data-aue-prop="ctaCaption"]');
  const ctaLink = block.querySelector('div:last-child a');
  if (ctaContainer && ctaLink) {
    const href = ctaLink.getAttribute('href');
    ctaContainer.addEventListener('click', () => {
      window.location.href = href;
    });
    ctaContainer.setAttribute('role', 'link');
    ctaContainer.setAttribute('tabindex', '0');
  }
}
