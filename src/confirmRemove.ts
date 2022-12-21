const messages = [`現在のフロアを削除すると、全てのルーム、現在参加中のユーザーは全て強制退室になります。
よろしいですか？
`, 
'フロアを削除しますか？', `現在のルームを削除すると、現在参加中のユーザーは全て強制退室になります。
よろしいですか？`, 
'ルームを削除しますか？']

window.api.store('Get', 'has-user')
    .then((numberUsers: any) => {
        document.getElementById('message').innerText = messages[numberUsers??0];
    })

const remove = async () => {
    window.api.store('Get', 'remove-data')
        .then((response: any) => {
            console.log(response)
            window.api.invoke(`remove-${response.type}`, response)
                .then((res: any) => {
                    window.api.send("close-modal")
                })
        })
}

const closeModel = ()=> {
    window.api.send("close-modal")
}
