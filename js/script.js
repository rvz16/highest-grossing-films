document.addEventListener('DOMContentLoaded', function () {
    const filmCardsContainer = document.getElementById('film-cards');
    const yearFilterInput = document.getElementById('year-filter');
    const directorFilterInput = document.getElementById('director-filter');
    const countryFilterInput = document.getElementById('country-filter');
    const filterButton = document.getElementById('filter-button');
    const resetButton = document.getElementById('reset-button');

    let films = [];

    fetch('films_exported.json')
        .then(response => response.json())
        .then(data => {
            films = data;
            displayFilms(films);
            createBoxOfficeChart(films);
            createDirectorChart(films);
            createCountryChart(films);
            createYearChart(films);
        })
        .catch(error => console.error('Error loading JSON data:', error));

    function displayFilms(films) {
        filmCardsContainer.innerHTML = '';
        films.forEach(film => {
            const card = document.createElement('div');
            card.className = 'film-card';
            card.innerHTML = `
                <h3>${film.title}</h3>
                <p><strong>Release Year:</strong> ${film.release_year}</p>
                <p><strong>Director:</strong> ${film.director}</p>
                <p><strong>Box Office:</strong> $${film.box_office}</p>
                <p><strong>Country:</strong> ${film.country}</p>
            `;
            filmCardsContainer.appendChild(card);
        });
    }

    filterButton.addEventListener('click', () => {
        const year = parseInt(yearFilterInput.value);
        const director = directorFilterInput.value.trim().toLowerCase();
        const country = countryFilterInput.value.trim().toLowerCase();

        const filteredFilms = films.filter(film => {
            const matchesYear = isNaN(year) || film.release_year === year;
            const matchesDirector = director === '' || film.director.toLowerCase().includes(director);
            const matchesCountry = country === '' || film.country.toLowerCase().includes(country);
            return matchesYear && matchesDirector && matchesCountry;
        });

        displayFilms(filteredFilms);
        createBoxOfficeChart(filteredFilms);
        createDirectorChart(filteredFilms);
        createCountryChart(filteredFilms);
        createYearChart(filteredFilms);
    });

    resetButton.addEventListener('click', () => {
        yearFilterInput.value = '';
        directorFilterInput.value = '';
        countryFilterInput.value = '';
        displayFilms(films);
        createBoxOfficeChart(films);
        createDirectorChart(films);
        createCountryChart(films);
        createYearChart(films);
    });

    function createBoxOfficeChart(films) {
        const sortedFilms = films.sort((a, b) => {
            const boxOfficeA = parseFloat(a.box_office.replace(/,/g, ''));
            const boxOfficeB = parseFloat(b.box_office.replace(/,/g, ''));
            return boxOfficeB - boxOfficeA;
        }).slice(0, 10);

        const labels = sortedFilms.map(film => film.title);
        const boxOfficeData = sortedFilms.map(film => parseFloat(film.box_office.replace(/,/g, '')) / 1000000000);

        const ctx = document.getElementById('boxOfficeChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Box Office Revenue',
                    data: boxOfficeData,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Box Office Revenue (in billions)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Film Title'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    function createDirectorChart(films) {
        const directorCounts = films.reduce((acc, film) => {
            acc[film.director] = (acc[film.director] || 0) + 1;
            return acc;
        }, {});

        const labels = Object.keys(directorCounts);
        const data = Object.values(directorCounts);

        const ctx = document.getElementById('directorChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Number of Films',
                    data: data,
                    backgroundColor: 'rgba(153, 102, 255, 0.2)',
                    borderColor: 'rgba(153, 102, 255, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Number of Films'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Director'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    function createCountryChart(films) {
        const countryCounts = films.reduce((acc, film) => {
            acc[film.country] = (acc[film.country] || 0) + 1;
            return acc;
        }, {});

        const labels = Object.keys(countryCounts);
        const data = Object.values(countryCounts);

        const ctx = document.getElementById('countryChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Number of Films',
                    data: data,
                    backgroundColor: 'rgba(255, 159, 64, 0.2)',
                    borderColor: 'rgba(255, 159, 64, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Number of Films'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Country'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    function createYearChart(films) {
        const yearCounts = films.reduce((acc, film) => {
            acc[film.release_year] = (acc[film.release_year] || 0) + 1;
            return acc;
        }, {});

        const labels = Object.keys(yearCounts);
        const data = Object.values(yearCounts);

        const ctx = document.getElementById('yearChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Number of Films',
                    data: data,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Number of Films'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Release Year'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
});