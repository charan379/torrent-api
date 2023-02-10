const cheerio = require('cheerio')
const axios = require('axios')


async function scrapRarbg(query, page = '1') {
    const allUrls = [];
    var torrentsData = [];
    const url = "https://rargb.to/search/" + page + "/?search=" + query;
    let html;
    try {
        html = await axios.get(url, headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.106 Safari/537.36"
        });

    } catch {
        return null;
    }

    const $ = cheerio.load(html.data);

    $('table.lista2t tbody').each((_, element) => {
        $('tr.lista2').each((_, el) => {
            const data = {};
            const td = $(el).children('td');
            data.Name = $(td).eq(1).find('a').attr('title');
            data.Category = $(td).eq(2).find('a').text();
            data.DateUploaded = $(td).eq(3).text();
            data.Size = $(td).eq(4).text();
            data.Seeders = $(td).eq(5).find('font').text();
            data.Leechers = $(td).eq(6).text();
            data.UploadedBy = $(td).eq(7).text();
            data.Url = "https://rargb.to" + $(td).eq(1).find('a').attr('href');
            allUrls.push(data.Url);
            torrentsData.push(data);

        })
    });

    await Promise.all(allUrls.map(async (url) => {
        for (let i = 0; i < torrentsData.length; i++) {
            if (torrentsData[i]['Url'] === url) {
                let html;
                try{
                    html = await axios.get(url, headers = {
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.106 Safari/537.36"
                    });
                }catch{
                    return null;
                }
                
                let $ = cheerio.load(html.data);

                let poster = "https://rargb.to" + $("tr:nth-child(4) > td:nth-child(2) > img:nth-child(1)").attr('src') || "";
                if (!poster.endsWith('undefined')) {
                    torrentsData[i].Poster = poster;
                } else {
                    torrentsData[i].Poster = "";
                }
                torrentsData[i].Magnet = $("tr:last-child > td:nth-child(2) > a:nth-child(2)").attr('href') || "";
            }
        }

    }))
    return torrentsData;
}
module.exports = scrapRarbg;