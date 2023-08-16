<?php

namespace App\Http\Controllers\LogisticaIntegral\pdfs;

use Dompdf\Dompdf;
use App\Http\Controllers\Controller;
use App\Services\LogisticaIntegral\pdfs\PdfService;
use Illuminate\Support\Facades\Log;

class PdfController extends Controller {
    protected $pdfService;
    public function __construct(
        PdfService $PdfService,
    )
    {
        $this->pdfService = $PdfService;
    }
    public function generarPdfPagoMensualidad($idMensualidad, $nombreEntrega){
        $datosMensualidad = $this->pdfService->generarPdfPagoMensualidad($idMensualidad);
        
        $datosMensualidad->nombreEntrega = $nombreEntrega;

        $contenido = view('prueba')->with('item', $datosMensualidad)->render();

        $pdf = new Dompdf();
        $pdf->loadHtml($contenido);
        $pdf->setPaper('letter');
        $pdf->render();

        $nombreArchivo = 'Recibo mensualidad ('.$datosMensualidad->mensualidad.'), '.$datosMensualidad->nombreSocio.' - '.$datosMensualidad->nombre;
        return $pdf->stream($nombreArchivo.'.pdf');
    }
}
