window.api
    .store("Get", "company_id")
    .then(function (company_id) {
    getListImage(company_id);
})
    .catch(function (e) {
});
function handleUploadImage() {
    window.api.on("open-upload-image", (evt, base64) => {
        const src = `data:image/jpg;base64,${base64}`;
    });
}
function openUploadImage() {
    window.api.invoke("open-upload-image").then(function (res) {
        if (!res) {
            return;
        }
        let url = res.icon_images;
        let id = res.id;
        let liEle = document.createElement("li");
        let elem = document.createElement("img");
        elem.setAttribute("src", url);
        elem.onclick = function () {
            setRoomIconId(id, url);
        };
        elem.style.cursor = "pointer";
        liEle.appendChild(elem);
        document.getElementById("images").appendChild(liEle);
        setRoomIconId(res.id, res.icon_images);
    });
}
function getListImage(company_id) {
    window.api.axios("/room_icons/active", company_id).then(function (res) {
        window.api.store("Set", {
            default_icon_id: res.room_icons[0][0].id,
            default_icon_images: res.room_icons[0][0].icon_images
        });
        for (let k = 0; k < res.room_icons[0].length; k++) {
            let liEle = document.createElement("li");
            let elem = document.createElement("img");
            elem.setAttribute("src", res.room_icons[0][k].icon_images);
            elem.onclick = function () {
                console.log(res.room_icons[0][k].icon_images);
                setRoomIconId(res.room_icons[0][k].id, res.room_icons[0][k].icon_images);
            };
            liEle.appendChild(elem);
            if (document.getElementById("images")) {
                document.getElementById("images").appendChild(liEle);
            }
        }
    });
}
function setRoomIconId(id, image) {
    window.api.store("Set", { room_icon_id: id, icon_images: image });
    return true;
}
function createRoomChat() {
    const roomName = document.getElementById("roomName").value;
    const roomData = {
        floor_id: localStorage.getItem('floorId'),
        name: roomName,
    };
    window.api
        .axios("/rooms", roomData)
        .then((res) => {
        window.api.send('close-modal');
    });
}
//# sourceMappingURL=createRoomModal.js.map