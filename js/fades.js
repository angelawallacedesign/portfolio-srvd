const container = document.querySelector('.scroll-container');

function updateFades() {
  const scrollTop = container.scrollTop;
  const maxScroll =
    container.scrollHeight - container.clientHeight;

  if (maxScroll <= 0) {
    container.className = 'scroll-container';
    return;
  }

  if (scrollTop <= 1) {
    container.classList.remove(
      'fade-top',
      'fade-both'
    );
    container.classList.add('fade-bottom');

  } else if (scrollTop >= maxScroll - 1) {
    container.classList.remove(
      'fade-bottom',
      'fade-both'
    );
    container.classList.add('fade-top');

  } else {
    container.classList.remove(
      'fade-top',
      'fade-bottom'
    );
    container.classList.add('fade-both');
  }
}

container.addEventListener('scroll', updateFades);
window.addEventListener('resize', updateFades);

updateFades();