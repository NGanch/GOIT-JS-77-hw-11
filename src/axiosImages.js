import axios from 'axios';
import Notiflix from 'notiflix';
import { perPage } from './index.js';
import {loadMore} from './index.js';
export async function axiosImages(name, page) {
    const BASE_URL = 'https://pixabay.com/api/';
    const API_KEY = '35926176-c3a1e4cc9918e3801982283ac';

    const response = await axios.get(`${BASE_URL}?key=${API_KEY}&q=${name}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`);
    let data = response.data;
    if (data.totalHits === 0) {
      loadMore.style.visibility = 'hidden';
          Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
      }else{
 
        return data;
      }

  }
