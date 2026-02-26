import { Droplets, Mail, Phone, Instagram, Twitter, Heart } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-stone-950 border-t border-white/5 pt-20 pb-10">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    <div className="space-y-6">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-blood-600 rounded-xl flex items-center justify-center">
                                <Droplets className="text-white w-6 h-6" />
                            </div>
                            <span className="text-xl font-bold tracking-tight text-white">
                                Blood<span className="text-blood-500">Bridge</span>
                            </span>
                        </div>
                        <p className="text-stone-500 text-sm leading-relaxed">
                            Empowering communities with real-time emergency blood donor matching. Every drop counts, every second matters.
                        </p>
                        <div className="flex items-center gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-stone-400 hover:bg-blood-600 hover:text-white transition-all"><Instagram className="w-5 h-5" /></a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-stone-400 hover:bg-blood-600 hover:text-white transition-all"><Twitter className="w-5 h-5" /></a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-stone-400 hover:bg-blood-600 hover:text-white transition-all"><Mail className="w-5 h-5" /></a>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6">Quick Links</h4>
                        <ul className="space-y-4 text-sm text-stone-500">
                            <li><a href="#" className="hover:text-blood-400 transition-colors">Emergency Request</a></li>
                            <li><a href="#" className="hover:text-blood-400 transition-colors">Donor Registration</a></li>
                            <li><a href="#" className="hover:text-blood-400 transition-colors">Nearby Blood Banks</a></li>
                            <li><a href="#" className="hover:text-blood-400 transition-colors">How it Works</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6">Support & Help</h4>
                        <ul className="space-y-4 text-sm text-stone-500">
                            <li><a href="#" className="hover:text-blood-400 transition-colors">1800-HELPLINE</a></li>
                            <li><a href="#" className="hover:text-blood-400 transition-colors">FAQ & Guidelines</a></li>
                            <li><a href="#" className="hover:text-blood-400 transition-colors">Health Tips</a></li>
                            <li><a href="#" className="hover:text-blood-400 transition-colors">Terms of Service</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6">Contact Us</h4>
                        <div className="space-y-4 text-sm text-stone-500">
                            <div className="flex items-center gap-3">
                                <Phone className="w-4 h-4 text-blood-500" />
                                <span>+1 (555) 000-HELP</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Mail className="w-4 h-4 text-blood-500" />
                                <span>support@bloodbridge.com</span>
                            </div>
                            <p className="mt-4 italic">Available 24/7 for emergency coordination.</p>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-10 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-stone-600">
                    <p>© 2026 BloodBridge. All rights reserved.</p>
                    <div className="flex items-center gap-1">
                        Made with <Heart className="w-3 h-3 text-blood-500" /> for the community.
                    </div>
                </div>
            </div>
        </footer>
    );
}
