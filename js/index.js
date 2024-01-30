// scripts.js

document.addEventListener("DOMContentLoaded", function () {
    const filmsList = document.getElementById("user-list");
    const buyTicketButton = document.getElementById("buyticket");

    // Make a GET request to retrieve movie data from the server
    const endpoint = "http://localhost:3000/films"; // Update with your server endpoint

    fetch(endpoint)
        .then(response => response.json())
        .then(data => {
            // Remove the placeholder li element
            const placeholderLi = filmsList.querySelector(".film.item");
            filmsList.removeChild(placeholderLi);

            // Populate the movie list
            data.forEach(movie => {
                const li = document.createElement("li");
                li.className = "film item";
                li.innerHTML = `<img src="${movie.poster}" alt="${movie.title}"><br>${movie.title}`;
                li.addEventListener("click", () => showMovieDetails(movie));
                filmsList.appendChild(li);
            });

            // Display details for the first movie initially
            if (data.length > 0) {
                showMovieDetails(data[0]);
            }
        })
        .catch(error => console.error("Error fetching movie data:", error));

    function showMovieDetails(movie) {
        // Update the HTML elements with the selected movie details
        document.getElementById("poster").src = movie.poster;
        document.getElementById("title").innerText = movie.title;
        document.getElementById("runtime").innerText = movie.runtime;
        document.getElementById("showtime").innerText = movie.showtime;

        // Calculate available tickets by subtracting tickets_sold from capacity
        const availabletickets = movie.capacity - movie.tickets_sold;
        const availableticketsElement = document.getElementById("availabletickets");
        availableticketsElement.innerText = availabletickets;

        // Update the Buy Ticket button based on ticket availability
        buyTicketButton.disabled = availabletickets === 0;
    }

    // Buy Ticket functionality
    buyTicketButton.addEventListener("click", function () {
        const availableticketsElement = document.getElementById("availabletickets");
        let availabletickets = parseInt(availableticketsElement.innerText, 10);

        const filmItems = filmsList.getElementsByClassName("film item");
        Array.from(filmItems).forEach(filmItem => {
            filmItem.classList.remove("sold-out");
        });

        if (availabletickets > 0) {
            // Simulate buying a ticket
            availabletickets -= 1;
            availableticketsElement.innerText = availabletickets;

            alert("Ticket Bought!");

            // Update tickets_sold on the server
            const movieId = document.querySelector(".film.item.active").dataset.id; // Assuming you have a unique identifier for each movie
            const patchEndpoint = `http://localhost:3000/films/${movieId}`;

            fetch(patchEndpoint, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ tickets_sold: movieId.tickets_sold + 1 }),
            })
                .then(response => response.json())
                .then(updatedMovie => {
                    // Optionally update the movie details on the frontend
                    showMovieDetails(updatedMovie);
                })
                .catch(error => console.error("Error updating movie data:", error));
    }
    });
});
