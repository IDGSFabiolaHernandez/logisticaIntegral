<?php

namespace App\Services\LogisticaIntegral;

use App\Repositories\LogisticaIntegral\PrestamosRepository;
use App\Repositories\LogisticaIntegral\UsuariosRepository;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PrestamosService
{
    protected $prestamosRepository;
    protected $usuariosRepository;

    public function __construct(
        PrestamosRepository $PrestamosRepository,
        UsuariosRepository $UsuariosRepository
    )
    {
        $this->prestamosRepository = $PrestamosRepository;
        $this->usuariosRepository = $UsuariosRepository;
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
            $usuario    = $this->usuariosRepository->obtenerInformacionUsuarioPorToken($prestamoSocio['token']);
            $idPrestamo = $this->prestamosRepository->registroNuevoPrestamoSocio($prestamoSocio['detallePrestamo'], $usuario[0]->id);

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

    public function obtenerAbonosPrestamo($idPrestamo){
        $detallePrestamo = $this->prestamosRepository->obtenerAbonosPrestamo($idPrestamo);
        return response()->json(
            [
                'mensaje' => 'Se consultaron los Abonos del préstamo con éxito ',
                'data' => $detallePrestamo
            ],
            200
        );
    }
}
