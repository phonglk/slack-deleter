var el = document.createElement('script');
el.type = 'text/javascript';
el.src = chrome.extension.getURL('content.js');
document.querySelector('body').appendChild(el);