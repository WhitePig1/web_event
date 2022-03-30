$(function () {

  //调用getUserInfo()获取用户信息
  getUserInfo();

  var layer = layui.layer;

  // 退出按钮功能
  $('#btn-logout').on('click', function () {
    layer.confirm('确定退出登录', {
      icon: 3,
      title: '提示'
    }, function (index) {
      //do something
      // 1.清空本地存储token
      localStorage.removeItem('token');
      // 重新跳转到登录页面
      location.href = '/code/login.html';

      // 关闭提示框
      layer.close(index);
    });
  })

})


// 获取用户基本信息
function getUserInfo() {
  $.ajax({
    method: 'GET',
    url: '/my/userinfo',
    // headers就是请求头配置对象
    // 需要这个请求头携带身份认证字段才可以正常访问
    headers: {
      Authorization: localStorage.getItem("token") || ''
    },
    success: function (res) {
      if (res.status !== 0) {
        return layui.layer.msg('获取用户信息失败')
      }

      // 调用renderAvatar渲染用户头像
      renderAvatar(res.data)


     }
    // // 成功失败都会调用
    // complete: function (res) {
    //   // complete回调函数中，使用热res.responseJSON拿到返回数据

    //   if (res.responseJSON.status === 1) {
    //     // 1. 清空token
    //     localStorage.removeItem('token');
    //     // 2. 跳转登录页
    //     location.href = '/code/login.html'
    //   }
    // }
  })


}

// 渲染用户头像信息
function renderAvatar(user) {
  // 获取用户名称
  var name = user.nickname || user.username;
  // 设置欢迎文本
  $('#welcome').html('欢迎&nbsp;' + name);
  // 按需渲染用户头像
  if (user.user_pic !== null) {

    $('.layui-nav-img').attr('src', user.user_pic).show()
    $('.text-avatar').hide();
  }
  // 渲染文本头像 
  else {
    $('.layui-nav-img').hide();
    var first = name[0].toUpperCase()
    $('.text-avatar').html(first).show();
  }


}