<?php

namespace App\Services\LogisticaIntegral;

use App\Repositories\LogisticaIntegral\UsuariosRepository;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class UsuariosService
{
    protected $usuariosRepository;

    public function __construct(
        UsuariosRepository $UsuariosRepository
    )
    {
        $this->usuariosRepository = $UsuariosRepository;
    }

    public function obtenerInformacionUsuarioPorToken( $token ){
        return $this->usuariosRepository->obtenerInformacionUsuarioPorToken( $token['token'] );
    }

    public function validarContraseniaActual($datosCredenciales){
        $usuario = $this->usuariosRepository->obtenerInformacionUsuarioPorToken($datosCredenciales['token']);
        $validarContrasenia = $this->usuariosRepository->validarContraseniaActual($usuario[0]->id, $datosCredenciales['contraseniaActual']);
        
        if($validarContrasenia == false){
            return response()->json(
                [
                    'mensaje' => 'Para continuar debes colocar la contraseña actual correctamente',
                    'status' => 204
                ],
                200
            );
        }

        return response()->json(
            [
                'mensaje' => 'Se validó la contraseña'
            ],
            200
        );
    }

    public function modificarUsuario($datosUsuario){
        $usuario = $this->usuariosRepository->obtenerInformacionUsuarioPorToken($datosUsuario['token']);
        $validarUsuario = $this->usuariosRepository->validarCorreoExiste($datosUsuario['perfilInformacion']['correo'],$usuario[0]->id);
        
        if($validarUsuario > 0 ){
            return response()->json(
                [
                    'mensaje' => 'Upss! Al parecer ya existe un Usuario con el mismo correo. Por favor validar la información',
                    'status' => 409
                ],
                200
            );
        }

        DB::beginTransaction();
            $this->usuariosRepository->modificarUsuario(
                $datosUsuario['perfilInformacion'],
                $usuario[0]->id, 
                $datosUsuario['perfilInformacion']['cambioContraseniaPerfil']
            );
        DB::commit();

        return response()->json(
            [
                'mensaje' => 'Se modificaron los datos con éxito'
            ],
            200
        );
    }
}
