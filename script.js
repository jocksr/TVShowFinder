const showSelect = document.getElementById("show-select");


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
    } 
    catch (error) { console.error(error); }
}
loadShows();