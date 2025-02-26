document.addEventListener('DOMContentLoaded', () => {
    const swiper = new Swiper('.swiper', {
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        loop: true,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
    });

    const images = [
        '/public/фото1.png',
        '/public/фото2.png',
        '/public/фото3.png'
    ];

    const addImageButton = document.getElementById('add-image');
    addImageButton.addEventListener('click', () => {
        const randomImage = images[Math.floor(Math.random() * images.length)];
        const newSlide = document.createElement('div');
        newSlide.classList.add('swiper-slide');
        newSlide.innerHTML = `<img src="${randomImage}" alt="Новое изображение">`;
        swiper.appendSlide(newSlide);
    });n
});
