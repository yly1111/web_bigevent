$(function() {
    getArtCateList();

    // 获取模板内容
    let htmlStr = $('#tpl-add').html()
    // 未添加类别按钮绑定点击事件
    var indexAdd = null;
    $('#btnAddCate').click(function(){
        // 返回当前弹层索引
        indexAdd = layui.layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: htmlStr
        })
    })


    // 因为form-add一开始不存在
    // 通过代理的形式,为form-add表单绑定submit事件
    $('body').on('submit', '#form-add', function(e){
        e.preventDefault();
        console.log($('#form-add').serialize());
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                console.log(res);
                if(res.status !== 0){
                    return layui.layer.msg('添加失败!');
                }
                layui.layer.msg(res.message);
                getArtCateList();

                // $('.layui-layer-setwin a')[0].click();
                // 也可以
                layui.layer.close(indexAdd);
                
            }
        })
    })
    
    $('tbody').on('click', '.btn-edit', function (e) {
        let htmlStr = $('#tpl-edit').html();
        console.log('ok ' + $(this)[0].dataset.id);
        var indexEdit = null;
        indexEdit = layui.layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: htmlStr
        })

        let id = $(this).attr('data-id');
        let form = layui.form;
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/'+id,
            success: function(res) {
                console.log(res);
                if(res.status !== 0){
                    return layui.layer.msg('获取失败!');
                }
                layui.layer.msg(res.message);
                form.val('art_edit', res.data)
                // $('.layui-layer-setwin a')[0].click();
                // 也可以
                // layui.layer.close(indexAdd);            
            }
        })    
        
    })

    // 通过代理的形式，为修改分类的表单绑定submit事件
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();
        // console.log($(this).serialize());
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg('修改失败');
                }
                layui.layer.msg(res.message);
                layui.layer.close(indexEdit);
                getArtCateList();
            }
        })
    })

    // 通过代理的形式 为删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function (e) {
        e.preventDefault();
        let id = $('.btn-edit').attr('data-id');
        // 提示用户是否要删除
        layui.layer.confirm('确定要删除吗', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/'+id,
                success: function (res) {
                    if (res.status != 0) {
                        layui.layer.msg('删除失败');
                    }
                    layui.layer.msg(res.message);
                    layui.layer.close(index);
                    getArtCateList();
                }
            })
        })
    })
})

function getArtCateList(){
    $.ajax({
        method: 'GET',
        url: '/my/article/cates',
        success: function(res) {
            if(res.status !== 0){
                return layui.layer.msg('获取文章分类列表失败!')
            }
            layui.layer.msg(res.message);
            // console.log(res.data);
            let htmlStr = template('tpl-article', res);
            $('#art-container').html(htmlStr)
        }
    })
}