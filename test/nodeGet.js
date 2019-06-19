var request = require('request');
var fs = require("fs")
var cheerio = require('cheerio');

// //   console.log(response.headers['set-cookie']) // 获取登录后的 cookie
//  文件的读写
//cheerio 解析文件
///location.search.split('?')[1].split('&')



var writeFile = (fileName ='./test2.html', res) => {
  // 写入文件内容（如果文件不存在会创建一个文件）
  // 传递了追加参数 { 'flag': 'a' }
  return new Promise((resolve, reject) => {
    fs.writeFile(fileName, res, { 'flag': 'w+' }, function (err) {
      if (err) {
        reject(err);
      }
      resolve('Saved.');
    });
  })
}
let readFile = () => {
  // 写入成功后读取测试
  return new Promise((resolve, reject) => {
    fs.readFile('./test2.html', 'utf-8', function (err, data) {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  })
}


const ajax = () => {
  return Promise((resolve, reject) => {
    request({
      url: 'http://192.168.219.252/login',   // 请求的URL
      method: 'GET',                   // 请求方法
      headers: {                       // 指定请求头
        'Accept-Language': 'zh-CN,zh;q=0.8',         // 指定 Accept-Language
      }
    }, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        // console.log(body) // 输出网页内容
      }
      //利用cheerio对页面进行解析 拿到html处理页面
      var $ = cheerio.load(response.body.toString());
      // 输出网页内容
      writeFile(response.body)
      let $ = cheerio.load(response.body.toString()); //利用cheerio对页面进行解析
      //返回数据
      resolve($)
    });

  })

}

const asyncReadFile = async function () {
  let f1  =await readFile()
  var $ = cheerio.load(f1.toString()); //利用cheerio对页面进行解析
  let t = $('form').serializeArray();
  console.log(t);
  writeFile('./fristPage.html', JSON.stringify(t))
}

asyncReadFile()
