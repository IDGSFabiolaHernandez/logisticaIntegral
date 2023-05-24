<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TblSociosEmpresas extends Model
{
    public $timestamps = false;
    use HasFactory;
    protected $primaryKey = 'id';
    protected $table = 'socios_empresas';
    protected $fillable = 
    [
        'id',
        'usuario',
        'clave',
        'clave_decrypt',
        'nombre',
        'noempleado',
        'activo',
        'genero',
        'correo',
        'fecharegistro',
        'horaregistro',
        'usuariobaja',
        'fechabaja',
        'horabaja',
        'idMotivo',
        'idPuesto',
        'idPerfil'
    ];
}
