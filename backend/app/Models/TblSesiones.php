<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TblSesiones extends Model
{
    use HasFactory;
    public $timestamps = false;
    protected $primaryKey = 'PkTblSsesion';
    protected $table = 'tblsesiones';
    protected $fillable =
    [
        'PkTblSesion',
        'FKTblUsuario',
        'token'
    ];
}
