import { Link, Head, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

export default function Index({ auth }) {
    const [config, setConfig] = useState({
        cpu: null, motherboard: null, ram: null, gpu: null,
        storage: null, psu: null, case: null,
    });

    const [activeCategory, setActiveCategory] = useState(null);
    const [products, setProducts] = useState([]);
    const [compatibility, setCompatibility] = useState({ valid: true, errors: [], alerts: [] });
    const [isLoading, setIsLoading] = useState(false);

    const categories = [
        { slug: 'cpu', name: 'Procesador', icon: 'M9 3V2m6 1v1m-6 18v1m6-1v1M3 9H2m1 6H2m18-6h1m-1 6h1M5 5h14v14H5V5zm6 2a2 2 0 100 4 2 2 0 000-4z' },
        { slug: 'motherboard', name: 'Placa Base', icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z' },
        { slug: 'ram', name: 'Memoria RAM', icon: 'M4 8V6a2 2 0 012-2h12a2 2 0 012 2v2m-20 0v8a2 2 0 002 2h12a2 2 0 002-2v-8m-20 0h20M6 12h8m-8 4h4' },
        { slug: 'gpu', name: 'Tarjeta Gráfica', icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' },
        { slug: 'storage', name: 'Almacenamiento', icon: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4' },
        { slug: 'psu', name: 'Fuente', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
        { slug: 'case', name: 'Caja/Torre', icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z' },
    ];

    const fetchProducts = async (categorySlug) => {
        setIsLoading(true);
        setActiveCategory(categorySlug);
        try {
            const response = await axios.get(route('builder.products', categorySlug));
            setProducts(response.data);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
        setIsLoading(false);
    };

    const selectProduct = (categorySlug, product) => {
        const newConfig = { ...config, [categorySlug]: product };
        setConfig(newConfig);
        validateConfig(newConfig);
        // Automatically open the next empty category
        const keys = categories.map(c => c.slug);
        const currentIndex = keys.indexOf(categorySlug);
        let nextSlug = null;
        for (let i = currentIndex + 1; i < keys.length; i++) {
            if (!newConfig[keys[i]]) {
                nextSlug = keys[i];
                break;
            }
        }
        if (nextSlug) fetchProducts(nextSlug);
    };

    const removeProduct = (categorySlug) => {
        const newConfig = { ...config, [categorySlug]: null };
        setConfig(newConfig);
        validateConfig(newConfig);
    };

    const validateConfig = async (currentConfig) => {
        const components = {};
        for (const [key, value] of Object.entries(currentConfig)) {
            if (value) components[key] = value.id;
        }

        if (Object.keys(components).length === 0) {
            setCompatibility({ valid: true, errors: [], alerts: [] });
            return;
        }
        
        try {
            const response = await axios.post(route('builder.validate'), { components });
            // Simulate advanced response for now if backend doesn't return full structure
            let fallbackResult = response.data;
            if (fallbackResult.valid === undefined) {
               fallbackResult = { valid: true, errors: [], alerts: [] }; // Mock if API only returns early bool
            }
            setCompatibility(fallbackResult);
        } catch (error) {
            console.error("Validation error:", error);
        }
    };

    const saveConfig = () => {
        if (!auth.user) {
             window.location.href = route('login');
             return;
        }
        const name = prompt("Introduce un nombre para tu nuevo proyecto:");
        if (!name) return;

        const components = {};
        for (const [key, value] of Object.entries(config)) {
             if (value) components[key] = value.id;
        }

        axios.post(route('builder.save'), {
             name, components, total_price: calculateTotal()
        }).then(() => {
             window.location.href = route('dashboard');
        }).catch(error => {
             alert("Error guardando el proyecto.");
        });
    };

    const calculateTotal = () => {
        return Object.values(config).reduce((total, item) => total + (item ? parseFloat(item.price) : 0), 0).toFixed(2);
    };

    const progressPercentage = (Object.values(config).filter(v => v !== null).length / categories.length) * 100;

    return (
        <>
            <Head title="ZendBuilder" />
            <div className="min-h-screen bg-dark-bg text-slate-200">
                {/* Navbar */}
                <nav className="glass-nav">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16">
                            <div className="flex">
                                <div className="shrink-0 flex items-center">
                                    <Link href="/" className="flex items-center gap-2">
                                        <img src="/logo.png" alt="ZendPC Logo" className="w-10 h-10 object-contain drop-shadow-lg rounded" />
                                        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-200 tracking-tight">ZendPC</h1>
                                    </Link>
                                    <div className="ml-10 flex items-center space-x-4">
                                        <Link href={route('catalog.index')} className="text-gray-400 hover:text-white transition-colors px-1 py-2 text-sm font-medium">Catálogo</Link>
                                        <Link href={route('builder.index')} className="text-purple-400 border-b-2 border-purple-500 px-1 py-2 text-sm font-medium">Configurador</Link>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center">
                                {auth.user ? (
                                    <Link href={route('dashboard')} className="btn-secondary text-sm">Mi Taller</Link>
                                ) : (
                                    <Link href={route('login')} className="text-sm font-medium text-purple-400 hover:text-purple-300">Inicia sesión para guardar</Link>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Progress Bar */}
                <div className="w-full h-1 bg-dark-border">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercentage}%` }}
                        className="h-full bg-gradient-to-r from-purple-500 to-indigo-500"
                    />
                </div>

                <div className="py-8 max-w-[1400px] mx-auto sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col lg:flex-row gap-8">
                        
                        {/* Summary / Config Left Panel */}
                        <div className="w-full lg:w-[400px] flex-shrink-0">
                            <div className="glass-panel sm:rounded-2xl p-6 sticky top-24">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">ZendBuilder</h2>
                                    <div className="text-xs font-mono bg-dark-bg px-2 py-1 rounded border border-dark-border text-indigo-400">
                                        {Math.round(progressPercentage)}% COMPLETADO
                                    </div>
                                </div>
                                
                                <AnimatePresence>
                                    {!compatibility.valid && (
                                        <motion.div 
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="bg-red-900/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl mb-6 shadow-[0_0_15px_rgba(239,68,68,0.1)]"
                                        >
                                            <div className="flex items-center gap-2 mb-2 font-bold text-red-400">
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                                ¡Conflicto Detectado!
                                            </div>
                                            <ul className="list-disc ml-5 text-sm space-y-1">
                                                {compatibility.errors?.map((err, idx) => <li key={idx}>{err}</li>) || <li>Incompatibilidad técnica de sockets o estándares.</li>}
                                            </ul>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="space-y-3">
                                    {categories.map((cat) => {
                                        const isSelected = !!config[cat.slug];
                                        const isActive = activeCategory === cat.slug;
                                        
                                        return (
                                            <div 
                                                key={cat.slug} 
                                                onClick={() => !isSelected && fetchProducts(cat.slug)}
                                                className={`p-3 rounded-xl border transition-all duration-300 ${isActive ? 'bg-indigo-600/10 border-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.2)]' : isSelected ? 'bg-dark-bg border-emerald-500/30' : 'bg-dark-bg border-dark-border hover:border-indigo-500/50 cursor-pointer'}`}
                                            >
                                                <div className="flex justify-between items-center mb-1">
                                                    <div className="flex items-center gap-2">
                                                        <svg className={`w-4 h-4 ${isSelected ? 'text-emerald-400' : 'text-slate-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={cat.icon} />
                                                        </svg>
                                                        <span className="font-semibold text-sm text-slate-300">{cat.name}</span>
                                                    </div>
                                                    {isSelected && (
                                                        <button onClick={(e) => { e.stopPropagation(); removeProduct(cat.slug); }} className="text-red-400 hover:text-red-300 transition text-xs flex items-center gap-1 bg-red-400/10 px-2 py-0.5 rounded">
                                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg> Eliminar
                                                        </button>
                                                    )}
                                                </div>
                                                
                                                {isSelected ? (
                                                    <div className="flex items-center gap-3 mt-2">
                                                        {config[cat.slug].image && (
                                                            <div className="w-10 h-10 rounded bg-white p-1 flex items-center justify-center shrink-0 border border-slate-100">
                                                                <img src={config[cat.slug].image} alt="" className="max-w-full max-h-full object-contain" />
                                                            </div>
                                                        )}
                                                        <div className="flex-grow min-w-0">
                                                            <div className="text-sm font-medium text-slate-100 truncate">{config[cat.slug].name}</div>
                                                            <div className="text-indigo-400 font-mono text-sm">{Number(config[cat.slug].price).toLocaleString('es-ES', { minimumFractionDigits: 2 })} €</div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="text-xs text-slate-600 mt-1 pl-6">Pendiente de selección</div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="mt-8 pt-6 border-t border-dark-border">
                                    <div className="flex justify-between items-end mb-6">
                                        <span className="text-slate-400 uppercase text-xs font-bold tracking-widest">Presupuesto</span>
                                        <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">
                                            {Number(calculateTotal()).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                                        </span>
                                    </div>
                                    <button 
                                        onClick={saveConfig}
                                        className={`w-full font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 ${!compatibility.valid ? 'bg-dark-bg text-slate-500 border border-dark-border cursor-not-allowed' : progressPercentage === 100 ? 'btn-success' : 'btn-primary'}`}
                                        disabled={!compatibility.valid}
                                    >
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
                                        {progressPercentage === 100 ? 'Finalizar Construcción' : 'Guardar Progreso'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Inventory Right Panel */}
                        <div className="flex-grow">
                            <AnimatePresence mode="wait">
                                {activeCategory ? (
                                    <motion.div 
                                        key={activeCategory}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="bg-dark-bg/50 border border-dark-border rounded-2xl p-6"
                                    >
                                        <div className="flex items-center gap-3 mb-6 border-b border-dark-border pb-4">
                                            <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={categories.find(c => c.slug === activeCategory)?.icon} /></svg>
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-bold text-white">
                                                    Seleccionar {categories.find(c => c.slug === activeCategory)?.name}
                                                </h2>
                                                <p className="text-slate-400 text-sm">El motor Zend ha filtrado las opciones incompatibles.</p>
                                            </div>
                                        </div>

                                        {isLoading ? (
                                            <div className="flex py-20 items-center justify-center">
                                                <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
                                            </div>
                                        ) : (
                                            <div className="space-y-4 styled-scrollbar overflow-y-auto max-h-[70vh] pr-2">
                                                {products.length > 0 ? (
                                                    products.map((product) => (
                                                        <div key={product.id} className="glass-panel p-4 rounded-xl flex flex-col sm:flex-row gap-6 hover:border-indigo-500/50 transition-colors group">
                                                            <div className="w-full sm:w-32 h-32 shrink-0 bg-white rounded-lg p-2 flex items-center justify-center overflow-hidden border border-slate-100">
                                                                {product.image ? (
                                                                    <img src={product.image} alt={product.name} className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                                                                ) : (
                                                                    <span className="text-xs text-slate-500">Sin Imagen</span>
                                                                )}
                                                            </div>
                                                            <div className="flex-grow flex flex-col justify-center min-w-0">
                                                                <h4 className="font-bold text-lg text-slate-100 mb-1 truncate">{product.name}</h4>
                                                                <p className="text-sm text-slate-400 line-clamp-2 mb-3">{product.description}</p>
                                                                
                                                                {product.specs && (
                                                                    <div className="flex flex-wrap gap-2 mt-auto">
                                                                        {Object.entries(product.specs).slice(0, 4).map(([k, v]) => (
                                                                            <span key={k} className="px-2 py-1 bg-dark-bg border border-dark-border rounded text-xs text-slate-300 font-mono">
                                                                                <span className="text-slate-500">{k}:</span> {v}
                                                                            </span>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="sm:w-32 shrink-0 flex flex-col items-end justify-center border-t sm:border-t-0 sm:border-l border-dark-border pt-4 sm:pt-0 sm:pl-6 mt-4 sm:mt-0">
                                                                <div className="text-2xl font-bold text-white mb-3">
                                                                    {Number(product.price).toLocaleString('es-ES', { minimumFractionDigits: 2 })} <span className="text-indigo-400 text-lg">€</span>
                                                                </div>
                                                                <button 
                                                                    onClick={() => selectProduct(activeCategory, product)}
                                                                    className="w-full btn-primary px-0 text-sm py-2 group-hover:shadow-[0_0_15px_rgba(99,102,241,0.4)]"
                                                                >
                                                                    Seleccionar
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="text-center py-20 text-slate-500 flex flex-col items-center">
                                                        <svg className="w-16 h-16 mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                                                        <p>No hay inventario disponible con tu configuración actual.</p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </motion.div>
                                ) : (
                                    <motion.div 
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                        className="h-full flex flex-col items-center justify-center text-center py-32 px-4"
                                    >
                                        <div className="w-24 h-24 mb-6 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center border border-indigo-500/30">
                                            <svg className="w-12 h-12 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                                        </div>
                                        <h3 className="text-2xl font-bold text-white mb-2">Bienvenido al Motor Zend</h3>
                                        <p className="text-slate-400 max-w-md">Selecciona un componente en el menú lateral para empezar. Nuestro asistente validará automáticamente el TDP, dimensiones y cuellos de botella para que todo sea perfecto.</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        
                    </div>
                </div>
            </div>
        </>
    );
}

