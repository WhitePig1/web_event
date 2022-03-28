// 每次$.get()或者$.post()或$.ajax()
// 会调用这个函数
// 这个函数中会拿到我们给Ajax提供的配置对象
$.ajaxPrefilter(function(options) { 
  console.log(options.url);
  // 发起Ajax请求之前,统一拼接url
  options.url = 'http://api-breakingnews-web.itheima.net' + ptions.url

})