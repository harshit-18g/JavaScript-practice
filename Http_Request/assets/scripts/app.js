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

function sendHttpRequest(method, url, data){
    const promise = new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
    //     xhr.setRequestHeader('Content-Type','application/json'); // this setRequestHeader method is used to set header to the requests sent
    //     // the first parameter is the header key and second one is the value
    //     // to add more than one header rewrite the function 
        xhr.open(method, url);
        xhr.responseType = 'json';//this is inbuilt xml method to parse data behind the scenes automatically
        
        xhr.onload = function(){
            if(xhr.status >= 200 && xhr.status < 300){
                resolve(xhr.response);
            }else{
                reject(new Error('Something Went Wrong !!!'));
            }
        }

        xhr.onerror = function(){
            reject(new Error('Failed to send request !!!'));
        }

        xhr.send(JSON.stringify(data));
    });  
    
    return promise;
    // XMLHttpRequest is old version
    // now browsers developed new API and added to the JS i.e. fetch() API
    // return fetch(url, {
    //     method: method, // by default the method is GET
    //     body: JSON.stringify(data)
        // headers: {
        //     'Content-Type': 'application/json',
        // you can add multiple headers here in key-value form   
        // }
    // }).then(response => response.json());
    // the response that we will get is not automatically parsed in json format hence we have to do it manually
    // fetch() itself is promisified so no need to explicitly use promise
    // error handling in fetch() is also very complex
    // it will not work in older browsers such as IE
}

async function fetchData(){
    try{
        const responseData = await sendHttpRequest('GET','https://jsonplaceholder.typicode.com/posts');
        //const listOfPosts = JSON.parse(xhr.response); //JSON.parse is the manual way to convert JSON data to JS data type
        const listOfPosts = responseData; //we can do this because of responseType set above otherwise use JSON.parse 
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
    sendHttpRequest('POST', 'https://jsonplaceholder.typicode.com/posts', post);
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
        sendHttpRequest('DELETE', `https://jsonplaceholder.typicode.com/posts/${postId}`);
        deleteData(postId);
    }
});
