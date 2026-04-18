import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';

// ==============================================
// 1. BANNER CAROUSEL (Hero promocional dinámico)
// ==============================================
const BannerCarousel = () => {
    const banners = [
        {
            id: 1,
            title: "Configurador ZendBuilder",
            subtitle: "Ensamblaje sin cuellos de botella",
            desc: "Accede a la inteligencia artificial de validación de hardware. Si lo permitimos, funciona.",
            bg: "bg-emerald-900/40",
            buttonText: "Iniciar Proyecto",
            href: route('builder.index'),
            image: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=1200"
        },
        {
            id: 2,
            title: "Nuevos Ingresos G.Skill",
            subtitle: "Velocidad DDR5 Absoluta",
            desc: "Latencias imposibles y anchos de banda para la era del renderizado hiper-realista.",
            bg: "bg-slate-900/60",
            buttonText: "Ver Memorias",
            href: route('catalog.index', { category: 'memoria-ram' }),
            image: "https://images.unsplash.com/photo-1563191911-e65f8655ebf9?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=1200"
        },
        {
            id: 3,
            title: "Operaciones Logísticas",
            subtitle: "Despliegue Inmediato",
            desc: "Inventario verificado en tiempo real con empaquetado industrial de alta seguridad.",
            bg: "bg-zinc-900/80",
            buttonText: "Explorar Stock",
            href: route('catalog.index'),
            image: "/images/logistics_banner.png"
        }
    ];

    const [current, setCurrent] = useState(0);

    const nextSlide = () => setCurrent((prev) => (prev + 1) % banners.length);
    const prevSlide = () => setCurrent((prev) => (prev === 0 ? banners.length - 1 : prev - 1));

    useEffect(() => {
        const timer = setInterval(() => {
            nextSlide();
        }, 6000);
        return () => clearInterval(timer);
    }, [banners.length]);

    return (
        <div className="relative w-full h-[400px] md:h-[500px] rounded-[2.5rem] overflow-hidden group border border-white/5 hover:border-emerald-500/20 mb-10 shadow-2xl transition-all duration-700">
            <AnimatePresence>
                <motion.div
                    key={current}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                    className={`absolute inset-0 flex items-center ${banners[current].bg}`}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#080a11] via-[#080a11]/80 to-transparent z-10"></div>
                    <img src={banners[current].image} alt="Banner" className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-luminosity" />
                    
                    <div className="relative z-20 px-8 md:px-16 w-full max-w-3xl">
                        <motion.span 
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                            className="inline-block px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] uppercase font-black tracking-widest mb-4 border border-emerald-500/30"
                        >
                            {banners[current].subtitle}
                        </motion.span>
                        <motion.h2 
                            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
                            className="text-4xl md:text-6xl font-black text-white italic tracking-tighter uppercase mb-4"
                        >
                            {banners[current].title}
                        </motion.h2>
                        <motion.p 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                            className="text-slate-400 text-sm md:text-base font-medium max-w-xl mb-8"
                        >
                            {banners[current].desc}
                        </motion.p>
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                            <Link 
                                href={banners[current].href} 
                                className="inline-flex px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-black uppercase tracking-widest rounded-2xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:scale-105"
                            >
                                {banners[current].buttonText}
                            </Link>
                        </motion.div>
                    </div>
                </motion.div>
            </AnimatePresence>

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-4">
                {banners.map((_, idx) => (
                    <button 
                        key={idx} 
                        onClick={() => setCurrent(idx)}
                        className={`transition-all duration-500 rounded-full ${current === idx ? 'w-16 h-1.5 bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)]' : 'w-6 h-1.5 bg-white/20 hover:bg-white/50 hover:w-10'}`}
                    />
                ))}
            </div>

            {/* Controles Laterales */}
            <button 
                onClick={prevSlide}
                className="absolute left-6 top-1/2 -translate-y-1/2 z-40 w-14 h-14 rounded-full bg-[#0a0c16]/50 border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-emerald-600 hover:border-emerald-400 hover:scale-110 backdrop-blur-md"
            >
                <svg className="w-6 h-6 ml-[-2px]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
            </button>

            <button 
                onClick={nextSlide}
                className="absolute right-6 top-1/2 -translate-y-1/2 z-40 w-14 h-14 rounded-full bg-[#0a0c16]/50 border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-emerald-600 hover:border-emerald-400 hover:scale-110 backdrop-blur-md"
            >
                <svg className="w-6 h-6 mr-[-2px]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
            </button>
        </div>
    );
};

// ==============================================
// 2. CATEGORY PILLS (Accesos Rápidos)
// ==============================================

const CategoryIcon = ({ slug }) => {
    const icons = {
        'cpu': (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>
        ),
        'motherboard': (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" /></svg>
        ),
        'ram': (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7h16M4 11h16M4 15h16M4 19h16M7 3v4m10-4v4" /></svg>
        ),
        'gpu': (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
        ),
        'storage': (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.58 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.58 4 8 4s8-1.79 8-4M4 7c0-2.21 3.58-4 8-4s8 1.79 8 4m0 5c0 2.21-3.58 4-8 4s-8-1.79-8-4" /></svg>
        ),
        'psu': (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
        ),
        'case': (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
        ),
        'cooler': (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        )
    };

    return icons[slug] || (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h14M12 5l7 7-7 7" /></svg>
    );
};

