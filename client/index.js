const onNewWord = (e) => {
  e.preventDefault();
  let wordInput = document.getElementById("word-input");
  let discardWordInput = document.getElementById("discard-word-input");
  let discardWord = "";
  if (discardWordInput) {
    discardWord = discardWordInput.value;
    discardWordInput.value = "";
    discardWordInput.remove();
  }
  let value = wordInput.value;
  wordInput.value = "";
  window.active_socket_conn.emit("new-word", {
    word: value,
    discardWord: discardWord,
  });
  document.getElementById("split-button").removeAttribute("disabled");
};
const splitWord = (e) => {
  e.preventDefault();
  let wordInputForm = document.getElementById("word-input-form");
  document.getElementById("split-button").setAttribute("disabled", "");
  wordInputForm.insertAdjacentHTML(
    "beforeend",
    `<input id="discard-word-input" class="word-input" autocomplete="off" placeholder="Discarded Word"/>`
  );
};

(() => {
  const sock = io();
  window.active_socket_conn = sock;

  sock.on("word-ready", (info) => {
    let currentWordSpan = document.querySelector(`#current-word`);
    currentWordSpan.innerHTML = "";
    currentWordSpan.insertAdjacentHTML("beforeend", info.word);
    let errorContainer = document.querySelector("#error-text-container");
    errorContainer.innerHTML = "";
  });

  sock.on("word-error", (info) => {
    let errorContainer = document.querySelector("#error-text-container");
    errorContainer.innerHTML = "";
    errorContainer.insertAdjacentHTML(
      "beforeend",
      `<span id="error-text">${info.error}</span>`
    );
  });
  sock.on("kick-to-login", (info) => {
    window.location = "/";
  });
  document
    .querySelector("#word-input-form")
    .addEventListener("submit", onNewWord);
  document.querySelector("#split-button").addEventListener("click", splitWord);
})();
