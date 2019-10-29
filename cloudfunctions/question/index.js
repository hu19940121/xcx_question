// 云函数入口文件
const cloud = require('wx-server-sdk')
const moment = require('moment')

cloud.init()
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event)
  switch (event.action) {
    case 'getQuestionBank': {
      return getQuestionBank(event)
    }
    case 'getQuestions': {
      return getQuestions(event)
    }
    case 'getQuestionBankDetail': {
      return getQuestionBankDetail(event)
    }
    case 'startWork': {
      return startWork(event)
    }
    //获取当前用户已经生成对应题库的题目列表
    case 'getUserQuestionList': {
      return getUserQuestionList(event)
    }
    case 'updateUserQuestion': {
      return updateUserQuestion(event)
    }
    case 'handPaper': {
      return handPaper(event)
    }
    case 'getAnswerResult': {
      return getAnswerResult(event)
    }
    case 'restart': {
      return restart(event)
    }
    case 'history':{
      return history(event)
    }
    default: {
      return
    }
  }
}
//获取当前登录用户的userId
async function getUserIdByOpenId() {
  const { OPENID } = cloud.getWXContext()
  const res = await db.collection('user').where({ openId: OPENID }).get()
  console.log('获取当前登录用户的userId res',res.data);
  
  return res.data[0]._id
}
//获取题库列表
async function getQuestionBank(event) {
  const wxContext = cloud.getWXContext()
  // const res = await db.collection('question_bank').where({ openId: wxContext.OPENID }).get()
  const res = await db.collection('question_bank').get()
  return {
    data: res.data
  }
}

//获取指定题库下的题目列表
async function getQuestions(event) {
  const wxContext = cloud.getWXContext()
  const res = await db.collection('question').where({ bank_id: event.id }).get()
  return {
    data: res.data
  }
}
//获取题库详情
async function getQuestionBankDetail(event) {
  const user_id = await getUserIdByOpenId()
  const res = await db.collection('question_bank').doc(event.id).get()
  const statusRes =  await db.collection('exam_status').where({ user_id, bank_id: event.id}).get() //先把对应题库的答题状态查出来
  let status = 0 // 0未开始 1进行中 2 已结束
  if (statusRes.data.length > 0) { //
    status = statusRes.data[0].status
  }
  return {
    data: {
      ...res.data,
      status,
    }
  }
}
// //生成用户对应题库
// async function startWork(event) {
//   const { OPENID } = cloud.getWXContext()
//   const res = await db.collection('question').where({ bank_id: event.id }).get() //查找出对应题库里的所有题目
//   let userRes =  await db.collection('user').where({ openId: OPENID }).get()
//   console.log('userRes',userRes);
  
//   let questions = res.data || []
//   for (let i = 0; i < questions.length; i++) {
//     await db.collection('user_exam').add({
//       data:{
//         bank_id: questions[i].bank_id,
//         question_title:  questions[i].title,
//         question_type:  questions[i].type,
//         question_id: questions[i]._id,
//         reply:'',
//         score: 0,
//         user_id: userRes.data[0]._id
//       }
//     })
//   }
//   return {
//     data: res.data
//   }
// }
//生成用户对应题库
async function startWork(bank_id) {
  const { OPENID } = cloud.getWXContext()
  const res = await db.collection('question').where({ bank_id }).get() //查找出对应题库里的所有题目
  let userRes =  await db.collection('user').where({ openId: OPENID }).get()
  console.log('userRes',userRes);
  
  let questions = res.data || []
  for (let i = 0; i < questions.length; i++) {
    await db.collection('user_exam').add({
      data:{
        bank_id: questions[i].bank_id,
        question_title:  questions[i].title,
        question_type:  questions[i].type,
        question_id: questions[i]._id,
        reply:'',
        score: 0,
        user_id: userRes.data[0]._id,
        createTime: moment(new Date()).format('YYYY-MM-DD hh:mm:ss')  //后边用来查看答题时间 同一题库的createTime是一样的
      }
    })
  }
  return {
    data: res.data
  }
}
//获取当前用户已经生成对应题库的题目列表
async function getUserQuestionList(event) {
  const user_id = await getUserIdByOpenId()
  let questions = await db.collection('user_exam').where({ bank_id: event.bankId,user_id }).get() //题目们
  if (questions.data.length ===0 ) { //如果没有用户的试卷 则去生成
    await startWork(event.bankId)
    await db.collection('exam_status').add({ data: { user_id, bank_id: event.bankId, status:1 } }) // status 1.表示正在答题 2.表示已结束 
    questions = await db.collection('user_exam').where({ bank_id: event.bankId,user_id }).get()
  }
  const questionIds = questions.data.map((item)=>item.question_id) //题目的id集合  
  let preAnswers = await db.collection('question_preanswer').where({ question_id: _.in(questionIds)}).get() //根据题目id查到相应的选项们（答案们）
  let arr = []
  questions.data.map((que)=>{
    let obj = {
      ...que
    }
    let options = []
    preAnswers.data.map((an)=>{
      if (que.question_id === an.question_id) {
        options.push(an)
      }
    })
    obj['options'] = options
    arr.push(obj)
  })  
  return {
    data: arr
  }
}
// [
//   {
//     title:'',
//     options:[
//       {
        
