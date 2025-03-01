document.addEventListener("DOMContentLoaded", function () {
    const pictureContainer = document.getElementById("gallery");
    const sortSelect = document.getElementById("sort");
    const navigationContainer = document.getElementById("navigation");
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const closeBtn = document.getElementById("close-lightbox");
    

    let collectionData = [];
    let currentPage = 1;
    const picturesPerPage = 5;

    // function to collect JSON picture data
    async function fetchCollection() {
        try {
            const response = await fetch("resources/media/picture_collection.json");
            collectionData = await response.json();
            
            sortCollection("date", "asc");
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
                <img src="${item.image}" alt="${item.description_en}" class="photo-thumbnail" data-full="${item.image}">
                <div class="photo-info">
                    <p class="photo-label">Date: <span>${item.date}</span></p>
                    <p class="photo-label">Country: <span>${item.country_nl}</span></p>
                    <p class="photo-label">City: <span>${item.city}</span></p>
                    <p class="photo-label">Category: <span>${item.category_nl}</span></p>
                    <p class="photo-description">${item.description_nl}</p>
                </div>
            `;
            pictureContainer.appendChild(photoCard);
        });
        
        updateNavigationControls();
        addLightboxEventListeners();
    }
    
    // 
    function openLightbox(imageSrc) {
        lightbox.style.display = "flex";
        lightboxImg.src = imageSrc;
    }

    function closeLightbox() {
        lightbox.style.display = "none";
    }

    function addLightboxEventListeners() {
        document.querySelectorAll(".photo-thumbnail").forEach(image => {
            image.addEventListener("click", function () {
                openLightbox(this.dataset.full);
            });
        });
    }

    closeBtn.addEventListener("click", closeLightbox);



    // function to sort the collection using the labels
    function sortCollection(attribute, order = "asc") {
        collectionData.sort((a, b) => {
            let result;
            
            if (attribute === "date") {
                result = new Date(a.date) - new Date(b.date);
            } else {
                result = a[attribute].localeCompare(b[attribute]);
            }
    
            return order === "desc" ? -result : result;
        });
    
        currentPage = 1;
        renderCollection();
    }

    // Navigationcontrols functions
    function updateNavigationControls() {
        navigationContainer.innerHTML = `
            <button id="firstPage" ${currentPage === 1 ? "disabled" : ""}><<</button>
            <button id="prevPage" ${currentPage === 1 ? "disabled" : ""}><</button>
            <span> Page ${currentPage} of ${Math.ceil(collectionData.length / picturesPerPage)} </span>
            <button id="nextPage" ${currentPage * picturesPerPage >= collectionData.length ? "disabled" : ""}>></button>
            <button id="lastPage" ${currentPage * picturesPerPage >= collectionData.length ? "disabled" : ""}>>></button>
        `;

        // navigationButton listeners
        document.getElementById("prevPage").addEventListener("click", () => changePageDirection(-1));
        document.getElementById("nextPage").addEventListener("click", () => changePageDirection(1));
        document.getElementById("firstPage").addEventListener("click", () => changePage(1));
        document.getElementById("lastPage").addEventListener("click", () => changePage(Math.ceil(collectionData.length / picturesPerPage))); // Math.ceil 
    }

    // change page function back or forward direction
    function changePageDirection(direction) {
        currentPage += direction;
        renderCollection();
    }

    // change page function
    function changePage(page) {
        if (page < 1) page = 1;
        if (page > Math.ceil(collectionData.length / picturesPerPage)) page = Math.ceil(collectionData.length / picturesPerPage);

        currentPage = page;
        renderCollection();
    }


    // event sort listener
    sortSelect.addEventListener("change", () => {
        const selectedOption = sortSelect.value;
        const [attribute, order] = selectedOption.split("-");
        sortCollection(attribute, order === "desc" ? "desc" : "asc");
    });

    fetchCollection();

});