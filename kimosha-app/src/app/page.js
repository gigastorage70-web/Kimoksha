import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import CarrierMarquee from '../components/CarrierMarquee';
import ServicesGrid from '../components/ServicesGrid';
import CarrierNetworkMap from '../components/CarrierNetworkMap';
import TechnicalSpecs from '../components/TechnicalSpecs';
import Testimonial from '../components/Testimonial';
import CtaBanner from '../components/CtaBanner';
import InterconnectForm from '../components/InterconnectForm';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main-content">
        <Hero />
        <CarrierMarquee />
        <ServicesGrid />
        <CarrierNetworkMap />
        <TechnicalSpecs />
        <Testimonial />
        <CtaBanner />
        <InterconnectForm />
      </main>
      <Footer />
    </>
  );
}
