<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TblSocios extends Model
{
    use HasFactory;

    public $timestamps = false;
    protected $primaryKey = 'id';
    protected $table = 'tblSocios';
    protected $fillable = 
    [
        'id',
        'nombreSocio',
        'curpSocio',
        'rfcSocio',
        'estadoCivilSocio',
        'lugarNacimiento',
        'ocupacion',
        'direccion',
        'colonia',
        'cp',
        'localidad',
        'estado',
        'telefono',
        'fkIntermedio',
        'observaciones',
        'tipoIdentificacion',
        'numeroIdentificacion',
        'vigencia',
        'fechaNacimiento',
        'fiel',
        'fechaInicio',
        'fechaFin',
        'bloque',
        'status',
        'fechaUsuarioAlta',
        'fechaAltaRegistro',
        'fechaActualizacion'
    ];
}
