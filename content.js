(async () => {
  const src = chrome.extension.getURL('lib/injector.js');
  const injector = await import(src);

  chrome.runtime.onMessage.addListener(
    request => {
      if (request.message === 'reload') {
        location.reload();
      }
    });

  chrome.storage.sync.get(({word, state}) => {
    if (!word || !state) {
      return;
    }
    const wordsCount = injector.injectWord(document.body, word);
    
    chrome.runtime.sendMessage({
      message: 'show-badge',
      data: {count: wordsCount},
    });
  })
})();
