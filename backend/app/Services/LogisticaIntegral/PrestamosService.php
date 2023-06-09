<?php

namespace App\Services\LogisticaIntegral;

use App\Repositories\LogisticaIntegral\PrestamosRepository;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PrestamosService
{
    protected $prestamosRepository;
    public function __construct(
        PrestamosRepository $PrestamosRepository
    )
    {
        $this->prestamosRepository = $PrestamosRepository;
    }

    public function obtenerSociosConRelacionEmpresas(){
        $sociosRelacionEmpresas = $this->prestamosRepository->obtenerSociosConRelacionEmpresas();
        
        return response()->json(
            [
                'mensaje' => 'Se consultaron con éxito los Socios que tienen relación con Empresas',
                'data' => $sociosRelacionEmpresas
            ],
            200
        );
    }

    public function obtenerEmpresasPorSocioSelect($idSocio){
        $empresasSelectPorSocio = $this->prestamosRepository->obtenerEmpresasPorSocioSelect($idSocio);
        $opcionesSelect = [];

        foreach( $empresasSelectPorSocio as $item){
            $temp = [
                'value' => $item->id,
                'label' => $item->nombre,
                'checked' => false
            ];

            array_push($opcionesSelect,$temp);
        }

        return response()->json(
            [
                'mensaje' => 'Se consultaron con éxito las Empresas con las que tiene relación el Socio',
                'data' => $opcionesSelect
            ],
            200
        );
    }

    public function obtenerSociosConPrestamos(){
        $sociosPrestamos = $this->prestamosRepository->obtenerSociosConPrestamos();
        $opcionesSelect = [];

        foreach( $sociosPrestamos as $item){
            $temp = [
                'value' => $item->id,
                'label' => $item->nombreSocio,
                'checked' => false
            ];

            array_push($opcionesSelect,$temp);
        }

        return response()->json(
            [
                'mensaje' => 'Se consultaron con éxito los Socios que tienen/tuvieron préstamos',
                'data' => $opcionesSelect
            ],
            200
        );
    }

    public function obtenerPrestamosPorSociosYStatus($datosGenerales){
        $sociosYStatus = $this->prestamosRepository->obtenerPrestamosPorSociosYStatus($datosGenerales['socios'], $datosGenerales['status']);
        return response()->json(
            [
                'mensaje' => 'Se consultaron con éxito los Socios que tienen/tuvieron préstamos',
                'data' => $sociosYStatus
            ],
            200
        );
    }

    public function registroNuevoPrestamoSocio($prestamoSocio){
        DB::beginTransaction();
            $idPrestamo = $this->prestamosRepository->registroNuevoPrestamoSocio($prestamoSocio['detallePrestamo']);

            foreach($prestamoSocio['empresas'] as $idEmpresa){
                $this->prestamosRepository->registroDetallePrestamoEmpresa($idPrestamo, $idEmpresa);
            }
        DB::commit();

        return response()->json(
            [
                'mensaje' => 'Se registró el préstamo del Socio con éxito'
            ],
            200
        );
    }
}
