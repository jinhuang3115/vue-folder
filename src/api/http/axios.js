import axios from 'axios';
import { getCookie } from '@/api/cookie';
// import md5 from 'js-md5'
const formatTime = (dateTime) => {
  const date = new Date(dateTime);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  function s(t) {
    return t < 10 ? `0${t}` : t;
  }

  return `${year}-${s(month)}-${s(day)} ${s(hours)}:${s(minutes)}:${s(seconds)}`;
};
// 参数
const formatParams = (acParams = {}) => {
  let data;
  if (Object.prototype.toString.call(acParams) === '[object FormData]') {
    acParams.append('uaTime', formatTime(new Date().getTime()));
    data = acParams;
  } else {
    data = { ...acParams };
    data.uaTime = formatTime(new Date().getTime());
  }
  return data;
};
// 请求头
const formatHeaders = (acHeaders) => {
  let headers = {};
  headers['exchange-token'] = getCookie('token') || 'c5fa97c1140aafea1ef1e84b67503d5e0db18d0ca0ff4819a0ca3f24722407df';
  headers['exchange-client'] = 'pc';
  headers['exchange-language'] = getCookie('lan') || 'zh_CN';
  // headers['Content-type'] = 'application/x-www-form-urlencoded'
  // headers['exchange-time'] = formatTime(new Date().getTime())
  if (acHeaders) {
    headers = { ...headers, ...acHeaders };
  }
  return headers;
};
const http = ({
  url, headers, params, method, hostType,
}) => {
  let prefix = '';
  switch (hostType) {
    case 'otc':
      prefix = '/fe-otc-api'; // 场外
      break;
    case 'co':
      prefix = '/fe-co-api'; // 场內
      break;
    case 'upload':
      prefix = '/fe-upload-api'; // 上传
      break;
    case 'def':
      prefix = '';
      break;
    default:
      prefix = '/fe-ex-api'; // 公共和交易所
  }
  return new Promise((resolve, reject) => {
    axios({
      url: `${prefix}/${url}`, // exchange-web-api线上  vue-api本地
      headers: formatHeaders(headers),
      data: formatParams(params),
      method: method || 'post',
    }).then((data) => {
      resolve(data.data);
    }).catch((err) => {
      reject(err);
      throw new Error(`Error:${err}`);
    });
  });
};
export default http;
