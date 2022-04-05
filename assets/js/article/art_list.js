$(function () {

  var layer = layui.layer;
  var form = layui.form;
  var laypage = layui.laypage;

  // 定义时间过滤器
  template.defaults.imports.dateFormat = function (date) {
    const dt = new Date(date);
    var y = dt.getFullYear();

    var m = padZero(dt.getMonth() + 1);
    var d = padZero(dt.getDate());
    var hh = padZero(dt.getHours());
    var mm = padZero(dt.getMinutes());

    return y + '-' + m + '-' + d + ' ' + hh + ':' + mm;
  }

  // 定义补padZero(n)零函数
  function padZero(n) {
    return n > 9 ? n : '0' + n;
  }

  // 定义一个查询的参数对象，将来请求数据的时候，发送提交到服务器
  var q = {
    pagenum: 1, //页码值，第几页
    pagesize: 2, //几条数据
    cate_id: '', //文章分类的id
    state: '' // 文章的发布状态
  }

  initTable();
  initCate();


  // 获取文章列表数据的方法
  function initTable() {
    $.ajax({
      method: 'GET',
      url: '/my/article/list',
      data: q,
      success: function (res) {

        if (res.status !== 0) {
          return layer.msg('获取文章列表失败')
        }
        // 使用模板引擎渲染页面的数据
        var htmlStr = template('tpl-table', res);

        $('tbody').html(htmlStr);

        // 调用渲染分页的方法
        renderPage(res.total);

      }
    })
  }

  // 初始化文章分类
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


  // 为筛选表单绑定submit事件
  $('#form-search').on('submit', function (e) {
    e.preventDefault();
    var cate_id = $('[name=cate_id]').val();
    var state = $('[name=state]').val();

    // 为查询参数对象q中的对应属性赋值
    q.cate_id = cate_id;
    q.state = state;

    // 根据最新的筛选条件渲染表单数据
    initTable();


  })


  // 定义渲染分页结构的方法
  function renderPage(total) {
    laypage.render({
      elem: 'pageBox', // 分页容器id,用来放id
      count: total, // 数据条数
      limit: q.pagesize, // 每页数据
      curr: q.pagenum, // 默认选中的分页
      layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'], // 顺序很重要
      limits: [2, 3, 5, 10],
      // 分页发生切换，触发jump的回调
      // 1.点击页码触发,切换条目触发
      // 2.调用了方法触发
      jump: function (obj, first) {

        q.pagenum = obj.curr; // 赋值最新页码值
        q.pagesize = obj.limit;
        // 为true是方式2触发，也就是没有切换的时候，自己调用


        if (!first) {
          initTable();
        }
        // 不加以干涉会陷入自己调用自己的死循环

      }
    })
  }


  // 通过代理的形式，为删除按钮绑定点击事件
  $('tbody').on('click', '.btn-delete', function () {

    layer.confirm('确认删除数据?', {
      icon: 3,
      title: '提示'
    }, function (index) {
      var id = $(this).attr('data-id');
      var btn_len = $('.btn-delete').length;
      $.ajax({
        method: 'GET',
        url: '/my/article/delete/' + id,
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg('文章删除失败');
          }
          layer.msg('文章删除成功');
          // 数据删除完成后需要判断这一页是否还有剩余的数据
          // 如果没有生育数据将页码值-1 并且渲染
          if (btn_len <= 1) {
            q.pagenum = q.pagenum === 1 ? 1 : q.pagesize - 1;

            initTable();
          }
        }
      })

      layer.close(index);
    })
  })

  // 通过代理的方式，为编辑按钮添加功能
  $('tbody').on('click', '.btn-edit', function() {
    var id = $(this).attr('data-id');
    
    $.ajax({
      method: 'GET',
      url: '/my/article' +  id,
      success: function(res) {
        if(res.status !== 0) {
          return layer.msg('获取数据失败')
        }
        location.href = '../article/art_pub.html';
        
      }
    })
  })

})