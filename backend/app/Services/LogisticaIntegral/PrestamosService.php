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
                'mensaje' => 'Se consultó la relación de Socios con Empresas con éxito',
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
                'mensaje' => 'Se consultaron las Empresas por Socio con éxito',
                'data' => $opcionesSelect
            ]
        );
    }

    public function obtenerSociosConPrestamos(){
        $sociosPrestamos = $this->prestamosRepository->obtenerSociosConPrestamos();
        return response()->json(
            [
                'mensaje' => 'Se consultaron los Socios y Prestamos con éxito',
                'data' => $sociosPrestamos
            ]
        );
    }

    public function obtenerPrestamosPorSociosYStatus($datosGenerales){
        $sociosYStatus = $this->prestamosRepository->obtenerPrestamosPorSociosYStatus($datosGenerales['socios'],$datosGenerales['status']);
        return response()->json(
            [
                'mensaje' => 'Se consultaron los Préstamos y Status por Socio con éxito',
                'data' => $sociosYStatus
            ]
        );
    }
}
