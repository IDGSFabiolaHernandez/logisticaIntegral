<?php

namespace App\Repositories\LogisticaIntegral;

use App\Models\TblMensualidadesSocios;
use App\Models\TblSociosEmpresas;
use Illuminate\Support\Facades\DB;

class MensualidadesRepository
{
    public function obtenerUltimoMesSociosEmpresas(){
        $ultimoMesSociosEmpresas = TblSociosEmpresas::select('mesIngreso')
                                                     ->distinct()
                                                     ->join('empresas', function ($join) {
                                                        $join->on('empresas.id','tblSociosEmpresa.fkEmpresa')
                                                             ->on('empresas.Activo',1)
                                                             ->on('empresas.status',1);
                                                     })
                                                     ->where('mesIngreso','!=','0000-00-00')
                                                     ->orderBy('tblSociosEmpresas.mesIngreso','asc')
                                                     ->limit(1);
        
        return $ultimoMesSociosEmpresas->get();
    }

    public function obtenerMesMensualidades ( $op ) {
        $mes = TblMensualidadesSocios::select('mensualidad')
                                     ->limit(1);

        if ( $op == 'ultimo' ) {
            $mes->orderBy('mensualidad', 'asc');
        } else if ( $op == 'reciente' ) {
            $mes->orderBy('mensualidad', 'desc');
        }

        return $mes->get()[0]->mensualidad ?? null;
    }
    

    public function obtenerMesesPosterioresAUltimoMes($ultimoMes, $filter = 'NOW()'){
        $mesesPosteriores = DB::select("
                                    SELECT
                                        DATE_FORMAT(DATE_ADD('".$ultimoMes."', INTERVAL n MONTH), '%Y-%m-%d') AS fechaBase,
                                        DATE_FORMAT(DATE_ADD('".$ultimoMes."', INTERVAL n MONTH), '%M %Y') AS mes
                                    FROM (
                                        SELECT @row := @row + 1 AS n
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
                                                   ->join('empresas',function ($join){
                                                       $join->on('empresas.id','tblSociosEmpresa.fkEmpresa')
                                                            ->on('empresas.Activo',1)
                                                            ->on('empresas.status',1);
                                                   })
                                                   ->where([
                                                       ['tblSociosEmpresas.mesIngreso','!=','0000-00-00'],
                                                       ['tblSociosEmpresas.mesIngreso','<=',$fecha]
                                                   ])
                                                   ->orderBy('tblSociosEmpresas.mesIngreso','asc');
        return $socioEmpresaHastaFecha->get();
    }

    public function verificarPagoMensualidad($idSocio, $idEmpresa, $fecha){
        $verificarEmpresaHastaFecha = TblMensualidadesSocios::where([
                                                                ['idSocio',$idSocio],
                                                                ['idEmpresa',$idEmpresa],
                                                                ['mensualidad',$fecha]
                                                            ]);
        return $verificarEmpresaHastaFecha->count();
    }

    public function obtenerMensualidadesEmpresa($socios, $empresas, $mensualidades){
        $mensualidadesEmpresa = TblMensualidadesSocios::select(
                                                            'tblSocios.nombreSocio',
                                                            'empresas.nombre as nombreEmpresa',
                                                            'mensualidadesSocios.cantidad',
                                                            'mensualidadesSocios.abonoPrestamo'
                                                        )
                                                      ->selectRaw("CONCAT('MEN', DATE_FORMAT(mensualidadesSocios.fechaPago, '%m%y'), LPAD(mensualidadesSocios.id, 4, '0')) as folio")
                                                      ->selectRaw("DATE_FORMAT(mensualidadesSocios.mensualidad, '%M %Y') as mensualidad")
                                                      ->selectRaw("DATE_FORMAT(mensualidadesSocios.fechaPago, '%d-%m-%Y') as fechaPago")
                                                      ->join('tblSocios','tblSocios.id','mensualidadesSocios.idSocio')
                                                      ->join('empresas','empresas.id','mensualidadesSocios.idEmpresa')
                                                      ->whereIn('mensualidadesSocios.mensualidad',$mensualidades)
                                                      ->orderBy('nombreSocio','asc');

        if( is_null($empresas) ){
            $mensualidadesEmpresa->whereIn('mensualidadesSocios.idSocio',$socios);
        } else if(is_null($socios)){
            $mensualidadesEmpresa->whereIn('mensualidadesSocios.idEmpresa',$empresas);
        }

        return $mensualidadesEmpresa->get();
    }
}