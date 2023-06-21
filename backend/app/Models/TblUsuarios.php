<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TblUsuarios extends Model
{
    use HasFactory;
    public $timestamps = false;
    protected $primaryKey = 'id';
    protected $table = 'usuarios';
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
