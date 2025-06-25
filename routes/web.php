<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BasicController;
use App\Http\Controllers\Api\ReclamacionController;

Route::get('/', [BasicController::class, 'index']);
Route::get('/api/ejecutivos/{sucursalId}', [BasicController::class, 'getEjecutivos']);

Route::post('/api/reclamaciones', [BasicController::class, 'setClaim']);

// Route::post('/api/reclamaciones', [BasicController::class, '']);
Route::get('/api/reclamaciones', [BasicController::class, 'paginateClaims']);
Route::get('/api/reclamaciones/{id}', [BasicController::class, 'show']);
Route::get('/api/archivos/{id}', [BasicController::class, 'archivo']);
// Route::get('/api/reclamaciones/estadisticas', [ReclamacionController::class, 'estadisticas']);
// Route::put('/api/reclamaciones/{id}', [ReclamacionController::class, 'update']);
Route::get('/api/reclamos/estadisticas', [BasicController::class, 'estadisticas']);
