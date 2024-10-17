let slideIndex = 0;
mostrarSlides(slideIndex);

// Función para controlar el movimiento del carrusel
function moverCarrusel(n) {
  mostrarSlides(slideIndex += n);
}

// Mostrar slides
function mostrarSlides(n) {
  let i;
  let slides = document.getElementsByClassName("carrusel-slide");
  if (n >= slides.length) { slideIndex = 0; } // Volver al primer slide
  if (n < 0) { slideIndex = slides.length - 1; } // Volver al último slide
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";  
  }
  slides[slideIndex].style.display = "block";  
}

// Iniciar el carrusel de manera automática
let autoSlideIndex = 0;
autoMostrarSlides();

function autoMostrarSlides() {
  let i;
  let slides = document.getElementsByClassName("carrusel-slide");
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";  
  }
  autoSlideIndex++;
  if (autoSlideIndex > slides.length) {autoSlideIndex = 1}    
  slides[autoSlideIndex - 1].style.display = "block";  
  setTimeout(autoMostrarSlides, 3000); // Cambiar imagen cada 3 segundos
}
