<?php

namespace App\Services\LogisticaIntegral;

use App\Repositories\LogisticaIntegral\PrestamosRepository;
use App\Repositories\LogisticaIntegral\SociosRepository;
use App\Repositories\LogisticaIntegral\UsuariosRepository;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class SociosService
{
    protected $sociosRepository;
    protected $usuariosRepository;
    protected $prestamosRepository;

    public function __construct(
        SociosRepository $SociosRepository,
        UsuariosRepository $UsuariosRepository,
        PrestamosRepository $PrestamosRepository
    )
    {
        $this->sociosRepository = $SociosRepository;
        $this->usuariosRepository = $UsuariosRepository;
        $this->prestamosRepository = $PrestamosRepository;
    }

    public function obtenerListaSocios($socios){
        $listaSocios = $this->sociosRepository->obtenerListaSocios($socios['socios']);

        return response()->json(
            [
                'mensaje' => 'Se consultaron los Socios con éxito',
                'data' => $listaSocios
            ]
        );
    }
    
    public function obtenerListaSociosPorBloque($bloque){
        $listaSocios = $this->sociosRepository->obtenerListaSociosPorBloque($bloque);

        if(count($listaSocios) == 0){
            return response()->json(
                [
                    'mensaje' => 'No se encontraron Socios para el filtro seleccionado',
                    'status' => 204
                ],
                200
            );
        }

        return response()->json(
            [
                'mensaje' => 'Se consultaron los Socios por bloque '.($bloque == 'null' ? 'sin información' : $bloque).' con éxito',
                'data' => $listaSocios
            ],
            200
        );
    }

    public function obtenerRegistrosPorBloque(){
        $registroBloque = $this->sociosRepository->obtenerRegistrosPorBloque();

        return response()->json(
            [
                'mensaje' => 'Se consultaron los conteos de Socios por bloque con éxito',
                'data' => $registroBloque
            ],
            200
        );
    }

    public function obtenerSociosGenerales(){
        $sociosGenerales = $this->sociosRepository->obtenerSociosGenerales();
        return response()->json(
            [
                'mensaje' => 'Se consultaron los Socios con éxito',
                'data' => $sociosGenerales
            ]
        );
    }

    public function obtenerOpcionesSocios(){
        $sociosGenerales = $this->sociosRepository->obtenerSociosGenerales();
        $opcionesSelect = [];

        foreach( $sociosGenerales as $item ){
            $temp = [
                'value' => $item->id,
                'label' => $item->nombreSocio,
                'checked' => false
            ];

            array_push($opcionesSelect, $temp);
        }
        
        return response()->json(
            [
                'mensaje' => 'Se consultaron los Socios con éxito',
                'data' => $opcionesSelect
            ]
        );
    }

    public function registroNuevoSocio($datosSocio){
        $validarSocio = $this->sociosRepository->validarSocioExistente($datosSocio['socio']);

        if( $validarSocio > 0 ){
            return response()->json(
                [
                    'mensaje' => 'Upss! Al parecer ya existe un Socio con el mismo (Nombre, CURP o RFC). Por favor validar la información',
                    'status' => 409
                ],
                200
            );
        }

        DB::beginTransaction();
            $usuario = $this->usuariosRepository->obtenerInformacionUsuarioPorToken($datosSocio['token']);
            $this->sociosRepository->registroNuevoSocio($datosSocio['socio'], $usuario[0]->id);
        DB::commit();

        return response()->json(
            [
                'mensaje' => 'Se registró el nuevo Socio con éxito'      
            ],
            200
        );
    }

    public function obtenerSociosEmpresas($datosSociosEmpresas){
        $socio    = $datosSociosEmpresas['socios'] ?? null;
        $empresas = $datosSociosEmpresas['empresas'] ?? null;

        if (isset($datosSociosEmpresas['datosPrestamo']) && $datosSociosEmpresas['datosPrestamo']) {
            $idDetalle = $datosSociosEmpresas['socios'][0];
            $socio    = $this->sociosRepository->obtenerSocioPorIdPrestamo($idDetalle);
            $empresas = $this->sociosRepository->obtenerEmpresasPorIdPrestamo($idDetalle);
        }

        $sociosEmpresas = $this->sociosRepository->obtenerSociosEmpresas($socio, $empresas);

        foreach ( $sociosEmpresas as $empresa ) {
            $validaCambioIngreso = (!is_null($empresa->mesIngreso) && $empresa->mesIngreso != '' && $empresa->mesIngreso != '0000-00-00');
            $empresa->mesIngreso = $validaCambioIngreso ?
                                   Carbon::parse($empresa->mesIngreso)
                                         ->locale('es')
                                         ->isoFormat('MMMM YYYY') :
                                   null;

            $validaCambioSalida = (!is_null($empresa->mesSalida) && $empresa->mesSalida != '' && $empresa->mesSalida != '0000-00-00');
            $empresa->mesSalida = $validaCambioSalida ?
                                  Carbon::parse($empresa->mesSalida)
                                        ->locale('es')
                                        ->isoFormat('MMMM YYYY') :
                                  null;
        }

        return response()->json(
            [
                'mensaje' => 'Se consultarón los enlaces Socios-Empresas con éxito',
                'data' => $sociosEmpresas
            ]
        );
    }

    public function generarEnlaceSocioEmpresa($datosSocioEmpresa){
        $token = $datosSocioEmpresa['token'];
        $datosSocioEmpresa = $datosSocioEmpresa['enlace'];

        $enlaceExistente = $this->sociosRepository->validarEnlaceExistente($datosSocioEmpresa['fkSocio'], $datosSocioEmpresa['fkEmpresa']);

        if($enlaceExistente > 0){
            return response()->json(
                [
                    'mensaje' => 'Upss! Al parecer ya existe un enlace de este Socio con la misma empresa. Por favor validar la información',
                    'status' => 409
                ],
                200
            );
        }

        DB::beginTransaction();
            $usuario = $this->usuariosRepository->obtenerInformacionUsuarioPorToken($token);
            $this->sociosRepository->registrarNuevoEnlaceSocioEmpresa($datosSocioEmpresa, $usuario[0]->id);
        DB::commit();

        return response()->json(
            [
                'mensaje' => 'Se registró el nuevo enlace con éxito'      
            ],
            200
        );
    }

    public function obtenerDetalleSocioPorId($idSocio){
        $detalleSocio = $this->sociosRepository->obtenerDetalleSocioPorId($idSocio);
        return response()->json(
            [
                'mensaje' => 'Se consultó el detalle de Socio con éxito',
                'data' => $detalleSocio
            ]
        );
    }

    public function obtenerDetalleSocioEspecial($idSocio){
        $detalleSocio = $this->sociosRepository->obtenerDetalleSocioPorId($idSocio);

        $estadosCiviles = [
            'Solter@',
            'Casad@',
            'Divorciad@',
            'Separación en proceso judicial',
            'Viud@',
            'Concubinato'
        ];

        $data = [
            [
                'dato' => 'Nombre Socio',
                'valor' => $detalleSocio[0]->nombreSocio
            ], [
                'dato' => 'Status Socio',
                'valor' => $detalleSocio[0]->status == 1 ? 'Activo' : 'Inactivo'
            ], [
                'dato' => 'Fecha de nacimiento',
                'valor' => Carbon::parse($detalleSocio[0]->fechaNacimiento)->format('d-m-Y')
            ], [
                'dato' => 'CURP',
                'valor' => $detalleSocio[0]->curpSocio
            ], [
                'dato' => 'RFC',
                'valor' => $detalleSocio[0]->rfcSocio
            ], [
                'dato' => 'Edad',
                'valor' => Carbon::parse($detalleSocio[0]->fechaNacimiento)->age
            ], [
                'dato' => 'Estado Civil',
                'valor' => $estadosCiviles[$detalleSocio[0]->estadoCivilSocio-1]
            ], [
                'dato' => 'Lugar de nacimiento',
                'valor' => $detalleSocio[0]->lugarNacimiento
            ], [
                'dato' => 'Ocupación',
                'valor' => $detalleSocio[0]->ocupacion
            ], [
                'dato' => 'Dirección',
                'valor' => $detalleSocio[0]->direccion
            ], [
                'dato' => 'Colonia',
                'valor' => $detalleSocio[0]->colonia
            ], [
                'dato' => 'CP',
                'valor' => $detalleSocio[0]->cp
            ], [
                'dato' => 'Localidad',
                'valor' => $detalleSocio[0]->localidad
            ], [
                'dato' => 'Teléfono',
                'valor' => $detalleSocio[0]->telefono
            ], [
                'dato' => 'Estado',
                'valor' => $detalleSocio[0]->estado
            ]
        ];

        return response()->json(
            [
                'mensaje' => 'Se consultó el detalle de Socio con éxito',
                'data' => $data
            ]
        );
    }

    public function obtenerDetalleEnlaceSocioEmpresa($idEnlace){
        $detalleEnlaceSocioEmpresa = $this->sociosRepository->obtenerDetalleEnlaceSocioEmpresa($idEnlace);
        return response()->json(
            [
                'mensaje' => 'Se consultó el detalle del enlace Socio-Empresa con éxito',
                'data' =>  $detalleEnlaceSocioEmpresa
            ]
        );
    }

    public function obtenerSociosMensualidadesSelect(){
        $mensualidadesSelect = $this->sociosRepository->obtenerSociosMensualidadesSelect();
        $opcionesSelect = [];

        foreach( $mensualidadesSelect as $item){
            $temp = [
                'value' => $item->id,
                'label' => $item->nombreSocio,
                'checked' => false
            ];

            array_push($opcionesSelect,$temp);
        }

        return response()->json(
            [
                'mensaje' => 'Se consultaron las Mensualidades con éxito',
                'data' => $opcionesSelect
            ]
        );
    }

    public function modificarSocio ( $datosSocio ) {
        $validarSocio = $this->sociosRepository->validarSocioExistente($datosSocio['socioModificado'], $datosSocio['idSocio']);

        if( $validarSocio > 0 ){
            return response()->json(
                [
                    'mensaje' => 'Upss! Al parecer ya existe un Socio con el mismo (Nombre, CURP o RFC). Por favor validar la información',
                    'status' => 409
                ],
                200
            );
        }

        DB::beginTransaction();
            $usuario = $this->usuariosRepository->obtenerInformacionUsuarioPorToken($datosSocio['token']);
            $this->sociosRepository->modificarSocio($datosSocio['socioModificado'], $datosSocio['idSocio'], $usuario[0]->id);
        DB::commit();

        return response()->json(
            [
                'mensaje' => 'Se modificó el Socio con éxito'
            ],
            200
        );
    }

    public function obtenerDetalleSocioEmpresaPorId($idSocioEmpresa){
        $detalleSocioEmpresa = $this->sociosRepository->obtenerDetalleSocioEmpresaPorId($idSocioEmpresa);
        return response()->json(
            [
                'mensaje' => 'Se consultó el detalle del enlace Socio-Empresa con éxito',
                'data' =>  $detalleSocioEmpresa
            ]
        );
    }

    public function modificarEnlaceSocioEmpresa ( $datosSocioEmpresa ) {
        $token    = $datosSocioEmpresa['token'];
        $idEnlace = $datosSocioEmpresa['idEnlace'];
        $datosSocioEmpresa = $datosSocioEmpresa['enlace'];

        $enlaceExistente = $this->sociosRepository->validarEnlaceExistente($datosSocioEmpresa['fkSocio'], $datosSocioEmpresa['fkEmpresa'], $idEnlace);

        if($enlaceExistente > 0){
            return response()->json(
                [
                    'mensaje' => 'Upss! Al parecer ya existe un enlace de este Socio con la misma empresa. Por favor validar la información',
                    'status' => 409
                ],
                200
            );
        }

        DB::beginTransaction();
            $usuario = $this->usuariosRepository->obtenerInformacionUsuarioPorToken($token);
            $this->sociosRepository->modificarEnlaceSocioEmpresa($datosSocioEmpresa, $idEnlace);
        DB::commit();

        return response()->json(
            [
                'mensaje' => 'Se actualizó el enlace con éxito'
            ],
            200
        );
    }
}
