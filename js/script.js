document.querySelectorAll("[data-gallery]").forEach(function (gallery) {
  let slideIndex = 1;
  let autoSlideTimer = null;
  let autoSlideEnabled = gallery.hasAttribute("data-auto-gallery");

  const slides = gallery.getElementsByClassName("mySlides");
  const dots = gallery.querySelectorAll("[data-gallery-dot]");
  const prevButton = gallery.querySelector("[data-gallery-prev]");
  const nextButton = gallery.querySelector("[data-gallery-next]");
  const interactiveItems = gallery.querySelectorAll("img, model-viewer");

  showSlides(slideIndex);

  if (autoSlideEnabled) {
    startAutoSlides();
  }

  function startAutoSlides() {
    if (slides.length <= 1) {
      return;
    }

    autoSlideTimer = setInterval(function () {
      if (autoSlideEnabled) {
        slideIndex += 1;
        showSlides(slideIndex);
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
    slideIndex += n;
    showSlides(slideIndex);
  }

  function currentSlide(n) {
    stopAutoSlides();
    slideIndex = n;
    showSlides(slideIndex);
  }

  function showSlides(n) {
    let i;

    if (slides.length === 0) {
      return;
    }

    if (n > slides.length) {
      slideIndex = 1;
    }

    if (n < 1) {
      slideIndex = slides.length;
    }

    for (i = 0; i < slides.length; i += 1) {
      slides[i].style.display = "none";
    }

    for (i = 0; i < dots.length; i += 1) {
      dots[i].classList.remove("active");
    }

    slides[slideIndex - 1].style.display = "block";

    if (dots[slideIndex - 1]) {
      dots[slideIndex - 1].classList.add("active");
    }
  }

  if (prevButton) {
    prevButton.addEventListener("click", function () {
      plusSlides(-1);
    });
  }

  if (nextButton) {
    nextButton.addEventListener("click", function () {
      plusSlides(1);
    });
  }

  dots.forEach(function (dot, index) {
    dot.addEventListener("click", function () {
      currentSlide(index + 1);
    });
  });

  interactiveItems.forEach(function (item) {
    item.addEventListener("pointerdown", function () {
      stopAutoSlides();
    });
  });
});