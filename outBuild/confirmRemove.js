var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const messages = [`現在のフロアを削除すると、全てのルーム、現在参加中のユーザーは全て強制退室になります。
よろしいですか？
`,
    'フロアを削除しますか？', `現在のルームを削除すると、現在参加中のユーザーは全て強制退室になります。
よろしいですか？`,
    'ルームを削除しますか？'];
window.api.store('Get', 'has-user')
    .then((numberUsers) => {
    document.getElementById('message').innerText = messages[numberUsers !== null && numberUsers !== void 0 ? numberUsers : 0];
});
const remove = () => __awaiter(this, void 0, void 0, function* () {
    window.api.store('Get', 'remove-data')
        .then((response) => {
        console.log(response);
        window.api.invoke(`remove-${response.type}`, response)
            .then((res) => {
            window.api.send("close-modal");
        });
    });
});
const closeModel = () => {
    window.api.send("close-modal");
};
//# sourceMappingURL=confirmRemove.js.map