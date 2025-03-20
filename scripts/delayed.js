// add delayed functionality here

// Create and append Adobe Launch script
const adobeLaunchScript = document.createElement('script');
adobeLaunchScript.src = 'https://assets.adobedtm.com/';
adobeLaunchScript.async = true;
document.head.appendChild(adobeLaunchScript);
