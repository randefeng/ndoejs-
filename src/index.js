const Request = require('./common/main');
var cheerio = require('cheerio');
var request = require('request');
// JSESSIONID=372016A4F2C3B7CF6660062D1F0D9002; token=GNwWt823x-u1l8j6gmc4Xw; Hm_lvt_4f5e6d65812072c49089f068396b8513=1560737742; Hm_lpvt_4f5e6d65812072c49089f068396b8513=15607 38677
let searchInfo = `王琼`
const searchUrl = `https://mp.mhealth100.com/ip-pat-web/searchRegistration!ajaxGetDoctorScheduleList.do?searchInfo=${encodeURI(searchInfo)}&hospitalId=100363001&hospitalName=${encodeURI("西京医院")}&expertAppointment=&regType=0&deptType=&openId=&tenantId=00363`
let  Cookie_ID= `JSESSIONID=6290C09B0020839D4262B6EAF300FC13; token=38kXiESpJ9SZeym3GAchgg; Hm_lvt_4f5e6d65812072c49089f068396b8513=1560921781; Hm_lpvt_4f5e6d65812072c49089f068396b8513=1560923019`
let Cookie  =Request.getLastTime(Cookie_ID)
const headers = {
  "Host": `mp.mhealth100.com`,
  'Accept': `application/json, text/javascript, */*; q=0.01`,
  'User-Agent': `Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36 MicroMessenger/6.5.2.501 NetType/WIFI WindowsWechat QBCore/3.43.1021.400 QQBrowser/9.0.2524.400`,
  'Referer': `https://mp.mhealth100.com/ip-pat-web/wxInfo!getDeptInfo.do?hospitalId=100363001&deptType=&expertAppointment=`,
  'Accept-Language': `zh-CN,zh;q=0.8,en-us;q=0.6,en;q=0.5;q=0.4`,
  'Cookie': Cookie,
  'Connection': `keep-alive`
}
// https://mp.mhealth100.com/ip-pat-web/theDayReg!toDoctorDetailInfo.do?
// hospitalId=100363001&
// deptId=594a6ab55d85eda01e053c980948a20f&
// deptName=%E5%A6%87%E4%BA%A7%E7%A7%91%E9%97%A8%E8%AF%8A&
// doctorId=594aae0bb4c7dfef6e053c980948a1f6&
const asyncReadFile = async function () {
  let f1 = await Request.getRequest(searchUrl, headers)
  //f1  查询出来的数据 详情需要 三个字段  deptId  doctorId  deptName  已知：hospitalId (100363001都一样) 
  try {
    if (!f1.includes('DOCTYPE HTML')) {
      var data = JSON.parse(f1)
      Request.writeFile('./req1Data.html', f1);
       let [deptId, deptName, doctorId] = [];
      if (data.datas.scheduleList.length > 0) {
        let scheduleList = data.datas.scheduleList[0]
        deptId = scheduleList.deptId
        deptName = scheduleList.deptName
        doctorId = scheduleList.doctorId
      }
      console.log(`完成第一次的请求===================`)
      let DoctorUrl = `https://mp.mhealth100.com/ip-pat-web/theDayReg!toDoctorDetailInfo.do?hospitalId=100363001&deptId=${deptId}&deptName= ${encodeURI(deptName)}&doctorId=${doctorId}&expertAppointment=`
      //f2获取 的是一个html 页面格式
      let html2 = await Request.getRequest(DoctorUrl, headers)
      console.log(`完成第二次的请求===================`)
      //写入文件
      // let writhtml = await Request.writeFile('./test2.html', html2);
      //去读取
      // let readhtml2 = await Request.readFile('./test2.html');
      var $ = cheerio.load(html2, { decodeEntities: false });
      Request.writeFile('./req2Html.html', html2);
      let formArr = [];
      $("form").each(function () {
        formArr = [...formArr, $(this).serializeArray()]
      });
      Request.writeFile('./req2Data.html', JSON.stringify(formArr));
      var content = $('#listInfo').html();
      var lenDay = JSON.parse(content);
      console.log(`完成第二次的的解析===================`)
      console.log(content)
      if (lenDay&&lenDay.length > 0) {
        //  只看当天
        // 看的是上午的 和下午 
        let arrList = lenDay[0].regInfoList[0].timeRegInfoList;
        // regleaveCount:是余号 
        //上午有号抢上午的 没有就看下午的。
        if (arrList.length > 0 && arrList[0].regleaveCount > 0) {
          const map = new Map();
          formArr[0].forEach((ele) => {
            map.set(ele.name, ele.value)
          });
          getRegPatient3(map)
        } else if (arrList.length > 1 && arrList[1].regleaveCount > 0) {
          const map = new Map();
          formArr[1].forEach((ele) => {
            map.set(ele.name, ele.value)
          });
          getRegPatient3(map)
        } else {
          setTimeout(() => {
            asyncReadFile()

          }, 500);
          console.log("没号了。");
        }
      }
    } else {
      Request.writeFile('./req1Html.html', f1);
      console.log("cookie过期了 ")
    }
    ///最后一步完成订单(未开发)
  } catch (error) {
    console.log(error)
  }
}

