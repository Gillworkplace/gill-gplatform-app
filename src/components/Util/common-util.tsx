/**
 * 获取随机字符串
 * @param len
 */
import { history } from '@umijs/max';
import Cookies from 'js-cookie';

export function randomString(len: number): string {
  let fLen = len || 32;
  /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
  const $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
  const maxLen = $chars.length;
  let str = '';
  for (let i = 0; i < fLen; i++) {
    str += $chars.charAt(Math.floor(Math.random() * maxLen));
  }
  return str;
}

export function getInt32FromBlob(byteArray: ArrayBuffer): number {
  const dataView = new DataView(byteArray);
  return dataView.getInt32(0);
}

export function getFromCookieOrUrl(name: string): string | undefined {
  let value;
  const params = new URLSearchParams(history.location.search);
  value = params.get(name);
  if (value !== null) {
    return value;
  }
  return Cookies.get(name);
}
