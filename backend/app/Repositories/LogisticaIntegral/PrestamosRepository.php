<?php

namespace App\Repositories\LogisticaIntegral;

use App\Models\TblEmpresas;
use App\Models\TblPrestamosSocios;
use App\Models\TblSocios;
use App\Models\TblSociosEmpresas;

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
                                                  'tblSocios.nombreSocio',
                                                  'empresas.nombre as nombreEmpresa',
                                                  'prestamosSocios.montoPrestamo',
                                                  'prestamosSocios.aCuenta',
                                                  'prestamosSocios.estatusPrestamo'
                                             )
                                             ->selectRaw("DATE_FORMAT(prestamosSocios.fechaPrestamo, '%d-%m-%Y') as fechaPrestamo")
                                             ->join('tblSocios','tblSocios.id','prestamosSocios.idSocio')
                                             ->leftJoin('empresas','empresas.id','prestamosSocios.idEmpresaMensualidad')
                                             ->whereIn('prestamosSocios.idSocio',$socios)
                                             ->whereIn('prestamosSocios.estatusPrestamo',$status);
          return $sociosYStatus->get();
     }
}