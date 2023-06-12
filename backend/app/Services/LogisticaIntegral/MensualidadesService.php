<?php

namespace App\Services\LogisticaIntegral;

use App\Repositories\LogisticaIntegral\MensualidadesRepository;
use App\Repositories\LogisticaIntegral\UsuariosRepository;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class MensualidadesService
{
    protected $mensualidadesRepository;
    protected $usuariosRepository;

    public function __construct(
        MensualidadesRepository $MensualidadesRepository,
        UsuariosRepository $UsuariosRepository
    )
    {
        $this->mensualidadesRepository = $MensualidadesRepository;
        $this->usuariosRepository = $UsuariosRepository;
    }

    public function obtenerMensualidadesPagadasSelect () {
        $ultimoMes      = $this->mensualidadesRepository->obtenerMesMensualidades('ultimo');
        $recienteMes    = $this->mensualidadesRepository->obtenerMesMensualidades('reciente');

        if ( is_null($ultimoMes) ) {
            return response()->json(
                [
                    'mensaje' => 'No hay meses por mostrar',
                    'data' => [],
                    'status' => 204
                ],
                200
            );
        }

        $mesesSelect    = $this->mensualidadesRepository->obtenerMesesPosterioresAUltimoMes($ultimoMes, "'".$recienteMes."'");
        $opcionesSelect = [];

        foreach( $mesesSelect as $item){
            $temp = [
                'value' => $item->fechaBase,
                'label' => $item->mes,
                'checked' => false
            ];

            array_push($opcionesSelect, $temp);
        }

        return response()->json(
            [
                'mensaje' => 'Se consultaron las mensualidades pagadas con éxito',
                'data' => $opcionesSelect
            ],
            200
        );
    }

    public function obtenerMensualidadesPagadasEmpresaSocios($datosConsulta){
        $mensualidades = $this->mensualidadesRepository->obtenerMensualidadesPagadasEmpresaSocios($datosConsulta['socios'] ?? null, $datosConsulta['empresas'] ?? null, $datosConsulta['mensualidades']);
        return response()->json(
            [
                'mensaje' => 'Se consultaron las mensualidades pagadas con éxito',
                'data' => $mensualidades
            ],
            200
        );
    }

    public function obtenerMensualidadesPagarSelect () {
        $ultimoMesSociosEmpresas = $this->mensualidadesRepository->obtenerUltimoMesSociosEmpresas();
        $mesesPosteriores        = $this->mensualidadesRepository->obtenerMesesPosterioresAUltimoMes( $ultimoMesSociosEmpresas );
        $mesInicioSelect         = null;

        foreach ( $mesesPosteriores as $item ) {
            $sociosEmpresasHastaFecha = $this->mensualidadesRepository->obtenerSociosEmpresasHastaFecha( $item->fechaBase );
            foreach ( $sociosEmpresasHastaFecha as $enlace ) {
                $conteo = $this->mensualidadesRepository->verificarPagoMensualidad( $enlace['fkSocio'], $enlace['fkEmpresa'], $item->fechaBase );
                if ( $conteo == 0 ) {
                    $mesInicioSelect = $item->fechaBase;
                    break;
                }
            }
            if ( !is_null($mesInicioSelect) ) {
                break;
            }
        }

        $mensualidadesSelect = $this->mensualidadesRepository->obtenerMesesPosterioresAUltimoMes( $mesInicioSelect );

        return response()->json(
            [
                'mensaje' => 'Se consultaron las mensualidades por pagar con éxito',
                'data' => $mensualidadesSelect
            ],
            200
        );
    }

    public function obtenerMensualidadesPagarPorMensualidad ( $mensualidad ) {
        $fechaBase                  = $mensualidad['mensualidad'];
        $sociosEmpresasHastaFecha   = $this->mensualidadesRepository->obtenerSociosEmpresasHastaFecha ( $fechaBase );
        $socios                     = array();
        $empresas                   = array();

        foreach ( $sociosEmpresasHastaFecha as $enlace ) {
            $conteo = $this->mensualidadesRepository->verificarPagoMensualidad( $enlace['fkSocio'], $enlace['fkEmpresa'], $fechaBase );
            if ( $conteo == 0 ) {
                array_push($socios, $enlace['fkSocio']);
                array_push($empresas, $enlace['fkEmpresa']);
            }
        }

        if (count($socios) == 0 && count($empresas) == 0) {
            return response()->json(
                [
                    'mensaje' => 'No hay mensualidades por pagar para fecha seleccionada',
                    'status' => 204
                ],
                200
            );
        }

        $mensaulidadesPorPagar = $this->mensualidadesRepository->obtenerMensualidadesPagarPorMensualidad( $fechaBase, $socios, $empresas );

        return response()->json(
            [
                'mensaje' => 'Se consultaron las mensualidades por pagar con éxito',
                'data' => $mensaulidadesPorPagar
            ],
            200
        );
    }

    public function pagarMensualidadEmpresaSocio($dataPagar){
        DB::beginTransaction();
            $usuario = $this->usuariosRepository->obtenerInformacionUsuarioPorToken($dataPagar['token']);

            foreach($dataPagar['sociosAPagar'] as $idSocio){
                $enlacesSocioEmpresas = $this->mensualidadesRepository->obtenerEnlacesSocioEmpresas($dataPagar['fechaMensualidadPagar'],$idSocio);

                foreach($enlacesSocioEmpresas as $enlace){
                    $prestamosActivos = $this->mensualidadesRepository->obtenerPrestamosSocioActivos($idSocio);
                    $montoAPagar = $dataPagar['montoPagar'];

                    foreach($prestamosActivos as $idPrestamo){
                        $idPrestamo       = $idPrestamo->id;
                        $detallePrestamo  = $this->mensualidadesRepository->obtenerDetallePrestamoSocio($idPrestamo);
                        $validarPago      = $this->mensualidadesRepository->validarPagoPrestamoPorEmpresa($idPrestamo, $enlace->fkEmpresa);
                        $deuda            = 0;
                        $aCuenta          = 0;

                        if( $validarPago > 0 ){
                            $deuda = $detallePrestamo->deuda - $aCuenta;

                            if($deuda >= $montoAPagar){
                                $aCuenta = $detallePrestamo->aCuenta + $montoAPagar;
                                $montoAPagar = 0;
                            }else{
                                $aCuenta = $detallePrestamo->aCuenta + $deuda;
                                $montoAPagar = $montoAPagar - $deuda;
                            }

                            $this->mensualidadesRepository->actualizarEstadoDeCuenta(
                                $aCuenta,
                                ($aCuenta == $detallePrestamo->montoPrestamo ? 1 : 0 ),
                                $idPrestamo
                            );
                        }

                        if($montoAPagar == 0) {break;}
                    }

                    $mapeoDatos = [
                        'idSocio'       => $idSocio, 
                        'idEmpresa'     => $enlace->fkEmpresa, 
                        'mensualidad'   => $dataPagar['fechaMensualidadPagar'], 
                        'cantidad'      => $montoAPagar, 
                        'abonoPrestamo' => $dataPagar['montoPagar'] - $montoAPagar,
                        'fechaPago'     => $dataPagar['fechaPago'], 
                        'fkUsuarioPago' => $usuario->id
                    ];

                    $this->mensualidadesRepository->registrarPagoMensualidadEmpresaSocio($mapeoDatos);
                }
            }
        DB::commit();

        return response()->json(
            [
                'mensaje' => 'Se realizó el pago de las mensualidades a los Socios correspondientes con éxito'
            ],
            200
        );
    }
}
