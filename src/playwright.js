const { chromium } = require("playwright");
const { deserializeWebsocketMessage } = require("./lib/webcastProtobuf");
const { simplifyObject } = require("./lib/webcastDataConverter");
import setting from './setting.json'

const livePath = "https://www.tiktok.com/@hanbao11200/live";

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

async function connectLive() {
    const browser = await chromium.launchPersistentContext(setting.playwright.chromeUserDataUrl, {
        executablePath: setting.playwright.chromePathUrl,
        headless: false,
        args: [
            "--disable-blink-features=AutomationControlled",
            "--remote-debugging-port=9222",
        ],
    });

    const page = await browser.newPage();

    page.goto(livePath);

    page.on("request", (request) => {
        if (request.url().includes("webcast/im/fetch/")) {
            const roomId = request.url().split("room_id=")[1].split("&")[0];
        }
    });

    page.on("websocket", (ws) => {
        if (!ws.url().includes("webcast/im/")) {
            return;
        }
        ws.on("framereceived", (frame) => {
            deserializeWebsocketMessage(frame.payload).then((res, error) => {
                if (res.webcastResponse) {
                    console.log(res.webcastResponse.messages)
                }
            });
        });
    });
}

connectLive();
