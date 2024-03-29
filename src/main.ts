import fs = require("fs");
import puppeteer = require("puppeteer");

import { Url } from "./url";
import { Log } from "./log";

function init() {
    if (!fs.existsSync("/tmp/appstatus/")) {
        fs.mkdirSync("/tmp/appstatus/", {});
    }
    if (!fs.existsSync("/tmp/result/")) {
        fs.mkdirSync("/tmp/result/", {})
    }
}

function parseParam(): Url[] {
    let param = fs.readFileSync("/tmp/conf/busi.conf", "utf8");
    let urls: Url[];
    urls = [];
    let tasks = param.split(",");
    for (let i = 0; i < tasks.length; i++) {
        urls.push(new Url(tasks[i]));
    }
    Log.debug("params: ");
    Log.debug(param);
    return urls;
}

async function execute(urls: Url[]) {
    let content: string;
    let browser = await puppeteer.launch({
        devtools: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
        headless: true,
        executablePath: "/usr/bin/chromium"
    });
    try {
        let page = await browser.newPage();
        for (let i = 0; i < urls.length; i++) {
            let connected = true;
            await page.goto(urls[i].url, {timeout: 10 * 1000})
                .catch(reason => {
                    Log.warn(reason);
                    connected = false;
                });
            if (connected) {
                await page.waitFor(1000);
                content = await page.content();
                urls[i].html = Buffer.from(content).toString("base64");
            }
        }
        await page.close();
        Log.info("spider end");
        writeResult(urls);
        successEnd();
        Log.info("page-crawl end successfully");
    } catch (e) {
        Log.error(e.stack);
        errorEnd(e.toString(), 11);
    } finally {
        await browser.close();
    }
}

function writeResult(urls: Url[]) {
    Log.info("writing result file");
    for (let i = 0; i < urls.length; i++) {
        if (urls[i].html != "") {
            let fileName = i.toString() + ".result";
            fs.writeFileSync("/tmp/result/" + fileName, urls[i].url + "," + urls[i].html);
        }
    }
}

function successEnd() {
    fs.writeFileSync("/tmp/appstatus/" + "0", "");
}

function errorEnd(message: string, code: number) {
    fs.writeFileSync("/tmp/appstatus/" + "1", message);
    process.exit(code);
}

init();
Log.info("page-crawl start");
// 获取配置
let urls = parseParam();
// 执行
Log.info("spider start");
execute(urls).then();
