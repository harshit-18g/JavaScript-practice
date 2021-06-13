const addMovieBtn = document.getElementById("add-movie-btn");
const searchBtn = document.getElementById("search-btn");
const userInputs = document.querySelectorAll('#user-input input');
const movieList = document.getElementById('movie-list');

const movies = [];

function clearInputs(){
    for(const userInput of userInputs){
        userInput.value='';
    }
}

function renderMovie(filter = ''){
    if(movies.length === 0){
        movieList.classList.remove('visible');
        return;
    }else{
        movieList.classList.add('visible');
    }

    movieList.innerHTML='';

    const filteredMovies = !filter? movies : movies.filter(movie => movie.info.title.includes(filter));
    filteredMovies.forEach(movie => {
        const movieElement = document.createElement('li');
        let text = movie.info.title + ' - ';
        for(const key in movie.info){
            if(key !== 'title'){
                text = text + `${key}: ${movie.info[key]}`;
            }
        }
        movieElement.textContent = text;
        movieList.append(movieElement);
    });
}

function addMovieHandler(){
    const title = document.getElementById("title").value;
    const extraName = document.getElementById("extra-name").value;
    const extraValue = document.getElementById("extra-value").value;

    if(title.trim === '' || extraName === '' || extraValue === ''){
        alert("Kindly enter all the details !!!");
        return;
    }

    const newMovie = {
        info : {
            title,  //shorthand for title: title  not for title: 'title'
            [extraName]: extraValue  //[extraname] will set extraname user input value as a key
        },
        id: Math.random()
    };

    movies.push(newMovie);
    renderMovie();
    clearInputs();
}

function filterMovieHandler(){
    const filterTrem = document.getElementById('filter-title').value;
    renderMovie(filterTrem);
}
addMovieBtn.addEventListener('click',addMovieHandler);
searchBtn.addEventListener('click',filterMovieHandler);