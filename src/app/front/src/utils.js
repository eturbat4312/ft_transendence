export default class Chat {
    constructor() {
        this.websocket = null;
        this.name = Math.floor(Math.random() * 100) + 1;
    }

    startChat = () => {
        document.getElementById("start-chat").style.display = "none";
        const chatBox = document.querySelector(".chat-container");
        chatBox.style.display = "block";
        if (this.websocket === null || this.websocket.readyState !== WebSocket.OPEN) {
            const serverIP = window.location.hostname;
            this.websocket = new WebSocket('ws://' + serverIP + ':8000/ws/chat');
            this.websocket.onopen = () => {
                console.log("Chat WebSocket connection established");
                const message = JSON.stringify({
                    action: 'join_chat',
                    clientName: this.name
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
                    clientName: this.name,
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
}