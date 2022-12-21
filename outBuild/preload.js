"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const electron_1 = require("electron");
const { createAgoraRtcEngine, ClientRoleType } = require("agora-electron-sdk");
electron_1.contextBridge.exposeInMainWorld("api", {
    invoke: (channel, data) => {
        // ipcRenderer.invoke accesses ipcMain.handle channels like 'myfunc'
        // make sure to include this return statement or you won't get your Promise back
        return electron_1.ipcRenderer.invoke(channel, data);
    },
    axios: (endPoint, data) => __awaiter(void 0, void 0, void 0, function* () {
        return yield electron_1.ipcRenderer.invoke(endPoint, data);
    }),
    send: (channel, data) => __awaiter(void 0, void 0, void 0, function* () {
        return electron_1.ipcRenderer.send(channel);
    }),
    store: (method, data) => __awaiter(void 0, void 0, void 0, function* () {
        if (method) {
            return yield electron_1.ipcRenderer.invoke('store' + method, data);
        }
    }),
    agoraVoice: (data) => __awaiter(void 0, void 0, void 0, function* () {
        let agoraEngine;
        const appID = data.appId;
        let channel = data.channelName;
        let token = data.rtcToken;
        let Uid = 0;
        // Create an agoraEngine instance.
        agoraEngine = createAgoraRtcEngine();
        // Initialize an RtcEngine instance.
        agoraEngine.initialize({ appId: appID });
        // Set the user role as ClientRoleBroadcaster (host)
        agoraEngine.setClientRole(ClientRoleType.ClientRoleBroadcaster);
        // if (method === 'changeMic') {
        if (data.statusMic == "join-room") {
            agoraEngine.enableLocalAudio(true);
            agoraEngine.leaveChannel();
            // agoraEngine.joinChannel(token, channel, Uid);
            agoraEngine.enableLocalAudio(false);
        }
        if (data.statusMic == "mic-off") {
            agoraEngine.enableLocalAudio(false);
        }
        if (data.statusMic == "mic-on") {
            agoraEngine.joinChannel(token, channel, Uid);
            agoraEngine.enableLocalAudio(true);
        }
        if (data.statusMic == "off-speaker") {
            agoraEngine.leaveChannel();
        }
        if (data.statusMic == "join-room-mic-speaker-on") {
            agoraEngine.leaveChannel();
            agoraEngine.joinChannel(token, channel, Uid);
            agoraEngine.enableLocalAudio(true);
        }
        if (data.statusMic == "join-room-speaker-on") {
            agoraEngine.leaveChannel();
            agoraEngine.enableLocalAudio(true);
            agoraEngine.joinChannel(token, channel, Uid);
            agoraEngine.enableLocalAudio(false);
        }
    }),
});
//# sourceMappingURL=preload.js.map