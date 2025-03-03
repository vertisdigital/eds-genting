export default function decorate(block) {
  // Remove any data-gen attributes
  const elements = block.querySelectorAll('[data-gen-prop], [data-gen-label], [data-gen-type], [data-gen-model]');
  elements.forEach(element => {
    const attrs = element.attributes;
    for (let i = attrs.length - 1; i >= 0; i -= 1) {
      const attr = attrs[i];
      if (attr.name.startsWith('data-gen')) {
        element.removeAttribute(attr.name);
      }
    }
  });

  // Enhance button links
  const buttons = block.querySelectorAll('.button-container a');
  buttons.forEach(button => {
    button.setAttribute('target', '_blank');
    button.classList.add('cta-button');
  });
} 