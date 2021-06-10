const addMovieModal = document.getElementById('add-modal');
const startAddMovieBtn = document.querySelector('header button');
const backdrop = document.getElementById('backdrop');
const cancelAddMovieBtn = addMovieModal.querySelector('.btn--passive');
const confirmAddMovieBtn = addMovieModal.querySelector('.btn--success');
const userInputs = addMovieModal.querySelectorAll('input');
const listRoot = document.getElementById('movie-list');
const textEntrySection = document.getElementById('entry-text');
const deleteMovieModal = document.getElementById('delete-modal');

const movies = [];

function toggleBackdrop(){
    backdrop.classList.toggle('visible');
}

function removeMovieModal(){
    addMovieModal.classList.remove('visible');
}

function showMovieModal(){
    addMovieModal.classList.add('visible');
    toggleBackdrop();
}

function clearModalInputs(){
    for(const userInput of userInputs){
        userInput.value='';
    }
}

function backdropClickHandler(){
    removeMovieModal();
    closeMovieDeletionModal();
}

function cancelAddMovie(){
    removeMovieModal();
    toggleBackdrop();
    clearModalInputs();
}

function updateUI(){
    if(movies.length===0){
        textEntrySection.style.display='block';
    }else{
        textEntrySection.style.display='none';
    }
}

function deleteMovie(movieId){
    let movieIndex = 0;
    for(const movie of movies){
        if(movie.id===movieId){
            movies.splice(movieIndex,1);
            break;
        }
        movieIndex++;
    }
    listRoot.removeChild(listRoot.children[movieIndex]);
    closeMovieDeletionModal();
    updateUI();
}

function closeMovieDeletionModal(){
    toggleBackdrop();
    deleteMovieModal.classList.remove('visible');
}

function deleteMovieHandler(movieId){
    deleteMovieModal.classList.add('visible');
    toggleBackdrop();
    const cancelDeletionBtn = deleteMovieModal.querySelector('.btn--passive');
    let confirmDeletionBtn = deleteMovieModal.querySelector('.btn--danger');

    confirmDeletionBtn.replaceWith(confirmDeletionBtn.cloneNode(true));
    confirmDeletionBtn = deleteMovieModal.querySelector('.btn--danger');
    
    cancelDeletionBtn.removeEventListener('click',closeMovieDeletionModal);

    cancelDeletionBtn.addEventListener('click',closeMovieDeletionModal);
    confirmDeletionBtn.addEventListener('click',deleteMovie.bind(null,movieId));
}

function renderNewMovie(id, title, image, rating){
    const newMovieElement = document.createElement('li');
    newMovieElement.className='movie-element';
    newMovieElement.innerHTML=`
        <div class="movie-element__image">
            <img src="${image}" alt="${title}">
        </div>
        <div class="movie-element__info">
            <h2>${title}</h2>
            <p>${rating}/5 stars</p>
        </div>
    `;
    newMovieElement.addEventListener('click',deleteMovieHandler.bind(null,id));
    listRoot.append(newMovieElement);
}

function confirmAddMovie(){
    const movieTitle = userInputs[0].value;
    const imageURL = userInputs[1].value;
    const movieRating = userInputs[2].value;

    if(movieTitle.trim()==='' || imageURL.trim()==='' || movieRating.trim()==='')
    {
        alert('Please enter valid values !!!');
        return;
    }
    else if(+movieRating<1 || +movieRating>5)
    {
        alert('Rating value must be between 1 and 5 !!!');
        return;
    }

    const newMovie = {
        id : Math.random().toString(),
        title : movieTitle,
        imageURL : imageURL,
        rating : movieRating
    };

    movies.push(newMovie);
    clearModalInputs();
    removeMovieModal();
    toggleBackdrop();
    renderNewMovie(newMovie.id, newMovie.title, newMovie.imageURL, newMovie.rating);
    updateUI();
}

startAddMovieBtn.addEventListener('click',showMovieModal);
backdrop.addEventListener('click',backdropClickHandler);
cancelAddMovieBtn.addEventListener('click',cancelAddMovie);
confirmAddMovieBtn.addEventListener('click',confirmAddMovie);