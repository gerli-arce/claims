<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReclamacionArchivo extends Model
{
    static $rules = [];
    public $timestamps = false;
    protected $table = 'reclamacion_archivos';

     protected $fillable = [
        'reclamacion_id',
        'nombre_original',
        'ruta',
        'tipo',
        'fecha_creacion',
    ];

    public function reclamacion()
    {
        return $this->belongsTo(Reclamacion::class, 'reclamacion_id');
    }
}
