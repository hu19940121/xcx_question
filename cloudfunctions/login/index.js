
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
// 初始化 cloud
// cloud.init({
//   env: cloud.DYNAMIC_CURRENT_ENV
// })
/**
 * event 参数包含小程序端调用传入的 data
 */
exports.main = async (event, context) => {
  // 可执行其他自定义逻辑
  // 获取 WX Context (微信调用上下文)，包括 OPENID、APPID、及 UNIONID（需满足 UNIONID 获取条件）等信息
  const wxContext = cloud.getWXContext()
  const openId =  wxContext.OPENID //获取当前用户openId
  let userInfo
  const res = await db.collection('user').where({ openId: wxContext.OPENID }).get()
  if (res.data.length > 0) { //之前注册过 直接返回用户信息
    userInfo = res.data[0]
  } else { //没有注册过 向用户表里插入信息
    const r = await db.collection('user').add({
      data:{
        openId,
        ...event.userInfo
      }
    })
    userInfo = event.userInfo
  }
  return {
    userInfo
  }
}

