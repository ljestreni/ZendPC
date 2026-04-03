import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen bg-[#080a11] text-slate-200 font-sans selection:bg-emerald-500/30 flex flex-col items-center justify-center relative overflow-hidden py-12 px-6">
            {/* Global Aura */}
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-600/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>
            
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="mb-10 text-center"
            >
                <Link href="/" className="inline-block group mx-auto">
                    <ApplicationLogo className="h-20 w-auto group-hover:scale-110 transition-transform duration-500 drop-shadow-[0_0_20px_rgba(16, 185, 129,,0.3)] mb-4" />
                    <span className="block text-2xl font-black text-white tracking-[0.2em] uppercase italic drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">ZEND<span className="text-emerald-500">PC</span></span>
                </Link>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
                className="w-full sm:max-w-md"
            >
                <div className="glass-card-premium p-8 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50"></div>
                    {children}
                </div>
            </motion.div>
            
            <div className="mt-12 text-center text-xs font-black uppercase tracking-[0.3em] text-slate-600">
                Industrial Grade Security
            </div>
        </div>
    );
}
