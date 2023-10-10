import React, { useState, useEffect, useCallback } from "react";
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
  const [totalPages, setTotalPages] = useState(1);

  const handleSearchSubmit = (newQuery) => {
    setQuery(newQuery);
    setPage(1);
    setImages([]);
  };

  
    const fetchImagesData = useCallback(async () => {
      setIsLoading(true);

      try {
        const { images: fetchedImages, totalHits: fetchedTotalHits } = await fetchImages(query, page);
        const totalPages = Math.ceil(fetchedTotalHits / 12);
        setTotalPages(totalPages);

        setImages((prevImages) => (page === 1 ? fetchedImages : [...prevImages, ...fetchedImages]));
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching images:', error);
        setIsLoading(false);
      }
    

  }, [query, page]);

  useEffect(() => {
    if (query && page >= 1) {
      fetchImagesData();
    }
  }, [query, page, fetchImagesData]);

  const handleImageClick = (clickedImageURL) => {
    setLargeImageURL(clickedImageURL);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setLargeImageURL('');
  };

  const pageUpdate = () => {
    setPage((prevPage) => prevPage + 1);
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
      {images.length > 0 && !isLoading && page < totalPages && (
        <Button onClick={pageUpdate} />
      )}
      {showModal && (
        <Modal largeImageURL={largeImageURL} onClose={handleCloseModal} />
      )}
    </div>
  );
}