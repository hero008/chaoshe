import { post } from "./api";
import { goto } from "./fun";
import store from "../store";
import BigNumber from "bignumber.js";
export const  shareUrl = 'http://t8080.mgtv.com:8080?isFullScreen=1&isHideNavBar=1'
export const isMTVapp = () => {
  return /imgo/i.test(window.navigator.userAgent);
};
export const getDecievedModel = () => {
  if (MgtvApi.isIpad) {
    return "PlatformID_MGTV_IPAD";
  } else {
    const res = uni.getSystemInfoSync();
    const osName = res.osName || res.platform;
    return osName === "ios"
      ? "PlatformID_MGTV_IPhone"
      : "PlatformID_MGTV_Android";
  }
};
export const isIos = () => {
  const res = uni.getSystemInfoSync();

  const osName = res.osName || res.platform;
  const isIOS = osName === "ios";

  return isIOS;
};
export const isHonery = ()=>{
  return /harmony/i.test(window.navigator.userAgent);
}

export const mgTvLogin =()=>{
    MgtvApi.login(() => {
       store.dispatch('asyncUpdateMgTvLogin');
        setTimeout(() => { goto("/pages/my/loading") }, 100)
    });
}


function getAppType(){
  return 'imgotv'
}


export function video_schema(m_video_url, type) {
  let res = /\.mgtv\.com\/s\/(\d+).html/.exec(m_video_url);
  if (res) {
    const video_id = res[1];
    if (type === 'mobile') {
      return `${getAppType()}://player?clipId=0&plId=0&videoId=${video_id}`
    } else if (type === "pad") {
      return `imgotvhd://player?clipId=0&plId=0&videoId=${video_id}`
    } else {
      return m_video_url;
    }
  }


  res = /\.mgtv\.com\/[hb]\/(\d+).html/.exec(m_video_url);
  if (res) {
    const clip_id = res[1]
    if (type === 'mobile') {
      return `${getAppType()}://player?clipId=${clip_id}&plId=0&videoId=0`
    } else if (type === "pad") {
      return `imgotvhd://player?clipId=${clip_id}&plId=0&videoId=0`
    } else {
      return m_video_url;
    }
  }

  res = /\.mgtv\.com\/[hb]\/(\d+)\/?$/.exec(m_video_url);
  if (res) {
    const clip_id = res[1]
    if (type === 'mobile') {
      return `${getAppType()}://player?clipId=${clip_id}&plId=0&videoId=0`
    } else if (type === "pad") {
      return `imgotvhd://player?clipId=${clip_id}&plId=0&videoId=0`
    } else {
      return m_video_url;
    }
  }

  res = /\.mgtv\.com\/b\/(\d+)\/(\d+)\.html/.exec(m_video_url);
  if (res) {
    console.log(res)
    const clip_id = res[1]
    const video_id = res[2]

    if (type === 'mobile') {
      return `${getAppType()}://player?clipId=${clip_id}&plId=0&videoId=${video_id}`
    } else if (type === "pad") {
      return `imgotvhd://player?clipId=${clip_id}&plId=0&videoId=${video_id}`
    } else {
      return m_video_url;
    }
  }

  res = /m\.mgtv\.com\/l\/(\d+)\/?$/.exec(m_video_url);
  if (res) {
    const pl_id = res[1] //播单

    if (type === 'mobile') {
      return `${getAppType()}://player?clipId=0&plId=${pl_id}&videoId=0`
    } else if (type === "pad") {
      return `imgotvhd://player?clipId=0&plId=${pl_id}&videoId=0`
    } else {
      return m_video_url;
    }
  }


  res = /\.mgtv\.com\/l\/(\d+)\/(\d+)\.html/.exec(m_video_url);
  if (res) {
    const pl_id = res[1]
    const video_id = res[2]

    if (type === 'mobile') {
      return `${getAppType()}://player?clipId=0&plId=${pl_id}&videoId=${video_id}`
    } else if (type === "pad") {
      return `imgotvhd://player?clipId=0&plId=${pl_id}&videoId=${video_id}`
    } else {
      return m_video_url;
    }
  }
}


export function isVideo(url) {
  return /(m|www|w)\.mgtv\.com\/l\//.test(url) || /(m|www|w)\.mgtv\.com\/b\//.test(url)
}


export const  jumpUrl =(link)=>{
  if(!isMTVapp()){
   window.location.href = link
   return;
  }

const is_app = /imgo/i.test(window.navigator.userAgent)
const is_ipad = /ipad/i.test(window.navigator.userAgent)

if (isVideo(link)) { 
    let schema = link;
    if (is_app) {
      if (is_ipad) {
        schema = video_schema(link, 'pad')
      } else {
        schema = video_schema(link, 'mobile')
      }
      window.location.href = schema
    }else{
      window.location.href = link;
    }
  }else{
      MgtvApi.jumpPage({
         url: link,
        });
  }
}

