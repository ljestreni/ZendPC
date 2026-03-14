<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Presupuesto PC - {{ $configuracion->name }}</title>
    <style>
        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            color: #333;
            margin: 0;
            padding: 20px;
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #2563eb;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .header h1 {
            color: #1e3a8a;
            margin: 0;
        }
        .info {
            margin-bottom: 30px;
        }
        .info table {
            width: 100%;
        }
        .info td {
            padding: 5px 0;
        }
        .components-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }
        .components-table th, .components-table td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
        }
        .components-table th {
            background-color: #f3f4f6;
            color: #1f2937;
        }
        .total-row td {
            font-weight: bold;
            font-size: 1.2em;
            background-color: #e5e7eb;
        }
        .footer {
            margin-top: 50px;
            text-align: center;
            font-size: 0.9em;
            color: #6b7280;
        }
    </style>
</head>
<body>

    <div class="header">
        <h1>ZendPC</h1>
        <p>Expertos en configuraciones a medida</p>
    </div>

    <div class="info">
        <table>
            <tr>
                <td><strong>Nombre de Proyecto:</strong> {{ $configuracion->name }}</td>
                <td style="text-align: right;"><strong>Fecha:</strong> {{ $configuracion->created_at->format('d/m/Y') }}</td>
            </tr>
            <tr>
                <td><strong>Cliente:</strong> {{ $usuario->name }}</td>
                <td style="text-align: right;"><strong>Ref:</strong> #{{ str_pad($configuracion->id, 5, '0', STR_PAD_LEFT) }}</td>
            </tr>
        </table>
    </div>

    <table class="components-table">
        <thead>
            <tr>
                <th>Categoría</th>
                <th>Componente</th>
                <th style="text-align: right;">Precio</th>
            </tr>
        </thead>
        <tbody>
            @if(is_array($componentes) && count($componentes) > 0)
                @foreach($componentes as $category => $product)
                    @if($product)
                        <tr>
                            <td>{{ ucfirst($category) }}</td>
                            <td>{{ $product['name'] ?? 'N/A' }}</td>
                            <td style="text-align: right;">{{ number_format($product['price'] ?? 0, 2) }} €</td>
                        </tr>
                    @endif
                @endforeach
            @else
                <tr>
                    <td colspan="3" style="text-align: center;">No se han seleccionado componentes.</td>
                </tr>
            @endif
        </tbody>
        <tfoot>
            <tr class="total-row">
                <td colspan="2" style="text-align: right;">TOTAL ESTIMADO</td>
                <td style="text-align: right;">{{ number_format($configuracion->total_price, 2) }} €</td>
            </tr>
        </tfoot>
    </table>

    <div class="footer">
        <p>Este documento es un resumen de la configuración guardada por el usuario y no constituye una factura legal.</p>
        <p><strong>ZendPC</strong> - Todos los derechos reservados.</p>
    </div>

</body>
</html>
