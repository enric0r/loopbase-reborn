const cheerio = require('cheerio');
var request = require('request');
const path = require('path');
const fs = require('fs');

async function downloadMP3(url, dest){
    return new Promise((resolve, reject) => {
        var dir = path.dirname(dest);
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir, { recursive: true });
        }

        var file = fs.createWriteStream(dest);

        request({
            uri: url,
            timeout: 60000
        })
        .pipe(file)
        .on('finish', () => {
            resolve();
        })
        .on('error', (error) => {
            reject(error);
        })
    })
}

function search(args){
    return new Promise(reply => {
        let results = [];
        let key = args.filterByKey ? ("&mkey="+args.key[0]+args.key[1]) : "";
        var date = args.date == 0 ? '' : '&when=' + args.date;
        var genre = args.genre == 0 ? '' : '&gid=' + args.genre;
        request({
            url: 'https://looperman.com/' + args.category
                + '?page='+ args.page
                + '&keys=' + args.keys
                + '&order=' + args.order[0]
                + date
                + genre
                + "&dir="+args.order[1]
                + key
                + "&ftempo="+args.tempo[0]
                + "&ttempo="+args.tempo[1],
            timeout: 60000
        }, function (err, res) {
            const $ = cheerio.load(res.body);
            $('#body-left .player-wrapper').each((i, el) => {
                results.push({
                    title: $(el).find(".player-title").text(),
                    mp3_url: $(el).prop("rel"),
                    author: $(el).find(".icon-user").text(),
                    profile_pic: $(el).find(".player-avatar a img").prop("src"),
                    waveform: $(el).find(".player-waveform-image").prop("src"),
                    web_link: $(el).find(".player-top > a").prop("href")
                });
            });
            $('#body-left .tag-wrapper').each((i, el) => {
                results[i].tempo = $($(el).find("a")[0]).text();
                results[i].genre = $($(el).find("a")[1]).text().slice(0, -6);
                results[i].category = $($(el).find("a")[2]).text().slice(0, -6);
                results[i].key = $($(el).find("a")[5]).text().slice(6);
            });
            reply(results);
        });
    });
}

export {downloadMP3, search}