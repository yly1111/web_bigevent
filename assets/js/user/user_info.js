$(function(){
    var form = layui.form
    var layer = layui.layer

    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return '昵称长度必须在1-6个字符之间'
            }
        }
    })

    initUserInfo()
    
    // 重置表单的数据 为原来初始数据
    $('#btnReset').click(function(e) {
        // 阻止表单的默认重置行为 防止清空数据
        e.preventDefault();
        // 重置为原来的数据
        layui.layer.confirm('确定重置吗', {icon: 3, title:'提示'}, function(index) {
            initUserInfo();
            layui.layer.close(index);
        })
    })

    // 监听表单提交的事件
    $('.layui-form').submit(function(e){
        // 阻止表单默认提交事件
        e.preventDefault();
        // 快速获取表单值
        // var data = $(this).serialize();
        var data = {id: $('.layui-form [name=id]').val(), nickname: $('.layui-form [name=nickname]').val(), email: $('.layui-form [name=email]').val()};
        // 发起请求
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: data,
            success: function(res) {
                if(res.status !== 0){
                    return layui.layer.msg('更新信息失败！');
                }
                layui.layer.msg(res.message);
                // 调用父页面中的方法，重新渲染用户头像和信息
                window.parent.getUserInfo()
            }
        })
    })
})

// 初始化用户的基本信息
function initUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        success: function(res) {
            if(res.status !== 0){
                return layer.msg('加载用户信息失败')
            }
            console.log(res);
            // 调用form.val快速为表单赋值
            layui.form.val('user_info', res.data)
        }
    })
}