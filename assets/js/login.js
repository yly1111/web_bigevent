$(function() {
    // 点击“注册账号”的链接
    $('#link_reg').on('click', function(res){
        $('.login-box').hide()
        $('.reg-box').show()
    })

    // 点击“去登录”的链接
    $('#link_login').on('click', function() {
        $('.login-box').show()
        $('.reg-box').hide()
    })


    // 从layui中获取到一个form对象
    var form = layui.form
    // 通过form.verify()来自定义校验规则
    form.verify({
        // 自定义一个叫做pwd的校验规则
        pwd: [
            /^[\S]{6,12}$/
            ,'密码必须6到12位，且不能出现空格'
          ],
        
        //   校验两次密码是否一致的规则
        repwd: function (value) {
            // 通过形参拿到的是确认密码框中的内容
            // 还需要拿到密码框中的内容
            // 然后进行一次比较
            // 如果判断失败，则return一个提示消息即可
            var pwd = $('.reg-box [name=password]').val()
            // alert(pwd)
            if (pwd != value) {
                return '两次密码不一致'
            }
        }        
    })

    // 监听注册表单的提交事件
    // var form_reg = document.querySelector('#form_reg');
    $('#form_reg').on('submit', function(e) {
        e.preventDefault();
        // alert('here')
        var data = {username: $('#form_reg [name=username]').val(), 
        password: $('#form_reg [name=password]').val()}
        $.post('/api/reguser', data, 
            function(res) {
                // alert(1)
                if(res.status != 0){
                    return layer.msg(res.message); 
                    // return console.log(res.message);
                } 
                // console.log('注册成功！');
                layer.msg('注册成功，请登录！')

                // 模拟人的点击行为 返回到注册界面
                $('#link_login').click()
            })
    })

    // 监听登录表单的提交事件
    // console.log($('#form_login'));
    $('#form_login').submit(function(e) {
        e.preventDefault();
		// alert(1)
        // 获取表单值
        // var data = $(this).serialize()

        var data = {username: $('#form_login [name=username]').val(), 
        password: $('#form_login [name=password]').val()}
        $.ajax({
            method: 'POST',
            url:'/api/login', 
            data: data,
            success: function(res){
				// alert('响应成功')
                // 登录失败
                if(res.status != 0){
                    return layer.msg(res.message);
                }
                layer.msg('登录成功！')
                // 将登录成功得到的token字符串保存至localStorage中
                localStorage.setItem('token', res.token)
                // console.log(res.token);
                // 跳到后台主页
                location.href = '/大事件项目/index.html'
            }
        })
        
        
    })
})

