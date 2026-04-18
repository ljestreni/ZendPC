<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Manifiesto - {{ $configuracion->name }}</title>
    <style>
        @page { 
            margin: 0px; 
        }
        body {
            font-family: 'Helvetica', sans-serif;
            color: #f1f5f9;
            margin: 0;
            padding: 0;
            background-color: #080a11;
            line-height: 1.15;
            -webkit-font-smoothing: antialiased;
        }
        
        /* Layout Structure */
        .page-accent { position: absolute; left: 0; top: 0; height: 100%; width: 5px; background-color: #10b981; }
        .container { padding: 35px 45px; position: relative; }
        
        /* Header HUD */
        .header { display: table; width: 100%; border-bottom: 1px solid rgba(16, 185, 129, 0.4); padding-bottom: 12px; margin-bottom: 20px; }
        .header-left { display: table-cell; vertical-align: middle; width: 60%; }
        .header-right { display: table-cell; text-align: right; vertical-align: middle; width: 40%; }
        
        .logo-img { height: 38px; }
        .tech-manifest { font-size: 7.5px; text-transform: uppercase; letter-spacing: 4px; color: #475569; font-weight: bold; margin-top: 4px; }
        
        .status-header { font-size: 10px; color: #10b981; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; }
        .ref-id { font-size: 8px; color: #334155; font-family: 'Courier', monospace; }
        
        /* Info Cards */
        .stats-table { width: 100%; margin-bottom: 20px; border-spacing: 6px 0; margin-left: -6px; }
        .stat-card { background-color: #0f172a; border: 1px solid rgba(255,255,255,0.05); border-radius: 10px; padding: 10px; }
        .stat-label { font-size: 7.5px; text-transform: uppercase; color: #475569; font-weight: bold; margin-bottom: 1px; letter-spacing: 1px; }
        .stat-value { font-size: 11px; color: #fff; font-weight: bold; letter-spacing: -0.3px; }
        
        /* Components */
        .section-title { font-size: 9px; text-transform: uppercase; color: #10b981; font-weight: bold; margin-bottom: 10px; letter-spacing: 1.5px; border-left: 3px solid #10b981; padding-left: 8px; }
        
        .comp-row { 
            display: table; width: 100%; margin-bottom: 8px; 
            background-color: #0f172a; border-radius: 12px; 
            border: 1px solid rgba(255,255,255,0.05); 
            page-break-inside: avoid;
        }
        .comp-img { display: table-cell; vertical-align: middle; width: 70px; padding: 12px; text-align: center; }
        .comp-details { display: table-cell; vertical-align: middle; padding: 12px 5px; }
        .comp-price { display: table-cell; vertical-align: middle; width: 90px; padding: 12px; text-align: right; border-left: 1px solid rgba(255,255,255,0.05); }
        
        .comp-cat { font-size: 7.5px; text-transform: uppercase; color: #10b981; font-weight: bold; margin-bottom: 1px; letter-spacing: 0.5px; }
        .comp-name { font-size: 11.5px; color: #fff; font-weight: bold; margin-bottom: 3px; letter-spacing: -0.2px; }
        .comp-specs { font-size: 8px; color: #64748b; line-height: 1.1; }
        .price-val { font-size: 13px; color: #fff; font-weight: bold; }
        
        /* Total Block */
        .total-wrapper { margin-top: 12px; page-break-inside: avoid; }
        .total-block { 
            background-color: #064e3b; border: 1px solid #10b981; border-radius: 14px; 
            padding: 15px 25px; display: table; width: 100%; box-sizing: border-box; 
        }
        .total-info { display: table-cell; vertical-align: middle; }
        .total-val { display: table-cell; vertical-align: middle; text-align: right; font-size: 24px; font-weight: bold; color: #fff; letter-spacing: -1px; }
        
        .total-label { font-size: 9px; text-transform: uppercase; color: #a7f3d0; font-weight: bold; letter-spacing: 1px; }
        .total-sub { font-size: 7px; color: #10b981; margin-top: 2px; color: #34d399; }
        
        /* Decoration and Typography */
        .product-preview { max-width: 55px; max-height: 50px; object-fit: contain; }
        
        .footer { 
            margin-top: 15px;
            text-align: center; font-size: 8px; color: #334155; 
            border-top: 1px solid rgba(255,255,255,0.05); padding-top: 12px;
            padding-bottom: 8px;
        }
    </style>
</head>
<body>
    @php
        $logoPath = public_path('logo.png');
        $logoSrc = file_exists($logoPath) ? 'data:image/png;base64,' . base64_encode(file_get_contents($logoPath)) : null;

        $getImgBase64 = function($path) {
            if (!$path) return null;
            $cleanPath = ltrim($path, '/');
            $fullPath = public_path($cleanPath);
            if (file_exists($fullPath)) {
                $ext = pathinfo($fullPath, PATHINFO_EXTENSION);
                return 'data:image/' . ($ext == 'jpg' ? 'jpeg' : $ext) . ';base64,' . base64_encode(file_get_contents($fullPath));
            }
            return null;
        };

        $translations = [
            'socket' => 'Zócalo',
            'tdp' => 'Consumo (TDP)',
            'cores' => 'Núcleos',
            'threads' => 'Hilos',
            'architecture' => 'Arquitectura',
            'form_factor' => 'Factor de Forma',
            'memory_type' => 'Tipo de Memoria',
            'chipset' => 'Chipset',
            'vram' => 'Memoria VRAM',
            'wattage' => 'Potencia',
            'efficiency' => 'Eficiencia',
            'modular' => 'Modular',
            'capacity' => 'Capacidad',
            'interface' => 'Interfaz',
            'speed' => 'Velocidad',
            'latency' => 'Latencia',
            'radiator_size' => 'Tamaño Radiador',
            'socket_support' => 'Sockets Compatibles',
            'max_gpu_length' => 'Largo Máx. GPU',
            'max_cooler_height' => 'Altura Máx. CPU',
            'color' => 'Color',
            'series' => 'Gama',
            'integrated_graphics' => 'Vídeo Integrado'
        ];
    @endphp

    <div class="page-accent"></div>
    
    <div class="container">
        <!-- Header -->
        <div class="header">
            <div class="header-left">
                @if($logoSrc)
                    <img src="{{ $logoSrc }}" class="logo-img">
                @else
                    <h1 style="margin: 0; color: #fff; font-size: 24px;">ZEND<span style="color: #10b981">PC</span></h1>
                @endif
                <div class="tech-manifest">Technical Build Manifest</div>
            </div>
            <div class="header-right">
                <div class="status-header">Manifiesto Preparado</div>
                <div class="ref-id">ID_SYS: #ZPC-{{ str_pad($configuracion->id, 6, '0', STR_PAD_LEFT) }}</div>
            </div>
        </div>

        <!-- Meta -->
        <table class="stats-table">
            <tr>
                <td style="width: 33%;">
                    <div class="stat-card">
                        <div class="stat-label">Proyecto</div>
                        <div class="stat-value">{{ strtoupper($configuracion->name) }}</div>
                    </div>
                </td>
                <td style="width: 33%;">
                    <div class="stat-card">
                        <div class="stat-label">Operador (Cliente)</div>
                        <div class="stat-value">{{ strtoupper($usuario->name) }}</div>
                    </div>
                </td>
                <td style="width: 33%;">
                    <div class="stat-card">
                        <div class="stat-label">Compilación</div>
                        <div class="stat-value">{{ $configuracion->created_at->format('d / m / Y') }}</div>
                    </div>
                </td>
            </tr>
        </table>

        <div class="section-title">Análisis de Hardware</div>

        <!-- Components -->
        @foreach($componentes as $item)
            @php $img64 = $getImgBase64($item['image']); @endphp
            <div class="comp-row">
                <div class="comp-img">
                    <div style="background-color: #fff; width: 60px; height: 60px; border-radius: 8px; padding: 5px; display: inline-block; vertical-align: middle;">
                        @if($img64)
                            <img src="{{ $img64 }}" class="product-preview" style="max-width: 100%; max-height: 100%; object-fit: contain;">
                        @else
                            <div style="font-size: 7px; color: #475569; padding-top: 20px;">NO_IMG</div>
                        @endif
                    </div>
                </div>
                <div class="comp-details">
                    <div class="comp-cat">{{ $item['categoria'] }}</div>
                    <div class="comp-name">{{ $item['nombre'] }}</div>
                    <div class="comp-specs">
                        @if(!empty($item['specs']))
                            @foreach($item['specs'] as $key => $val)
                                <span style="color: #10b981;">{{ strtoupper($translations[$key] ?? $key) }}:</span> {{ is_array($val) ? implode(', ', $val) : $val }} &nbsp;
                            @endforeach
                        @else
                            <span style="color: #475569;">TECNOLOGÍA ESTÁNDAR VERIFICADA</span>
                        @endif
                    </div>
                </div>
                <div class="comp-price">
                    <div class="price-val">{{ number_format($item['precio'], 2, ',', '.') }} €</div>
                </div>
            </div>
        @endforeach

        <!-- Total -->
        <div class="total-wrapper">
            <div class="total-block">
                <div class="total-info">
                    <div class="total-label">Inversión Total de Montaje</div>
                    <div class="total-sub">Valoración comercial oficial (IVA incluido)</div>
                </div>
                <div class="total-val">
                    {{ number_format($configuracion->total_price, 2, ',', '.') }} €
                </div>
            </div>
        </div>

        <div class="footer">
            <strong>ZENDPC CORPORATION</strong> &bull; Industrial Engineering Unit &bull; www.zendpc.com &bull;
            <span style="color: rgba(16,185,129,0.5); text-transform: uppercase; letter-spacing: 1px;">Approved Build v1.0</span><br>
            Este documento representa una previsión de recursos técnicos y costes verificada por el núcleo ZendBuilder.
        </div>
    </div>
</body>
</html>
