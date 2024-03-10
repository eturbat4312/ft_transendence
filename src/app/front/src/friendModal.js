let connectedPlayers = [];

function updateplayerModal() {
    const playerList = document.getElementById("player-list");

    if (!playerList || connectedPlayers.length === 0) {
        return;
    };

    const player = connectedPlayers[connectedPlayers.length - 1];

    const listItem = document.createElement("li");
    listItem.classList.add("player-item", "clickable");
    listItem.dataset.name = player.name;

    const statusIcon = document.createElement("div");
    if (player.online) {
        statusIcon.classList.add("player-status", "online");
    }
    listItem.appendChild(statusIcon);

    const playerName = document.createElement("p");
    playerName.textContent = player.name;
    playerName.classList.add("player-name");
    console.log("add to html", player.name);
    listItem.appendChild(playerName);
    playerList.appendChild(listItem);

    listItem.addEventListener('click', () => {
        const playerName = listItem.dataset.name;
        const playerInfoContent = `<p>Name: ${playerName}</p><button id="addFriendBtn" data-user-id="${playerName}" class="btn btn-primary">Add to friends</button>`;
        document.getElementById('playerModalBody').innerHTML = playerInfoContent;
        const addFriendBtn = document.getElementById('addFriendBtn');
        addFriendBtn.addEventListener('click', function() {
            sendFriendRequest(playerName);
        });
        const playerModal = new bootstrap.Modal(document.getElementById('playerModal'));
        playerModal.show();
    });
}

function sendFriendRequest(playerName)
{
    $.ajax({
        url: '/send_friend_request/' + playerName + '/',
        type: 'GET',
        success: function(response) {
            if (response.status === 'success') {
                alert('Friend request sent successfully!');
            } else {
                alert('Error: ' + response.message);
            }
        },
        error: function() {
            alert('Error sending friend request.');
        }
    });
}

export function updateConnectedPlayer(username, online) {
    let playerIndex = connectedPlayers.findIndex(player => player.name === username);

    if (playerIndex !== -1) {
        connectedPlayers[playerIndex].online = online;
    } else {
        connectedPlayers.push({ name: username, online });
    }
    updateplayerModal();
}

export function removeDisconnectedPlayer(playerName) {
    connectedPlayers = connectedPlayers.filter(player => player.name !== playerName);
    const playerElementToRemove = document.querySelector(`.player-item[data-name="${playerName}"]`);
    if (playerElementToRemove) {
        playerElementToRemove.remove();
    }
}