import { useState } from 'react';

interface NavbarProps {
  activeSection: string;
}

function Navbar({ activeSection }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
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
          <li>
            <a 
              href="/#projects" 
              className={activeSection === 'projects' ? 'active' : ''}
              onClick={closeMenu}
            >
              Projects
            </a>
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
