import { siteConfig } from '@data';
import { FaGithub, FaDiscord } from 'react-icons/fa';

function Footer() {
  // Function to get the appropriate icon component based on platform name
  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'github':
        return <FaGithub className="social-icon" />;
      case 'discord':
        return <FaDiscord className="social-icon" />;
      default:
        return null;
    }
  };

  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} Knoblauchbrot. This project is licensed under the MIT License.<br/>All third-party content are property of their respective owners and used with attribution where possible.</p>

      {siteConfig.footer.socialLinks.length > 0 && (
        <div className="social-links">
          {siteConfig.footer.socialLinks.map((link, index) => (
            <a 
              key={index}
              href={link.url} 
              className="social-link" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              {getSocialIcon(link.platform)} {link.platform}
            </a>
          ))}
        </div>
      )}
    </footer>
  );
}

export default Footer;
