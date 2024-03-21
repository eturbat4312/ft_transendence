let connectedPlayers = [];

function updateplayerModal(websocket) {
    const playerList = document.getElementById("player-list");

    if (!playerList || connectedPlayers.length === 0) {
        return;
    };

    const player = connectedPlayers[connectedPlayers.length - 1];

    const listItem = document.createElement("li");
    listItem.classList.add("player-item", "clickable");
    listItem.dataset.name = player.name;
    listItem.dataset.id = player.id;

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

    listItem.addEventListener('click', async () => {
        const playerName = listItem.dataset.name;
        const userId = listItem.dataset.id;
        console.log("typeof userID: " + typeof userId);
        const playerInfoContent = `<p>Name: ${playerName}</p><button id="addFriendBtn" data-user-id="${playerName}" class="btn btn-primary">Add to friends</button>`;
        document.getElementById('playerModalBody').innerHTML = playerInfoContent;
        const addFriendBtn = document.getElementById('addFriendBtn');
        addFriendBtn.addEventListener('click', async function() {
            await sendFriendRequest(userId, websocket);
        });
        const playerModal = new bootstrap.Modal(document.getElementById('playerModal'));
        playerModal.show();
    });
}

async function sendFriendRequest(id, websocket)
{
    const serverIP = window.location.hostname;
    const token = localStorage.getItem('token');
    if (!token) {
        console.log('Token not found');
        return;
    }
    try {
        const response = await fetch(`https://${serverIP}//api/send_friend_request/${id}/`, {
            method: 'GET',
            headers: {
                'Authorization': 'Token ' + token
            }
        });
    
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
    
        const data = await response.json();
    
        if (data.status === 'success') {
            const message = JSON.stringify({ action: 'friend_request', toUserId: userId });
            websocket.send(message);
            alert('Friend request sent successfully!');
        } else {
            alert('Error: ' + data.message + ' status: ' + data.status);
            console.log(data);
        }
    
    } catch (error) {
        alert('Error sending friend request: ' + error.message);
    }
}

export function updateConnectedPlayer(username, userId, online, websocket) {
    let playerIndex = connectedPlayers.findIndex(player => player.name === username);

    if (playerIndex !== -1) {
        connectedPlayers[playerIndex].online = online;
    } else {
        connectedPlayers.push({ name: username, id: userId, online });
    }
    updateplayerModal(websocket);
    getFriends(websocket);

}

export function removeDisconnectedPlayer(playerName) {
    connectedPlayers = connectedPlayers.filter(player => player.name !== playerName);
    const playerElementToRemove = document.querySelector(`.player-item[data-name="${playerName}"]`);
    if (playerElementToRemove) {
        playerElementToRemove.remove();
    }
}

export function showToast(message, websocket) {
    const toastContainer = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
        <div class="toast-header">
            <strong class="me-auto">Friend Request</strong>
            <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
            ${message}
        </div>
    `;
    toastContainer.appendChild(toast);

    const bootstrapToast = new bootstrap.Toast(toast);
    bootstrapToast.show();
    updateFriendRequestsModal(websocket);
}

async function fetchFriendRequests() {
    const serverIP = window.location.hostname;
    const token = localStorage.getItem('token');
    if (!token) {
        console.log('Token not found');
        return;
    }
    try {
        const response = await fetch(`https://${serverIP}/api/friend_requests/`, {
            method: 'GET',
            headers: {
                'Authorization': 'Token ' + token
            }
        });
        if (!response.ok) {
            throw new Error('Failed to fetch friend requests');
        }

        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error('Error fetching friend requests:', error);
        return [];
    }
}

async function fetchUsernameFromId(userId) {
    const serverIP = window.location.hostname;
    const token = localStorage.getItem('token');
    if (!token) {
        console.log('Token not found');
        return;
    }
    try {
        const response = await fetch(`https://${serverIP}/api/get_username_from_id/${userId}/`, {
            method: 'GET',
            headers: {
                'Authorization': 'Token ' + token
            }
        });
        if (!response.ok) {
            throw new Error('Failed to fetch friend requests');
        }

        const data = await response.json();
        return data.username;
    } catch (error) {
        console.error('Error fetching friend requests:', error);
        return [];
    }
}

async function respondFriendRequest(userId, bool, websocket)
{
    const serverIP = window.location.hostname;
    const token = localStorage.getItem('token');
    if (!token) {
        console.log('Token not found');
        return;
    }
    try {
        const response = await fetch(`https://${serverIP}/api/respond_friend_request/${userId}/`, {
            method: 'POST',
            headers: {
                'Authorization': 'Token ' + token,
                'Content-Type': 'application/json',

            },
            body: JSON.stringify({ action: bool ? 'accept' : 'reject' })
        });

        if (response.ok) {
            const result = await response.json();
            if (bool) {
                const uid = userId;
                console.log(`Friend request accepted for user ${userId}`);
                const message = JSON.stringify({ action: 'update_friends', toUserId: uid });
                websocket.send(message);
            } else {
                console.log(`Friend request rejected for user ${userId}`);
            }
            updateFriendRequestsModal(websocket);
            getFriends(websocket);
        } else {
            console.error('Failed to handle friend request:', response.statusText);
        }
    } catch (error) {
        console.error('An error occurred while handling friend request:', error);
    }
}

