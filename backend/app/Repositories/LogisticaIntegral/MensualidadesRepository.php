<?php

namespace App\Repositories\LogisticaIntegral;

use App\Models\TblMensualidadesSocios;
use App\Models\TblPrestamosEmpresas;
use App\Models\TblPrestamosSocios;
use App\Models\TblSocios;
use App\Models\TblSociosEmpresas;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class MensualidadesRepository
{
    public function obtenerUltimoMesSociosEmpresas(){
        $ultimoMesSociosEmpresas = TblSociosEmpresas::select('tblSociosEmpresas.mesIngreso')
                                                    ->distinct()
                                                    ->join('tblSocios', function ($join) {
                                                        $join->on('tblSocios.id', 'tblSociosEmpresas.fkSocio')
                                                             ->where('tblSocios.bloque', '!=', null);
                                                    })
                                                    ->where('tblSociosEmpresas.mesIngreso', '!=', '0000-00-00')
                                                    ->orderBy('tblSociosEmpresas.mesIngreso', 'asc')
                                                    ->limit(1);
                                                    
        return $ultimoMesSociosEmpresas->get()[0]->mesIngreso;
    }

    public function obtenerMensualidadesPagadas () {
        $mensualidades = TblMensualidadesSocios::select(
                                                     'mensualidad as fechaBase',
                                                     DB::raw('DATE_FORMAT(mensualidad, \'%M %Y\') as mes')
                                                 )
                                               ->distinct()
                                               ->orderBy('mensualidad', 'asc');

        return $mensualidades->get();
    }
    
    public function obtenerMesesPosterioresAUltimoMes($ultimoMes, $filter = 'NOW()'){
        $mesesPosteriores = DB::select("
                                    SELECT
                                        DATE_FORMAT(DATE_ADD('".$ultimoMes."', INTERVAL n MONTH), '%Y-%m-%d') as fechaBase,
                                        DATE_FORMAT(DATE_ADD('".$ultimoMes."', INTERVAL n MONTH), '%M %Y') as mes
                                    FROM (
                                        SELECT @row := @row + 1 as n
                                        FROM (
                                            SELECT 0 UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL
                                            SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9
                                        ) t1
                                        CROSS JOIN (
                                            SELECT 0 UNION ALL SELECT 10 UNION ALL SELECT 20 UNION ALL SELECT 30 UNION ALL SELECT 40 UNION ALL
                                            SELECT 50 UNION ALL SELECT 60 UNION ALL SELECT 70 UNION ALL SELECT 80 UNION ALL SELECT 90
                                        ) t2
                                        CROSS JOIN (SELECT @row := -1) r
                                    ) numbers
                                    WHERE DATE_ADD('".$ultimoMes."', INTERVAL n MONTH) BETWEEN '".$ultimoMes."' AND ".$filter."
                                ");
        return $mesesPosteriores;
    }

    public function obtenerSociosEmpresasHastaFecha($fecha){
        $socioEmpresaHastaFecha = TblSociosEmpresas::select(
                                                        'tblSociosEmpresas.fkSocio',
                                                        'tblSociosEmpresas.fkEmpresa'
                                                    )
                                                   ->join('empresas', function ($join){
                                                       $join->on('empresas.id', 'tblSociosEmpresas.fkEmpresa')
                                                            ->where('empresas.Activo', 1)
                                                            ->whereNotIn('empresas.status', [3, 4]);
                                                   })
                                                   ->join('tblSocios', function ($join) {
                                                       $join->on('tblSocios.id', 'tblSociosEmpresas.fkSocio')
                                                            ->where('tblSocios.bloque', '!=', null);
                                                   })
                                                   ->where([
                                                       ['tblSociosEmpresas.mesIngreso', '!=', '0000-00-00'],
                                                       ['tblSociosEmpresas.mesIngreso', '<=', Carbon::parse($fecha)->format('Y-m-d')]
                                                   ])
                                                   ->whereNotNull('tblSociosEmpresas.mesIngreso')
                                                   ->where(function ($query) use ($fecha) {
                                                        $query->where('mesSalida', '>', Carbon::parse($fecha)->format('Y-m-d'))
                                                              ->orWhereNull('mesSalida')
                                                              ->orWhere('mesSalida', '0000-00-00');
                                                   })
                                                   ->orderBy('tblSociosEmpresas.mesIngreso','asc');
        return $socioEmpresaHastaFecha->get();
    }

    public function verificarPagoMensualidad($idSocio, $idEmpresa, $fecha){
        $verificarEmpresaHastaFecha = TblMensualidadesSocios::where([
                                                                ['idSocio', $idSocio],
                                                                ['idEmpresa', $idEmpresa],
                                                                ['mensualidad', $fecha]
                                                            ]);
        return $verificarEmpresaHastaFecha->count();
    }

    public function obtenerMensualidadesPagadasEmpresaSocios($socios, $empresas, $mensualidades){
        $mensualidadesEmpresa = TblMensualidadesSocios::select(
                                                            'mensualidadesSocios.id',
                                                            'tblSocios.nombreSocio',
                                                            'empresas.nombre as nombreEmpresa',
                                                            'mensualidadesSocios.cantidad',
                                                            'mensualidadesSocios.abonoPrestamo'
                                                        )
                                                      ->selectRaw('(select count(ms.id) from mensualidadesSocios as ms where ms.mensualidad = mensualidadesSocios.mensualidad and ms.id <= mensualidadesSocios.id) as contador')
                                                      ->selectRaw("DATE_FORMAT(mensualidadesSocios.mensualidad, '%M %Y') as mensualidad")
                                                      ->selectRaw("DATE_FORMAT(mensualidadesSocios.fechaPago, '%d-%m-%Y') as fechaPago")
                                                      ->join('tblSocios','tblSocios.id','mensualidadesSocios.idSocio')
                                                      ->join('empresas','empresas.id','mensualidadesSocios.idEmpresa')
                                                      ->whereIn('mensualidadesSocios.mensualidad', $mensualidades)
                                                      ->orderBy('mensualidadesSocios.mensualidad', 'asc')
                                                      ->orderBy('mensualidadesSocios.id', 'asc');

        if( is_null($empresas) ){
            $mensualidadesEmpresa->whereIn('mensualidadesSocios.idSocio', $socios);
        } else if(is_null($socios)){
            $mensualidadesEmpresa->whereIn('mensualidadesSocios.idEmpresa', $empresas);
        }

        return $mensualidadesEmpresa->get();
    }

    public function obtenerMensualidadesPagarPorMensualidad ( $fechaBase, $socios, $empresas, $bloques ) {
        $mensualidadesPorPagar = TblSocios::select(
                                               'tblSocios.id',
                                               'tblSocios.nombreSocio',
                                               DB::raw("
                                                    CASE
                                                        WHEN tblSocios.bloque IS NOT NULL THEN CONCAT('Bloque ', tblSocios.bloque)
                                                        ELSE NULL
                                                    END AS bloque
                                                ")
                                            )
                                          ->selectRaw('COUNT(empresas.id) as numEmpresas')
                                          ->selectRaw('(SELECT COUNT(prestamosSocios.id) FROM prestamosSocios WHERE prestamosSocios.idSocio = tblSocios.id AND estatusPrestamo = 0) as numPrestamos')
                                          ->selectRaw('(SELECT SUM(prestamosSocios.montoPrestamo) FROM prestamosSocios WHERE prestamosSocios.idSocio = tblSocios.id AND estatusPrestamo = 0) as importeTotalPrestamo')
                                          ->selectRaw('(SELECT SUM((prestamosSocios.montoPrestamo - prestamosSocios.aCuenta)) FROM prestamosSocios WHERE prestamosSocios.idSocio = tblSocios.id AND estatusPrestamo = 0) as restantePrestamo')
                                          ->join('tblSociosEmpresas', function ( $join ) use ( $fechaBase ) {
                                               $join->on('tblSociosEmpresas.fkSocio', 'tblSocios.id')
                                                    ->where('tblSociosEmpresas.mesIngreso', '!=', '0000-00-00')
                                                    ->whereNotNull('tblSociosEmpresas.mesIngreso')
                                                    ->where('tblSociosEmpresas.mesIngreso', '<=', Carbon::parse($fechaBase)->format('Y-m-d'))
                                                    ->where(function ($query) use ($fechaBase) {
                                                        $query->where('mesSalida', '>', Carbon::parse($fechaBase)->format('Y-m-d'))
                                                            ->orWhereNull('mesSalida')
                                                            ->orWhere('mesSalida', '0000-00-00');
                                                    });
                                          })
                                          ->join('empresas', function ($join) {
                                              $join->on('empresas.id', 'tblSociosEmpresas.fkEmpresa')
                                                  ->where('empresas.Activo', 1)
                                                  ->whereNotIn('empresas.status', [3, 4]);
                                          })
                                          ->whereIn('tblSocios.id', $socios)
                                          ->whereIn('tblSocios.bloque', $bloques)
                                          ->whereIn('tblSociosEmpresas.fkEmpresa', $empresas)
                                          ->groupBy('tblSocios.id', 'tblSocios.nombreSocio', 'tblSocios.bloque')
                                          ->orderBy('tblSocios.nombreSocio', 'ASC');
                                          
        return $mensualidadesPorPagar->get();
    }

    public function obtenerEnlacesSocioEmpresas($mensualidadPagar, $idSocio){
        $mensualidadPagar = Carbon::parse($mensualidadPagar)->format('Y-m-d');
        $mensualidadesAPagarSocio = TblSocios::select(
                                                    'tblSocios.id',
                                                    'tblSociosEmpresas.fkEmpresa',
                                                    'tblSociosEmpresas.montoPago',
                                                    'tblSociosEmpresas.montoPrestamo'
                                             )
                                             ->join('tblSociosEmpresas', function ($join) use ($mensualidadPagar){
                                                $join->on('tblSociosEmpresas.fkSocio', 'tblSocios.id')
                                                     ->where('tblSociosEmpresas.mesIngreso', '!=', '0000-00-00')
                                                     ->whereNotNull('tblSociosEmpresas.mesIngreso')
                                                     ->where('tblSociosEmpresas.mesIngreso', '<=', $mensualidadPagar)
                                                     ->where(function ($query) use ($mensualidadPagar) {
                                                        $query->where('mesSalida', '>', $mensualidadPagar)
                                                              ->orWhereNull('mesSalida')
                                                              ->orWhere('mesSalida', '0000-00-00');
                                                    });
                                             })
                                             ->join('empresas', function($join){
                                                $join->on('empresas.id', 'tblSociosEmpresas.fkEmpresa')
                                                     ->where('empresas.Activo', 1)
                                                     ->whereNotIn('empresas.status', [3, 4]);
                                             })
                                             ->where('tblSocios.id', $idSocio)
                                             ->orderBy('tblSocios.nombreSocio', 'asc');

        return $mensualidadesAPagarSocio->get();
    }

    public function obtenerPrestamosSocioActivos($idSocio){
        $prestamosSociosActivos = TblPrestamosSocios::select(
                                                        'id'
                                                    )
                                                    ->where('idSocio', $idSocio)
                                                    ->where('estatusPrestamo', 0);
        return $prestamosSociosActivos->get();
    }

    public function validarPagoPrestamoPorEmpresa ( $idPrestamo, $idEmpresa ) {
        $empresas = TblPrestamosEmpresas::where([
                                            ['fkPrestamo', $idPrestamo],
                                            ['fkEmpresa', $idEmpresa]
                                        ]);

        return $empresas->count();
    }

    public function obtenerDetallePrestamoSocio($idPrestamo){
        $prestamosSociosActivos = TblPrestamosSocios::select(
                                                        'id',
                                                        'idSocio',
                                                        'idEmpresaMensualidad',
                                                        'montoPrestamo',
                                                        'aCuenta'
                                                    )
                                                    ->selectRaw('(montoPrestamo - aCuenta) as deuda')
                                                    ->where('prestamosSocios.id', $idPrestamo);
                                                    
        return $prestamosSociosActivos->get()[0] ?? null;
    }

    public function actualizarEstadoDeCuenta($aCuenta,$estatusPrestamo,$idPrestamo){
        TblPrestamosSocios::where('id',$idPrestamo)
                          ->update([
                                'aCuenta'         => $aCuenta,
                                'estatusPrestamo' => $estatusPrestamo
                          ]);
    }

    public function registrarPagoMensualidadEmpresaSocio($datosPago){
        $registro = new TblMensualidadesSocios;
        $registro->idSocio       = $datosPago['idSocio'];
        $registro->idEmpresa     = $datosPago['idEmpresa'];
        $registro->mensualidad   = $datosPago['mensualidad'];
        $registro->cantidad      = $datosPago['cantidad'];
        $registro->abonoPrestamo = $datosPago['abonoPrestamo'];
        $registro->fechaPago     = $datosPago['fechaPago'];
        $registro->fkUsuarioPago = $datosPago['fkUsuarioPago'];
        $registro->fkPrestamo    = $datosPago['fkPrestamo'];
        $registro->fechaAlta     = Carbon::now();
        $registro->save();
    }
}