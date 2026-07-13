/**
 * Crossfade carousel.
 *
 * Slides are stacked and swapped by toggling opacity, so there is no sliding
 * motion. Swipe is gesture-based (flick to advance) rather than drag-tracking,
 * since there is nothing to translate under the finger.
 *
 * Markup contract (see index.html):
 *   [data-carousel]                  wrapper
 *     .carousel                      stacking context, tabindex="0" for arrow keys
 *       [data-carousel-track]        direct children are .slide
 *       [data-carousel-counter]      optional "1 / 3" overlay
 *       [data-carousel-prev] / [-next]
 *     [data-carousel-dots]           optional; dots are generated here
 *
 * Optional attributes on the wrapper:
 *   data-carousel-auto               enable autoplay
 *   data-carousel-interval="4000"    autoplay delay in ms
 *   data-carousel-label="photo"      noun used in dot aria-labels
 *
 * Add class="no-swipe" to the track to disable swipe (e.g. model-viewer slides).
 */
document.querySelectorAll("[data-carousel]").forEach(function (root) {
  const track = root.querySelector("[data-carousel-track]");
  if (!track) {
    return;
  }

  const slides = Array.from(track.children);
  if (slides.length === 0) {
    return;
  }

  const viewport = root.querySelector(".carousel");
  const dotRow = root.querySelector("[data-carousel-dots]");
  const counter = root.querySelector("[data-carousel-counter]");
  const prevButton = root.querySelector("[data-carousel-prev]");
  const nextButton = root.querySelector("[data-carousel-next]");

  const label = root.dataset.carouselLabel || "photo";
  const interval = Number(root.dataset.carouselInterval) || 4000;

  const SWIPE_THRESHOLD = 40; // px of horizontal travel before it counts

  let index = 0;
  let autoTimer = null;

  slides[0].classList.add("is-active");
  slides.forEach(function (slide, i) {
    slide.setAttribute("aria-hidden", i === 0 ? "false" : "true");
  });

  // Nothing to page through — hide the chrome and stop here.
  if (slides.length === 1) {
    root.setAttribute("data-single", "");
    return;
  }

  // --- Dots -----------------------------------------------------------------

  const dots = slides.map(function (slide, i) {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "dot";
    dot.setAttribute("aria-label", "Show " + label + " " + (i + 1));

    dot.addEventListener("click", function () {
      stopAuto();
      goTo(i);
    });

    if (dotRow) {
      dotRow.appendChild(dot);
    }

    return dot;
  });

  // --- Navigation -----------------------------------------------------------

  function goTo(target) {
    index = (target + slides.length) % slides.length;
    render();
  }

  function step(n) {
    stopAuto();
    goTo(index + n);
  }

  function render() {
    slides.forEach(function (slide, i) {
      slide.classList.toggle("is-active", i === index);
      slide.setAttribute("aria-hidden", i === index ? "false" : "true");
    });

    dots.forEach(function (dot, i) {
      dot.classList.toggle("active", i === index);
      dot.setAttribute("aria-current", i === index ? "true" : "false");
    });

    if (counter) {
      counter.textContent = index + 1 + " / " + slides.length;
    }
  }

  if (prevButton) {
    prevButton.addEventListener("click", function () {
      step(-1);
    });
  }

  if (nextButton) {
    nextButton.addEventListener("click", function () {
      step(1);
    });
  }

  // --- Keyboard -------------------------------------------------------------

  if (viewport) {
    viewport.addEventListener("keydown", function (event) {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        step(-1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        step(1);
      }
    });
  }

  // --- Swipe ----------------------------------------------------------------

  if (viewport && !track.classList.contains("no-swipe")) {
    let startX = null;
    let startY = null;

    viewport.addEventListener("pointerdown", function (event) {
      startX = event.clientX;
      startY = event.clientY;
    });

    viewport.addEventListener("pointerup", function (event) {
      if (startX === null) {
        return;
      }

      const dx = event.clientX - startX;
      const dy = event.clientY - startY;

      startX = null;
      startY = null;

      // Horizontal intent only — don't hijack a vertical page scroll.
      if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
        step(dx < 0 ? 1 : -1);
      }
    });

    viewport.addEventListener("pointercancel", function () {
      startX = null;
      startY = null;
    });
  }

  // --- Autoplay -------------------------------------------------------------

  function startAuto() {
    if (autoTimer || !root.hasAttribute("data-carousel-auto")) {
      return;
    }

    autoTimer = setInterval(function () {
      if (!document.hidden) {
        goTo(index + 1);
      }
    }, interval);
  }

  function stopAuto() {
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
    }

    // Any deliberate interaction kills autoplay for good.
    root.removeAttribute("data-carousel-auto");
  }

  root.addEventListener("pointerenter", function () {
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
  });

  root.addEventListener("pointerleave", startAuto);
  root.addEventListener("pointerdown", stopAuto);
  root.addEventListener("focusin", stopAuto);

  render();
  startAuto();
});
