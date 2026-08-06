// Marquee — random order each load, duplicated once for a seamless loop
const marqueeImages = [
  'trip-south-01.jpg', 'trip-south-02.jpg', 'trip-south-03.jpg',
  'trip-forest-01.jpg', 'trip-caesarea-01.jpg', 'trip-caesarea-02.jpg',
  'trip-caesarea-03.jpg', 'trip-caesarea-04.jpg', 'trip-coast-00-shfayim.jpg',
  'trip-coast-01-running.jpg', 'trip-coast-02.jpg', 'trip-north-01.jpg',
  'trip-north-02.jpg', 'trip-north-03.jpg', 'place-cafe-02.jpg',
  'place-cafe-cart-01.jpg', 'place-asian-01.jpg',
  // הוסיפי כאן קבצים נוספים מתוך assets/, באותו פורמט: 'שם-קובץ.jpg',
];

function shuffle(array) {
  const result = array.slice();
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

const marqueeTrack = document.querySelector('[data-marquee-track]');
if (marqueeTrack) {
  const order = shuffle(marqueeImages);
  const buildSet = (hidden) => order.map((file) => {
    const figure = document.createElement('figure');
    figure.className = 'marquee__item';
    const img = document.createElement('img');
    img.src = `assets/${file}`;
    img.loading = 'lazy';
    if (hidden) {
      figure.setAttribute('aria-hidden', 'true');
      img.alt = '';
    } else {
      img.alt = file.replace(/\.[a-z]+$/i, '').replace(/[-_]/g, ' ');
    }
    figure.appendChild(img);
    return figure;
  });
  marqueeTrack.append(...buildSet(false), ...buildSet(true));
}

// Scroll reveal
const revealEls = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );
  revealEls.forEach((el) => observer.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('is-visible'));
}

// Carousels
document.querySelectorAll('[data-carousel]').forEach((carousel) => {
  const track = carousel.querySelector('[data-track]');
  const slides = Array.from(track.children);
  const prevBtn = carousel.querySelector('[data-prev]');
  const nextBtn = carousel.querySelector('[data-next]');
  const dotsWrap = carousel.querySelector('[data-dots]');

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.setAttribute('aria-label', `תמונה ${i + 1}`);
    dot.addEventListener('click', () => scrollToSlide(i));
    dotsWrap.appendChild(dot);
  });
  const dots = Array.from(dotsWrap.children);

  function activeIndex() {
    const trackRect = track.getBoundingClientRect();
    let closest = 0;
    let closestDist = Infinity;
    slides.forEach((slide, i) => {
      const rect = slide.getBoundingClientRect();
      const dist = Math.abs(rect.left - trackRect.left);
      if (dist < closestDist) {
        closestDist = dist;
        closest = i;
      }
    });
    return closest;
  }

  function updateDots() {
    const idx = activeIndex();
    dots.forEach((d, i) => d.classList.toggle('is-active', i === idx));
  }

  function scrollToSlide(i) {
    const target = slides[Math.max(0, Math.min(i, slides.length - 1))];
    track.scrollTo({ left: target.offsetLeft - track.offsetLeft, behavior: 'smooth' });
  }

  prevBtn.addEventListener('click', () => {
    // RTL: "prev" moves toward the start of reading order (right side)
    scrollToSlide(activeIndex() - 1);
  });
  nextBtn.addEventListener('click', () => {
    scrollToSlide(activeIndex() + 1);
  });

  let scrollTimeout;
  track.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(updateDots, 80);
  });

  updateDots();
});
