console.log('hey');
const socket = io('http://localhost:1000');
const messageContainer = document.getElementById('message-container')
const messageForm = document.getElementById('send-container');
const messageInput = document.getElementById('message-input');

socket.on('chat-message',data=>{
    console.log(data)
})

messageForm.addEventListener('submit',e=>{
    e.preventDefault();
    const message = messageInput.value;
    socket.emit('send-chat-message',message)
    messageInput.value=''
})

function appendMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageContainer.append(messageElement);
}