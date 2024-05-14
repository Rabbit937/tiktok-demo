const { chromium } = require("playwright");
const { deserializeWebsocketMessage } = require("./lib/webcastProtobuf.js");
const { simplifyObject } = require("./lib/webcastDataConverter.js");
const setting = require('./setting.json')
// const socketIoClient = require('socket.io-client')
const WebSocket = require('ws')
const wsServer = 'ws://43.132.234.89:3528';

const ControlEvents = {
    CONNECTED: "connected",
    DISCONNECTED: "disconnected",
    ERROR: "error",
    RAWDATA: "rawData",
    DECODEDDATA: "decodedData",
    STREAMEND: "streamEnd",
    WSCONNECTED: "websocketConnected",
};

const MessageEvents = {
    CHAT: "chat",
    OPEN: "open",
    MEMBER: "member",
    GIFT: "gift",
    ROOMUSER: "roomUser",
    SOCIAL: "social",
    LIKE: "like",
    QUESTIONNEW: "questionNew",
    LINKMICBATTLE: "linkMicBattle",
    LINKMICARMIES: "linkMicArmies",
    LIVEINTRO: "liveIntro",
    EMOTE: "emote",
    ENVELOPE: "envelope",
    SUBSCRIBE: "subscribe",
};

const CustomEvents = {
    FOLLOW: "follow",
    SHARE: "share",
};

async function connectLive(link) {

    // const io = socketIoClient("ws://43.132.234.89:9502")
    const webSocket = new WebSocket(wsServer);


    const browser = await chromium.launchPersistentContext(setting.playwright.chromeUserDataUrl, {
        executablePath: setting.playwright.chromePathUrl,
        headless: false,
        args: [
            "--disable-blink-features=AutomationControlled",
            "--remote-debugging-port=9222",
        ],
    });

    const page = await browser.newPage();

    page.goto(link);

    page.on("request", (request) => {
        if (request.url().includes("webcast/im/fetch/")) {
            const roomId = request.url().split("room_id=")[1].split("&")[0];
            console.log(roomId)
        }
    });



    page.on("websocket", (ws) => {
        if (!ws.url().includes("webcast/im/")) {
            return;
        }
        ws.on("framereceived", (frame) => {
            deserializeWebsocketMessage(frame.payload).then((res, error) => {
                if (res.webcastResponse) {
                    // biome-ignore lint/complexity/noForEach: <explanation>
                    res.webcastResponse.messages.filter((x) => x.decodedData)
                        .forEach((message) => {
                            const simplifiedObj = simplifyObject(message.decodedData);
                            switch (message.type) {
                                case 'WebcastRoomUserSeqMessage':
                                    webSocket.send({ type: MessageEvents.ROOMUSER, data: simplifiedObj })
                                    break;
                                case 'WebcastChatMessage':
                                    webSocket.send({ type: MessageEvents.CHAT, data: simplifiedObj })
                                    break;
                                case 'WebcastMemberMessage':
                                    webSocket.send({ type: MessageEvents.MEMBER, data: simplifiedObj })
                                    break;
                                case 'WebcastGiftMessage':
                                    // Add extended gift info if option enabled
                                    webSocket.send({ type: MessageEvents.GIFT, data: simplifiedObj })
                                    break;
                                case 'WebcastSocialMessage':
                                    webSocket.send({ type: MessageEvents.SOCIAL, data: simplifiedObj })

                                    if (simplifiedObj.displayType?.includes('follow')) {
                                        webSocket.send({ type: MessageEvents.FOLLOW, data: simplifiedObj })
                                    }
                                    if (simplifiedObj.displayType?.includes('share')) {
                                        webSocket.send({ type: MessageEvents.SHARE, data: simplifiedObj })
                                    }
                                    break;
                                case 'WebcastLikeMessage':
                                    webSocket.send({ type: MessageEvents.LIKE, data: simplifiedObj })
                                    break;
                                case 'WebcastQuestionNewMessage':
                                    webSocket.send({ type: MessageEvents.QUESTIONNEW, data: simplifiedObj })
                                    break;
                                case 'WebcastLinkMicBattle':
                                    webSocket.send({ type: MessageEvents.LINKMICBATTLE, data: simplifiedObj })

                                    break;
                                case 'WebcastLinkMicArmies':
                                    webSocket.send({ type: MessageEvents.LINKMICARMIES, data: simplifiedObj })

                                    break;
                                case 'WebcastLiveIntroMessage':
                                    webSocket.send({ type: MessageEvents.LIVEINTRO, data: simplifiedObj })
                                    break;
                                case 'WebcastEmoteChatMessage':
                                    webSocket.send({ type: MessageEvents.EMOTE, data: simplifiedObj })
                                    break;
                                case 'WebcastEnvelopeMessage':
                                    webSocket.send({ type: MessageEvents.ENVELOPE, data: simplifiedObj })
                                    break;
                                case 'WebcastSubNotifyMessage':
                                    webSocket.send({ type: MessageEvents.SUBSCRIBE, data: simplifiedObj })
                                    break;
                            }

                            // 发送消息到服务器
                            webSocket.send('Hello, WebSocket server!');

                        })
                }
            })
        });
    });


    // 连接成功时的回调
    webSocket.on('open', function open() {
        console.log('Connected to WebSocket server');
    });

    // 接收服务器发送的消息
    webSocket.on('message', function incoming(data) {
        console.log('Received message from server: %s', data);
    });

    // 连接关闭时的回调
    webSocket.on('close', function close() {
        console.log('Disconnected from WebSocket server');
    });


}




module.exports = {
    connectLive
}