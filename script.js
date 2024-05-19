const API_KEY = 'e687f88751c2aa706f7199eedd97bf54';
const ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlNjg3Zjg4NzUxYzJhYTcwNmY3MTk5ZWVkZDk3YmY1NCIsInN1YiI6IjY2NDllZmViOTUwMTUxOWM5ZDFkODIzNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.fGLo1nj3bIYlSnbCPtpcZVbbpT4YbWIvVzezmqM-V-s';
const ACCOUNT_ID = '21277698'; // Kendi hesap ID'nizi buraya yazın

async function getFavoriteMovies() {
    const url = `https://api.themoviedb.org/3/account/${ACCOUNT_ID}/favorite/movies?api_key=${API_KEY}&language=tr-TR&sort_by=created_at.asc`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            console.error('Favori filmleri getirirken bir hata oluştu:', response.statusText);
            return null;
        }

        const data = await response.json();
        console.log('API Yanıtı:', data); // Konsola API yanıtını yazdır
        return data.results;
    } catch (error) {
        console.error('API isteği sırasında bir hata oluştu:', error);
        return null;
    }
}

function displayMovies(movies) {
    const moviesContainer = document.getElementById('movies');
    moviesContainer.innerHTML = ''; // Önceki içerikleri temizle

    if (!movies || movies.length === 0) {
        moviesContainer.textContent = 'Favori filminiz bulunmamaktadır.';
        return;
    }

    movies.forEach(movie => {
        const movieDiv = document.createElement('div');
        movieDiv.classList.add('movie');

        const title = document.createElement('div');
        title.classList.add('title');
        title.textContent = movie.title;

        const overview = document.createElement('div');
        overview.classList.add('overview');
        overview.textContent = movie.overview;

        movieDiv.appendChild(title);
        movieDiv.appendChild(overview);
        moviesContainer.appendChild(movieDiv);
    });

    document.getElementById('hideMoviesButton').style.display = 'inline-block';
}

function hideMovies() {
    const moviesContainer = document.getElementById('movies');
    moviesContainer.innerHTML = '';
    document.getElementById('hideMoviesButton').style.display = 'none';
}

document.getElementById('getMoviesButton').addEventListener('click', async () => {
    const movies = await getFavoriteMovies();
    if (movies) {
        displayMovies(movies);
    }
});

document.getElementById('hideMoviesButton').addEventListener('click', hideMovies);
function displayMovies(movies) {
    const moviesContainer = document.getElementById('movies');
    moviesContainer.innerHTML = ''; // Önceki içeriği temizle

    if (!movies || movies.length === 0) {
        moviesContainer.textContent = 'Favori filminiz bulunmamaktadır.';
        return;
    }

    for (let i = 0; i < movies.length; i += 3) {
        const row = document.createElement('div');
        row.classList.add('row');

        for (let j = i; j < i + 3 && j < movies.length; j++) {
            const movie = movies[j];

            const col = document.createElement('div');
            col.classList.add('col-md-4');

            const card = document.createElement('div');
            card.classList.add('card', 'mb-4');

            const cardImg = document.createElement('img');
            cardImg.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
            cardImg.classList.add('card-img-top');
            cardImg.alt = movie.title;

            const cardBody = document.createElement('div');
            cardBody.classList.add('card-body');

            const title = document.createElement('h5');
            title.classList.add('card-title');
            title.textContent = movie.title;

            const overview = document.createElement('p');
            overview.classList.add('card-text');
            overview.textContent = movie.overview;

            cardBody.appendChild(title);
            cardBody.appendChild(overview);

            card.appendChild(cardImg);
            card.appendChild(cardBody);

            col.appendChild(card);
            row.appendChild(col);
        }

        moviesContainer.appendChild(row);
    }

    document.getElementById('hideMoviesButton').style.display = 'inline-block';
}
