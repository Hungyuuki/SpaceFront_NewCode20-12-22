// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
import { contextBridge, ipcRenderer } from "electron";
const { createAgoraRtcEngine, ClientRoleType } = require("agora-electron-sdk");

contextBridge.exposeInMainWorld(
  "api", {
    invoke: (channel: string, data: any) => {
      // ipcRenderer.invoke accesses ipcMain.handle channels like 'myfunc'
      // make sure to include this return statement or you won't get your Promise back
      return ipcRenderer.invoke(channel, data);
    },

    axios: async (endPoint: any, data: any) => {
      return await ipcRenderer.invoke(endPoint, data);
    },

    send: async (channel: any, data: any) => {
      return ipcRenderer.send(channel);
    },

    store: async (method: string, data: any) => {
      if (method) {
        return await ipcRenderer.invoke('store' + method, data);
      }
    },

    agoraVoice: async (data: any) => {
      let agoraEngine: {
        muteLocalAudioStream(arg0: boolean): any;
        enableLocalAudio(arg0: boolean): any;
        initialize: (arg0: { appId: string }) => void;
        setClientRole: (arg0: any) => void;
        leaveChannel: () => void;
        joinChannel: (arg0: string, arg1: string, arg2: number) => void;
      };
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
        agoraEngine.leaveChannel()
      }
      if (data.statusMic == "join-room-mic-speaker-on") {
        agoraEngine.leaveChannel()
        agoraEngine.joinChannel(token, channel, Uid);
        agoraEngine.enableLocalAudio(true);
      }
      if (data.statusMic == "join-room-speaker-on") {
        agoraEngine.leaveChannel()
        agoraEngine.enableLocalAudio(true);
        agoraEngine.joinChannel(token, channel, Uid);
        agoraEngine.enableLocalAudio(false);
      }
    },
  },
);
