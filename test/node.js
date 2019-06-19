/**
 * nodejs的request模块模拟登陆开源中国
 */
//密码加密模块
let request = require('request');
//登陆post地址
let url = 'http://192.168.219.252//j_spring_security_check';
//登陆post的所有数据
let datas = {
  'j_username'	:'',
  'j_password'	:'randefeng',
  'validateCode':	'863a'
};
//设置头部
let headers ={
  'Host': `192.168.219.252`,
  'Cache-Control': `max-age=0`,
  'Upgrade-Insecure-Requests': `1`,
  'User-Agent': `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.80 Safari/537.36`,
  'Accept': `text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3`,
  'Accept-Encoding': `gzip, deflate`,
  'Accept-Language': `zh-CN,zh;q=0.9`,
  'Cookie': `JSESSIONID=73E94187284F1FC64CC331D41F970C66`,
  'Connection': `keep-alive`

}
let opts = {
  url: url,
  method: 'POST',
  headers: headers,
  form: datas,
};
 
//模拟登陆
request(opts, (error, response, body) => {
  // console.log(r.headers['set-cookie']);
  //登陆后访问首页
  if (!error && response.statusCode == 200) {
    console.log(body)
  }
  console.log(error)
  console.log(response.caseless.dict.location)

});
 