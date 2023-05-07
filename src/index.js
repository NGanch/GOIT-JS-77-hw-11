import './css/styles.css';

import {axiosImages} from './axiosImages';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';


const form = document.querySelector('.search-form');
const loadMore = document.querySelector('.load-more')
const gallery = document.querySelector('.gallery');

const searchQuery = document.querySelector('input[name="searchQuery"]');

form.addEventListener('submit', onInput);
loadMore.addEventListener('click', onClick);

loadMore.style.visibility = 'hidden';

const clear = elems => [...elems.children].forEach(div => div.remove());

export let perPage = 40;
let currentPage = 0;
let searchName = searchQuery.value;


// // ------------------------------ 1 Форма пошуку-------------------------

    function onInput(evt) {
      evt.preventDefault();
      clear(gallery);
  
      searchName = searchQuery.value;
      currentPage = 1;
    
      if (!searchName) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.',
        );
        clear(gallery);
        return;
      } 
    
      if (searchName) {
        axiosImages(searchName, currentPage)
          .then(data => {
            if (data.hits.length > 0) {
              Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
              gallery.insertAdjacentHTML('beforeend', createMarkup(data));

              loadMore.style.visibility = 'visible';
              lightbox();
              formFixed();
              scrollGallery();
      }  
        })
        .catch(err => console.log(err));
    }  
  }

  
// ------------------------------ 1 Форма пошуку-------------------------

function onClick(){
    searchName = searchQuery.value;
    currentPage += 1;
   
    axiosImages(searchName, currentPage)
    .then(data => {    
      let totalPages = Math.ceil(data.totalHits / perPage);
        gallery.insertAdjacentHTML('beforeend', createMarkup(data));
        scrollGallery();
          lightbox();

       if (currentPage >= totalPages){
          loadMore.style.visibility = "hidden";
              Notiflix.Notify.info(
                "We're sorry, but you've reached the end of search results.");

            }          
      }) .catch(error => console.log(error));
}

//-------------------------------- 4 скрол --------------------------
function scrollGallery() {
      const { height: cardHeight } = document
        .querySelector('.gallery')
        .firstElementChild.getBoundingClientRect();

      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
  }
//-------------------------------- 5 закріплена шапка --------------------------
function formFixed (){
    const formrHeight = form.offsetHeight;
    const galleryHeight = gallery.offsetHeight;
        window.addEventListener('scroll', () =>{
    let scrollDistance = window.scrollY;
        if(scrollDistance >= galleryHeight){
            form.classList.add('form-fixed');
            gallery.style.marginTop = `${formrHeight}px`;
        } else {
            form.classList.remove('form-fixed');
            gallery.style.marginTop = null;
        }
        })
}

//-------------------------------- 6 для перегляду фото --------------------------

  function lightbox() {
      const viewsImg = new SimpleLightbox('.gallery a');
      viewsImg.refresh()

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
