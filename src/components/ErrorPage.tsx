import { useNavigate } from 'react-router-dom';
import Footer from './Footer';
import Navbar from './Navbar';

const ErrorPage = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1); 
  };

  const goHome = () => {
    navigate('/');
  };

  return (
    <div>
      <Navbar activeSection="" />

      <div className="container">
        <section className="section error-page">
          <h1>404</h1>
            <h2>Page {window.location.pathname} Not Found</h2>
          <p className="tagline">The page you are looking for doesn't exist or has been moved.</p>
          
          <div className="error-actions">
            <button onClick={goBack} className="cta-button">
              Return to Last Page
            </button>
            <button onClick={goHome} className="cta-button">
              Go Home
            </button>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default ErrorPage;
