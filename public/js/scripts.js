let messagesList = [];

document.addEventListener('DOMContentLoaded', function() {
  async function checkAuthentication() {
    const token = sessionStorage.getItem('token');
  
    const response = await fetch('/api/auth/isAuthenticated', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  
    if (response.ok) {
      const data = await response.json();
      if (data.isAuthenticated) {
        document.getElementById('username').textContent = `Welcome, ${data.user.username}`;
      } else {
        console.log('User is not authenticated');
        window.location.href = '../login.html';
      }
    } else {
      console.error('Failed to check authentication');
      window.location.href = '../login.html';
    }
  }
  

  document.getElementById('logout').addEventListener('click', async function() {

      const token = sessionStorage.getItem('token');

      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
    
      if (response.ok) {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('username');
        window.location.href = '/login.html';
      } else {
        const data = await response.json();
        console.error('Logout failed:', data.message);
      }
    
  });

  checkAuthentication();
});



let intervalId;

// Function to fetch and render data
async function fetchAndRenderData() {
  // fetch and render comments
  const comments = await fetchComments();
  renderComments(comments);

  const users = await fetchUsers();
  renderUsers(users);

  const recentPosts = await fetchRecentPosts();
  renderRecentPosts(recentPosts);
}


// Start interval to fetch and render data every 5 seconds
function startFetchingData() {
  intervalId = setInterval(fetchAndRenderData, 5000);
}

// Stop the interval
function stopFetchingData() {
  clearInterval(intervalId);
}

document.addEventListener('DOMContentLoaded', async () => {

  // Initial fetch and render
  await fetchAndRenderData();

  // Start fetching data initially
  startFetchingData();

  // Attach event listeners to pause/resume interval
  const userSearchInput = document.getElementById('userSearchInput');

  userSearchInput.addEventListener('focus', stopFetchingData);
  userSearchInput.addEventListener('blur', startFetchingData);

  // Attach search event listener
  userSearchInput.addEventListener('input', handleUserSearch);
});




// fetching comments from the backend
async function fetchComments() {
  const response = await fetch('/api/comments', {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem('token')}`
    }
  });
  const comments = await response.json();
  return comments;
}


// sending comment to the database
async function postComment() {
  const commentInput = document.getElementById('new-comment-input');
  const commentText = commentInput.value.trim();
  const username = sessionStorage.getItem('username'); // Assuming username is stored in sessionStorage

  if (commentText) {
    const response = await fetch('/api/comments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionStorage.getItem('token')}`
      },
      body: JSON.stringify({ username, text: commentText })
    });
    const newComment = await response.json();
    renderComment(newComment);
    // location.reload(); //refresh the page after commenting
    commentInput.value = '';
  }
}


