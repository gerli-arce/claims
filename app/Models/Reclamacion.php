<?php

namespace App\Models;

// use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reclamacion extends Model
{
    // use HasFactory;

    static $rules = [];
    public $timestamps = false;
    protected $table = 'reclamaciones';

    // protected $fillable = [
    //     'numero_reclamacion',
    //     'nombre_completo',
    //     'correo_electronico',
    //     'telefono',
    //     'zona',
    //     'sucursal_id',
    //     'ejecutivo_id',
    //     'tipo_reclamo',
    //     'asunto',
    //     'descripcion',
    //     'estado',
    //     'respuesta',
    //     'fecha_respuesta'
    // ];

    // protected $casts = [
    //     'fecha_respuesta' => 'datetime'
    // ];

    // protected static function boot()
    // {
    //     parent::boot();

    //     static::creating(function ($reclamacion) {
    //         $reclamacion->numero_reclamacion = 'REC-' . date('Y') . '-' . str_pad(
    //             Reclamacion::whereYear('created_at', date('Y'))->count() + 1,
    //             6,
    //             '0',
    //             STR_PAD_LEFT
    //         );
    //     });
    // }
}