export async function updateFriendRequestsModal(websocket) {
    const friendRequestsContainer = document.getElementById('friendRequestsModalBody');

    const friendRequests = await fetchFriendRequests();

    friendRequestsContainer.innerHTML = '';

    if (friendRequests.length === 0) {
        friendRequestsContainer.innerHTML = '<p>No friend requests</p>';
    } else {
        const ul = document.createElement('ul');
        friendRequests.forEach(async (request) => {
            const li = document.createElement('li');
            li.classList.add('friend-request');
            const username = await fetchUsernameFromId(request.from_user);
            li.textContent = `${username} sent you a friend request`;

            const friendId = request.from_user.toString();
            const acceptButton = document.createElement('button');
            acceptButton.classList.add('btn', 'btn-success', 'btn-sm', 'tickcross');
            //acceptButton.setAttribute('data-user-id', request.from_user);
            acceptButton.innerHTML = '<i class="fas fa-check"></i>';
            acceptButton.addEventListener('click', () => respondFriendRequest(friendId, true, websocket));

            const rejectButton = document.createElement('button');
            rejectButton.classList.add('btn', 'btn-danger', 'btn-sm', 'tickcross');
            //rejectButton.setAttribute('data-user-id', request.from_user);
            rejectButton.innerHTML = '<i class="fas fa-times"></i>';
            rejectButton.addEventListener('click', () => respondFriendRequest(friendId, false, websocket));

            li.appendChild(acceptButton);
            li.appendChild(rejectButton);
            ul.appendChild(li);
        });
        friendRequestsContainer.appendChild(ul);
    }
}

export async function getFriends(websocket) {
    const serverIP = window.location.hostname;
    const token = localStorage.getItem('token');
    if (!token) {
        console.log('Token not found');
        return;
    }
    try {
        const response = await fetch(`https://${serverIP}/api/get_friends/`, {
            method: 'GET',
            headers: {
                'Authorization': 'Token ' + token,
                'Content-Type': 'application/json',
            }
        });

        if (response.ok) {
            const data = await response.json();
            const friendsList = data.friends;
            const friendsElement = document.getElementById('friend-list');
            friendsElement.innerHTML = "";
            friendsList.forEach(friend => {
                const friendElement = document.createElement('li');
                friendElement.classList.add("clickable");
                friendElement.dataset.id = friend.id;
                friendElement.dataset.name = friend.username;
                const statusIcon = document.createElement("div");
                statusIcon.classList.add("player-status");
                if (isFriendOnline(friend.username)) {
                    statusIcon.classList.add("online");
                } else {
                    statusIcon.classList.add("offline");
                }
                friendElement.appendChild(statusIcon);
                const friendName = document.createElement("p");
                friendName.textContent = friend.username;
                friendName.classList.add("player-name");
                friendElement.appendChild(friendName);
                friendsElement.appendChild(friendElement);
                friendElement.addEventListener('click', async () => {
                    const friendName = friend.username;
                    const friendId = friendElement.dataset.id;
                    const friendInfoContent = `<p>Userame: ${friendName}</p><button id="removeFriendBtn" class="btn btn-danger" data-bs-dismiss="modal">Remove from friends</button>`;
                    document.getElementById('friendModalBody').innerHTML = friendInfoContent;
                    const removeFriendBtn = document.getElementById('removeFriendBtn');
                    removeFriendBtn.addEventListener('click', async function() {
                        await removeFriend(friend.id, websocket);
                        const message = JSON.stringify({ action: 'update_friends', toUserId: friendId });
                        websocket.send(message);
                    });
                    const modal = new bootstrap.Modal(document.getElementById('friendModal'));
                    modal.show();
                });
            });
        } else {
            console.error('Failed to fetch friends:', response.statusText);
        }
    } catch (error) {
        console.error('An error occurred while fetching friends:', error);
    }
}

function isFriendOnline(username) {
    return connectedPlayers.some(player => player.name === username && player.online);
}

async function removeFriend(friendId, websocket) {
    const serverIP = window.location.hostname;
    const token = localStorage.getItem('token');
    if (!token) {
        console.log('Token not found');
        return;
    }
    try {
        const response = await fetch(`https://${serverIP}/api/remove_friend/${friendId}/`, {
            method: 'POST',
            headers: {
                'Authorization': 'Token ' + token,
                'Content-Type': 'application/json',
            }
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Friend removed successfully:', data);
            getFriends(websocket);
        } else {
            console.error('Failed to remove friend:', response.statusText);
        }
    } catch (error) {
        console.error('An error occurred while removing friend:', error);
    }
}