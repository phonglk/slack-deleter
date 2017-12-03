'use strict';
let appConfig = {
  slack: {
    channelId: void 0,
    channelName: void 0
  },
  currentTab: void 0,
  newTabIndex: void 0
};
addMultipleDelegatedEventListeners('body', 'keypress', function (a) {
  a.preventDefault(), 'r' === a.key.toLowerCase() && window.location.reload()
}), addMultipleDelegatedEventListeners('.menu .items .item', 'click', function (a, b) {
  let c, d = b.dataset.type,
    e = document.querySelectorAll('.menu .items .item'),
    f = document.querySelector('.menu .items .close'),
    g = document.querySelectorAll('.menu .contents .content'),
    h = document.querySelector('.menu .contents .content.' + d);
  for (a.preventDefault(), c = 0; c < e.length; c++) e[c].classList.remove('active');
  for (b.classList.add('active'), c = 0; c < g.length; c++) g[c].style.display = 'none';
  h.style.display = 'block', f.style.display = 'inline'
}), addMultipleDelegatedEventListeners('.menu .items .close', 'click', function (a, b) {
  let c, d = b.dataset.type,
    e = document.querySelectorAll('.menu .items .item'),
    f = document.querySelector('.menu .items .close'),
    g = document.querySelectorAll('.menu .contents .content');
  for (a.preventDefault(), c = 0; c < e.length; c++) e[c].classList.remove('active');
  for (c = 0; c < g.length; c++) g[c].style.display = 'none';
  f.style.display = 'none'
}), addMultipleDelegatedEventListeners('.menu .content.see-also a.external', 'click', function (a, b) {
  a.preventDefault();
  let c = b.getAttribute('href');
  chrome.tabs.create({
    url: c,
    index: appConfig.newTabIndex++,
    active: !1
  })
}), addMultipleDelegatedEventListeners('.js-app-delete-user:not(.is-running)', 'click', function (a, b) {
  if ((APP_TYPE === APP_TYPE_ADMIN && a.preventDefault(), !(APP_TYPE === APP_TYPE_BASIC && b.classList.contains('js-app-delete-user-all'))) && b.classList.contains('is-active')) {
    b.classList.add('is-running'), b.querySelector('.app-button__title').textContent = 'Deleting messages', b.querySelector('.app-button__info').textContent = 'please wait...';
    var c;
    b.classList.contains('js-app-delete-user-this') 
      ? c = 'js/inject-02-page-01-1-user-current.js' 
      : b.classList.contains('js-app-delete-user-all') && (c = 'js/inject-02-page-01-0-user-all.js'), chrome.tabs.executeScript(null, {
      file: c
    }, function () {
      chrome.runtime.lastError ? (renderEror('Error occured', chrome.runtime.lastError.message), dce(chrome.runtime.lastError)) : chrome.tabs.executeScript(null, {
        file: 'js/inject-02-page-02-injector.js'
      }, function () {
        chrome.runtime.lastError && (renderEror('Error occured', chrome.runtime.lastError.message), dce(chrome.runtime.lastError))
      })
    })
  }
});
let initUI = function () {
    document.title = APP_NAME;
    for (let a of document.querySelectorAll('.js-app-name')) a.textContent = APP_NAME;
    for (let a of document.querySelectorAll('.js-app-url-support')) a.setAttribute('href', APP_URL_SUPPORT);
    for (let a of document.querySelectorAll('.js-app-url-reviews')) a.setAttribute('href', APP_URL_REVIEWS);
    for (let a of document.querySelectorAll('.js-link-ps')) a.setAttribute('href', FOOTER_URL_PS);
    for (let a of document.querySelectorAll('.js-img-icon')) a.setAttribute('src', APP_ICON);
    dcl('UI inited')
  },
  renderUI = function () {
    document.querySelector('.js-app-item__url-current-placeholder').textContent = '';
    for (let a of document.querySelectorAll('.js-app-item__url-current')) a.textContent = appConfig.currentTab.url, a.setAttribute('href', appConfig.currentTab.url), a.setAttribute('title', appConfig.currentTab.url);
    appConfig.currentTab.url.match(/https:\/\/.*\.slack\.com\//) ? querySlack() : renderEror('Please go to some Slack channel or direct message', '(URL: YOUR-TEAM-ID.slack.com)'), dcl('UI rendered')
  },
  updateUI = function () {
    document.querySelector('.js-app-item__channel-name').textContent = appConfig.slack.channelName, document.querySelector('.js-app-item__channel-id').textContent = appConfig.slack.channelId, dcl('UI updated')
  },
  renderEror = function (a, b) {
    document.querySelector('.js-error-title').textContent = a, document.querySelector('.js-error-message').textContent = b, document.querySelector('.js-error').classList.add('is-active'), dcl('Error rendered')
  },
  querySlack = function () {
    chrome.tabs.executeScript(null, {
      file: 'js/inject-01-popup-01-injector.js'
    }, function (a) {
      if (chrome.runtime.lastError) renderEror('Error occured', chrome.runtime.lastError.message), dce(chrome.runtime.lastError);
      else {
        let b = a[0];
        b && b.channelName ? (document.querySelectorAll('.js-app-delete-user').forEach((a) => a.classList.add('is-active')), appConfig.slack.channelName = b.channelName, appConfig.slack.channelId = b.channelId, updateUI()) : renderEror('This Slack page isn\'t channel page neither direct message page', '')
      }
    })
  };
chrome.tabs.query({
  currentWindow: !0,
  active: !0
}, function (a) {
  appConfig.currentTab = a[0], appConfig.newTabIndex = appConfig.currentTab.index + 1, dcl('Current tabID: ' + appConfig.currentTab.id), initUI(), renderUI()
});