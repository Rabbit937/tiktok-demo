// 发送消息给主进程
const liveUrl = document.getElementById("liveUrl")
const wsAddress = document.getElementById("wsAddress")
const chromePathUrl = document.getElementById("chromePathUrl")
const chromeUserData = document.getElementById("chromeUserData")
const startBtn = document.getElementById('btn-start')

startBtn.addEventListener('click', () => {
    const liveUrlValue = liveUrl.value

    if (liveUrlValue === '') {
        alert("请输入直播间地址")
    } else {
        window.electronAPI.setLink(title)
    }

})