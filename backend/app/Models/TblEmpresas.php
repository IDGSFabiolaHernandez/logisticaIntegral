<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TblEmpresas extends Model
{
    use HasFactory;
    public $timestamps = false;
    protected $primaryKey = 'id';
    protected $table = 'empresas';
    protected $fillable = 
    [
        'id',
         'nombre',
         'rfc',
         'rppc',
         'no_acta',
         'no_rppc',
         'notario',
         'no_notaria',
         'representante_legal',
         'porcentaje_representante',
         'apoderado',
         'porcentaje_apoderado',
         'calle',
         'colonia',
         'cp',
         'municipio',
         'entidad_federativa',
         'actividad_preponderante',
         'telefono_hoja_membretada',
         'correo',
         'compra_solidaria',
         'compra_net',
         'proveedor_gob_del_edo',
         'padron_de_contratistas',
         'tarjeta_patronal',
         'comprobante_domicilio',
         'cv',
         'inicio_de_operaciones',
         'IdUsuario',
         'Fecha',
         'Hora',
         'Activo',
         'status',
         'Representante',
         'Contacto',
         'CorreoContacto',
         'Direccion',
         'IdCliente',
         'nombre_legal',
         'no_acta_ext',
         'representante_legal1',
         'socio',
         'socio1',
         'banco',
         'clabe_interbancaria',
         'codigo_swift',
         'telefono_banco',
         'registro_ine',
         'saop',
         'numero_registro',
         'domicilio',
         'capital_social',
         'fechaModificacio'
    ];
}
