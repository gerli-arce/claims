<?php

namespace App\Http\Controllers;

use App\gLibraries\gJSON;
use App\gLibraries\gTrace;
use App\gLibraries\gValidate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Models\Reclamacion;
use App\Models\ReclamacionArchivo;
use Illuminate\Support\Facades\Storage;
use App\Models\ViewReclamaciones;
use App\Models\Response;
use Illuminate\Support\Facades\Validator;


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

    public function setClaim(Request $request)
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

            $reclamacionJpa = new Reclamacion();
            $reclamacionJpa->nombre_completo = $request->nombre_completo;
            $reclamacionJpa->correo_electronico = $request->correo_electronico;
            $reclamacionJpa->telefono = $request->telefono;
            $reclamacionJpa->zona = $request->zona;
            $reclamacionJpa->sucursal_id = $request->sucursal_id;
            $reclamacionJpa->ejecutivo_id = $request->ejecutivo_id;
            $reclamacionJpa->tipo_reclamo = $request->tipo_reclamo;
            $reclamacionJpa->asunto = $request->asunto;
            $reclamacionJpa->descripcion = $request->descripcion;
            $reclamacionJpa->estado =  "pendiente";
            $reclamacionJpa->respuesta =  $request->respuesta;
            $reclamacionJpa->fecha_creacion = gTrace::getDate('mysql');
            $reclamacionJpa->save();

           // Guardar archivos adjuntos si existen
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $file) {
                    $path = $file->store('reclamaciones', 'public');
                    ReclamacionArchivo::create([
                        'reclamacion_id' => $reclamacionJpa->id,
                        'nombre_original' => $file->getClientOriginalName(),
                        'ruta' => $path,
                        'tipo' => 'imagen',
                        'fecha_creacion' => gTrace::getDate('mysql'),
                    ]);
                }
            }

            if ($request->hasFile('documents')) {
                foreach ($request->file('documents') as $file) {
                    $path = $file->store('reclamaciones', 'public');
                    ReclamacionArchivo::create([
                        'reclamacion_id' => $reclamacionJpa->id,
                        'nombre_original' => $file->getClientOriginalName(),
                        'ruta' => $path,
                        'tipo' => 'documento',
                        'fecha_creacion' => gTrace::getDate('mysql'),
                    ]);
                }
            }

            $response->setStatus(200);
            $response->setMessage('La reclamación se ha agregado correctamente');
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

     public function paginateClaims()
    {

        $response = new Response();
        try {

            $reclamaciones = ViewReclamaciones::orderBy('id', 'desc')->paginate(20);
            // return response()->json($reclamaciones);

            $reclamos = array();
            foreach ($reclamaciones as $reclamoJpa) {
                $parcel = gJSON::restore($reclamoJpa->toArray(), '__');
               $parcel['archivos'] = ReclamacionArchivo::where('reclamacion_id', $reclamoJpa->id)
                    ->get([ 'id', 'nombre_original', 'ruta', 'tipo', 'fecha_creacion' ]);
                $reclamos[] = $parcel;
            }

            $response->setStatus(200);
            $response->setMessage('Operación correcta');
            // $response->setDraw($request->draw);
            // $response->setITotalDisplayRecords($iTotalDisplayRecords);
            // $response->setITotalRecords(ViewParcelsRegisters::where('branch__correlative', $branch)->count());
            $response->setData($reclamos);
        } catch (\Throwable $th) {
            $response->setStatus(400);
            $response->setMessage($th->getMessage() . $th->getLine());
        } finally {
            return response(
                $response->toArray(),
                $response->getStatus()
            );
        }
    }


     public function lastClaims()
    {
        $response = new Response();
        try {
            $reclamaciones = ViewReclamaciones::orderBy('id', 'desc')->limit(10)->get();

            $reclamos = array();
            foreach ($reclamaciones as $reclamoJpa) {
                $parcel = gJSON::restore($reclamoJpa->toArray(), '__');
                $parcel['archivos'] = ReclamacionArchivo::where('reclamacion_id', $reclamoJpa->id)
                    ->get(['id', 'nombre_original', 'ruta', 'tipo', 'fecha_creacion']);
                $reclamos[] = $parcel;
            }

            $response->setStatus(200);
            $response->setMessage('Operación correcta');
            $response->setData($reclamos);
        } catch (\Throwable $th) {
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

        // Contamos ignorando mayúsculas/minúsculas para evitar inconsistencias
        $resueltos = Reclamacion::whereRaw('LOWER(estado) = ?', ['resuelto'])->count();
        $pendientes = Reclamacion::whereRaw('LOWER(estado) = ?', ['pendiente'])->count();
        $enProceso = Reclamacion::whereRaw('LOWER(estado) = ?', ['en_proceso'])->count();

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
          $reclamacion = Reclamacion::with('archivos')->findOrFail($id);
        return response()->json($reclamacion);
    }

     public function archivo($id)
    {
        $archivo = ReclamacionArchivo::findOrFail($id);

        $path = \Illuminate\Support\Facades\Storage::disk('public')->path($archivo->ruta);

        if (!\Illuminate\Support\Facades\Storage::disk('public')->exists($archivo->ruta)) {
            abort(404);
        }

        if (request()->query('download')) {
            return response()->download($path, $archivo->nombre_original);
        }

        return response()->file($path);
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

      if ($request->filled('estado')) {
            $reclamacion->estado = $request->estado;

       if ($request->estado === 'resuelto') {
                $reclamacion->fecha_respuesta = now();
            }
        }

        if ($request->has('respuesta')) {
            $reclamacion->respuesta = $request->respuesta;
        }

        $reclamacion->save();

        return response()->json([
            'message' => 'Reclamación actualizada exitosamente',
            'reclamacion' => $reclamacion
        ]);
    }

}
