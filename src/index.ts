import express from "express";
import { AsyncTask, SimpleIntervalJob, ToadScheduler } from "toad-scheduler";
import ruliwebRequest from "./functions/ruliweb";
import eomisaeRequest from "./functions/eomisae";
import ppomppuRequest from "./functions/ppomppu";
import ruliwebThumbnailRequest from "./functions/ruliwebThumbnail";

const app = express();

const scheduler = new ToadScheduler();

const eomisaeTask = new AsyncTask("eomisaeTask", async () => {
  return eomisaeRequest();
});

const ruliwebTask = new AsyncTask("ruliwebTask", async () => {
  return ruliwebRequest();
});

const ppomppuTask = new AsyncTask("ppomppuTask", async () => {
  return ppomppuRequest();
});

const rulliwebThumbnailTask = new AsyncTask(
  "rulliwebThumbnailTask",
  async () => {
    return ruliwebThumbnailRequest();
  }
);

const eomisaeJob = new SimpleIntervalJob(
  { minutes: 5, runImmediately: true },
  eomisaeTask
);

const ruliwebJob = new SimpleIntervalJob(
  {
    minutes: 5,
    runImmediately: true,
  },
  ruliwebTask
);

const ppomppuJob = new SimpleIntervalJob(
  {
    minutes: 5,
    runImmediately: true,
  },
  ppomppuTask
);

const ruliwebThumbnailJob = new SimpleIntervalJob(
  {
    minutes: 5,
    runImmediately: true,
  },
  rulliwebThumbnailTask
);

scheduler.addSimpleIntervalJob(eomisaeJob);
scheduler.addSimpleIntervalJob(ruliwebJob);
scheduler.addSimpleIntervalJob(ppomppuJob);
scheduler.addSimpleIntervalJob(ruliwebThumbnailJob);

app.listen(process.env.PORT!, () => {
  console.log(`server on port ${process.env.PORT!}`);
});
