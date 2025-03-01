document.addEventListener("DOMContentLoaded", function () {
    const pictureContainer = document.getElementById("gallery");
    const sortSelect = document.getElementById("sort");
    const navigationContainer = document.getElementById("navigation");

    let collectionData = [];
    let currentPage = 1;
    const picturesPerPage = 5;

    // function to collect JSON picture data
    async function fetchCollection() {
        try {
            const response = await fetch("resources/media/picture_collection.json");
            collectionData = await response.json();
            renderCollection();            
        } catch (error) {
            console.error("Error fetching collection data: ", error);
        }
    }

    // function to render the collected data
    function renderCollection(data) {
        pictureContainer.innerHTML = "";

        const startIndex = (currentPage - 1) * picturesPerPage;
        const endIndex = startIndex + picturesPerPage;
        const paginatedData = collectionData.slice(startIndex, endIndex);

        paginatedData.forEach(item => {
            const photoCard = document.createElement("article");
            photoCard.classList.add("photo-card");

            photoCard.innerHTML = `
                <img src="${item.image}" alt="${item.description_en}">
                <div class="photo-info">
                    <p class="photo-label">Date: <span>${item.date}</span></p>
                    <p class="photo-label">Country: <span>${item.country}</span></p>
                    <p class="photo-label">City: <span>${item.city}</span></p>
                    <p class="photo-label">Category: <span>${item.category_nl}</span></p>
                    <p class="photo-description">${item.description_nl}</p>
                </div>
            `;
            pictureContainer.appendChild(photoCard);
        });
        
        updateNavigationControls();
    }

    function sortCollection(attribute) {
        collectionData.sort((a, b) => {
            if (attribute === "date") {
                return new Date(a.date) - new Date(b.date);
            }
            return a[attribute].localeCompare(b[attribute]);
        });
        currentPage = 1;
        renderCollection();
    }

    function updateNavigationControls() {
        navigationContainer.innerHTML = `
            <button id="firstPage" ${currentPage === 1 ? "disabled" : ""}>Eerste</button>
            <button id="prevPage" ${currentPage === 1 ? "disabled" : ""}>Previous</button>
            <span> Page ${currentPage} of ${Math.ceil(collectionData.length / picturesPerPage)} </span>
            <button id="nextPage" ${currentPage * picturesPerPage >= collectionData.length ? "disabled" : ""}>Next</button>
            <button id="lastPage" ${currentPage * picturesPerPage >= collectionData.length ? "disabled" : ""}>Laatste</button>
        `;

        // navigationButton listeners
        document.getElementById("prevPage").addEventListener("click", () => changePageDirection(-1));
        document.getElementById("nextPage").addEventListener("click", () => changePageDirection(1));
        document.getElementById("firstPage").addEventListener("click", () => changePage(1));
        document.getElementById("lastPage").addEventListener("click", () => changePage(Math.ceil(collectionData.length / picturesPerPage))); // Math.ceil 
    }

    function changePageDirection(direction) {
        currentPage += direction;
        renderCollection();
    }

    function changePage(page) {
        if (page < 1) page = 1;
        if (page > Math.ceil(collectionData.length / picturesPerPage)) page = Math.ceil(collectionData.length / picturesPerPage);

        currentPage = page;
        renderCollection();
    }

    sortSelect.addEventListener("change", () => {
        sortCollection(sortSelect.value);
    });

    fetchCollection();

});