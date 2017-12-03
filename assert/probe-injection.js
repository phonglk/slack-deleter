(() => {
  const state = {};
  const chnEl = document.querySelector('#channel_name');
  const channelName = chnEl ? chnEl.textContent.trim() : '';

  const chiEl = document.querySelector('button[data-channel-id]');
  let channelId = chiEl ? chiEl.dataset.channelId : null;

  const imIdEl = document.querySelector('button[data-im-id]');
  const imId = imIdEl ? imIdEl.dataset.imId : null;
  channelId = channelId || imId;
  Object.assign(state, {
    channelName,
    channelId
  });
  return state;
})();