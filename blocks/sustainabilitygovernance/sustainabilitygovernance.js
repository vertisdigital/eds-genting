export default function decorate(block) {
    // Remove any data-aue attributes
    const elements = block.querySelectorAll('[data-aue]');
    elements.forEach(element => {
        const attrs = element.attributes;
        for (let i = attrs.length - 1; i >= 0; i -= 1) {
            const attr = attrs[i];
            if (attr.name.startsWith('data-aue')) {
                element.removeAttribute(attr.name);
            }
        }
    });
} 