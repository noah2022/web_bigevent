$(function () {
    var id = new URLSearchParams(location.search).get('id');
    var layer = layui.layer;
    var form = layui.form;
    getCate();
    
    function getCate() {
        $.ajax({
            type: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类列表失败');
                }
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                form.render('select');
                getData();
            }
        });
    };
     
   
    
       
    function getData() {
        $.ajax({
            type: 'GET',
            url: '/my/article/' + id,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章失败');
                }
                var art = res.data;
                form.val("form_pub", {
                    Id: art.Id,
                    title: art.title,
                    cate_id: art.cate_id,
                    content: art.content
                }
                );
                // 初始化富文本编辑器
                initEditor();
                // 1. 初始化图片裁剪器
                var $image = $('#image');
                $image.attr('src', 'http://ajax.frontend.itheima.net' + art.cover_img);
  
                // 2. 裁剪选项
                var options = {
                    aspectRatio: 400 / 280,
                    preview: '.img-preview'
                };
    
                // 3. 初始化裁剪区域
                $image.cropper(options);
                
            }
        });
    };
    $('#btnChooseImg').on('click', function () {
        $('#file').click();
    });
    $('#file').on('change', function (e) {

        var filelist = e.target.files;
        if (filelist.length === 0) {
            return layer.msg('请选择照片');
        }
        var file = filelist[0];
        var newImgURL = URL.createObjectURL(file);
        $('#image')
            .cropper('destroy')      // 销毁旧的裁剪区域
            .prop('src', newImgURL)  // 重新设置图片路径
            .cropper({
                aspectRatio: 400 / 280,
                preview: '.img-preview'
            })        // 重新初始化裁剪区域
    });

    var art_state = '已发布';
    $('#btnSave').on('click', function () {
        art_state = '草稿';
    });
    $('#form_pub').on('submit', function (e) {
        e.preventDefault();
        var fd = new FormData($(this)[0]);
        fd.append('state', art_state);
        $('#image')
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob);
                $.ajax({
                    type: 'POST',
                    url: '/my/article/edit',
                    data: fd,
                    contentType: false,
                    processData: false,
                    success: function (res) {
                        if (res.status !== 0) {
                            return layer.msg('发布文章失败');
                        }
                        layer.msg('发布文章成功');
                        location.href = '/article/art_list.html';
                    }
                });
            })
    });
})