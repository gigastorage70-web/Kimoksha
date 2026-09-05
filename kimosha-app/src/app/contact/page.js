import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ContactClient from './ContactClient';

export const metadata = {
  title: 'Contact NOC & Bilateral Interconnect Onboarding | Kimosha Telecom',
  description:
    'Initiate bilateral carrier interconnect onboarding with Kimosha Telecom. Access our 24/7 Network Operations Center (NOC) severity escalation matrix, request wholesale rate decks, or connect with our routing desks in Dubai, London, Frankfurt, and Singapore.',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Contact NOC & Bilateral Interconnect Onboarding | Kimosha Telecom',
    description:
      'Initiate bilateral carrier interconnect onboarding with Kimosha Telecom. Access 24/7 NOC severity escalation matrix and wholesale routing desks.',
    url: 'https://www.kimokshatelco.com/contact',
    images: ['/kimoksha-logo-clean.png'],
  },
};

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main id="main-content">
        <ContactClient />
      </main>
      <Footer />
    </>
  );
}
