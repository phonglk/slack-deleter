let smdConfig = {
  userId: boot_data.user_id,
  apiToken: boot_data.api_token,
  apiVersionId: boot_data.version_uid.substr(0, 8),
  channelName: document.querySelector('#channel_name').textContent.trim(),
  messageDeletedClass: 'is-deleted',
  messageDeletedBySlackClass: 'deleted',
  messageScrollerEl: document.querySelector('#msgs_scroller_div'),
  messageAllCountLast: 0,
  messageUserCountLast: 0,
  firstRun: !0,
  xhrFormBoundary: '----WebKitFormBoundaryPh1uFFprSVZNhfCf'
};
smdConfig.messageAllSelector = `#msgs_div ts-message`
smdConfig.messageUserAllSelector = `#msgs_div ts-message:not(.ephemeral):not(.${smdConfig.messageDeletedClass}):not(.${smdConfig.messageDeletedBySlackClass})`, smdConfig.messageUserCurrentSelector = `#msgs_div ts-message[data-member-id="${smdConfig.userId}"]:not(.automated):not(.${smdConfig.messageDeletedClass}):not(.${smdConfig.messageDeletedBySlackClass})`;
const ACTION_DELAY = 1e3;
(function () {
  function a() {
    setTimeout(function () {
      b()
    }, ACTION_DELAY)
  }

  function b() {
    if (!c()) return alert(`There was an ongoing delete operation in channel "${smdConfig.channelName}" however You navigated to channel "${channelName}". Stopping everything now.`), !1;
    let b = document.querySelectorAll(smdConfig.messageAllSelector).length,
      f = document.querySelector('body').dataset.mdsaction,
      g = [];
    'user-this' === f ? g = document.querySelectorAll(smdConfig.messageUserCurrentSelector) : 'user-all' === f && (g = document.querySelectorAll(smdConfig.messageUserAllSelector));
    let h = g.length;
    if (!(0 === h)) e(g[g.length - 1], function () {
      a()
    });
    else if (!smdConfig.firstRun && b === smdConfig.messageAllCountLast) {
      let a = confirm('Messages deleted. Reload the page to see the changes?');
      a && window.location.reload()
    } else d(function () {
      a()
    }, function () {
      let a = confirm('Congratulations, messages deleted!\nPlease reload the page and check it yourself. Reload?');
      a && window.location.reload()
    });
    smdConfig.firstRun = !1, smdConfig.messageAllCountLast = b
  }

  function c() {
    let a = document.querySelector('#channel_name').textContent.trim();
    return a === smdConfig.channelName
  }

  function d(a, b) {
    let c = document.querySelectorAll(smdConfig.messageAllSelector).length;
    TS.client.ui.doLoadScrollBackHistory(!0), smdConfig.messageScrollerEl.scrollTop = 0;
    let d = 0,
      e = setInterval(function () {
        d++;
        let f = document.querySelectorAll(smdConfig.messageAllSelector).length;
        f !== c && (clearInterval(e), a()), d >= 5 && (clearInterval(e), b())
      }, 1e3)
  }

  function e(a, b) {
    let c = a.getAttribute('id'),
      d = a.dataset.ts,
      e = a.dataset.modelObId,
      f = new XMLHttpRequest,
      g = `${smdConfig.apiVersionId}-${Date.now()/1e3}`;
    f.open('POST', 
      `/api/chat.delete?_x_id=${g}`, !0)
    , f.setRequestHeader('Content-type', 'multipart/form-data; boundary=' + smdConfig.xhrFormBoundary);
    let h = [
      `--${smdConfig.xhrFormBoundary}`,
      'Content-Disposition: form-data; name="channel"',
      '',
      e, `--${smdConfig.xhrFormBoundary}`,
      'Content-Disposition: form-data; name="ts"',
      '', d, `--${smdConfig.xhrFormBoundary}`,
      'Content-Disposition: form-data; name="token"',
      '', smdConfig.apiToken, `--${smdConfig.xhrFormBoundary}--`],
      i = h.join('\n');
    f.onreadystatechange = function () {
      4 == f.readyState && 200 == f.status && (a.style.opacity = 0.5, a.style.backgroundColor = '#ff8888', a.classList.add(smdConfig.messageDeletedClass), b())
    }, f.send(i)
  }
  smdConfig.messageAllCountLast = document.querySelectorAll(smdConfig.messageAllSelector).length, b()
})();