function readPage(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => resolve(event.target.result);
      reader.onerror = (error) => reject(error);
      reader.readAsText(file);
    });
  }
  
  function readExcludeWords(filename) {
    return new Promise((resolve, reject) => {
      fetch(filename)
        .then(response => response.text())
        .then(content => {
          const excludeWords = content.split('\n').map(word => word.trim());
          resolve(excludeWords);
        })
        .catch(error => reject(error));
    });
  }
  
  async function generateIndex() {
    const PAGE_1_FILE = document.getElementById('page1File').files[0];
    const PAGE_2_FILE = document.getElementById('page2File').files[0];
    const PAGE_3_FILE = document.getElementById('page3File').files[0];
    const EXCLUDE_WORDS_FILE = 'exclude-words.txt';
  
    try {
      const page1Content = await readPage(PAGE_1_FILE);
      const page2Content = await readPage(PAGE_2_FILE);
      const page3Content = await readPage(PAGE_3_FILE);
      const excludeWords = await readExcludeWords(EXCLUDE_WORDS_FILE);
  
      const pages = [page1Content, page2Content, page3Content];
  
      const wordIndex = {};
  
      for (let i = 0; i < pages.length; i++) {
        const pageContent = pages[i];
        const words = pageContent.split(/\W+/);
  
        for (let word of words) {
          word = word.toLowerCase();
  
          if (!excludeWords.includes(word)) {
            if (!wordIndex[word]) {
              wordIndex[word] = [];
            }
  
            if (!wordIndex[word].includes(i + 1)) {
              wordIndex[word].push(i + 1);
            }
          }
        }
      }
  
      const indexFileContent = Object.entries(wordIndex)
        .map(([word, pageNumbers]) => `${word} : ${pageNumbers.join(',')}`)
        .join('\n');
  
      downloadFile(indexFileContent, 'index.txt');
      console.log('Index generated and saved to index.txt');
    } catch (error) {
      console.error('Error generating index:', error);
    }
  }
  
  function downloadFile(content, filename) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', filename);
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
  }
  