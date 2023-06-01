<?php

namespace App\Repositories\LogisticaIntegral;

use App\Models\TblEmpresas;

class EmpresasRepository
{
    public function empresasGenerales(){
        $listaEmpresas = TblEmpresas::orderBy('nombre','asc');
        /*$listaEmpresas = TblEmpresas::select(
                                        'empresas.id as IdEmpresa',
                                        'empresas.Nombre as Empresa',
                                        'empresas.Representante',
                                        'empresas.Contacto',
                                        'empresas.CorreoContacto',
                                        'empresas.Direccion',
                                        'empresas.IdCliente as Identificacion',
                                        'usuarios.id as IdUsuario ',
                                        'usuarios.nombre as Empleado',
                                        'empresas.Fecha',
                                        'empresas.Hora',
                                        'empresas.Activo'
                                    )
                                    ->selectRaw("case
                                            when empresas.status = 1 then 'Activa'
                                            when empresas.status = 2 then 'X suspender'
                                            when empresas.status = 3 then 'En proceso'
                                            when empresas.status = 4 then 'Inactiva'
                                            when empresas.status = 5 then 'Maquila cliente'
                                            when empresas.status = 6 then 'Cuenta bancaria'
                                            end as status")
                                    ->join('usuarios', 'usuarios.id', 'empresas.IdUsuario')
                                    ->orderBy('empresas.Nombre','asc');*/
        
                                
        return $listaEmpresas->get();
    }
    
   
   
}
