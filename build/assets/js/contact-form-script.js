//手机验证规则  
jQuery.validator.addMethod("mobile", function (value, element) {
    var mobile = /^1[3|4|5|7|8]\d{9}$/;
	return this.optional(element) || (mobile.test(value));
}, "手机格式不对");
var hasSubmited = false;

function foremError() {
    
}


$("#contactForm").validate({
    rules: {
        name: {
            required: true
        },
        phone: {
            required: true,
            mobile: true
        },
        subject: {
            required: true
        },
        message: {
            required: true
        }
    },
    messages: {
        name: {
            required: '抱歉，您的用户名称不能为空'
        },
        phone: {
            required: '抱歉，您的手机号码不能为空',
            mobile: '抱歉，您的手机号码格式不正确'
        },
        subject: {
            required: '抱歉，您的项目名称不能为空'
        },
        message: {
            required: '抱歉，您的项目描述不能为空'
        }
    },
    errorClass: 'help-block with-errors',
    submitHandler: function(form) {
        var serialize = $(form).serialize();
        var fromUrl = '&fromurl=' + window.location.href;
        if(hasSubmited) {
            alert('请不要重复提交表单');
            return false;
        }
        $('#msgSubmit').fadeIn();
        $('#cover').show();
        $.ajax({
            type: 'POST',
            url: 'http://build.wubin.work/server/form-process.php',
            data: serialize + fromUrl,
            dataType: 'json',
            success: function(res) {
                var msg = '';
                var cls = ''
                if(res.code == 0) {
                    msg = '恭喜您，信息提交成功，我们会尽快与您联系，请保持手机畅通';
                    cls = 'success';
                    btnmsg = '您的开发意向已提交';
                } else {
                    msg = res.msg;
                    cls = 'wrong';
                    btnmsg = '信息提交失败，请刷新页面重试l';
                }
                hasSubmited = true;
                setTimeout(function() {
                    $('#form-submit').attr('disabled', 'disabled').text(btnmsg);
                    $('#msgSubmit').addClass(cls).text(msg);
                    $('#cover').hide();
                }, 1000);
            },
            error: function() {
                hasSubmited = true;
                $('#form-submit').attr('disabled', 'disabled').text('信息提交遇到错误，请刷新重试');
                $('#msgSubmit').addClass('wrong').text('抱歉，您的信息提交失败，请刷新后重试。');
                $('#cover').hide();
            }
        });
        return false;
    }
});