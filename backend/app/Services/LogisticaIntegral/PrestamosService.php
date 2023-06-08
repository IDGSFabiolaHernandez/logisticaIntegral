<?php

namespace App\Services\LogisticaIntegral;

use App\Repositories\LogisticaIntegral\PrestamosRepository;

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
            ]
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
            ]
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
            ]
        );
    }

    public function obtenerPrestamosPorSociosYStatus($datosGenerales){
        $sociosYStatus = $this->prestamosRepository->obtenerPrestamosPorSociosYStatus($datosGenerales['socios'], $datosGenerales['status']);
        return response()->json(
            [
                'mensaje' => 'Se consultaron con éxito los Socios que tienen/tuvieron préstamos',
                'data' => $sociosYStatus
            ]
        );
    }
}
