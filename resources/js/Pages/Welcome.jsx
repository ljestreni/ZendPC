import { Head, Link } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { motion } from 'framer-motion';

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="Welcome | ZendPC" />
            <div className="min-h-screen bg-[#080a11] text-slate-200 selection:bg-indigo-500/30 font-sans flex flex-col relative overflow-hidden">
                {/* Background FX */}
                <div className="fixed top-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>
                <div className="fixed bottom-[-10%] right-[-10%] w-[800px] h-[800px] bg-purple-600/5 blur-[150px] rounded-full pointer-events-none -z-10"></div>

                {/* Minimalist Navbar */}
                <header className="absolute top-0 w-full z-50">
                    <div className="max-w-[1700px] mx-auto px-6 h-24 flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-4 group">
                            <ApplicationLogo className="h-10 md:h-12 w-auto group-hover:scale-105 transition-transform duration-500 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]" />
                        </Link>
                        <nav className="flex items-center gap-6">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="px-6 py-2.5 rounded-2xl bg-white/[0.03] border border-white/5 text-[10px] font-black uppercase tracking-widest hover:bg-white/[0.08] transition-all"
                                >
                                    Ir a Mi Taller
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-500/50 shadow-[0_0_20px_rgba(79,70,229,0.3)] text-[10px] font-black uppercase tracking-widest transition-all"
                                    >
                                        Registrarse
                                    </Link>
                                </>
                            )}
                        </nav>
                    </div>
                </header>

                {/* Hero Section */}
                <main className="flex-1 flex items-center justify-center relative z-10 px-6 py-32">
                    <div className="max-w-5xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/[0.03] border border-white/10 mb-8"
                        >
                            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_10px_rgba(99,102,241,0.8)]"></span>
                            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-indigo-300">Premium PC Builder V2</span>
                        </motion.div>

                        <motion.h1 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                            className="text-5xl md:text-7xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-200 to-slate-500 uppercase italic tracking-tighter leading-[0.9] mb-8 drop-shadow-2xl"
                        >
                            Industrial Grade <br/>
                            <span className="text-indigo-500 bg-none drop-shadow-[0_0_30px_rgba(79,70,229,0.2)]">Custom Hardware</span>
                        </motion.h1>

                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                            className="text-slate-400 text-lg md:text-xl font-medium max-w-2xl mx-auto mb-12 leading-relaxed"
                        >
                            Orquesta tu sistema con precisión milimétrica. Nuestro configurador inteligente asegura compatibilidad y rendimiento absoluto.
                        </motion.p>

                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                            className="flex flex-col sm:flex-row items-center justify-center gap-6"
                        >
                            <Link href={route('builder.index')} className="group relative px-10 py-5 bg-indigo-600 text-white rounded-3xl font-black uppercase tracking-[0.2em] overflow-hidden transition-all hover:bg-indigo-500 hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto text-sm">
                                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
                                Entrar al Configurador
                            </Link>

                            <Link href={route('catalog.index')} className="px-10 py-5 bg-white/[0.03] text-white rounded-3xl font-black uppercase tracking-[0.2em] border border-white/10 hover:border-white/30 hover:bg-white/[0.05] transition-all w-full sm:w-auto text-sm">
                                Explorar Catálogo
                            </Link>
                        </motion.div>
                    </div>
                </main>

                <footer className="absolute bottom-0 w-full text-center py-8 z-10">
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-600">ZendPC Core Systems</p>
                </footer>
            </div>
        </>
    );
}
