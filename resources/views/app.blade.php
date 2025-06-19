<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>{{ config('app.name', 'Laravel') }} - Libro de Reclamaciones</title>
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <!-- Bootstrap 5 CSS -->
        {{-- <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet"> --}}
        <!-- Bootstrap Icons -->
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.2/font/bootstrap-icons.css">
        <!-- Google Fonts -->
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">

        <!-- Pasar datos de sucursales a JavaScript -->
        <script>
            window.sucursalesData = @json($sucursales);
        </script>

        <style>
            :root {
                --primary-color: #2563eb;
                --primary-dark: #1d4ed8;
                --secondary-color: #64748b;
                --success-color: #22c55e;
                --warning-color: #f59e0b;
                --danger-color: #ef4444;
                --light-bg: #f8fafc;
                --card-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                --card-shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
            }

            body {
                font-family: 'Inter', sans-serif;
                background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
                min-height: 100vh;
            }

            /* Header personalizado */
            .custom-header {
                background: linear-gradient(135deg, var(--primary-color) 0%, #4f46e5 100%);
                border-bottom: 4px solid var(--primary-dark);
                box-shadow: var(--card-shadow-lg);
            }

            .logo-container {
                background: linear-gradient(135deg, var(--primary-color) 0%, #4f46e5 100%);
                border-radius: 12px;
                padding: 1rem 1.5rem;
                box-shadow: var(--card-shadow);
            }

            /* Cards personalizadas */
            .custom-card {
                border: none;
                border-radius: 16px;
                box-shadow: var(--card-shadow-lg);
                transition: all 0.3s ease;
                background: white;
            }

            .custom-card:hover {
                transform: translateY(-2px);
                box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            }

            .custom-card-header {
                background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
                border-bottom: 1px solid #e2e8f0;
                border-radius: 16px 16px 0 0 !important;
                padding: 1.5rem;
            }

            /* Botones personalizados */
            .btn-custom-primary {
                background: linear-gradient(135deg, var(--primary-color) 0%, #4f46e5 100%);
                border: none;
                border-radius: 50px;
                padding: 0.75rem 2rem;
                font-weight: 600;
                transition: all 0.3s ease;
                box-shadow: var(--card-shadow);
            }

            .btn-custom-primary:hover {
                background: linear-gradient(135deg, var(--primary-dark) 0%, #4338ca 100%);
                transform: translateY(-1px);
                box-shadow: var(--card-shadow-lg);
            }

            .btn-outline-custom {
                border: 2px solid var(--primary-color);
                color: var(--primary-color);
                border-radius: 50px;
                padding: 0.5rem 1.5rem;
                font-weight: 500;
                transition: all 0.3s ease;
            }

            .btn-outline-custom:hover {
                background: var(--primary-color);
                color: white;
                transform: translateY(-1px);
            }

            /* Formularios */
            .form-control, .form-select {
                border-radius: 12px;
                border: 2px solid #e2e8f0;
                padding: 0.75rem 1rem;
                transition: all 0.3s ease;
            }

            .form-control:focus, .form-select:focus {
                border-color: var(--primary-color);
                box-shadow: 0 0 0 0.2rem rgba(37, 99, 235, 0.25);
            }

            .form-label {
                font-weight: 600;
                color: #374151;
                margin-bottom: 0.5rem;
            }

            /* Badges personalizados */
            .badge-custom-pending {
                background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
                color: #92400e;
                border: 1px solid #f59e0b;
            }

            .badge-custom-process {
                background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
                color: #1e40af;
                border: 1px solid #3b82f6;
            }

            .badge-custom-resolved {
                background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
                color: #166534;
                border: 1px solid #22c55e;
            }

            /* Estadísticas */
            .stats-card {
                border-radius: 16px;
                padding: 1.5rem;
                text-align: center;
                border: 1px solid #e2e8f0;
                transition: all 0.3s ease;
            }

            .stats-card:hover {
                transform: translateY(-2px);
                box-shadow: var(--card-shadow);
            }

            .stats-number {
                font-size: 2.5rem;
                font-weight: 700;
                line-height: 1;
                margin-bottom: 0.5rem;
            }

            .stats-label {
                font-size: 0.875rem;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.05em;
            }

            /* Iconos */
            .icon-circle {
                width: 3rem;
                height: 3rem;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.25rem;
            }

            .icon-circle-primary {
                background: linear-gradient(135deg, var(--primary-color) 0%, #4f46e5 100%);
                color: white;
            }

            .icon-circle-secondary {
                background: linear-gradient(135deg, #64748b 0%, #475569 100%);
                color: white;
            }

            /* Animaciones */
            .fade-in {
                animation: fadeIn 0.5s ease-in;
            }

            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }

            .pulse {
                animation: pulse 2s infinite;
            }

            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
            }

            /* Progress bar personalizada */
            .progress-custom {
                height: 12px;
                border-radius: 6px;
                background: #e2e8f0;
            }

            .progress-bar-custom {
                background: linear-gradient(90deg, var(--primary-color) 0%, #4f46e5 100%);
                border-radius: 6px;
            }

            /* Responsive adjustments */
            @media (max-width: 768px) {
                .custom-card {
                    margin-bottom: 1rem;
                }

                .logo-container {
                    padding: 0.75rem 1rem;
                }

                .stats-number {
                    font-size: 2rem;
                }

                .btn-custom-primary {
                    padding: 0.5rem 1.5rem;
                    font-size: 0.9rem;
                }
            }

            @media (max-width: 576px) {
                .container-fluid {
                    padding-left: 0.5rem;
                    padding-right: 0.5rem;
                }

                .custom-card {
                    border-radius: 12px;
                }

                .stats-number {
                    font-size: 1.75rem;
                }
            }

            /* Utilidades adicionales */
            .text-truncate-2 {
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
            }

            .cursor-pointer {
                cursor: pointer;
            }

            .border-custom {
                border: 2px solid #e2e8f0 !important;
            }

            .border-custom-primary {
                border: 2px solid var(--primary-color) !important;
            }

            /* Loading spinner */
            .spinner-custom {
                width: 1.5rem;
                height: 1.5rem;
                border: 2px solid #f3f4f6;
                border-top: 2px solid var(--primary-color);
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }

            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }

            /* Select personalizado */
            .custom-select {
                position: relative;
            }

            .custom-select select {
                appearance: none;
                background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
                background-position: right 0.5rem center;
                background-repeat: no-repeat;
                background-size: 1.5em 1.5em;
                padding-right: 2.5rem;
            }

            /* Alerts personalizados */
            .alert-custom-success {
                background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
                border: 1px solid #22c55e;
                color: #166534;
                border-radius: 12px;
            }

            .alert-custom-danger {
                background: linear-gradient(135deg, #fef2f2 0%, #fecaca 100%);
                border: 1px solid #ef4444;
                color: #991b1b;
                border-radius: 12px;
            }
        </style>

        @php
            $manifest = json_decode(file_get_contents(public_path('build/manifest.json')), true);
            $jsFile = $manifest['resources/js/app.jsx']['file'] ?? '';
        @endphp

        @if ($jsFile)
            <script type="module" src="{{ asset('build/' . $jsFile) }}"></script>
        @endif

        {{-- @viteReactRefresh
        @vite(['resources/js/app.jsx']) --}}
    </head>
    <body>
        <div id="app"></div>

        <!-- Bootstrap 5 JS -->
        {{-- <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script> --}}
    </body>
</html>
