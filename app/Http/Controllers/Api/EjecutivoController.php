<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ejecutivo;
use Illuminate\Http\Request;

class EjecutivoController extends Controller
{
    public function index(Request $request)
    {
        $query = Ejecutivo::with('sucursal')
            ->where('activo', true);

        if ($request->has('sucursal_id')) {
            $query->where('sucursal_id', $request->sucursal_id);
        }

        $ejecutivos = $query->orderBy('nombre')->get();

        return response()->json($ejecutivos);
    }

    public function show($id)
    {
        $ejecutivo = Ejecutivo::with('sucursal')
            ->findOrFail($id);

        return response()->json($ejecutivo);
    }
}
