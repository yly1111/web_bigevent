$(function(){
    var form = layui.form;
    form.verify({
        pwd: [
            /^[\S]{6,12}$/
            ,'密码必须6到12位，且不能出现空格'
        ],

        repwd: function(value) {
            if(value != $('[name = newPwd]').val()){
                return '两次密码不一致'
            }
        }
    })

    $('.layui-form').on('submit', function(e) {
        // 阻止表单默认提交事件
        e.preventDefault();

        let data = $(this).serialize();
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: data,
            success: function(res) {
                if(res.status !== 0) {
                    return layui.layer.msg('重置密码失败！')
                }
                layui.layer.msg(res.message)
                // 重置表单
                $('.layui-form')[0].reset()
            }
        })
    })

    // $('#btnReset').click(function(e) {
    //     // 阻止默认清零
    //     e.preventDefault();

    //     layui.layer.confirm('确定要重置吗', function(index) {

    //         layui.layer.close(index);
    //     })
    // })
})

