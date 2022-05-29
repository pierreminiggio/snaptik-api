import SnapTikAPI from './SnapTikAPI';

const args = process.argv
const argsLength = args.length

if (argsLength < 3) {
    console.log('Use like this : node dist/cli.js <tiktokVideoLink>')
    process.exit()
}

const link = args[2];

(async() => {
    const api = new SnapTikAPI()

    const downloadLink = await api.getDownloadLink(link)
    console.log(downloadLink)
})()
