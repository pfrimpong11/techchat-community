document.addEventListener('DOMContentLoaded', async () => {
  const comments = await fetchComments();
  renderComments(comments);

  const users = await fetchUsers();
  renderUsers(users);
});

async function fetchComments() {
  const response = await fetch('/api/comments', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
  const comments = await response.json();
  return comments;
}

async function postComment() {
  const commentInput = document.getElementById('new-comment-input');
  const commentText = commentInput.value.trim();
  const username = localStorage.getItem('username'); // Assuming username is stored in localStorage

  if (commentText) {
    const response = await fetch('/api/comments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ username, text: commentText })
    });
    const newComment = await response.json();
    renderComment(newComment);
    commentInput.value = '';
  }
}

async function postReply(commentId, replyInput, replyInputDiv) {
  const replyText = replyInput.value.trim();
  const username = localStorage.getItem('username'); // Assuming username is stored in localStorage

  if (replyText) {
    const response = await fetch('/api/comments/reply', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ commentId, username, text: replyText })
    });
    const updatedComment = await response.json();
    renderComment(updatedComment);
    replyInputDiv.remove();
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
  avatar.src = '../images/default-avatar.png';  // Path to the default avatar image

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
    replyAvatar.src = '../images/comment-avatar.png';  // Path to the default avatar image

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

function showReplyInput(commentBox, commentId) {
  const replyInputDiv = document.createElement('div');
  replyInputDiv.className = 'comment-input reply-input';

  const replyInput = document.createElement('textarea');
  replyInput.placeholder = 'Enter reply';

  const replyButton = document.createElement('button');
  replyButton.innerText = 'Post Reply';
  replyButton.onclick = () => postReply(commentId, replyInput, replyInputDiv);

  replyInputDiv.appendChild(replyInput);
  replyInputDiv.appendChild(replyButton);

  const replies = commentBox.querySelector('.replies');
  replies.appendChild(replyInputDiv);
}

async function fetchUsers() {
  const response = await fetch('/api/users', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
  const users = await response.json();
  return users;
}

function renderUsers(users) {
  const userList = document.getElementById('userList');
  userList.innerHTML = '';
  users.forEach(user => {
    const userItem = document.createElement('div');
    userItem.className = 'user-item';
    userItem.dataset.userId = user._id;
    userItem.innerText = user.username;
    userItem.onclick = () => selectUserForChat(user);
    userList.appendChild(userItem);
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
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
  const messages = await response.json();
  renderMessages(messages);
}

function renderMessages(messages) {
  const chatMessages = document.getElementById('chatMessages');
  chatMessages.innerHTML = '';
  messages.forEach(message => {
    const messageDiv = document.createElement('div');
    messageDiv.className = message.sender === localStorage.getItem('userId') ? 'sent' : 'received';

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

  if (messageText && currentChatUserId) {
    const response = await fetch('/api/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ recipientId: currentChatUserId, text: messageText })
    });
    const newMessage = await response.json();
    renderMessages([...messagesList, newMessage]);
    chatMessageInput.value = '';
  }
}

document.getElementById('sendMessageButton').addEventListener('click', sendMessage);
document.getElementById('chatMessageInput').addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    sendMessage();
  }
});
