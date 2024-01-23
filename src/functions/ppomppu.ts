import { HotDealDataType } from "../types/types";
import puppeteer from "puppeteer";
import cheerio from "cheerio";
import { supabase } from "../modules/modules";
import { logger } from "../modules/logger";

import {
  convertCategoryPpomppu,
  convertUploadedTimePpomppu,
} from "../utils/utils";
import { log } from "console";

const siteName = "ppomppu";

const ppomppuRequest = async () => {
  const dealData: HotDealDataType[] = [];
  const browser = await puppeteer.launch({
    headless: "new",
    executablePath: process.env.ENV === "dev" ? undefined : "/usr/bin/chromium",
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
  });

  const page = await browser.newPage();

  for (let i = 1; i <= 5; i++) {
    await page
      .goto(
        `https://www.ppomppu.co.kr/zboard/zboard.php?id=ppomppu&page=${i}&divpage=85`,
        { waitUntil: "networkidle2", timeout: 0 }
      )
      .catch((err) => {
        logger.error(err);
      });
    const content = await page.content();
    // const decodedResult = iconv
    // .decode(content., "euc-kr")
    // .toString();
    const $ = cheerio.load(content);

    $("body > .wrapper > .contents > .container > div:first-child > .info_bg")
      .find("[align=center]")
      .each((_i, e) => {
        // console.log(i);
        const site_id = Number($(e).find("td:first-child").text().trim());
        // console.log("site_id : ", site_id);
        if (isNaN(site_id) || site_id === 0) {
          return;
        } else {
          const url = $(e).find("[align=right]").find("a").attr("href");
          const thumbnail_url = $(e)
            .find("img")
            .attr("src")
            ?.includes("noimage")
            ? null
            : `https:${$(e).find("img").attr("src")}`;
          const title = $(e).find("font:first-child").text();
          // const category = findCategory(title);
          const categoryString = $(e)
            .find("[valign=middle]")
            .find("span:nth-child(4)")
            .text();

          const category = convertCategoryPpomppu(categoryString);
          const is_soldout =
            $(e).find("[valign=middle]").find("img").attr("src") ===
            "/zboard/skin/DQ_Revolution_BBS_New1/end_icon.PNG";
          const num_reply = Number(
            $(e).find("span.list_comment2").children().text().trim()
          );
          const hit = Number($(e).find("td:nth-child(6)").text().trim());
          const uploaded_time = $(e).find("td:nth-child(4)")?.attr("title");

          // const dealItemData = {
          //   site: "ruliweb",
          //   site_id: `r${siteId}`,
          //   thumbnail_url: null,
          //   category,
          //   title,
          //   is_soldout,
          //   num_reply,
          //   hit,
          //   uploaded_time: convertUploadedTimeRuliweb(uploaded_time),
          //   url,
          //   created_at: null,
          //   updated_at: null,
          // };

          const dealItemData = {
            site: "ppomppu",
            site_id: `p${site_id}`,
            thumbnail_url: thumbnail_url,
            category,
            title,
            is_soldout,
            num_reply,
            hit,
            uploaded_time: convertUploadedTimePpomppu(uploaded_time!),
            url: `https://www.ppomppu.co.kr/zboard/${url}`,
            updated_at: new Date(),
          };

          dealData.push(dealItemData);
        }
      });
  }

  try {
    const { error } = await supabase.rpc("update_deal_list", {
      item: dealData,
    });
    if (error) {
      throw new Error(`${error}`);
    }
  } catch (err) {
    logger.error(err);
  }

  await browser.close();
  //   console.log(dealData);
  logger.info(`${dealData.length} hot deal data has updated from ${siteName}`);
};
export default ppomppuRequest;
