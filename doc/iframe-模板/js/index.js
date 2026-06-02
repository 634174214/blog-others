 $('#left-list').on('click', 'li', function() {
            $(this).siblings().removeClass('active');
            $(this).addClass('active');
        });

$('#m-menu-btn').on('click', function() {
    var isShow = $('#left').is(':visible');
    console.log(isShow, $('#left'))
    if (isShow) {
        $('#left').fadeOut();
        $(this).removeClass('close').addClass('open');
    } else {
        $('#left').fadeIn();
        $(this).removeClass('open').addClass('close');
    }
});