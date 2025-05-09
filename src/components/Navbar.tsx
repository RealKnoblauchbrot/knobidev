import { useState } from 'react';
import { Link } from 'react-router-dom';
import { siteConfig } from '@data';
import { FaGithub, FaChevronDown } from 'react-icons/fa';
import '@styles/Navbar.css';

interface NavbarProps {
  activeSection: string;
}

function Navbar({ activeSection }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Filter projects that should appear in dropdown
  const dropdownProjects = siteConfig.projects.items.filter(project => project.showInDropdown === true);
  // Check if we have any projects to show in dropdown
  const hasDropdownProjects = dropdownProjects.length > 0;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (isDropdownOpen) setIsDropdownOpen(false);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
  };

  const toggleDropdown = (e: React.MouseEvent) => {
    if (!hasDropdownProjects) return; // Don't toggle if no projects
    e.preventDefault();
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <>
      <nav className="navbar">
        <div className="container">
          <Link to="/" className={activeSection === 'home' ? 'logo active' : 'logo'} onClick={closeMenu}>
            <img src="/assets/logo.webp" alt="KB" />
          </Link>

          <button className="mobile-menu-button" onClick={toggleMenu} aria-label="Toggle menu">
            <div className={`hamburger ${isMenuOpen ? 'open' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>

          <ul className={`nav-links ${isMenuOpen ? 'menu-open' : ''}`}>
            <li>
              <Link
                to="/#about"
                className={activeSection === 'about' ? 'active' : ''}
                onClick={closeMenu}
              >
                About
              </Link>
            </li>
            <li>
              <Link
                to="/#skills"
                className={activeSection === 'skills' ? 'active' : ''}
                onClick={closeMenu}
              >
                Skills
              </Link>
            </li>
            <li className={hasDropdownProjects ? "dropdown" : ""}>
              <Link
                to="/#projects"
                className={activeSection === 'projects' ? 'active' : ''}
                onClick={hasDropdownProjects ? toggleDropdown : closeMenu}
              >
                Projects {hasDropdownProjects && (
                  <FaChevronDown className={`dropdown-arrow ${isDropdownOpen ? 'open' : ''}`} />
                )}
              </Link>

              {hasDropdownProjects && (
                <ul className={`dropdown-menu ${isDropdownOpen ? 'open' : ''}`}>
                  {dropdownProjects.map((project, index) => (
                    <li key={index}>
                      <Link
                        to={project.link || '/'}
                        onClick={closeMenu}
                      >
                        {project.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
            <li>
              <Link
                to="/#contact"
                className={activeSection === 'contact' ? 'active' : ''}
                onClick={closeMenu}
              >
                Contact
              </Link>
            </li>
            <li className="github-link">
              <a
                href="https://github.com/RealKnoblauchbrot/knobidev"
                target="_blank"
                rel="noopener noreferrer"
                title="View source on GitHub"
              >
                <FaGithub size={24} />
              </a>
            </li>
          </ul>
        </div>
      </nav>
      <div className="opensource-banner">
        <div className="container">
          We<span className="heart">❤️</span>Open Source
        </div>
      </div>
    </>
  );
}

export default Navbar;
