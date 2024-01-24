import {
  convertCategoryRuliweb,
  convertUploadedTimeRuliweb,
} from "../utils/utils";
import { HotDealDataType } from "../types/types";
import puppeteer from "puppeteer";
import cheerio from "cheerio";
import { supabase } from "../modules/modules";
import { logger } from "../modules/logger";

const siteName = "ruliweb";

const ruliwebRequest = async () => {
  logger.info(`${siteName}Request Start`);
  const dealData: HotDealDataType[] = [];
  const browser = await puppeteer.launch({
    headless: "new",
    executablePath: process.env.ENV === "dev" ? undefined : "/usr/bin/chromium",
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
  });

  const page = await browser.newPage();

  for (let i = 1; i <= 5; i++) {
    logger.info(`${siteName} loop${i} start`);
    await page
      .goto(
        `https://bbs.ruliweb.com/market/board/1020?page=${i}&view=default`,
        { waitUntil: "networkidle2", timeout: 0 }
      )
      .catch((err) => {
        logger.error("page.goto error", err);
      });

    const content = await page.content();
    const $ = cheerio.load(content, { ignoreWhitespace: false });
    // logger.info(content);
    $(
      "#board_list > div > div.board_main.theme_default.theme_white > table > tbody"
    )
      .children()
      .each((_, e) => {
        if ($(e).hasClass("notice") || $(e).hasClass("best")) {
          return;
        }
        const siteId = $(e).find(".id").text().trim();
        const category = convertCategoryRuliweb(
          $(e).find(".divsn").text().trim()
        );
        const num_reply = Number($(e).find(".num").text().trim());

        const url = $(e).find(".deco").attr("href")!;
        const title = $(e).find(".relative").text().split("\n")[1].trim();
        // console.log("title", i, titleAndUrl.text().split("\n")[1].trim());
        const is_soldout = title.includes("종료") || title.includes("품절");
        const hit = Number($(e).find(".hit").text().trim());
        const uploaded_time = $(e).find(".time").text().trim();

        if (siteId.length === 5 && siteId != "38542") {
          const dealItemData = {
            site: siteName,
            site_id: `r${siteId}`,
            thumbnail_url: null,
            category,
            title,
            is_soldout,
            num_reply,
            hit,
            uploaded_time: convertUploadedTimeRuliweb(uploaded_time),
            url,
            updated_at: new Date(),
          };
          logger.info(dealItemData);
          dealData.push(dealItemData);
        } else {
          return;
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
  logger.info(`${dealData.length} hot deal data has updated from ${siteName}`);
};

export default ruliwebRequest;
