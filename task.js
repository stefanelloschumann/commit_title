var link  = document.createElement('link');
link.rel  = 'stylesheet';
link.type = 'text/css';
link.href = 'https://code.jquery.com/ui/1.13.0/themes/base/jquery-ui.css';
link.media = 'all';

var head  = document.getElementsByTagName('head')[0];
head.appendChild(link);

let issue = window.location.href.split(/([0-9]{4,5})/)[1]

var iframe = document.createElement('iframe')
iframe.src = 'https://script.google.com/a/macros/schumann.com.br/s/AKfycbyozfcPm70FMkZ5RhHluoX2QgmqGeZJ2E3UFmU75RcSl82E3eobQGK3JRe99Df_x4Td/exec' + '?issue=' + issue
iframe.style = 'height: 100%; width: 100%; border: 0px'

var div = document.createElement('div')
div.id = '9381ccc9bdc24623b3d58941bc67df44'
div.appendChild(iframe)

var sidebar = document.getElementById('sidebar')
chrome.storage.sync.get(['height', 'width'], function(items){
    if (items.height == undefined)
        items.height = 800

    if (items.width == undefined)
        items.width = 350

    div.style = 'padding-top: 20px; height: ' + items.height + '; width: ' + items.width
    sidebar.insertBefore(div, sidebar.firstElementChild)
    $('#9381ccc9bdc24623b3d58941bc67df44').resizable({minHeight: 400, maxHeight: 1200, minWidth: 300, maxWidth: 400})
});

var doit;
function resizedw(div){chrome.storage.sync.set({'height': div.style.height, 'width': div.style.width}, function(){})}

div.onresize = function() {
    clearTimeout(doit);
    doit = setTimeout(function(){resizedw(div)}, 1000);
};