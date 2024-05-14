// 发送消息给主进程
const liveUrl = document.getElementById("liveUrl")
const wsAddress = document.getElementById("wsAddress")
const chromePathUrl = document.getElementById("chromePathUrl")
const chromeUserData = document.getElementById("chromeUserData")
const startBtn = document.getElementById('btn-start')

const wsServer = 'ws://43.132.234.89:3528';


window.addEventListener('DOMContentLoaded', () => {
    wsAddress.value = wsServer;
    wsAddress.disabled = true;
})


startBtn.addEventListener('click', () => {
    const link = liveUrl.value

    if (link === "") {
        alert("请输入直播间地址")
    } else {
        window.electronAPI.setlink(link)
    }

})