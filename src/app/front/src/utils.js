export default class Chat {
    constructor() {
        this.websocket = null;
    }

    startChat = () => {
        document.getElementById("start-chat").style.display = "none";
        const chatBox = document.querySelector(".chat-box");
        chatBox.style.display = "block";
    }

    // sendMessage = () => {

    // }

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
            chatBox.sendMessage();
        })
    })
}