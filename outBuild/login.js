const signUpForm = () => {
    window.api.invoke('sign-in-form');
};
const loginRequest = () => {
    let email = document.getElementById('username');
    let password = document.getElementById('password');
    let data = {
        email: email.value,
        password: password.value
    };
    const loadingLogin = document.querySelector("#loading");
    loadingLogin.innerHTML = "<img src=\"../static/loading-gif.gif\" alt=\"\" width=\" 10%\">";
    window.api.invoke('login', data)
        .then(function (res) {
        if (res != "err") {
            localStorage.setItem("companyId", res);
            window.api.invoke('getFristFloorOfCompany', res)
                .then((floorId) => {
                window.api.invoke('initDataWhenLoginSuccess', {
                    floorId: floorId
                });
                // window.api.store("Set", {
                //   floorId: floorId,
                //   is_login: true
                // })
                homePage();
            });
        }
    })
        .catch(function (err) {
        document.getElementById('error-message').innerText = "メール或いはパスワードが存在していません。";
        const loadingLogin = document.querySelector("#loading");
        loadingLogin.innerHTML = "【ログイン】";
        console.log("err");
    });
};
const homePage = () => {
    window.api.invoke('home-page');
};
//# sourceMappingURL=login.js.map