const CategoryPills = ({ categories }) => {
    if (!categories || categories.length === 0) return null;
    return (
        <div className="flex overflow-x-auto snap-x gap-4 pb-6 scrollbar-hide [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden mb-8">
            <Link 
                href={route('catalog.index')}
                className="snap-start shrink-0 px-6 py-4 rounded-2xl bg-white/[0.05] border border-white/10 hover:bg-emerald-600/20 hover:border-emerald-500/50 transition-all group flex flex-col items-center gap-2 min-w-[120px]"
            >
                 <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                    <svg className="w-5 h-5 text-slate-400 group-hover:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                 </div>
                 <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-1">Ver Todo</span>
            </Link>

            {categories.map(cat => (
                <Link 
                    key={cat.id}
                    href={route('catalog.index', { category: cat.slug })}
                    className="snap-start shrink-0 px-6 py-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.08] hover:border-white/20 transition-all group flex flex-col items-center gap-2 min-w-[120px]"
                >
                    <div className="w-10 h-10 rounded-full bg-white/5 text-slate-400 flex items-center justify-center group-hover:bg-emerald-500/20 group-hover:text-emerald-400 transition-all">
                        <CategoryIcon slug={cat.slug} />
                    </div>
                    <span className="text-[10px] font-black text-slate-400 group-hover:text-white uppercase tracking-widest mt-1 text-center truncate w-full">{cat.name}</span>
                </Link>
            ))}
        </div>
    );
};

// ==============================================
// 3. PRODUCT CAROUSEL (Slider Horizontal de Productos)
// ==============================================
const ProductCarousel = ({ title, subtitle, products, hrefVerMas }) => {
    const scrollRef = useRef(null);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = direction === 'left' ? -current.offsetWidth + 50 : current.offsetWidth - 50;
            current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    if (!products || products.length === 0) return null;

    return (
        <section className="mb-16 relative">
            <div className="flex items-end justify-between mb-6 px-1">
                <div>
                    <h3 className="text-xl md:text-2xl font-black text-white uppercase italic tracking-tighter flex items-center gap-3">
                        {title}
                    </h3>
                    <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em] mt-1">{subtitle}</p>
                </div>
                
                <div className="flex items-center gap-3">
                    {hrefVerMas && (
                        <Link href={hrefVerMas} className="hidden md:flex text-[10px] font-black uppercase tracking-widest text-emerald-500 hover:text-emerald-400 mr-4 transition-colors">
                            Ver más +
                        </Link>
                    )}
                    <button onClick={() => scroll('left')} className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/30 transition-all text-white">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <button onClick={() => scroll('right')} className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/30 transition-all text-white">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                    </button>
                </div>
            </div>

            <div 
                ref={scrollRef} 
                className="flex overflow-x-auto snap-x snap-mandatory gap-5 pb-8 scrollbar-hide [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
                {products.map(product => (
                    <div key={product.id} className="snap-start shrink-0 w-[260px] md:w-[280px]">
                        <div className="glass-card-premium rounded-[1.5rem] flex flex-col group border border-white/5 hover:border-emerald-500/30 transition-all duration-500 overflow-hidden h-full">
                            <Link href={route('catalog.show', product.slug)} className="p-1 px-1 flex flex-col group flex-grow">
                                <div className="relative w-full h-40 bg-white rounded-[1.2rem] flex items-center justify-center p-4 overflow-hidden border border-white/10 transition-colors uppercase">
                                    {product.image ? (
                                        <img src={product.image} alt="" className="relative z-10 max-w-full max-h-full object-contain transform group-hover:scale-110 transition-transform duration-700" />
                                    ) : (
                                        <div className="text-slate-200 font-black uppercase tracking-[0.2em] text-[10px] italic">Sin Señal</div>
                                    )}
                                </div>

                                <div className="p-5 pb-0 flex-grow">
                                    <div className="text-[9px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-2 truncate">
                                        {product.category ? product.category.name : 'Hardware'}
                                    </div>
                                    <h4 className="font-black text-sm text-white line-clamp-2 leading-tight group-hover:text-emerald-300 transition-colors uppercase italic tracking-tight">{product.name}</h4>
                                </div>
                            </Link>

                            <div className="p-5 pt-4 mt-auto border-t border-white/5 flex items-end justify-between">
                                <div>
                                    <p className="text-lg font-black text-white tracking-tighter italic">
                                        {Number(product.price).toLocaleString('es-ES', { minimumFractionDigits: 2 })} <span className="text-emerald-500 text-[10px]">€</span>
                                    </p>
                                </div>
                                <button 
                                    onClick={(e) => {
                                        e.preventDefault();
                                        router.post(route('cart.add'), { product_id: product.id }, { preserveScroll: true, preserveState: true, only: ['cart'] });
                                    }}
                                    className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center hover:bg-emerald-600 transition-all active:scale-95 group/btn shrink-0"
                                >
                                    <svg className="w-4 h-4 text-white group-hover/btn:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

// ==============================================
// MAIN VIEW COMPONENT
// ==============================================
export default function Welcome({ auth, novedades, destacados, ultimoVisitado, categorias }) {
    return (
        <AuthenticatedLayout header={null}>
            <Head title="Inicio" />
            
            {/* Componente Hero / Slider Principal */}
            <BannerCarousel />

            {/* Accesos rápidos a Categorías */}
            <CategoryPills categories={categorias} />

            {/* Carruseles de Productos */}
            <div className="mt-4">
                <ProductCarousel 
                    title="Operaciones Recientes" 
                    subtitle="Hardware investigado recientemente" 
                    products={ultimoVisitado} 
                />

                <ProductCarousel 
                    title="Nuevos Protocolos" 
                    subtitle="Material recién ingresado al arsenal" 
                    products={novedades} 
                    hrefVerMas={route('catalog.index')}
                />

                <ProductCarousel 
                    title="Unidades Destacadas" 
                    subtitle="Alto rendimiento y Restock" 
                    products={destacados} 
                />
            </div>
            
        </AuthenticatedLayout>
    );
}
