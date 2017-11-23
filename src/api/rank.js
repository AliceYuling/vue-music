import {commonParams, options} from './config.js';
import jsonp from 'common/js/jsonp.js';

export function getTopList () {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg';

  const data = Object.assign({}, commonParams, {
    tpl: 3,
    page: 'detail',
    date: new Date(),
    topid: 4,
    type: 'top',
    song_begin: 0,
    song_num: 30,
    loginUin: 0,
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0
  });

  return jsonp(url, data, options);
};

export function getRankDetail (topid) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg';

  const data = Object.assign({}, commonParams, {
    uin: 0,
    platform: 'h5',
    needNewCode: 1,
    tpl: 3,
    page: 'detail',
    type: 'top',
    topid
  });

  return jsonp(url, data, options);
};
