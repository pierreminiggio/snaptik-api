import puppeteer, { Browser, BrowserConnectOptions, BrowserLaunchArgumentOptions, LaunchOptions, Page, Product } from 'puppeteer'

type PuppeteerOptions = LaunchOptions & BrowserLaunchArgumentOptions & BrowserConnectOptions & {
    product?: Product;
    extraPrefsFirefox?: Record<string, unknown>;
}

export default class SnapTikAPI {

    public puppeteerOptions: PuppeteerOptions = {
        args: ['--no-sandbox']
    }

    async getDownloadLink(videoLink: string): Promise<string>
    {
        let browser: Browser

        try {
            browser = await puppeteer.launch(this.puppeteerOptions)
        } catch (browserLaunchError: any) {
            throw browserLaunchError;
        }

        try {
            const pages = await browser.pages()
            const page = pages.length > 0 ? pages[0] : await browser.newPage()

            await page.goto('https://snaptik.app/en')

            const urlInputSelector = '#url'
            await page.waitForSelector(urlInputSelector)

            await page.evaluate(
                (urlInputSelector, videoLink) => document.querySelector(urlInputSelector).value = videoLink,
                urlInputSelector,
                videoLink
            )

            const submitButtonSelector = '#submiturl'
            await page.waitForSelector(submitButtonSelector)
            await page.click(submitButtonSelector)

            const highDefinitionDownloadLink = '[title="Download Server 02"]'

            try {
                await page.waitForSelector(highDefinitionDownloadLink)
            } catch (noDownloadLinkFoundError: any) {
                const errorMessageSelector = '.msg-error'
                const errorMessage = await page.evaluate(
                    errorMessageSelector => document.querySelector(errorMessageSelector)?.innerText,
                    errorMessageSelector
                )

                await browser.close()
                throw new Error('Probably a bad video link : ' + errorMessage)
            }

            const downloadLink = await page.evaluate(
                highDefinitionDownloadLink => document.querySelector(highDefinitionDownloadLink)?.href,
                highDefinitionDownloadLink
            )

            await browser.close()

            if (downloadLink) {
                return downloadLink
            }

            throw new Error('No download link :\'(')

        } catch (puppeteerError: any) {
            await browser.close()
            throw puppeteerError;
        }
    }
}
