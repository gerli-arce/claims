<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" data-bs-theme="">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>FASTNETPERU - Libro de Reclamaciones</title>

    <meta name="csrf-token" content="{{ csrf_token() }}">

    <link rel="shortcut icon" href="/assets/img/icon.png">
    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Bootstrap Icons -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.2/font/bootstrap-icons.css">
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">

    <!-- Pasar datos de sucursales a JavaScript -->
    <script>
        window.sucursalesData = @json($sucursales);
    </script>

    <script>
        (function() {
            const stored = localStorage.getItem('bsTheme');
            const prefers = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (stored === 'dark' || (stored === null && prefers)) {
                document.documentElement.setAttribute('data-bs-theme', 'dark');
            } else {
                document.documentElement.setAttribute('data-bs-theme', 'light');
            }
        })();
    </script>

    <style>
        :root,
        [data-bs-theme="light"] {
            --bs-primary: #2563eb;
            --bs-danger: #ef4444;
            --bs-font-sans-serif: 'Inter', sans-serif;
        }

        /* [data-bs-theme="dark"] {
            --bs-primary: #2563eb;
            --bs-danger: #ef4444;
        } */

        [data-bs-theme="dark"] .bg-primary {
            --bs-bg-opacity: 1;
            background-color: rgb(0 0 0) !important;
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

     <a
        href="https://wa.me/51986470369?text=Hola%20vengo%20de%20la%20web%20de%20libro%20de%20reclamos"
        class="btn btn-success position-fixed bottom-0 end-0 m-3 d-flex align-items-center gap-2"
        target="_blank" rel="noopener" title="Escribir a WhatsApp"
    >
        <i class="bi bi-whatsapp"></i>

    </a>

    <!-- Bootstrap 5 JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
</body>

</html>
