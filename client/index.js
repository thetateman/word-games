const onNewWord = (e) => {
  e.preventDefault();
  let wordInput = document.getElementById("word-input");
  let value = wordInput.value;
  wordInput.value = "";
  window.active_socket_conn.emit("new-word", { word: value });
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
  document.querySelector("#get-vid-form").addEventListener("submit", onNewWord);
})();
