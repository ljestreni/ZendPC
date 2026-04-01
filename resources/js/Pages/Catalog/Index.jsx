import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Link, Head, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import debounce from 'lodash/debounce';

export default function Index({ auth, productos, categorias, filters, availableFilters, priceRange }) {
    const [minPrice, setMinPrice] = useState(filters.min_price || priceRange.min);
    const [maxPrice, setMaxPrice] = useState(filters.max_price || priceRange.max);
    const [selectedSpecs, setSelectedSpecs] = useState(filters.specs || {});
    const [isFiltering, setIsFiltering] = useState(false);
    const [expandedGroups, setExpandedGroups] = useState(['categories', 'price']);

    // Sync local state if filters prop changes (e.g. on navigation)
    useEffect(() => {
        const newMax = filters.max_price || priceRange.max;
        const newMin = filters.min_price || priceRange.min;
        
        // Clamp values to ensure they stay within current priceRange bounds
        setMinPrice(Math.max(priceRange.min, Math.min(newMin, priceRange.max)));
        setMaxPrice(Math.min(priceRange.max, Math.max(newMax, priceRange.min)));
        setSelectedSpecs(filters.specs || {});

        // Auto-expand groups with active filters
        if (filters.specs) {
            setExpandedGroups(prev => {
                const newGroups = [...prev];
                Object.keys(filters.specs).forEach(key => {
                    if (!newGroups.includes(key)) newGroups.push(key);
                });
                return Array.from(new Set(newGroups));
            });
        }
    }, [filters, priceRange]);

    const toggleGroup = (key) => {
        setExpandedGroups(prev => 
            prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
        );
    };

    const applyFilters = useCallback(
        debounce((newFilters) => {
            setIsFiltering(true);
            router.get(route('catalog.index'), newFilters, {
                preserveState: true,
                preserveScroll: true,
                onFinish: () => setIsFiltering(false),
            });
        }, 600),
        []
    );

    const handlePriceChange = (min, max) => {
        setMinPrice(min);
        setMaxPrice(max);
        applyFilters({ ...filters, min_price: min, max_price: max });
    };

    const handleSpecToggle = (key, value) => {
        const newSpecs = { ...selectedSpecs };
        if (!newSpecs[key]) {
            newSpecs[key] = [value];
        } else {
            if (newSpecs[key].includes(value)) {
                newSpecs[key] = newSpecs[key].filter(v => v !== value);
                if (newSpecs[key].length === 0) delete newSpecs[key];
            } else {
                newSpecs[key].push(value);
            }
        }
        setSelectedSpecs(newSpecs);
        applyFilters({ ...filters, specs: newSpecs });
    };

    const clearFilters = () => {
        router.get(route('catalog.index'), filters.category ? { category: filters.category } : {});
    };

    const removeSpecFilter = (key, value) => {
        const newSpecs = { ...selectedSpecs };
        newSpecs[key] = newSpecs[key].filter(v => v !== value);
        if (newSpecs[key].length === 0) delete newSpecs[key];
        setSelectedSpecs(newSpecs);
        applyFilters({ ...filters, specs: newSpecs });
    };

    const formatValue = (key, val) => {
        if (!val) return val;
        const units = {
            vram: 'GB',
            capacity: 'GB',
            wattage: 'W',
            speed: isNaN(val) ? '' : (parseInt(val) > 2000 ? 'MB/s' : 'MHz'), // Simple heuristic for now
            length: 'mm',
            height: 'mm',
            width: 'mm',
            cores: 'Ndos'
        };

        // Special case for speed if it's storage (heuristic: high speed = SSD MB/s)
        let unit = units[key] || '';
        
        // If it's capacity and > 500, it might be GB, if 1 or 2 it might be TB (but we'll stick to GB for consistency if DB uses it)
        return `${val}${unit ? ' ' + unit : ''}`;
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <motion.h1
                            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                            className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase text-white mb-2"
                        >
                            Catálogo de <span className="text-indigo-500">Componentes</span>
                        </motion.h1>
                        <motion.p
                            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
                            className="text-slate-400 font-medium uppercase tracking-[0.2em] text-[10px]"
                        >
                            Centro de hardware de grado industrial. Manifiesto de rendimiento puro.
                        </motion.p>
                    </div>

                    <div className="flex items-center gap-4">
                         <div className="relative group">
                            <input 
                                type="text" 
                                placeholder="Buscar componente..."
                                defaultValue={filters.search}
                                onChange={(e) => applyFilters({ ...filters, search: e.target.value })}
                                className="bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-3 text-[10px] font-black uppercase tracking-widest text-white focus:outline-none focus:ring-2 focus:ring-indigo-600/50 w-64 transition-all"
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 group-hover:text-indigo-400 transition-colors">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            </div>
                         </div>
                    </div>
                </div>
            }
        >
            <Head title="Catálogo - ZendPC" />

            <div className="py-12 relative z-10">
                {/* Active Filters Bar */}
                <AnimatePresence>
                    {(Object.keys(selectedSpecs).length > 0 || filters.min_price || filters.max_price || filters.search) && (
                        <motion.div 
                            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                            className="flex flex-wrap items-center gap-3 mb-10 overflow-hidden"
                        >
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-600 mr-2 italic">Filtros Activos:</span>
                            {Object.entries(selectedSpecs).map(([key, values]) => (
                                values.map(val => (
                                    <button 
                                        key={`${key}-${val}`} 
                                        onClick={() => removeSpecFilter(key, val)}
                                        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-600/10 border border-indigo-600/30 text-[9px] font-black uppercase tracking-widest text-indigo-400 hover:bg-indigo-600/20 transition-all"
                                    >
                                        {formatValue(key, val)} <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                ))
                            ))}
                            {(filters.min_price || filters.max_price) && (
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-600/10 border border-emerald-600/30 text-[9px] font-black uppercase tracking-widest text-emerald-400">
                                    {minPrice}€ - {maxPrice}€
                                </div>
                            )}
                            <button 
                                onClick={clearFilters}
                                className="text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors underline underline-offset-4 decoration-slate-700"
                            >
                                Limpiar todo
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="flex flex-col lg:flex-row gap-10">
                    {/* Sidebar / Filter Hub */}
                    <aside className="w-full lg:w-[320px] flex-shrink-0 space-y-8">
                        {/* Categories Section */}
                        <div className="glass-panel rounded-[2rem] border border-white/5 relative overflow-hidden group">
                            <button 
                                onClick={() => toggleGroup('categories')}
                                className="w-full p-6 lg:p-8 flex items-center justify-between group/btn outline-none"
                            >
                                <h3 className="font-black text-white uppercase tracking-[0.3em] text-[10px] items-center gap-3 flex">
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]"></div>
                                    CATEGORÍAS
                                </h3>
                                <div className={`transition-transform duration-300 text-slate-500 group-hover/btn:text-white ${expandedGroups.includes('categories') ? 'rotate-180' : ''}`}>
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
                                </div>
                            </button>
                            
                            <AnimatePresence initial={false}>
                                {expandedGroups.includes('categories') && (
                                    <motion.div 
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                                    >
                                        <div className="px-6 lg:px-8 pb-8 space-y-2">
                                            <Link
                                                href={route('catalog.index')}
                                                className={`w-full flex items-center px-5 py-3.5 rounded-2xl transition-all duration-500 text-[10px] font-black uppercase tracking-widest group relative overflow-hidden ${!filters.category ? 'bg-indigo-600 text-white shadow-[0_0_30px_rgba(79,70,229,0.3)]' : 'bg-white/[0.01] border border-white/5 text-slate-500 hover:bg-white/[0.05] hover:text-white hover:border-white/20'}`}
                                            >
                                                <div className="relative z-10">Todas las Unidades</div>
                                                <div className="absolute right-4 opacity-20 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M9 5l7 7-7 7" /></svg>
                                                </div>
                                            </Link>
                                            {categorias && categorias.map((cat) => (
                                                <Link
                                                    key={cat.id}
                                                    href={route('catalog.index', { category: cat.slug })}
                                                    className={`w-full flex items-center px-5 py-3.5 rounded-2xl transition-all duration-500 text-[10px] font-black uppercase tracking-widest group relative overflow-hidden ${filters.category === cat.slug ? 'bg-indigo-600 text-white shadow-[0_0_30px_rgba(79,70,229,0.3)]' : 'bg-white/[0.01] border border-white/5 text-slate-500 hover:bg-white/[0.05] hover:text-white hover:border-white/20'}`}
                                                >
                                                    <div className="relative z-10 flex items-center gap-3 text-left">
                                                        {cat.name}
                                                    </div>
                                                    <div className="absolute right-4 opacity-20 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M9 5l7 7-7 7" /></svg>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Price Range Filter */}
                        <div className="glass-panel rounded-[2rem] border border-white/5">
                            <button 
                                onClick={() => toggleGroup('price')}
                                className="w-full p-6 lg:p-8 flex items-center justify-between group/btn outline-none"
                            >
                                <h3 className="font-black text-white uppercase tracking-[0.3em] text-[10px] items-center gap-3 flex">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(52,211,153,0.8)]"></div>
                                    RANGO DE PRECIOS (€)
                                </h3>
                                <div className={`transition-transform duration-300 text-slate-500 group-hover/btn:text-white ${expandedGroups.includes('price') ? 'rotate-180' : ''}`}>
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
                                </div>
                            </button>
                            
                            <AnimatePresence initial={false}>
                                {expandedGroups.includes('price') && (
                                    <motion.div 
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                                    >
                                        <div className="px-6 lg:px-8 pb-8">
                                            <div className="flex justify-between text-[11px] font-black text-white italic mb-6 px-2">
                                                <span>{minPrice}€</span>
                                                <span>{maxPrice}€</span>
                                            </div>
                                            <div className="relative h-2 bg-white/5 rounded-full mb-8 flex items-center group/slider px-2">
                                                <input 
                                                    type="range" 
                                                    min={priceRange.min} 
                                                    max={priceRange.max} 
                                                    value={minPrice} 
                                                    onChange={(e) => {
                                                        const val = Math.min(parseInt(e.target.value), maxPrice - 10);
                                                        handlePriceChange(val, maxPrice);
                                                    }}
                                                    className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer pointer-events-none z-30 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-[0_0_15px_rgba(255,255,255,0.6)] [&::-webkit-slider-thumb]:hover:scale-125 [&::-webkit-slider-thumb]:transition-transform"
                                                    style={{ zIndex: minPrice > (priceRange.max / 2) ? 35 : 34 }}
                                                />
                                                <input 
                                                    type="range" 
                                                    min={priceRange.min} 
                                                    max={priceRange.max} 
                                                    value={maxPrice} 
                                                    onChange={(e) => {
                                                        const val = Math.max(parseInt(e.target.value), minPrice + 10);
                                                        handlePriceChange(minPrice, val);
                                                    }}
                                                    className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer pointer-events-none z-30 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-[0_0_15px_rgba(255,255,255,0.6)] [&::-webkit-slider-thumb]:hover:scale-125 [&::-webkit-slider-thumb]:transition-transform"
                                                    style={{ zIndex: maxPrice < (priceRange.max / 2) ? 35 : 34 }}
                                                />
                                                <div 
                                                    className="absolute h-full bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)] z-20"
                                                    style={{ 
                                                        left: `${Math.max(0, Math.min(100, ((minPrice - priceRange.min) / (Math.max(1, priceRange.max - priceRange.min))) * 100))}%`,
                                                        width: `${Math.max(0, Math.min(100, ((maxPrice - minPrice) / (Math.max(1, priceRange.max - priceRange.min))) * 100))}%` 
                                                    }}
                                                ></div>
                                            </div>
                                            <p className="text-[9px] font-bold text-slate-500 uppercase text-center">Desliza para ajustar tu presupuesto</p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Specification Filters */}
                        {availableFilters && availableFilters.length > 0 && availableFilters.map((group) => (
                            <div key={group.key} className="glass-panel rounded-[2rem] border border-white/5">
                                <button 
                                    onClick={() => toggleGroup(group.key)}
                                    className="w-full p-6 lg:p-8 flex items-center justify-between group/btn outline-none"
                                >
                                    <h3 className="font-black text-white uppercase tracking-[0.3em] text-[10px] items-center gap-3 flex text-left">
                                        <div className="w-1.5 h-1.5 rounded-full bg-slate-500"></div>
                                        {group.name}
                                    </h3>
                                    <div className={`transition-transform duration-300 text-slate-500 group-hover/btn:text-white shrink-0 ${expandedGroups.includes(group.key) ? 'rotate-180' : ''}`}>
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
                                    </div>
                                </button>

                                <AnimatePresence initial={false}>
                                    {expandedGroups.includes(group.key) && (
                                        <motion.div 
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                                        >
                                            <div className="px-6 lg:px-8 pb-8">
                                                <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2 styled-scrollbar">
                                                    {group.options.map((opt) => (
                                                        <label 
                                                            key={opt}
                                                            className="flex items-center gap-3 cursor-pointer group/label"
                                                        >
                                                            <div className="relative w-4 h-4">
                                                                <input 
                                                                    type="checkbox" 
                                                                    className="peer hidden"
                                                                    checked={selectedSpecs[group.key]?.includes(opt)}
                                                                    onChange={() => handleSpecToggle(group.key, opt)}
                                                                />
                                                                <div className="w-4 h-4 rounded-md border-2 border-white/10 bg-white/[0.02] peer-checked:bg-indigo-600 peer-checked:border-indigo-600 transition-all group-hover/label:border-indigo-500/50"></div>
                                                                <svg className="absolute inset-0 w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity p-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                                            </div>
                                                            <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${selectedSpecs[group.key]?.includes(opt) ? 'text-white' : 'text-slate-500 group-hover/label:text-slate-300'}`}>
                                                                {formatValue(group.key, opt)}
                                                            </span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </aside>

                    {/* Product Grid */}
                    <div className="flex-1">
                        {isFiltering && (
                             <div className="flex items-center gap-3 mb-6 animate-pulse">
                                <div className="w-4 h-4 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">Buscando piezas...</span>
                             </div>
                        )}
                        
                        <motion.div
                            initial="hidden" animate="visible"
                            variants={{
                                hidden: { opacity: 0 },
                                visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
                            }}
                            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6"
                        >
                            <AnimatePresence mode="popLayout">
                                {productos && productos.data.length > 0 ? (
                                    productos.data.map((product) => (
                                        <motion.div
                                            key={product.id}
                                            layout
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            variants={{
                                                hidden: { y: 20, opacity: 0 },
                                                visible: { y: 0, opacity: 1 }
                                            }}
                                            className="glass-card-premium rounded-[2rem] flex flex-col group border border-white/5 hover:border-indigo-500/30 transition-all duration-500 overflow-hidden"
                                        >
                                            <Link href={route('catalog.show', product.slug)} className="p-1 px-1 flex flex-col flex-grow group">
                                                <div className="relative w-full h-56 bg-white rounded-[1.5rem] flex items-center justify-center p-8 overflow-hidden border border-white/10 transition-colors uppercase">
                                                    {product.image ? (
                                                        <img src={product.image} alt="" className="relative z-10 max-w-full max-h-full object-contain transform group-hover:scale-110 group-hover:-rotate-2 transition-transform duration-700" />
                                                    ) : (
                                                        <div className="text-slate-200 font-black uppercase tracking-[0.2em] text-[10px] italic">Sin Señal</div>
                                                    )}
                                                </div>

                                                <div className="p-6 flex-grow flex flex-col">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <div className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.2em]">
                                                            {product.category ? product.category.name : 'Hardware'}
                                                        </div>
                                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                                                    </div>
                                                    <h4 className="font-black text-base text-white line-clamp-2 leading-tight group-hover:text-indigo-300 transition-colors uppercase italic tracking-tight mb-6">{product.name}</h4>

                                                    <div className="mt-auto pt-6 flex items-end justify-between border-t border-white/5">
                                                        <div>
                                                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">PRECIO</span>
                                                            <p className="text-2xl font-black text-white tracking-tighter italic">
                                                                {Number(product.price).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-indigo-500 text-sm">€</span>
                                                            </p>
                                                        </div>
                                                        <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
                                                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        </motion.div>
                                    ))
                                ) : (
                                    <div className="col-span-full py-32 text-center">
                                        <div className="inline-flex p-6 rounded-full bg-white/5 mb-6 text-slate-600">
                                            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                        </div>
                                        <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-4">No se han encontrado unidades</h3>
                                        <p className="text-slate-500 max-w-sm mx-auto uppercase tracking-widest text-[10px] font-black">Ajusta tus parámetros de búsqueda o limpia los filtros para reintentar la sincronización.</p>
                                        <button onClick={clearFilters} className="mt-10 px-8 py-3 bg-white/[0.03] border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-indigo-600 hover:border-indigo-500 transition-all">Limpiar Analítica</button>
                                    </div>
                                )}
                            </AnimatePresence>
                        </motion.div>

                        {/* Pagination */}
                        {productos && productos.links && productos.links.length > 3 && (
                            <motion.div
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
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
        </AuthenticatedLayout>
    );
}
