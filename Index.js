window.addEventListener("scroll", function () {
    console.log("Scroll Position:", this.window.scrollY);
    var header = this.document.querySelector("header");
    header.classList.toggle("abajo", this.window.scrollY > 0);
})

  // JavaScript para cerrar el menú al hacer clic en el icono
  document.getElementById('menu').addEventListener('change', function () {
    var menu = document.querySelector('.menu');
    if (this.checked) {
        menu.classList.add('active');
    } else {
        menu.classList.remove('active');
    }
});

document.addEventListener('DOMContentLoaded', function () {
    var menuCheckbox = document.getElementById('menu');
    var body = document.querySelector('body');

    // Evento de cambio del checkbox
    menuCheckbox.addEventListener('change', function () {
        if (this.checked) {
            body.classList.add('menu-open');
        } else {
            body.classList.remove('menu-open');
        }
    });
});
