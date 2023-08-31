console.log("This is content script");
const TRIGGER_START = "helper:";
const TRIGGER_END = ";";
const OPEN_AI = "openAi";

const getFromLocalStorage = async (key) => {
  return chrome.storage.local.get([key]);
};

const debounce = (callback, delay = 200) => {
  let timerOutId = null;
  return (...args) => {
    if (timerOutId) {
      clearTimeout(timerOutId);
    }
    timerOutId = setTimeout(() => {
      callback(...args);
    }, delay);
  };
};

const updateElement = (inputTargetElement, value, success = false) => {
  const updatedValue = success
    ? inputTargetElement.textContent.replace(/helper:(.*?)\;/gi, value)
    : value;

  if (
    inputTargetElement instanceof HTMLInputElement ||
    inputTargetElement instanceof HTMLTextAreaElement
  ) {
    inputTargetElement.value = updatedValue;
  } else {
    inputTargetElement.textContent = updatedValue;
  }
};

const parseQuery = (text) => {
  const parsed = /helper:(.*?)\;/gi.exec(text);
  return parsed ? parsed[1] : "";
};

const getTextContentFromDOMElements = (node, textarea = false) => {
  if (textarea) {
    return parseQuery(node.value).trim();
  }
  const value = node.textContent;
  if (node && value) {
    return parseQuery(value).trim();
  }
};


window.addEventListener(
  "keypress",
  debounce((e) => {
    const inputTargetElement = e.target;
    let query = "";
    if (
      inputTargetElement instanceof HTMLInputElement ||
      inputTargetElement instanceof HTMLTextAreaElement
    ) {
      query = getTextContentFromDOMElements(inputTargetElement, true);
    } else {
      query = getTextContentFromDOMElements(inputTargetElement, false);
    }

    if (!query) {
      return;
    }

    const previousOpacity = inputTargetElement.style.opacity;
    inputTargetElement.style.opacity = "0.5";
    addLoadingIcon(inputTargetElement);
    getFromLocalStorage(OPEN_AI)
      .then((result) => {
        return getQueryResult(query, result.openAi);
      })
      .then((response) => {
        updateElement(inputTargetElement, response, true);
      })
      .catch(() => {
        updateElement(inputTargetElement, query);
      })
      .finally(() => {
        removeLoaderIcon();
        inputTargetElement.style.opacity = previousOpacity;
      });
  })
);
