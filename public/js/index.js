const socket = io();

const disconnectedDiv = document.getElementById('disconnected')
const refreshBtn = document.getElementById('disconnected-refresh-btn')

// Debounce function to control the rate at which the resizeCanvas function is called
function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

//self destruct website on disconnect lol
socket.on('disconnect', function () {
  console.log("disconnected from server!!!")

  disconnectedDiv.classList.remove('hidden')
  document.getElementById('game-container').remove()
})

refreshBtn.addEventListener("click", function() {
  location.reload()
});