//       }
//     ]
//   },
//   {
//     title:'',
//     options:[
//       {

//       }
//     ]
//   }

// ]

//更新答题者的答案
async function updateUserQuestion(event) {
  const question = await db.collection('question').doc(event.question_id).get()
  console.log('正确答案question',question.data);
  console.log('question.answer === event.reply',question.data.answer === event.reply);
  
  let score = 0
  if (question.data.answer === event.reply) { //答对了 
    score = question.data.score 
  }
  const res = await db.collection('user_exam').doc(event._id).update({
    data:{
      reply: event.reply,
      score
    }
  })

  return {
    data: res.data
  }
}
//交卷打分
async function handPaper(event) {
  const user_id = await getUserIdByOpenId()
  const result = await db.collection('user_exam').where({ bank_id: event.bankId,user_id }).get()  //获取答题结果
  //计算答对和打错的数量
  let right_num = 0
  let wrong_num = 0
  result.data.map(item=>{
    if (item.score > 0) {
      right_num ++
    } else {
      wrong_num ++
    }
  })
  let totalScore = result.data.reduce((prev, cur)=>{
    return prev + cur.score
  },0)
  let end_time = moment(new Date()).format('YYYY-MM-DD hh:mm:ss')
  let du = moment.duration(moment(new Date()) - moment(result.data[0].createTime), 'ms')
  let use_time = du.get('hours') + '小时' + du.get('minutes') + '分钟' + du.get('seconds') + '秒'
  await db.collection('exam_result').add({
    data: {
      bank_id: event.bankId,
      question_num: result.data.length,
      total_score: totalScore,
      user_id,
      right_num,
      wrong_num,
      start_time: result.data[0].createTime, //答题时间
      end_time,
      use_time
    }
  })
  //交卷完了 把用户对应的做题状态改为已结束
  await db.collection('exam_status').where({ bank_id: event.bankId,user_id }).update({
    data:{
      status: 2
    }
  })
  return {
    totalScore, //总分
    question_num: result.data.length //一共几道题
  }
}
//获取结果
async function getAnswerResult(event) {
  const user_id = await getUserIdByOpenId()
  const result = await db.collection('exam_result').where({ bank_id: event.bankId,user_id }).get()  //获取答题结果
  return {
    data: result.data
  }
}
//重新生成对应用户试卷
async function restart(event) {
  const user_id = await getUserIdByOpenId()
  await db.collection('user_exam').where({ bank_id: event.bankId,user_id }).remove()  //删除用户对应的试卷
  // await db.collection('exam_result').where({ bank_id: event.bankId,user_id }).remove()  //删除用户对应的答题结果
  await db.collection('exam_status').where({ bank_id: event.bankId,user_id }).remove()  //删除用户对应的答题状态
  return {
    data: {
      code: 0
    }
  }
}
//查看用户某个题库的答题记录
async function history(event) {
  const user_id = await getUserIdByOpenId()
  let bankDetail = await db.collection('question_bank').doc(event.bankId).get()
  // bankDetail.data
  let resList = await db.collection('exam_result').where({ bank_id: event.bankId,user_id }).get() 
  let data = {
    ...bankDetail.data,
    list: resList.data
  }
  return data
}




