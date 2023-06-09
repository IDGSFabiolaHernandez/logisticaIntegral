<?php

namespace App\Repositories\LogisticaIntegral;

use App\Models\TblEmpresas;
use App\Models\TblPrestamosEmpresas;
use App\Models\TblPrestamosSocios;
use App\Models\TblSocios;
use App\Models\TblSociosEmpresas;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class PrestamosRepository
{
     public function obtenerSociosConRelacionEmpresas(){
          $relacionConEmpresas = TblSocios::select(
                                                  'tblSocios.id',
                                                  'tblSocios.nombreSocio'
                                             )
                                             ->distinct()
                                             ->join('tblSociosEmpresas','tblSocios.id','tblSociosEmpresas.fkSocio')
                                             ->join('empresas', function($join){
                                                  $join->on('empresas.id','tblSociosEmpresas.fkEmpresa')
                                                       ->where('empresas.Activo',1)
                                                       ->where('empresas.status', '!=', 4);
                                             })
                                             ->orderBy('tblSocios.nombreSocio','asc');
          return $relacionConEmpresas->get();
     }

     public function obtenerEmpresasPorSocioSelect($idSocio){
          $empresasPorSocio = TblSociosEmpresas::select(
                                                       'empresas.id',
                                                       'empresas.nombre'
                                                  )
                                                  ->join('empresas', function($join){
                                                       $join->on('empresas.id','tblSociosEmpresas.fkEmpresa')
                                                            ->where('empresas.Activo',1)
                                                            ->where('empresas.status', '!=', 4);
                                                   })
                                                  ->where('tblSociosEmpresas.fkSocio',$idSocio);
          return $empresasPorSocio->get();
     }

     public function obtenerSociosConPrestamos(){
          $sociosPrestamos = TblPrestamosSocios::select(
                                                  'tblSocios.id',
                                                  'tblSocios.nombreSocio'
                                             )
                                             ->join('tblSocios','tblSocios.id','prestamosSocios.idSocio')
                                             ->orderBy('tblSocios.nombreSocio','asc')
                                             ->distinct();
          return $sociosPrestamos->get();
     }

     public function obtenerPrestamosPorSociosYStatus($socios,$status){
          $sociosYStatus = TblPrestamosSocios::select(
                                                  'prestamosSocios.id',
                                                  'tblSocios.nombreSocio',
                                                  'prestamosSocios.montoPrestamo',
                                                  'prestamosSocios.aCuenta',
                                                  'prestamosSocios.estatusPrestamo'
                                             )
                                             ->selectRaw('COUNT(prestamoEmpresas.fkEmpresa) as numEmpresas')
                                             ->selectRaw("(prestamosSocios.montoPrestamo - prestamosSocios.aCuenta) as saldo")
                                             ->selectRaw("DATE_FORMAT(prestamosSocios.fechaPrestamo, '%d-%m-%Y') as fechaPrestamo")
                                             ->selectRaw("
                                                  case
                                                       when prestamosSocios.estatusPrestamo = 1 then 'Pagado'
                                                       else 'Pendiente'
                                                  end as statusPrestamo
                                             ")
                                             ->join('tblSocios','tblSocios.id','prestamosSocios.idSocio')
                                             ->join('prestamoEmpresas', 'prestamoEmpresas.fkPrestamo', 'prestamosSocios.id')
                                             ->whereIn('prestamosSocios.idSocio',$socios)
                                             ->whereIn('prestamosSocios.estatusPrestamo',$status)
                                             ->groupBy(
                                                  'prestamosSocios.id',
                                                  'tblSocios.nombreSocio',
                                                  'prestamosSocios.montoPrestamo',
                                                  'prestamosSocios.aCuenta',
                                                  'prestamosSocios.estatusPrestamo',
                                                  'saldo',
                                                  'fechaPrestamo',
                                                  'statusPrestamo'
                                             )
                                             ->orderBy('tblSocios.nombreSocio', 'asc');
          return $sociosYStatus->get();
     }

     public function registroNuevoPrestamoSocio($datosPrestamos){
          $registro = new TblPrestamosSocios();
          $registro->fechaPrestamo   = Carbon::parse($datosPrestamos['fechaPrestamo']);
          $registro->idSocio         = $datosPrestamos['idSocio'];
          $registro->montoPrestamo   = $this->numberValidator($datosPrestamos['montoPrestamo']);
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

     public function numberValidator($value) {
          if ($value != null && trim($value) != '') {
              $cleanedValue = str_replace(',', '', trim($value));
              return is_numeric($cleanedValue) ? (float) $cleanedValue : $cleanedValue;
          }
          
          return null;
      }
      
}