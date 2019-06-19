
var request = require('request');
var fs = require("fs")
 const getRequest = (url ,headers ) => {
    return new Promise((resolve, reject) => {
      request({
        url: url,   // 请求的URL
        method: 'GET',                   // 请求方法
        headers: headers
      }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          // console.log(body) // 输出网页内容
            //返回数据
             resolve(body)
        }else{
            // reject(error)
        }
      });
    })
  }
 
  const postRequest = (url ,headers,datas ) => {
    return new Promise((resolve, reject) => {
      request({
        url: url,   // 请求的URL
        method: 'POST',                   // 请求方法
        headers: headers,
        form: datas,
      }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          // console.log(body) // 输出网页内容
            //返回数据
             resolve(body)
        }else{
            // reject(error)
        }
      });
    })
  }



  var writeFile = (fileName ='./test2.html', res) => {
    // 写入文件内容（如果文件不存在会创建一个文件）
    // 传递了追加参数 { 'flag': 'a' }
    return new Promise((resolve, reject) => {
      fs.writeFile(fileName, res, { 'flag': 'w+' }, function (err) {
        if (err) {
          reject(err);
        }
        resolve('Saved200');
      });
    })
  }
  let readFile = (fileName ='./test2.html') => {
    // 成功后读取测试
    return new Promise((resolve, reject) => {
      fs.readFile(fileName, 'utf-8', function (err, data) {
        if (err) {
          console.log('------------------err')
          reject(err);
        }
        resolve(data);
      });
    })
  }

 
//获取最后一个字符串的
function  getLastTime  (str){
  let  cookieTime =Date.parse(new Date())/1000
  var last = str.lastIndexOf("=");
  var len  =str.length;
  var aa = str.replace(str.substring(last, len),`=${cookieTime}`)

  return  aa
}

  module.exports = {
    getRequest,
    readFile,
    getLastTime,
    writeFile
   }