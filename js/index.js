
document.addEventListener("DOMContentLoaded", function () {
    const filmsList = document.getElementById("user-list");
    const buyTicketButton = document.getElementById("buyticket");

    
    const endpoint = "http://localhost:3000/films"; 

    fetch(endpoint)
        .then(response => response.json())
        .then(data => {
            
            const placeholderLi = filmsList.querySelector(".film.item");
            filmsList.removeChild(placeholderLi);

            
            data.forEach(movie => {
                const li = document.createElement("li");
                li.className = "film item";
                li.innerHTML = `<img src="${movie.poster}" alt="${movie.title}"><br>${movie.title}`;
                li.addEventListener("click", () => showMovieDetails(movie));
                filmsList.appendChild(li);
            });

            
            if (data.length > 0) {
                showMovieDetails(data[0]);
            }
        })
        .catch(error => console.error("Error fetching movie data:", error));

    function showMovieDetails(movie) {
       
        document.getElementById("poster").src = movie.poster;
        document.getElementById("title").innerText = movie.title;
        document.getElementById("runtime").innerText = movie.runtime;
        document.getElementById("showtime").innerText = movie.showtime;


        const availabletickets = movie.capacity - movie.tickets_sold;
        const availableticketsElement = document.getElementById("availabletickets");
        availableticketsElement.innerText = availabletickets;


        buyTicketButton.disabled = availabletickets === 0;
    }


    buyTicketButton.addEventListener("click", function () {
        const availableticketsElement = document.getElementById("availabletickets");
        let availabletickets = parseInt(availableticketsElement.innerText, 10);

        const filmItems = filmsList.getElementsByClassName("film item");
        Array.from(filmItems).forEach(filmItem => {
            filmItem.classList.remove("sold-out");
        });

        if (availabletickets > 0) {
            
            availabletickets -= 1;
            availableticketsElement.innerText = availabletickets;

            alert("Ticket Bought!");

            
            const movieId = document.querySelector(".film.item.active").dataset.id; 
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
                    
                    showMovieDetails(updatedMovie);
                })
                .catch(error => console.error("Error updating movie data:", error));
    }
    });
});
