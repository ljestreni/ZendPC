import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Link, Head, router } from '@inertiajs/react';
import { motion } from 'framer-motion';

import { 
    CpuChipIcon, 
    Square3Stack3DIcon, 
    BoltIcon, 
    BeakerIcon, 
    ArrowsPointingOutIcon, 
    ShieldCheckIcon,
    CubeIcon,
    LightBulbIcon,
    ChevronRightIcon,
    InformationCircleIcon,
    ArchiveBoxIcon,
    WrenchScrewdriverIcon,
    FireIcon,
    SignalIcon
} from '@heroicons/react/24/outline';
import { useState } from 'react';

const PRODUCT_INSIGHTS = {
    '4090': {
        featureBlocks: [
            { icon: FireIcon, title: 'Enfriamiento Extremo', desc: 'Sistema Axial-tech optimizado con un 23% más de flujo de aire y cámara de vapor patentada para temperaturas bajo cero bajo carga extrema.' },
            { icon: CpuChipIcon, title: 'Núcleos Tensor 4.ª Gen', desc: 'Hasta 4 veces más rendimiento con DLSS 3 frente al renderizado de fuerza bruta, redefiniendo el realismo en 4K y 8K.' },
            { icon: ShieldCheckIcon, title: 'Construcción Reforzada', desc: 'Chasis de metal de alta precisión con backplate ventilado que aporta rigidez estructural y disipación pasiva de grado militar.' }
        ],
        longDescription: 'La ASUS ROG Strix GeForce RTX 4090 OC Edition es la culminación de la ingeniería gráfica moderna. Basada en la arquitectura NVIDIA Ada Lovelace, esta tarjeta no solo domina cualquier juego actual en resolución 8K, sino que sirve como una estación de trabajo de IA inigualable. Su diseño de 3.5 slots garantiza que el bloque de aletas masivo disipe el calor de los 16,384 núcleos CUDA con una eficiencia acústica sorprendente. Cada unidad es fabricada mediante el proceso Auto-Extreme exclusivo de ASUS, eliminando errores humanos en la soldadura.',
        inTheBox: ['Tarjeta de video ROG Strix RTX 4090 OC', 'Cable adaptador 16-pin (4x8-pin)', 'Soporte de GPU ROG Herculx', 'Velcro de gestión ROG', 'Guía de configuración rápida']
    },
    '7800X3D': {
        featureBlocks: [
            { icon: CpuChipIcon, title: 'AMD 3D V-Cache™', desc: 'La tecnología que cambió el gaming: 96MB de L3 cache apilada verticalmente para latencias mínimas y FPS máximos.' },
            { icon: BoltIcon, title: 'Eficiencia Zen 4', desc: 'Arquitectura de 5nm que entrega un rendimiento líder en la industria con un consumo energético sorprendentemente bajo.' },
            { icon: WrenchScrewdriverIcon, title: 'Socket AM5 Pro', desc: 'Plataforma con soporte garantizado hasta 2025+, preparada para futuras actualizaciones sin cambiar de placa base.' }
        ],
        longDescription: 'El AMD Ryzen 7 7800X3D es, indiscutiblemente, el procesador para gaming más rápido del mundo. Al integrar 104MB de memoria cache total mediante su revolucionaria tecnología de apilamiento 3D, este chip logra superar a procesadores con mayor número de núcleos en cargas de trabajo de juegos reales. Su eficiencia es tal que consume menos de la mitad que la competencia directa mientras entrega una estabilidad de frames 1% low inalcanzable para otros silicios.',
        inTheBox: ['Procesador Ryzen 7 7800X3D', 'Certificado de autenticidad', 'Guía de instalación AM5', 'Sticker ROG/AMD de colección']
    },
    '7950X': {
        featureBlocks: [
            { icon: CpuChipIcon, title: 'Nucleos Zen 4', desc: '16 núcleos y 32 hilos de pura potencia bruta, diseñados para renderizado masivo y multitarea sin concesiones.' },
            { icon: BoltIcon, title: 'IPC Mejorado', desc: 'Incremento de doble dígito en instrucciones por ciclo para un rendimiento superior en aplicaciones de un solo hilo.' },
            { icon: FireIcon, title: 'Heat Spreader Optimizado', desc: 'Diseño térmico vanguardista capaz de disipar hasta 170W de TDP continuo manteniendo la estabilidad del sistema.' }
        ],
        longDescription: 'El AMD Ryzen 9 7950X es la respuesta definitiva para creadores y profesionales. Con una frecuencia boost de hasta 5.7GHz, este silicio redefine lo que es posible en una plataforma de escritorio. Su arquitectura de 5nm de TSMC permite un densidad de transistores sin precedentes, asegurando que cada vatio se traduzca en puro rendimiento de cómputo.',
        inTheBox: ['Procesador Ryzen 9 7950X', 'Certificado de garantía', 'Protocolo de instalación AM5']
    },
    'Z790 HERO': {
        featureBlocks: [
            { icon: BoltIcon, title: 'VRM 20+1 Fases', desc: 'Suministro de energía masivo para overclocking extremo, con etapas de potencia de 90A y disipadores de calor de gran tamaño.' },
            { icon: SignalIcon, title: 'WiFi 6E y 2.5G LAN', desc: 'Conectividad de red de última generación para una latencia mínima en juegos y transferencias de datos ultrarrápidas.' },
            { icon: Square3Stack3DIcon, title: 'Soporte DDR5 7800+', desc: 'Optimización de trazado de memoria ASUS AEMP II para alcanzar velocidades extremas en los nuevos módulos de memoria DDR5.' }
        ],
        longDescription: 'La ASUS ROG Maximus Z790 Hero es una placa base que no conoce límites. Equipada con ranuras PCIe 5.0, Thunderbolt 4 y una tarjeta ROG Hyper M.2 incluida, es el pilar perfecto para un PC de exhibición. Su pantalla Polymo Lighting en la cubierta de E/S ofrece un espectáculo visual personalizable mientras monitoriza la telemetría del sistema.',
        inTheBox: ['Placa Base ROG MAXIMUS Z790 HERO', 'Tarjeta ROG Hyper M.2', 'Antena WiFi ASUS', '4 Cables SATA 6Gb/s', 'Pack de tornillos M.2']
    },
    '990 PRO': {
        featureBlocks: [
            { icon: SignalIcon, title: 'PCIe 4.0 al Límite', desc: 'Velocidades de hasta 7,450 MB/s que aprovechan casi el 100% del ancho de banda teórico de la interfaz Gen4.' },
            { icon: FireIcon, title: 'Thermal Guard Pro', desc: 'Control térmico inteligente que evita el estrangulamiento de rendimiento incluso en transferencias de archivos masivas.' },
            { icon: LightBulbIcon, title: 'Samsung Magician', desc: 'Software de gestión líder para optimizar el firmware, cifrar datos y monitorizar la salud de la unidad en tiempo real.' }
        ],
        longDescription: 'Alcanza el pináculo del almacenamiento con el Samsung 990 PRO. Diseñado para profesionales del vídeo y entusiastas del gaming, este SSD NVMe 2.0 reduce los tiempos de carga a fracciones de segundo. Su controlador de bajo consumo asegura que la unidad funcione fresca, mientras que la memoria V-NAND de 3 bits garantiza una durabilidad de hasta 1200TBW. Es la actualización definitiva tanto para estaciones de trabajo como para consolas de nueva generación como la PS5.',
        inTheBox: ['SSD Samsung 990 PRO NVMe', 'Guía de usuario avanzada', 'Certificado de garantía global']
    },
    'RM1000X': {
        featureBlocks: [
            { icon: BoltIcon, title: 'Certificación 80+ Gold', desc: 'Eficiencia energética superior que minimiza el calor y el ruido generado durante cargas de trabajo intensas.' },
            { icon: ShieldCheckIcon, title: 'Condensadores Japoneses', desc: 'Componentes internos de primera calidad de 105°C para una entrega de potencia ultra-estable y fiabilidad a largo plazo.' },
            { icon: FireIcon, title: 'Modo Zero RPM', desc: 'Ventilador de levitación magnética que permanece apagado durante cargas bajas y medias para un silencio absoluto.' }
        ],
        longDescription: 'La Corsair RM1000x ofrece una potencia silenciosa y fiable de 1000 vatios para alimentar los PCs más exigentes del mercado. Totalmente modular, permite conectar solo los cables necesarios para mantener un flujo de aire óptimo. Con soporte para los últimos estándares ATX, es la garantía de seguridad para tu hardware de alta gama.',
        inTheBox: ['Fuente Corsair RM1000x', 'Kit de cables modulares', 'Bolsa de almacenamiento de cables', 'Manual de instalación']
    },
    'NZXT H9': {
        featureBlocks: [
            { icon: ArrowsPointingOutIcon, title: 'Doble Cámara', desc: 'Diseño innovador que separa los componentes calientes de los cables y la PSU para una gestión térmica inigualable.' },
            { icon: CubeIcon, title: 'Vista Panorámica', desc: 'Paneles de cristal templado envolventes que ofrecen una visión 180° sin obstrucciones de todo tu hardware.' },
            { icon: FireIcon, title: 'Flujo de Aire Vertical', desc: 'Capacidad para múltiples ventiladores de 120mm/140mm en la base y lateral para una presión positiva perfecta.' }
        ],
        longDescription: 'La NZXT H9 Flow es la elección definitiva para aquellos que quieren que su hardware sea el protagonista. Con espacio para radiadores de hasta 360mm en tres ubicaciones diferentes, esta caja no solo es visualmente impactante, sino que está diseñada para optimizar el rendimiento térmico de las GPUs más grandes del mercado.',
        inTheBox: ['Chasis NZXT H9 Flow', 'Kit de accesorios y tornillería', 'Manual de montaje detallado']
    }
};

