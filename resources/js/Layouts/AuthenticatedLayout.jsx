import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    return (
        <div className="min-h-screen bg-dark-bg text-slate-200 font-sans selection:bg-zend-500/30">
            {/* Background Decorations */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-50">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-zend-600/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px]"></div>
            </div>

            <nav className="glass-nav border-b border-dark-border sticky top-0 z-[60]">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-20 justify-between items-center">
                        <div className="flex items-center">
                            <div className="flex shrink-0 items-center">
                                <Link href="/" className="flex items-center gap-2 group">
                                    <img src="/logo.png" alt="ZendPC" className="w-10 h-10 object-contain drop-shadow-lg group-hover:scale-110 transition-transform" />
                                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-zend-400 to-zend-200 tracking-tight hidden sm:block">ZendPC</h1>
                                </Link>
                            </div>

                            <div className="hidden space-x-6 sm:ms-12 sm:flex">
                                <Link
                                    href={route('catalog.index')}
                                    className="text-slate-400 hover:text-white px-1 py-2 text-sm font-medium transition-colors"
                                >
                                    Catálogo
                                </Link>
                                <Link
                                    href={route('builder.index')}
                                    className="text-slate-400 hover:text-white px-1 py-2 text-sm font-medium transition-colors"
                                >
                                    Configurador
                                </Link>
                                <Link
                                    href={route('dashboard')}
                                    className={`px-1 py-2 text-sm font-medium transition-all ${route().current('dashboard') ? 'text-zend-400 border-b-2 border-zend-500' : 'text-slate-400 hover:text-white'}`}
                                >
                                    Mi Taller
                                </Link>
                            </div>
                        </div>

                        <div className="hidden sm:flex sm:items-center sm:ms-6">
                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center rounded-xl bg-dark-card border border-dark-border px-4 py-2.5 text-sm font-semibold text-slate-200 transition-all hover:bg-dark-border hover:border-zend-500/50 shadow-lg"
                                            >
                                                <div className="w-6 h-6 rounded-full bg-zend-600 flex items-center justify-center text-[10px] text-white mr-2 shadow-inner">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                {user.name}

                                                <svg
                                                    className="-me-0.5 ms-2 h-4 w-4 text-slate-500"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content contentClasses="py-1 bg-dark-card border border-dark-border rounded-xl shadow-2xl overflow-hidden mt-2">
                                        {user.role === 'admin' && (
                                            <>
                                                <Dropdown.Link
                                                    href={route('admin.categories.index')}
                                                    className="text-slate-300 hover:bg-zend-600/20 hover:text-zend-400 font-medium px-4 py-3"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
                                                        Admin Categorías
                                                    </div>
                                                </Dropdown.Link>
                                                <Dropdown.Link
                                                    href={route('admin.products.index')}
                                                    className="text-slate-300 hover:bg-zend-600/20 hover:text-zend-400 font-medium px-4 py-3"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
                                                        Admin Productos
                                                    </div>
                                                </Dropdown.Link>
                                                <div className="border-t border-dark-border my-1"></div>
                                            </>
                                        )}
                                        <Dropdown.Link
                                            href={route('profile.edit')}
                                            className="text-slate-300 hover:bg-zend-600/20 hover:text-zend-400 font-medium px-4 py-3"
                                        >
                                            <div className="flex items-center gap-3">
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                                Perfil de Usuario
                                            </div>
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                            className="text-red-400 hover:bg-red-500/10 font-medium px-4 py-3 w-full text-left"
                                        >
                                            <div className="flex items-center gap-3">
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                                                Cerrar Sesión
                                            </div>
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown((p) => !p)}
                                className="inline-flex items-center justify-center rounded-xl p-2.5 text-slate-400 bg-dark-card border border-dark-border transition-colors hover:text-white focus:outline-none"
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
                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden bg-dark-card border-b border-dark-border'}>
                    <div className="space-y-1 pb-3 pt-2 px-4 text-center">
                        <ResponsiveNavLink href={route('dashboard')} active={route().current('dashboard')}>
                            Mi Taller
                        </ResponsiveNavLink>
                        <ResponsiveNavLink href={route('catalog.index')}>Catálogo</ResponsiveNavLink>
                        <ResponsiveNavLink href={route('builder.index')}>Configurador</ResponsiveNavLink>
                    </div>

                    <div className="border-t border-dark-border pb-1 pt-4 px-4 bg-dark-bg/50">
                        <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-zend-600 flex items-center justify-center font-bold text-white shadow-lg mr-3">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
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
                            <ResponsiveNavLink method="post" href={route('logout')} as="button">
                                Cerrar Sesión
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="relative z-10">
                {header && (
                    <header className="border-b border-dark-border py-12 relative overflow-hidden">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-20">
                            {header}
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-b from-zend-900/20 to-transparent pointer-events-none"></div>
                    </header>
                )}

                <main className="relative z-20">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        {children}
                    </motion.div>
                </main>
            </div>
            
            <footer className="py-12 mt-20 border-t border-dark-border relative z-10 bg-dark-bg/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:flex sm:justify-between sm:text-left">
                    <div>
                        <p className="text-slate-500 text-sm">© {new Date().getFullYear()} ZendPC - Proyecto Final de Grado</p>
                    </div>
                    <div className="mt-4 sm:mt-0 flex gap-6 justify-center">
                        <Link href="/" className="text-slate-500 hover:text-zend-400 text-sm transition-colors">Inicio</Link>
                        <Link href="/builder" className="text-slate-500 hover:text-zend-400 text-sm transition-colors">Configurador</Link>
                        <Link href="/catalog" className="text-slate-500 hover:text-zend-400 text-sm transition-colors">Catálogo</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
