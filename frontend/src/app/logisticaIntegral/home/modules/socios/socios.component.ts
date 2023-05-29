import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-socios',
  templateUrl: './socios.component.html',
  styleUrls: ['./socios.component.css']
})
export class SociosComponent implements OnInit {
  protected dtOptions: DataTables.Settings = {};

  ngOnInit(): void {
    this.dtOptions = {
      language: {
        url : "//cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json"
      }
    };
  }
}
