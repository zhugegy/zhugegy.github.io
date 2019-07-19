// modified from source: https://www.w3schools.com/howto/howto_js_lightbox.asp
var slideIndex = 1;
var g_strCurrentTheme = "reserved";

// Open the Modal
function openModal(strModalID)
{
  g_strCurrentTheme = strModalID;
  document.getElementById(strModalID).style.display = "block";
  showSlides(slideIndex = 1);
}

// Close the Modal
function closeModal(strModalID)
{
  document.getElementById(strModalID).style.display = "none";
}

// Next/previous controls
function plusSlides(n) {
  showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
  showSlides(slideIndex = n);
}

// obsolete
function __showSlides(n)
{
  var i;
  var slides = document.getElementsByClassName("modalSlides");
  var dots = document.getElementsByClassName("demoThumbnail");
  var captionText = document.getElementById("captionModal");
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";
  dots[slideIndex-1].className += " active";
  captionText.innerHTML = dots[slideIndex-1].alt;
}

// todo: need performance optimization, since it is modified from W3CSchool source and temporiliy adjusted
function showSlides(n)
{
  var i;
  var slidesRaw = document.getElementsByClassName("modalSlides");

  var slides = [];
  for (i = 0; i < slidesRaw.length; i++)
  {
    if (window.getComputedStyle(slidesRaw[i].parentElement.parentElement).display == "block")
    {
      slides.push(slidesRaw[i]);
    }
  }

  var dotsRaw = document.getElementsByClassName("demoThumbnail");
  var dots = [];
  for (i = 0; i < dotsRaw.length; i++)
  {
    if (window.getComputedStyle(dotsRaw[i].parentElement.parentElement.parentElement.parentElement).display == "block")
    {
      dots.push(dotsRaw[i]);
    }
  }

  var captionText = document.getElementById("captionModal" + g_strCurrentTheme);
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";
  dots[slideIndex-1].className += " active";

  //captionText.innerHTML = dots[slideIndex-1].data-caption;
  captionText.innerHTML = dots[slideIndex-1].getAttribute("data-caption");
}
