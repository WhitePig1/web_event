$(function () {
  var layer = layui.layer;
  var form = layui.form;

  initArtCateList();
  // 获取文章分类列表
  function initArtCateList() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        var htmlStr = template('tpl-table', res);
        $('tbody').html(htmlStr);
      }
    })
  }

  // 为添加类别按钮绑定点击事件
  var indexAdd = null;
  $('#btnAddCate').on('click', function () {

    indexAdd = layer.open({
      type: 1,
      title: '添加文章分类',
      area: ['500px', '250px'],
      content: $('#dialog-add').html(),

    })
  })

  // 通过代理形式为form-add表单绑定submit事件
  $('body').on('submit', '#form-add', function (e) {
    e.preventDefault();

    $.ajax({
      method: 'POST',
      url: '/my/article/addcates',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('新增分类失败')
        }
        // 渲染显示
        initArtCateList();
        layer.msg('新增分类成功');
        // 关闭弹出层的方法
        layer.close(indexAdd);

      }

    })
  })

  // 下面两步为一个整体，包含了嵌套的关系
  var indexEdit = null;
  // 通过代理的形式，为btn-edit绑定点击事件
  $('tbody').on('click', '#btn-edit', function () {
    indexEdit = layer.open({
      type: 1,
      title: '编辑分类名称',
      area: ['500px', '250px'],
      content: $('#dialog-edit').html(),
    });

    // 拿到data-id的值
    var id = $(this).attr('data-id');
    // 发请求获取对应内容
    $.ajax({
      method: 'GET',
      url: '/my/article/cates/' + id,
      success: function (res) {
        // layui专用方法
        // 使用该方法时，注意对应关系与name是否匹配
        form.val('form-edit', res.data)
      }


    })

  })

  // 通过代理形式，为修改分类的表单绑定submit事件
  $('body').on('submit', '#form-edit', function (e) {
    e.preventDefault();
    $.ajax({
      method: 'POST',
      url: '/my/article/updatecate',
      // headers: {
      //   Authorization: localStorage.getItem("token") || ''
      // },
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('更新数据失败')
        }
        layer.msg('更新数据成功');
        layer.close(indexEdit);
        initArtCateList();
      }
    })
  })


  // 通过代理方式，btn-delete添加点击事件
  $('tbody').on('click', '#btn-delete', function () {

    var id = $(this).attr('data-id');

    console.log(id);
    layer.confirm('确定删除?', {
      icon: 3,
      title: '提示'
    }, function (index) {
      $.ajax({
        method: 'GET',
        url: '/my/article/deletecate/' + id,
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg('删除分类失败')
          }
          layer.msg('删除分类成功');
          layer.close(index);
          initArtCateList();
        }
      })


    });

  })




})