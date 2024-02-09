/**
 * 获取随机字符串
 * @param len
 */
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
