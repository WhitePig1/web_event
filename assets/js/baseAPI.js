// 每次$.get()或者$.post()或$.ajax()
// 会调用这个函数
// 这个函数中会拿到我们给Ajax提供的配置对象
$.ajaxPrefilter(function(options) { 
  
  // 发起Ajax请求之前,统一拼接url
  options.url = 'http://api-breakingnews-web.itheima.net' + options.url

  // 统一为有权限的接口设置headers请求头
  if(options.url.indexOf('/my/') !== -1) {
    options.headers = {
      Authorization: localStorage.getItem('token') || ''
    }
  }

  // 全局统一挂载complete回调函数
  options.complete = function(res) {
   
      // complete回调函数中，使用热res.responseJSON拿到返回数据

      if (res.responseJSON.status === 1) {
        // 1. 清空token
        localStorage.removeItem('token');
        // 2. 跳转登录页
        location.href = '/code/login.html'
      }
 
  }
  
  
})