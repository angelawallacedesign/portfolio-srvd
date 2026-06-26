const phrases =
  document.querySelectorAll('.phrase-field span');

phrases.forEach((phrase) => {

  const activate = () => {

    phrase.classList.add('is-active');

    requestAnimationFrame(() => {

      setTimeout(() => {

        phrase.classList.remove('is-active');

      }, 50);

    });

  };

  phrase.addEventListener('mouseenter', activate);

  phrase.addEventListener(
    'touchstart',
    activate,
    { passive: true }
  );

});