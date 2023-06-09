<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TblIntermediariosSocios extends Model
{
    use HasFactory;
    public $timestamps = false;
    protected $primaryKey = 'id';
    protected $table = 'tblIntermediariosSocios';
    protected $fillable = [
        'id',
        'nombreIntermediario',
        'fkUsuarioAlta',
        'activo',
        'fechaAlta'
    ];
}
