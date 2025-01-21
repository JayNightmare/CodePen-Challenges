document.getElementById('scroll-down').addEventListener('click', function() {
    window.scrollBy({
      top: window.innerHeight,
      left: 0,
      behavior: 'smooth'
    });
  
    // Optionally, trigger the animation after a delay matching the scroll
    setTimeout(makeCardsVisible, 500); // Adjust the delay as needed
  });
  
  function makeCardsVisible() {
    document.querySelectorAll('.card').forEach(card => {
      card.classList.add('visible');
    });
  }
  
  // Alternatively, to animate cards as they come into view when scrolling
  window.addEventListener('scroll', function() {
    document.querySelectorAll('.card').forEach(card => {
      var cardPosition = card.getBoundingClientRect().top;
      var screenPosition = window.innerHeight;
      if (cardPosition < screenPosition) {
        card.classList.add('visible');
      }
    });
  });
  