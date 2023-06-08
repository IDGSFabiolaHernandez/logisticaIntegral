<?php

namespace App\Repositories\LogisticaIntegral;

use App\Models\TblEmpresas;
use App\Models\TblPrestamosEmpresas;
use App\Models\TblPrestamosSocios;
use App\Models\TblSocios;
use App\Models\TblSociosEmpresas;
use Carbon\Carbon;

class PrestamosRepository
{
     public function obtenerSociosConRelacionEmpresas(){
          $relacionConEmpresas = TblSocios::select(
                                                  'tblSocios.id',
                                                  'tblSocios.nombreSocio'
                                             )
                                             ->join('tblSociosEmpresas','tblSocios.id','tblSociosEmpresas.fkSocio')
                                             ->orderBy('tblSocios.nombreSocio','asc');
          return $relacionConEmpresas->get();                                        
     }

     public function obtenerEmpresasPorSocioSelect($idSocio){
          $empresasPorSocio = TblSociosEmpresas::select(
                                                       'empresas.id',
                                                       'empresas.nombre'
                                                  )
                                                  ->join('empresas','empresas.id','tblSociosEmpresas.fkEmpresa')
                                                  ->where('tblSociosEmpresas.fkSocio',$idSocio);
          return $empresasPorSocio->get();
     }

     public function obtenerSociosConPrestamos(){
          $sociosPrestamos = TblPrestamosSocios::select(
                                                  'tblSocios.id',
                                                  'tblSocios.nombreSocio'
                                             )
                                             ->join('tblSocios','tblSocios.id','prestamosSocios.id')
                                             ->orderBy('tblSocios.nombreSocio','asc')
                                             ->distinct();
          return $sociosPrestamos->get();                                                 
     }

     public function obtenerPrestamosPorSociosYStatus($socios,$status){
          $sociosYStatus = TblPrestamosSocios::select(
                                                  'prestamosSocios.id',
                                                  'tblSocios.nombreSocio',
                                                  'empresas.nombre as nombreEmpresa',
                                                  'prestamosSocios.montoPrestamo',
                                                  'prestamosSocios.aCuenta',
                                                  'prestamosSocios.estatusPrestamo'
                                             )
                                             ->selectRaw("
                                                  case
                                                       when prestamosSocios.estatusPrestamo = 1 then 'Pagado'
                                                       else 'Pendiente'
                                                  end as statusPrestamo
                                             ")
                                             ->selectRaw("(prestamosSocios.montoPrestamo - prestamosSocios.aCuenta) as saldo")
                                             ->selectRaw("DATE_FORMAT(prestamosSocios.fechaPrestamo, '%d-%m-%Y') as fechaPrestamo")
                                             ->join('tblSocios','tblSocios.id','prestamosSocios.idSocio')
                                             ->leftJoin('empresas','empresas.id','prestamosSocios.idEmpresaMensualidad')
                                             ->whereIn('prestamosSocios.idSocio',$socios)
                                             ->whereIn('prestamosSocios.estatusPrestamo',$status);
          return $sociosYStatus->get();
     }

     public function registroNuevoPrestamoSocio($datosPrestamos){
          $registro = new TblPrestamosSocios();

          $registro->fechaPrestamo   = Carbon::parse($datosPrestamos['fechaPrestamo']);
          $registro->idSocio         = $datosPrestamos['idSocio'];
          $registro->montoPrestamo   = $this->trimValidator($datosPrestamos['montoPrestamo']);
          $registro->aCuenta         = 0;
          $registro->estatusPrestamo = 0;
          $registro->observaciones   = $this->trimValidator($datosPrestamos['observaciones']);
          //$registro->usuarioAlta   = $this->trimValidator($datosPrestamos['usuarioAlta']);
          $registro->fechaAlta       = Carbon::now();
          $registro->save();

          return $registro->id;
     }    

     public function registroDetallePrestamoEmpresa($fkPrestamo,$fkEmpresa){
          $registro = new TblPrestamosEmpresas();
          
          $registro->fkPrestamo  = $fkPrestamo;
          $registro->fkEmpresa   = $fkEmpresa;
          $registro->save();
     }

     public function trimValidator ( $value ) {
		return $value != null && trim($value) != '' ? trim($value) : null;
	}
}