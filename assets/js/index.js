$(function(){
    // 调用getUserInfo获取用户基本信息
    getUserInfo()

    var layer = layui.layer

    // 点击按钮 实现退出的功能
    $('#btnLogout').on('click', function(){
        console.log('ok')
        // 提示用户是否确定退出
        layer.confirm('确定退出登录？', {icon: 3, title: '提示'}, function(index){
            // 1. 清空本地存储中的token
            // 2. 重新跳转到登录界面
            localStorage.removeItem('token')
            location.href = '/font-back/one/大事件项目/login.html'
            // 关闭confirm询问框
            layer.close(index)
        })
        // console.log('输出'+opt)
        // if(opt === true){
        //     location.href = '/font-back/one/大事件项目/login.html'
        // }
    })
})

// 获取用户信息
function getUserInfo() {
    $.ajax({
    method: 'GET',
    url: '/my/userinfo',
    success: function(res) {
        console.log(res)
        if (res.status !== 0) {
            return layui.layer.msg('获取用户信息失败！')
        }
        // 调用 renderAvatar 渲染用户的头像
        renderAvatar(res.data)
    },

    // 无论响应成功还是失败 都会执行complete回调函数
    // complete: function(res) {
    //     // console.log(res.responseJSON);
    //     // 在complete回调函数中,可以使用res.responseJSON拿到服务器响应回来的数据
    //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败!'){
    //         localStorage.removeItem('token')
    //         location.href = '/font-back/one/大事件项目/login.html'
    //     } 
    // }
    })

}
    

// 渲染用户的头像
function renderAvatar(user) {
    // 1. 获取用户名称
    var name = user.nickname || user.username;
    // 2. 设置欢迎的文本
    $('#welcome').html('欢迎&nbsp;&nbsp;'+name)
    // 3. 按需渲染用户的头像
    if (user.user_pic !== null) {
        // 3.1 渲染图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()

    }else {
        // 3.2 渲染文本头像
        $('.layui-nav-img').hide()
        var first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
    }

}