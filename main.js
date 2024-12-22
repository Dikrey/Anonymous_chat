import { nanoid } from 'https://cdn.jsdelivr.net/npm/nanoid/nanoid.js';

// Definisikan generateId sebagai fungsi global
window.generateId = nanoid;
const generateId = () => nanoid();

let posts = [];
const MAX_POSTS = 21;

const getCurrentDateTime = () => {
    const now = new Date();
    const day = now.getDate().toString().padStart(2, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0'); 
    const year = now.getFullYear().toString().slice(2);
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    return `${day}/${month}/${year} | ${hours}:${minutes}:${seconds}`;
};

function handleLogin(event) {
    event.preventDefault();
    const gender = document.getElementById('gender').value;
    const age = document.getElementById('age').value;
    saveUserData(gender, age);
    document.getElementById('login').classList.add('hidden');
    document.getElementById('home').classList.remove('hidden');
}

function saveUserData(gender, age) {
    localStorage.setItem('userData', JSON.stringify({ gender, age }));
}

function checkLoginStatus() {
    const userData = localStorage.getItem('userData');
    if (!userData) {
        document.getElementById('login').classList.remove('hidden');
        document.getElementById('home').classList.add('hidden');
    } else {
        document.getElementById('login').classList.add('hidden');
        document.getElementById('home').classList.remove('hidden');
    }
}

function getUserData() {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
}

function addPost(content) {
    const userData = getUserData();
    const newPost = {
        id: generateId(),
        content,
        date: getCurrentDateTime(),
        userGender: userData.gender,
        userAge: userData.age
    };
    posts.unshift(newPost);
    if (posts.length > MAX_POSTS) {
        posts = posts.slice(0, MAX_POSTS);
    }
    renderPosts();
    savePostsToLocalStorage();
    deleteText();
}

function renderPosts() {
    const postsContainer = document.getElementById('posts');
    postsContainer.innerHTML = posts.map(post => {
        const genderColorClass = post.userGender === 'female' ? 'bg-pink-400' : 'bg-gray-700';
        return `
            <div class="p-4 bg-gray-800 rounded-md shadow-md transition duration-300 ease-in-out hover:bg-gray-700">
                <div class="mb-2 ${genderColorClass} p-1 rounded-md max-w-32 text-base font-bold">
                    ${post.userGender === 'not_specified' 
                        ? `Tidak ditentukan, ${post.userAge} tahun` 
                        : `${post.userGender === 'male' ? 'Pria' : 'Wanita'}, ${post.userAge} tahun`}
                </div>
                <p class="mb-2">${escapeHTML(post.content)}</p>
                <div class="text-right">
                    <span class="text-sm text-gray-400">${post.date}</span>
                    <button class="text-sm text-red-500 ml-2" onclick="deletePost('${post.id}')">Hapus</button>
                </div>
            </div>
        `;
    }).join('');
    postsContainer.scrollTop = postsContainer.scrollHeight;
}

function deletePost(postId) {
    console.log('Deleting post with ID:', postId); // Debugging line
    posts = posts.filter(post => post.id !== postId);  // Filter out the post with the matching ID
    renderPosts();  // Re-render the updated list
    savePostsToLocalStorage();  // Save updated posts to localStorage
}

function handleLogout() {
    localStorage.removeItem('userData');
    document.getElementById('login').classList.remove('hidden');
    document.getElementById('home').classList.add('hidden');
}

function deleteText() {
    document.getElementById('newPost').value = "";
}

const escapeHTML = (str) => {
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
};

document.getElementById('postForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const newPostContent = document.getElementById('newPost').value.trim();
    if (newPostContent) {
        addPost(newPostContent);
    }
});

const savePostsToLocalStorage = () => {
    localStorage.setItem('posts', JSON.stringify(posts));
};

const loadPostsFromLocalStorage = () => {
    const savedPosts = localStorage.getItem('posts');
    return savedPosts ? JSON.parse(savedPosts) : [];
};

posts = loadPostsFromLocalStorage();
renderPosts();
checkLoginStatus();

document.getElementById('btnLogout').addEventListener('click', handleLogout);