// sending reply to the backend
async function postReply(commentId, replyInput, replyInputDiv) {
  const replyText = replyInput.value.trim();
  const username = sessionStorage.getItem('username'); // Assuming username is stored in sessionStorage

  if (replyText) {
    const response = await fetch('/api/comments/reply', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionStorage.getItem('token')}`
      },
      body: JSON.stringify({ commentId, username, text: replyText })
    });
    const updatedComment = await response.json();
    renderComment(updatedComment);
    replyInputDiv.remove();
    // location.reload();
  }
}

function renderComments(comments) {
  const commentList = document.getElementById('commentContainer');
  commentList.innerHTML = '';
  comments.forEach(comment => renderComment(comment));
}

function renderComment(comment) {
  const commentList = document.getElementById('commentContainer');
  const commentBox = document.createElement('div');
  commentBox.className = 'comment-box';

  const avatar = document.createElement('img');
  avatar.className = 'comment-avatar';
  avatar.src = '../images/userCircle.svg';  // Path to the default avatar image

  const commentHeader = document.createElement('div');
  commentHeader.className = 'comment-header';

  const commentAuthor = document.createElement('div');
  commentAuthor.className = 'comment-author';
  commentAuthor.innerText = comment.username;

  const commentTime = document.createElement('div');
  commentTime.className = 'comment-time';
  commentTime.innerText = new Date(comment.createdAt).toLocaleString();

  const commentContent = document.createElement('div');
  commentContent.className = 'comment-content';

  const commentTextDiv = document.createElement('div');
  commentTextDiv.className = 'comment-text';
  commentTextDiv.innerText = comment.text;

  const commentReactions = document.createElement('div');
  commentReactions.className = 'comment-reactions';

  const replyButton = document.createElement('span');
  replyButton.className = 'reply-button';
  replyButton.innerText = 'Reply';
  replyButton.onclick = () => showReplyInput(commentBox, comment._id);

  commentReactions.appendChild(replyButton);

  const replies = document.createElement('div');
  replies.className = 'replies';
  comment.replies.forEach(reply => {
    const replyBox = document.createElement('div');
    replyBox.className = 'reply';

    const replyAvatar = document.createElement('img');
    replyAvatar.className = 'reply-avatar';
    replyAvatar.src = '../images/userTag.svg';  // Path to the default avatar image

    const replyContent = document.createElement('div');
    replyContent.className = 'reply-content';

    const replyAuthor = document.createElement('div');
    replyAuthor.className = 'reply-author';
    replyAuthor.innerText = reply.username;

    const replyTime = document.createElement('div');
    replyTime.className = 'reply-time';
    replyTime.innerText = new Date(reply.createdAt).toLocaleString();

    const replyTextDiv = document.createElement('div');
    replyTextDiv.className = 'reply-text';
    replyTextDiv.innerText = reply.text;

    replyContent.appendChild(replyAuthor);
    replyContent.appendChild(replyTime);
    replyContent.appendChild(replyTextDiv);

    replyBox.appendChild(replyAvatar);
    replyBox.appendChild(replyContent);
    replies.appendChild(replyBox);
  });

  commentHeader.appendChild(avatar);
  commentHeader.appendChild(commentAuthor);
  commentHeader.appendChild(commentTime);

  commentContent.appendChild(commentTextDiv);
  commentContent.appendChild(commentReactions);
  commentContent.appendChild(replies);

  commentBox.appendChild(commentHeader);
  commentBox.appendChild(commentContent);

  commentList.appendChild(commentBox);
}



// function for showing reply input
function showReplyInput(commentBox, commentId) {
  const replyInputDiv = document.createElement('div');
  replyInputDiv.className = 'comment-reply-input reply-input';

  const replyInput = document.createElement('input');
  replyInput.placeholder = 'Enter reply';
  replyInput.id = 'reply-input';

  replyInput.addEventListener('focus', stopFetchingData);
  replyInput.addEventListener('blur', startFetchingData);


  const replyButton = document.createElement('button');
  replyButton.innerText = 'Reply';
  replyButton.onclick = () => postReply(commentId, replyInput, replyInputDiv);

  replyInputDiv.appendChild(replyInput);
  replyInputDiv.appendChild(replyButton);

  const replies = commentBox.querySelector('.replies');
  replies.appendChild(replyInputDiv);
}



async function fetchUsers() {
  const response = await fetch('/api/users', {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem('token')}`
    }
  });
  const users = await response.json();
  // return users.filter(user => user._id !== sessionStorage.getItem('userId'));
  return users;
}



function renderUsers(users) {
  const userList = document.getElementById('userList');
  const currentUserId = sessionStorage.getItem('userId');
  userList.innerHTML = '';
  users.forEach(user => {
    if (user._id !== currentUserId) {
      const userItem = document.createElement('div');
      userItem.className = 'user-item';
      userItem.dataset.userId = user._id;

      const userInfoContainer = document.createElement('div');
      userInfoContainer.className = 'user-info-container'

      const userInfo = document.createElement('span');
      userInfo.className = 'user-info';
      userInfo.innerText = `${user.username}`;

      const userStatus = document.createElement('span');
      userStatus.className = 'user-status'
      userStatus.innerText = user.status;
      
      // Apply the appropriate class based on the user's status
      if (user.status === 'online') {
        userStatus.classList.add('user-status-online');
      } else if (user.status === 'offline') {
        userStatus.classList.add('user-status-offline');
      }

      userInfoContainer.appendChild(userInfo);
      userInfoContainer.appendChild(userStatus);

      const userEmail = document.createElement('span');
      userEmail.className = 'user-school';
      userEmail.innerText = `A student from ${user.highSchool}`;

      const divLine = document.createElement('div');
      divLine.className = 'divLine';

      userItem.appendChild(userInfoContainer);
      userItem.appendChild(userEmail);
      userItem.appendChild(divLine);
      userItem.onclick = () => selectUserForChat(user);
      userList.appendChild(userItem);
    }
  });
}




function handleUserSearch(event) {
  const query = event.target.value.toLowerCase();
  const userItems = document.querySelectorAll('.user-item');
  userItems.forEach(userItem => {
    const username = userItem.innerText.toLowerCase();
    if (username.includes(query)) {
      userItem.style.display = '';
    } else {
      userItem.style.display = 'none';
    }
  });
}

