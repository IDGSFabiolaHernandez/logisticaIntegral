<?php

namespace App\Services\LogisticaIntegral;

use App\Repositories\LogisticaIntegral\EmpresasRepository;
use App\Repositories\LogisticaIntegral\UsuariosRepository;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class EmpresasService
{
    protected $empresasRepository;
    protected $usuariosRepository;
    
    public function __construct(
        EmpresasRepository $EmpresasRepository,
        UsuariosRepository $UsuariosRepository
    )
    {
        $this->empresasRepository = $EmpresasRepository;
        $this->usuariosRepository = $UsuariosRepository;
    }

    public function obtenerEmpresasGenerales(){
        $listaEmpresas = $this->empresasRepository->obtenerEmpresasGenerales();
        return response()->json(
            [
                'mensaje' => 'Se consultaron las Empresas con éxito',
                'data' => $listaEmpresas
            ]
        );
    }

    public function obtenerEmpresasSelect(){
        $empresasGenerales = $this->empresasRepository->obtenerEmpresasGenerales();
        $opcionesSelect = [];

        foreach( $empresasGenerales as $item ){
            $temp = [
                'value' => $item->id,
                'label' => $item->nombre,
                'checked' => false
            ];

            array_push($opcionesSelect, $temp);
        }
        
        return response()->json(
            [
                'mensaje' => 'Se consultaron las Empresas con éxito',
                'data' => $opcionesSelect
            ]
        );
    }

    public function obtenerEmpresasMensualidadesSelect(){
        $empresasSelect = $this->empresasRepository->obtenerEmpresasMensualidadesSelect();
        $opcionesSelect = [];

        foreach($empresasSelect as $item){
            $temp = [
                'value' => $item->id,
                'label' => $item->nombre,
                'checked' => false
            ];

            array_push($opcionesSelect,$temp);
        }

        return response()->json(
            [
                'mensaje' => 'Se consultaron las Empresas con éxito',
                'data' => $opcionesSelect
            ]
        );
    }

    public function registrarEmpresa ( $datos ) {
        $validarEmpresa = $this->empresasRepository->validarEmpresaExistente( $datos['empresa'] );

        if( $validarEmpresa > 0 ){
            return response()->json(
                [
                    'mensaje' => 'Upss! Al parecer ya existe una Empresa con el mismo nombre. Por favor validar la información',
                    'status' => 409
                ],
                200
            );
        }

        DB::beginTransaction();
            $usuario = $this->usuariosRepository->obtenerInformacionUsuarioPorToken($datos['token']);
            $this->empresasRepository->registrarEmpresa($datos['empresa'], $usuario[0]->id);
        DB::commit();

        return response()->json(
            [
                'mensaje' => 'Se registró le nueva Empresa con éxito'
            ],
            200
        );
    }
}
