$(function () {
    var form = layui.form;

    // 定义美化模板引擎的过滤器
    template.defaults.imports.dataFormat = function (data) {
        const dt = new Date(data);
        var y = dt.getFullYear();
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());

        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
    }

    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    // 定义一个查询的参数对象，将来请求数据的时候
    // 需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate_id: '', // 文章分类的id
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
                    return layui.layer.msg('获取文章列表失败！');
                }
                layui.layer.msg(res.message);
                // 使用模板引擎渲染页面的数据
                var htmlStr = template('tpl-list', res);
                // console.log(htmlStr);
                $('.layui-table tbody').html(htmlStr);
                renderPage(res.total);
            }
        })
    }

    // 初始化文章分类的方法
    function initCate() {
        $.ajax({ 
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layui.layer.msg('获取分类数据失败！')
                }
                // 调用模板引擎渲染分类的可选项
                var htmlStr = template('tpl-cate', res);
                console.log(htmlStr);
                $('[name=cate_id]').html(htmlStr);
                // 通知layui重新渲染表单区域的ui结构。
                form.render();
            }
        })
    }

    // 为筛选表单绑定 submit提交事件
    $('#form-search').submit(function (e) {
        e.preventDefault();
        // 获取表单中选中项的值
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();
        // 为查询参数对象q中对应的属性赋值
        q.cate_id = cate_id;
        q.state = state;
        // 根据最新的筛选条件重新渲染数据
        initTable();
        // renderPage(res.total);
    })

    // 定义渲染分页的方法
    function renderPage(total) {
        var laypage = layui.laypage;

        // 调用laypage.render()方法来渲染分页的结构
        laypage.render({
            elem: 'pageBox' //注意，这里的 pageBox 是 ID，不用加 # 号
            ,
            count: total, //数据总数，从服务端得到
            limit: q.pagesize, // 每页显示几条数据
            curr: q.pagenum, // 设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10], // 每页条数的选择项。
            // 分页发生切换的时候，触发jump进行回调
            // 触发jump回调的方式有两种：
            // 1. 点击页码的时候，会触发jump回调
            // 2. 只要调用laypage.render()方法就会触发jump回调
            jump: function (obj, first) { //点击页码时first值为undefined，而调用方式时first值为true
                // console.log(obj.curr);
                // 把最新的页码值，赋值到q这个查询参数对象中
                q.pagenum = obj.curr;
                // 拿到最新的条目数
                q.pagesize = obj.limit;
                console.log(first+' '+obj.curr+' '+obj.limit);
                if (!first) {
                    initTable();
                }
                // initTable();
            }
        });
        // console.log(total);
    }

    // 通过代理的形式为编辑按钮绑定点击事件处理函数
    $('tbody').on('click', '.btn-edit', function (e) {
        e.preventDefault();
        let htmlStr = $('#tpl-edit').html();
        // 当前按钮
        let id = $(this).attr('data-id');
        let form = layui.form;
        let indexEdit = null;
        console.log(id);
        $.ajax({
            method: 'GET',
            url: '/my/article/' + id,
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg('获取文章详情失败');
                }
                console.log(res.data);
                layui.layer.msg(res.message);
                form.val('art_edit', res.data)
            }
        })

        indexEdit = layui.layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: htmlStr
        })
    })

    // 通过代理的形式为删除按钮绑定点击事件处理函数
    $('tbody').on('click', '.btn-delete', function (e) {
        e.preventDefault();
        let id = $('.btn-edit')[0].dataset.id;

        // 获取当前页删除按钮的个数
        let len = $('.btn-delete').length;
        console.log(id + ' ' + len);
        
        layui.layer.confirm('确定要删除吗', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layui.layer.msg('删除失败');
                    }
                    layui.layer.msg('删除成功');
                    // 当数据删除完成后，需要判断当前这一页中是否还要剩余的数据，如果没有剩余的数据，则让页码值-1，再调用重新调用initTable()方法
                    // len: 删除前按钮的个数
                    if (len == 1) {
                        // 如果len的值等于1，证明删除完毕后，页面上就没有任何数据了
                        q.pagenum = q.pagenum > 1 ? q.pagenum - 1 : q.pagenum;
                    }
                    initTable();
                    // layui.layer.close(index);
                }
            })
            layui.layer.close(index);
        })
    })
})