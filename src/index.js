import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';


const DEBOUNCE_DELAY = 300;

const searchBox = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

searchBox.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(event) {
    resetMarkup();

    const searchContry = event.target.value;

    if (searchContry === '') {
        return;
    }

    const normalizedSearchCountry = searchContry.trim().toLowerCase();
    fetchCountries(normalizedSearchCountry)
        .then(countries => renderMarkupCountry(countries))
        .catch(error => Notify.failure('Oops, there is no country with that name'));
}

function renderMarkupCountry(countries) {
    if (countries.length > 10) {
        Notify.info('Too many matches found. Please enter a more specific name.');
    } else if (countries.length > 1) {
        const markup = countries
            .map(({ flags, name }) => {
                return `
        <li class = "country-item">
            <img class = "country-img" src="${flags.svg}" alt="${name.official}" width="60" height="40" />
            <p class="country-label">${name.official}</p> 
        </li>`;
            })
            .join('');

        countryList.innerHTML = markup;
    } else if (countries.length === 1) {
        const markup = countries
            .map(({ flags, name, capital, population, languages }) => {
                return `
        <div class="country-info-header">
            <img class="country-info-img" src="${flags.svg}" alt="${name.common
                    }" width="200" height="100"/>
            <h2 class="country-info-title">${name.official}</h2>
        </div>
        <ul class="country-info-list">
          <li class="country-info-item">
            <p class="country-info-title">Capital: <span class="country-info-text">${capital[0]
                    }</span></p>
            
          </li>
          <li class="country-info-item">
            <p class="country-info-title">Population: <span class="country-info-text">${population}</span></p>
            
          </li>
          <li class="country-info-item">
            <p class="country-info-title">Languages: <span class="country-info-text">${Object.values(
                        languages
                    )}</span></p>
          </li>
        </ul>`;
            })
            .join('');

        countryInfo.innerHTML = markup;
    }
}

function resetMarkup() {
    countryInfo.innerHTML = '';
    countryList.innerHTML = '';
}

