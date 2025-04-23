import Heading from '../../shared-components/Heading.js';
import SvgIcon from '../../shared-components/SvgIcon.js';
import stringToHTML from '../../shared-components/Utility.js';

/**
 * Loads and decorates the Search Results block.
 * @param {Element} block The searchresult block element
 */
export default function decorate(block) {

    var blockchildren = [...block.children];
    if(blockchildren.length > 0) {
    var searchInputDetails  = [...blockchildren[0].children]
    var searchResultsDetails  = [...blockchildren[1].children]
    }

    if(searchInputDetails){
     // Fetching search Data and storing on load
    let searchData = {};
    var fetchSearchData = async () => {
        try {
        var response = await fetch('/query-index.json');
        var data = await response.json();
        searchData = data;
        console.log('searchData', searchData);

        } catch (error) {
        console.error('Error fetching data:', error);
        }
    }
    fetchSearchData();

    var searchWrapper = document.createElement('div');
    searchWrapper.classList.add('search-nav');

    // Header search dropdown
    // var secondaryNavSearch = document.querySelector('.secondary-nav');

    var searchInputContainer = document.createElement('div');
    searchInputContainer.classList.add('container');

    var searchHeadingWrapper = document.createElement('div');
    searchHeadingWrapper.className = 'search-heading-wrapper';

    var searchTitle = searchInputDetails[0]?.textContent.trim() || 'Search';

    // Generating heading
    var searchHeading = stringToHTML(Heading({ level: 2, text: searchTitle, className: 'search-heading' }));

    // Header Search dropdown closing functionality
    var dropDownCloseBtn = document.createElement('button');
    dropDownCloseBtn.className = 'close-btn';
    dropDownCloseBtn.setAttribute('aria-label', 'Close menu');
    var dropDownCloseBtnIcon = SvgIcon({ name: 'close', className: 'close-icon', size: 18 });
    dropDownCloseBtn.innerHTML = dropDownCloseBtnIcon;
    dropDownCloseBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    });

    // Append search heading and close button to heading wrapper
    searchHeadingWrapper.append(searchHeading, dropDownCloseBtn);


    // Search input
    var inputPlaceholder = searchInputDetails[2]?.textContent.trim() || 'Search...';
    var searchInputWrapper = document.createElement('div');
    searchInputWrapper.className = 'search-input-wrapper';

    var inputWrapper = document.createElement('div');
    inputWrapper.className = 'input-wrapper';
    var inputSearchIcon = stringToHTML(SvgIcon({ name: 'search', class: 'search-icon', size: '18px' }));
    var searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder =  inputPlaceholder || 'Search...';
    searchInput.className = 'search-input';
    // var clearBtnWrapper = document.createElement('div');
    // clearBtnWrapper.className = 'clear-btn-wrapper';
    var clearBtn = stringToHTML(SvgIcon({ name: 'close', className: 'close-icon', size: 18 }));
    // var clearBtnText = document.createElement('span');
    // clearBtnText.className = 'clear-btn-text';
    // clearBtnText.textContent = 'Clear';
    // clearBtn.appendChild(clearBtnText);
    // clearBtnWrapper.appendChild(clearBtn);
    inputWrapper.append(inputSearchIcon, searchInput, clearBtn);

    // Clear button functionality
    clearBtn.addEventListener('click', () => {
        searchInput.value = ''; // Clear the input field
        searchResults.innerHTML = ""; // Clear the results
        searchResultCount.classList.remove('active'); // Hide result count
        searchResultsWrapper.classList.remove('active'); // Hide results wrapper
        clearBtn.classList.remove('active'); // Hide clear button
    });

    // search Button
    var searchBtn = document.createElement('div');
    searchBtn.className = 'search-btn';
    searchBtn.innerHTML = searchInputDetails[1]?.innerHTML || 'Search';
  
    // append search input and button to the wrapper
    searchInputWrapper.append(inputWrapper, searchBtn);

    // Search result count
    var searchResultCount = document.createElement('div');
    searchResultCount.className = 'search-result-count';
    searchResultCount.textContent = '0 results found';
    // searchResultCount.style.display = 'none';

    // append all search elements to the container
    searchInputContainer.append(searchHeadingWrapper, searchInputWrapper,searchResultCount);
    searchWrapper.append(searchInputContainer);
}

    if(searchResultsDetails){
    // Results wrapper
    var searchResultsWrapper = document.createElement('div');
    searchResultsWrapper.className = 'container search-results-wrapper';

    var searchResults = document.createElement("div");
    searchResults.className = "search-results";

    var searchTips = document.createElement("div");
    searchTips.className = "search-tips";
    var searchTipsHeadingText = searchResultsDetails[0]?.textContent.trim() || 'Search tips:';
    var searchTipsHeading = stringToHTML(Heading({ level: 2, text: searchTipsHeadingText, className: 'search-tips-heading' }));
    var searchTipsList = searchResultsDetails[1];
    searchTipsList.className = "search-tips-list";
    searchTips.append(searchTipsHeading,searchTipsList);

    
    searchResults.innerHTML = ""; // Clear previous results

    searchResultsWrapper.append(searchTips,searchResults);

    var debounce = (func, delay = 300) => {
        let timer;
        return (...args) => {
          clearTimeout(timer);
          timer = setTimeout(() => {
            func.apply(this, args);
          }, delay);
        };
      };
      
    // Show Suggestions
    // Highlight matching part in description
    var highlightMatch = (text, keyword) => {
        var regex = new RegExp(`(${keyword})`, 'gi');
        return text.replace(regex, `<span class="highlight">$1</span>`);
    };
    var showResults = (query) => {
        if (query.length > 3) {
        clearBtn.classList.add('active');
        searchResults.innerHTML = "";
    
        var results = searchData.data.filter(item =>
            item.description.toLowerCase().includes(query)
        );
    
        if(results.length > 0) {
            searchResultsWrapper.classList.add('active');
            searchResultCount.classList.add('active');
            // searchResultCount.style.display = 'block';
            searchResultCount.innerHTML = searchResultCount.innerHTML = `${results.length} results found for <span>'${query}'</span>`;      ;
            searchResults.innerHTML = ""; // Clear previous results
            results.forEach(item => {
            var div = document.createElement("div");
            div.className = "search-results-item";
            div.innerHTML = `
                <a class="title" href="${item.path}">${highlightMatch(item.title, query)}</a>
                <div class="description">${highlightMatch(item.heroBannerAllDescriptions, query)}</div>
            `;
            searchResults.appendChild(div);
            });
        }
        else{
            searchResultsWrapper.classList.remove('active');           
            searchResultCount.classList.add('active');
            searchResultCount.innerHTML = `No result found for <span>'${query}'</span>`;      ;                    
        }
        } else {
        searchResultsWrapper.classList.remove('active');
        clearBtn.classList.remove('active');
        searchResultCount.classList.remove('active') // Hide result count
        searchResults.innerHTML = ""; // Optional: clear suggestions if input too short
        }
    };

    // Handle input with debounce
    var handleInput = debounce(() => {
        var query = searchInput.value.trim().toLowerCase();
        showResults(query);
    }, 300);

    // Search input functionality
    searchInput.addEventListener('input', handleInput);
}
    block.innerHTML = ""; // Clear the block content
    // searchWrapper.append(searchInputWrapper, searchResultsWrapper)
    block.append(searchWrapper, searchResultsWrapper);
}
