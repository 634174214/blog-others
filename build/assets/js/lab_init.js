var basePath = 'assets/js/';
var path = islocal ? basePath : baseJsPath + basePath;

$LAB
.script(path + 'jquery-min.js').wait()
.script(path + "popper.min.js").wait()
.script(path + "bootstrap.min.js").wait()
.script(path + "owl.carousel.min.js").wait()
.script(path + "jquery.mixitup.js").wait()
.script(path + "particles.min.js").wait()
.script(path + "wow.js").wait()
.script(path + "jquery.nav.js").wait()
.script(path + "scrolling-nav.js").wait()
.script(path + "jquery.easing.min.js").wait()
.script(path + "jquery.counterup.min.js").wait()
.script(path + "nivo-lightbox.js").wait()
.script(path + "jquery.magnific-popup.min.js").wait()
.script(path + "waypoints.min.js").wait()
.script(path + "jquery.slicknav.js").wait()
.script(path + "main.js?t="+ timestamp).wait()
.script(path + "jquery.validate.js").wait()
.script(path + "contact-form-script.js?t=" + timestamp);
