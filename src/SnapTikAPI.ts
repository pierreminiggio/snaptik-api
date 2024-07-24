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

            const snaptTikUrl = await page.url()

            if (snaptTikUrl === 'https://snaptik.app/en1') {

                const cookieConsentButtonSelector = '.fc-cta-consent'

                try {
                    const cookieConsentButton = await page.waitForSelector(cookieConsentButtonSelector)

                    if (cookieConsentButton) {
                        await cookieConsentButton.click()
                    }
                } catch(e) {
                    // No cookie button
                }

                await this.inputVideoLink(videoLink, page)
                await this.clickSubmitButton(page)

                const downloadLinkSelector = 'a.download-file'
                await page.waitForSelector(downloadLinkSelector)

                const downloadLink = await page.evaluate(
                    downloadLinkSelector => document.querySelector(downloadLinkSelector)?.href,
                    downloadLinkSelector
                )

                await browser.close()

                if (downloadLink) {
                    return downloadLink
                }

                throw new Error('No download link :\'(')

            } else { // Initial version
                await this.inputVideoLink(videoLink, page)
                await this.clickSubmitButton(page)

                const highDefinitionDownloadLink = 'a[href^="https://cdn"]'

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
            }

        } catch (puppeteerError: any) {
            await browser.close()
            throw puppeteerError;
        }
    }

    private async inputVideoLink(videoLink: string, page: Page): Promise<void>
    {
        const urlInputSelector = '#url'
        await page.waitForSelector(urlInputSelector)

        await page.evaluate(
            (urlInputSelector, videoLink) => document.querySelector(urlInputSelector).value = videoLink,
            urlInputSelector,
            videoLink
        )
    }

    private async clickSubmitButton(page: Page): Promise<void>
    {
        const submitButtonSelector = 'button[type="submit"]'
        await page.waitForSelector(submitButtonSelector)
        await page.click(submitButtonSelector)
    }
}
