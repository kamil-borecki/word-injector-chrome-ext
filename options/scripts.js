(() => {
  let wordInput;
  let stateInput;

  $(document).ready(() => {
    init();
  });


  function init() {
    const form = $('#form').first();
    wordInput = $('#word-input').first();
    stateInput = $('#state-input').first();

    getWordFromStorage();
    getStateFromStorage();

    form.on('submit', e => {
      e.preventDefault();
      const word = wordInput.val();
      chrome.runtime.sendMessage({
        message: 'word-changed',
        data: {word},
      });
    });

    stateInput.on('change', e => {
      const state = e.currentTarget.checked;
      chrome.runtime.sendMessage({
        message: 'state-changed',
        data: {state},
      });
    });

    chrome.runtime.onMessage.addListener(
      request => {
        const {message} = request;
        switch (message) {
          case 'new-word':
            getWordFromStorage();
            break;
          case 'new-state':
            getStateFromStorage();
            break;
        }
      })
  }

  function getWordFromStorage() {
    chrome.storage.sync.get(({word}) => {
      wordInput.val(word || '');
    });
  }

  function getStateFromStorage() {
    chrome.storage.sync.get(({state}) => {
      stateInput.prop('checked', !!state);
      $('.switch-input').show();
    });
  }


})();
