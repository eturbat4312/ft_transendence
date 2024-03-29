export default class Chat {
    constructor() {
        this.websocket = null;
        this.username = localStorage.getItem('username');
    }

    startChat = () => {
        document.getElementById("start-chat").style.display = "none";
        const chatBox = document.querySelector(".chat-container");
        chatBox.style.display = "block";
        if (this.websocket === null || this.websocket.readyState !== WebSocket.OPEN) {
            const serverIP = window.location.hostname;
            this.websocket = new WebSocket(`wss://${serverIP}/api/ws/chat/`);
            this.websocket.onopen = () => {
                console.log("Chat WebSocket connection established");
                const message = JSON.stringify({
                    action: 'join_chat',
                    clientName: this.username
                });
                this.websocket.send(message);
            };
            const self = this;
            this.websocket.onmessage = function(event) {
                const data = JSON.parse(event.data);
                if (data.action === "print_message")
                    self.printMessage(data.message_data);
                if (data.action === "join_chat")
                    self.joinMessage(data.name_data);
                if (data.action === "left_chat")
                    self.leftMessage(data.name_data);
            };
            this.websocket.onclose = (event) => {
                console.log("Chat WebSocket connection closed", event);
            };
            this.websocket.onerror = (error) => {
                console.error("WebSocket error:", error);
            };
        } else {
            console.log("Chat WebSocket connection is already open.");
            //    this.websocket.send(JSON.stringify({ action: "join_chat" }));
        }
    }

    printMessage = (data) => {
        const { clientName, clientMessage } = data;
        console.log("message received from ", clientName, ": ", clientMessage);
        const print = clientName + ": " + clientMessage;
        const messagesDiv = document.getElementById("messages");
        const messageElement = document.createElement("div");
        messageElement.classList.add("chat-message");
        messageElement.textContent = print;
        messagesDiv.appendChild(messageElement);
        const chatBox = document.querySelector(".chat-box");
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    joinMessage = (data) => {
        const username = data;
        const print = username + " has entered the chat!";
        const messagesDiv = document.getElementById("messages");
        const messageElement = document.createElement("div");
        messageElement.classList.add("chat-message");
        messageElement.textContent = print;
        messagesDiv.appendChild(messageElement);
        const chatBox = document.querySelector(".chat-box");
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    leftMessage = (data) => {
        const username = data;
        const print = username + " has left the chat!";
        const messagesDiv = document.getElementById("messages");
        const messageElement = document.createElement("div");
        messageElement.classList.add("chat-message");
        messageElement.textContent = print;
        messagesDiv.appendChild(messageElement);
        const chatBox = document.querySelector(".chat-box");
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    sendMessagetoServer = () => {
        const messageInput = document.getElementById("messageInput");
        const messageText = messageInput.value.trim();
        if (messageText !== '') {
            const message = JSON.stringify({
                action: 'client_message',
                message_data: {
                    clientName: this.username,
                    clientMessage: messageText,
                }
            });
            this.websocket.send(message);
            messageInput.value = '';
        }
    }

}

export function addChatEventListeners() {
    const chatBox = new Chat();
    const offcanvas = document.getElementById('offcanvasChat');
    document.querySelectorAll('.btn-chat-connect').forEach(button => {
        button.addEventListener('click', function() {
            chatBox.startChat();
        });
    });
    document.querySelectorAll('.btn-chat-send').forEach(button => {
        button.addEventListener('click', function() {
            chatBox.sendMessagetoServer();
        })
    })
    const messageInput = document.getElementById("messageInput");
    if (messageInput != null) {
        messageInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                chatBox.sendMessagetoServer();
            }
        });
    }
    offcanvas.addEventListener('shown.bs.offcanvas', function () {
        offcanvas.querySelectorAll('input, button').forEach(function(element) {
            element.setAttribute('tabindex', '-1');
        });
    });
    
    offcanvas.addEventListener('hidden.bs.offcanvas', function () {
        offcanvas.querySelectorAll('input, button').forEach(function(element) {
            element.removeAttribute('tabindex');
        });
    });
}

export async function getUsername() {
    const serverIP = window.location.hostname;
    const token = localStorage.getItem('token');
    if (!token) {
        console.log('Token not found');
        return;
    }
    
    try {
        const response = await fetch(`https://${serverIP}/api/get_username/`, {
            method: 'GET',
            headers: {
                'Authorization': 'Token ' + token
            }
        });

        if (response.ok) {
            const data = await response.json();
            const username = data.username;
            localStorage.setItem('username', username);
        } else {
            console.log('Failed to get username:', await response.text());
        }

    } catch (error) {
        console.log('Error:', error);
    }
}

export async function getUserId() {
    const serverIP = window.location.hostname;
    const token = localStorage.getItem('token');
    if (!token) {
        console.log('Token not found');
        return;
    }

    try {
        const response = await fetch(`https://${serverIP}/api/get_user_id/`, {
            method: 'GET',
            headers: {
                'Authorization': 'Token ' + token
            }
        });

        if (response.ok) {
            const data = await response.json();
            const userId = data.user_id;
            localStorage.setItem('userId', userId);
            return userId;
        } else {
            console.log('Failed to get user ID:', await response.text());
        }

    } catch (error) {
        console.log('Error:', error);
    }
}