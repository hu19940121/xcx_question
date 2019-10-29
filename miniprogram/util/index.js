/**
 * @description:  获取页面url（带参数）
 * @param {currentPage}  小程序url对象
 * @return: 
 */
export function getPageUrlWithArgs(currentPage) {
  var url = currentPage.route    //当前页面url
  var options = currentPage.options    //如果要获取url中所带的参数可以查看options
  //拼接url的参数
  var urlWithArgs = '/' + url + '?'
  for (var key in options) {
    var value = options[key]
    urlWithArgs += key + '=' + value + '&'
  }
  urlWithArgs = urlWithArgs.substring(0, urlWithArgs.length - 1)
  return urlWithArgs
}
