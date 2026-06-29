import { post } from "./api";
import { goto } from "./fun";
import store from "../store";
import BigNumber from "bignumber.js";
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
  console.log(res);

  const osName = res.osName || res.platform;
  const isIOS = osName === "ios";

  return isIOS;
};
export const isHonery = ()=>{
  return /harmony/i.test(window.navigator.userAgent);
}

export const mgTvLogin =()=>{
    MgtvApi.login((res) => {
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
                
                    resolve(true)
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

export const  groupByItemName = (data)=> {
  const map = new Map();
  
  data.forEach(item => {
    const itemId = item.itemId;
    const name = item.item.name;
    
    if (map.has(itemId)) {
      map.get(itemId).num += 1;
    } else {
      map.set(itemId, {
        itemId: itemId,
        name: name,
        num: 1
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
    
    if (map.has(id)) {
      map.get(id).num += 1;
    } else {
      map.set(id, {
        id: id,
        name: name,
        num: 1
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