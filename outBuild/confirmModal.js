const closeModalWindow = () => {
    window.api.send('close-modal');
};
const closeWindow = () => {
    window.api.invoke('quit-app', "");
};
//# sourceMappingURL=confirmModal.js.map