<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ReclamacionController;

Route::middleware('api')->group(function () {
    Route::get('/reclamaciones', [ReclamacionController::class, 'index']);
    Route::post('/reclamaciones', [ReclamacionController::class, 'store']);
    Route::get('/reclamaciones/estadisticas', [ReclamacionController::class, 'estadisticas']);
    Route::get('/reclamaciones/{id}', [ReclamacionController::class, 'show']);
    Route::put('/reclamaciones/{id}', [ReclamacionController::class, 'update']);
});
