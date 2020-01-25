const hideWaterPot = function() {
  const waterPot = document.querySelector('#water-pot-img');
  waterPot.classList.add('hidden');
  setTimeout(() => {
    waterPot.classList.remove('hidden');
  }, 1000);
};
