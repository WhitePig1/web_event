$(function () {
  var layer = layui.layer;
  var form = layui.form;

  // 初始化富文本编辑器
  initEditor();

  // 初始化选择菜单
  initCate();
  // 定义加载文章分类的方法

  function initCate() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        if (res.status !== 0) {
          layer.msg('获取分类数据失败')
        }
        // 调用模板引擎渲染分类的可选项
        var htmlStr = template('tpl-cate', res);

        $('[name=cate_id]').html(htmlStr);
        // layui重新渲染表单区域
        form.render();

      }
    })
  }


  // 1. 初始化图片裁剪器
  var $image = $('#image')

  // 2. 裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview'
  }

  // 3. 初始化裁剪区域
  $image.cropper(options)

  // 模拟点击事件
  $('#btnChooseImage').on('click', function () {
    $('#coverFile').click();
  })

  // 监听coverFile的change
  $('#coverFile').on('change', function (e) {
    var files = e.target.files;
    if (files.length === 0) {
      return layer.msg('请选择封面图片')
    }
    // 根据文件创建URL地址
    var newImgURL = URL.createObjectURL(files[0]);
    // 为裁剪区域重新设置图片
    $image
      .cropper('destroy') // 销毁旧的裁剪区域
      .attr('src', newImgURL) // 重新设置图片路径
      .cropper(options) // 重新初始化裁剪区域


  })

  var art_state = '已发布';

  $('#btnSave2').on('click', function () {
    art_state = '草稿';
  })

  $('#form-pub').on('submit', function (e) {
    e.preventDefault();
    // 基于form表单快速创建FormData对象
    var fd = new FormData($(this)[0]); //转化为原生DOM对象

    fd.append('state', art_state);



    // 将裁减后的图片输出为文件对象
 
    $image
    .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
      width: 400,
      height: 280
    })
    .toBlob(function(blob) {       // 将 Canvas 画布上的内容，转化为文件对象
      // 得到文件对象后，进行后续的操作
      fd.append('cover_img', blob);

    })
   
 

    publishArticle(fd);

    function publishArticle(formdata) {
      $.ajax({
        method: 'POST',
        url: '/my/article/add',
        data: fd,
        // 注意：如果提交FormData格式数据，必须有以下配置项
        contentType: false,
        processData: false,
        success: function(res) {
          if(res.status !== 0) {
            return layer.msg('发布文章失败');
          }
          layer.msg('发表文章成功'),
          location.href = '../article/art_list.html';
        }
      })
    }

  })


})