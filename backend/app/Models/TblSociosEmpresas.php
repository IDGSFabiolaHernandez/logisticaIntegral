<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TblSociosEmpresas extends Model
{
    use HasFactory;
    
    public $timestamps = false;
    protected $primaryKey = 'id';
    protected $table = 'tblSociosEmpresas';
    protected $fillable = 
    [
        'id',
        'fkSocio',
        'fkEmpresa',
        'mesIngreso',
        'tipoInstrumento',
        'numeroInstrumento',
        'montoMensualidad',
        'montoPago',
        'montoPrestamo',
        'mesSalida',
        'observaciones',
        'fkUsuarioAlta',
        'fechaAlta',
        'fechaActualizacion'
    ];
}
