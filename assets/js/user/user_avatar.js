$(function(){
    var $image = $('#image');
    // 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 创造裁剪区域
    $image.cropper(options)

    $('#btnChooseImage').click(function(e) {
        $('#file').click()
        
        // console.log($('#file'));
        // $image[0].src = $('#file').files[0].name
    })

    // 为文件选择框绑定change事件
    $('#file').change(function(e){
        console.log(e.target.files[0]);
        // 判断是否选择图片
        if(e.target.files.length === 0) {
            return layui.layer.msg('请选择照片')
        }
        // 1. 拿到用户选择的文件
        var file = e.target.files[0]
        // 2. 将文件转换为路径
        var newImgURL = URL.createObjectURL(file)
        // 3. 重新初始化裁剪区域
        // 销毁旧的裁剪区域 重新设置图片路径 重新初始化裁剪区域
        $image.cropper('destroy').attr('src', newImgURL).cropper(options)
        // layui.layer.msg('选择照片')
        // $image[0].src = e.target.files[0].name
    })


    $('#btnUpload').click(function(e) {
        // 1. 拿到用户裁剪之后的头像
        var dataURL = $image.cropper('getCroppedCanvas', {
            // 创建一个Canvas画布
            width: 100,
            height: 100
        }).toDataURL('image/png')  // 将画布上的内容,转化为base64格式的字符串 base64相较于url路径形式的优点:减少一些不必要的图片请求
        // 2. 调用接口, 把头像上传到服务器
        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg('更新头像失败');
                }
                layui.layer.msg(res.message)
                window.parent.getUserInfo()
            }
        })
    })
})