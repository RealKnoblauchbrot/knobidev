import { useEffect, useRef, useCallback } from 'react';
import { FaDownload, FaUser } from 'react-icons/fa';
import { GalleryItem, Author, INTERSECTION_OBSERVER_THRESHOLD } from '../types';

interface ItemGridProps {
  items: GalleryItem[];
  visibleItemCount: number;
  setVisibleItemCount: (updater: (prevCount: number) => number) => void;
  handleItemDownload: (item: GalleryItem) => void;
  handleAuthorClick: (event: React.MouseEvent, authorId: string) => void;
  authors: Record<string, Author>;
}

function ItemGrid({ 
  items, 
  visibleItemCount, 
  setVisibleItemCount, 
  handleItemDownload, 
  handleAuthorClick, 
  authors 
}: ItemGridProps) {
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const loadMoreItems = useCallback(() => {
    setVisibleItemCount((prevCount: number) => prevCount + 12);
  }, [setVisibleItemCount]);

  useEffect(() => {
    if (!loadMoreRef.current || items.length <= visibleItemCount) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          loadMoreItems();
        }
      },
      { threshold: INTERSECTION_OBSERVER_THRESHOLD }
    );

    observer.observe(loadMoreRef.current);

    return () => {
      observer.disconnect();
    };
  }, [items.length, visibleItemCount, loadMoreItems]);

  if (items.length === 0) {
    return (
      <div className="no-items-found">
        <p>No items found matching your search criteria.</p>
      </div>
    );
  }

  return (
    <>
      {items.slice(0, visibleItemCount).map((item, index) => (
        <div
          className="item-card"
          key={index}
          onClick={() => handleItemDownload(item)}
          title={`Click to download ${item.label}`}
        >
          <div className="item-image-container">
            <img
              src={`/assets/items/${item.file}.webp`}
              alt={item.label}
              className="item-image"
              loading="lazy"
            />
            <span className="license-badge">
              {item.license || 'UNL'}
              {item.author && authors[item.author] && (
                <span className="author-badge" 
                  title={`Author: ${authors[item.author].author}`}
                  onClick={(e) => handleAuthorClick(e, item.author!)}
                >
                  <FaUser className="author-icon" />
                </span>
              )}
            </span>
            <div className="download-overlay">
              <FaDownload className="download-icon" />
            </div>
          </div>
          <div className="item-content">
            <h3 className="item-name">{item.label}</h3>
          </div>
        </div>
      ))}
      
      {visibleItemCount < items.length && (
        <div 
          ref={loadMoreRef} 
          className="load-more-trigger"
          style={{ height: '20px', margin: '20px auto', textAlign: 'center' }}
        >
          <span className="loading-spinner">Loading more items...</span>
        </div>
      )}
    </>
  );
}

export default ItemGrid;
