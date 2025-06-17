<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('reclamaciones', function (Blueprint $table) {
            $table->id();
            $table->string('numero_reclamacion')->unique();

            // Datos del cliente
            $table->string('nombre_completo');
            $table->string('correo_electronico');
            $table->string('telefono');
            $table->string('zona');

            // Referencias a APIs externas
            $table->unsignedBigInteger('sucursal_id');
            $table->unsignedBigInteger('ejecutivo_id');

            // Datos de la reclamación
            $table->string('tipo_reclamo');
            $table->string('asunto');
            $table->text('descripcion');

            // Estado y seguimiento
            $table->enum('estado', ['pendiente', 'en_proceso', 'resuelto'])->default('pendiente');
            $table->text('respuesta')->nullable();
            $table->timestamp('fecha_respuesta')->nullable();

            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('reclamaciones');
    }
};
