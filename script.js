const input = document.getElementById("countryInput");
const btn = document.getElementById("searchBtn");
const result = document.getElementById("result");
const statusEl = document.getElementById("status");
const datalist = document.getElementById("countriesList");

// formatare numere
function formatNumber(n) {
    return new Intl.NumberFormat("ro-RO").format(n);
}

//extrage limbi
function getLanguages(languages) {
    if (!languages) return "N/A";
    return Object.values(languages).join(", ");
}

//extrage moneda
function getCurrency(currencies) {
    if (!currencies) return "N/A";
    const key = Object.keys(currencies)[0];
    return currencies[key].name;
}

//afiseaza cardul
function renderCountry(country) {
    result.innerHTML = `
      <div class="card">
        <div class="left">
         <img class="flag" src="${country.flags.png}" alt="flag" />
         <div>
           <p class="country-name">${country.name.common}</p>
           <div class="meta">
              <div><span>Capital:</span>${country.capital?.[0] ?? "N/A"}</div>
              <div><span>Language:</span>${getLanguages(country.languages)}</div>
              <div><span>Currency:</span>${getCurrency(country.currencies)}</div>
              <div><span>Map:</span>
                <a href="${country.maps.googleMaps}" target="_blank">Google Maps</a>
              </div>
           </div>
        </div>
      </div>

        <div class="right">
          <div><span>Population:</span> ${formatNumber(country.population)}</div>
        </div>
      </div>
    `;
}

// cautare tara
async function searchCountry() {
    const query = input.value.trim();
    if (!query) return;
    
    statusEl.textContent = "Se cauta...";
    result.innerHTML = "";

    try {
        const res = await fetch(
          `https://restcountries.com/v3.1/name/${query}?fullText=true`
        );

        if (!res.ok) throw new Error("Tara nu a fost gasita");

        const data =  await res.json();
        renderCountry(data[0]);
        statusEl.textContent = "";
    } catch (err) {
        statusEl.textContent = err.message;
    }
}

// autocomplete
async function loadCountries() {
    try {
        const res = await fetch("https://restcountries.com/v3.1/all?fields=name");
        const data = await res.json();
        datalist.innerHTML = data
            .map(c => `<option value="${c.name.common}">`)
            .join("");
    } catch {}
}

// events
btn.addEventListener("click", searchCountry);
input.addEventListener("keydown", e => {
    if (e.key === "Enter") searchCountry();
});

//default
input.value = "Romania";
loadCountries();
searchCountry();