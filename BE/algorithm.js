function buildFrequencyTable(text) {
  const frequencyTable = {};
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (frequencyTable[char]) {
      frequencyTable[char]++;
    } else {
      frequencyTable[char] = 1;
    }
  }
  return frequencyTable;
}

function buildHuffmanTree(frequencyTable) {
  const nodes = [];
  for (let char in frequencyTable) {
    nodes.push({ char, freq: frequencyTable[char] });
  }
  while (nodes.length > 1) {
    nodes.sort((a, b) => a.freq - b.freq);
    const left = nodes.shift();
    const right = nodes.shift();
    const merged = {
      char: null,
      freq: left.freq + right.freq,
      left,
      right,
    };
    nodes.push(merged);
  }
  return nodes[0];
}

function buildHuffmanCodes(node, currentCode, huffmanCodes) {
  if (!node.left && !node.right) {
    huffmanCodes[node.char] = currentCode;
    return;
  }
  buildHuffmanCodes(node.left, currentCode + '0', huffmanCodes);
  buildHuffmanCodes(node.right, currentCode + '1', huffmanCodes);
}

function convertHuffmanTreeToJSON(node) {
  if (!node.left && !node.right) {
    return {
      char: node.char,
      freq: node.freq,
    };
  }
  return {
    freq: node.freq,
    left: convertHuffmanTreeToJSON(node.left),
    right: convertHuffmanTreeToJSON(node.right),
  };
}

function convertJSONToHuffmanTree(jsonTree) {
  if (!jsonTree.left && !jsonTree.right) {
    return {
      char: jsonTree.char,
      freq: jsonTree.freq,
    };
  }
  return {
    freq: jsonTree.freq,
    left: convertJSONToHuffmanTree(jsonTree.left),
    right: convertJSONToHuffmanTree(jsonTree.right),
  };
}

function huffmanCompress(text) {
  const frequencyTable = buildFrequencyTable(text);
  const huffmanTree = buildHuffmanTree(frequencyTable);
  const huffmanCodes = {};
  buildHuffmanCodes(huffmanTree, '', huffmanCodes);
  let compressedText = '';
  for (let i = 0; i < text.length; i++) {
    compressedText += huffmanCodes[text[i]];
  }
  return compressedText;
}

function huffmanDecompress(compressedText, huffmanTree) {
  console.log('asas')
  console.log(huffmanTree)
  let decompressedText = '';
  let currentNode = huffmanTree;
  for (let i = 0; i < compressedText.length; i++) {
    if (compressedText[i] === '0') {
      currentNode = currentNode.left;
    } else {
      currentNode = currentNode.right;
    }
    if (!currentNode.left && !currentNode.right) {
      decompressedText += currentNode.char;
      currentNode = huffmanTree;
    }
  }
  return decompressedText;
}

function encodeRLE(input) {
    /* Perform run-length encoding */
    let encoded = '';
    let count = 1;
  
    for (let i = 1; i <= input.length; i++) {
      if (input[i] !== input[i - 1]) {
        encoded += count + input[i - 1];
        count = 1;
      } else {
        count++;
      }
    }
  
    return encoded;
  }
  
  function decodeRLE(input) {
    /* Perform run-length decoding */
    let decoded = '';
  
    for (let i = 0; i < input.length; i += 2) {
      const count = Number(input[i]);
      const char = input[i + 1];
  
      decoded += char.repeat(count);
    }
  
    return decoded;
  }  

function compress(data){
    /* Perform compression with LZW algorithm */
    let dictionary = {};
    let nextCode = 256;
    let currentSequence = "";
    let result = [];

    for (let i = 0; i < 256; i++) {
    dictionary[String.fromCharCode(i)] = i;
    }

    for (let i = 0; i < data.length; i++) {
    let char = data[i];
    let sequence = currentSequence + char;

    if (dictionary.hasOwnProperty(sequence)) {
        currentSequence = sequence;
    } else {
        result.push(dictionary[currentSequence]);
        dictionary[sequence] = nextCode;
        nextCode++;
        currentSequence = char;
    }
    }

    result.push(dictionary[currentSequence]);
    let binaryResult = result.map(code => code.toString(2).padStart(8, '0')).join(" ");
    return binaryResult;
}

function decompress(data){
    /* Perform decompression with LZW algorithm */
    let dictionary = {};
    let nextCode = 256;
    let codes = data.split(" ").map(code => parseInt(code, 2));
    let result = [];
    let previousCode = codes[0];

    for (let i = 0; i < 256; i++) {
    dictionary[i] = String.fromCharCode(i);
    }

    result.push(dictionary[previousCode]);

    for (let i = 1; i < codes.length; i++) {
    let code = codes[i];

    let entry;
    if (dictionary.hasOwnProperty(code)) {
        entry = dictionary[code];
    } else if (code === nextCode) {
        entry = dictionary[previousCode] + dictionary[previousCode][0];
    } else {
        throw new Error("Invalid compressed data");
    }

    result.push(entry);
    dictionary[nextCode] = dictionary[previousCode] + entry[0];
    nextCode++;
    previousCode = code;
    }

    return result.join("");
}




module.exports = {compress,decompress,encodeRLE,decodeRLE,huffmanCompress,huffmanDecompress,convertHuffmanTreeToJSON,convertJSONToHuffmanTree,convertHuffmanTreeToJSON,buildFrequencyTable,buildHuffmanTree,buildHuffmanCodes}