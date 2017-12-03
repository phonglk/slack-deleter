var bootdata = {},
  channelNameEl = document.querySelector('#channel_name'),
  channelName = channelNameEl ? channelNameEl.textContent.trim() : '';
bootdata.channelName = channelName;
var channelIdEl = document.querySelector('button[data-channel-id]'),
  channelId = channelIdEl ? channelIdEl.dataset.channelId : null,
  imIdEl = document.querySelector('button[data-im-id]'),
  imId = imIdEl ? imIdEl.dataset.imId : null;
bootdata.channelId = channelId || imId, bootdata;