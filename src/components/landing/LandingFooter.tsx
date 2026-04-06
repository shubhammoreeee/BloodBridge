import { Droplets, Instagram, Twitter, Linkedin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LandingFooter() {
  return (
    <footer className="bg-[var(--bg-dark)] pt-20 pb-10 border-t border-white/5 relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[var(--orange-800)]/20 blur-[150px] rounded-full translate-y-1/2 translate-x-1/4 pointer-events-none" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          
          {/* Col 1: Brand */}
          <div className="lg:col-span-4">
            <Link to="/" className="flex items-center gap-3 group cursor-pointer mb-6 w-fit">
              <Droplets className="text-[var(--orange-500)] w-8 h-8" fill="currentColor" />
              <span className="text-2xl font-black tracking-tight font-display text-white group-hover:text-[var(--orange-200)] transition-colors">
                BloodBridge
              </span>
            </Link>
            <p className="font-body text-[var(--text-muted)] text-sm leading-relaxed mb-8 max-w-[280px]">
              Connecting life. One drop at a time. The world's fastest emergency blood matching network.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-[var(--orange-500)] hover:bg-[var(--orange-500)]/10 transition-all">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-[var(--orange-500)] hover:bg-[var(--orange-500)]/10 transition-all">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-[var(--orange-500)] hover:bg-[var(--orange-500)]/10 transition-all">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Product */}
          <div className="lg:col-span-2">
            <h4 className="font-display font-bold text-white mb-6 uppercase tracking-widest text-xs">Product</h4>
            <ul className="space-y-4">
              {['How It Works', 'Donor Portal', 'Hospital Portal', 'Leaderboard', 'Blood Inventory'].map((link) => (
                <li key={link}>
                  <a href="#" className="font-body text-sm text-[var(--text-muted)] hover:text-[var(--orange-400)] transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Company */}
          <div className="lg:col-span-2">
            <h4 className="font-display font-bold text-white mb-6 uppercase tracking-widest text-xs">Company</h4>
            <ul className="space-y-4">
              {['About Us', 'Our Mission', 'Press Kit', 'Careers', 'Contact'].map((link) => (
                <li key={link}>
                  <a href="#" className="font-body text-sm text-[var(--text-muted)] hover:text-[var(--orange-400)] transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Legal & Newsletter */}
          <div className="lg:col-span-4">
            <h4 className="font-display font-bold text-white mb-6 uppercase tracking-widest text-xs">Updates</h4>
            <p className="font-body text-sm text-[var(--text-muted)] mb-4">
              Get notified about new features and emergency updates in your region.
            </p>
            <form className="relative mb-8" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-white/5 border border-white/10 rounded-full h-12 pl-5 pr-12 text-sm text-white focus:outline-none focus:border-[var(--orange-500)] focus:bg-white/10 transition-all placeholder:text-[var(--text-muted)]"
              />
              <button
                type="submit"
                className="absolute right-1 top-1 bottom-1 w-10 bg-[var(--orange-600)] hover:bg-[var(--orange-500)] rounded-full flex items-center justify-center text-white transition-colors"
                aria-label="Subscribe"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
            <div className="flex gap-6">
              <a href="#" className="font-body text-xs text-[var(--text-muted)] hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="font-body text-xs text-[var(--text-muted)] hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-body text-xs text-white/30">
            © 2025 BloodBridge. Made with ❤️ for India.
          </p>
          <p className="font-display text-sm text-white/50 italic font-bold">
            "Every drop counts."
          </p>
        </div>

      </div>
    </footer>
  );
}
