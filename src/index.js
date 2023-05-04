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
let searchImg = null;

    function onInput(evt) {
     evt.preventDefault();

       const { elements: { searchQuery } } = evt.currentTarget;
      searchImg = searchQuery.value.trim();
      gallery.innerHTML = '';
      if (searchImg) {
   
        axiosImages(searchImg, currentPage)
          .then(data => {
            if (data.total) {
              gallery.insertAdjacentHTML('beforeend', createMarkup(data));
              Notiflix.Notify.success(`Hooray! We found ${data.total} images.`);
              viewsBigImg();
              scrollGallery();
              loadMore.style.visibility = 'visible';
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
        viewsBigImg();
        let totalPageImg = 40 * currentPage;
        if (totalPageImg === data.total){
              Notiflix.Notify.info(
                "We're sorry, but you've reached the end of search results.");
              loadMore.style.visibility = "hidden";
           
            }  
      }})
      .catch(err => console.log(err));
    //  let totalPageImg = 40 * currentPage;
    //     if (totalPageImg >= data.total){
    //           Notiflix.Notify.info(
    //             "We're sorry, but you've reached the end of search results.");
    //           loadMore.style.visibility = "hidden";
    //         }    
}
//-------------------------------- 4 скрол --------------------------
function scrollGallery() {
    const { height } = gallery.firstElementChild.getBoundingClientRect();
  
    window.scrollBy({
      top: height * 2,
      behavior: 'smooth',
    });
  }
//-------------------------------- 5 закріплена шапка --------------------------
const formrHeight = form.offsetHeight;
const galleryHeight = gallery.offsetHeight;
    window.addEventListener('scroll', () =>{
let scrollDistance = window.scrollY;
    if(scrollDistance >= galleryHeight){
        form.classList.add('form-fixed');
        gallery.style.marginTop = `${formrHeight}px`;
    } else {
        form.removeClass('form-fixed');
        gallery.style.marginTop = null;
    }
    })
//-------------------------------- 6 для перегляду фото --------------------------

  function viewsBigImg() {
   const viewsImg = new SimpleLightbox('.gallery a');
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

