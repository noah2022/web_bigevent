$(function () { 
    
    
    var layer = layui.layer;
    $('#btnLogout').on('click', function () { 
        layer.confirm('确定是否退出?', {icon: 3, title:'提示'}, function(index){
            //do something
            localStorage.removeItem('token');
            location.href = '/login.html';
            layer.close(index);
          });
    });
    getUserinfo();
})
function getUserinfo() { 
    $.ajax({
        type: 'GET',
        url: '/my/userinfo',
        
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg('用户信息获取失败');
            }
            renderAvatar(res.data);
        }
        
    })
};
function renderAvatar(user) { 
    //欢迎文字
    var uname = user.nickname || user.username;
    $('.welcome').html('欢迎&nbsp;&nbsp;' + uname);
    //渲染头像
    if (user.user_pic !== null) {
        $('.layui-nav-img').prop('src', user.user_pic).show();
        $('.text-avatar').hide();
    } else { 
        $('.layui-nav-img').hide();
        var first = uname[0].toUpperCase();
        $('.text-avatar').html(first).show();
    }
};