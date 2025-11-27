<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" data-bs-theme="dark">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>FASTNETPERU - Libro de Reclamaciones</title>

    <meta name="csrf-token" content="{{ csrf_token() }}">

    <link rel="shortcut icon" href="/assets/img/icon.png">
    <!-- Bootstrap Icons (solo iconos) -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.2/font/bootstrap-icons.css">
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">

    <!-- Pasar datos de sucursales a JavaScript -->
    <script>
        window.sucursalesData = @json($sucursales);
    </script>

    <script>
        document.documentElement.setAttribute('data-bs-theme', 'dark');
        localStorage.setItem('bsTheme', 'dark');
    </script>

    @php
        $useViteDev = app()->environment('local');
        $manifestPath = public_path('build/manifest.json');
        $hasManifest = file_exists($manifestPath);
    @endphp

    @if ($useViteDev || !$hasManifest)
        @viteReactRefresh
        @vite(['resources/js/app.jsx'])
    @else
        @php
            $manifest = json_decode(file_get_contents($manifestPath), true);
            $entry = $manifest['resources/js/app.jsx'] ?? [];
            $jsFile = $entry['file'] ?? '';
            $cssFiles = $entry['css'] ?? [];
        @endphp

        @if (!empty($cssFiles))
            @foreach ($cssFiles as $css)
                <link rel="stylesheet" href="{{ asset('build/' . $css) }}">
            @endforeach
        @endif

        @if ($jsFile)
            <script type="module" src="{{ asset('build/' . $jsFile) }}"></script>
        @endif
    @endif
</head>

<body>
    <div id="app"></div>

    {{-- Removed floating WhatsApp button from bottom-right corner --}}
</body>

</html>
