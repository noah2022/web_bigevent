$(function () { 
  // 点击去注册账号的链接
  $('#link_reg').on('click', function () {
    $('.reg_box').show();
    $('.login_box').hide();
  });
  // 点击去登录的链接
  $('#link_login').on('click', function () {
    $('.reg_box').hide();
    $('.login_box').show();
  });
  // 自定义校验规则
  var form = layui.form;
  var layer = layui.layer;
  form.verify({
    pwd: [/^[\S]{6,12}$/
      , '密码必须6到12位，且不能出现空格'],
    repwd: function (value) {
      var pwd = $('.reg_box [name=password]').val();
      if (pwd !== value) {
        return '两次密码不一致'
      }
    }
  });
  // 监听注册提交事件
  $('#form_reg').on('submit', function (e) { 
    e.preventDefault();
    $.post('/api/reguser', { username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val() }, function (res) { 
      if (res.status !== 0) { 
        return layer.msg(res.message);
      }
      layer.msg(res.message);
      $('#link_login').click();
    })
  });
  // 监听登录提交事件
  $('#form_login').on('submit', function (e) { 
    e.preventDefault();
    $.ajax({
      type: 'POST',
      url: '/api/login',
      data: $(this).serialize(),
      success: function (res) { 
        if (res.status !== 0) { 
          return layer.msg('登录失败');
        }
        layer.msg(res.message);
        localStorage.setItem('token', res.token);
        location.href = '/index.html';
      }

    });
  });
})