const CATEGORY_INSIGHTS = {
    'Procesadores': {
        featureBlocks: [
            { icon: FireIcon, title: 'LÓGICA PARALELA', desc: 'Arquitectura de múltiples núcleos para procesamiento masivo de datos.' },
            { icon: BeakerIcon, title: 'CACHÉ L3 EN SEGMENTO', desc: 'Acceso ultrarrápido a instrucciones críticas mediante memoria distribuida.' },
            { icon: InformationCircleIcon, title: 'GESTIÓN TÉRMICA', desc: 'Curva de frecuencia dinámica ajustada según el margen térmico operacional.' },
            { icon: FireIcon, title: 'PRECISION BOOST', desc: 'Aceleración automática de ciclos por segundo en tareas de un solo hilo.' }
        ],
        longDescription: 'Este procesador representa el núcleo de cómputo avanzado, diseñado para gestionar entornos de trabajo multitarea y gaming de alto rendimiento con una eficiencia energética superior.',
        inTheBox: ['Unidad Central de Procesamiento', 'Documentación de Instalación', 'Adhesivo de Arquitectura']
    },
    'Tarjetas Gráficas': {
        featureBlocks: [
            { icon: FireIcon, title: 'RAY TRACING NATIVO', desc: 'Cómputo de iluminación por hardware para realismo cinemático.' },
            { icon: InformationCircleIcon, title: 'IA SCALING', desc: 'Super-resolución mediante redes neuronales para máxima tasa de cuadros.' },
            { icon: BeakerIcon, title: 'MEMORIA VRAM', desc: 'Ancho de banda masivo para texturas de ultra-alta definición en 4K.' },
            { icon: FireIcon, title: 'SISTEMA AXIAL', desc: 'Disipación por flujo de aire optimizado para sesiones prolongadas.' }
        ],
        longDescription: 'Unidad de procesamiento gráfico de vanguardia, equipada con tensores dedicados para aceleración de IA y hardware específico para trazado de rayos en tiempo real.',
        inTheBox: ['GPU High-Performance', 'Guía de Configuración Rápida', 'Accesorios de Montaje']
    },
    'Placas Base': {
        featureBlocks: [
            { icon: BeakerIcon, title: 'FASES VRM', desc: 'Entrega de energía estable y filtrada para el procesador a plena carga.' },
            { icon: InformationCircleIcon, title: 'M.2 NVME READY', desc: 'Zócalos de almacenamiento de alta velocidad con disipación pasiva.' },
            { icon: FireIcon, title: 'PCIE GEN5/4', desc: 'Bus de comunicación de próxima generación para GPUs y SSDs.' },
            { icon: FireIcon, title: 'BIOS PRECISIÓN', desc: 'Entorno de configuración avanzado para optimización de hardware.' }
        ],
        longDescription: 'El ecosistema central de conectividad, diseñado con materiales de grado industrial y capas de PCB reforzadas para garantizar la integridad de la señal.',
        inTheBox: ['Motherboard Premium', 'Antenas (si aplica)', 'Cableado SATA', 'Manual de Esquemas']
    },
    'Memoria RAM': {
        featureBlocks: [
            { icon: FireIcon, title: 'BAJA LATENCIA', desc: 'Tiempos de respuesta minimizados para intercambio crítico de datos.' },
            { icon: InformationCircleIcon, title: 'DISIPADOR ALUM.', desc: 'Construcción en aluminio extrusionado para mantener temperaturas óptimas.' },
            { icon: BeakerIcon, title: 'XMP/EXPO READY', desc: 'Perfiles de overclocking certificados para configuración inmediata.' },
            { icon: FireIcon, title: 'DUAL CHANNEL', desc: 'Optimización de ancho de banda mediante acceso simultáneo a módulos.' }
        ],
        longDescription: 'Módulos de memoria de alta densidad, seleccionados mediante rigurosas pruebas de estrés para asegurar estabilidad absoluta en sistemas entusiastas.',
        inTheBox: ['Módulos de Memoria', 'Guía de Usuario']
    },
    'Almacenamiento': {
        featureBlocks: [
            { icon: FireIcon, title: 'LÓGICA NVME', desc: 'Protocolo de transferencia directa al bus PCIe para velocidades récord.' },
            { icon: InformationCircleIcon, title: 'DURABILIDAD TBW', desc: 'Celdas NAND de alta resistencia para años de escritura intensa.' },
            { icon: BeakerIcon, title: 'CONTROLLER PRO', desc: 'Controladora inteligente para gestión de desgaste y caché SLC.' },
            { icon: FireIcon, title: 'ACCESO RANDOM', desc: 'Milésimas de segundo en carga de aplicaciones y archivos pesados.' }
        ],
        longDescription: 'Solución de almacenamiento sólido de próxima generación, eliminando cuellos de botella y acelerando los tiempos de carga en todo el sistema.',
        inTheBox: ['Unidad SSD / HDD', 'Guía de Instalación']
    },
    'Fuente de Alimentación': {
        featureBlocks: [
            { icon: BeakerIcon, title: '80+ CERTIFICACIÓN', desc: 'Alta eficiencia energética que reduce el calor y el consumo eléctrico.' },
            { icon: InformationCircleIcon, title: 'CAPS JAPONESES', desc: 'Condensadores electrolíticos de alta gama para larga vida útil.' },
            { icon: FireIcon, title: 'RAIL ÚNICO +12V', desc: 'Entrega de potencia robusta y estable para GPUs de alto consumo.' },
            { icon: FireIcon, title: 'MODULARIDAD', desc: 'Gestión de cables limpia utilizando solo los conectores necesarios.' }
        ],
        longDescription: 'El corazón energético del sistema, fabricado bajo estrictos estándares de seguridad y regulación de voltaje para proteger tus componentes.',
        inTheBox: ['Fuente de Poder', 'Set de Cables Modulares', 'Cable AC', 'Tornillería']
    },
    'Caja/Torre': {
        featureBlocks: [
            { icon: InformationCircleIcon, title: 'FLUJO DE AIRE', desc: 'Diseño mallado o de presión positiva para refrigeración masiva.' },
            { icon: FireIcon, title: 'ESPACIO GPU', desc: 'Compartimento amplio compatible con las tarjetas de mayor formato.' },
            { icon: BeakerIcon, title: 'CABLE MGMNT', desc: 'Canales dedicados y puntos de anclaje para un montaje profesional.' },
            { icon: FireIcon, title: 'VIDRIO TEMPLADO', desc: 'Panel lateral de seguridad para exhibición de componentes internos.' }
        ],
        longDescription: 'Chasis de ingeniería avanzada que combina estética agresiva con una arquitectura interna optimizada para el montaje y la refrigeración.',
        inTheBox: ['Chasis Pro', 'Kit de Accesorios', 'Manual de Montaje']
    },
    'Refrigeración': {
        featureBlocks: [
            { icon: FireIcon, title: 'TDP DISIPACIÓN', desc: 'Capacidad de enfriamiento medida para procesadores de alto nivel.' },
            { icon: InformationCircleIcon, title: 'BOMBA / BASE', desc: 'Contacto directo de cobre para máxima transferencia de calor.' },
            { icon: BeakerIcon, title: 'VENTILACIÓN PMW', desc: 'Control de velocidad preciso según la carga de trabajo del sistema.' },
            { icon: FireIcon, title: 'SISTEMA SILENCE', desc: 'Rodamientos de baja fricción para operación acústicamente imperceptible.' }
        ],
        longDescription: 'Solución térmica crítica diseñada para mantener el rendimiento sostenido del procesador bajo cargas extremas sin ruidos molestos.',
        inTheBox: ['Bloque / Radiador', 'Ventiladores PWM', 'Kit de Montaje Multi-Socket', 'Pasta Térmica']
    }
}