//获取提交的订单信息
async function getRegPatient3(params) {
  let url = `https://mp.mhealth100.com/ip-pat-web/wxInfo!getRegPatient.do?hospitalId=${params.get("hospitalId")}&deptId=${params.get("deptId")}&deptName=${encodeURI(params.get("deptName"))}&doctorId=${(params.get("doctorId"))}&regDate=${(params.get("regDate"))}&timeFlag=2&shiftName=${encodeURI(params.get("shiftName"))}&openId=&fee=${(params.get("fee"))}&treatfee=${(params.get("treatfee"))}&doctorName=${encodeURI(params.get("doctorName"))}&title=${encodeURI(params.get("title"))}&hospitalName=${encodeURI(params.get("hospitalName"))}&deptType=&svObjectId=&scheduleId=${(params.get("scheduleId"))}&doctorLevelCode=${(params.get("doctorLevelCode"))}&clinicUnitId=${(params.get("clinicUnitId"))}&hasRegisterType=&tenantId=${(params.get("tenantId"))}`
  let html3 = await Request.getRequest(url, headers)
  let $ = cheerio.load(html3, { decodeEntities: false });
  let formArr = [];
  $("form").each(function () {
    formArr = [...formArr, $(this).serializeArray()]
  });
  const map = new Map();
  formArr[3].forEach((ele) => {
    map.set(ele.name, ele.value)
  });

  var submitData = (strMapToJson(map))
  submitData4(submitData)
}

async function submitData4(datas) {
   //////////////////////提交//
  let orderUrl = "https://mp.mhealth100.com/ip-pat-web/wxInfo!addOrder.do"
  // deptName 核医学科门诊
  
  var datas1 = JSON.parse(datas)
  console.log('aa========')
  request({
    url: orderUrl,   // 请求的URL
    method: 'POST',                   // 请求方法
    headers: headers,
    form: datas1,
  }, function (error, response, body) {
    console.log(`完成第4次的的解析===================`)
       Request.writeFile('./test2.html', datas);
    if (true) {
      if (body.includes('DOCTYPE HTML')) {
        var $ = cheerio.load(body, { decodeEntities: false });
         console.log($(".kdui-msg__desc").html())
      }else{
        console.log("预约成功，去查看订单")
      }
      //返回数据kdui-msg__desc kdui-msg__desc
    } else {
      console.log(body)
    }
  });

}

asyncReadFile()












///MAP转化成obj
function strMapToJson(strMap) {
  return JSON.stringify(strMapToObj(strMap));
}
function strMapToObj(strMap) {
  let obj = Object.create(null);
  for (let [k, v] of strMap) {
    obj[k] = v;
  }
  return obj;
}

// const asyncReadFile1 = async function () {
//   let f1  =await Request.readFile("./fristPage.html")
//   var $ = cheerio.load(f1.toString()); //利用cheerio对页面进行解析
//   let t = $('form').serializeArray();
//   console.log(t);
// }
`https://mp.mhealth100.com/ip-pat-web/wxInfo!getRegPatient.do?hospitalId=100363001&deptId=594a6ab55d756da01e053c980948a20f&deptName=%E8%82%BE%E8%84%8F%E5%86%85%E7%A7%91%E9%97%A8%E8%AF%8A&doctorId=594aae0bb4a41fef6e053c980948a1f6&regDate=2019-06-16&timeFlag=1&shiftName=%E4%B8%8A%E5%8D%88&openId=&fee=0&treatfee=1200&doctorName=%E9%A9%AC%E5%B3%B0%E5%89%AF%E6%95%99%E6%8E%88&title=%E5%89%AF%E6%95%99%E6%8E%88&hospitalName=%E8%A5%BF%E4%BA%AC%E5%8C%BB%E9%99%A2&deptType=&svObjectId=&scheduleId=7c21834aae17dccdae053219e948a530&doctorLevelCode=6101000001000632&clinicUnitId=594a6ab55d756da01e053c980948a20f&hasRegisterType=&tenantId=00363`