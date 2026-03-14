import { Link, Head } from '@inertiajs/react';
import { motion } from 'framer-motion';

export default function Show({ auth, producto }) {
    return (
        <>
            <Head title={producto.name + " - ZendPC"} />
            <div className="min-h-screen bg-dark-bg text-slate-200">
                {/* Navbar */}
                <nav className="glass-nav">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16">
                            <div className="flex">
                                <div className="shrink-0 flex items-center">
                                    <Link href="/" className="flex items-center gap-2">
                                        <img src="/logo.png" alt="ZendPC Logo" className="w-10 h-10 object-contain drop-shadow-lg rounded" />
                                        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-zend-400 to-zend-200 tracking-tight">ZendPC</h1>
                                    </Link>
                                    <div className="ml-10 flex items-center space-x-4">
                                        <Link href={route('catalog.index')} className="text-zend-400 border-b-2 border-zend-500 px-1 py-2 text-sm font-medium">Catálogo</Link>
                                        <Link href={route('builder.index')} className="text-gray-400 hover:text-white transition-colors px-1 py-2 text-sm font-medium">Configurador</Link>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                {auth.user ? (
                                    <Link href={route('dashboard')} className="btn-secondary text-sm">Panel de Control</Link>
                                ) : (
                                    <>
                                        <Link href={route('login')} className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Iniciar Sesión</Link>
                                        <Link href={route('register')} className="btn-primary text-sm relative overflow-hidden group">
                                            <span className="relative z-10">Registrarse</span>
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>

                <div className="py-12 relative overflow-hidden">
                    {/* Background decorative elements */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-zend-600/10 rounded-full blur-[120px] pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none"></div>

                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 relative z-10">

                        {/* Breadcrumbs */}
                        <div className="mb-8 flex items-center text-sm text-slate-400 gap-2">
                            <Link href={route('catalog.index')} className="hover:text-zend-400 transition-colors">Catálogo</Link>
                            <span>/</span>
                            <Link href={route('catalog.index', { category: producto.category?.slug })} className="hover:text-zend-400 transition-colors">{producto.category ? producto.category.name : 'Componente'}</Link>
                            <span>/</span>
                            <span className="text-slate-200 truncate">{producto.name}</span>
                        </div>

                        <div className="glass-panel sm:rounded-2xl overflow-hidden shadow-2xl">
                            <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-dark-border">

                                {/* Image Gallery Section */}
                                <div className="w-full lg:w-1/2 p-10 bg-dark-bg/40 flex items-center justify-center min-h-[400px]">
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.4 }}
                                        className="relative w-full max-w-md aspect-square bg-dark-bg/60 rounded-3xl shadow-2xl flex items-center justify-center p-8 border border-dark-border"
                                    >
                                        {producto.image ? (
                                            <>
                                                <img 
                                                    src={producto.image} 
                                                    alt="" 
                                                    className="relative z-10 max-w-full max-h-full object-contain" 
                                                    onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }} 
                                                />
                                                <span className="text-slate-600 font-medium hidden">Sin Imagen</span>
                                            </>
                                        ) : (
                                            <span className="text-slate-600 font-medium">Sin Imagen</span>
                                        )}
                                    </motion.div>
                                </div>

                                {/* Details Section */}
                                <div className="w-full lg:w-1/2 p-8 lg:p-12">
                                    <div className="mb-6">
                                        <div className="text-sm font-semibold text-zend-400 uppercase tracking-widest mb-2">
                                            {producto.category?.name}
                                        </div>
                                        <h1 className="text-3xl lg:text-4xl font-extrabold text-white leading-tight mb-4">{producto.name}</h1>

                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-zend-400 to-indigo-300">
                                                {Number(producto.price).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-2xl text-zend-500">€</span>
                                            </div>
                                            <div className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-sm font-semibold flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                                En Stock
                                            </div>
                                        </div>

                                        <p className="text-slate-300 text-lg leading-relaxed mb-8 border-l-4 border-zend-500/50 pl-4 py-1 bg-dark-bg/30 rounded-r-lg">
                                            {producto.description || "Componente premium seleccionado para tu próxima configuración."}
                                        </p>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-4 mb-10 pb-10 border-b border-dark-border">
                                        <Link href={route('builder.index')} className="btn-primary py-4 px-8 text-center text-lg flex-1 flex items-center justify-center gap-2">
                                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                                            Ir al Configurador
                                        </Link>
                                    </div>

                                    {/* Tech Specs */}
                                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
                                        <svg className="w-6 h-6 text-zend-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>
                                        Especificaciones Técnicas
                                    </h3>

                                    {producto.specs && Object.keys(producto.specs).length > 0 ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {Object.entries(producto.specs).map(([key, value]) => (
                                                <div key={key} className="bg-dark-bg/50 border border-dark-border rounded-lg p-4 flex flex-col justify-center">
                                                    <span className="text-xs text-slate-400 uppercase tracking-wider mb-1 font-semibold">{key.replace('_', ' ')}</span>
                                                    <span className="text-slate-100 font-medium">{String(value)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-slate-500 italic">No hay especificaciones detalladas disponibles para este producto.</p>
                                    )}

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

