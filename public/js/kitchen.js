const kitchen = document.getElementById('kitchen');

//kitchen has ended
socket.on("kitchen_return_menu", () => {
    mm.classList.remove('hidden');
    kitchen.classList.add('hidden');

    console.log("kitchen has stopped")
});