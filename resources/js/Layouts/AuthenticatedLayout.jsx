import React, { useState, useEffect, useRef } from 'react';
import Dropdown from '@/Components/Dropdown';
import ApplicationLogo from '@/Components/ApplicationLogo';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import CartDrawer from '@/Components/CartDrawer';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const { cart } = usePage().props;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const prevTotalItems = useRef(cart?.total_items || 0);

    useEffect(() => {
        if (cart?.total_items > prevTotalItems.current) {
            setIsCartOpen(true);
        }
        prevTotalItems.current = cart?.total_items || 0;
    }, [cart?.total_items]);

    return (
        <div className="min-h-screen bg-[#080a11] text-slate-200 font-sans selection:bg-emerald-500/30 flex flex-col relative overflow-hidden">
            {/* Global Aura */}
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-emerald-600/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>

            <nav className="glass-nav border-b-white/5 border-b-[0.5px] sticky top-0 z-[60]">
                <div className="max-w-[1700px] mx-auto px-6">
                    <div className="flex justify-between h-20">
                        <div className="flex items-center">
                            <Link href="/" className="flex items-center gap-4 group">
                                <ApplicationLogo className="h-10 md:h-12 w-auto group-hover:scale-105 transition-transform duration-500 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]" />
                            </Link>

                            <div className="hidden lg:flex ml-20 items-center gap-12">
                                <Link href={route('catalog.index')} className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${route().current('catalog.index') ? 'text-white border-b-2 border-emerald-500 pb-1' : 'text-slate-400 hover:text-white'}`}>
                                    Catálogo
                                </Link>
                                <Link href={route('builder.index')} className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${route().current('builder.index') ? 'text-white border-b-2 border-emerald-500 pb-1' : 'text-slate-400 hover:text-white'}`}>
                                    Configurador
                                </Link>
                                <Link href={route('dashboard')} className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${route().current('dashboard') ? 'text-white border-b-2 border-emerald-500 pb-1' : 'text-slate-400 hover:text-white'}`}>
                                    Mi Taller
                                </Link>
                            </div>
                        </div>

                        <div className="hidden sm:flex sm:items-center gap-6">
                            <button onClick={() => setIsCartOpen(true)} className="relative p-2 text-slate-400 hover:text-white transition-colors group">
                                <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                {cart && cart.total_items > 0 && (
                                    <span className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4 bg-emerald-500 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full shadow-[0_0_10px_rgba(52, 211, 153,,0.5)]">
                                        {cart.total_items}
                                    </span>
                                )}
                            </button>

                            {user ? (
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <button className="flex items-center gap-4 px-5 py-2.5 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.07] transition-all group focus:outline-none">
                                            <div className="text-right hidden sm:block">
                                                <div className="text-[11px] font-black text-white uppercase tracking-tight leading-none mb-1">{user.name}</div>
                                                <div className="text-[9px] font-black text-emerald-500 uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">Panel Usuario</div>
                                            </div>
                                            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-black border border-emerald-500/10 shadow-inner">
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                        </button>
                                    </Dropdown.Trigger>
                                    <Dropdown.Content contentClasses="py-1 bg-[#0f121d] border border-white/5 rounded-xl shadow-2xl mt-2 w-56">
                                        {user.role === 'admin' && (
                                            <>
                                                <Dropdown.Link href={route('admin.categories.index')} className="text-slate-300 hover:bg-emerald-500/20 hover:text-emerald-400 text-sm font-medium">
                                                    Admin Categorías
                                                </Dropdown.Link>
                                                <Dropdown.Link href={route('admin.products.index')} className="text-slate-300 hover:bg-emerald-500/20 hover:text-emerald-400 text-sm font-medium">
                                                    Admin Productos
                                                </Dropdown.Link>
                                                <div className="border-t border-white/5 my-1"></div>
                                            </>
                                        )}
                                        <Dropdown.Link href={route('profile.edit')} className="text-slate-300 hover:bg-emerald-500/20 hover:text-emerald-400 text-sm font-medium">
                                            Perfil de Usuario
                                        </Dropdown.Link>
                                        <Dropdown.Link href={route('logout')} method="post" as="button" className="text-red-400 hover:bg-red-500/10 text-sm font-medium w-full text-left">
                                            Cerrar Sesión
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            ) : (
                                <div className="flex items-center gap-4">
                                    <Link href={route('login')} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors">
                                        Iniciar Sesión
                                    </Link>
                                    <Link href={route('register')} className="px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-500/50 shadow-[0_0_20px_rgba(16, 185, 129,,0.3)] text-[10px] font-black uppercase tracking-widest transition-all">
                                        Registrarse
                                    </Link>
                                </div>
                            )}
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <button onClick={() => setIsCartOpen(true)} className="relative p-2 mr-2 text-slate-400 hover:text-white transition-colors">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                {cart && cart.total_items > 0 && (
                                    <span className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4 bg-emerald-500 text-white text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-full shadow-[0_0_10px_rgba(52, 211, 153,,0.5)]">
                                        {cart.total_items}
                                    </span>
                                )}
                            </button>
                            <button
                                onClick={() => setShowingNavigationDropdown((p) => !p)}
                                className="inline-flex items-center justify-center rounded-xl p-2.5 text-slate-400 bg-white/[0.03] border border-white/5 transition-colors hover:text-white focus:outline-none"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                    <path className={showingNavigationDropdown ? 'inline-flex' : 'hidden'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile menu */}
                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden bg-[#0f121d] border-b border-white/5'}>
                    <div className="space-y-1 pb-3 pt-2 px-4 text-center">
                        <ResponsiveNavLink href={route('dashboard')} active={route().current('dashboard')}>Mi Taller</ResponsiveNavLink>
                        <ResponsiveNavLink href={route('catalog.index')} active={route().current('catalog.index')}>Catálogo</ResponsiveNavLink>
                        <ResponsiveNavLink href={route('builder.index')} active={route().current('builder.index')}>Configurador</ResponsiveNavLink>
                    </div>

                    <div className="border-t border-white/5 pb-1 pt-4 px-4 bg-white/[0.02]">
                        {user ? (
                            <>
                                <div className="flex items-center justify-center mb-4">
                                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/10 flex items-center justify-center font-bold shadow-lg mr-3">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="text-left">
                                        <div className="text-base font-bold text-white uppercase">{user.name}</div>
                                        <div className="text-xs text-slate-500">{user.email}</div>
                                    </div>
                                </div>

                                <div className="mt-4 space-y-1 pb-4">
                                    {user.role === 'admin' && (
                                        <>
                                            <ResponsiveNavLink href={route('admin.categories.index')}>Admin Categorías</ResponsiveNavLink>
                                            <ResponsiveNavLink href={route('admin.products.index')}>Admin Productos</ResponsiveNavLink>
                                        </>
                                    )}
                                    <ResponsiveNavLink href={route('profile.edit')}>Perfil</ResponsiveNavLink>
                                    <ResponsiveNavLink method="post" href={route('logout')} as="button">Cerrar Sesión</ResponsiveNavLink>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col gap-4 py-4">
                                <ResponsiveNavLink href={route('login')}>Iniciar Sesión</ResponsiveNavLink>
                                <ResponsiveNavLink href={route('register')}>Registrarse</ResponsiveNavLink>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            <div className="relative z-10 flex-1 flex flex-col">
                {header && (
                    <header className="border-b border-white/5 py-12 relative overflow-hidden">
                        <div className="mx-auto max-w-[1700px] px-6 relative z-20">
                            {header}
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/10 to-transparent pointer-events-none"></div>
                    </header>
                )}

                <main className="relative z-20 flex-1 max-w-[1700px] mx-auto w-full px-6 py-10">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        {children}
                    </motion.div>
                </main>
            </div>
            
            <footer className="py-12 mt-auto border-t border-white/5 relative z-10 bg-white/[0.01]">
                <div className="max-w-[1700px] mx-auto px-6 text-center sm:flex sm:justify-between sm:text-left">
                    <div>
                        <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">© {new Date().getFullYear()} ZendPC - Industrial Grade</p>
                    </div>
                    <div className="mt-4 sm:mt-0 flex gap-6 justify-center">
                        <Link href="/" className="text-slate-500 hover:text-emerald-400 text-xs font-black uppercase tracking-[0.2em] transition-colors">Inicio</Link>
                        <Link href="/builder" className="text-slate-500 hover:text-emerald-400 text-xs font-black uppercase tracking-[0.2em] transition-colors">Configurador</Link>
                        <Link href="/catalog" className="text-slate-500 hover:text-emerald-400 text-xs font-black uppercase tracking-[0.2em] transition-colors">Catálogo</Link>
                    </div>
                </div>
            </footer>
            
            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </div>
    );
}