const getProductInsight = (name, categoryName) => {
    // 1. Try a specific match first
    const specificInsight = Object.entries(PRODUCT_INSIGHTS).find(([key]) => 
        name.toUpperCase().includes(key)
    )?.[1];
    
    if (specificInsight) return specificInsight;
    
    // 2. Try simple category fallback
    return CATEGORY_INSIGHTS[categoryName] || {
        featureBlocks: [{ icon: ArchiveBoxIcon, title: 'Manifesto de Envío', desc: 'Componente verificado y listo para integración en sistema.' }],
        longDescription: 'Componente de hardware de alta calidad, validado por nuestros protocolos de control de calidad para asegurar compatibilidad y rendimiento.',
        inTheBox: ['Producto', 'Documentación', 'Kit de Instalación']
    };
};

export default function Show({ auth, producto }) {
    const [activeTab, setActiveTab] = useState('resumen');
    const insight = getProductInsight(producto.name, producto.category?.name);
    
    const formatSpecKey = (key) => {
        const dictionary = {
            socket: 'Socket / Zócalo',
            socket_support: 'Sockets Soportados',
            tdp: 'Consumo TDP',
            cores: 'Núcleos',
            threads: 'Hilos',
            frequency: 'Frecuencia Base',
            boost_freq: 'Frecuencia Turbo',
            form_factor: 'Factor de Forma',
            chipset: 'Chipset',
            ram_slots: 'Ranuras RAM',
            max_ram: 'Capacidad Máx. RAM',
            m2_slots: 'Ranuras M.2',
            type: 'Tipo',
            capacity: 'Capacidad',
            speed: 'Velocidad / Frecuencia',
            modules: 'Configuración Módulos',
            latency: 'Latencia (CL)',
            vram: 'Memoria VRAM',
            base_clock: 'Reloj Base',
            boost_clock: 'Reloj Turbo',
            clock_speed: 'Reloj de Núcleo',
            length: 'Longitud',
            width: 'Anchura',
            height: 'Altura',
            wattage: 'Potencia Proporcionada',
            efficiency: 'Certificación Energética',
            modular: 'Gestión de Cables',
            read_speed: 'Velocidad Lectura',
            write_speed: 'Velocidad Escritura',
            interface: 'Interfaz de Conexión',
            size: 'Tamaño / Formato',
            rpm: 'Velocidad Ventilador',
            noise_level: 'Nivel Sonoro',
            water_cooled: 'Refrigeración Líquida',
            radiator_size: 'Tamaño Radiador',
            side_panel: 'Panel Lateral',
            color: 'Color / Acabado',
            power_connectors: 'Conectores PCI-E',
            max_cooler_height: 'Altura Máx. Disipador',
            max_gpu_length: 'Longitud Máx. GPU',
            perf_score: 'Índice de Rendimiento'
        };
        return dictionary[key] || key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    const formatSpecValue = (key, val) => {
        if (val === null || val === undefined) return 'N/A';
        const lowerKey = key.toLowerCase();
        
        // Handle Boolean translations
        if (typeof val === 'boolean') return val ? 'Si' : 'No';
        if (val === 'true') return 'Si';
        if (val === 'false') return 'No';

        const unitMap = {
            vram: 'GB',
            capacity: 'GB',
            wattage: 'W',
            tdp: 'W',
            speed: isNaN(val) ? '' : (parseInt(val) > 2000 ? 'MB/s' : 'MHz'),
            read_speed: 'MB/s',
            write_speed: 'MB/s',
            frequency: 'GHz',
            boost_freq: 'GHz',
            clock_speed: 'MHz',
            boost_clock: 'MHz',
            base_clock: 'MHz',
            length: 'mm',
            height: 'mm',
            width: 'mm',
            max_gpu_length: 'mm',
            max_cooler_height: 'mm',
            radiator_size: 'mm',
            noise_level: 'dB',
            rpm: 'RPM',
            voltage: 'V'
        };

        const unit = unitMap[lowerKey] || '';
        return `${val}${unit ? ' ' + unit : ''}`;
    };

    const getHighlights = () => {
        if (!producto.specs) return [];
        const cat = producto.category?.slug;
        const specs = producto.specs;
        
        switch(cat) {
            case 'cpu': return [
                { label: 'Núcleos/Hilos', val: `${specs.cores || '8'}/${specs.threads || '16'}`, icon: 'M9 3V2m6 1v1m-6 18v1m6-1v1M3 9H2m1 6H2m18-6h1m-1 6h1' },
                { label: 'Turbo Freq', val: formatSpecValue('boost_freq', specs.boost_freq), icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
                { label: 'L3 Cache', val: specs.cache || '32MB', icon: 'M20 7l-8-4-8 4m16 0l-8 4' },
                { label: 'Socket', val: specs.socket || 'AM5', icon: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4' },
                { label: 'Arquitectura', val: specs.lithography || '5nm', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5' },
                { label: 'TDP Max', val: formatSpecValue('tdp', specs.tdp), icon: 'M13 10V3L4 14h7v7l9-11h-7z' }
            ];
            case 'gpu': return [
                { label: 'Cuda Cores', val: specs.cores || '16,384', icon: 'M9 3v2m6-2v2M9 19v2m6-2v2' },
                { label: 'VRAM Detalle', val: formatSpecValue('vram', specs.vram), icon: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7' },
                { label: 'Memoria Bus', val: specs.bus_width || '384-bit', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0' },
                { label: 'PCI Express', val: specs.pci_version || '4.0 x16', icon: 'M9 17l-5-5 5-5m6 0l5 5-5 5' },
                { label: 'Boost Clock', val: formatSpecValue('boost_clock', specs.boost_clock), icon: 'M13 10V3L4 14h7v7' },
                { label: 'Soporte 8K', val: 'Si', icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z' }
            ];
            case 'ram': return [
                { label: 'Latencia CL', val: specs.latency || 'CL30', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0' },
                { label: 'Velocidad', val: formatSpecValue('speed', specs.speed), icon: 'M13 10V3L4 14h7v7' },
                { label: 'Canal', val: specs.modules || 'Dual Channel', icon: 'M17 14v6m-3-3h6M6 10h2m4 0h2m4 0' },
                { label: 'Perfil XMP', val: 'V3.0', icon: 'M9 3v2m6-2v2M9 19v2m6-2v2' },
                { label: 'Iluminación', val: specs.rgb ? 'ARGB Gen2' : 'No RGB', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.638.638a2 2 0 01-1.414.586h-1.414a2 2 0 01-1.414-.586l-.638-.638z' },
                { label: 'Voltaje', val: formatSpecValue('voltage', specs.voltage), icon: 'M13 10V3L4 14' }
            ];
            default: return [
                { label: 'Validación', val: 'Pass_QC', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
                { label: 'Protocolo', val: 'Industrial', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
                { label: 'Categoría', val: producto.category?.name, icon: 'M4 6h16M4 10h16' }
            ];
        }
    };

    const groupSpecsByCategory = () => {
        if (!producto.specs) return [];
        const specs = producto.specs;
        const groupMapping = [
            { name: 'Rendimiento y Núcleos', icon: CpuChipIcon, keys: ['cores', 'threads', 'frequency', 'boost_freq', 'clock_speed', 'boost_clock', 'base_clock', 'perf_score', 'speed', 'cache', 'lithography'] },
            { name: 'Memoria y Almacenamiento', icon: Square3Stack3DIcon, keys: ['vram', 'capacity', 'latency', 'interface', 'read_speed', 'write_speed', 'max_ram', 'memory_type', 'bandwidth', 'bus_width'] },
            { name: 'Energía y Térmicas', icon: BoltIcon, keys: ['tdp', 'wattage', 'radiator_size', 'noise_level', 'rpm', 'voltage', 'power_connector', 'max_temp', 'cooling_type'] },
            { name: 'Arquitectura y Vídeo', icon: BeakerIcon, keys: ['socket', 'chipset', 'form_factor', 'pci_version', 'hdmi', 'displayport', 'multi_gpu', 'max_resolution', 'directx', 'opengl', 'vulkan'] },
            { name: 'Dimensiones y Físico', icon: ArrowsPointingOutIcon, keys: ['length', 'height', 'width', 'weight', 'color', 'max_gpu_length', 'max_cooler_height', 'slots'] }
        ];

        const result = [];
        groupMapping.forEach(group => {
            const groupContent = {};
            group.keys.forEach(key => {
                if (specs[key]) groupContent[key] = specs[key];
            });
            if (Object.keys(groupContent).length > 0) result.push({ ...group, content: groupContent });
        });

        const categorizedKeys = groupMapping.map(g => g.keys).flat();
        const otherSpecs = {};
        Object.entries(specs).forEach(([key, value]) => {
            if (!categorizedKeys.includes(key)) otherSpecs[key] = value;
        });
        if (Object.keys(otherSpecs).length > 0) result.push({ name: 'Otras Especificaciones', icon: CubeIcon, content: otherSpecs });

        return result;
    };

    const getEnrichedDescription = () => {
        const desc = producto.description || "Componente de hardware certificado por ZendPC.";
        const name = producto.name.toLowerCase();
        let technicalNote = "";

        if (name.includes('rtx 40')) technicalNote = "Basada en la revolucionaria arquitectura NVIDIA Ada Lovelace, esta unidad incluye núcleos Tensor de 4.ª generación y núcleos RT de 3.ª generación para un rendimiento extremo con DLSS 3.";
        else if (name.includes('ryzen 7600')) technicalNote = "Potenciado por la arquitectura AMD Zen 4 y el nuevo socket AM5, diseñado para ofrecer una eficiencia energética y velocidad de reloj líderes en su clase.";
        else if (name.includes('ddr5')) technicalNote = "Memoria de nueva generación con circuitos integrados de gestión de energía (PMIC) y perfiles EXPO/XMP 3.0 para un overclocking estable.";
        else if (name.includes('sn850')) technicalNote = "Almacenamiento NVMe Gen4 de ultra velocidad con tecnología nCache 4.0 para transferencias instantáneas de archivos masivos.";
        
        return technicalNote ? `${desc} ${technicalNote}` : desc;
    };

    const highlights = getHighlights();
    const perfScore = producto.specs?.perf_score || 0;
    const groupedSpecs = groupSpecsByCategory();
    const description = getEnrichedDescription();

    return (
        <AuthenticatedLayout
            header={
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 uppercase italic">
                    <div className="flex items-center gap-4 text-[10px] font-black tracking-[0.3em] text-slate-500 leading-none">
                        <Link href={route('catalog.index')} className="hover:text-emerald-400 transition-colors">Hardware</Link>
                        <ChevronRightIcon className="w-3 h-3 text-slate-600" />
                        <span className="text-white">{producto.category?.name || 'Recursos'}</span>
                    </div>
                    <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/[0.03] border border-white/10 shadow-inner">
                        <ShieldCheckIcon className="w-3.5 h-3.5 text-emerald-500 drop-shadow-[0_0_8px_rgba(52, 211, 153,0.8)]" />
                        <span className="text-[9px] font-black text-emerald-400 tracking-widest lowercase">protocolo de verificación industrial activo</span>
                    </div>
                </div>
            }
        >
            <Head title={producto.name + " - ZendPC"} />
            
            <div className="py-8 lg:py-16 relative z-10">
                <div className="max-w-[1400px] mx-auto px-6 relative z-10">

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                        
                        {/* Visual Asset Block */}
                        <div className="lg:col-span-12 xl:col-span-6">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="glass-card-premium rounded-[3rem] p-4 lg:p-6 flex flex-col items-center justify-center min-h-[500px] lg:min-h-[600px] relative overflow-hidden border border-white/5 shadow-[inset_0_0_100px_rgba(255,255,255,0.02)]"
                            >
                                {/* Mesh Gradient Accent */}
                                <div className="absolute -top-24 -left-24 w-64 h-64 bg-emerald-600/20 blur-[100px] rounded-full pointer-events-none"></div>
                                <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-emerald-600/10 blur-[100px] rounded-full pointer-events-none"></div>

                                {producto.image ? (
                                    <div className="relative group/stage w-full flex items-center justify-center p-6">
                                        {/* Hardware Stage - Scaled up to fill space better */}
                                        <motion.div 
                                            whileHover={{ scale: 1.02 }}
                                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                            className="relative w-full aspect-square max-w-[520px] flex items-center justify-center bg-white rounded-[2.5rem] p-10 shadow-[0_40px_100px_rgba(0,0,0,0.5)] transition-all duration-700"
                                        >
                                            <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-slate-100 to-transparent rounded-b-[2.5rem]"></div>
                                            <img 
                                                src={producto.image} 
                                                alt={producto.name} 
                                                className="relative z-10 max-w-full max-h-full object-contain transition-transform duration-700 group-hover/stage:scale-110 drop-shadow-[0_15px_30px_rgba(0,0,0,0.1)]" 
                                            />
                                        </motion.div>
                                        {/* Dynamic Halo behind stage */}
                                        <div className="absolute inset-0 bg-white/5 blur-[120px] rounded-full opacity-0 group-hover/stage:opacity-100 transition-opacity duration-1000 -z-10"></div>
                                    </div>
                                ) : (
                                    <div className="text-slate-500 font-black uppercase tracking-[0.4em] text-xs italic">Señal Perdida</div>
                                )}
                            </motion.div>
                        </div>

                        {/* Data Analytics Block */}
                        <div className="lg:col-span-12 xl:col-span-6 flex flex-col">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="glass-card-premium rounded-[3rem] p-10 lg:p-14 border border-white/5 relative flex-grow flex flex-col"
                            >
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="px-5 py-2 rounded-full bg-white/[0.05] border border-white/10 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                        <span className="text-[9px] font-black text-white uppercase tracking-widest">{producto.category?.name || 'Recurso'}</span>
                                    </div>
                                    {perfScore > 0 && (
                                        <div className="px-5 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                            <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Máximo Rendimiento</span>
                                        </div>
                                    )}
                                </div>

                                <h1 className="text-3xl lg:text-4xl xl:text-5xl font-black text-white italic tracking-tighter leading-[0.95] mb-8 uppercase drop-shadow-2xl">
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/40">{producto.name}</span>
                                </h1>

                                <div className="flex flex-wrap items-center gap-10 mb-10">
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Valor de Mercado</span>
                                        <div className="text-4xl lg:text-5xl font-black text-white italic tracking-tighter flex items-start gap-1">
                                            {Number(producto.price).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            <span className="text-emerald-500 text-xl uppercase mt-1">€</span>
                                        </div>
                                    </div>
                                    <div className="flex-grow"></div>
                                    <div className="flex items-center gap-4 px-6 py-3 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 h-fit self-end mb-1">
                                         <div className="relative">
                                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                                            <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></div>
                                         </div>
                                         <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] italic">Stock Disponible</span>
                                    </div>
                                </div>

                                {/* Tabs Navigation - Compact & Optimized */}
                                <div className="relative flex items-center justify-between gap-px p-1 bg-black/50 backdrop-blur-md rounded-2xl border border-white/5 mb-8 overflow-x-auto no-scrollbar">
                                    {[
                                        { id: 'resumen', label: 'Resumen', icon: InformationCircleIcon },
                                        { id: 'caracteristicas', label: 'Características', icon: FireIcon },
                                        { id: 'especificaciones', label: 'Especificaciones', icon: BeakerIcon },
                                        { id: 'caja', label: 'Contenido', icon: ArchiveBoxIcon }
                                    ].map(tab => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className="relative flex-1 flex items-center justify-center gap-2 px-3 py-3 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all whitespace-nowrap group"
                                        >
                                            {activeTab === tab.id && (
                                                <motion.div 
                                                    layoutId="active-pill"
                                                    className="absolute inset-0 bg-emerald-600 rounded-xl shadow-[0_0_20px_rgba(16, 185, 129,0.4)]"
                                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                                />
                                            )}
                                            <tab.icon className={`relative z-10 w-3 h-3 ${activeTab === tab.id ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`} />
                                            <span className={`relative z-10 ${activeTab === tab.id ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`}>{tab.label}</span>
                                        </button>
                                    ))}
                                </div>

                                {/* Tab Content Wrapper */}
                                <div className="flex-grow">
                                    {activeTab === 'resumen' && (
                                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                                {highlights.map((h, i) => (
                                                    <div key={i} className="relative bg-white/[0.02] border border-white/5 rounded-xl p-4 group hover:bg-white/[0.04] transition-all overflow-hidden">
                                                        <div className="absolute inset-0 dot-grid-pattern-slate opacity-10"></div>
                                                        <div className="relative z-10">
                                                            <span className="block text-[7px] font-black text-slate-600 uppercase tracking-widest mb-1">{h.label}</span>
                                                            <span className="text-white font-black italic uppercase tracking-tight text-sm leading-none truncate block">{h.val}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {perfScore > 0 && (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {[
                                                        { label: 'RENDIMIENTO_JUEGOS', val: perfScore, color: 'bg-emerald-500' },
                                                        { label: 'PRODUCTIVIDAD', val: Math.max(1, perfScore - 5), color: 'bg-emerald-500' }
                                                    ].map((hud, idx) => (
                                                        <div key={idx} className="bg-black/30 border border-white/5 rounded-xl p-4 relative overflow-hidden group">
                                                            <div className="flex justify-between items-center mb-2">
                                                                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest italic">{hud.label}</span>
                                                                <span className={`text-base font-black italic ${idx === 0 ? 'text-emerald-400' : 'text-emerald-400'}`}>{hud.val}%</span>
                                                            </div>
                                                            <div className="flex gap-0.5 h-1.5">
                                                                {Array.from({ length: 20 }).map((_, i) => (
                                                                    <div 
                                                                        key={i} 
                                                                        className={`flex-1 h-full rounded-sm transition-all duration-1000 ${i < (hud.val / 5) ? hud.color : 'bg-white/5'}`} 
                                                                        style={{ transitionDelay: `${i * 30}ms` }}
                                                                    />
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            <p className="text-slate-400 text-[11px] lg:text-xs leading-[1.6] font-medium italic border-l-2 border-emerald-500/50 pl-6 py-1">
                                                {description}
                                            </p>
                                        </motion.div>
                                    )}

                                    {activeTab === 'caracteristicas' && (
                                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                                            {insight ? (
                                                <div className="space-y-6">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                        {insight.featureBlocks.map((block, i) => (
                                                            <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all group relative overflow-hidden">
                                                                <div className="absolute inset-0 dot-grid-pattern-slate opacity-10"></div>
                                                                <div className="relative z-10 flex items-center gap-4 w-full">
                                                                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 group-hover:scale-110 transition-transform">
                                                                        <block.icon className="w-5 h-5 text-emerald-500" />
                                                                    </div>
                                                                    <div className="min-w-0">
                                                                        <h4 className="text-white font-black uppercase text-[10px] tracking-widest mb-1 italic truncate">{block.title}</h4>
                                                                        <p className="text-slate-500 text-[9px] leading-tight truncate">{block.desc}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="bg-emerald-500/5 p-6 rounded-2xl border border-emerald-500/10">
                                                        <p className="text-slate-300 text-[11px] leading-[1.8] text-justify italic font-medium">
                                                            {insight.longDescription}
                                                        </p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="p-12 rounded-[2rem] bg-emerald-500/5 border border-emerald-500/10 text-center relative overflow-hidden">
                                                    <div className="absolute inset-0 dot-grid-pattern-slate"></div>
                                                    <InformationCircleIcon className="w-10 h-10 text-emerald-500/30 mx-auto mb-4" />
                                                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] italic">Arquitectura no registrada.</p>
                                                </div>
                                            )}
                                        </motion.div>
                                    )}

                                    {activeTab === 'especificaciones' && (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {groupedSpecs.map((group, idx) => (
                                                    <div key={idx} className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 relative overflow-hidden group">
                                                        <div className="absolute inset-0 dot-grid-pattern-slate opacity-10"></div>
                                                        <div className="relative z-10">
                                                            <div className="flex items-center gap-3 mb-4 border-b border-white/5 pb-3">
                                                                <group.icon className="w-4 h-4 text-emerald-500" />
                                                                <h5 className="text-[9px] font-black text-white uppercase tracking-widest italic">{group.name}</h5>
                                                            </div>
                                                            <div className="space-y-2">
                                                                {Object.entries(group.content).slice(0, 4).map(([key, value]) => (
                                                                    <div key={key} className="flex justify-between items-center group/row">
                                                                        <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest truncate mr-2">{formatSpecKey(key)}</span>
                                                                        <span className="text-[10px] font-bold text-slate-300 italic whitespace-nowrap">{formatSpecValue(key, value)}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                    {activeTab === 'caja' && (
                                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                                            <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 relative overflow-hidden group">
                                                <div className="absolute inset-0 dot-grid-pattern-slate opacity-10"></div>
                                                <ArchiveBoxIcon className="absolute -right-8 -bottom-8 w-48 h-48 text-white/[0.02] -rotate-12" />
                                                <h4 className="text-white font-black uppercase text-[9px] tracking-[0.4em] mb-8 flex items-center gap-4 pb-4 border-b border-white/5">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(52, 211, 153,0.5)]"></div>
                                                    Manifiesto de Contenido
                                                </h4>
                                                <ul className="space-y-4 relative z-10">
                                                    {(insight?.inTheBox || ['Unidad Principal', 'Documentación', 'Garantía']).map((item, i) => (
                                                        <li key={i} className="flex items-center gap-4 group/item">
                                                            <div className="w-4 h-[1px] bg-emerald-500/30 group-hover/item:w-6 transition-all"></div>
                                                            <span className="text-[11px] font-black text-slate-500 italic tracking-wide group-hover/item:text-slate-300 transition-colors">{item}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>

                                <div className="pt-8 border-t border-white/10 mt-8 flex flex-col gap-3">
                                    <button 
                                        onClick={(e) => {
                                            e.preventDefault();
                                            router.post(route('cart.add'), { product_id: producto.id }, { 
                                                preserveScroll: true, 
                                                preserveState: true,
                                                only: ['cart']
                                            });
                                        }}
                                        className="group relative w-full flex items-center justify-center px-10 py-5 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] overflow-hidden transition-all hover:bg-emerald-500 hover:-translate-y-1 active:translate-y-0 text-xs italic shadow-[0_15px_40px_rgba(16, 185, 129,0.25)]"
                                    >
                                        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[1200ms] ease-in-out"></div>
                                        <span className="relative z-10 flex items-center gap-3">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                            Añadir a la Cesta
                                        </span>
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Industrial Disclaimer - Always visible as footer */}
                    <div className="mt-32 p-12 bg-white/[0.01] border border-white/10 border-dashed rounded-[3rem] max-w-4xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-5 grayscale group-hover:grayscale-0 transition-all duration-700">
                            <div className="text-4xl font-black italic">ZND_QC</div>
                        </div>
                        <div className="flex items-center gap-4 mb-6">
                            <ShieldCheckIcon className="w-6 h-6 text-emerald-500" />
                            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] italic">cláusula de integridad térmica y estructural</span>
                        </div>
                        <p className="text-[10px] uppercase font-black text-slate-600 tracking-widest leading-[2.2] text-justify max-w-2xl">
                            La información presentada en este manifiesto ha sido extraída mediante protocolos de detección directa y validada por el equipo de ingeniería de ZendPC. Cada componente es verificado contra bases de datos globales para asegurar que cumple con el estándar de rendimiento industrial exigido. Las arquitecturas citadas reflejan el diseño del núcleo del hardware original. La telemetría puede variar ±2% según condiciones ambientales.
                        </p>
                    </div>

                </div>
            </div>
            
            {/* Background HUD Decor */}
            <div className="fixed bottom-0 left-0 w-full h-[500px] bg-gradient-to-t from-emerald-900/10 to-transparent pointer-events-none -z-10"></div>
            <div className="fixed top-0 right-0 p-12 opacity-[0.02] pointer-events-none -z-10">
                <div className="text-[200px] font-black italic tracking-tighter leading-none">ZND</div>
            </div>
        </AuthenticatedLayout>
    );
}
