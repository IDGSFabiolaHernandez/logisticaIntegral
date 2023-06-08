<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TblPrestamosEmpresas extends Model
{
    use HasFactory;
    public $timestamps = false;
    protected $primaryKey = 'fkPrestamo';
    protected $table = 'prestamosEmpresas';
    protected $fillable = 
    [
        'fkPrestamo',
        'fkEmpresa'
    ];
}
