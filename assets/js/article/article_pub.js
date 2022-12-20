$(function () {

    var form = layui.form;
    initCate();
    // 初始化富文本编辑器
    initEditor();

    // 定义加载文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg('初始化文章分类失败')
                }
                layui.layer.msg(res.message);
                // 调用模板引擎，渲染下拉菜单
                let htmlStr = template('tpl-cate', res);
                $('[name=cate_id').html(htmlStr);
                // 更新表单渲染
                form.render();
            }
        })
    }

    // 实现基本裁剪效果
    // 1. 初始化图片裁剪器
    var $image = $('#image');

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 200,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options);

    // 为选择文件按钮绑定点击事件
    $('#btnChooseImage').click(function (e) {
        $('#coverFile').click();
    })

    // 为文件选择框绑定change事件
    $('#coverFile').change(function (e) {
        console.log(e);
        if (e.target.files.length === 0) {
            return layui.layer.msg('请选择照片');
        }
        // 拿到用户选择的文件
        let file = e.target.files[0];
        // 将文件转换成路径
        let newImgURL = URL.createObjectURL(file);
        // 重新初始化裁剪区域
        $image.cropper('destroy').attr('src', newImgURL).cropper(options);

    })


    // 定义文章的发布状态
    var art_state = '已发布';

    // 为存为草稿按钮绑定点击事件处理函数
    $('#btnSave2').on('click', function (e) {
        art_state = '草稿';
    })


    // 为表单绑定submit提交事件
    $('#form-pub').on('submit', function (e) {
        // 1. 组织表单的默认提交行为
        e.preventDefault();
        // 2. 基于form表单快速创建一个FormData对象
        let fd = new FormData($(this)[0]);
        // 3. 将文章的发布状态存到fd中
        fd.append('state', art_state);

        // 4. 将封面裁剪过后的图片，输出为一个文件对象
        $image.cropper('getCroppedCanvas', { // 创建一个Canvas画布
            width: 400,
            height: 280
        }).toBlob(function (blob) { // 将Canvas画布上的内容转化为文件对象
            // 得到文件对象后，进行后续的操作
            // 5. 将文件对象存储到append中
            fd.append('cover_img', blob)
            
            // 6. 发起ajax数据请求
            publishArticle(fd);
            console.log(111);

        })

        // fd.forEach((value, key) => {
        //     console.log(value+' '+key);
        // })     
    })

    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 注意：如果向服务器提交的时FormData格式的数据必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg('发布文章失败')
                }
                layui.layer.msg(res.message);
                // 发布文章成功后跳转到文章列表界面
                location.href='../article/article_list.html'
            }
        })
    }
})