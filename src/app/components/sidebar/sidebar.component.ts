import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/service/admin.service';
import { GLOBAL } from 'src/app/service/GLOBAL';
declare var iziToast: any;
declare var $: any;
@Component({
	selector: 'app-sidebar',
	templateUrl: './sidebar.component.html',
	styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
	public rol: any;
	public imagen: any;
	public nombres: any;
	public estado: any;
	public aux: any;
	public id: any;
	public pagos: any = {};
	public config: any = {};
	public token = localStorage.getItem('token');
	public url = GLOBAL.url;
	constructor(private _router: Router, private _adminService: AdminService) {
		//let aux1 = localStorage.getItem("identity");
		this.rol = JSON.parse(localStorage.getItem('user_data'))?.rol;
		this.id = JSON.parse(localStorage.getItem('user_data'))?._id;
		this.nombres =
			JSON.parse(localStorage.getItem('user_data'))?.nombres +
			' ' +
			JSON.parse(localStorage.getItem('user_data'))?.apellidos;
		this.aux = JSON.parse(localStorage.getItem('user_data'))?.email;
		this.estado = JSON.parse(localStorage.getItem('user_data'))?.estado;
		this.imagen = JSON.parse(localStorage.getItem('user_data'))?.portada;
	}

	ngOnInit(): void {
		this.buscar();
		//console.log(this.rol);
		if (this.estado == 'Fuera' || this.estado == 'deshabilitado') {
			this.logout();
		}
	}
	
	buscar(){
		this._adminService.getapitoken().subscribe(response=>{
			//console.log(response);
			this._adminService.conec_api('dop_v1_92eb852578f7ce12f4ce3485c78aafe7932fcb5521cee629c0be18bc2a388750').subscribe(response=>{
				console.log(response);
				if(response){
					this.pagos=response;
					if(this.pagos.generated_at&& new Date(this.pagos.generated_at) &&parseFloat(this.pagos.account_balance)>0){
						$('#staticBackdrop').modal('show');
					}
				}
				
				
			});
		})
		
	}
	logout() {
		//window.location.reload();
		localStorage.clear();

		this._router.navigate(['/']).then(() => {
			window.location.reload();
		});
	}
}
