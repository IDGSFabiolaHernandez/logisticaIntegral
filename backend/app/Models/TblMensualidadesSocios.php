<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TblMensualidadesSocios extends Model
{
    use HasFactory;

    public $timestamps = false;
    protected $primaryKey = 'id';
    protected $table = 'mensualidadesSocios';
    protected $fillable =
    [
        'id',
        'idSocio',
        'idEmpresa',
        'mensualidad',
        'cantidad',
        'abonoPrestamo',
        'observaciones',
        'fechaPago',
        'bloque',
        'fkUsuarioPago',
        'fechaAlta'
    ];
}
