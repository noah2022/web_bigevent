$(function () {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage; 
    var q = {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
    };
    template.defaults.imports.dateFormat = function(date) {
        var dt = new Date(date);
        var y = dt.getFullYear();
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());
        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());
        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
    }
    
    //补零函数
    function padZero(n) {
        return n>9?n:'0'+n;
    }
    getArtlist();
    getCatelist();
    function getArtlist() { 
        $.ajax({
            type: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) { 
                if (res.status !== 0) { 
                    return layer.msg('获取文章列表失败');
                }
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
                renderPage(res.total);
            }
        });
    };
    function getCatelist() { 
        $.ajax({
            type: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类列表失败');
                }
                var htmlStr = template('tpl-select', res);
                $('[name=cate_id]').html(htmlStr);
                form.render('select');
            }
        });
    };
    $('#form-search').on('submit', function (e) {
        e.preventDefault();
        q.cate_id = $('[name=cate_id]').val();
        q.state = $('[name=state]').val();
        getArtlist();
    });
    // 渲染分页的方法
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox',
            count: total,
            limit: q.pagesize,
            curr: q.pagenum,
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2,3,5,10],
            jump: function (obj, first) { 
                q.pagenum = obj.curr;
                q.pagesize = obj.limit;
                if (!first) { 
                    getArtlist();
                }
            }
        });
    };
    // 文章删除按钮
    $('tbody').on('click', '.btn-del', function () { 
        var id = $(this).attr('data-id');
        var len = $('.btn-del').length;
        layer.confirm('is not?', {icon: 3, title:'提示'}, function(index){
            $.ajax({
                type: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) { 
                    if (res.status !== 0) {
                        return layer.msg('删除失败');
                    }
                    layer.msg('删除成功');
                    if (len === 1) { 
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }
                    getArtlist();
                    layer.close(index);
                }
            });
            
            
          });
        
    });
    $('tbody').on('click', '.btn-edit', function () {
        location.href = '/assets/css/article/art_edit.html?id=' + $(this).attr('data-id');
    });
})