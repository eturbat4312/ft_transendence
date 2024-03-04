const getSocialState = async () => {

    const friendList = document.getElementById("friend-list");

    if (!friendList) {
        return;
    };

    const friends = [
        { name: "game22", status: "online", avatar: "../images/avatar1.jpg" },
        { name: "jules", status: "offline", avatar: "../images/avatar2.jpg" },
        { name: "P{earl}", status: "online", avatar: "../images/avatar3.jpg" },
    ];

    friends.forEach(friend => {
        const listItem = document.createElement("li");
        listItem.classList.add("friend-item", "clickable");	

        const statusIcon = document.createElement("div");
        statusIcon.classList.add("friend-status", friend.status === "online" ? "online" : "offline");
        listItem.appendChild(statusIcon);

        const avatar = document.createElement("img");
        avatar.src = friend.avatar;
        avatar.alt = `${friend.name}'s avatar`;
        avatar.classList.add("friend-avatar");
        listItem.appendChild(avatar);

        const friendInfo = document.createElement("div");
        friendInfo.classList.add("friend-info");

        const friendName = document.createElement("p");
        friendName.textContent = friend.name;
        friendName.classList.add("friend-name");
        friendInfo.appendChild(friendName);

        listItem.appendChild(friendInfo);

        friendList.appendChild(listItem);
    });

    const clickableFriends = document.querySelectorAll('.clickable');
    clickableFriends.forEach(friend => {
        friend.addEventListener('click', () => {
            const friendInfoContent = `<p>Nom: ${friend.dataset.name}</p><p>Statut: ${friend.dataset.status}</p>`;
            document.getElementById('friendModalBody').innerHTML = friendInfoContent;

            const friendModal = new bootstrap.Modal(document.getElementById('friendModal'));
            friendModal.show();
        });
    });
}

export { getSocialState };