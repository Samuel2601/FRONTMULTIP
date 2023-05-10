import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/service/admin.service';
@Component({
  selector: 'app-egresos',
  templateUrl: './egresos.component.html',
  styleUrls: ['./egresos.component.css']
})
export class EgresosComponent implements OnInit {
  public egreso:any={}
  public egresos:any={}
  public proveedores:any={}
  constructor(private _adminService: AdminService) { }

  ngOnInit(): void {
  }
  guardarEgreso(){
    
  }

}
