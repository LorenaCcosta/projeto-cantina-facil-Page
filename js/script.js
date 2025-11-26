document.addEventListener("DOMContentLoaded", () => {
    const menuItem = document.querySelectorAll('.menu-item');

    function selectLink() {
        menuItem.forEach((item) => item.classList.remove('ativo'));
        this.classList.add('ativo');
    }

    menuItem.forEach((item) => item.addEventListener('click', selectLink));

    const btnExp = document.querySelector('#btn-exp');
    const menuSide = document.querySelector('.menu-lateral');

    if (btnExp && menuSide) {
        btnExp.addEventListener('click', () => {
            menuSide.classList.toggle('expandir');
        });
    }
});
