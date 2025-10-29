
//esconder menu
const toggleBtn = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

toggleBtn.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('active');
    toggleBtn.classList.toggle('active');
    toggleBtn.textContent = isOpen ? '✖' : '☰'; // troca o ícone
});


// máscara simples de moeda (PT-BR)
const donationInput = document.getElementById('donation-amount');
donationInput.addEventListener('input', function (e) {
    let v = e.target.value.replace(/\D/g, '');
    v = (v / 100).toFixed(2) + '';
    v = v.replace('.', ',');
    v = v.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
    e.target.value = v;
});

document.getElementById('donateForm').addEventListener('submit', function (e) {
    const raw = document.getElementById('donation-amount').value;
    // converte formato '1.234,56' para número 1234.56
    const num = Number(raw.replace(/\./g, '').replace(',', '.'));
    if (isNaN(num) || num < 1) {
        e.preventDefault();
        alert('Insira um valor de doação válido (mínimo R$1,00).');
    }
});

//carrousel
(function () {
    const track = document.querySelector('.carousel-track');
    const carousel = document.querySelector('.carousel');
    const prev = document.querySelector('.carousel-btn.prev');
    const next = document.querySelector('.carousel-btn.next');

    // Scroll amount = width of one item
    function itemWidth() {
        const item = track.querySelector('.carousel-item');
        return item ? item.getBoundingClientRect().width + parseFloat(getComputedStyle(item).marginRight || 0) : 300;
    }

    prev.addEventListener('click', () => {
        const maxScroll = track.scrollWidth - carousel.clientWidth;
        // se já estivermos no começo, vai pro fim (loop)
        if (carousel.scrollLeft <= 2) {
            carousel.scrollTo({ left: maxScroll, behavior: 'smooth' });
        } else {
            carousel.scrollBy({ left: -itemWidth(), behavior: 'smooth' });
        }
    });
    next.addEventListener('click', () => {
        const maxScroll = track.scrollWidth - carousel.clientWidth;
        // se já estivermos no fim, volta ao início (loop)
        if (Math.ceil(carousel.scrollLeft) >= Math.floor(maxScroll - 2)) {
            carousel.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
            carousel.scrollBy({ left: itemWidth(), behavior: 'smooth' });
        }
    });

    // drag-to-scroll
    let isDown = false, startX, scrollLeft;
    carousel.addEventListener('mousedown', (e) => {
        isDown = true; carousel.classList.add('dragging'); startX = e.pageX - carousel.offsetLeft; scrollLeft = carousel.scrollLeft;
    });
    window.addEventListener('mouseup', () => { isDown = false; carousel.classList.remove('dragging'); });
    carousel.addEventListener('mousemove', (e) => {
        if (!isDown) return; e.preventDefault(); const x = e.pageX - carousel.offsetLeft; const walk = (x - startX); carousel.scrollLeft = scrollLeft - walk;
    });

    // suporte a toque
    let touchStartX = 0, touchStartScroll = 0;
    carousel.addEventListener('touchstart', e => { touchStartX = e.touches[0].pageX; touchStartScroll = carousel.scrollLeft; });
    carousel.addEventListener('touchmove', e => { const dx = e.touches[0].pageX - touchStartX; carousel.scrollLeft = touchStartScroll - dx; });

    // teclass
    carousel.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') next.click();
        if (e.key === 'ArrowLeft') prev.click();
    });
})();