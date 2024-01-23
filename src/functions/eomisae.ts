import { RequestHandler } from "express-serve-static-core";
import { HotDealDataType } from "../types/types";
import puppeteer from "puppeteer";
import cheerio from "cheerio";
import { convertUploadedTimeEomisae } from "../utils/utils";
import { supabase } from "../modules/modules";
import { logger } from "../modules/logger";

const siteName = "Eomisae";

const eomisaeRequest = async () => {
  const dealData: HotDealDataType[] = [];
  const browser = await puppeteer.launch({
    executablePath: "/usr/bin/chromium",
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
  });

  const page = await browser.newPage();

  for (let i = 1; i <= 5; i++) {
    await page.goto(`https://eomisae.co.kr/index.php?mid=os&page=${i}`, {
      waitUntil: "networkidle2",
      timeout: 0,
    });
    const content = await page.content();
    const $ = cheerio.load(content);

    $(".bd")
      .find(".bd_card > .card_el")
      .each((i, e) => {
        const title = $(e).find("h3").text().trim();
        if (title.includes("레벨 미만의") || title.includes("전체 공개로")) {
          return;
        } else {
          const id = Number(
            $(e).find(".checkb").attr("for")?.trim().replace("check", "")
          );
          const url = $(e).find(".pjax").attr("href")?.trim();
          const thumbnailUrlWithoutHttps = $(e)
            .find(".tmb")
            .attr("src")
            ?.trim()
            .includes("sub.png")
            ? null
            : $(e).find(".tmb").attr("src")?.trim();
          const numReply = Number($(e).find(".fr:nth-child(2)").text().trim());
          const hit = Number($(e).find(".fr:nth-child(1)").text().trim());
          const uploadedTime = $(e)
            .find(".card_content > p > span:nth-child(2)")
            .text()
            .trim();

          const dealItemData = {
            site: siteName,
            site_id: `e${id}`,
            url,
            thumbnail_url: `https:${thumbnailUrlWithoutHttps}`,
            category: "패션",
            title,
            is_soldout: title.includes("종료") || title.includes("품절"),
            num_reply: numReply,
            hit,
            uploaded_time: convertUploadedTimeEomisae(uploadedTime),
            updated_at: new Date(),
          };
          dealData.push(dealItemData);
        }
      });
  }

  await browser.close();

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

  logger.info(`${dealData.length} hot deal data has updated from ${siteName}`);
};

export default eomisaeRequest;
