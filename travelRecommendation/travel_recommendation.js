// Fetch travel recommendations data
let travelData = null;

// Function to fetch data from JSON file
async function fetchTravelData() {
    try {
        const response = await fetch('travel_recommendation_api.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        travelData = await response.json();
        console.log('Travel data loaded successfully:', travelData);
        return travelData;
    } catch (error) {
        console.error('Error fetching travel data:', error);
        return null;
    }
}

// Function to search recommendations
function searchRecommendations() {
    const searchInput = document.querySelector('input[name="search"]');
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (!searchTerm) {
        console.log('Please enter a search term');
        return;
    }
    
    console.log('Searching for:', searchTerm);
    
    if (!travelData) {
        console.log('Data not loaded yet. Loading...');
        fetchTravelData().then(() => {
            performSearch(searchTerm);
        });
    } else {
        performSearch(searchTerm);
    }
}

// Function to perform the actual search
function performSearch(searchTerm) {
    const results = [];
    
    // Check if searching for broad categories
    const searchingCountries = searchTerm.includes('country') || searchTerm.includes('countries');
    const searchingCities = searchTerm.includes('city') || searchTerm.includes('cities');
    const searchingTemples = searchTerm.includes('temple') || searchTerm.includes('temples');
    const searchingBeaches = searchTerm.includes('beach') || searchTerm.includes('beaches');
    
    // Search in countries and cities
    travelData.countries.forEach(country => {
        // Check if country name matches
        const countryMatches = country.name.toLowerCase().includes(searchTerm);
        
        country.cities.forEach(city => {
            // Check if city name or description matches, or if country name matches, or searching for countries/cities
            if (searchingCountries || searchingCities || countryMatches || 
                city.name.toLowerCase().includes(searchTerm) || 
                city.description.toLowerCase().includes(searchTerm)) {
                results.push({ type: 'city', data: city });
            }
        });
    });
    
    // Search in temples
    travelData.temples.forEach(temple => {
        if (searchingTemples || 
            temple.name.toLowerCase().includes(searchTerm) || 
            temple.description.toLowerCase().includes(searchTerm)) {
            results.push({ type: 'temple', data: temple });
        }
    });
    
    // Search in beaches
    travelData.beaches.forEach(beach => {
        if (searchingBeaches || 
            beach.name.toLowerCase().includes(searchTerm) || 
            beach.description.toLowerCase().includes(searchTerm)) {
            results.push({ type: 'beach', data: beach });
        }
    });
    
    console.log('Search results:', results);
    displayResults(results);
}

// Function to display results
function displayResults(results) {
    // Clear previous results
    let resultsContainer = document.getElementById('results-container');
    
    if (!resultsContainer) {
        // Create results container if it doesn't exist
        resultsContainer = document.createElement('div');
        resultsContainer.id = 'results-container';
        resultsContainer.className = 'results-container';
        
        // Insert after hero section
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            heroSection.parentNode.insertBefore(resultsContainer, heroSection.nextSibling);
        } else {
            document.body.appendChild(resultsContainer);
        }
    }
    
    // Clear existing content
    resultsContainer.innerHTML = '';
    
    if (results.length === 0) {
        resultsContainer.innerHTML = '<div class="no-results"><p>No recommendations found. Try searching for "beaches", "temples", or "countries".</p></div>';
        return;
    }
    
    // Create results title
    const title = document.createElement('h2');
    title.className = 'results-title';
    title.textContent = `Found ${results.length} Recommendation${results.length > 1 ? 's' : ''}`;
    resultsContainer.appendChild(title);
    
    // Create results grid
    const resultsGrid = document.createElement('div');
    resultsGrid.className = 'results-grid';
    
    results.forEach(result => {
        const card = createResultCard(result);
        resultsGrid.appendChild(card);
    });
    
    resultsContainer.appendChild(resultsGrid);
    
    // Scroll to results
    resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Function to create a result card
function createResultCard(result) {
    const { data, type } = result;
    
    const card = document.createElement('div');
    card.className = 'result-card';
    
    const img = document.createElement('img');
    img.src = data.imageUrl;
    img.alt = data.name;
    img.className = 'result-image';
    img.onerror = function() {
        this.src = './Assets/LowerManhattanSkyline.jpg'; // Fallback image
    };
    
    const content = document.createElement('div');
    content.className = 'result-content';
    
    const name = document.createElement('h3');
    name.className = 'result-name';
    name.textContent = data.name;
    
    const description = document.createElement('p');
    description.className = 'result-description';
    description.textContent = data.description;
    
    const visitBtn = document.createElement('button');
    visitBtn.className = 'visit-btn';
    visitBtn.textContent = 'Visit';
    
    content.appendChild(name);
    content.appendChild(description);
    content.appendChild(visitBtn);
    
    card.appendChild(img);
    card.appendChild(content);
    
    return card;
}

// Function to clear search results
function clearSearch() {
    const searchInput = document.querySelector('input[name="search"]');
    searchInput.value = '';
    
    const resultsContainer = document.getElementById('results-container');
    if (resultsContainer) {
        resultsContainer.innerHTML = '';
    }
    
    console.log('Search cleared');
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Page loaded. Fetching travel data...');
    
    // Fetch data on page load
    fetchTravelData();
    
    // Add event listeners to search form
    const searchForm = document.querySelector('.search-container form');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            searchRecommendations();
        });
        
        // Add listener to clear button
        const clearBtn = searchForm.querySelector('.clear-btn');
        if (clearBtn) {
            clearBtn.addEventListener('click', function(e) {
                e.preventDefault();
                clearSearch();
            });
        }
    }
});
