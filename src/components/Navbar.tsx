import { useState } from 'react';
import { siteConfig } from '../data';

interface NavbarProps {
  activeSection: string;
}

function Navbar({ activeSection }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (isDropdownOpen) setIsDropdownOpen(false);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
  };
  
  const toggleDropdown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="navbar">
      <div className="container">
        <a href="/" className={activeSection === 'home' ? 'logo active' : 'logo'}>
          <img src="/assets/logo.webp" alt="KB" />
        </a>
        
        <button className="mobile-menu-button" onClick={toggleMenu} aria-label="Toggle menu">
          <div className={`hamburger ${isMenuOpen ? 'open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
        
        <ul className={`nav-links ${isMenuOpen ? 'menu-open' : ''}`}>
          <li>
            <a 
              href="/#about" 
              className={activeSection === 'about' ? 'active' : ''}
              onClick={closeMenu}
            >
              About
            </a>
          </li>
          <li>
            <a 
              href="/#skills" 
              className={activeSection === 'skills' ? 'active' : ''}
              onClick={closeMenu}
            >
              Skills
            </a>
          </li>
          <li className="dropdown">
            <a 
              href="/#projects" 
              className={activeSection === 'projects' ? 'active' : ''}
              onClick={toggleDropdown}
            >
              Projects <span className={`dropdown-arrow ${isDropdownOpen ? 'open' : ''}`}>▼</span>
            </a>
            <ul className={`dropdown-menu ${isDropdownOpen ? 'open' : ''}`}>
              {siteConfig.projects.items.map((project, index) => (
                <li key={index}>
                  <a 
                    href={project.link} 
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={closeMenu}
                  >
                    {project.title}
                  </a>
                </li>
              ))}
            </ul>
          </li>
          <li>
            <a 
              href="/#contact" 
              className={activeSection === 'contact' ? 'active' : ''}
              onClick={closeMenu}
            >
              Contact
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
