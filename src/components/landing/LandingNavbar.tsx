import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Droplets, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { useAppStore } from '../../store/useAppStore';

export default function LandingNavbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const navigate = useNavigate();
    const { role } = useAppStore();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={cn(
                'fixed top-0 left-0 right-0 z-[100] transition-all duration-300',
                isScrolled
                    ? 'glass py-3 border-b border-[var(--border-light)] shadow-sm'
                    : 'bg-transparent py-6'
            )}
        >
            <div className="container mx-auto px-4 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-3 group cursor-pointer">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110">
                        <Droplets className="text-[var(--orange-500)] w-8 h-8" fill="currentColor" />
                    </div>
                    <span className="text-2xl font-black tracking-tight font-display text-[var(--text-primary)]">
                        BloodBridge
                    </span>
                </Link>

                {/* Desktop Links */}
                <div className="hidden lg:flex items-center gap-8 px-8">
                    {['About', 'How It Works', 'Leaderboard', 'For Hospitals'].map((item) => (
                        <button 
                            key={item}
                            onClick={() => scrollToSection(item.toLowerCase().replace(/ /g, '-'))}
                            className="relative text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--orange-600)] transition-colors group"
                        >
                            {item}
                            <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[var(--orange-500)] transition-all duration-300 group-hover:w-full" />
                        </button>
                    ))}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4">
                    {role ? (
                        <button
                            onClick={() => navigate(role === 'donor' ? '/donor' : '/admin')}
                            className="bg-[var(--bg-card)] text-[var(--orange-600)] border border-[var(--border-orange)] px-6 py-2.5 rounded-full font-bold text-sm shadow-sm hover:scale-[1.02] transition-all flex items-center gap-2"
                        >
                            Go to Dashboard <ArrowRight className="w-4 h-4" />
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={() => navigate('/login')}
                                className="hidden sm:block text-sm font-bold text-[var(--orange-600)] border border-[var(--border-orange)] px-6 py-2.5 rounded-full hover:bg-[var(--orange-50)] transition-all"
                            >
                                Sign In
                            </button>
                            <button
                                onClick={() => navigate('/role-selection')}
                                className="blood-gradient text-white px-6 py-2.5 rounded-full font-bold text-sm shadow-md hover:shadow-lg hover:scale-[1.02] transition-all flex items-center gap-2"
                            >
                                Join as Donor <ArrowRight className="w-4 h-4" />
                            </button>
                        </>
                    )}
                </div>
            </div>
        </motion.nav>
    );
}
