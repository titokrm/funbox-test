document.addEventListener( 'DOMContentLoaded', function() {
  let body = document.querySelector('body');
  let cardOver;
  function handleMouseOver(event) {
    const cardClick = event.target.closest('.feed-card__bg');
    if (cardClick && !cardClick.closest('.feed-card').classList.contains('feed-card--disabled')) {
      console.log('Over card!');
      event.target.closest('.feed-card').classList.add('feed-card--hover');
      cardOver = cardClick;
      cardClick.addEventListener('mouseleave', handleMouseLeave);
    }    
  }
  function handleMouseLeave(event) {
    if (event.target.classList.contains('feed-card__bg')) {
      console.log('Out card!');
      event.target.closest('.feed-card').classList.remove('feed-card--hover');
      cardOver.removeEventListener('mouseleave', handleMouseLeave);
    }
//    const cardClick = event.target.closest('.feed-card__bg');
//    if (cardClick) {
//      console.log('Out!');
//      event.target.closest('.feed-card').classList.remove('feed-card--hover');
//    }
    
  }
  function handleActiveMouseLeave(event) {
    cardOver.removeEventListener('mouseleave', handleActiveMouseLeave);
    body.addEventListener('mouseover', handleMouseOver);  
  }
  body.addEventListener('mouseover', handleMouseOver);

  body.addEventListener('click', (event) => {
    const cardClick = event.target.closest('.feed-card__bg');
    const linkClick = event.target.closest('.feed-card__description-text a');
    if (cardClick && !cardClick.closest('.feed-card').classList.contains('feed-card--disabled')) {
      console.log('Click card!');
      let card = event.target.closest('.feed-card');
      card.classList.remove('feed-card--hover');
      card.classList.toggle('feed-card--active');
      body.removeEventListener('mouseover', handleMouseOver);
      cardOver = cardClick;
      cardClick.addEventListener('mouseleave', handleActiveMouseLeave);
      return;
    }
    if (linkClick) {
      let card = event.target.closest('.feed-card');
      card.classList.add('feed-card--active');
    }

  });

});