import Hero from '../components/Hero';
import FAQ from '../components/FAQ';
import '../style/Home.css';
import About from '../components/About';

const Home = () => {

  return (
    <div className="home-page">
      <Hero />
      <About />
      <FAQ />
    </div>
  );
};

export default Home;
