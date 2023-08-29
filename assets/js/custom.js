var swiper = new Swiper(".main_slide", {
    slidesPerView: "auto",
    observer: true,
    observeParents: true,
    centeredSlides: true,
    loop: true,
    speed: 1000,
    // loopAdditionalSlides : 1,
    // parallax: true,
    autoplay: {
        delay: 3000,
        disableOnInteraction: false
    },
  });