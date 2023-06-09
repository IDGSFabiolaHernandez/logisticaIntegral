<?php

namespace App\Repositories\LogisticaIntegral;

use App\Models\TblMensualidadesSocios;
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
                                    'tblSocios.curpSocio',
                                    'tblSocios.rfcSocio',
                                    'tblIntermediariosSocios.nombreIntermediario',
                                )
                                ->selectRaw("
                                    case
                                        when tblSocios.status = 1 then 'Activo'
                                        else 'Inactivo'
                                    end as status
                                ")
                                ->selectRaw('COALESCE(ne.numEmpresas, 0) as numEmpresas')
                                ->join('tblIntermediariosSocios', 'tblIntermediariosSocios.id', 'tblSocios.fkIntermediario')
                                ->leftJoin(DB::raw('(SELECT fkSocio, COUNT(*) as numEmpresas FROM tblSociosEmpresas GROUP BY fkSocio) ne'), 'ne.fkSocio', '=', 'tblSocios.id')
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
        $registro->nombreSocio            = $this->trimValidator($datosSocios['nombreSocio']);
        $registro->curpSocio              = $this->trimValidator($datosSocios['curpSocio']);
        $registro->rfcSocio               = $this->trimValidator($datosSocios['rfcSocio']);
        $registro->estadoCivilSocio       = $this->trimValidator($datosSocios['estadoCivilSocio']);
        $registro->lugarNacimiento        = $this->trimValidator($datosSocios['lugarNacimiento']);
        $registro->ocupacion              = $this->trimValidator($datosSocios['ocupacion']);
        $registro->direccion              = $this->trimValidator($datosSocios['direccion']);
        $registro->colonia                = $this->trimValidator($datosSocios['colonia']);
        $registro->cp                     = $this->trimValidator($datosSocios['cp']);
        $registro->localidad              = $this->trimValidator($datosSocios['localidad']);
        $registro->estado                 = $this->trimValidator($datosSocios['estado']);
        $registro->telefono               = $this->trimValidator($datosSocios['telefono']);
        $registro->fkIntermediario        = $this->trimValidator($datosSocios['fkIntermediario']);
        $registro->observaciones          = $this->trimValidator($datosSocios['observaciones']);
        $registro->tipoIdentificacion     = $this->trimValidator($datosSocios['tipoIdentificacion']);
        $registro->numeroIdentificacion   = $this->trimValidator($datosSocios['numeroIdentificacion']);
        $registro->vigencia               = $this->trimValidator($datosSocios['vigencia']);
        $registro->fechaNacimiento        = Carbon::parse($datosSocios['fechaNacimiento']);
        $registro->fiel                   = $this->trimValidator($datosSocios['fiel']);
        $registro->fechaInicio            = $fechaInicio;
        $registro->fechaFin               = $fechaInicio->addyears(4) ?? null;
        $registro->status                 = $this->trimValidator($datosSocios['status']);
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
                                                    'empresas.nombre as nombreEmpresa',
                                                    'tblSociosEmpresas.id',
                                                    'tblSociosEmpresas.fkSocio',
                                                    'tblSociosEmpresas.fkEmpresa',
                                                    'tblSociosEmpresas.numeroInstrumento',
                                                    'tblSociosEmpresas.observaciones'
                                                )
                                                ->selectRaw("
                                                    case
                                                        when tblSocios.status = 1 then 'Activo'
                                                        else 'Inactivo'
                                                    end as activoSocio
                                                ")
                                                ->selectRaw("
                                                    case
                                                        when tblSociosEmpresas.tipoInstrumento = 1 then 'Acta Constitutiva'
                                                        when tblSociosEmpresas.tipoInstrumento = 2 then 'Acta Asamblea Extraordinaria'
                                                        when tblSociosEmpresas.tipoInstrumento = 3 then 'Poder'
                                                    end as tipoInstrumento
                                                ")
                                                ->selectRaw("
                                                    case
                                                        when empresas.status = 1 then 'Activa'
                                                        when empresas.status = 2 then 'X suspender'
                                                        when empresas.status = 3 then 'En proceso'
                                                        when empresas.status = 4 then 'Suspendida'
                                                        when empresas.status = 5 then 'Maquila cliente'
                                                        when empresas.status = 6 then 'Cuenta bancaria'
                                                    end as status
                                                ")
                                                ->selectRaw("DATE_FORMAT( tblSociosEmpresas.mesIngreso, '%M %Y' ) as mesIngreso")
                                                ->selectRaw("DATE_FORMAT( tblSociosEmpresas.mesSalida, '%M %Y' ) as mesSalida")
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
        $registro->fkSocio           = $this->trimValidator($datosSociosEmpresas['fkSocio']);
        $registro->fkEmpresa         = $this->trimValidator($datosSociosEmpresas['fkEmpresa']);
        $registro->mesIngreso        = Carbon::parse($datosSociosEmpresas['mesIngreso']);
        $registro->tipoInstrumento   = $this->trimValidator($datosSociosEmpresas['tipoInstrumento']);
        $registro->numeroInstrumento = $this->trimValidator($datosSociosEmpresas['numeroInstrumento']);
        $registro->observaciones     = $this->trimValidator($datosSociosEmpresas['observaciones']);
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

    public function obtenerSociosMensualidadesSelect(){
        $mensualidadesSelect = TblMensualidadesSocios::select(
                                                            'tblSocios.id',
                                                            'tblSocios.nombreSocio'
                                                       )
                                                     ->distinct()
                                                     ->join('tblSocios','tblSocios.id','mensualidadesSocios.idSocio')
                                                     ->orderBy('tblSocios.nombreSocio','asc');
        return $mensualidadesSelect->get();
    }

    public function obtenerDetalleSocioEmpresas($id){
        $detalleSocioEmpresa = TblSociosEmpresas::select('empresas.*')
                                                ->join('empresas','empresas.id','tblSociosEmpresas.fkEmpresa')
                                                ->where('tblSociosEmpresas.fkSocio',$id);
        return $detalleSocioEmpresa->get();                                                
    }

    public function trimValidator ( $value ) {
		return $value != null && trim($value) != '' ? trim($value) : null;
	}
}