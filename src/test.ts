import SnapTikAPI from './SnapTikAPI';

(async() => {
    const api = new SnapTikAPI()
    api.puppeteerOptions.headless = false

    const downloadLink = await api.getDownloadLink('https://www.tiktok.com/@pierreminiggio/video/6895721634565590277')
    console.log(downloadLink)
})()
