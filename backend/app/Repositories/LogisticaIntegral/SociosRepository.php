<?php

namespace App\Repositories\LogisticaIntegral;

use App\Models\TblMensualidadesSocios;
use App\Models\TblPrestamosEmpresas;
use App\Models\TblPrestamosSocios;
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

    public function registroNuevoSocio($datosSocio, $idUsuario){
        $fechaInicioCambio = ($datosSocio['fechaInicio'] != null && $datosSocio['fechaInicio'] != '');

        $registro = new TblSocios();
        $registro->nombreSocio            = $this->trimValidator($datosSocio['nombreSocio']);
        $registro->curpSocio              = $this->trimValidator($datosSocio['curpSocio']);
        $registro->rfcSocio               = $this->trimValidator($datosSocio['rfcSocio']);
        $registro->estadoCivilSocio       = $this->trimValidator($datosSocio['estadoCivilSocio']);
        $registro->lugarNacimiento        = $this->trimValidator($datosSocio['lugarNacimiento']);
        $registro->ocupacion              = $this->trimValidator($datosSocio['ocupacion']);
        $registro->direccion              = $this->trimValidator($datosSocio['direccion']);
        $registro->colonia                = $this->trimValidator($datosSocio['colonia']);
        $registro->cp                     = $this->trimValidator($datosSocio['cp']);
        $registro->localidad              = $this->trimValidator($datosSocio['localidad']);
        $registro->estado                 = $this->trimValidator($datosSocio['estado']);
        $registro->telefono               = $this->trimValidator($datosSocio['telefono']);
        $registro->fkIntermediario        = $this->trimValidator($datosSocio['fkIntermediario']);
        $registro->observaciones          = $this->trimValidator($datosSocio['observaciones']);
        $registro->tipoIdentificacion     = $this->trimValidator($datosSocio['tipoIdentificacion']);
        $registro->numeroIdentificacion   = $this->trimValidator($datosSocio['numeroIdentificacion']);
        $registro->vigencia               = $this->trimValidator($datosSocio['vigencia']);
        $registro->fechaNacimiento        = Carbon::parse($datosSocio['fechaNacimiento']);
        $registro->fiel                   = $this->trimValidator($datosSocio['fiel']);
        $registro->fechaInicio            = $fechaInicioCambio ? Carbon::parse($datosSocio['fechaInicio']) : null;
        $registro->fechaFin               = $fechaInicioCambio ? Carbon::parse($datosSocio['fechaInicio'])->addYears(4) : null;
        $registro->status                 = $this->trimValidator($datosSocio['status']);
        $registro->fkUsuarioAlta          = $idUsuario;
        $registro->fechaAltaRegistro      = Carbon::now();
        $registro->save();
    }

    public function validarSocioExistente($datosSocio, $idSocio = 0){
        $validarSocio = TblSocios::where(function ($query) use ($datosSocio) {
                                     $query->where('nombreSocio', $datosSocio['nombreSocio'])
                                           ->orWhere('curpSocio', $datosSocio['curpSocio'])
                                           ->orWhere('rfcSocio', $datosSocio['rfcSocio']);
                                 })
                                 ->where('id', '!=', $idSocio);

        return $validarSocio->count();
    }

    public function obtenerSocioPorIdPrestamo ( $idPrestamo ) {
        $socio = TblPrestamosSocios::select('tblSocios.id')
                                   ->join('tblSocios', 'tblSocios.id', 'prestamosSocios.idSocio')
                                   ->where('prestamosSocios.id', $idPrestamo);

        $socio = json_decode($socio->get()[0]);
        return array_values((array) $socio);
    }

    public function obtenerEmpresasPorIdPrestamo($idPrestamo) {
        $empresas = TblPrestamosEmpresas::select('fkEmpresa')
                                        ->where('fkPrestamo', $idPrestamo)
                                        ->get()
                                        ->pluck('fkEmpresa')
                                        ->toArray();

        return $empresas;
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

    public function validarEnlaceExistente($fkSocio, $fkEmpresa, $idEnlace = 0){
        $enlaceExistente = TblSociosEmpresas::where([
                                                ['fkSocio',$fkSocio],
                                                ['fkEmpresa',$fkEmpresa],
                                                ['id', '!=', $idEnlace]
                                            ]);
        return $enlaceExistente->count();
    }

    public function registrarNuevoEnlaceSocioEmpresa($datosSocioEmpresa, $idUsuario){
        $mesIngreso = $datosSocioEmpresa['mesIngreso'] != null && $datosSocioEmpresa['mesIngreso'] != '' ? Carbon::parse($datosSocioEmpresa['mesIngreso']) : null;
        $registro = new TblSociosEmpresas();
        $registro->fkSocio           = $this->trimValidator($datosSocioEmpresa['fkSocio']);
        $registro->fkEmpresa         = $this->trimValidator($datosSocioEmpresa['fkEmpresa']);
        $registro->mesIngreso        = $mesIngreso;
        $registro->tipoInstrumento   = $this->trimValidator($datosSocioEmpresa['tipoInstrumento']);
        $registro->numeroInstrumento = $this->trimValidator($datosSocioEmpresa['numeroInstrumento']);
        $registro->observaciones     = $this->trimValidator($datosSocioEmpresa['observaciones']);
        $registro->fkUsuarioAlta     = $idUsuario;
        $registro->fechaAlta         = Carbon::now();
        $registro->save();
    }

    public function obtenerDetalleSocioPorId($idSocio){
        $detalleSocio = TblSocios::select('tblSocios.*', 'tblIntermediariosSocios.nombreIntermediario')
                                 ->join('tblIntermediariosSocios', 'tblIntermediariosSocios.id', 'tblSocios.fkIntermediario')
                                 ->where('tblSocios.id',$idSocio);

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

    public function modificarSocio ( $datosSocio, $idSocio, $idUsuario ) {
        $fechaInicioCambio = ($datosSocio['fechaInicio'] != null && $datosSocio['fechaInicio'] != '');
        $fechaFinCambio    = ($datosSocio['fechaInicio'] != null && $datosSocio['fechaInicio'] != '');

        TblSocios::where('id', $idSocio)
                 ->update([
                    'nombreSocio'          => $this->trimValidator($datosSocio['nombreSocio']),
                    'curpSocio'            => $this->trimValidator($datosSocio['curpSocio']),
                    'rfcSocio'             => $this->trimValidator($datosSocio['rfcSocio']),
                    'estadoCivilSocio'     => $this->trimValidator($datosSocio['estadoCivilSocio']),
                    'lugarNacimiento'      => $this->trimValidator($datosSocio['lugarNacimiento']),
                    'ocupacion'            => $this->trimValidator($datosSocio['ocupacion']),
                    'direccion'            => $this->trimValidator($datosSocio['direccion']),
                    'colonia'              => $this->trimValidator($datosSocio['colonia']),
                    'cp'                   => $this->trimValidator($datosSocio['cp']),
                    'localidad'            => $this->trimValidator($datosSocio['localidad']),
                    'estado'               => $this->trimValidator($datosSocio['estado']),
                    'telefono'             => $this->trimValidator($datosSocio['telefono']),
                    'fkIntermediario'      => $this->trimValidator($datosSocio['fkIntermediario']),
                    'observaciones'        => $this->trimValidator($datosSocio['observaciones']),
                    'tipoIdentificacion'   => $this->trimValidator($datosSocio['tipoIdentificacion']),
                    'numeroIdentificacion' => $this->trimValidator($datosSocio['numeroIdentificacion']),
                    'vigencia'             => $this->trimValidator($datosSocio['vigencia']),
                    'fechaNacimiento'      => Carbon::parse($datosSocio['fechaNacimiento']),
                    'fiel'                 => $this->trimValidator($datosSocio['fiel']),
                    'fechaInicio'          => $fechaInicioCambio ? Carbon::parse($datosSocio['fechaInicio']) : null,
                    'fechaFin'             => $fechaFinCambio ? Carbon::parse($datosSocio['fechaFin']) : null,
                    'status'               => $this->trimValidator($datosSocio['status']),
                    'fechaActualizacion'   => Carbon::now()
                 ]);
    }

    public function obtenerDetalleSocioEmpresaPorId($idEnlace){
        $detalleSocioEmpresa = TblSociosEmpresas::select(
                                                    'tblSocios.nombreSocio',
                                                    'empresas.nombre as nombreEmpresa',
                                                    'tblSociosEmpresas.tipoInstrumento',
                                                    'tblSociosEmpresas.numeroInstrumento',
                                                    'tblSociosEmpresas.observaciones'
                                                )
                                                ->selectRaw("
                                                    case
                                                        when tblSocios.status = 1 then 'Activo'
                                                        else 'Inactivo'
                                                    end as statusSocio
                                                ")
                                                ->selectRaw("
                                                    case
                                                        when empresas.status = 1 then 'Activa'
                                                        when empresas.status = 2 then 'X suspender'
                                                        when empresas.status = 3 then 'En proceso'
                                                        when empresas.status = 4 then 'Suspendida'
                                                        when empresas.status = 5 then 'Maquila cliente'
                                                        when empresas.status = 6 then 'Cuenta bancaria'
                                                    end as statusEmpresa
                                                ")
                                                ->selectRaw("DATE_FORMAT( tblSociosEmpresas.mesIngreso, '%Y-%m' ) as mesIngreso")
                                                ->selectRaw("DATE_FORMAT( tblSociosEmpresas.mesSalida, '%Y-%m' ) as mesSalida")
                                                ->join('tblSocios', 'tblSocios.id', 'tblSociosEmpresas.fkSocio')
                                                ->join('empresas', 'empresas.id', 'tblSociosEmpresas.fkEmpresa')
                                                ->where('tblSociosEmpresas.id', $idEnlace);
        return $detalleSocioEmpresa->get();
    }

    public function modificarEnlaceSocioEmpresa ( $datosSocioEmpresa, $idEnlace ) {
        $mesIngreso = $datosSocioEmpresa['mesIngreso'] != null && $datosSocioEmpresa['mesIngreso'] != '' ? Carbon::parse($datosSocioEmpresa['mesIngreso']) : null;
        $mesSalida  = $datosSocioEmpresa['mesSalida'] != null && $datosSocioEmpresa['mesSalida'] != '' ? Carbon::parse($datosSocioEmpresa['mesSalida']) : null;

        TblSociosEmpresas::where('id', $idEnlace)
                         ->update([
                            'fkSocio'            => $this->trimValidator($datosSocioEmpresa['fkSocio']),
                            'fkEmpresa'          => $this->trimValidator($datosSocioEmpresa['fkEmpresa']),
                            'mesIngreso'         => $mesIngreso,
                            'tipoInstrumento'    => $this->trimValidator($datosSocioEmpresa['tipoInstrumento']),
                            'numeroInstrumento'  => $this->trimValidator($datosSocioEmpresa['numeroInstrumento']),
                            'mesSalida'          => $mesSalida,
                            'observaciones'      => $this->trimValidator($datosSocioEmpresa['observaciones']),
                            'fechaActualizacion' => Carbon::now()
                         ]);
    }

    public function trimValidator ( $value ) {
		return $value != null && trim($value) != '' ? trim($value) : null;
	}
}