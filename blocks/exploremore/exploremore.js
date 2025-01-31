// Wrap CTA sections for styling
document.addEventListener('DOMContentLoaded', function() {
  const exploreMore = document.querySelector('.exploremore');
  if (!exploreMore) return;

  // Create CTA group container
  const ctaGroup = document.createElement('div');
  ctaGroup.className = 'cta-group';
  
  // Get title and move it before CTA group
  const title = exploreMore.querySelector('[data-aue-prop="title"]').parentNode;
  exploreMore.insertBefore(title, exploreMore.firstChild);

  // Process CTAs
  const firstCaption = exploreMore.querySelector('[data-aue-prop="firstCtaCaption"]');
  const secondCaption = exploreMore.querySelector('[data-aue-prop="secondCtaCaption"]');
  const firstLink = exploreMore.querySelector('a[href*="investor-relations"]');
  const secondLink = exploreMore.querySelector('a[href*="our-projects"]');

  if (firstCaption && firstLink) {
    const wrapper1 = document.createElement('div');
    wrapper1.className = 'cta-wrapper';
    firstCaption.onclick = () => window.open(firstLink.href, '_blank');
    wrapper1.appendChild(firstCaption.parentNode);
    ctaGroup.appendChild(wrapper1);
  }

  if (secondCaption && secondLink) {
    const wrapper2 = document.createElement('div');
    wrapper2.className = 'cta-wrapper';
    secondCaption.onclick = () => window.open(secondLink.href, '_blank');
    wrapper2.appendChild(secondCaption.parentNode);
    ctaGroup.appendChild(wrapper2);
  }

  // Add CTA group to explore more section
  exploreMore.appendChild(ctaGroup);

  // Remove original link elements
  firstLink?.parentNode?.remove();
  secondLink?.parentNode?.remove();
}); 