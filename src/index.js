import './css/styles.css';

import {axiosImages} from './axiosImages';
import Notiflix from 'notiflix';
 import SimpleLightbox from 'simplelightbox';
 import 'simplelightbox/dist/simple-lightbox.min.css';
// // ------------------------------ 1 Форма пошуку-------------------------

const form = document.querySelector('.search-form');
const loadMore = document.querySelector('.load-more')
const gallery = document.querySelector('.gallery');

form.addEventListener('submit', onInput);
loadMore.addEventListener('click', onClick);
loadMore.style.visibility = "hidden";

let currentPage = 1;
// const viewsImg = null;

    function onInput(evt) {
     evt.preventDefault();

       const { elements: { searchQuery } } = evt.currentTarget;
      searchImg = searchQuery.value.trim();
      gallery.innerHTML = '';
      if (searchImg) {
   
        axiosImages(searchImg, currentPage)
          .then(data => {
            if (data.total) {
              loadMore.style.visibility = 'visible';
              gallery.insertAdjacentHTML('beforeend', createMarkup(data));
              Notiflix.Notify.success(`Hooray! We found ${data.total} images.`);
              let viewsImg = new SimpleLightbox('.gallery a');
              scrollGallery();
            } 
           
        })
        .catch(err => console.log(err));
    }  
        }
  
// ------------------------------ 1 Форма пошуку-------------------------

function onClick(){
    currentPage++;
    axiosImages(searchImg, currentPage)
    .then(data => {
      if (data.total) {
        gallery.insertAdjacentHTML('beforeend', createMarkup(data));
      }})
    // gallery.insertAdjacentHTML('beforeend', createMarkup(data));
     let totalPageImg = 40 * currentPage;
        if (totalPageImg >= data.total) {
              Notiflix.Notify.info(
                "We're sorry, but you've reached the end of search results."
              );
            }    
}
//-------------------------------- 4 скрол --------------------------
function scrollGallery() {
    const { height } = gallery.firstElementChild.getBoundingClientRect();
  
    window.scrollBy({
      top: height * 2,
      behavior: 'smooth',
    });
  }
// -------------------------------3 Галерея і картка зображення --------------

function createMarkup(data){
    let arr = data.hits;
    return arr.map(({largeImageURL, webformatURL, tags, likes, views, comments, downloads}) => 
        ` <li class="photo-card">
        <a class="gallery__link" href="${largeImageURL}">
           <img class="gallery__image" src="${webformatURL}" alt="${tags}" loading="lazy" />
          <div class="info">
             <p class="info-item">
               <b>Likes ${likes}</b>
             </p>
             <p class="info-item">
               <b>Views ${views}</b>
             </p>
             <p class="info-item">
               <b>Comments ${comments}</b>
             </p>
             <p class="info-item">
               <b>Downloads ${downloads}</b>
             </p>
           </div>
         </li>`
    ).join("");
    
    }

