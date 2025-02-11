import { moveInstrumentation } from '../../scripts/scripts.js';
import Heading from '../../shared-components/Heading.js';
import stringToHTML from '../../shared-components/Utility.js';

export default function decorate(block) {

  // finding the feature items
  const featureItems = block.querySelectorAll('[data-aue-model="featureItem"]');

  const featureContainer = document.createElement('div');
  featureContainer.className = 'row';

  featureItems.forEach((featureItem) => {
    featureContainer.appendChild(featureItem);
    featureItem.classList.add(
      'col-xl-3',
      'col-lg-3',
      'col-md-3',
      'col-sm-4',
      'feature-item',
    );
    featureItem
      .querySelector('[data-aue-prop="feature-title"]')
      .classList.add('statistic');
    featureItem
      .querySelector('[data-aue-prop="feature-heading"]')
      .classList.add('text-container');
  });
  // insert the feature container as first element
  block.insertBefore(featureContainer, block.firstChild);

  // processing the statistics description block
  const statisticBlock = block.querySelector(
    '[data-aue-model="statisticsDescription"]',
  );
  if (statisticBlock) {
    // replacing the title with  h2
    const titleElement = statisticBlock.querySelector(
      '[data-aue-prop="title"]',
    );
    if (titleElement) {
      const titleText = titleElement.textContent;
      const header = document.createElement('header');
      moveInstrumentation(titleElement, header);
      const titleHtml = Heading({
        level: 2,
        text: titleText,
        className: 'statistics-title',
      });
      const parsedHtml = stringToHTML(titleHtml);
      header.append(parsedHtml);
      titleElement.outerHTML = header.outerHTML;
    }

    // adding class  statistics-description to description
    const descriptionElement = statisticBlock.querySelector(
      '[data-aue-prop="description"]',
    );
    if (descriptionElement) {
      descriptionElement.classList.add('statistics-description');
    }

    // adding class to read more and read less
    const readMoreElement = statisticBlock.querySelector(
      '[data-aue-prop="readMoreLabel"]',
    );
    if (readMoreElement) {
      readMoreElement.classList.add('read-more');
    }

    const readLessElement = statisticBlock.querySelector(
      '[data-aue-prop="readLessLabel"]',
    );
    if (readLessElement) {
      readLessElement.classList.add('read-less');
    }
  }
}