export const mgTvIsLogin = () => {
   return new Promise((resolve, reject) => {
        MgtvApi.getUserInfo((user_info) => {
                if (user_info && user_info.length !== 0) {
                const userInfo = JSON.parse(user_info);
                if (userInfo.ticket && userInfo.uuid) {

                  console.log(userInfo,'sjkflsdjflsjdlj')
                   const uuid = uni.getStorageSync('uuid')
                    if(uuid && uuid != userInfo.uuid){
                      resolve(false);
                    }else{
                        resolve(true)

                    }
                
                } else {
                    resolve(false)
                }
                } else {
                resolve(false)
                }
        });
    })
}

// 上面的用不上



export const formateGachaLevelName = (levelName) => {
   if(levelName == 'SP'){
            return '传说'
           }else if(levelName == 'A'){
            return '史诗'
           }else if(levelName == 'B'){
            return '稀有'
           }else if(levelName == 'C'){
               return '普通'
           }
}

export const  parseQueryString =(str)=> {
  const result = {};
  const pairs = str.split('&');
  
  pairs.forEach(pair => {
    const [key, value] = pair.split('=');
    if (key) {
      result[key] = value || '';
    }
  });
  
  return result;
}


export const timesAmount = (value1,value2)=>{
  return  new BigNumber(value1).times(new BigNumber(value2)).toFixed()
}


export const  groupByItemId = (data) =>{
  const result = {};
  data.forEach(item => {
    const itemId = item.itemId;
    if (!result[itemId]) {
      result[itemId] = 0;
    }
    result[itemId]++;
  });
  return result;
}
export const marketGroupByItemId =(data)=>{
    const map = new Map();
  
  data.forEach(item => {
    const itemId = item.itemId;
    if (map.has(itemId)) {
      map.get(itemId).num += 1;

    } else {
      map.set(itemId, {
        num: 1,
        ...item
      });
    }
  });
  
  return Array.from(map.values());
}
export const  groupByItemName = (data)=> {
  const map = new Map();
  
  data.forEach(item => {
    const itemId = item.itemId;
    const name = item.item.name;
    if (map.has(itemId)) {
      map.get(itemId).num += 1;
      if(map.get(itemId).ids){
         
      }else{
        map.get(itemId).ids = []
      }
       map.get(itemId).ids.push(item.id)
     
    } else {
      map.set(itemId, {
        itemId: itemId,
        name: name,
        num: 1,
        item:item.item,
        id:item.id,
        ids:[item.id]
        
      });
    }
  });
  
  return Array.from(map.values());
}

export const  groupByItemName1 = (data)=> {
  const map = new Map();
  
  data.forEach(item => {
    const id = item.id;
    const name = item.name;
    const img = item.coverImage
    const point = item.decomposeXPoint
    
    if (map.has(id)) {
      map.get(id).num += 1;
    } else {
      map.set(id, {
        id: id,
        name: name,
        num: 1,
        img:img,
        point:point
      });
    }
  });
  
  return Array.from(map.values());
}
export const subAmount = (value1,value2)=>{
    return  new BigNumber(value1).minus(new BigNumber(value2)).toFixed()

}
export const addAmount = (value1,value2)=>{
    return  new BigNumber(value1).plus(new BigNumber(value2)).toFixed()

}

export const getSourceXcoinPoint= (type)=>{
  if ((type == 'CostAwardLogType_Normal')) {
     return '消费返星光积分'
  }else if(type == 'CostAwardLogType_Invite'){
     return '邀请用户消费返星光积分'
  }else if(type == 'CostAwardLogType_Accept'){
     return '星光积分兑换'
  }else if(type == 'CostAwardLogType_PrizeWheel'){
     return '转盘抽奖'
  }else if(type == 'CostAwardLogType_StepByStep'){
     return '步步高升'
  }else if(type == 'CostAwardLogType_SignIn'){
     return '签到'
  }else if(type == 'CostAwardLogType_LuckyNum'){
     return '幸运数'
  }else if(type == 'CostAwardLogType_CostAwardOffset'){
     return '星光积分抵扣'
  }else if(type == 'CostAwardLogType_Recall'){
     return '召回'
  }else if(type == 'CostAwardLogType_RedemptionCode'){
     return '兑换码'
  }else if(type == 'CostAwardLogType_Admin'){
     return '管理员手动修改'
  }
}


export const formatDate = (date)=> {
  const pad = (n) => String(n).padStart(2, '0');
  return date.getFullYear() + '-' +
    pad(date.getMonth() + 1) + '-' +
    pad(date.getDate()) + ' ' +
    pad(date.getHours()) + ':' +
    pad(date.getMinutes()) + ':' +
    pad(date.getSeconds());
}

export const MGTV_Channel = 'MGTV_Channel'