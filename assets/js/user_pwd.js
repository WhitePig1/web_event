$(function () {

  var form = layui.form;
  var layer = layui.layer;


  form.verify({
    pwd: [
      /^[\S]{6,12}$/, '密码必须6到12位,且不能出现空格'
    ],
    samePwd: function (value) {
      if (value === $('[name=oldPwd]').val()) {
        return '新旧密码不能相同'
      }
     },
     confirmPwd: function (value) {
      if (value !== $('[name=newPwd]').val()) {
        return '两次输入密码不一致'
      }
    }
  })

  $('#btnReset').on('click', function(e) {
    e.preventDefault();

    $('.layui-form')[0].reset();
  })


  $('.layui-form').on('submit', function (e) {
    // 阻止表单的默认提交行为
    e.preventDefault();

    // 发起Ajax数据请求
    $.ajax({
      method: 'POST',
      url: '/my/updatepwd',
      data: $(this).serialize(),
      success: function (res) {
        
        if (res.status !== 0) {
          return layer.msg('更新密码信息失败')
        }
        layer.msg('更新密码信息成功');

        // form元素的reset方法
        $('.layui-form')[0].reset();
  
      

      }

    })

  })

})