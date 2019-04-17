import webworkerMap from '@/assets/js/webworker-map';

let workers = null;
let workersData = null;

function worker() {
  if (!workers) {
    workers = new Worker(`/static/web-worker/${webworkerMap.websocket}?fileMap=${JSON.stringify(webworkerMap)}`);
  }
  return workers;
}
function workerData() {
  if (!workersData) {
    workersData = new Worker(`/static/web-worker/${webworkerMap.setWsData}?fileMap=${JSON.stringify(webworkerMap)}`);
  }
  return workersData;
}

export {
  worker,
  workerData,
};
