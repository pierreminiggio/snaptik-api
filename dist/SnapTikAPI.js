"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer_1 = __importDefault(require("puppeteer"));
class SnapTikAPI {
    constructor() {
        this.puppeteerOptions = {
            args: ['--no-sandbox']
        };
    }
    async getDownloadLink(videoLink) {
        let browser;
        try {
            browser = await puppeteer_1.default.launch(this.puppeteerOptions);
        }
        catch (browserLaunchError) {
            throw browserLaunchError;
        }
        try {
            const pages = await browser.pages();
            const page = pages.length > 0 ? pages[0] : await browser.newPage();
            await page.goto('https://snaptik.app/en');
            const snaptTikUrl = await page.url();
            if (snaptTikUrl === 'https://snaptik.app/en1') {
                const cookieConsentButtonSelector = '.fc-cta-consent';
                const cookieConsentButton = await page.waitForSelector(cookieConsentButtonSelector);
                if (cookieConsentButton) {
                    await cookieConsentButton.click();
                }
                await this.inputVideoLink(videoLink, page);
                await this.clickSubmitButton(page);
                const downloadLinkSelector = 'a.download-file';
                await page.waitForSelector(downloadLinkSelector);
                const downloadLink = await page.evaluate(downloadLinkSelector => { var _a; return (_a = document.querySelector(downloadLinkSelector)) === null || _a === void 0 ? void 0 : _a.href; }, downloadLinkSelector);
                await browser.close();
                if (downloadLink) {
                    return downloadLink;
                }
                throw new Error('No download link :\'(');
            }
            else { // Initial version
                await this.inputVideoLink(videoLink, page);
                await this.clickSubmitButton(page);
                const highDefinitionDownloadLink = 'a[href^="https://cdn"]';
                try {
                    await page.waitForSelector(highDefinitionDownloadLink);
                }
                catch (noDownloadLinkFoundError) {
                    const errorMessageSelector = '.msg-error';
                    const errorMessage = await page.evaluate(errorMessageSelector => { var _a; return (_a = document.querySelector(errorMessageSelector)) === null || _a === void 0 ? void 0 : _a.innerText; }, errorMessageSelector);
                    await browser.close();
                    throw new Error('Probably a bad video link : ' + errorMessage);
                }
                const downloadLink = await page.evaluate(highDefinitionDownloadLink => { var _a; return (_a = document.querySelector(highDefinitionDownloadLink)) === null || _a === void 0 ? void 0 : _a.href; }, highDefinitionDownloadLink);
                await browser.close();
                if (downloadLink) {
                    return downloadLink;
                }
                throw new Error('No download link :\'(');
            }
        }
        catch (puppeteerError) {
            await browser.close();
            throw puppeteerError;
        }
    }
    async inputVideoLink(videoLink, page) {
        const urlInputSelector = '#url';
        await page.waitForSelector(urlInputSelector);
        await page.evaluate((urlInputSelector, videoLink) => document.querySelector(urlInputSelector).value = videoLink, urlInputSelector, videoLink);
    }
    async clickSubmitButton(page) {
        const submitButtonSelector = 'button[type="submit"]';
        await page.waitForSelector(submitButtonSelector);
        await page.click(submitButtonSelector);
    }
}
exports.default = SnapTikAPI;
