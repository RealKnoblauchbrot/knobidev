import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaInfoCircle } from 'react-icons/fa';

interface ItemGalleryHeaderProps {
  licenseTypes: Record<string, string>;
  loading: boolean;
  loadingProgress: number;
}

function ItemGalleryHeader({ licenseTypes, loading, loadingProgress }: ItemGalleryHeaderProps) {
  const [showLicenseInfo, setShowLicenseInfo] = useState(false);

  return (
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
    </div>
  );
}

export default ItemGalleryHeader;
