<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TblSociosEmpresas extends Model
{
    use HasFactory;
    
    public $timestamps = false;
    protected $primaryKey = 'id';
    protected $table = 'socios_empresas';
    protected $fillable = 
    [
        'id',
        'fkSocio',
        'fkEmpresa',
        'mesIngreso',
        'tipoInstrumento',
        'numeroInstrumento',
        'mesSalida',
        'observaciones',
        'fkUsuarioAlta',
        'fechaAlta',
        'fechaActualizacion'
    ];
}
