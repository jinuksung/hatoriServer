import puppeteer from "puppeteer";
import cheerio from "cheerio";
import { supabase } from "../modules/modules";
import { logger } from "../modules/logger";

const siteName = "ruliwebThumbnail";

const ruliwebThumbnailRequest = async () => {
  const browser = await puppeteer.launch({
    executablePath: "/usr/bin/chromium",
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
  });

  const page = await browser.newPage();

  await page.goto(
    `https://bbs.ruliweb.com/market/board/1020?page=1&view=gallery`,
    { waitUntil: "networkidle2", timeout: 0 }
  );

  const content = await page.content();
  const $ = cheerio.load(content, { ignoreWhitespace: false });

  $(".flex_wrapper")
    .children()
    .each((_, e) => {
      const siteId = Number(
        $(e).find(".info_article_id").attr("value")?.trim()
      );

      const thumbnailUrl = $(e)
        .find(".thumbnail")
        .attr("style")
        ?.split("url")[1]
        .replace(/[();]/gim, "")
        .trim()
        .includes("thumbnail_empty")
        ? undefined
        : $(e)
            .find(".thumbnail")
            .attr("style")
            ?.split("url")[1]
            .replace(/[();]/gim, "")
            .trim();

      (async () => {
        try {
          const { error } = await supabase
            .from("deal_list")
            .update({ thumbnail_url: thumbnailUrl })
            .eq("site_id", `r${siteId}`);

          if (error) {
            throw new Error(`ruliwebThumbnailError : ${error.message}`);
          } else {
            logger.info(
              `r${siteId}'s thumbnailUrl has been updated from ${siteName}`
            );
          }
        } catch (err) {
          logger.error(err);
        }
      })();
    });
  // }

  await browser.close();
};

export default ruliwebThumbnailRequest;
