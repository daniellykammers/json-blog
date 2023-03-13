import PostsService from './services/posts.js';
import CommentsService from './services/comments.js';
const postModal = document.getElementById('post-modal');
const postModalCloseButton = document.getElementById('close-modal');
const postModalTitle = document.getElementById('post-modal-title');
const postModalLoader = document.getElementById('modal-loader-wrapper');
const modalContent = document.getElementById('post-modal-content');

const modalContentCreatorName = document.getElementById(
  'modal-content-creator-name'
);
const modalContentCreatorUsername = document.getElementById(
  'modal-content-creator-username'
);
const modalContentBody = document.getElementById('modal-content-body');
const modalContentComments = document.getElementById('modal-content-comments');

const getMoreButton = document.getElementById('get-more-button');
getMoreButton.onclick = () => getPosts();

document.addEventListener(
  'click',
  function (event) {
    if (event.target === postModalCloseButton || event.target === postModal) {
      closeModal();
    }
  },
  false
);

function closeModal() {
  postModal.style.display = 'none';
}

const postsService = new PostsService();
const commentsService = new CommentsService();

async function showComments(postId) {
  postModalLoader.style.display = 'flex';
  modalContent.style.display = 'none';
  modalContentComments.innerHTML = '';

  const postComments = await commentsService.fetchPostComments(postId);

  postComments.forEach((comment) => {
    const commentContent = document.createElement('div');
    const creatorInfos = document.createElement('div');
    const creatorPhoto = document.createElement('img');
    const creator = document.createElement('p');
    const body = document.createElement('p');

    commentContent.className = 'post-comment-wrapper';
    creatorInfos.className = 'comment-creator-info';
    creatorPhoto.src = './images/user-black.svg';
    creator.innerText = comment.email;
    body.innerText = comment.body;

    creatorInfos.appendChild(creatorPhoto);
    creatorInfos.appendChild(creator);
    commentContent.appendChild(creatorInfos);
    commentContent.appendChild(body);
    modalContentComments.appendChild(commentContent);
  });

  postModalLoader.style.display = 'none';
  modalContent.style.display = 'flex';
}

function openModal(post) {
  modalContentCreatorName.innerText = post.creator.name;
  modalContentCreatorUsername.innerText = ` @${post.creator.username}`;
  modalContentBody.innerText = post.body;

  postModalTitle.innerText = post.title;
  postModal.style.display = 'block';

  showComments(post.id);
}

function showPosts(posts) {
  const postsWrapper = document.getElementById('posts-wrapper');

  posts.forEach((post) => {
    const postContent = document.createElement('div');
    postContent.className = 'post-wrapper';
    postContent.onclick = () => openModal(post);
    const creatorInfos = document.createElement('div');
    const creatorPhoto = document.createElement('img');
    const creator = document.createElement('p');
    const title = document.createElement('h3');

    creatorInfos.className = 'post-creator-info';
    creatorPhoto.src = './images/user.svg';
    creator.innerText = post.creator.name;
    title.innerText = post.title;

    creatorInfos.appendChild(creatorPhoto);
    creatorInfos.appendChild(creator);
    postContent.appendChild(creatorInfos);
    postContent.appendChild(title);
    postsWrapper.appendChild(postContent);
  });
}

async function getPosts() {
  const loader = document.getElementById('loader-wrapper');
  loader.style.display = 'flex';
  getMoreButton.style.display = 'none';

  const posts = await postsService
    .fetchPaginatedPosts()
    .then((res) => {
      getMoreButton.style.display = 'block';
      return res;
    })
    .catch((res) => window.alert(res.message));

  loader.style.display = 'none';

  showPosts(posts);
}

getPosts();