let currentChatUserId = null;

function selectUserForChat(user) {
  currentChatUserId = user._id;
  const chatHeader = document.getElementById('chatHeader');
  chatHeader.innerText = user.username;
  fetchMessages(user._id);
}

async function fetchMessages(userId) {
  const response = await fetch(`/api/messages?recipientId=${userId}`, {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem('token')}`
    }
  });
  const messages = await response.json();
  messagesList = messages;
  renderMessages(messages);
}

function renderMessages(messages) {
  const chatMessages = document.getElementById('chatMessages');
  chatMessages.innerHTML = '';
  messages.forEach(message => {
    const messageDiv = document.createElement('div');
    messageDiv.className = message.sender === sessionStorage.getItem('userId') ? 'sent' : 'received';

    const messageText = document.createElement('div');
    messageText.className = 'message-text';
    messageText.innerText = message.text;

    const messageTime = document.createElement('div');
    messageTime.className = 'message-time';
    messageTime.innerText = new Date(message.createdAt).toLocaleString();

    messageDiv.appendChild(messageText);
    messageDiv.appendChild(messageTime);

    chatMessages.appendChild(messageDiv);
  });
}

async function sendMessage() {
  const chatMessageInput = document.getElementById('chatMessageInput');
  const messageText = chatMessageInput.value.trim();
  chatMessageInput.value = '';

  if (messageText && currentChatUserId) {
    const response = await fetch('/api/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionStorage.getItem('token')}`
      },
      body: JSON.stringify({ recipientId: currentChatUserId, text: messageText })
    });
    const newMessage = await response.json();
    messagesList.push(newMessage);
    renderMessages(messagesList);
    // chatMessageInput.value = '';


    // Notify recipient of new message
    const notification = document.getElementById('notification');
    notification.className = 'notification';
    notification.innerText = `New message from ${sessionStorage.getItem('username')}`;
    // document.body.appendChild(notification);
    setTimeout(() => {
      notification.remove();
    }, 5000);
  }
}



// Recent Post By members of community
async function fetchRecentPosts() {
  const response = await fetch('/api/comments/recentPost', {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem('token')}`
    }
  });
  const posts = await response.json();
  return posts;
}

function renderRecentPosts(posts) {
  const recentPostContainer = document.getElementById('recentPost');
  recentPostContainer.innerHTML = '';
  posts.forEach(post => {
    const commentBox = document.createElement('div');
    commentBox.className = 'comment-box';

    const avatar = document.createElement('img');
    avatar.className = 'comment-avatar';
    avatar.src = '../images/userCircle.svg';  // Path to the default avatar image

    const commentHeader = document.createElement('div');
    commentHeader.className = 'comment-header';

    const commentAuthor = document.createElement('div');
    commentAuthor.className = 'comment-author';
    commentAuthor.innerText = post.username;

    const commentTime = document.createElement('div');
    commentTime.className = 'comment-time';
    commentTime.innerText = new Date(post.createdAt).toLocaleString();

    const commentContent = document.createElement('div');
    commentContent.className = 'comment-content';

    const commentTextDiv = document.createElement('div');
    commentTextDiv.className = 'comment-text';
    commentTextDiv.innerText = post.text;


    commentHeader.appendChild(avatar);
    commentHeader.appendChild(commentAuthor);
    commentHeader.appendChild(commentTime);

    commentContent.appendChild(commentTextDiv);

    commentBox.appendChild(commentHeader);
    commentBox.appendChild(commentContent);

    recentPostContainer.appendChild(commentBox);

  });
}


document.getElementById('sendMessageButton').addEventListener('click', sendMessage);
document.getElementById('chatMessageInput').addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    sendMessage();
  }
});










// // Notification for new messages
// let lastMessageTime = new Date();

// async function checkForNewMessages() {
//   const response = await fetch('/api/messages/check', {
//     headers: {
//       Authorization: `Bearer ${sessionStorage.getItem('token')}`
//     }
//   });
//   const newMessages = await response.json();

//   if (newMessages.length > 0) {
//     const notification = document.getElementById('notification');
//     notification.innerText = `You have ${newMessages.length} new message(s)`;
//     notification.style.display = 'block';

//     // Update last message time
//     lastMessageTime = new Date();
//   } else {
//     notification.style.display = 'none';
//   }
// }



