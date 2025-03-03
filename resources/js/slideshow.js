import { collectionData } from "../media/images/picture_collection.js";

document.addEventListener("DOMContentLoaded", function () {
    const slideshowImage = document.getElementById("slideshowImage");
    const slideshowDescription = document.getElementById("slideshowDescription");


    let currentIndex = 0;

    // null check
    if(!collectionData || collectionData.length ===0) {
        console.error("No images found in collectionData");
        return;
    }

    // function to update image and description
    function updateSlideshow() {
        slideshowImage.src = collectionData[currentIndex].image;
        slideshowDescription.textContent = collectionData[currentIndex].description_nl;
    }

    slideshowImage.addEventListener("click", function () {
        currentIndex = (currentIndex + 1) % collectionData.length; // cycle through images upon click
        updateSlideshow();
    });

    updateSlideshow();
});

