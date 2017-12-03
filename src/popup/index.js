import { $, T, E, replace } from '../utils/dom';

const btnDeleteAll = $('#delete-all');
const updateStatus = text => replace($('#status'), E('div', '', T(text)));

function activateDeleteMessageOnTab(tab) {
  if (tab.url.match(/https:\/\/.*\.slack\.com\//)) {
    updateStatus('Activated');
    chrome.tabs.executeScript(
      null,
      {
        file: 'assert/pre-injection.js',
      },
      resps => {
        if (chrome.runtime.lastError) {
          updateStatus(`Error while trying to execute script: ${chrome.runtime.lastError.message}`);
        }
      }
    );
  } else {
    updateStatus('NO Slack Workspace is detected');
  }
}

function activateDeleteMessage() {
  chrome.tabs.query(
    {
      currentWindow: true,
      active: true,
    },
    function(tabs) {
      activateDeleteMessageOnTab(tabs[0]);
    }
  );
}

btnDeleteAll.addEventListener('click', activateDeleteMessage);

function probeTab(tab) {
  if (tab.url.match(/https:\/\/.*\.slack\.com\//)) {
    chrome.tabs.executeScript(
      null,
      {
        file: 'assert/probe-injection.js',
      },
      resps => {
        const state = resps[0];
        if (chrome.runtime.lastError) {
          updateStatus(`Error: ${chrome.runtime.lastError.message}`);
        } else if (state) {
          if (state && !state.channelName) {
            updateStatus('The current tab must be channel or direct message for deleting messages');
          } else {
            updateStatus(`Current channel: ${state.channelName}`);
            btnDeleteAll.removeAttribute('disabled');
          }
        } else {
          updateStatus('Unexpected Eroor: state is null');
        }
      }
    );
  } else {
    updateStatus('NO Slack Workspace is detected');
  }
}

chrome.tabs.query(
  {
    currentWindow: true,
    active: true,
  },
  function(tabs) {
    probeTab(tabs[0]);
  }
);
