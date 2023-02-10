const cheerio = require("cheerio");
const axios = require("axios");

async function scrap1337x(query = "", page = "1") {
  const torrentsDataSet = [];
  let html;
  const url = "https://1337xx.to/search/" + query + "/" + page + "/";
  console.log(url);
  try {
    html = await axios.get(url);
  } catch {
    return null;
  }

  const $ = cheerio.load(html.data);

  const links = $("td.name")
    .map((_, element) => {
      var link = "https://1337xx.to" + $(element).find("a").next().attr("href");
      return link;
    })
    .get();

  await Promise.all(
    links.map(async (element) => {
      const data = {};
      const labels = [
        "Category",
        "Type",
        "Language",
        "Size",
        "UploadedBy",
        "Downloads",
        "LastChecked",
        "DateUploaded",
        "Seeders",
        "Leechers",
      ];
      let html;
      try {
        html = await axios.get(element);
      } catch {
        return null;
      }
      const $ = cheerio.load(html.data);
      data.Name = $(".box-info-heading h1").text().trim();
      data.Magnet = $(".clearfix ul li:nth-last-child(2) ul li:last-child a").attr("href") || "";
      const poster = $("div.torrent-image img").attr("src");

      if (typeof poster !== "undefined") {
        if (poster.startsWith("http")) {
          data.Poster = poster;
        } else {
          data.Poster = "https:" + poster;
        }
      } else {
        data.Poster = "";
      }

      $("div .clearfix ul li > span").each((i, element) => {
        $list = $(element);
        data[labels[i]] = $list.text();
      });
      data.Url = element;

      torrentsDataSet.push(data);
    })
  );

  return torrentsDataSet;
}
module.exports = scrap1337x;
