<?php

namespace App\Repositories\LogisticaIntegral;

use App\Models\TblEmpresas;
use App\Models\TblPrestamosEmpresas;
use App\Models\TblPrestamosSocios;
use App\Models\TblSocios;
use App\Models\TblSociosEmpresas;
use App\Models\TblMensualidadesSocios;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class PrestamosRepository
{
     public function obtenerSociosConRelacionEmpresas(){
          $relacionConEmpresas = TblSociosEmpresas::select(
                                                         'tblSocios.id',
                                                         'tblSocios.nombreSocio'
                                                  )
                                                  ->distinct()
                                                  ->join('empresas', function($join){
                                                       $join->on('empresas.id', 'tblSociosEmpresas.fkEmpresa')
                                                            ->where('empresas.Activo', 1)
                                                            ->whereNotIn('empresas.status', [3, 4]);
                                                  })
                                                  ->join('tblSocios', 'tblSocios.id', 'tblSociosEmpresas.fkSocio')
                                                  ->orderBy('tblSocios.nombreSocio', 'asc');

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
                                                            ->whereNotIn('empresas.status', [3, 4]);
                                                  })
                                                  ->where([
                                                       ['tblSociosEmpresas.fkSocio', $idSocio],
                                                       ['tblSociosEmpresas.mesIngreso', '<=', Carbon::now()->format('Y-m-d')],
                                                       [function ($orWheres) {
                                                            $orWheres->orWhere('tblSociosEmpresas.mesSalida', '>', Carbon::now()->format('Y-m-d'))
                                                                     ->orWhere('tblSociosEmpresas.mesSalida', '0000-00-00')
                                                                     ->orWhereNull('tblSociosEmpresas.mesSalida');
                                                       }]
                                                  ]);
                                                  
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
                                             ->leftJoin('prestamoEmpresas', 'prestamoEmpresas.fkPrestamo', 'prestamosSocios.id')
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

     public function registroNuevoPrestamoSocio($datosPrestamos, $idUsuario){
          $registro = new TblPrestamosSocios();
          $registro->fechaPrestamo   = Carbon::parse($datosPrestamos['fechaPrestamo']);
          $registro->idSocio         = $datosPrestamos['idSocio'];
          $registro->montoPrestamo   = $this->numberValidator($datosPrestamos['montoPrestamo']);
          $registro->aCuenta         = 0;
          $registro->estatusPrestamo = 0;
          $registro->observaciones   = $this->trimValidator($datosPrestamos['observaciones']);
          $registro->usuarioAlta     = $idUsuario;
          $registro->fechaAlta       = Carbon::now();
          $registro->save();

          return $registro->id;
     }    

     public function registroDetallePrestamoEmpresa($fkPrestamo, $fkEmpresa){
          $registro = new TblPrestamosEmpresas();
          $registro->fkPrestamo  = $fkPrestamo;
          $registro->fkEmpresa   = $fkEmpresa;
          $registro->save();
     }

     public function obtenerDetallePrestamoPorId ( $idPrestamo ) {
          $detallePrestamo = TblPrestamosSocios::select(
                                                   'prestamosSocios.montoPrestamo',
                                                   'prestamosSocios.aCuenta'
                                               )
                                               ->selectRaw("(prestamosSocios.montoPrestamo - prestamosSocios.aCuenta) as saldo")
                                               ->where('prestamosSocios.id', $idPrestamo);

          return $detallePrestamo->get();
     }

     public function obtenerAbonosPrestamo($idPrestamo){
          $detallePrestamo = TblMensualidadesSocios::select(
                                                       'empresas.nombre as nombreEmpresa',
                                                       'mensualidadesSocios.cantidad',
                                                       'mensualidadesSocios.abonoPrestamo'
                                                   )
                                                   ->selectRaw('(select count(ms.id) from mensualidadesSocios as ms where ms.mensualidad = mensualidadesSocios.mensualidad and ms.id <= mensualidadesSocios.id) as contador')
                                                   ->selectRaw("DATE_FORMAT(mensualidadesSocios.mensualidad, '%M %Y') as mensualidad")
                                                   ->selectRaw("DATE_FORMAT(mensualidadesSocios.fechaPago, '%d-%m-%Y') as fechaPago")
                                                   ->join('tblSocios','tblSocios.id','mensualidadesSocios.idSocio')
                                                   ->join('empresas','empresas.id','mensualidadesSocios.idEmpresa')
                                                   ->where('mensualidadesSocios.fkPrestamo', $idPrestamo)
                                                   ->orderBy('mensualidadesSocios.mensualidad', 'asc')
                                                   ->orderBy('mensualidadesSocios.id', 'asc');

          return $detallePrestamo->get();
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