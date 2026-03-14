import { Link, Head } from '@inertiajs/react';
import { motion } from 'framer-motion';

export default function Index({ auth, productos, categorias, filters }) {
    return (
        <>
            <Head title="Catálogo" />
            <div className="min-h-screen bg-dark-bg text-slate-200">

                {/* Modern Glass Navbar */}
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
                                        <Link href={route('builder.index')} className="text-gray-300 hover:text-white hover:border-b-2 hover:border-gray-300 px-1 py-2 text-sm font-medium transition-colors">Configurador</Link>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                {auth.user ? (
                                    <Link href={route('dashboard')} className="btn-secondary text-sm">
                                        Panel de Control
                                    </Link>
                                ) : (
                                    <>
                                        <Link href={route('login')} className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                                            Iniciar Sesión
                                        </Link>
                                        <Link href={route('register')} className="btn-primary text-sm relative overflow-hidden group">
                                            <span className="relative z-10">Registrarse</span>
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <div className="relative overflow-hidden w-full h-[20vh] min-h-[150px] flex items-center justify-center border-b border-dark-border">
                    <div className="absolute inset-0 bg-gradient-to-b from-zend-900/40 to-dark-bg z-0"></div>
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-zend-600/20 rounded-full blur-[100px]"></div>
                    <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px]"></div>
                    <div className="z-10 text-center">
                        <motion.h1
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2"
                        >
                            Catálogo de Componentes
                        </motion.h1>
                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="text-slate-400"
                        >
                            Construye el equipo de tus sueños con piezas premium.
                        </motion.p>
                    </div>
                </div>

                <div className="py-12 max-w-7xl mx-auto sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col lg:flex-row gap-8">

                        {/* Sidebar / Filters */}
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="w-full lg:w-1/4"
                        >
                            <div className="glass-panel sm:rounded-2xl p-6 sticky top-24">
                                <h3 className="font-bold text-lg mb-6 text-slate-100 uppercase tracking-wider text-sm flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-zend-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" /></svg>
                                    Categorías
                                </h3>
                                <div className="space-y-1">
                                    <Link
                                        href={route('catalog.index')}
                                        className={`block px-4 py-2.5 rounded-lg transition-all duration-200 ${!filters.category ? 'bg-zend-600/20 text-zend-400 font-semibold border-l-2 border-zend-500' : 'text-slate-400 hover:bg-dark-border hover:text-slate-200'}`}
                                    >
                                        Todas las Categorías
                                    </Link>
                                    {categorias && categorias.map((cat) => (
                                        <Link
                                            key={cat.id}
                                            href={route('catalog.index', { category: cat.slug })}
                                            className={`block px-4 py-2.5 rounded-lg transition-all duration-200 ${filters.category === cat.slug ? 'bg-zend-600/20 text-zend-400 font-semibold border-l-2 border-zend-500' : 'text-slate-400 hover:bg-dark-border hover:text-slate-200'}`}
                                        >
                                            {cat.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        {/* Product Grid */}
                        <div className="w-full lg:w-3/4">
                            <motion.div
                                initial="hidden"
                                animate="visible"
                                variants={{
                                    hidden: { opacity: 0 },
                                    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
                                }}
                                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                            >
                                {productos && productos.data.map((product) => (
                                    <motion.div
                                        variants={{
                                            hidden: { y: 20, opacity: 0 },
                                            visible: { y: 0, opacity: 1 }
                                        }}
                                        key={product.id}
                                        className="glass-panel sm:rounded-2xl flex flex-col card-hover"
                                    >
                                        <Link href={route('catalog.show', product.slug)} className="p-6 flex flex-col flex-grow group">
                                            <div className="relative w-full h-48 mb-6 bg-dark-bg/40 rounded-xl flex items-center justify-center p-4 overflow-hidden border border-dark-border">
                                                {product.image ? (
                                                    <>
                                                        <img 
                                                            src={product.image} 
                                                            alt="" 
                                                            className="max-w-full max-h-full object-contain transform group-hover:scale-105 transition-transform duration-500" 
                                                            onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }} 
                                                        />
                                                        <span className="text-slate-600 font-medium hidden">Sin Imagen</span>
                                                    </>
                                                ) : (
                                                    <span className="text-slate-600 font-medium">Sin Imagen</span>
                                                )}
                                            </div>

                                            <div className="flex-grow flex flex-col">
                                                <div className="text-xs font-semibold text-zend-400 uppercase tracking-wider mb-2">
                                                    {product.category ? product.category.name : 'Componente'}
                                                </div>
                                                <h4 className="font-bold text-lg mb-2 text-slate-100 line-clamp-2 leading-tight group-hover:text-zend-300 transition-colors">{product.name}</h4>

                                                <div className="mt-auto pt-4 flex items-end justify-between">
                                                    <div>
                                                        <span className="text-xs text-slate-400">Precio</span>
                                                        <p className="text-2xl font-bold text-white tracking-tight">
                                                            {Number(product.price).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-zend-500 text-lg">€</span>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </motion.div>

                            {/* Pagination */}
                            {productos && productos.links && productos.links.length > 3 && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="mt-12 flex justify-center overflow-x-auto pb-4"
                                >
                                    <div className="glass-panel items-center rounded-2xl px-2 py-2 flex gap-1 shadow-2xl shadow-zend-500/5">
                                        {productos.links.map((link, key) => {
                                            let label = link.label;
                                            if (label.includes('Previous')) label = '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>';
                                            if (label.includes('Next')) label = '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>';

                                            return link.url ? (
                                                <Link
                                                    key={key}
                                                    href={link.url}
                                                    className={`px-4 py-2 min-w-[44px] flex justify-center items-center rounded-xl text-sm font-bold transition-all duration-300 ${link.active ? 'bg-gradient-to-r from-zend-600 to-zend-500 text-white shadow-lg shadow-zend-500/30 transform -translate-y-0.5' : 'text-slate-400 hover:text-white hover:bg-dark-border border border-transparent'}`}
                                                    dangerouslySetInnerHTML={{ __html: label }}
                                                />
                                            ) : (
                                                <span
                                                    key={key}
                                                    className="px-4 py-2 min-w-[44px] flex justify-center items-center rounded-xl text-sm font-bold text-slate-600 opacity-50 cursor-not-allowed"
                                                    dangerouslySetInnerHTML={{ __html: label }}
                                                />
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
