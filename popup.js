const saveButton = document.querySelector("#save_btn");
const input = document.querySelector("#key_input");
const getQueryButton = document.querySelector("#getQueryButton");
const queryTextarea = document.querySelector("textarea");
const queryReply = document.querySelector("#queryReply");
const queryReplyContainer = document.querySelector("#queryReplyContainer");
const copyAnswer = document.querySelector("#copyAnswer");
const query  = document.querySelector("#queryReply")
const OPEN_AI = "openAi";

const saveToLocalStorage = async (key, value) => {
  await chrome.storage.local.set({ [key]: value });
};
const getFromLocalStorage = async (key) => {
  const result = await chrome.storage.local.get([key]);
  return result[key];
};

const darkModeToggle = document.getElementById("darkModeToggle");
const container = document.querySelector(".container");
const inp = document.querySelector(".input");

darkModeToggle.addEventListener("click", () => {
  container.classList.toggle("dark-mode");
  inp.classList.toggle("dark-mode");
  queryReply.classList.toggle("dark-mode");
  inp.classList.toggle("dark-mode");
});
saveButton.addEventListener("click", () => {
  const inputValue = input.value;
  saveToLocalStorage(OPEN_AI, inputValue);
});
getQueryButton.addEventListener("click", () => {
  const query = queryTextarea.value;
  if (!query || queryReply.textContent === "Loading...") {
    queryReplyContainer.setAttribute("style", "display: none;");
    return;
  }
  queryReplyContainer.setAttribute("style", "display: block;");
  queryReply.textContent = "Scouring the web for results...";
  getQueryResult(query, input.value).then((res) => {
    queryReply.textContent = res;
  });
});

copyAnswer.addEventListener("click", () => {
  navigator.clipboard.writeText(queryReply.textContent);
  copyAnswer.textContent = "Copied";
  setTimeout(() => {
    copyAnswer.textContent = "";
  }, 1000);
});
