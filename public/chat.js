console.log('hey');
const socket = io('http://localhost:1000');
const messageContainer = document.getElementById('message-container')
const messageForm = document.getElementById('send-container');
const messageInput = document.getElementById('message-input');

const username = prompt("What would you like to be referred to as?");
appendMessage('You joined');
socket.emit('new-user',username);

socket.on('chat-message',data=>{
    // console.log(data);
    appendMessage(`${data.username}:${data.message}`);
    // appendMessage(data);

})

socket.on('user-connected',username=>{
    // console.log(data);
    appendMessage(`${username} is online`);
})

socket.on('user-disconnected',username=>{
    // console.log(data);
    appendMessage(`${username} disconnected`);
})

messageForm.addEventListener('submit',e=>{
    e.preventDefault();
    const message = messageInput.value;
    appendMessage(`You:${message}`);
    socket.emit('send-chat-message',message)
    messageInput.value=''
})

function appendMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageContainer.append(messageElement);
}