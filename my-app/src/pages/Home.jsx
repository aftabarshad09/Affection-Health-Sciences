import Hero from '../components/Hero';
import FAQ from '../components/FAQ';
import '../style/Home.css';
import About from '../components/About';
import ContactSection from '../components/contact';
import BlogSection from '../components/BlogSection';
import NewsletterStrip from '../components/Newsletter';
import WheelServices from '../components/wheel';
import Logostrip from '../components/Logostrip';
const Home = () => {

  return (
    <div className="home-page">
      <Hero />
      <About />
<Logostrip />
      
      <WheelServices />
      <BlogSection />
      <ContactSection />
      <FAQ />
      <NewsletterStrip />
    </div>
  );
};

export default Home;
