const listElement = document.querySelector('.posts');
const postTemplate = document.getElementById('single-post');
const form = document.querySelector('#new-post form');
const fetchBtn = document.querySelector('#available-posts button');

function clearInputs(){
    form.querySelector('input').value = '';
    form.querySelector('textarea').value = '';
}

function deleteData(id){
    const item = document.getElementById(id);
    listElement.removeChild(item);
}

async function fetchData(){
    try{
        const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
        const listOfPosts = response.data;
        for(const post of listOfPosts){
            const postEl = document.importNode(postTemplate.content, true); 
            postEl.querySelector('h2').textContent = post.id + '. ' + post.title.toUpperCase();
            postEl.querySelector('p').textContent = post.body;
            postEl.querySelector('li').id = post.id;
            listElement.append(postEl);
        }
    }catch(error){
        alert(error.message);
    }
}

async function createPost(title, content){
    const userId = Math.random();
    const post = {
        title: title,
        body: content,
        userId: userId
    };
    try{
        await axios.post('https://jsonplaceholder.typicode.com/posts', post);
    }catch(error){
        alert(error.message);
    }
}

async function deletePost(postId){
    try{
        const response = await axios.delete(`https://jsonplaceholder.typicode.com/posts/${postId}`);
        if(response){
            deleteData(postId);
        }
    }catch(error){
        alert(error.message);
    }
}

fetchBtn.addEventListener('click', fetchData);
form.addEventListener('submit', event => {
    event.preventDefault();
    const enteredTitle = event.currentTarget.querySelector('#title').value;
    const enteredContent = event.currentTarget.querySelector('#content').value;

    if(enteredTitle.trim() === '' || enteredContent.trim() === ''){
        alert('Please enter all fields !!!');
        return;
    }
    clearInputs();
    createPost(enteredTitle, enteredContent);
});

listElement.addEventListener('click', event => {
    if(event.target.tagName === 'BUTTON'){
        const postId = event.target.closest('li').id;
        deletePost(postId);
    }
});
