<?php

namespace App\Repositories\LogisticaIntegral;

use App\Models\TblSesiones;
use App\Models\TblUsuarios;
use Illuminate\Support\Facades\Log;

class UsuariosRepository
{
    public function obtenerInformacionUsuarioPorToken( $token ){
        $usuario = TblSesiones::select('usuarios.*', 'perfil.Perfil')
                              ->join('usuarios', 'usuarios.id', 'tblSesiones.FkTblUsuario')
                              ->join('perfil', 'perfil.id', 'usuarios.IdPerfil')
							  ->where('tblSesiones.Token', '=', $token);

        return $usuario->get();
    }

    public function validarCorreoExiste($correo, $idUsuario){
        $validarCorreo = TblUsuarios::where([
                                            ['correo',$correo],
                                            ['id','!=', $idUsuario]
                                        ]);
        return $validarCorreo->count();
    }

    public function modificarUsuario($datosUsuario, $idUsuario, $cambioPass){
        $actualizar = [
            'nombre'   =>  $this->trimValidator($datosUsuario['nombreUsuario']),
            'correo'   =>  $this->trimValidator($datosUsuario['correo'])
        ];

        if($cambioPass){
            $actualizar['password'] = bcrypt($this->trimValidator($datosUsuario['contraseniaNueva']));
        }
        
        TblUsuarios::where('id',$idUsuario)->update($actualizar);
    }

    public function validarContraseniaActual($idUsuario, $password){
        $temporal = TblUsuarios::select(
                                    'password'
                                )
                                ->where('id', $idUsuario)
                                ->first();

        return password_verify($password, $temporal->password);
    }

    public function trimValidator ( $value ) {
		return $value != null && trim($value) != '' ? trim($value) : null;
	}
}