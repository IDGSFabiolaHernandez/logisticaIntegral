<?php

namespace App\Repositories\Auth;

use App\Models\TblSesiones;
use App\Models\TblUsuarios;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;

class LoginRepository
{
    public function validarExistenciaUsuario ( $correo, $password ) {
        $temporal = TblUsuarios::select(
                                   'id',
                                   'password'
                               )
                               ->where('correo', $correo)
                               ->first();

        return $temporal && password_verify($password, $temporal->password) ? $temporal->id : null;
    }

    public function validarUsuarioActivo( $pkUsuario ){
        $usuario = TblUsuarios::where([
                                 ['id',$pkUsuario],
                                 ['activo',1]
                              ]);

        return $usuario->count() > 0;
    }

    public function depurarSesionPorPK ( $pkUsuario ) {
        TblSesiones::where('FkTblUsuario', $pkUsuario)
                   ->delete();
    }

    public function crearSesionYAsignarToken ( $pkUsuario ){
        $registro = new TblSesiones();
        $registro->FkTblUsuario = $pkUsuario;
        $registro->Token        = bcrypt(Str::random(50));
        $registro->save();
        
        return $registro->Token;
    }

    public function auth( $token ){
        $sesiones = TblSesiones::where('Token', $token)->count();
        return $sesiones > 0 ? 'true' : 'false';
    }

    public function logout( $token ){
        $sesion = TblSesiones::where('Token', $token);
        
        $sesion->delete();
    }
}