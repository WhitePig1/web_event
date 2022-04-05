$(function() {

  var form = layui.form;
  var layer = layui.layer;


  form.verify({
    nickname: function (value) {
      if(value.length > 6) {
        return '昵称长度需要在1到6个字符';
      }
    }
  })

  initUserInfo();


  function initUserInfo() {
    $.ajax({
      method: 'GET',
      url: '/my/userinfo',
      headers: {
        Authorization: localStorage.getItem("token") || ''
      },
      success: function(res) {
        if(res.status !== 0) {
         return layer.msg('获取用户信息失败')
        }
        console.log(res);
        // 调用form.val()快速为表单赋值
        form.val('formUserInfo', res.data)
        // $('#username').html((res.data['username']));
      }
    })
  }

 

  // 重置表单的数据
  $('#btnReset').on('click', function(e) {
      // 阻止默认的表单重置行
      e.preventDefault();

      initUserInfo();
  })

  //
  $('.layui-form').on('submit', function(e) {
    // 阻止表单的默认提交行为
    e.preventDefault();

    // 发起Ajax数据请求
    $.ajax({
      method: 'POST',
      url: '/my/userinfo',
      data: $(this).serialize(),
      success: function(res) {
        if(res.status !== 0) {
          return layer.msg('更新用户信息失败')
        }
        layer.msg('更新用户信息成功');

        // 调用父页面中的方法重新渲染
        window.parent.getUserInfo()

      }

    })

  })

}) 

