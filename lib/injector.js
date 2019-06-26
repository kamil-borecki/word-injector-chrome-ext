export function injectWord(element, word) {
  const nodes = getTextNodes(element);
  let wordsCount = 0;
  for (const node of nodes) {
    let {data} = node;
    const random = (Math.floor(Math.random() * (6 - 3)) + 3);
    const wordsArray = data.split(' ');
    let worthWordsIndexes = wordsArray.reduce((array, currentWord, index) => {
      if (currentWord.length > random) {
        array.push(index);
      }
      return array;
    }, []);

    if (worthWordsIndexes.length === 0) {
      continue;
    }
    worthWordsIndexes = worthWordsIndexes.reduce((array, current) => {
      const length = array.length;
      if (length > 0) {
        const lastIndex = array[length - 1];
        if ((current - lastIndex) > random) {
          array.push(current);
        }
      } else {
        array.push(current);
      }
      return array;
    }, []);
    worthWordsIndexes.forEach(index => {
      wordsArray[index] = word;
    });
    wordsCount += worthWordsIndexes.length;
    node.data = wordsArray.join(' ');
  }
  return wordsCount;

}

export function getTextNodes(element) {
  let textNodes = [];
  for (const node of element.childNodes) {
    if (node.nodeType === 3) {
      textNodes.push(node)
    } else if (node.nodeType === 1 && !['SCRIPT', 'STYLE'].includes(node.nodeName)) {
      textNodes = [...textNodes, ...getTextNodes(node)]
    }
  }
  return textNodes.filter(textNode => {
    return textNode.data.split(' ').length > 5;
  });
}
