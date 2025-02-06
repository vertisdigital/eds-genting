// Collection of SVG icons as template strings
export const icons = {
  arrow: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 4L10.59 5.41L16.17 11H4V13H16.17L10.59 18.59L12 20L20 12L12 4Z" fill="currentColor"/>
  </svg>`,
  leftarrow: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
  <path d="M5.87788 11.76L0.0400391 6.00002L5.87788 0.240021L7.24004 1.58402L2.76436 6.00002L7.24004 10.416L5.87788 11.76Z" fill="#B29152"/>
</svg>`,
 rightarrow:`<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
  <path d="M4.64263 1.24001L10.4805 7.00001L4.64263 12.76L3.28047 11.416L7.75614 7.00001L3.28047 2.58401L4.64263 1.24001Z" fill="#B29152"/>
</svg>`,
  leftarrowdisabled: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
  <path d="M5.87788 11.76L0.0400391 6.00002L5.87788 0.240021L7.24004 1.58402L2.76436 6.00002L7.24004 10.416L5.87788 11.76Z" fill="#9E9E9E"/>
</svg>`,
 rightarrowdisabled:`<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
  <path d="M4.64263 1.24001L10.4805 7.00001L4.64263 12.76L3.28047 11.416L7.75614 7.00001L3.28047 2.58401L4.64263 1.24001Z" fill="#9E9E9E"/>
</svg>`,
  ellipse: `<svg xmlns="http://www.w3.org/2000/svg" width="6" height="6" viewBox="0 0 6 6" fill="none">
<circle id="Ellipse 8" cx="3" cy="3" r="3" fill="currentColor"/>
</svg>`,
  // Add other icons here as needed
};

/**
 * Get SVG icon by name
 * @param {string} name - Name of the icon
 * @returns {string|undefined} SVG markup string or undefined if not found
 */
export const getIcon = (name) => icons[name];
