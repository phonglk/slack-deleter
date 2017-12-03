import { $$, $, E, T } from '../utils/dom';
// import PanelMessage from './panel';
// import { render } from 'react-dom';

const CLS_MARKED_FOR_DELETE = 'marked-for-delete';
const ERROR_RATE_LIMITED = 'ratelimited';
const REQUEST_RATE_LIMITING = 2;
let TIMEOUT_REQUEST = 1000;

const state = {
  isLoadingMore: false,
  count: {
    total: 0,
    requesting: 0,
    error: 0,
    done: 0,
  },
};

const $messages = $$('#msgs_div ts-message');

const apiVersionId = TS.boot_data.version_uid.substr(0, 8);

function deleteMessage($message, queue) {
  const rndBoundary =
    Math.random()
      .toString(32)
      .substr(-8) +
    Math.random()
      .toString(32)
      .substr(-8);

  const xhrFormBoundary = '----WebKitFormBoundary' + rndBoundary;
  const xId = `${apiVersionId}-${Date.now() / 1e3}`;

  if (!$message) return Promise.resolve(false);

  const { modelObId, ts } = $message.dataset;

  const payload = [
    `--${xhrFormBoundary}`,
    'Content-Disposition: form-data; name="channel"',
    '',
    modelObId,
    `--${xhrFormBoundary}`,
    'Content-Disposition: form-data; name="ts"',
    '',
    ts,
    `--${xhrFormBoundary}`,
    'Content-Disposition: form-data; name="token"',
    '',
    TS.boot_data.api_token,
    `--${xhrFormBoundary}--`,
  ].join('\n');

  const url = `/api/chat.delete?_x_id=${xId}`;

  const headers = new Headers({
    'Content-type': `multipart/form-data; boundary=${xhrFormBoundary}`,
    Origin: document.location.origin,
  });

  state.count.requesting++;

  return fetch(url, {
    credentials: 'include',
    method: 'POST',
    headers,
    body: payload,
  })
    .then(resp => resp.json())
    .then(json => {
      state.count.requesting--;
      state.count.done++;
      onRequestDone();
      if (json.ok === true) {
        return true;
      } else {
        if (ERROR_RATE_LIMITED === json.error) {
          TIMEOUT_REQUEST = 5000;
          queue.unshift($message);
        }
        return false;
      }
    })
    .catch(e => {
      state.count.requesting--;
      state.count.error++;
      onRequestDone();
      console.error(e);
      return false;
    });
}

function onRequestDone() {
  if (state.count.requesting === 0) {
    setTimeout(() => {
      TIMEOUT_REQUEST = 1000;
    }, 2000); // reset
  }
}

function hasMoreMassage() {
  return (
    document
      .querySelector('#end_display_status')
      .textContent.trim()
      .indexOf('And more') > -1
  );
}

function collect$Messages(queue) {
  const $messages = $$(`#msgs_div ts-message:not(.${CLS_MARKED_FOR_DELETE})`);
  const tmpQueue = [];

  $messages.forEach($message => {
    $message.classList.add(CLS_MARKED_FOR_DELETE);
    tmpQueue.push($message);
  });

  tmpQueue.reverse().forEach($message => queue.push($message));

  state.count.total += tmpQueue.length;
}

function getLatest(queue, num = 5) {
  if (num <= 0) return [];

  const q = [];

  for (let i = 0; i < Math.min(num, queue.length); i++) {
    q.push(queue.shift());
  }

  return q;
}

function deleteAll() {
  const queue = [];
  let hasMore = true;

  const collectAndCheck = () => {
    collect$Messages(queue);

    getLatest(queue, REQUEST_RATE_LIMITING - state.count.requesting).forEach($message =>
      deleteMessage($message, queue)
    );

    console.log(JSON.stringify(state));

    const messageCount = document.querySelectorAll('#msgs_div ts-message').length;

    if (queue.length <= 8 && messageCount > 0) {
      state.isLoadingMore = true;
      TS.client.ui.doLoadScrollBackHistory(true);
    } else {
      state.isLoadingMore = false;
    }

    if (queue.length > 0 || hasMoreMassage() || state.isLoadingMore === true) {
      setTimeout(collectAndCheck, TIMEOUT_REQUEST);
    }
  };
  collectAndCheck();
}

// function attachPanel() {
//   const $container = E('div', 'slack-deleter-message-container')
//   document.body.appendChild($container);
//   render(<PanelMessage />, $container);
// }

deleteAll();
