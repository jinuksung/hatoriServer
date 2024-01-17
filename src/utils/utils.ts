const curr = new Date();
const UTC_TIME = curr.getTime() + curr.getTimezoneOffset() * 60 * 1000;
const KR_TIME_DIFF = 9 * 60 * 60 * 1000;
export const KOREAN_CURRENT_TIME = new Date(UTC_TIME + KR_TIME_DIFF);

export const convertUploadedTimeEomisae = (time: string) => {
  if (time.includes(".")) {
    const year = Number(time.trim().substring(0, 2)) + 2000;
    const month = Number(time.trim().substring(3, 5));
    const date = Number(time.trim().substring(6, 8));

    return new Date(year, month - 1, date, 0, 0, 0);
  } else {
    return KOREAN_CURRENT_TIME;
  }
};

export const convertCategoryRuliweb = (categoryString: string) => {
  switch (categoryString) {
    case "게임S/W":
      return "게임";

    case "상품권":
      return "상품권/포인트";

    case "음식":
      return "식품";

    case "도서":
      return "도서";

    case "PC/가전":
      return "디지털/가전";

    case "의류":
      return "패션";

    case "생활용품":
      return "생활";

    case "게임H/W":
      return "디지털/가전";

    default:
      return null;
  }
};

export const convertUploadedTimeRuliweb = (time: string) => {
  if (time.includes(":")) {
    const timeArray = time.split(":");
    const uploadedDate = new Date(
      KOREAN_CURRENT_TIME.getFullYear(),
      KOREAN_CURRENT_TIME.getMonth(),
      KOREAN_CURRENT_TIME.getDate(),
      Number(timeArray[0]),
      Number(timeArray[1])
    );

    return new Date(uploadedDate.getTime() - KR_TIME_DIFF);
  } else {
    const timeArray = time.split(".");
    const uploadedDate = new Date(
      Number(timeArray[0]),
      Number(timeArray[1]) - 1,
      Number(timeArray[2])
    );
    return new Date(uploadedDate.getTime() - KR_TIME_DIFF);
  }
};

export const convertUploadedTimePpomppu = (time: string) => {
  //23.09.29 05:24:54
  const uploadedTimeArray = time.split(" ");

  const yearMonthDate = uploadedTimeArray[0].split(".");

  const hourMinuteSecond = uploadedTimeArray[1].split(":");

  const uploadedDate = new Date(
    Number(yearMonthDate[0]) + 2000,
    Number(yearMonthDate[1]) - 1,
    Number(yearMonthDate[2]),
    Number(hourMinuteSecond[0]),
    Number(hourMinuteSecond[1]),
    Number(hourMinuteSecond[2])
  );

  // console.log("uploadedDate :", uploadedDate);

  return new Date(uploadedDate.getTime() - KR_TIME_DIFF);
};

export const convertCategoryPpomppu = (categoryString: string) => {
  switch (categoryString) {
    case "[식품/건강]":
      return "식품";

    case "[디지털]":
      return "디지털";

    case "[의류/잡화]":
      return "패션";

    case "[육아]":
      return "생활";

    case "[서적]":
      return "도서";

    default:
      return null;
  }
};
