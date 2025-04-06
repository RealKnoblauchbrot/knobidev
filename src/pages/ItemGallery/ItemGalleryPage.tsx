import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Footer from '@components/Footer';
import Navbar from '@components/Navbar';
import '@styles/ItemGallery.css';
import { FaSearch, FaDownload, FaInfoCircle, FaArrowLeft } from 'react-icons/fa';

export interface GalleryItem {
  name: string;
  category: string[];
  sidecategory?: string[];
  license?: string;
}

export interface ItemGalleryConfig {
  title: string;
  description: string;
  sidecategories?: Record<string, string[]>;
  licenseTypes: Record<string, string>;
  items: GalleryItem[];
}

const formatItemName = (name: string) => {
  return name
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

function ItemGalleryPage() {
  const [activeSection, _] = useState('itemgallery');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSideCategories, setSelectedSideCategories] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const searchTimeoutRef = useRef<number | null>(null);
  const [showLicenseInfo, setShowLicenseInfo] = useState(false);

  const ITEMS_PER_PAGE = 12; // Number of items to load at a time
  const [visibleItemCount, setVisibleItemCount] = useState(ITEMS_PER_PAGE);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const [galleryConfig, setGalleryConfig] = useState<ItemGalleryConfig | null>(null);
  const [licenseTypes, setLicenseTypes] = useState<Record<string, string>>({});
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    const fetchGalleryData = async () => {
      try {
        startLoading();
        const response = await fetch('/data/itemGalleryConfig.json');
        if (!response.ok) {
          throw new Error('Failed to fetch gallery data');
        }
        const data: ItemGalleryConfig = await response.json();
        setGalleryConfig(data);
        setLicenseTypes(data.licenseTypes || {});
        setDataLoaded(true);
      } catch (error) {
        console.error('Error loading gallery data:', error);
      }
    };

    fetchGalleryData();
  }, []);

  const allCategories = galleryConfig ? [...new Set(
    galleryConfig.items.flatMap(item => item.category)
  )] : [];

  const availableSideCategories = useMemo(() => {
    if (!galleryConfig || selectedCategories.length === 0) return [];

    let sideCategories: string[] = [];

    selectedCategories.forEach(mainCat => {
      if (galleryConfig.sidecategories && galleryConfig.sidecategories[mainCat]) {
        sideCategories = [...sideCategories, ...galleryConfig.sidecategories[mainCat]];
      }
    });

    return [...new Set(sideCategories)];
  }, [galleryConfig, selectedCategories]);

  const initialCategoryCount = 5;
  const visibleCategories = showAllCategories
    ? allCategories
    : allCategories.slice(0, initialCategoryCount);

  const filteredItems = galleryConfig ? galleryConfig.items.filter(item => {
    const matchesCategories = selectedCategories.length === 0 ||
      selectedCategories.every(cat => item.category.includes(cat));

    const matchesSideCategories = selectedSideCategories.length === 0 ||
      (item.sidecategory && selectedSideCategories.every(cat => item.sidecategory?.includes(cat)));

    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategories && matchesSideCategories && matchesSearch;
  }) : [];

  const toggleCategory = (category: string) => {
    startLoading();

    if (selectedCategories.includes(category)) {
      setSelectedCategories(prev => prev.filter(cat => cat !== category));
      if (selectedCategories.length <= 1) {
        setSelectedSideCategories([]);
      }
    } else {
      setSelectedCategories(prev => [...prev, category]);
    }
  };

  const toggleSideCategory = (category: string) => {
    startLoading();
    setSelectedSideCategories(prev =>
      prev.includes(category)
        ? prev.filter(cat => cat !== category)
        : [...prev, category]
    );
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    startLoading();
    const value = e.target.value;

    if (searchTimeoutRef.current) {
      window.clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = window.setTimeout(() => {
      setSearchTerm(value);
    }, 300);
  };

  const handleToggleCategories = () => {
    startLoading();
    setShowAllCategories(!showAllCategories);
  };

  const startLoading = () => {
    setLoading(true);
    setLoadingProgress(0);
  };

  useEffect(() => {
    if (loading) {
      let start: number | null = null;
      let animationFrameId: number;

      const animate = (timestamp: number) => {
        if (!start) start = timestamp;
        const elapsed = timestamp - start;

        const progress = Math.min(100, Math.floor((elapsed / 400) * 100));
        setLoadingProgress(progress);

        if (progress < 100) {
          animationFrameId = requestAnimationFrame(animate);
        } else {
          setTimeout(() => setLoading(false), 100);
        }
      };

      animationFrameId = requestAnimationFrame(animate);

      return () => {
        cancelAnimationFrame(animationFrameId);
      };
    }
  }, [loading]);

  useEffect(() => {
    if ((dataLoaded && filteredItems.length > 0) && loading && loadingProgress > 50) {
      setLoadingProgress(100);
      setTimeout(() => setLoading(false), 100);
    }
  }, [filteredItems, loading, loadingProgress, dataLoaded]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (dataLoaded) {
        setLoadingProgress(100);
        setTimeout(() => setLoading(false), 100);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [dataLoaded]);

  const handleItemDownload = (item: GalleryItem) => {
    try {
      const link = document.createElement('a');
      link.href = `/assets/items/${item.name}.webp`;
      link.download = `${formatItemName(item.name)}.webp`;
      link.rel = 'noopener';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      console.log(`Download started for: ${formatItemName(item.name)}`);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const loadMoreItems = useCallback(() => {
    setVisibleItemCount(prevCount => prevCount + ITEMS_PER_PAGE);
  }, []);

  useEffect(() => {
    if (!loadMoreRef.current || filteredItems.length <= visibleItemCount) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          loadMoreItems();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(loadMoreRef.current);

    return () => {
      observer.disconnect();
    };
  }, [filteredItems.length, visibleItemCount, loadMoreItems]);

  useEffect(() => {
    setVisibleItemCount(ITEMS_PER_PAGE);
  }, [selectedCategories, selectedSideCategories, searchTerm]);

  return (
    <div>
      <Navbar activeSection={activeSection} />

      <div className="container page-content">
        <div className="itemgallery-header">
          <h1 className="section-title">Lore Friendly Item Gallery</h1>
          <div className="disclaimer">
            <strong className="disclaimer-title">Disclaimer:</strong>
            <p>
              This image gallery is a community-driven project that aggregates visual assets from various open-source or public repositories. 
              All images are credited where possible, with sources including but not limited to:
            </p>
            <ul className="source-list">
              <li><a href="https://github.com/bitc0de/fivem-items-gallery" target="_blank" rel="noopener noreferrer">bitc0de/fivem-items-gallery</a></li>
              <li><a href="https://github.com/McKleans-Scripts/mk-items" target="_blank" rel="noopener noreferrer">McKleans-Scripts/mk-items</a></li>
              <li><a href="https://github.com/Griefa/gfa-items" target="_blank" rel="noopener noreferrer">Griefa/gfa-items</a></li>
              <li><a href="https://github.com/TankieTwitch/FREE-FiveM-Image-Library" target="_blank" rel="noopener noreferrer">TankieTwitch/FREE-FiveM-Image-Library</a></li>
              <li><a href="https://github.com/TankieTwitch/FREE-RedM-Image-Library" target="_blank" rel="noopener noreferrer">TankieTwitch/FREE-RedM-Image-Library</a></li>
            </ul>
            <p>
              We do not claim ownership or licensing rights over these images unless explicitly stated. 
              Images with unclear or missing license information will be marked as <strong>UNLICENSED</strong>. 
              All rights remain with the original creators.
            </p>
            <p>
              If you are a copyright holder and have concerns about attribution or usage, 
              please <Link to="/#contact" className="contact-link">contact me</Link> for removal or correction.
            </p>
          </div>

          <div className="license-legend-toggle">
            <button onClick={() => setShowLicenseInfo(!showLicenseInfo)} className="license-info-button">
              <FaInfoCircle className="info-icon" /> {showLicenseInfo ? 'Hide' : 'Show'} License Glossary
            </button>

            {showLicenseInfo && (
              <div className="license-legend">
                <h4>License Types</h4>
                <ul>
                  {Object.entries(licenseTypes).map(([code, description]) => (
                    <li key={code}>
                      <span className="license-code">{code}</span> - {description}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {loading && (
            <div className="loading-bar-container">
              <div
                className="loading-bar"
                style={{ width: `${loadingProgress}%` }}
              ></div>
            </div>
          )}

          {dataLoaded && (
            <div className="itemgallery-filters">
              <div className="category-filters">
                {visibleCategories.map(category => (
                  <button
                    key={category}
                    className={`category-filter ${selectedCategories.includes(category) ? 'active' : ''}`}
                    onClick={() => toggleCategory(category)}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}

                {allCategories.length > initialCategoryCount && (
                  <button
                    className="category-filter more-button"
                    onClick={handleToggleCategories}
                  >
                    {showAllCategories ? 'Less' : 'More'}
                  </button>
                )}
              </div>

              {selectedCategories.length > 0 && availableSideCategories.length > 0 && (
                <div className="side-category-filters">
                  {availableSideCategories.map(category => (
                    <button
                      key={category}
                      className={`side-category-filter ${selectedSideCategories.includes(category) ? 'active' : ''}`}
                      onClick={() => toggleSideCategory(category)}
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </button>
                  ))}
                </div>
              )}

              <div className="search-container">
                <input
                  type="text"
                  placeholder="Search items..."
                  onChange={handleSearchChange}
                  className="search-input"
                />
                <FaSearch className="search-icon" />
              </div>
            </div>
          )}
        </div>

        {!dataLoaded && !loading && (
          <div className="loading-error">
            <p>Failed to load gallery data. Please try refreshing the page.</p>
          </div>
        )}

        {dataLoaded && (
          <div className="itemgallery-grid">
            {filteredItems.length > 0 ? (
              <>
                {filteredItems.slice(0, visibleItemCount).map((item, index) => (
                  <div
                    className="item-card"
                    key={index}
                    onClick={() => handleItemDownload(item)}
                    title={`Click to download ${formatItemName(item.name)}`}
                  >
                    <div className="item-image-container">
                      <img
                        src={`/assets/items/${item.name}.webp`}
                        alt={formatItemName(item.name)}
                        className="item-image"
                        loading="lazy"
                      />
                      <span className="license-badge">
                        {item.license || 'UNL'}
                      </span>
                      <div className="download-overlay">
                        <FaDownload className="download-icon" />
                      </div>
                    </div>
                    <div className="item-content">
                      <h3 className="item-name">{formatItemName(item.name)}</h3>
                    </div>
                  </div>
                ))}
                {visibleItemCount < filteredItems.length && (
                  <div 
                    ref={loadMoreRef} 
                    className="load-more-trigger"
                    style={{ height: '20px', margin: '20px auto', textAlign: 'center' }}
                  >
                    <span className="loading-spinner">Loading more items...</span>
                  </div>
                )}
              </>
            ) : (
              <div className="no-items-found">
                <p>No items found matching your search criteria.</p>
              </div>
            )}
          </div>
        )}

        <div className="back-to-home">
          <Link to="/" className="back-link"><FaArrowLeft /> Back to Home</Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default ItemGalleryPage;
