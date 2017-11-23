import jsonp from 'common/js/jsonp';
import {commonParams, options} from './config';
import axios from 'axios';

export function getRecommend () {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg';

  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    uin: 0,
    needNewCode: 1
  });

  return jsonp(url, data, options);
};

export function getDiscList () {
  const url = '/api/getDiscList';             // ajax请求

  const data = Object.assign({}, commonParams, {
    platform: 'yqq',
    hostUin: 0,
    sin: 0,
    ein: 29,
    categoryId: 10000000,
    needNewCode: 0,
    sortId: 5,
    rnd: Math.random(),
    format: 'json'
  });

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data);
  });
};

export function getDiscDetail (discId) {
  const url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg';

  const data = Object.assign({}, commonParams, {
    disstid: discId,
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    platform: 'yqq',
    needNewCode: 0,
    hostUin: 0
  });

  return jsonp(url, data, options);
};
