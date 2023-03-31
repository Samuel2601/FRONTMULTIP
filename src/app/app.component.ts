import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from './service/admin.service';

import { FlatfileMethods, FlatfileResults, FlatfileSettings } from '@flatfile/angular';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css'],
})
export class AppComponent {
	public rol: any;
	public estado: any;
	public token = localStorage.getItem('token');
	public geo = localStorage.getItem('geo');

	title = 'admin';
	constructor(private _adminService: AdminService, private _router: Router) {}
	onData(results: FlatfileResults): Promise<string> {
		let errorState = false;
		//console.log({results});
		return new Promise((resolve, rejects) => {
			setTimeout(() => {
				if (errorState) {
					rejects('reject -this text is controlled by the end-user');
					errorState = false;
				} else {
					resolve('Flatfile upload successful - this text is controlled by the');
				}
			}, 3000);
		});
	}
	ngOnInit(): void {
		if (localStorage.getItem('token') != null) {
			this._adminService.verificar_token(localStorage.getItem('token')).subscribe(
				(response) => {},
				(error) => {
					localStorage.removeItem('token');
					localStorage.removeItem('_id');
					localStorage.removeItem('user');
					this._router.navigate(['/login']);
				}
			);
		}
		if (this.geo == null) {
			this._adminService.obtener_ip_admin().subscribe((response) => {
				this._adminService.obtener_data_admin(response.ip).subscribe((response) => {
					localStorage.setItem('geo', JSON.stringify(response));
					///  console.log(localStorage.setItem('geo',JSON.stringify(response)));
					window.location.reload();
				});
			});
		}
	}
}
