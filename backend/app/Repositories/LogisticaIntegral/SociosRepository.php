<?php

namespace App\Repositories\LogisticaIntegral;

use App\Models\TblSocios;
use App\Models\TblSociosEmpresas;
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
        $fechaInicio = Carbon::parse($datosSocios['fechaInicio']) ?? null;
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
        $registro->fechaFin               = $fechaInicio->addyears(4) ?? null;
        $registro->status                 = $datosSocios['status'];
        //$registro->fkUsuarioAlta          = $datosSocios[''];
        $registro->fechaAltaRegistro      = Carbon::now();
        $registro->save();
    }

    public function validarSocioExistente($datosSocios){
        $validarSocio = TblSocios::orWhere(function ($query) use ($datosSocios) {
                                       $query->where('nombreSocio', $datosSocios['nombreSocio'])
                                             ->orWhere('curpSocio', $datosSocios['curpSocio'])
                                             ->orWhere('rfcSocio', $datosSocios['rfcSocio']);
                                   });

        return $validarSocio->count();
    }

    public function obtenerSociosEmpresas($socios, $empresas){
        $sociosEmpresasAmbos = TblSociosEmpresas::select(
                                                    'tblSocios.nombreSocio',
                                                    'tblSocios.status as activoSocio',
                                                    'empresas.nombre as nombreEmpresa',
                                                    'empresas.status',
                                                    'tblSociosEmpresas.id',
                                                    'tblSociosEmpresas.fkSocio',
                                                    'tblSociosEmpresas.fkEmpresa',
                                                    'tblSociosEmpresas.tipoInstrumento',
                                                    'tblSociosEmpresas.numeroInstrumento',
                                                    'tblSociosEmpresas.observaciones'
                                                )
                                                ->selectRaw("DATE_FORMAT( tblSociosEmpresas.mesIngreso, '%M %Y' ) AS mesIngreso")
                                                ->selectRaw("DATE_FORMAT( tblSociosEmpresas.mesSalida, '%M %Y' ) AS mesSalida")
                                                ->join('tblSocios', 'tblSocios.id', 'tblSociosEmpresas.fkSocio')
                                                ->join('empresas', 'empresas.id', 'tblSociosEmpresas.fkEmpresa')
                                                ->orderBy('nombreSocio','asc');
                                                
        if( is_null($empresas) ){
            $sociosEmpresasAmbos->whereIn('fkSocio', $socios);
        } else if(is_null($socios)){
            $sociosEmpresasAmbos->whereIn('fkEmpresa', $empresas);
        } else {
            $sociosEmpresasAmbos->whereIn('fkSocio', $socios)
                                ->whereIn('fkEmpresa', $empresas);
        }

        return $sociosEmpresasAmbos->get();
    }

    public function validarEnlaceExistente($fkSocio, $fkEmpresa){
        $enlaceExistente = TblSociosEmpresas::where([
                                                ['fkSocio',$fkSocio],
                                                ['fkEmpresa',$fkEmpresa]
                                            ]);
        return $enlaceExistente->count();                                  
    }

    public function registrarNuevoEnlaceSocioEmpresa($datosSociosEmpresas){
        $registro = new TblSociosEmpresas();
        $registro->fkSocio           = $datosSociosEmpresas['fkSocio,'];
        $registro->fkEmpresa         = $datosSociosEmpresas['fkEmpresa,'];
        $registro->mesIngreso        = $datosSociosEmpresas['mesIngreso,'];
        $registro->tipoInstrumento   = $datosSociosEmpresas['tipoInstrumento,'];
        $registro->numeroInstrumento = $datosSociosEmpresas['numeroInstrumento,'];
        $registro->observaciones     = $datosSociosEmpresas['observaciones,'];
        //$registro->fkUsuarioAlta     = $datosSociosEmpresas['fkUsuarioAlta,'];
        $registro->fechaAlta         = Carbon::now();
        $registro->save();
    }

    public function obtenerDetalldeSocio($idSocio){
        $detalleSocio = TblSocios::where('id',$idSocio);

        return $detalleSocio->get();
    }

    public function obtenerDetalleEnlaceSocioEmpresa($idEnlace){
        $detalleEnlaceSocioEmpresa = TblSociosEmpresas::where('id',$idEnlace);

        return $detalleEnlaceSocioEmpresa->get();
    }
}