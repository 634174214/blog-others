window.onload = function() {
    var style = document.createElement('style');
    var styleStr = `
        .md-toc{
            position: fixed!important;
            left: 0px;
            right: 83%;
            top: 0;
            bottom: 0;
            overflow-x: auto;
            font-size: 14px;
            margin-top: 0;
        }
        .md-toc-content{padding: 0 10px;}
        .md-toc-h3 .md-toc-inner{
            margin-left: 0em;
        }
        .md-toc-h4 .md-toc-inner{
            margin-left: 0em;
        }
        .md-toc-item{
            padding: 5px 0;
        }
        #write{
            max-width: 83%;
            margin: 0 0 0 17%;
        }
    `;
    style.innerHTML = styleStr;
    document.body.appendChild(style);
}