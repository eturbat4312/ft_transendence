export default class Chat {
    constructor() {
        this.websocket = null;
    }

    startChat = () {

    }

    sendMessage = () {

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
            chatBox.sendMessage();
        })
    })
}