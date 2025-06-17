<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SucursalController extends Controller
{
    public function index()
    {
        try {
            // Hacer la petición a la API externa
            $response = Http::timeout(30)->get('https://almacenback.fastnetperu.com.pe/api/branch/all');

            if ($response->successful()) {
                $data = $response->json();

                // Filtrar solo las sucursales activas y formatear los datos
                $sucursales = collect($data['data'])
                    ->where('status', 1)
                    ->map(function ($sucursal) {
                        return [
                            'id' => $sucursal['id'],
                            'name' => $sucursal['name'],
                            'correlative' => $sucursal['correlative'],
                            'ubigeo' => $sucursal['ubigeo'],
                            'address' => $sucursal['address'],
                            'description' => $sucursal['description'],
                            'color' => $sucursal['color'] ?? '#2563eb', // Color por defecto si es null
                        ];
                    })
                    ->values();

                return response()->json([
                    'status' => 200,
                    'message' => 'Sucursales obtenidas correctamente',
                    'data' => $sucursales
                ]);

            } else {
                Log::error('Error al obtener sucursales: ' . $response->status());

                return response()->json([
                    'status' => 500,
                    'message' => 'Error al obtener las sucursales',
                    'data' => []
                ], 500);
            }

        } catch (\Exception $e) {
            Log::error('Excepción al obtener sucursales: ' . $e->getMessage());

            return response()->json([
                'status' => 500,
                'message' => 'Error interno del servidor',
                'data' => []
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            // Obtener todas las sucursales
            $response = Http::timeout(30)->get('https://almacenback.fastnetperu.com.pe/api/branch/all');

            if ($response->successful()) {
                $data = $response->json();

                // Buscar la sucursal específica
                $sucursal = collect($data['data'])
                    ->where('id', $id)
                    ->where('status', 1)
                    ->first();

                if ($sucursal) {
                    return response()->json([
                        'status' => 200,
                        'message' => 'Sucursal encontrada',
                        'data' => [
                            'id' => $sucursal['id'],
                            'name' => $sucursal['name'],
                            'correlative' => $sucursal['correlative'],
                            'ubigeo' => $sucursal['ubigeo'],
                            'address' => $sucursal['address'],
                            'description' => $sucursal['description'],
                            'color' => $sucursal['color'] ?? '#2563eb',
                        ]
                    ]);
                } else {
                    return response()->json([
                        'status' => 404,
                        'message' => 'Sucursal no encontrada',
                        'data' => null
                    ], 404);
                }

            } else {
                return response()->json([
                    'status' => 500,
                    'message' => 'Error al obtener la sucursal',
                    'data' => null
                ], 500);
            }

        } catch (\Exception $e) {
            Log::error('Excepción al obtener sucursal: ' . $e->getMessage());

            return response()->json([
                'status' => 500,
                'message' => 'Error interno del servidor',
                'data' => null
            ], 500);
        }
    }
}
