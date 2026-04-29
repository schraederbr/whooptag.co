let slideIndex = 1;
let autoSlideTimer = null;
let autoSlideEnabled = true;

showSlides(slideIndex);
startAutoSlides();

function startAutoSlides() {
  autoSlideTimer = setInterval(function () {
    if (autoSlideEnabled) {
      showSlides(slideIndex += 1);
    }
  }, 4000);
}

function stopAutoSlides() {
  autoSlideEnabled = false;

  if (autoSlideTimer) {
    clearInterval(autoSlideTimer);
    autoSlideTimer = null;
  }
}

function plusSlides(n) {
  stopAutoSlides();
  showSlides(slideIndex += n);
}

function currentSlide(n) {
  stopAutoSlides();
  showSlides(slideIndex = n);
}

function showSlides(n) {
  let i;
  const slides = document.getElementsByClassName("mySlides");
  const dots = document.getElementsByClassName("dot");

  if (n > slides.length) {
    slideIndex = 1;
  }

  if (n < 1) {
    slideIndex = slides.length;
  }

  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }

  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }

  slides[slideIndex - 1].style.display = "block";
  dots[slideIndex - 1].className += " active";
}