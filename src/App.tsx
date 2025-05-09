import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '@styles/App.css';
import Footer from '@components/Footer';
import Navbar from '@components/Navbar';
import { siteConfig, getEnhancedProjects, Project, isGitHubUrl } from '@data';
import { FaStar, FaCodeBranch, FaCode, FaLaptopCode, FaDatabase, FaLanguage, FaNetworkWired, FaDiscord } from 'react-icons/fa';

// Icon mapping object
const iconMap = {
  FaCode,
  FaLaptopCode,
  FaDatabase,
  FaLanguage,
  FaNetworkWired
};

function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [projects, setProjects] = useState<Project[]>(siteConfig.projects.items);
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  // Handle hash navigation and scroll to section
  useEffect(() => {
    const hash = location.hash;
    if (hash) {
      const sectionId = hash.substring(1); // Remove the # character
      setActiveSection(sectionId);
      
      // Scroll to the section
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  useEffect(() => {
    const observerOptions = {
      root: null, 
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0 
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.getAttribute('id') || '';
          setActiveSection(sectionId);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    document.querySelectorAll('section[id]').forEach(section => {
      observer.observe(section);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  // Fetch GitHub languages data
  useEffect(() => {
    const fetchProjectData = async () => {
      setLoading(true);
      try {
        const enhancedProjects = await getEnhancedProjects();
        setProjects(enhancedProjects);
      } catch (error) {
        console.error("Failed to fetch project data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, []);

  return (
    <div>
      <Navbar activeSection={activeSection} />
      <div className="container">
        <section id="home" className="hero">
          <h1>Knoblauchbrot</h1>
          <h2>Junior Developer from Germany</h2>
          <p className="tagline">Building beautiful digital experiences with modern technologies.</p>
          <a href="#contact" className="cta-button">Get in Touch</a>
        </section>

        <section id="about" className="section">
          <h2 className="section-title">About Me</h2>
          <div className="about-content">
            <div className="about-text">
              <p>Hi there! I'm Knoblauchbrot, but you can call me Knobi for short. I'm a passionate junior developer with a focus on creating scripts and modding games.</p>
              <p>Based in Germany, I love solving complex problems with clean, efficient code and continuously expanding my development skills.</p>
            </div>
          </div>
        </section>

        <section id="skills" className="section">
          <h2 className="section-title">{siteConfig.skills.title}</h2>
          <div className="skills-grid">
            {siteConfig.skills.items.map((skill, index) => {
              // Get icon component from the mapping
              const IconComponent = iconMap[skill.iconName as keyof typeof iconMap] || FaCode;
              
              return (
                <div className="skill-card" key={index}>
                  <IconComponent className="skill-icon" />
                  <span className="skill-name">{skill.name}</span>
                  {skill.description && <p className="skill-description">{skill.description}</p>}
                </div>
              );
            })}
          </div>
        </section>

        <section id="projects" className="section">
          <h2 className="section-title">{siteConfig.projects.title}</h2>
          <div className="projects-grid">
            {loading && <p>Loading project data...</p>}
            {projects.map((project, index) => (
              <div className="project-card" key={index}>
                <div className="project-content">
                  <div className="project-header">
                    <h3>{project.title}</h3>
                    {project.isContributor && (
                      <span className="contributor-badge" title="Contributor">Contributor</span>
                    )}
                  </div>
                  
                  <p>{project.description}</p>
                  
                  {project.stars !== undefined && (
                    <div className="repo-stats">
                      <span className="repo-stat" title="Stars">
                        <FaStar className="star-icon" /> {project.stars}
                      </span>
                      
                      {project.forks !== undefined && (
                        <span className="repo-stat" title="Forks">
                          <FaCodeBranch className="fork-icon" /> {project.forks}
                        </span>
                      )}
                    </div>
                  )}
                  
                  <div className="project-technologies">
                    {project.technologies && project.technologies.map((tech, techIndex) => (
                      <span className="tech-tag" key={`manual-${techIndex}`}>{tech}</span>
                    ))}
                    
                    {project.fetchedTechnologies && project.fetchedTechnologies
                      .filter(tech => !project.technologies?.includes(tech))
                      .map((tech, techIndex) => (
                        <span className="tech-tag github-tech" key={`github-${techIndex}`}>
                          {tech}
                        </span>
                      ))
                    }
                  </div>
                </div>
                
                <div className="project-links">
                  {project.link && (
                    <Link 
                      to={project.link} 
                      className="project-link" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      {isGitHubUrl(project.link) ? 'View Code' : 'View Project'}
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="contact" className="section">
          <h2 className="section-title">
            {siteConfig.contact.title}
          </h2>
          <div className="contact-content">
            <p>{siteConfig.contact.message}</p>
            <a href={siteConfig.contact.discord} className="contact-link">
              <FaDiscord className="contact-icon" /> Discord
            </a>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}

export default App;
