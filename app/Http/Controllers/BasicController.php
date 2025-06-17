<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class BasicController extends Controller
{
    public function index()
    {
        // Obtener sucursales de la API
        $sucursales = $this->getSucursales();

        return view('app', compact('sucursales'));
    }

    public function getEjecutivos($sucursalId)
    {
        try {
            $response = Http::timeout(30)->get("https://almacenback.fastnetperu.com.pe/api/ejecutives/all/{$sucursalId}");

            if ($response->successful()) {
                $data = $response->json();

                // Formatear los datos de los ejecutivos
                $ejecutivos = collect($data['data'])
                    ->where('status', 1)
                    ->map(function ($ejecutivo) {
                        return [
                            'id' => $ejecutivo['id'],
                            'doc_type' => $ejecutivo['doc_type'],
                            'doc_number' => $ejecutivo['doc_number'],
                            'name' => $ejecutivo['name'],
                            'lastname' => $ejecutivo['lastname'],
                            'relative_id' => $ejecutivo['relative_id'],
                            'email' => $ejecutivo['email'],
                            'phone' => $ejecutivo['phone'],
                            'address' => $ejecutivo['address'],
                            'full_name' => trim($ejecutivo['name'] . ' ' . $ejecutivo['lastname']),
                            'image_url' => "http://almacen.fastnetperu.com.pe/api/image_person/{$ejecutivo['relative_id']}/full",
                            'branch' => $ejecutivo['branch']
                        ];
                    })
                    ->values()
                    ->toArray();

                return response()->json([
                    'status' => 200,
                    'message' => 'Ejecutivos obtenidos correctamente',
                    'data' => $ejecutivos
                ]);

            } else {
                Log::error('Error al obtener ejecutivos: ' . $response->status());

                return response()->json([
                    'status' => 500,
                    'message' => 'Error al obtener los ejecutivos',
                    'data' => []
                ], 500);
            }

        } catch (\Exception $e) {
            Log::error('Excepción al obtener ejecutivos: ' . $e->getMessage());

            return response()->json([
                'status' => 500,
                'message' => 'Error interno del servidor',
                'data' => []
            ], 500);
        }
    }

    private function getSucursales()
    {
        try {
            $response = Http::timeout(30)->get('https://almacenback.fastnetperu.com.pe/api/branch/all');

            if ($response->successful()) {
                $data = $response->json();

                // Filtrar solo las sucursales activas
                $sucursales = collect($data['data'])
                    ->where('status', 1)
                    ->map(function ($sucursal) {
                        return [
                            'id' => $sucursal['id'],
                            'name' => $sucursal['name'],
                            'correlative' => $sucursal['correlative'],
                            'ubigeo' => $sucursal['ubigeo'] ?? '',
                            'address' => $sucursal['address'] ?? '',
                            'description' => $sucursal['description'] ?? '',
                            'color' => $sucursal['color'] ?? '#2563eb',
                        ];
                    })
                    ->values()
                    ->toArray();

                return $sucursales;
            }
        } catch (\Exception $e) {
            Log::error('Error al obtener sucursales: ' . $e->getMessage());
        }

        // Fallback en caso de error
        return [
            [
                'id' => 1,
                'name' => 'FASTNETPERU PICHANAQUI',
                'correlative' => 'PICHANAQUI',
                'ubigeo' => '',
                'address' => '',
                'description' => '',
                'color' => '#0059ff',
            ],
            [
                'id' => 2,
                'name' => 'FASTNETPERU SATIPO',
                'correlative' => 'SATIPO',
                'ubigeo' => '',
                'address' => '',
                'description' => '',
                'color' => '#3dc000',
            ],
        ];
    }
}
