const showSelect = document.getElementById("show-select");
const showDetails = document.getElementById("show-details");
const message = document.getElementById("message");

function setMessage(text) { message.textContent = text; }

function fillDropdown(shows) {
    showSelect.textContent = "";
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "Select a show";
    showSelect.appendChild(placeholder);

    for (const show of shows) {
        const option = document.createElement("option");
        option.value = show.id;
        option.textContent = show.name;
        showSelect.appendChild(option);
    }
}

async function loadShows() {
    const url = "https://api.tvmaze.com/shows?page=0";
    const errorMessage = "Unable to load shows. Please try again.";
    setMessage("Loading shows...");

    try {
        const res = await fetch(url);
        if (!res.ok) { throw new Error(`Request failed with status ${res.status}`); }
        const shows = await res.json();
        shows.sort(function (a, b) {
            const ratingA = a.rating.average || 0;
            const ratingB = b.rating.average || 0;
            return ratingB - ratingA;
        });
        const topShows = shows.slice(0, 25);
        fillDropdown(topShows);
        setMessage("");
    } 
    catch (error) {
        console.error(error);
        setMessage(errorMessage);
    }
}

function displayDetails(show) {
    showDetails.textContent = "";
    const showName = show.name || "Unknown show";
    const heading = document.createElement("h2");
    heading.textContent = showName;
    showDetails.appendChild(heading);

    if (show.image && show.image.medium) {
        const poster = document.createElement("img");
        poster.src = show.image.medium;
        poster.alt = `Poster for ${showName}`;
        showDetails.appendChild(poster);
    } 
    else {
        const noPoster = document.createElement("p");
        noPoster.textContent = "No poster available";
        showDetails.appendChild(noPoster);
    }

    const summary = document.createElement("div");
    summary.innerHTML = show.summary || "No summary available.";
    showDetails.appendChild(summary);
    const genres = document.createElement("p");
    const genreText = (show.genres || []).join(", ") || "Not listed";
    genres.textContent = `Genres: ${genreText}`;
    showDetails.appendChild(genres);
    const premiered = document.createElement("p");
    premiered.textContent = `Premiered: ${show.premiered || "Unknown"}`;
    showDetails.appendChild(premiered);
    const status = document.createElement("p");
    status.textContent = `Status: ${show.status || "Unknown"}`;
    showDetails.appendChild(status);
    let ratingText = "Not rated";

    if (show.rating && show.rating.average !== null && show.rating.average !== undefined) { ratingText = show.rating.average; }

    const rating = document.createElement("p");
    rating.textContent = `Rating: ${ratingText}`;
    showDetails.appendChild(rating);
}

async function loadShowDetails(id) {
    const url = `https://api.tvmaze.com/shows/${id}`;
    let errorMessage = "Unable to load show details. Please try again.";
    setMessage("Loading show details...");
    try {
        const res = await fetch(url);
        if (!res.ok) {
            // Give a missing show its own specific error message.
            if (res.status === 404) {
                errorMessage = "The show could not be found.";
                throw new Error(errorMessage);
            }
            throw new Error(`Request failed with status ${res.status}`);
        }
        const show = await res.json();
        displayDetails(show);
        setMessage("");
    } 
    catch (error) {
        console.error(error);
        setMessage(errorMessage);
    }
}

showSelect.addEventListener("change", function () {
    const id = showSelect.value;
    if (id === "") { return;}

    loadShowDetails(id);
});

loadShows();