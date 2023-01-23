import SnapTikAPI from './SnapTikAPI';

(async() => {
    const api = new SnapTikAPI()
    api.puppeteerOptions.headless = false

    const downloadLink = await api.getDownloadLink('https://www.tiktok.com/@spacex_starshipp/video/6993024774003821830')
    console.log(downloadLink)
})()
