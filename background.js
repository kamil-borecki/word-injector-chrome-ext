(() => {

  let currentTabId;

  chrome.tabs.onActivated.addListener(({tabId}) => {
    currentTabId = tabId;
    reload();
  });

  chrome.runtime.onMessage.addListener(
    (request) => {
      const {message, data} = request;

      switch (message) {

        case 'word-changed':
          const {word} = data;
          chrome.storage.sync.set({word}, () => {
            reload();
            chrome.runtime.sendMessage({
              message: 'new-word',
              data: {word},
            });
          });
          break;
        case 'state-changed':
          const {state} = data;
          chrome.storage.sync.set({state}, () => {
            reload();
            chrome.runtime.sendMessage({
              message: 'new-state',
              data: {state},
            });
          });
          break;
        case 'show-badge':
          const {count} = data;
          showBadge(count);
          break;
      }
    });

  function reload() {
    showBadge(0);
    chrome.tabs.sendMessage(currentTabId, {message: 'reload'});
  }

  function showBadge(count) {
    let text = '';
    if (count !== 0) {
      text = count > 999 ? `999+` : count.toString();
    }
    chrome.browserAction.setBadgeBackgroundColor({color: '#ff4555'});
    chrome.browserAction.setBadgeText({text});
  }
})();
