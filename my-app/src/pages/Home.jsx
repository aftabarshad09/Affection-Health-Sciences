import Hero from '../components/Hero';
import FAQ from '../components/FAQ';
import '../style/Home.css';
import About from '../components/About';
import ContactSection from '../components/contact';
import NewsletterStrip from '../components/Newsletter';
import WheelServices from '../components/wheel';

const Home = () => {

  return (
    <div className="home-page">
      <Hero />
      <About />
      <WheelServices />
      <ContactSection />
      <FAQ />
      <NewsletterStrip />
    </div>
  );
};

export default Home;
