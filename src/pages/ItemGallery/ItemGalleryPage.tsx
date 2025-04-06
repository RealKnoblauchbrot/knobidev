import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import Footer from '@components/Footer';
import Navbar from '@components/Navbar';
import '@styles/ItemGallery.css';

import ItemGalleryHeader from './components/ItemGalleryHeader';
import ItemGalleryFilters from './components/ItemGalleryFilters';
import ItemGrid from './components/ItemGrid';
import { 
  GalleryItem, Author, ItemGalleryConfig, 
  ITEMS_PER_PAGE, LOADING_ANIMATION_DURATION_MS, 
  LOADING_HIDE_DELAY_MS, DATA_LOADING_TIMEOUT_MS 
} from './types';

function ItemGalleryPage() {
  const [activeSection] = useState('itemgallery');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSideCategories, setSelectedSideCategories] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [visibleItemCount, setVisibleItemCount] = useState(ITEMS_PER_PAGE);
  
  const [galleryConfig, setGalleryConfig] = useState<ItemGalleryConfig | null>(null);
  const [licenseTypes, setLicenseTypes] = useState<Record<string, string>>({});
  const [authors, setAuthors] = useState<Record<string, Author>>({});
  const [dataLoaded, setDataLoaded] = useState(false);
  const [items, setItems] = useState<GalleryItem[]>([]);

  useEffect(() => {
    const fetchGalleryData = async () => {
      try {
        startLoading();
        const [configResponse, itemsResponse] = await Promise.all([
          fetch('/data/itemGalleryConfig.json'),
          fetch('/data/items.json')
        ]);
        
        if (!configResponse.ok || !itemsResponse.ok) {
          throw new Error('Failed to fetch gallery data');
        }
        
        const configData: ItemGalleryConfig = await configResponse.json();
        const itemsData: GalleryItem[] = await itemsResponse.json();
        
        setGalleryConfig(configData);
        setItems(itemsData);
        setLicenseTypes(configData.licenseTypes || {});
        setAuthors(configData.authors || {});
        setDataLoaded(true);
      } catch (error) {
        console.error('Error loading gallery data:', error);
      }
    };

    fetchGalleryData();
  }, []);

  const allCategories = items.length ? [...new Set(
    items.flatMap(item => item.category)
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

  const filteredItems = items.filter(item => {
    const matchesCategories = selectedCategories.length === 0 ||
      selectedCategories.every(cat => item.category.includes(cat));

    const matchesSideCategories = selectedSideCategories.length === 0 ||
      (item.sidecategory && selectedSideCategories.every(cat => item.sidecategory?.includes(cat)));

    const matchesSearch = item.label.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategories && matchesSideCategories && matchesSearch;
  });

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

        const progress = Math.min(100, Math.floor((elapsed / LOADING_ANIMATION_DURATION_MS) * 100));
        setLoadingProgress(progress);

        if (progress < 100) {
          animationFrameId = requestAnimationFrame(animate);
        } else {
          setTimeout(() => setLoading(false), LOADING_HIDE_DELAY_MS);
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
      setTimeout(() => setLoading(false), LOADING_HIDE_DELAY_MS);
    }
  }, [filteredItems, loading, loadingProgress, dataLoaded]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (dataLoaded) {
        setLoadingProgress(100);
        setTimeout(() => setLoading(false), LOADING_HIDE_DELAY_MS);
      }
    }, DATA_LOADING_TIMEOUT_MS);

    return () => clearTimeout(timer);
  }, [dataLoaded]);

  const handleItemDownload = (item: GalleryItem) => {
    try {
      const link = document.createElement('a');
      link.href = `/assets/items/${item.file}.webp`;
      link.download = `${item.file}.webp`;
      link.rel = 'noopener';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      console.log(`Download started for: ${item.label}`);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const handleAuthorClick = (event: React.MouseEvent, authorId: string) => {
    event.stopPropagation(); // Prevent triggering the download
    if (authors[authorId]?.link) {
      window.open(authors[authorId].link, '_blank', 'noopener,noreferrer');
    }
  };

  useEffect(() => {
    setVisibleItemCount(ITEMS_PER_PAGE);
  }, [selectedCategories, selectedSideCategories, searchTerm]);

  return (
    <div>
      <Navbar activeSection={activeSection} />

      <div className="container page-content">
        <ItemGalleryHeader 
          licenseTypes={licenseTypes}
          loading={loading}
          loadingProgress={loadingProgress}
        />

        {!dataLoaded && !loading && (
          <div className="loading-error">
            <p>Failed to load gallery data. Please try refreshing the page.</p>
          </div>
        )}

        {dataLoaded && (
          <>
            <ItemGalleryFilters 
              categories={allCategories}
              selectedCategories={selectedCategories}
              toggleCategory={toggleCategory}
              showAllCategories={showAllCategories}
              handleToggleCategories={handleToggleCategories}
              availableSideCategories={availableSideCategories}
              selectedSideCategories={selectedSideCategories}
              toggleSideCategory={toggleSideCategory}
              startLoading={startLoading}
              setSearchTerm={setSearchTerm}
              totalItems={items.length}
              filteredItems={filteredItems.length}
            />

            <div className="itemgallery-grid">
              <ItemGrid 
                items={filteredItems}
                visibleItemCount={visibleItemCount}
                setVisibleItemCount={setVisibleItemCount}
                handleItemDownload={handleItemDownload}
                handleAuthorClick={handleAuthorClick}
                authors={authors}
              />
            </div>
          </>
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
