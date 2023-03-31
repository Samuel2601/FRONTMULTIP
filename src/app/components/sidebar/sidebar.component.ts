import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/service/admin.service';
import { GLOBAL } from 'src/app/service/GLOBAL';
declare var iziToast: any;
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
		//console.log(this.rol);
		if (this.estado == 'Fuera' || this.estado == 'deshabilitado') {
			this.logout();
		}
	}
	logout() {
		//window.location.reload();
		localStorage.removeItem('token');
		localStorage.removeItem('_id');
		localStorage.removeItem('user_data');
		localStorage.removeItem('identity');
		localStorage.removeItem('geo');
		this._router.navigate(['/']).then(() => {
			window.location.reload();
		});
	}
}
