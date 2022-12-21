var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var userAvatarElement;
var userNameElement;
var errorElementText;
var camera;
var cameraButton;
var cameraCapture;
var localstream;
function capture() {
    let video = document.querySelector("video");
    let image = document.getElementById("userAvatar");
    let canvas = document.createElement("canvas");
    // scale the canvas accordingly
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    // draw the video at that frame
    canvas.getContext('2d')
        .drawImage(video, 0, 0, canvas.width, canvas.height);
    // convert it to a usable data URL
    let dataURL = canvas.toDataURL();
    image.src = dataURL;
    window.api.store('Set', {
        'is_new_avata': true,
        'new_avatar_path': dataURL
    });
}
function videoStart() {
    return __awaiter(this, void 0, void 0, function* () {
        yield navigator.mediaDevices.getUserMedia({ video: true })
            .then(function (stream) {
            return __awaiter(this, void 0, void 0, function* () {
                camera.srcObject = stream;
                cameraButton.setAttribute('onclick', 'videoOff()');
                cameraCapture.hidden = false;
            });
        }).catch(function () {
            alert('could not connect stream');
        });
    });
}
function videoOff() {
    camera.srcObject.getTracks().forEach((track) => track.stop());
    cameraCapture.hidden = true;
    cameraButton.setAttribute('onclick', 'videoStart()');
}
function closeCamera() {
    var _a;
    (_a = camera.srcObject) === null || _a === void 0 ? void 0 : _a.getTracks().map(function (track) {
        track.stop();
    });
}
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        userAvatarElement = document.getElementById('userAvatar');
        userNameElement = document.getElementById('userName');
        errorElementText = document.getElementById('error-message');
        camera = document.getElementById('camera');
        cameraButton = document.getElementById('cameraStart');
        cameraCapture = document.getElementById('cameraCapture');
    });
}
function openNewAvatar() {
    window.api.invoke('open-upload-avatar').then((res) => {
        if (res) {
            userAvatarElement.src = res;
            window.api.store('Set', {
                'is_new_avata': true,
                'new_avatar_path': res
            });
        }
    });
}
function uploadAvatar() {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        let new_avatar_path = yield window.api.store('Get', 'new_avatar_path');
        let result = yield window.api.invoke('update-user-avatar', new_avatar_path);
        if (result[0] === "200") {
            (_a = document.getElementById('currentAvatar')) === null || _a === void 0 ? void 0 : _a.setAttribute('src', new_avatar_path);
        }
        return result;
    });
}
function saveUserProfile() {
    return __awaiter(this, void 0, void 0, function* () {
        closeCamera();
        let loadingUpData = document.getElementById("loading-up-data");
        loadingUpData.style.display = 'block';
        let avatarElement = document.getElementById('userAvatar');
        let userNameElement = document.getElementById('userName');
        let is_new_avata = yield window.api.store('Get', 'is_new_avata');
        let userName = yield window.api.store('Get', 'userName');
        errorElementText.innerText = "";
        if (is_new_avata) {
            let result = yield uploadAvatar();
            if (result[0] !== "200") {
                let errorMessage = "ファイルサイズは1MB以下です。";
                settingForm(errorMessage);
                return false;
            }
            avatarElement.src = result[1];
            yield window.api.store('Set', { userAvatar: result[1] });
        }
        if (userNameElement.value !== userName) {
            let result = yield uploadName();
            if (result) {
                userNameElement.value = result;
                yield window.api.store('Set', { userName: result });
            }
        }
        loadingUpData.style.display = 'none';
        showFloor(localStorage.getItem("floorId"));
        window.api.store('Delete', 'is_new_avata');
    });
}
function uploadName() {
    let name = document.getElementById("userName").value;
    return window.api.invoke('changeName', name).then((res) => {
        if (res) {
            return name;
        }
        window.api.send('close-modal');
    });
}
function settingForm(errorMessage) {
    return __awaiter(this, void 0, void 0, function* () {
        deleteElement("room");
        window.api.store('Delete', 'is_new_avata');
        window.api.store('Delete', 'new_avatar_path');
        localStorage.setItem("is_setting_page", "true");
        let roomForm = document.getElementById('room-list');
        roomForm.innerHTML = yield settingHTML();
        init();
        errorElementText.innerText = errorMessage;
    });
}
function leaveSettingForm() {
    closeCamera();
    showFloor(localStorage.getItem("floorId"));
}
function settingHTML() {
    return __awaiter(this, void 0, void 0, function* () {
        let userName = yield window.api.store('Get', 'userName');
        let userAvatar = yield window.api.store('Get', 'userAvatar');
        return "<div class=\"userProfile\" id=\"userProfile\" >\n"
            + "            <div class=\"draggable headerProfile\"> ユーザープロフィール</div>\n"
            + "            <div class=\"userName\">\n"
            + "                <div>\n"
            + "                    <label>\n"
            + "                        名前:\n"
            + "                    </label>\n"
            + `                    <input id=\"userName\" value='${userName}'>\n`
            + "                </div>\n"
            + "            </div>\n"
            + "            <div class=\"userAvatar\">\n"
            + "                <label>\n"
            + "                    アバター:\n"
            + "                </label>\n"
            + `                <img class=\"imgUserAvatar\" id=\"userAvatar\" src='${userAvatar}'>\n`
            + "                <button class=\"uploadImage\" onclick=\"openNewAvatar()\">\n"
            + "                    写真アップロード\n"
            + "                </button>\n"
            + "                <button class=\"camera\" id=\"cameraStart\" onclick=\"videoStart()\">\n"
            + "                    カメラ\n"
            + "                </button>\n"
            + "                <p class=\"error-message\" id=\"error-message\"></p>\n"
            + "                <img src=\"../static/take_picture.png\" class=\"imgCapturePicture\" id=\"cameraCapture\" onclick=\"capture()\" hidden>"
            + "                <img src=\"../static/loading-gif.gif\" class=\"imgCapturePicture\" id=\"loading-up-data\" style=\"display: none\">"
            + "                <video class=\"cameraVideo\" id=\"camera\" autoplay></video>\n"
            + "            </div>\n"
            + "    <div class=\"groupButton\">\n"
            + "        <button class=\"buttonLeft\" onclick=\"saveUserProfile()\">\n"
            + "            保存\n"
            + "        </button>\n"
            + "\n"
            + "        <button class=\"buttonRight\" onclick=\"leaveSettingForm()\">\n"
            + "            キャンセル\n"
            + "        </button>\n"
            + "    </div>"
            + "        </div>";
    });
}
//# sourceMappingURL=settings.js.map