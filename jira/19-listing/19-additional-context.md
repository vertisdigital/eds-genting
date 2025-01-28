# Authoring Requirements:
Create this block with following:
    A container block with the following fields
        1. A text field title (e.g., "Investor's Initiatives")
        2. A text field heading (e.g., "Explore Our Insights and Financial Highlights")
        3. A text field CTA Caption (e.g., "Explore more")

    A block item with following fields
        1. A background image (left-aligned)
        2. A text field title (e.g., "2023 Sustainability Report")
        3. A date-time field date with display format as DD MMM YYYY
        4. An arrow icon (right-aligned)
        5. A CTA link for the entire item

# Rendering Requirements:
1. Layout Structure:
    - Use UL/LI syntax for the list
    - Title and heading at the top
    - Each list item should be full width
    - Border separator between items
    - "Explore more" link at the bottom

2. List Item Layout:
    - follow this hierarchy container-xl, container-md, container-sm > row > col-*
    - Image on left (30% width). Use Classes for Desktop col-xl-4, Table col-md-2, Mobile col-sm-4
    - Content on right (70% width). Use Classes for Desktop col-xl-8, Table col-md-6, Mobile col-sm-4. data-aue-type="text" items will follow these classes
    - Arrow icon aligned to the right
    - Proper spacing between elements

3. Typography:
    - Title: Gray color, smaller font
    - Heading: Large, bold font
    - Item title: Medium size, black color
    - Date: Small, gray color
    - "Explore more": Gold/brown color (#B4975A)

4. Spacing & Alignment:
    - Consistent padding between items
    - Vertical alignment of content with image
    - Proper margins around all elements
    - Equal spacing between items

5. Interactive Elements:
    - Entire item should be clickable
    - Subtle hover effect on items
    - Arrow icon indicating clickable state
    - Focus states for accessibility

6. Image Handling:
    - Maintain aspect ratio
    - Object-fit: cover
    - Rounded corners
    - No image stretching

7. Data Attributes:
    - Use data-aue-prop="title" for titles
    - Use data-aue-prop="heading" for main heading
    - Use data-aue-prop="date" for dates
    - Use data-aue-model="listitem" for list items
    - Use data-aue-label attributes matching the field names

8. Responsive Behavior:
    - Stack image and content on mobile
    - Maintain readability at all breakpoints
    - Adjust spacing for smaller screens