<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ReclamacionController;
use App\Http\Controllers\Api\SucursalController;

Route::middleware('api')->group(function () {
    // Rutas de reclamaciones
    Route::get('/reclamaciones', [ReclamacionController::class, 'index']);
    Route::post('/reclamaciones', [ReclamacionController::class, 'store']);
    Route::get('/reclamaciones/estadisticas', [ReclamacionController::class, 'estadisticas']);
    Route::get('/reclamaciones/{id}', [ReclamacionController::class, 'show']);
    Route::put('/reclamaciones/{id}', [ReclamacionController::class, 'update']);

    // Rutas de sucursales
    Route::get('/sucursales', [SucursalController::class, 'index']);
    Route::get('/sucursales/{id}', [SucursalController::class, 'show']);
});
