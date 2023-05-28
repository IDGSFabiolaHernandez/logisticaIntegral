<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TblPrestamosSocios extends Model
{
    use HasFactory;

    public $timestamps = false;
    protected $primaryKey = 'id';
    protected $table = 'prestamosSocios';
    protected $fillable = 
    [
        'id',
        'fechaPrestamo',
        'idSocio',
        'idEmpresaMensualidad',
        'montoPrestamo',
        'aCuenta',
        'estatusPrestamo',
        'observaciones',
        'usuarioAlta',
        'fechaAlta'
    ];
}
