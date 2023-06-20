<?php

namespace App\Repositories\LogisticaIntegral;

use App\Models\TblEmpresas;
use App\Models\TblMensualidadesSocios;
use Carbon\Carbon;

class EmpresasRepository
{
    public function obtenerEmpresasGenerales(){
        $listaEmpresas = TblEmpresas::where('Activo', 1)
                                    ->orderBy('nombre','asc');
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
                                            when empresas.status = 4 then 'Suspendida'
                                            when empresas.status = 5 then 'Maquila cliente'
                                            when empresas.status = 6 then 'Cuenta bancaria'
                                            end as status")
                                    ->join('usuarios', 'usuarios.id', 'empresas.IdUsuario')
                                    ->orderBy('empresas.Nombre','asc');*/
                                
        return $listaEmpresas->get();
    }

    public function obtenerEmpresasMensualidadesSelect(){
        $empresasSelect = TblMensualidadesSocios::select(
                                                    'empresas.id',
                                                    'empresas.nombre'
                                                )
                                                ->join('empresas','empresas.id','mensualidadesSocios.idEmpresa')
                                                ->orderBy('empresas.nombre','asc');
        return $empresasSelect->get();
    }

    public function validarEmpresaExistente ( $datosEmpresa, $idEmpresa = 0 ) {
        $empresa = TblEmpresas::where([
                                          ['nombre', 'like', '%'.$datosEmpresa['nombreEmpresa'].'%'],
                                          ['id', '!=', $idEmpresa]
                                      ]);

        return $empresa->count();
    }

    public function registrarEmpresa ( $datosEmpresa, $idUsuario ) {
        $registro = new TblEmpresas;
        $registro->nombre    = $this->trimValidator($datosEmpresa['nombreEmpresa']);
        $registro->status    = $datosEmpresa['statusEmpresa'];
        $registro->IdUsuario = $idUsuario;
        $registro->Fecha     = Carbon::now();
        $registro->Hora      = Carbon::now();
        $registro->activo    = 1;
        $registro->save();
    }

    public function trimValidator ( $value ) {
		return $value != null && trim($value) != '' ? trim($value) : null;
	}
}