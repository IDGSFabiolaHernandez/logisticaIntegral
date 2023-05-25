<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Services\Auth\LoginService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class LoginController extends Controller
{
    protected $loginService;

    public function __construct(
        LoginService $LoginService
    )
    {
        $this->loginService = $LoginService;
    }

    public function login( Request $request ) {
        try {
            return $this->loginService->login( $request->all() );
        } catch ( \Exception $error ) {
            Log::alert($error);
            return response()->json(
                [
                    'error' => $error,
                    'mensaje' => 'Ocurrió un error interno'
                ],
                500
            );
        }
    }
}
