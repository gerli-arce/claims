<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reclamacion;
use Illuminate\Http\Request;
use App\Models\Response;
use Illuminate\Support\Facades\Validator;

class ReclamacionController extends Controller
{
    public function index()
    {
        $reclamaciones = Reclamacion::orderBy('created_at', 'desc')->paginate(10);
        return response()->json($reclamaciones);
    }

    // public function store(Request $request)
    // {
    //     $validator = Validator::make($request->all(), [
    //         'nombre_completo' => 'required|string|max:255',
    //         'correo_electronico' => 'required|email|max:255',
    //         'telefono' => 'required|string|max:20',
    //         'zona' => 'required|string|max:255',
    //         'tipo_reclamo' => 'required|string|max:255',
    //         'asunto' => 'required|string|max:255',
    //         'descripcion' => 'required|string'
    //     ]);

    //     if ($validator->fails()) {
    //         return response()->json([
    //             'errors' => $validator->errors()
    //         ], 422);
    //     }

    //     $reclamacion = Reclamacion::create($request->all());

    //     return response()->json([
    //         'message' => 'Reclamación enviada exitosamente',
    //         'reclamacion' => $reclamacion
    //     ], 201);
    // }

    public function store(Request $request)
    {
      $response = new Response();
        try {

            // [$branch, $status, $message, $role, $userid] = gValidate::get($request);
            // if ($status != 200) {
            //     throw new Exception($message);
            // }
            // if (!gValidate::check($role->permissions, $branch, 'business', 'create')) {
            //     throw new Exception('No tienes permisos para agregar empresas');
            // }

            // if (
            //     !isset($request->name) ||
            //     !isset($request->ruc)
            // ) {
            //     throw new Exception("Error: No deje campos vacíos");
            // }

            $businessJpa = new Business();
            $businessJpa->name = $request->name;
            $businessJpa->ruc = $request->ruc;
            $businessJpa->relative_id = guid::short();

            $businessJpa->status = "1";
            $businessJpa->save();

            $response->setStatus(200);
            $response->setMessage('La empresa se a agregado correctamente');
        } catch (\Throwable$th) {
            $response->setStatus(400);
            $response->setMessage($th->getMessage());
        } finally {
            return response(
                $response->toArray(),
                $response->getStatus()
            );
        }
    }

    public function estadisticas()
    {
        $total = Reclamacion::count();
        $resueltos = Reclamacion::where('estado', 'resuelto')->count();
        $pendientes = Reclamacion::where('estado', 'pendiente')->count();
        $enProceso = Reclamacion::where('estado', 'en_proceso')->count();

        return response()->json([
            'total' => $total,
            'resueltos' => $resueltos,
            'pendientes' => $pendientes,
            'en_proceso' => $enProceso,
            'tiempo_promedio' => '24 horas'
        ]);
    }

    public function show($id)
    {
        $reclamacion = Reclamacion::findOrFail($id);
        return response()->json($reclamacion);
    }

    public function update(Request $request, $id)
    {
        $reclamacion = Reclamacion::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'estado' => 'sometimes|in:pendiente,en_proceso,resuelto',
            'respuesta' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        $reclamacion->update($request->only(['estado', 'respuesta']));

        if ($request->has('estado') && $request->estado === 'resuelto') {
            $reclamacion->fecha_respuesta = now();
            $reclamacion->save();
        }

        return response()->json([
            'message' => 'Reclamación actualizada exitosamente',
            'reclamacion' => $reclamacion
        ]);
    }
}
