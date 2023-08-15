<?php

namespace App\Http\Controllers\LogisticaIntegral\pdfs;

use Dompdf\Dompdf;
use App\Http\Controllers\Controller;

class PagoMensualidadController extends Controller {
    public function generarPdf(){
        $contenido = view('prueba')->render();

        $pdf = new Dompdf();
        $pdf->loadHtml($contenido);
        $pdf->setPaper('letter');
        $pdf->render();

        return $pdf->stream('pagoMensualidad.pdf');
    }
}
