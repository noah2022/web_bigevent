$(function () { 
    var layer = layui.layer;
    var form = layui.form;
    function getArtCateList() {
        $.ajax({
            type: 'GET',
            url: '/my/article/cates',
            success: function (res) { 
                if (res.status !== 0) {
                    return layui.layer.msg('文章分类列表获取失败');
                }
                var htmlStr = template('tpl-user', res);
                $('tbody').html(htmlStr);
            }
        });
    };
    getArtCateList();
    var indexAdd = null;
    $('#btnAddCate').on('click', function () { 
        indexAdd = layer.open({
            type: 1,
            title: '添加文章分类',
            area: ['500px','250px'],
            content: $('#form-add').html()
          }); 
    });
    $('body').on('submit', '#addForm', function (e) { 
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) { 
                    return layer.msg('新增文章分类失败');
                }
                getArtCateList();
                layer.msg('新增文章分类成功');
                layer.close(indexAdd);
            }
        });
    });
    var indexEdit = null;
    $('tbody').on('click', '.btn-edit', function () { 
        indexEdit = layer.open({
            type: 1,
            title: '修改文章分类',
            area: ['500px','250px'],
            content: $('#form-edit').html()
        });
        var id = $(this).attr('data-id');
        $.ajax({
            type: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                if (res.status !== 0) { 
                    return layer.msg('获取文章分类数据失败');
                }
                form.val('form-edit', res.data);
            }
        });
    });
    $('body').on('submit', '#editForm', function (e) { 
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类信息失败');
                }
                layer.msg('更新分类信息成功');
                layer.close(indexEdit);
                getArtCateList();
            }
        });
    });
    $('tbody').on('click', '.btn-del', function () { 
        var id = $(this).attr('data-id');
        layer.confirm('确定删除?', {icon: 3, title:'提示'}, function(index){
            $.ajax({
                type: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) { 
                    if (res.status !== 0) { 
                        return layer.msg('删除文章分类失败');
                    }
                    layer.msg('删除文章分类成功');
                    layer.close(index);
                    getArtCateList();
                }
            });
            
            
          });
    });
})