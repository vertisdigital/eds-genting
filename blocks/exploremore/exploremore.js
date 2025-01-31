// Wrap CTA sections for styling
document.addEventListener('DOMContentLoaded', function() {
  const exploreMore = document.querySelector('.exploremore');
  if (!exploreMore) return;

  // Group CTA elements
  const ctaSections = exploreMore.querySelectorAll('div > div:not([data-aue-prop="title"])');
  ctaSections.forEach((section, index) => {
    if (index % 2 === 0) {
      const wrapper = document.createElement('div');
      wrapper.className = 'cta-wrapper';
      section.parentNode.insertBefore(wrapper, section);
      wrapper.appendChild(section);
      wrapper.appendChild(ctaSections[index + 1]);
    }
  });
}); 