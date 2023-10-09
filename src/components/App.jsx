import React, { useState, useEffect } from "react";
import { fetchImages } from "./Api.js";

import { Button } from "./Button/Button.jsx";
import { ImageGallery } from "./ImageGallery/ImageGallery.jsx";
import { ImageGalleryItem } from "./ImageGalleryItem/ImageGalleryItem.jsx";
import { Spinner as Oval } from "./Loader/Loader.jsx";
import { Modal } from "./Modal/Modal.jsx";
import { Searchbar } from "./Searchbar/Searchbar.jsx";

export const App = () => {
  const [images, setImages] = useState([]);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [largeImageURL, setLargeImageURL] = useState('');
  const [totalHits, setTotalHits] = useState(0);
  const [loadMore, setLoadMore] = useState(false);

  const handleSearchSubmit = (newQuery) => {
    setQuery(newQuery);
    setPage(1);
    setImages([]);
    setTotalHits(0);
    setLoadMore(false);
  };

  const fetchImagesData = async () => {
    setIsLoading(true);

    try {
      const { images: fetchedImages, totalHits: fetchedTotalHits } = await fetchImages(query, page);
      const totalPages = Math.ceil(fetchedTotalHits / 12);

      setImages((prevImages) => (page === 1 ? fetchedImages : [...prevImages, ...fetchedImages]));
      setTotalHits(fetchedTotalHits);
      setIsLoading(false);
      if (page < totalPages) {
        setPage((prevPage) => prevPage + 1);
        setLoadMore(true);
    } else {
        setLoadMore(false);
    }
    } catch (error) {
      console.error('Error fetching images:', error);
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (query && page === 1) {
      fetchImagesData();
    }
  }, [query, page]);

  const handleImageClick = (clickedImageURL) => {
    setLargeImageURL(clickedImageURL);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setLargeImageURL('');
  };

  const pageUpdate = () => {
    fetchImagesData();
  };

  return (
    <div>
      <Searchbar onSubmit={handleSearchSubmit} />
      <ImageGallery>
        {images.map((image, index) => (
          <ImageGalleryItem
            key={index}
            webformatURL={image.webformatURL}
            largeImageURL={image.largeImageURL}
            onClick={() => handleImageClick(image.largeImageURL)}
          />
        ))}
      </ImageGallery>
      {isLoading && <Oval />}
      {images.length > 0 && !isLoading && loadMore && (
        <Button onClick={pageUpdate} />
      )}
      {showModal && (
        <Modal largeImageURL={largeImageURL} onClose={handleCloseModal} />
      )}
    </div>
  );
}