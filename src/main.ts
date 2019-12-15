import fs = require("fs");
import puppeteer = require("puppeteer");

import { Url } from "./url";
import { Log } from "./log";

declare var appStatusDir: string;
appStatusDir = "/tmp/appstatus/";
declare var resultDir: string;
resultDir = "/tmp/result/";

function init() {
    if (!fs.existsSync(appStatusDir)) {
        fs.mkdirSync(appStatusDir, {});
    }
    if (!fs.existsSync(resultDir)) {
        fs.mkdirSync(resultDir, {})
    }
}

function parseParam(): Url[] {
    let param = fs.readFileSync("/tmp/conf/busi.conf", "utf8");
    let urls: Url[];
    urls = [];
    for (let p in param.split(";")) {
        let ps = p.split(",");
        urls.push(new Url(ps[0], ps[1]));
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
        for (let i = 0; i < urls.length; i++) {
            let page = await browser.newPage();
            await page.goto(urls[i].url, {timeout: 10 * 1000});
            await page.waitFor(1000);
            content = await page.content();
            urls[i].html = Buffer.from(content).toString("base64");
            await page.close();
        }
        Log.info("spider end");
        writeResult(urls);
        successEnd();
        Log.info("page-crawl end successfully")
    } catch (e) {
        errorEnd(e.toString(), 11)
    } finally {
        await browser.close()
    }
}

function writeResult(urls: Url[]) {
    Log.info("writing result file");
    for (let i = 0; i < urls.length; i++) {
        let fileName = urls[i].id + ".result";
        fs.writeFileSync(resultDir + fileName, urls[i].id + "," + urls[i].html);
    }
}

function successEnd() {
    fs.writeFileSync(appStatusDir + "0", "");
}

function errorEnd(message: string, code: number) {
    fs.writeFileSync(appStatusDir + "1", message);
    process.exit(code);
}

init();
Log.info("page-crawl start");
// 获取配置
let urls = parseParam();
// 执行
Log.info("spider start");
execute(urls).then();
