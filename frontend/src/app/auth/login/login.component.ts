import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

  public formLogin! : FormGroup;
  public hide : boolean = true;
  
  constructor(
    private fb : FormBuilder,
  ){ 
  }

  ngOnInit(): void {
    this.formLogin = this.fb.group({
      correo : ['',[Validators.email,Validators.required]],
      password: ['',[Validators.required]]
    })
  }

  getErrorMessage() {
    if (this.formLogin.get('correo')?.hasError('required')) {
      return 'Campo obligatorio';
    }

    return this.formLogin.get('correo')?.hasError('email') ? 'Correo inválido' : '';
  }
}
