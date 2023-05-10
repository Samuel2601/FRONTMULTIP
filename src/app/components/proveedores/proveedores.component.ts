import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/service/admin.service';

import * as XLSX from 'xlsx';
import * as XlsxPopulate from 'xlsx-populate';

import * as Papa from 'papaparse';

export interface Proveedor {
  id: number;
  nombre: string;
  direccion: string;
  telefono: string;
  email: string;
}
@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.css'],
})

export class ProveedoresComponent implements OnInit {
  public proveedor:any={}
  public proveedor_arr: Proveedor[] = [];
  public proveedores:any={}
  public proveedores_erro:any=[]
  constructor(private _adminService: AdminService) { 
   
  }

  ngOnInit(): void {
  }
  guardarProveedor(){
    
  }
  

  onFileChange(event:any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
      const csvData = reader.result;
     
      const parsedData = Papa.parse(csvData.toString(), { header: true });
      const proveedores: Proveedor[] = [];
      console.log(parsedData);
      parsedData.data.forEach((row:any, index:any) => {
        if (row.nombre && row.direccion && row.telefono) {
          const proveedor: Proveedor = {
            nombre: row.nombre,
            direccion: row.direccion,
            telefono: row.telefono,
            id: index,
            email: row.telefono
          };
          this.proveedor_arr.push(proveedor);
        } else {
          this.proveedores_erro.push(row);
         // console.log(`Fila ${index + 1} no cumple con los campos requeridos`);
         
        }
      });
      const worksheet = XLSX.utils.json_to_sheet(this.proveedores_erro);
      const worksheet1 = XLSX.utils.json_to_sheet(this.proveedor_arr);
      XLSX.writeFile({ SheetNames: ['Corregir'], Sheets: { 'Por Corregir': worksheet , 'Valido': parsedData.meta.fields} }, 'datos.xlsx');
      console.log(XLSX);
      console.log(proveedores); // Aquí tienes los datos CSV convertidos en objetos JSON y validados
    };
  }
}
