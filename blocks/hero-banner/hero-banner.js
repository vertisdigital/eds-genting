import ImageComponent from '../../shared-components/ImageComponent.js';
import Heading from '../../shared-components/Heading.js';
import SvgIcon from '../../shared-components/SvgIcon.js';
/**
 * Loads and decorates the Hero Banner
 * @param {Element} block The herobanner block element
 */
export default function decorate(block) {
    const heroContainer = block.querySelector('.hero-banner-container');
  
    if (!heroContainer) {
    const heroContainer = document.createElement('div');
    heroContainer.className = 'hero-banner-container';
    }
  const imageLink = block.querySelector('a[href]');
  if (imageLink) {
    const imageUrl = imageLink.getAttribute('href');
    const imageAlt = imageLink.getAttribute('title') || 'Hero Image';

    const imageHtml = ImageComponent({
      src: imageUrl,
      alt: imageAlt,
      className: 'hero-image',
      breakpoints: {
        mobile: {
          width: 768,
          src: `${imageUrl}`,
        },
        tablet: {
          width: 1024,
          src: `${imageUrl}`,
        },
        desktop: {
          width: 1920,
          src: `${imageUrl}`,
        },
      },
      lazy: false, // Hero images should load immediately
    });

    heroContainer.insertAdjacentHTML('beforeend', imageHtml);
    imageLink.remove();
  }
  // Find the title and replace it with a heading
  const titleElement = block.querySelector('[data-aue-prop="bannertitle"]');
  if (titleElement) {
    const titleText = titleElement.textContent;
    const headingHtml = Heading({ level: 1, text: titleText, className: 'hero-title' });
    heroContainer.insertAdjacentHTML('beforeend', headingHtml);
    titleElement.remove();
  }
  // Find and add the description
  const descElement = block.querySelector('[data-aue-prop="bannerdescription"]');
  if (descElement) {
    const descriptionDiv = document.createElement('div');
    descriptionDiv.className = 'hero-description';
    descriptionDiv.textContent = descElement.textContent;
    heroContainer.appendChild(descriptionDiv);
    descElement.remove();
  }
  // Add arrow icon below description
  const arrowIconHtml = SvgIcon({
    name: 'arrow',
    className: 'hero-arrow-icon',
    size: '32',
    color: 'white',
  });
  heroContainer.insertAdjacentHTML('beforeend', arrowIconHtml);
  
    const carouselItems = block.querySelectorAll('[data-aue-model="bannercarousel"]');
    const carouselContainer = document.createElement('div');
    carouselContainer.className = 'hero-banner-carousal';
    const carouselWrapper = document.createElement('div');
    carouselWrapper.className = 'carousel-wrapper';

    console.log(block)
    carouselItems.forEach(item => {
      const carouselItem = document.createElement('div');
      carouselItem.classList.add('carousel-item');
    
      const carouselItemContent = document.createElement('div');
      carouselItemContent.classList.add('carousel-content'); // This will hold the text content
      const newsLatterImage = document.createElement('div');
      newsLatterImage.classList.add('carousel-image'); // This will hold the image
      const newsLinkDiv = document.createElement('div');
      newsLinkDiv.classList.add('news-link-container');
    
      // Append content first (left side)
      carouselItem.appendChild(carouselItemContent);
      
      // Append image (right side)
      carouselItem.appendChild(newsLatterImage);
    
      const titleElement = item.querySelector('[data-aue-prop="title"]');
      if (titleElement) {
        const titleText = titleElement.textContent;
        const titleHtml = `<p class="news-title">${titleText}</p>`;
        carouselItemContent.insertAdjacentHTML('beforeend', titleHtml);
        titleElement.remove();
      }
    
      const descriptionElement = item.querySelector('[data-aue-prop="description"]');
      if (descriptionElement) {
        const descriptionText = descriptionElement.textContent;
        const descriptionHtml = `<p class="news-description">${descriptionText}</p>`;
        carouselItemContent.insertAdjacentHTML('beforeend', descriptionHtml);
        descriptionElement.remove();
      }
    
      // Insert the "Read More" label into the newsLinkDiv
      const readMoreLabelElement = item.querySelector('[data-aue-prop="readmorelabel"]');
      if (readMoreLabelElement) {
        const readMoreLabelText = readMoreLabelElement.textContent;
        const readMoreLabelHtml = `<p class="news-link">${readMoreLabelText}</p>`;
        newsLinkDiv.insertAdjacentHTML('beforeend', readMoreLabelHtml); // Add the "Read More" label
        readMoreLabelElement.remove();
      }
    // Select and handle the left icon (outside carousel) as SVG
const newsLinkLeftIcon = block.querySelector('[data-aue-prop="left-icon"] a');
if (newsLinkLeftIcon) {
  const leftIconUrl = newsLinkLeftIcon.getAttribute('href'); // Extract href
  const leftIconAlt = newsLinkLeftIcon.getAttribute('title') || 'Left Icon'; // Fallback for alt text

  const leftIconHtml = SvgIcon({
    name: 'left-arrow',  // You can specify the name of the SVG icon here
    className: 'news-link-left-icon',
    size: '24', // You can adjust the size as necessary
    color: 'black', // Specify the color you want for the icon (can be dynamic or fixed)
  });

  newsLinkDiv.insertAdjacentHTML('beforeend', leftIconHtml); // Add to newsLinkDiv
}

// Select and handle the right icon (outside carousel) as SVG
const newsLinkRightIcon = block.querySelector('[data-aue-prop="right-icon"] a');
if (newsLinkRightIcon) {
  const rightIconUrl = newsLinkRightIcon.getAttribute('href'); // Extract href
  const rightIconAlt = newsLinkRightIcon.getAttribute('title') || 'Right Icon'; // Fallback for alt text

  const rightIconHtml = SvgIcon({
    name: 'right-arrow',  // You can specify the name of the SVG icon here
    className: 'news-link-right-icon',
    size: '24', // You can adjust the size as necessary
    color: 'black', // Specify the color you want for the icon (can be dynamic or fixed)
  });

  newsLinkDiv.insertAdjacentHTML('beforeend', rightIconHtml); // Add to newsLinkDiv
}

// Append the newsLinkDiv to carouselItemContent after the description
carouselItemContent.appendChild(newsLinkDiv);

// Add image URL for thumbnail using ImageComponent
const firstDiv = item.querySelector('div');
if (firstDiv) {
  const pTag = firstDiv.querySelector('p');
  if (pTag) {
    const aTag = pTag.querySelector('a'); 
    if (aTag) {
      const imgUrl = aTag.getAttribute('href'); 
      const imgAlt = aTag.getAttribute('title') || 'Thumbnail'; // Fallback for alt text

      const imgHtml = ImageComponent({
        src: imgUrl,
        alt: imgAlt,
        className: 'news-thumbnail',
        breakpoints: {
          mobile: {
            width: 768,
            src: `${imgUrl}`,
          },
          tablet: {
            width: 1024,
            src: `${imgUrl}`,
          },
          desktop: {
            width: 1920,
            src: `${imgUrl}`,
          },
        },
        lazy: false, // Thumbnails should load immediately
      });

      newsLatterImage.insertAdjacentHTML('beforeend', imgHtml); // Add to carousel image container
      aTag.remove(); // Remove anchor tag after handling
    }
  }
}
    
      carouselWrapper.appendChild(carouselItem);
    });
  
    carouselContainer.appendChild(carouselWrapper);
    heroContainer.appendChild(carouselContainer);
  
    const carouselItemsEl = heroContainer.querySelectorAll('.carousel-item');
    const itemWidth = carouselItemsEl[0].offsetWidth;
  
    let currentIndex = 0;
  
    function moveCarousel() {
      currentIndex++;
      
      if (currentIndex >= carouselItemsEl.length) {
        currentIndex = 0;
      }
  
      const newTransform = -currentIndex * itemWidth;
  
      carouselWrapper.style.transition = 'transform 0.3s ease';
      carouselWrapper.style.transform = `translateX(${newTransform}px)`;
  
      if (currentIndex === carouselItemsEl.length - 1) {
        setTimeout(() => {
          carouselWrapper.style.transition = 'none';
          carouselWrapper.style.transform = `translateX(0)`;
        }, 3000); 
      }
    }
  
    if (carouselItemsEl.length > 0) {
      setInterval(moveCarousel, 3000);
    }
  
    carouselItems.forEach(item => {
      item.remove();
    });

  block.textContent = '';
  block.appendChild(heroContainer);
}
