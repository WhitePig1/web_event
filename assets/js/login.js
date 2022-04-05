$(function () {
  // 点击去注册
  $('#link-reg').on('click', function () {
    $('.login-box').hide();
    $('.reg-box').show();
  })

  // 点击去登录
  $('#link-login').on('click', function () {
    $('.login-box').show();
    $('.reg-box').hide();
  })

  // 从layui中获取form对象
  var form = layui.form;
  var layer = layui.layer;
  // 通过form.varify自定义规则
  form.verify({
    pwd: [/^[\S]{6,12}$/, '密码必须6-12位,且不能出现空格'],
    repwd: function (value) {
      // 获取应用规则区域所输入的值
      // 获取密码框内容进行比较
      // 进行一次等于的判断
      // 出错提示消息
      var pwd = $('.reg-box [name=password]').val();

      // 利用父节点获取子元素的属性值
      if (pwd !== value) {
        return '两次输入的密码不一致'
      }


    }
  })
  // var username = [];
  // var pwd = [];

  // 监听注册表单的提交事件
  $('#form_reg').on('submit', function (e) {
    // 阻止默认提交行为
    e.preventDefault();

    // 利用本地存储数据
    // if (!find($('#form_reg [name=username]').val(), username)) {
    //   username.push($('#form_reg [name=username]').val());
    //   pwd.push($('#form_reg [name=repassword]').val());
    //   localStorage.setItem('username', JSON.stringify(username));
    //   localStorage.setItem('password', JSON.stringify(pwd));
    //   layer.msg('注册成功');
    //   $('#link-login').click;
    // } else {
    //   layer.msg('已存在相同用户名，注册失败')
    // }


    // 可以获取服务器数据使用

    var data = {
      username: $('#form_reg [name=username]').val(),
      password: $('#form_reg [name=password]').val()
    }

    $.ajax({
      url: '/api/reguser',
      method: 'POST',
      data: data,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message)
        }
        layer.msg('注册成功')
        // 模拟点击行为
        $('#link-login').click();
      }
    })
  })

  // 监听登录表单的提交时间
  $('#form_login').submit(function (e) {
    //   // 阻止表单的默认提交
      e.preventDefault();

    //   console.log($('#form_login [name=username]').val());
    //   console.log(JSON.parse(localStorage.getItem("username")));
    //   if (
    //     find($('#form_login [name=username]').val(), JSON.parse(localStorage.getItem("username"))) ===
    //     find($('#form_login [name=password]').val(), JSON.parse(localStorage.getItem("password")))

    //   ) {
    //     layer.msg('登录成功')
    //     location.href = 'index.html'

    //   } else {
    //     layer.msg('登录失败,用户名或密码错误')
    //   }




    // 连接服务器使用
    $.ajax({
      url: '/api/login',
      method: 'POST',
      // 快速获取表单中的数据
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('登录失败')
        }
        layer.msg('登录成功');

        // 将登录成功的token字符串保存到localStorage
        localStorage.setItem('token', res.token)

        //跳转到后台首页,从根路径写起
        location.href = './index.html'
      }
    })
  })


})


  // 定义find函数
  // function find(value, Array) {
  //   for (var i = 0; i < Array.length; i++) {
  //     if (value === Array[i]) {
  //       return i + 1;
  //     }
  //   }
  //   return 0;
  // }