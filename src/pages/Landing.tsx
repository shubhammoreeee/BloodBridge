import LandingNavbar from '../components/landing/LandingNavbar';
import HeroSection from '../components/landing/HeroSection';
import Statsband from '../components/landing/Statsband';
import HowItWorks from '../components/landing/HowItWorks';
import FeatureGrid from '../components/landing/FeatureGrid';
import CommunitySection from '../components/landing/CommunitySection';
import Testimonials from '../components/landing/Testimonials';
import FinalCTA from '../components/landing/FinalCTA';
import LandingFooter from '../components/landing/LandingFooter';

export default function Landing() {
  return (
    <main className="w-full min-h-screen bg-[var(--bg-primary)] font-body text-[var(--text-primary)] selection:bg-[var(--orange-200)] selection:text-[var(--orange-900)] overflow-x-hidden">
      <LandingNavbar />
      
      <div id="hero">
        <HeroSection />
      </div>

      <div id="stats">
        <Statsband />
      </div>

      <div id="how-it-works">
        <HowItWorks />
      </div>

      <div id="features">
        <FeatureGrid />
      </div>

      <div id="leaderboard">
        <CommunitySection />
      </div>

      <div id="testimonials">
        <Testimonials />
      </div>

      <div id="cta">
        <FinalCTA />
      </div>

      <LandingFooter />
    </main>
  );
}
