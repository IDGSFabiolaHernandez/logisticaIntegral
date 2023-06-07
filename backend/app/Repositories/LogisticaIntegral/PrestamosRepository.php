<?php

namespace App\Repositories\LogisticaIntegral;

use App\Models\TblEmpresas;
use App\Models\TblPrestamosSocios;
use App\Models\TblSocios;
use App\Models\TblSociosEmpresas;

class PrestamosRepository
{
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

   public function obtenerSociosConRelacionEmpresas(){
        $relacionConEmpresas = TblSocios::select(
                                                'tblSocios.id',
                                                'tblSocios.nombreSocio'
                                         )
                                        ->join('tblSociosEmpresas','tblSocios.id','tblSociosEmpresas.fkSocio')
                                        ->orderBy('tblSocios.nombreSocio','asc');
        return $relacionConEmpresas->get();                                        
   }

   public function obtenerEmpresasSelectPorSocio($idSocio){
        $empresasPorSocio = TblSociosEmpresas::select(
                                                    'empresas.id',
                                                    'empresas.nombre'
                                              )
                                              ->join('empresas','empresas.id','tblSociosEmpresas.fkEmpresa')
                                              ->where('tblSociosEmpresas.fkSocio',$idSocio);
        return $empresasPorSocio->get();
   }
}
