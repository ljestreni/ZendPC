import React, { useState, useEffect, useMemo } from 'react';
import { Link, Head, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import Modal from '@/Components/Modal';
import Dropdown from '@/Components/Dropdown';
import ApplicationLogo from '@/Components/ApplicationLogo';

const EditablePrice = ({ value, onChange, min, max }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [localValue, setLocalValue] = useState(value);
    
    useEffect(() => setLocalValue(value), [value]);

    if (isEditing) {
        return (
            <div className="relative inline-flex items-center">
                <input 
                    type="number" 
                    autoFocus
                    className="bg-white/[0.05] border border-emerald-500/50 rounded-lg pl-2 pr-5 py-0.5 w-[75px] text-lg font-black text-white italic outline-none focus:ring-1 focus:ring-emerald-500/50 block [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    value={localValue}
                    onChange={e => {
                        const val = e.target.value;
                        if (val === '' || Number(val) >= 0) setLocalValue(val);
                    }}
                    onBlur={() => {
                        setIsEditing(false);
                        let val = parseInt(localValue);
                        if (isNaN(val)) val = min;
                        val = Math.max(min, Math.min(max, val));
                        onChange(val);
                    }}
                    onKeyDown={e => {
                        if (e.key === 'Enter') e.target.blur();
                        if (e.key === 'ArrowUp') { e.preventDefault(); setLocalValue(prev => Math.max(0, (parseInt(prev) || 0) + 10)); }
                        if (e.key === 'ArrowDown') { e.preventDefault(); setLocalValue(prev => Math.max(0, (parseInt(prev) || 0) - 10)); }
                    }}
                />
                <div className="absolute right-0.5 inset-y-0 flex flex-col justify-center py-1">
                    <button type="button" tabIndex="-1" onMouseDown={e => { e.preventDefault(); setLocalValue(prev => Math.max(0, (parseInt(prev) || 0) + 10)); }} className="text-slate-500 hover:text-emerald-400 h-1/2 flex items-end pb-0.5 justify-center px-1">
                        <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 15l7-7 7 7" /></svg>
                    </button>
                    <button type="button" tabIndex="-1" onMouseDown={e => { e.preventDefault(); setLocalValue(prev => Math.max(0, (parseInt(prev) || 0) - 10)); }} className="text-slate-500 hover:text-emerald-400 h-1/2 flex items-start pt-0.5 justify-center px-1">
                        <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M19 9l-7 7-7-7" /></svg>
                    </button>
                </div>
            </div>
        );
    }
    return (
        <span 
            className="cursor-text hover:text-emerald-400 transition-colors border-b border-transparent hover:border-emerald-400/50 pb-[1px]" 
            onClick={() => setIsEditing(true)}
            title="Click para editar"
        >
            {value} <span className="text-emerald-400 text-sm">€</span>
        </span>
    );
};

export default function Index({ auth, initialConfig }) {
    const [showingMobileMenu, setShowingMobileMenu] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 1024);
        handleResize();
        window.addEventListener('resize', handleResize);
        
        // Prevent body scroll on Desktop
        if (window.innerWidth >= 1024) {
            document.body.style.overflow = 'hidden';
            document.body.style.height = '100vh';
        } else {
            document.body.style.overflow = '';
            document.body.style.height = '';
        }
        
        return () => {
            window.removeEventListener('resize', handleResize);
            document.body.style.overflow = '';
            document.body.style.height = '';
        }
    }, [isMobile]);

    const [selectedPlatform, setSelectedPlatform] = useState(() => {
        if (initialConfig?.configuration?.cpu?.specs?.socket) {
            const sock = initialConfig.configuration.cpu.specs.socket;
            if (sock.includes('AM5')) return 'AM5';
            if (sock.includes('AM4')) return 'AM4';
            if (sock.includes('1700')) return 'LGA 1700';
            return sock;
        }
        return null;
    });

    const [config, setConfig] = useState(() => {
        const base = {
            cpu: null, motherboard: null, ram: null, gpu: null,
            storage: null, psu: null, case: null, cooler: null
        };
        if (initialConfig?.configuration) {
            return { ...base, ...initialConfig.configuration };
        }
        return base;
    });

    const [activeCategory, setActiveCategory] = useState('socket');
    const [products, setProducts] = useState([]);
    const [compatibility, setCompatibility] = useState({ valid: true, errors: [], alerts: [] });
    const [performance, setPerformance] = useState({ competitive: 0, aaa: 0, ultra: 0, bottleneck: 100, reason: '' });
    const [techSummary, setTechSummary] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showPlatformConfirm, setShowPlatformConfirm] = useState(false);
    
    // Filtering State
    const [searchTerm, setSearchTerm] = useState('');
    const [priceRange, setPriceRange] = useState({ min: 0, max: 2500 });
    const [selectedSpecs, setSelectedSpecs] = useState({});
    const [expandedGroups, setExpandedGroups] = useState([]);
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    useEffect(() => {
        // Reset filters when category changes
        setSearchTerm('');
        setPriceRange({ min: 0, max: 2500 });
        setSelectedSpecs({});
    }, [activeCategory]);

    useEffect(() => {
        if (initialConfig) {
            validateConfig(config);
        }
    }, []);

    const availableFilters = useMemo(() => {
        if (!products || products.length === 0) return [];
        const filterGroups = {};
        products.forEach(p => {
            if (p.specs) {
                Object.entries(p.specs).forEach(([key, value]) => {
                    // Exclusion list: internal metrics, dimensions, and redundant constraints (like socket, which is already fixed by the builder platform)
                    if (['perf_score', 'tdp', 'length', 'height', 'width', 'max_gpu_length', 'max_cooler_height', 'brand', 'socket'].includes(key)) return;
                    if (Array.isArray(value)) return; // Skip arrays like radiator_support for simplicity
                    
                    if (!filterGroups[key]) filterGroups[key] = [];
                    if (!filterGroups[key].includes(value)) filterGroups[key].push(value);
                });
            }
        });
        
        const translations = {
            socket: 'Zócalo / Socket',
            socket_support: 'Sockets Compatibles',
            memory_type: 'Tipo de Memoria',
            form_factor: 'Factor de Forma',
            chipset: 'Chipset (Base)',
            cores: 'Núcleos de Proceso',
            threads: 'Hilos de Trabajo',
            vram: 'Memoria VRAM',
            efficiency: 'Certificación Energética',
            wattage: 'Potencia Proporcionada',
            modular: 'Gestión de Cables',
            capacity: 'Capacidad / Espacio',
            interface: 'Conexión / Interfaz',
            type: 'Tipo de Unidad',
            speed: 'Velocidad / Frecuencia',
            latency: 'Latencia (CL)',
            series: 'Gama / Familia',
            integrated_graphics: 'Video Integrado',
            architecture: 'Microarquitectura',
            radiator_size: 'Tamaño de Radiador (mm)',
            color: 'Color Principal',
            brand: 'Fabricante / Marca',
            max_gpu_length: 'Longitud Máx. GPU (mm)',
            max_cooler_height: 'Altura Máx. Cooler (mm)',
            tdp: 'Consumo (TDP) (W)',
            voltage: 'Voltaje Operativo (V)',
            read_speed: 'Lectura Secuencial (MB/s)',
            write_speed: 'Escritura Secuencial (MB/s)'
        };

        return Object.entries(filterGroups).map(([key, values]) => {
            return {
                key,
                name: translations[key] || (key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')),
                options: values.sort()
            };
        });
    }, [products]);

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
    };

    const toggleGroup = (key) => {
        setExpandedGroups(prev => 
            prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
        );
    };

    const categories = [
        { slug: 'socket', name: 'Plataforma Base', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
        { slug: 'cpu', name: 'Procesador', icon: 'M9 3V2m6 1v1m-6 18v1m6-1v1M3 9H2m1 6H2m18-6h1m-1 6h1M5 5h14v14H5V5zm6 2a2 2 0 100 4 2 2 0 000-4z' },
        { slug: 'motherboard', name: 'Placa Base', icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z' },
        { slug: 'ram', name: 'Memoria RAM', icon: 'M4 8V6a2 2 0 012-2h12a2 2 0 012 2v2m-20 0v8a2 2 0 002 2h12a2 2 0 002-2v-8m-20 0h20M6 12h8m-8 4h4' },
        { slug: 'gpu', name: 'Tarjeta Gráfica', icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' },
        { slug: 'cooler', name: 'Refrigeración', icon: 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z' },
        { slug: 'storage', name: 'Almacenamiento', icon: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4' },
        { slug: 'psu', name: 'Fuente P.', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
        { slug: 'case', name: 'Caja/Torre', icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z' },
    ];

    const handlePlatformSelect = (platform) => {
        setSelectedPlatform(platform);
        setIsLoading(true);
        setActiveCategory('cpu');
        setShowingMobileMenu(false);
        
        const platformParam = `?platform=${platform}`;
        axios.get(route('builder.products', 'cpu') + platformParam)
            .then(response => {
                setProducts(response.data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error("Error fetching CPUs:", error);
                setIsLoading(false);
            });
    };

    const handleCategoryClick = async (categorySlug) => {
        setIsLoading(true);
        setActiveCategory(categorySlug);
        setShowingMobileMenu(false);
        if (categorySlug === 'socket') {
            setProducts([]);
            setIsLoading(false);
        } else {
            try {
                const platformParam = selectedPlatform ? `?platform=${selectedPlatform}` : '';
                const motherboardParam = config.motherboard ? (selectedPlatform ? '&' : '?') + `motherboard=${config.motherboard.id}` : '';
                const response = await axios.get(route('builder.products', categorySlug) + platformParam + motherboardParam);
                setProducts(response.data);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
            setIsLoading(false);
        }
    };

    const selectProduct = (categorySlug, product) => {
        const newConfig = { ...config, [categorySlug]: product };
        setConfig(newConfig);
        validateConfig(newConfig);
        
        // Find next empty category
        const keys = categories.map(c => c.slug).filter(s => s !== 'socket');
        const currentIndex = keys.indexOf(categorySlug);
        let nextSlug = null;
        for (let i = currentIndex + 1; i < keys.length; i++) {
            if (!newConfig[keys[i]]) {
                nextSlug = keys[i];
                break;
            }
        }
        if (nextSlug) handleCategoryClick(nextSlug);
        else setActiveCategory(null);
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
            const { compatibility: compResult, performance: perfResult, technical: techResult } = response.data;
            
            setCompatibility(compResult || { valid: true, errors: [], alerts: [] });
            setPerformance(perfResult || { competitive: 0, aaa: 0, ultra: 0, bottleneck: 100, reason: '' });
            setTechSummary(techResult || null);
        } catch (error) {
            console.error("Validation error:", error);
        }
    };

    const confirmPlatformChange = () => {
        setSelectedPlatform(null); 
        const resetConfig = {};
        Object.keys(config).forEach(k => resetConfig[k] = null);
        setConfig(resetConfig);
        setCompatibility({ valid: true, errors: [], alerts: [] });
        handleCategoryClick('socket');
        setShowPlatformConfirm(false);
    };

    const formatSpecKey = (key) => {
        const dictionary = {
            socket: 'Socket',
            socket_support: 'Soporte Socket',
            tdp: 'Consumo TDP',
            cores: 'Núcleos',
            threads: 'Hilos',
            frequency: 'Frecuencia',
            boost_freq: 'Turbo Boost',
            form_factor: 'Factor de Forma',
            chipset: 'Chipset',
            ram_slots: 'Ranuras RAM',
            max_ram: 'RAM Máxima',
            m2_slots: 'Ranuras M.2',
            type: 'Tipo',
            capacity: 'Capacidad',
            speed: 'Velocidad',
            modules: 'Configuración',
            latency: 'Latencia',
            vram: 'VRAM',
            base_clock: 'Reloj Base',
            boost_clock: 'Reloj Turbo',
            clock_speed: 'Reloj Base',
            length: 'Longitud',
            wattage: 'Potencia',
            efficiency: 'Certificación',
            modular: 'Modularidad',
            read_speed: 'Lectura',
            write_speed: 'Escritura',
            interface: 'Interfaz',
            size: 'Tamaño',
            rpm: 'Velocidad Ventilador',
            noise_level: 'Nivel Ruido',
            water_cooled: 'Refrig. Líquida',
            radiator_size: 'Radiador',
            side_panel: 'Panel Lateral',
            color: 'Color',
            power_connectors: 'Conectores PCI-E',
            max_cooler_height: 'Altura Máx. CPU',
            height: 'Altura',
            max_gpu_length: 'Largo Máx. GPU',
            perf_score: 'Puntuación Rendimiento',
            radiator_support: 'Radiadores'
        };
        return dictionary[key] || key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    const formatSpecValue = (key, value) => {
        if (value === null || value === undefined) return value;
        
        // Handle Arrays (Sockets, Radiator Support, etc)
        if (Array.isArray(value)) {
            const formattedItems = value.map(item => {
                if (key === 'radiator_support' && !String(item).toLowerCase().includes('mm')) return `${item} mm`;
                return item;
            });
            return formattedItems.join(', ');
        }

        const lowerVal = String(value).toLowerCase();
        
        const unitMap = {
            tdp: 'W',
            wattage: 'W',
            vram: 'GB',
            capacity: 'GB',
            max_ram: 'GB',
            read_speed: 'MB/s',
            write_speed: 'MB/s',
            length: 'mm',
            height: 'mm',
            width: 'mm',
            radiator_size: 'mm',
            max_cooler_height: 'mm',
            max_gpu_length: 'mm',
            noise_level: 'dB',
            rpm: 'RPM',
            cores: 'Ndos'
        };

        // Special handling for speeds and frequencies
        if (key === 'speed' || key === 'base_clock' || key === 'boost_clock' || key === 'clock_speed') {
            if (!lowerVal.includes('mhz') && !lowerVal.includes('ghz') && !lowerVal.includes('mt')) {
                const numericVal = parseInt(value);
                return isNaN(numericVal) ? value : (numericVal > 1000 ? `${value} MHz` : `${value} GHz`);
            }
        }

        if (key === 'frequency' || key === 'boost_freq') {
            if (!lowerVal.includes('ghz') && !lowerVal.includes('mhz')) {
                return `${value} GHz`;
            }
        }

        if (key === 'latency' && !lowerVal.includes('cl')) return `CL${value}`;

        let unit = unitMap[key];
        if (unit && !lowerVal.includes(unit.toLowerCase())) {
            return `${value} ${unit}`;
        }

        if (typeof value === 'boolean' || lowerVal === 'true' || lowerVal === 'false' || lowerVal === '1' || lowerVal === '0') {
             return (lowerVal === 'true' || lowerVal === '1') ? 'Sí' : 'No';
        }
        
        return value;
    };

    const getSyncLevel = (product) => {
        let level = 1;
        const currentBrands = Object.values(config)
            .filter(Boolean)
            .map(p => p.specs?.brand || p.name.split(' ')[0]);
            
        const prodBrand = product.specs?.brand || product.name.split(' ')[0];
        
        if (currentBrands.includes(prodBrand)) {
            level++;
        } else if (currentBrands.length === 0) {
            level++;
        }
        
        if (parseFloat(product.price) > 100 || (product.specs && Object.keys(product.specs).length > 2)) {
            level++;
        }
        
        return Math.min(3, level);
    };

    const calculateTotal = () => {
        return Object.values(config).reduce((total, item) => total + (item ? parseFloat(item.price) : 0), 0).toFixed(2);
    };

    const getFilteredProducts = () => {
        return products.filter(p => {
            // Basic Filters
            const nameMatch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
            const priceMatch = parseFloat(p.price) >= priceRange.min && parseFloat(p.price) <= priceRange.max;
            
            if (!nameMatch || !priceMatch) return false;

            // Technical Spec Filters
            if (Object.keys(selectedSpecs).length > 0) {
                for (const [key, values] of Object.entries(selectedSpecs)) {
                    if (!values || values.length === 0) continue;
                    const specVal = p.specs ? p.specs[key] : null;
                    if (specVal === null || specVal === undefined) return false;
                    
                    if (!values.includes(specVal)) return false;
                }
            }
            return true;
        });
    };

    const filteredProducts = getFilteredProducts();

    // Calculate progress (out of total valid categories minus socket)
    const validConfigKeys = Object.values(config).filter(v => v !== null).length;
    const progressPercentage = (validConfigKeys / (categories.length - 1)) * 100;

    const addConfigToCart = () => {
        if (!compatibility.valid) return alert("Corrige los problemas de compatibilidad antes de añadir al carrito.");
        const items = [];
        for (const [key, value] of Object.entries(config)) {
             if (value) items.push({ id: value.id, quantity: 1 });
        }
        if (items.length > 0) {
            router.post(route('cart.bulkAdd'), { items }, { 
                preserveScroll: true, 
                preserveState: true,
                onSuccess: () => alert("¡Configuración añadida al carrito!")
            });
        }
    };

    const saveConfig = (asNew = false) => {
        if (!auth.user) {
             window.location.href = route('login');
             return;
        }
        if (!compatibility.valid) return alert("Corrige los problemas de compatibilidad antes de guardar.");
        
        let name = initialConfig?.name;
        if (asNew || !initialConfig) {
            name = prompt("Introduce un nombre para tu proyecto:", name || "");
            if (!name) return;
        }

        const components = {};
        for (const [key, value] of Object.entries(config)) {
             if (value) components[key] = value.id;
        }

        const payload = {
             name, configuration: components, total_price: parseFloat(calculateTotal())
        };

        if (initialConfig && !asNew) {
            axios.put(route('saved-configs.update', initialConfig.id), payload)
                .then(() => window.location.href = route('dashboard'))
                .catch(() => alert("Error al actualizar el proyecto."));
        } else {
            axios.post(route('builder.save'), payload)
                .then(() => window.location.href = route('dashboard'))
                .catch(() => alert("Error al guardar el proyecto."));
        }
    };

    const rightPanelContent = (
        <AnimatePresence mode="wait">
            {activeCategory === 'socket' ? (
                <motion.div 
                    key="socket"
                    initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}
                    className="glass-card-premium p-8 rounded-3xl"
                >
                    <div className="text-center mb-10">
                        <div className="inline-flex p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 mb-4 border border-emerald-500/20">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={categories[0].icon} /></svg>
                        </div>
                        <h2 className="text-3xl font-black text-white tracking-tight mb-2 uppercase italic">Configurador de PC Zend</h2>
                        <p className="text-slate-400 max-w-lg mx-auto">Selecciona tu plataforma básica. El sistema ajustará automáticamente las piezas para garantizar que todo encaje a la perfección.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { id: 'AM5', name: 'AMD Ryzen AM5', desc: 'Zen 4/5, DDR5, PCIe 5.0', color: 'from-orange-500/20 to-red-500/10', border: 'hover:border-orange-500/50', accent: 'text-orange-400' },
                            { id: 'AM4', name: 'AMD Ryzen AM4', desc: 'Zen 3, DDR4, Máxima Eficiencia', color: 'from-emerald-500/20 to-teal-500/10', border: 'hover:border-emerald-500/50', accent: 'text-emerald-400' },
                            { id: 'LGA 1700', name: 'Intel LGA 1700', desc: 'Gen 12-14, Híbrida, DDR4/DDR5', color: 'from-blue-500/20 to-emerald-500/10', border: 'hover:border-blue-500/50', accent: 'text-blue-400' }
                        ].map(p => (
                            <button 
                                key={p.id}
                                onClick={() => handlePlatformSelect(p.id)} 
                                className={`group glass-panel relative overflow-hidden p-6 rounded-2xl border border-white/5 ${p.border} transition-all duration-500 flex flex-col items-center text-center hover:-translate-y-1`}
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${p.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                                <div className="relative z-10">
                                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4 border border-white/10 group-hover:scale-110 transition-transform">
                                        <span className={`font-black text-xs ${p.accent}`}>{p.id.split(' ')[0]}</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-2 tracking-tight uppercase">{p.name}</h3>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{p.desc}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </motion.div>
            ) : activeCategory ? (
                <motion.div 
                    key={activeCategory}
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                    className="flex-1 flex flex-col lg:overflow-hidden lg:min-h-0"
                >
                    {/* Integrated Header */}
                    <div className="glass-card-premium p-4 rounded-2xl mb-6 border border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 flex-shrink-0">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20 shadow-[0_0_20px_rgba(52, 211, 153,0.1)]">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={categories.find(c => c.slug === activeCategory)?.icon} /></svg>
                            </div>
                            <div>
                                <div className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-0.5">Piezas Sugeridas</div>
                                <h2 className="text-xl font-black text-white uppercase tracking-tight italic">
                                    {categories.find(c => c.slug === activeCategory)?.name}
                                </h2>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <div className="relative flex-grow md:w-64">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                </div>
                                <input 
                                    type="text" 
                                    placeholder="Modelo o marca..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-dark-bg/50 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-[11px] font-bold text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all outline-none"
                                />
                            </div>
                            <button onClick={() => setShowMobileFilters(true)} className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-colors">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                            </button>
                        </div>
                    </div>

                    {/* Inventory Scroll Area */}
                    <div className="flex-1 relative min-h-0">
                        {isLoading ? (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-12 h-12 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
                            </div>
                        ) : (
                            <div className="absolute inset-0 overflow-y-auto pr-2 styled-scrollbar pb-10">
                                <div className="grid grid-cols-1 gap-4">
                                    {filteredProducts.length > 0 ? (
                                    filteredProducts.map((product, idx) => (
                                        <motion.div 
                                            key={product.id} 
                                            layout
                                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            transition={{ duration: 0.4, ease: "easeOut", delay: Math.min(idx * 0.05, 0.5) }}
                                            className="glass-card-premium group relative overflow-hidden p-5 rounded-2xl border border-white/5 hover:border-emerald-500/40 transition-all duration-500 flex flex-col md:flex-row gap-6 hover:shadow-[0_0_40px_rgba(52, 211, 153,0.05)]"
                                        >
                                            <div className="w-full md:w-44 h-44 shrink-0 bg-white rounded-xl p-4 flex items-center justify-center overflow-hidden relative transition-all duration-500">
                                                {product.image ? (
                                                    <img src={product.image} alt={product.name} className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-700" />
                                                ) : (
                                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Sin Imagen</div>
                                                )}
                                                <div className="absolute top-2 left-2 px-2 py-0.5 bg-dark-bg/80 backdrop-blur rounded text-[9px] font-bold text-white border border-white/10 uppercase tracking-tighter">
                                                    {product.specs?.brand || (product.name.split(' ')[0])}
                                                </div>
                                            </div>

                                            <div className="flex-grow flex flex-col min-w-0">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="min-w-0">
                                                        <h4 className="font-black text-xl text-white mb-2 leading-tight group-hover:text-emerald-300 transition-colors tracking-tight uppercase italic">{product.name}</h4>
                                                        <div className="flex flex-wrap gap-2 mb-4">
                                                            {product.specs && (() => {
                                                                let specs = Object.entries(product.specs);
                                                                let highlightKey = null;
                                                                
                                                                if (activeCategory === 'case' && config.cooler) {
                                                                    const isAio = config.cooler.specs?.type === 'AIO';
                                                                    if (isAio) {
                                                                        highlightKey = 'radiator_support';
                                                                        specs = specs.filter(([k]) => k !== 'max_cooler_height');
                                                                        const rad = specs.find(([k]) => k === highlightKey);
                                                                        if (rad) specs = [rad, ...specs.filter(([k]) => k !== highlightKey)];
                                                                    } else {
                                                                        highlightKey = 'max_cooler_height';
                                                                        specs = specs.filter(([k]) => k !== 'radiator_support');
                                                                        const height = specs.find(([k]) => k === highlightKey);
                                                                        if (height) specs = [height, ...specs.filter(([k]) => k !== highlightKey)];
                                                                    }
                                                                }
                                                                
                                                                return specs.slice(0, 4).map(([k, v]) => {
                                                                    const isHighlighted = k === highlightKey;
                                                                    return (
                                                                        <span key={k} className={`status-pill ${isHighlighted ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-slate-500 bg-white/5 border-white/5'}`}>
                                                                            {formatSpecKey(k)}: <span className={isHighlighted ? 'text-emerald-300 font-bold' : 'text-slate-300'}>{formatSpecValue(k, v)}</span>
                                                                        </span>
                                                                    );
                                                                });
                                                            })()}
                                                        </div>
                                                    </div>
                                                    <div className="text-right shrink-0">
                                                        <div className="text-3xl font-black text-white tracking-widest">{Number(product.price).toLocaleString('es-ES', { minimumFractionDigits: 2 })}<span className="text-emerald-400 text-lg ml-1">€</span></div>
                                                        <div className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mt-1">Pieza Verificada</div>
                                                    </div>
                                                </div>
                                                
                                                <p className="text-xs text-slate-400 leading-relaxed mb-6 opacity-70 italic font-medium">
                                                    {product.description || "Componente verificado de alta fidelidad, seleccionado para maximizar el potencial de tu build ZendPC."}
                                                </p>
                                                
                                                <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                                                    <div className="flex gap-1.5 items-center">
                                                        {[1, 2, 3].map(level => {
                                                            const isMax = getSyncLevel(product) === 3;
                                                            const isActive = getSyncLevel(product) >= level;
                                                            return (
                                                                <div key={level} className={`w-1.5 h-1.5 rounded-full ${isActive ? (isMax ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-emerald-500 shadow-[0_0_8px_rgba(52, 211, 153,0.8)]') : 'bg-white/10'}`}></div>
                                                            );
                                                        })}
                                                        <span className={`text-[8px] font-black uppercase tracking-widest ml-2 ${getSyncLevel(product) === 3 ? 'text-emerald-500' : 'text-slate-600'}`}>
                                                            Compatibilidad de Piezas
                                                        </span>
                                                    </div>
                                                    <button 
                                                        onClick={() => selectProduct(activeCategory, product)}
                                                        className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl action-glow transition-all active:scale-95"
                                                    >
                                                        Añadir Selección
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))
                                ) : (
                                    <div className="flex-1 flex flex-col items-center justify-center py-20 bg-white/2 rounded-3xl border border-white/5 italic text-slate-500">
                                        <svg className="w-12 h-12 mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                                        <p className="text-sm font-bold uppercase tracking-widest">Sin Resultados Compatibles</p>
                                    </div>
                                )}
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            ) : (
                progressPercentage === 100 ? (
                    <motion.div 
                        key="completed"
                        initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
                        className="flex-1 flex flex-col items-center justify-center text-center p-8 glass-card-premium rounded-[2.5rem] relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-emerald-500/[0.02] pointer-events-none"></div>
                        <div className="relative z-10">
                            <div className="w-24 h-24 mx-auto mb-10 rounded-[2rem] bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20 shadow-[0_0_50px_rgba(16,185,129,0.15)] relative">
                                <div className="absolute inset-0 rounded-[2rem] border border-emerald-500/50 animate-ping opacity-20"></div>
                                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                            </div>
                            <h2 className="text-4xl font-black text-white uppercase tracking-tight italic mb-3">Piezas Listas</h2>
                            <p className="text-slate-400 max-w-md mx-auto mb-10 text-sm font-medium">Todos los componentes han sido revisados. El equipo está equilibrado y listo para montar.</p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6 w-full max-w-xl mx-auto">
                            {initialConfig ? (
                                <div className="flex-1 flex flex-col gap-2">
                                    <button 
                                        onClick={() => saveConfig(false)}
                                        disabled={!compatibility.valid}
                                        className={`w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-[0.2em] rounded-xl action-glow transition-all active:scale-95 text-[10px] ${!compatibility.valid && 'opacity-50 grayscale cursor-not-allowed'}`}
                                    >
                                        Sobrescribir Manifiesto
                                    </button>
                                    <button 
                                        onClick={() => saveConfig(true)}
                                        disabled={!compatibility.valid}
                                        className={`w-full py-2.5 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 text-emerald-400 font-black uppercase tracking-[0.2em] rounded-xl transition-all active:scale-95 text-[10px] ${!compatibility.valid && 'opacity-50 grayscale cursor-not-allowed'}`}
                                    >
                                        Guardar Como Nuevo
                                    </button>
                                </div>
                            ) : (
                                <button 
                                    onClick={() => saveConfig(false)}
                                    disabled={!compatibility.valid}
                                    className={`flex-1 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-[0.2em] rounded-2xl action-glow transition-all active:scale-95 text-xs ${!compatibility.valid && 'opacity-50 grayscale cursor-not-allowed'}`}
                                >
                                    Guardar Manifiesto
                                </button>
                            )}
                            <button 
                                onClick={addConfigToCart}
                                disabled={!compatibility.valid}
                                className={`flex-1 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-[0.2em] rounded-2xl border border-emerald-500/50 shadow-[0_0_20px_rgba(16, 185, 129,0.3)] transition-all active:scale-95 text-xs flex items-center justify-center gap-2 ${!compatibility.valid && 'opacity-50 grayscale cursor-not-allowed'}`}
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                Añadir a la Cesta
                            </button>
                        </div>
                        </div>
                    </motion.div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                        <div className="w-20 h-20 mb-8 rounded-3xl border border-white/10 flex items-center justify-center animate-pulse shadow-[0_0_40px_rgba(255,255,255,0.05)]">
                            <svg className="w-10 h-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        </div>
                        <p className="text-sm font-black text-white uppercase tracking-[0.4em]">Iniciando Núcleo Zend...</p>
                    </div>
                )
            )}
        </AnimatePresence>
    );

    return (
        <>
            <Head title="Configurador" />
            <div className="min-h-screen lg:h-screen bg-[#080a11] text-slate-200 selection:bg-emerald-500/30 overflow-x-hidden lg:overflow-hidden flex flex-col">
                {/* Global Aura */}
                <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-emerald-600/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>
                
                {/* Navbar Refinada */}
                <nav className="glass-nav border-b-white/5 border-b-[0.5px]">
                    <div className="max-w-[1700px] mx-auto px-6">
                        <div className="flex justify-between h-20">
                            <div className="flex items-center">
                                <Link href="/" className="flex items-center gap-4 group">
                                    <ApplicationLogo className="h-10 md:h-12 w-auto group-hover:scale-105 transition-transform duration-500 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]" />
                                </Link>
                                <div className="hidden lg:flex ml-20 items-center gap-12">
                                    <Link href={route('home')} className="text-slate-400 hover:text-white text-[10px] font-black uppercase tracking-[0.2em] transition-colors">
                                        Inicio
                                    </Link>
                                    <Link href={route('catalog.index')} className="text-slate-400 hover:text-white text-[10px] font-black uppercase tracking-[0.2em] transition-colors">
                                        Catálogo
                                    </Link>
                                    <Link href={route('builder.index')} className="text-white border-b-2 border-emerald-500 pb-1 text-[10px] font-black uppercase tracking-[0.2em] transition-colors">
                                        Configurador
                                    </Link>
                                    <Link href={route('dashboard')} className="text-slate-400 hover:text-white text-[10px] font-black uppercase tracking-[0.2em] transition-colors">
                                        Mi Taller
                                    </Link>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-6">
                                {auth.user ? (
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <button className="flex items-center gap-4 px-5 py-2.5 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.07] transition-all group focus:outline-none">
                                                <div className="text-right hidden sm:block">
                                                    <div className="text-[11px] font-black text-white uppercase tracking-tight leading-none mb-1">{auth.user.name}</div>
                                                    <div className="text-[9px] font-black text-emerald-500 uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">Panel Usuario</div>
                                                </div>
                                                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-black border border-emerald-500/10 shadow-inner">
                                                    {auth.user.name.charAt(0).toUpperCase()}
                                                </div>
                                            </button>
                                        </Dropdown.Trigger>
                                        <Dropdown.Content contentClasses="py-1 bg-[#0f121d] border border-white/5 rounded-xl shadow-2xl mt-2">
                                            {(auth.user.role === 'admin' || auth.user.role === 'super_admin') && (
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
                                    <Link href={route('login')} className="px-8 py-3 rounded-2xl bg-white/[0.03] border border-white/5 text-[10px] font-black uppercase tracking-widest hover:bg-white/[0.08] transition-all">
                                        Sincronizar cuenta
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>

                <div className="py-6 px-8 max-w-[1850px] mx-auto w-full flex-1 flex flex-col pb-32 lg:pb-[140px] lg:overflow-hidden lg:min-h-0 relative z-10">
                    <div className="flex flex-col lg:flex-row gap-8 items-stretch h-full lg:overflow-hidden lg:min-h-0 flex-1">
                        
                        {/* Column 1: Vertical Progress Nav (Left) */}
                        <aside className="w-full lg:w-[320px] flex-shrink-0 flex flex-col lg:h-full lg:overflow-hidden">
                            <div className="glass-card-premium p-6 rounded-[2.5rem] flex flex-col h-full border border-white/5 shadow-2xl relative">
                                <div className="flex items-center justify-between mb-10 px-2">
                                    <div className="hud-label tracking-[0.3em]">Progreso del Montaje</div>
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(52, 211, 153,0.8)] animate-pulse"></div>
                                        <span className="text-[11px] font-black text-white italic tracking-tighter">{Math.round(progressPercentage)}%</span>
                                    </div>
                                </div>

                                <div className="flex-1 relative min-h-0">
                                    <div className="absolute inset-0 space-y-2.5 overflow-y-auto styled-scrollbar pr-1.5 pb-4">
                                        {categories.map((cat, idx) => {
                                        const isSocket = cat.slug === 'socket';
                                        const isSelected = isSocket ? !!selectedPlatform : !!config[cat.slug];
                                        const isActive = activeCategory === cat.slug;
                                        const isDisabled = !isSocket && !selectedPlatform;

                                        return (
                                            <button 
                                                key={cat.slug} 
                                                disabled={isDisabled}
                                                onClick={() => isSocket && isSelected ? setShowPlatformConfirm(true) : handleCategoryClick(cat.slug)}
                                                className={`group w-full text-left p-4 rounded-3xl border transition-all duration-500 relative ${isDisabled ? 'opacity-20 cursor-not-allowed grayscale border-transparent' : 'cursor-pointer'} ${isActive ? 'bg-emerald-500/[0.07] border-emerald-500/50 shadow-[inset_0_0_20px_rgba(52, 211, 153,0.05)]' : isSelected ? 'bg-emerald-500/[0.03] border-emerald-500/20 hover:border-emerald-500/40' : 'bg-white/[0.01] border-white/[0.03] hover:border-white/20'}`}
                                            >
                                                {isActive && <div className="absolute inset-0 bg-emerald-500/[0.03] rounded-3xl" />}
                                                
                                                <div className="flex items-center justify-between gap-4 relative z-10">
                                                    <div className="flex items-center gap-4 min-w-0">
                                                        <div className={`shrink-0 w-9 h-9 rounded-xl transition-all duration-700 flex items-center justify-center ${isActive ? 'bg-emerald-600 text-white shadow-[0_0_20px_rgba(16, 185, 129,0.5)] scale-110' : isSelected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-slate-600'}`}>
                                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isActive ? 2.5 : 2} d={cat.icon} /></svg>
                                                        </div>
                                                        <div className="min-w-0">
                                                            <span className={`block text-[9px] font-black uppercase tracking-[0.2em] mb-0.5 ${isActive ? 'text-emerald-400' : isSelected ? 'text-emerald-400' : 'text-slate-500'}`}>{cat.name}</span>
                                                            {isSelected ? (
                                                                <span className="block text-[11px] font-black text-white max-w-full italic tracking-tight">
                                                                    {isSocket ? selectedPlatform : config[cat.slug].name}
                                                                </span>
                                                            ) : (
                                                                <span className="block text-[9px] font-black text-slate-800 uppercase tracking-widest italic">En espera...</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {isSelected && (
                                                        <div className="shrink-0 w-5 h-5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                                                            <svg className="w-3 h-3 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>
                                                        </div>
                                                    )}
                                                </div>
                                            </button>
                                        );
                                    })}
                                    </div>
                                </div>
                                {!compatibility.valid && (
                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-6 pt-4 border-t border-red-500/10 text-red-400 flex-shrink-0">
                                        <div className="flex items-center gap-2 font-black text-[10px] uppercase mb-2 tracking-widest">
                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                            Incompatible
                                        </div>
                                        <ul className="text-[10px] opacity-70 list-disc ml-5 space-y-1 font-bold italic">
                                            {compatibility.errors?.map((err, idx) => <li key={idx}>{err}</li>)}
                                        </ul>
                                    </motion.div>
                                )}
                            </div>
                        </aside>

                        {/* Column 2: Content (Middle) */}
                        <main className="flex-1 min-w-0 flex flex-col lg:h-full lg:overflow-hidden lg:min-h-0">
                            {rightPanelContent}
                        </main>

                        {/* Column 3: HUD / Technical (Right) */}
                        <aside className="w-full lg:w-[360px] flex-shrink-0 flex flex-col lg:h-full lg:overflow-hidden lg:min-h-0 pb-4">
                            <div className="flex-1 relative min-h-0">
                                <div className="absolute inset-0 space-y-8 overflow-y-auto styled-scrollbar pr-2 pb-10">
                                    {/* Technical Dashboard */}
                                <div className="glass-card-premium p-8 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-8 opacity-5">
                                        <svg className="w-32 h-32 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 3v2m6-1v1m-6 18v1m6-1v1M3 9H2m1 6H2m18-6h1m-1 6h1M5 5h14v14H5V5zm6 2a2 2 0 100 4 2 2 0 000-4z" /></svg>
                                    </div>
                                    
                                    <div className="flex items-center gap-4 mb-10 relative z-10">
                                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                        </div>
                                        <div className="hud-label tracking-[0.3em] font-black">Detalles de las Piezas</div>
                                    </div>

                                    {techSummary ? (
                                        <div className="space-y-8 relative z-10">
                                            {/* Power Meter */}
                                            <div>
                                                <div className="flex justify-between items-end mb-3">
                                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic font-bold">Consumo de Energía</span>
                                                    <span className={`text-[11px] font-black tracking-widest ${techSummary.energy.status > 85 ? 'text-orange-400' : 'text-emerald-400'}`}>
                                                        {techSummary.energy.estimated}W <span className="text-slate-600 mx-1">/</span> {techSummary.energy.capacity ? `${techSummary.energy.capacity}W` : '---'}
                                                    </span>
                                                </div>
                                                <div className="h-2 bg-white/[0.03] rounded-full overflow-hidden p-0.5 border border-white/5 ring-1 ring-white/5">
                                                    <motion.div 
                                                        initial={{ width: 0 }} 
                                                        animate={{ width: `${Math.min(techSummary.energy.status || 0, 100)}%` }}
                                                        transition={{ duration: 1.5, ease: "circOut" }}
                                                        className={`h-full rounded-full ${techSummary.energy.status > 85 ? 'bg-gradient-to-r from-orange-500 to-red-600 shadow-[0_0_15px_rgba(249,115,22,0.6)]' : 'bg-gradient-to-r from-emerald-500 to-teal-500 shadow-[0_0_15px_rgba(16,185,129,0.6)]'}`} 
                                                    />
                                                </div>
                                            </div>

                                            {/* Physical Clearances */}
                                            <div className="grid grid-cols-2 gap-5">
                                                {[
                                                    { label: 'Longitud GPU', val: techSummary.clearances.gpu.current, max: techSummary.clearances.gpu.max, valid: techSummary.clearances.gpu.is_valid, icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
                                                    { label: 'Altura Cooler', val: techSummary.clearances.cooler.current, max: techSummary.clearances.cooler.max, valid: techSummary.clearances.cooler.is_valid, icon: 'M12 3v1m0 16v1' }
                                                ].map((c, i) => (
                                                    <div key={i} className="bg-white/[0.02] p-5 rounded-3xl border border-white/5 group hover:border-white/10 transition-colors">
                                                        <div className="hud-label text-[8px] mb-3 opacity-50">{c.label}</div>
                                                        <div className="flex items-end gap-2.5">
                                                            <div className="text-lg font-black text-white italic tracking-tighter leading-none">{c.val || 0}</div>
                                                            <div className="text-[10px] font-black text-slate-700 uppercase tracking-widest leading-none mb-1">/ {c.max || '---'}</div>
                                                        </div>
                                                        <div className="mt-3 flex items-center gap-2">
                                                            <div className={`w-1.5 h-1.5 rounded-full ${c.valid ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]'}`} />
                                                            <span className={`text-[8px] font-black uppercase tracking-[0.2em] ${c.valid ? 'text-emerald-500' : 'text-red-500'}`}>{c.valid ? 'Apto' : 'Exceso'}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="flex gap-2.5">
                                                <div className="flex-1 bg-white/[0.03] p-3 rounded-2xl text-center border border-white/5">
                                                    <div className="hud-label text-[8px] mb-1.5 opacity-40">Infraestructura</div>
                                                    <div className="text-[10px] font-black text-white uppercase tracking-widest">{techSummary.motherboard.type || 'S/N'}</div>
                                                </div>
                                                <div className="flex-1 bg-white/[0.03] p-3 rounded-2xl text-center border border-white/5">
                                                    <div className="hud-label text-[8px] mb-1.5 opacity-40">Factor Forma</div>
                                                    <div className="text-[10px] font-black text-white uppercase tracking-widest">{techSummary.motherboard.format || 'S/N'}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="py-16 text-center">
                                            <div className="w-12 h-12 border-2 border-white/5 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4"></div>
                                            <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.3em] italic">Esperando hardware...</p>
                                        </div>
                                    )}
                                </div>

                                {/* Gaming HUD Card */}
                                <AnimatePresence>
                                    {config.gpu && (
                                        <motion.div 
                                            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                                            className="glass-card-premium overflow-hidden rounded-[2.5rem] group relative border border-white/5 shadow-2xl"
                                        >
                                            <div className="bg-gradient-to-r from-emerald-600/10 to-purple-600/10 p-7 border-b border-white/5 flex items-center justify-between">
                                                <div>
                                                    <div className="hud-label tracking-[0.3em] text-emerald-400 mb-1">Rendimiento en Juegos</div>
                                                    <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Base de datos v4.2</div>
                                                </div>
                                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                                                    <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /></svg>
                                                </div>
                                            </div>
                                            <div className="p-8 space-y-6">
                                                {[
                                                    { label: 'Competitivo (1080p)', val: performance.competitive, max: 400, color: 'from-emerald-400' },
                                                    { label: 'Triple A (1440p)', val: performance.aaa, max: 165, color: 'from-emerald-400' },
                                                    { label: 'Ultra (4K)', val: performance.ultra, max: 100, color: 'from-purple-400' }
                                                ].map((t, idx) => (
                                                    <div key={idx}>
                                                        <div className="flex justify-between items-end mb-2.5">
                                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.1em]">{t.label}</span>
                                                            <span className="text-lg font-black text-white italic tracking-widest leading-none">{t.val}<span className="text-[9px] text-slate-600 ml-1 font-black">FPS</span></span>
                                                        </div>
                                                        <div className="h-1 bg-white/[0.03] rounded-full overflow-hidden p-[1px]">
                                                            <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min((t.val / t.max) * 100, 100)}%` }} transition={{ duration: 1.5, delay: idx * 0.1 }} className={`h-full bg-gradient-to-r ${t.color} to-white shadow-[0_0_10px_rgba(255,255,255,0.1)]`} />
                                                        </div>
                                                    </div>
                                                ))}

                                                {performance.bottleneck < 80 && (
                                                    <div className="mt-8 p-5 bg-orange-500/[0.04] border border-orange-500/20 rounded-3xl relative overflow-hidden group/alert">
                                                        <div className="absolute top-0 left-0 w-1 h-full bg-orange-500 group-hover/alert:w-full transition-all duration-700 opacity-20"></div>
                                                        <div className="relative z-10">
                                                            <div className="flex items-center gap-2.5 text-[9px] font-black text-orange-500 uppercase tracking-[0.2em] mb-2.5">
                                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                                                Detección de Desbalance
                                                            </div>
                                                            <p className="text-[10px] text-orange-200/50 leading-relaxed font-bold tracking-tight italic">{performance.reason}</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>

                {/* Main Action Bar (Floating) */}
                <div className="fixed bottom-0 left-0 w-full z-[60] px-4 pb-4 pointer-events-none">
                    <motion.div 
                        initial={{ y: 120, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, ease: "circOut", delay: 0.5 }}
                        className="max-w-[1700px] mx-auto glass-card-premium p-4 md:p-5 rounded-[2rem] shadow-[0_30px_60px_rgba(0,0,0,0.8)] border border-white/10 pointer-events-auto flex flex-col md:flex-row items-center justify-between gap-6"
                    >
                        <div className="flex items-center gap-8">
                            <div className="hidden sm:block min-w-48">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="hud-label text-[9px] tracking-[0.2em] font-black">Sync Status</span>
                                    <span className="text-[10px] font-black text-white italic">{Math.round(progressPercentage)}%</span>
                                </div>
                                <div className="h-2 bg-white/[0.03] rounded-full overflow-hidden p-0.5 border border-white/5 ring-1 ring-white/5">
                                    <motion.div initial={{ width: 0 }} animate={{ width: `${progressPercentage}%` }} transition={{ duration: 2 }} className="h-full bg-gradient-to-r from-emerald-700 via-emerald-400 to-white rounded-full shadow-[0_0_15px_rgba(52, 211, 153,0.7)]" />
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <span className="hud-label text-[9px] mb-1 block tracking-[0.2em] opacity-40">Valoración del Proyecto</span>
                                <div className="text-3xl font-black text-white tracking-widest leading-none italic">
                                    {Number(calculateTotal()).toLocaleString('es-ES', { minimumFractionDigits: 2 })}<span className="text-xl text-emerald-600 ml-1">€</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 w-full md:w-auto">
                            {progressPercentage === 100 ? (
                                <>
                                    <button 
                                        onClick={saveConfig}
                                        className="flex-1 md:flex-none px-6 py-3 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] transition-all duration-500 bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)] action-glow"
                                    >
                                        Guardar
                                    </button>
                                    <button 
                                        onClick={addConfigToCart}
                                        className="flex-1 md:flex-none px-6 py-3 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] transition-all duration-500 bg-emerald-600 hover:bg-white hover:text-emerald-900 border border-emerald-500/50 shadow-[0_0_30px_rgba(52, 211, 153,0.4)] flex items-center gap-2 justify-center"
                                    >
                                        <svg className="w-4 h-4 hidden sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                        Comprar PC
                                    </button>
                                </>
                            ) : (
                                <button 
                                    className="px-10 py-3 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] transition-all duration-500 bg-white/5 text-slate-700 cursor-not-allowed border border-white/5 opacity-50 grayscale"
                                    disabled
                                >
                                    Sincronizar Manifiesto
                                </button>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Filter Modal */}
            <Modal show={showMobileFilters} onClose={() => setShowMobileFilters(false)} maxWidth="md" panelClasses="rounded-[2.5rem] bg-transparent">
                <div className="glass-card-premium border border-white/10 rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col max-h-[85vh]">
                    <div className="p-8 border-b border-white/10 relative z-10 shrink-0">
                        <div className="flex justify-between items-center relative z-10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
                                </div>
                                <h3 className="text-xl font-black text-white uppercase italic tracking-tight">Filtros Activos</h3>
                            </div>
                            <button onClick={() => setShowMobileFilters(false)} className="text-slate-500 hover:text-white transition-colors">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                    </div>
                    
                    <div className="p-8 space-y-8 overflow-y-auto styled-scrollbar relative z-10 flex-1">
                        <div className="mb-8">
                            <label className="block text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-4">Rango de Precios</label>
                            <div className="flex justify-between items-center text-[11px] font-black text-white italic mb-6 px-2">
                                <EditablePrice 
                                    value={priceRange.min} 
                                    onChange={val => setPriceRange({...priceRange, min: Math.min(val, priceRange.max - 1)})} 
                                    min={0} 
                                    max={priceRange.max - 1} 
                                />
                                <EditablePrice 
                                    value={priceRange.max} 
                                    onChange={val => setPriceRange({...priceRange, max: Math.max(val, priceRange.min + 1)})} 
                                    min={priceRange.min + 1} 
                                    max={2500} 
                                />
                            </div>
                            <div className="relative h-2 bg-white/5 rounded-full mb-2 flex items-center group/slider">
                                <input 
                                    type="range" 
                                    min={0} 
                                    max={2500} 
                                    step="10"
                                    value={priceRange.min}
                                    onChange={(e) => setPriceRange({...priceRange, min: Math.min(parseInt(e.target.value), priceRange.max - 10)})}
                                    className="absolute w-full h-2 bg-transparent appearance-none pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-lg z-30"
                                />
                                <input 
                                    type="range" 
                                    min={0} 
                                    max={2500} 
                                    step="10"
                                    value={priceRange.max}
                                    onChange={(e) => setPriceRange({...priceRange, max: Math.max(priceRange.min + 10, parseInt(e.target.value))})}
                                    className="absolute w-full h-2 bg-transparent appearance-none pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-lg z-30"
                                />
                                <div 
                                    className="absolute h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full shadow-[0_0_15px_rgba(52, 211, 153,0.5)] z-20"
                                    style={{ 
                                        left: `calc(${Math.max(0, Math.min(100, (priceRange.min / 2500) * 100))}% + ${10 - Math.max(0, Math.min(100, (priceRange.min / 2500) * 100)) * 0.2}px)`,
                                        right: `calc(${100 - Math.max(0, Math.min(100, (priceRange.max / 2500) * 100))}% + ${10 - (100 - Math.max(0, Math.min(100, (priceRange.max / 2500) * 100))) * 0.2}px)` 
                                    }}
                                ></div>
                            </div>
                        </div>

                        {/* Specification Filters from Catalog */}
                        {availableFilters && availableFilters.length > 0 && availableFilters.map((group) => (
                            <div key={group.key} className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
                                <button 
                                    onClick={() => toggleGroup(group.key)}
                                    className="w-full p-4 flex items-center justify-between group/btn outline-none bg-white/[0.02]"
                                >
                                    <h3 className="font-black text-white uppercase tracking-[0.2em] text-[9px] items-center gap-2 flex text-left">
                                        <div className="w-1.5 h-1.5 rounded-full bg-slate-500"></div>
                                        {group.name}
                                    </h3>
                                    <div className={`transition-transform duration-300 text-slate-500 group-hover/btn:text-white shrink-0 ${expandedGroups.includes(group.key) ? 'rotate-180' : ''}`}>
                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
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
                                            <div className="px-4 pb-4 pt-1 bg-white/[0.01]">
                                                <div className="space-y-3">
                                                    {group.options.map((opt) => (
                                                        <label 
                                                            key={opt}
                                                            className="flex items-center gap-3 cursor-pointer group/label"
                                                        >
                                                            <div className="relative w-4 h-4 shrink-0">
                                                                <input 
                                                                    type="checkbox" 
                                                                    className="peer hidden"
                                                                    checked={selectedSpecs[group.key]?.includes(opt)}
                                                                    onChange={() => handleSpecToggle(group.key, opt)}
                                                                />
                                                                <div className="w-4 h-4 rounded-md border-2 border-white/10 bg-white/[0.02] peer-checked:bg-emerald-600 peer-checked:border-emerald-600 transition-all group-hover/label:border-emerald-500/50"></div>
                                                                <svg className="absolute inset-0 w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity p-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                                            </div>
                                                            <span className={`text-[10px] font-black uppercase tracking-widest transition-colors break-words overflow-hidden ${selectedSpecs[group.key]?.includes(opt) ? 'text-white' : 'text-slate-500 group-hover/label:text-slate-300'}`}>
                                                                {opt}
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
                    </div>

                    <div className="p-6 border-t border-white/10 relative z-10 shrink-0 bg-[#0a0d16]">
                        <button onClick={() => setShowMobileFilters(false)} className="w-full px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_30px_rgba(52, 211, 153,0.3)] transition-all active:scale-95">
                            Aplicar Preferencias
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Platform Reset Confirmation */}
            <Modal show={showPlatformConfirm} onClose={() => setShowPlatformConfirm(false)} maxWidth="md">
                <div className="glass-card-premium p-12 border border-white/10 rounded-[3rem] shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-600 via-red-300 to-red-600 animate-pulse"></div>
                    <div className="flex flex-col items-center text-center">
                        <div className="w-24 h-24 rounded-[2rem] bg-red-500/10 flex items-center justify-center mb-8 border border-red-500/20 shadow-[0_0_40px_rgba(239,68,68,0.1)]">
                            <svg className="w-12 h-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        </div>
                        <h3 className="text-4xl font-black text-white italic mb-3 tracking-tighter uppercase leading-none">Reiniciar Sistema</h3>
                        <p className="text-slate-500 text-[11px] font-black uppercase tracking-[0.2em] leading-relaxed mb-12 max-w-[300px]">
                            La recalibración del zócalo requiere una purga total de la configuración actual.
                        </p>
                        <div className="flex w-full gap-5">
                            <button onClick={() => setShowPlatformConfirm(false)} className="flex-1 px-8 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 transition-all">Abortar</button>
                            <button onClick={confirmPlatformChange} className="flex-1 px-8 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-white bg-red-600 hover:bg-black hover:text-red-500 border-red-600 shadow-[0_0_40px_rgba(220,38,38,0.4)] transition-all">Confirmar Purga</button>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
}
