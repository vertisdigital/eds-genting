import Heading from '../../shared-components/Heading.js';
import SvgIcon from '../../shared-components/SvgIcon.js';

export default function decorate(block) {
  // Restructure the HTML for better semantics and accessibility
  const wrapper = block.closest('.enquiry-wrapper');

  // Create single container with all responsive classes
  const container = document.createElement('div');
  container.className = 'container-xl container-md container-sm';

  const row = document.createElement('div');
  row.className = 'row';

  // Create left column (heading) - 40% on desktop and tablet
  const leftCol = document.createElement('div');
  leftCol.className = 'col-xl-6 col-md-3 container-sm-4';

  // Use Heading component with proper accessibility
  const headingText = wrapper.querySelector('[data-aue-prop="heading"]')?.textContent.trim();
  const headingElement = document.createElement('div');
  headingElement.innerHTML = Heading({
    text: headingText,
    level: 2,
    className: 'enquiry-heading',
  });
  leftCol.appendChild(headingElement.firstElementChild);

  // Create right column (description and contacts) - 60% on desktop and tablet
  const rightCol = document.createElement('div');
  rightCol.className = 'col-xl-6 col-md-3 container-sm-4';

  // Add description with semantic markup
  const description = wrapper.querySelector('[data-aue-prop="description"]');
  if (description) {
    const descriptionWrapper = document.createElement('div');
    descriptionWrapper.className = 'enquiry-description';
    descriptionWrapper.innerHTML = description.innerHTML;
    rightCol.appendChild(descriptionWrapper);
  }

  // Create contact items container with proper spacing
  const contactItems = document.createElement('div');
  contactItems.className = 'contact-items';
  contactItems.setAttribute('role', 'list');

  // Helper function to create accessible contact items
  const createContactItem = (iconName, text, linkType) => {
    const item = document.createElement('div');
    item.className = 'contact-item';
    item.setAttribute('role', 'listitem');

    const iconWrapper = document.createElement('div');
    iconWrapper.className = 'contact-icon';
    iconWrapper.setAttribute('aria-hidden', 'true');

    // Create and add icon with fallback
    const icon = SvgIcon({
      name: iconName,
      size: 24,
    });

    if (icon) {
      if (typeof icon === 'string') {
        iconWrapper.innerHTML = icon;
      } else if (icon instanceof Element) {
        iconWrapper.appendChild(icon);
      }
    }

    const textElement = document.createElement('p');
    textElement.className = 'contact-text';

    if (linkType) {
      const link = document.createElement('a');
      link.className = 'contact-link';
      link.href = `${linkType}:${text}`;
      link.textContent = text;
      link.setAttribute('aria-label', `${linkType === 'tel' ? 'Call us at' : 'Email us at'} ${text}`);
      // Add keyboard focus styles
      link.setAttribute('tabindex', '0');
      textElement.appendChild(link);
    } else {
      textElement.textContent = text;
    }

    item.appendChild(iconWrapper);
    item.appendChild(textElement);
    return item;
  };

  // Add contact items with proper ARIA labels
  const phone = wrapper.querySelector('[data-aue-prop="phoneNumber"]')?.textContent.trim();
  const email = wrapper.querySelector('[data-aue-prop="emailAddress"]')?.textContent.trim();
  const address = wrapper.querySelector('[data-aue-prop="address"]')?.textContent.trim();

  if (phone) {
    contactItems.appendChild(createContactItem('phone', phone, 'tel'));
  }
  if (email) {
    contactItems.appendChild(createContactItem('email', email, 'mailto'));
  }
  if (address) {
    contactItems.appendChild(createContactItem('address', address));
  }

  rightCol.appendChild(contactItems);

  // Assemble the structure
  row.appendChild(leftCol);
  row.appendChild(rightCol);
  container.appendChild(row);

  // Replace original content
  wrapper.innerHTML = '';
  wrapper.appendChild(container);
}
