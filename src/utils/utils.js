import has from 'has';
import {
  add, cut, division, nul,
} from './math';

import {
  fixRate,
  formatTime,
  fixD,
  diff,
  lastD,
  fixUrl,
  fixInput,
  getComplexType,
  getTime,
  timeFn,
} from './common-method';


import getHex from './rgbaToHex';
import getScript from './getScript';

// import { worker, workerData } from './webWorker';

import myStorage from './mystorage';

import browser from './getBrowser';

const routerEnv = (process.env.NODE_ENV === 'development') ? '*' : '';
export {
  has, // hasOwnProperty
  add, // 加法
  cut, // 减法
  division, // 乘法
  nul, // 除法3
  fixRate,
  formatTime,
  fixD,
  diff,
  lastD,
  fixUrl,
  fixInput,
  getScript,
  getComplexType,
  getTime,
  timeFn,
  getHex,
  routerEnv,
  // worker,
  // workerData,
  myStorage,
  browser,
};
