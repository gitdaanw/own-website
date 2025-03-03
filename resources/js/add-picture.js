import { collectionData } from "../media/images/picture_collection.js";

document.addEventListener("DOMContentLoaded", function () {
    const loggedInUser = localStorage.getItem("loggedInUser");

    if (!loggedInUser) {
        window.location.href = "index.html"; // Redirect if not logged in
    }

    document.getElementById("logoutBtn").addEventListener("click", function () {
        localStorage.removeItem("loggedInUser"); // clear login state
        window.location.href = "index.html";
    });

    // handle adding a picture
    const addPictureForm = document.getElementById("addPictureForm");

    addPictureForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent page refresh

        let storedData = JSON.parse(localStorage.getItem("collectionData")) || [];

        // get form data
        const newPicture = {
            image: document.getElementById("image").value,
            date: document.getElementById("date").value,
            country_nl: document.getElementById("country_nl").value,
            country_en: document.getElementById("country_nl").value,
            city: document.getElementById("city").value,
            category_nl: document.getElementById("category_nl").value,
            category_en: document.getElementById("category_nl").value, 
            description_nl: document.getElementById("description_nl").value,
            description_en: document.getElementById("description_nl").value 
        };

        // Add new picture to the collection
        storedData.push(newPicture);
        
        // Save to local storage, this is only usable in dome as it is tempstorage
        localStorage.setItem("collectionData", JSON.stringify(storedData));

        alert("Picture added successfully!");

        // Redirect to gallery page
        window.location.href = "pictures.html";
    });
});
