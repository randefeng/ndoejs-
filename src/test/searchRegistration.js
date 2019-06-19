let  Request = require('./common/main')

let searchInfo =`王`
let  url = `https://mp.mhealth100.com/ip-pat-web/searchRegistration!ajaxGetDoctorScheduleList.do?searchInfo=${encodeURI(searchInfo)}&hospitalId=100363001&hospitalName=${encodeURI("西京医院")}&expertAppointment=&regType=0&deptType=&openId=&tenantId=00363`
let headers  ={
    "Host": `mp.mhealth100.com`,
    'Accept': `application/json, text/javascript, */*; q=0.01`,
    'User-Agent': `Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36 MicroMessenger/6.5.2.501 NetType/WIFI WindowsWechat QBCore/3.43.1021.400 QQBrowser/9.0.2524.400`,
    'Referer': `https://mp.mhealth100.com/ip-pat-web/wxInfo!getDeptInfo.do?hospitalId=100363001&deptType=&expertAppointment=`,
    'Accept-Language': `zh-CN,zh;q=0.8,en-us;q=0.6,en;q=0.5;q=0.4`,
    'Cookie': `JSESSIONID=31A2F6B61477236B83BBC87738479175; token="zg/KaxbsqQ1HKcRrsA6d1Q=="; Hm_lvt_4f5e6d65812072c49089f068396b8513=1560408481; Hm_lpvt_4f5e6d65812072c49089f068396b8513=1560416925`,
    'Connection': `keep-alive`
}

const asyncReadFile = async function () {
    let f1  =await Request.getRequest(url  , headers)
    try {
      var data  = JSON.parse(f1)
      console.log("chengg")
      console.log(f1)
    } catch (error) {
        console.log(error)
    }
  }
  asyncReadFile()

