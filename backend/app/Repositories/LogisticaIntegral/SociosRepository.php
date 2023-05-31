<?php

namespace App\Repositories\LogisticaIntegral;

use App\Models\TblSocios;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class SociosRepository
{
    public function obtenerListaSocios($socios){
        $listaSocios = TblSocios::select(
                                    'tblSocios.id',
                                    'tblSocios.nombreSocio',
                                    'tblSocios.status',
                                    'tblSocios.curpSocio',
                                    'tblSocios.rfcSocio',
                                    'tblIntermediariosSocios.nombreIntermediario',
                                )
                                ->selectRaw('COALESCE(ne.numEmpresas, 0) AS numEmpresas')
                                ->join('tblIntermediariosSocios', 'tblIntermediariosSocios.id', 'tblSocios.fkIntermediario')
                                ->leftJoin(DB::raw('(SELECT fkSocio, COUNT(*) AS numEmpresas FROM tblSociosEmpresas GROUP BY fkSocio) ne'), 'ne.fkSocio', '=', 'tblSocios.id')
                                ->whereIn('tblSocios.id', $socios);

        return $listaSocios->get();
    }

    public function obtenerSociosGenerales(){
        $sociosGenerales = TblSocios::orderBy('nombreSocio','asc');
                                     
        return $sociosGenerales->get();
    }

    public function registroNuevoSocio($datosSocios){
        $fechaInicio = Carbon::parse($datosSocios['fechaInicio']);
        $registro = new TblSocios();
        $registro->nombreSocio            = $datosSocios['nombreSocio'];
        $registro->curpSocio              = $datosSocios['curpSocio'];
        $registro->rfcSocio               = $datosSocios['rfcSocio'];
        $registro->estadoCivilSocio       = $datosSocios['estadoCivilSocio'];
        $registro->lugarNacimiento        = $datosSocios['lugarNacimiento'];
        $registro->ocupacion              = $datosSocios['ocupacion'];
        $registro->direccion              = $datosSocios['direccion'];
        $registro->colonia                = $datosSocios['colonia'];
        $registro->cp                     = $datosSocios['cp'];
        $registro->localidad              = $datosSocios['localidad'];
        $registro->estado                 = $datosSocios['estado'];
        $registro->telefono               = $datosSocios['telefono'];
        $registro->fkIntermediario        = $datosSocios['fkIntermediario'];
        $registro->observaciones          = $datosSocios['observaciones'];
        $registro->tipoIdentificacion     = $datosSocios['tipoIdentificacion'];
        $registro->numeroIdentificacion   = $datosSocios['numeroIdentificacion'];
        $registro->vigencia               = $datosSocios['vigencia'];
        $registro->fechaNacimiento        = $datosSocios['fechaNacimiento'];
        $registro->fiel                   = $datosSocios['fiel'];
        $registro->fechaInicio            = $fechaInicio;
        $registro->fechaFin               = $fechaInicio->addyears(4);
        $registro->status                 = $datosSocios['status'];
        //$registro->fkUsuarioAlta          = $datosSocios[''];
        $registro->fechaAltaRegistro      = Carbon::now();
        $registro->save();
    }

    public function validarSocioExistente($datosSocios){
        $validarSocio = TblSocios::where([
                                    ['nombreSocio',$datosSocios['nombreSocio']],
                                    ['curpSocio',$datosSocios['curpSocio']],
                                    ['rfcSocio',$datosSocios['rfcSocio']]
                                ]);

        return $validarSocio->coutn();
    }
}