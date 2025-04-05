import { siteConfig } from '@data';

function Footer() {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} Knoblauchbrot. All rights reserved.</p>
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
              {link.platform}
            </a>
          ))}
        </div>
      )}
    </footer>
  );
}

export default Footer;
