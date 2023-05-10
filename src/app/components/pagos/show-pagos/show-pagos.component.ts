import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'src/app/service/admin.service';

import { EstudianteService } from 'src/app/service/estudiante.service';
import { GLOBAL } from 'src/app/service/GLOBAL';
import { TableUtil } from '../show-pagos/tableUtil';
import { TableUtil2 } from '../show-pagos/tableUtil';
//import {createClient} from 'soap';
declare var iziToast: any;
declare var $: any;

@Component({
	selector: 'app-show-pagos',
	templateUrl: './show-pagos.component.html',
	styleUrls: ['./show-pagos.component.css'],
})
export class ShowPagosComponent implements OnInit {
	public pago: any = {};
	public id = '';
	public token = localStorage.getItem('token');
	public load = false;
	public link = '';
	public url = GLOBAL.url;
	public detalles: Array<any> = [];
	public load_data = true;

	public totalstar = 5;

	public review: any = {};
	public load_send = false;
	public load_conf_pago = false;
	public load_final = false;
	public load_del = false;
	public tracking = '';
	public mes: any;
	public auxmes: any;
	public auxmes1: any;
	public auxmes2: any;
	public auxmes3: any;
	public auxmes4: any;
	public auxmes5: any;
	public auxmes6: any;
	public auxmes7: any;
	public auxmes8: any;
	public auxmes9: any;
	public auxmes10: any;
	public idpension: any;
	public registro: any = {};
	public xmlItems: any;
	private auxp = 0;
	private mesespdf = [
		'Enero',
		'Febrero',
		'Marzo',
		'Abril',
		'Mayo',
		'Junio',
		'Julio',
		'Agosto',
		'Setiembre',
		'Octubre',
		'Noviembre',
		'Diciembre',
	];
	public imagen: any;
	public fecha: Array<any> = [];
	public pension: any = {};
	public linkfact = '';
	constructor(
		private _route: ActivatedRoute,
		private _adminService: AdminService,

		private _estudianteService: EstudianteService,
		private _router: Router
	) {
		this.token = localStorage.getItem('token');
		this.url = GLOBAL.url;
	}
	public rol = '';
	public idp = '';
	public yo = 0;
	ngOnInit(): void {
		this.imagen = JSON.parse(localStorage.getItem('user_data'))?.portada;
		this._route.params.subscribe((params) => {
			this.id = params['id'];
			let aux = localStorage.getItem('identity');
			this._adminService.obtener_admin(aux, this.token).subscribe((response) => {
				this.rol = response.data.rol;
				this.idp = response.data._id;
				if (response.data.email == 'samuel.arevalo@espoch.edu.ec') {
					this.yo = 1;
				}
			});
			this.init_data();
		});
	}

	init_data() {
		/*let auxpagos=[
		'642ad82d4c780d65b0551413',
		'642af0f04c780d65b055195d',
		'642af7494c780d65b0551b6f',
		'642af92f4c780d65b0551bf7',
		'642afb004c780d65b0551c6b',
		'642b01f74c780d65b0551ef1',
		'642b08434c780d65b0552100',
		'642b09984c780d65b0552188',
		'642b0af44c780d65b055220a',
		'642b0b3c4c780d65b055225c',
		'642b0cad4c780d65b05522e5',
		'642b0ddc4c780d65b0552366',
		'642b14664c780d65b055247d',
		'642b16f74c780d65b055255f',
		'642b2e564c780d65b0552682',
		'642b31c24c780d65b055281f',
		'642b3be84c780d65b0552e10',
		'642b3ce84c780d65b0552e98',
		'642b48fd4c780d65b05534c1',
		'642b491b4c780d65b05534f6',
		'642b53044c780d65b0553600',
		'642c2b524c780d65b05536b0',
		'642c41574c780d65b05538ce',
		'642c49a64c780d65b0553a17',
		'642c4b284c780d65b0553a93',
		'642c59d24c780d65b0553e6d',
		'642c5b2b4c780d65b0553ef7',
		'642c5d544c780d65b0553f90',
		'642c81ee4c780d65b055447c',
		'642c829e4c780d65b0554504',
		'642c83804c780d65b055458c',
		'642d92bc938854637e9c6d46',
		'642d9d90938854637e9c70f7',
		'642da0bc938854637e9c723d',
		'642da539938854637e9c7421',
		'642dd184938854637e9c7a21',
		'642dd819938854637e9c7c04',
		'642dd849938854637e9c7c3b',
		'642ddc3d938854637e9c7d65',
		'642e0360938854637e9c861a',
		'642e03b6938854637e9c86dc',
		'643410ad938854637e9c8c18',
		'64341eb3938854637e9c910b',
		'6434209f938854637e9c918c',
		'64342acf938854637e9c94ff',
		'64342b15938854637e9c9540',
		'64342bde938854637e9c95b3',
		'64344389938854637e9c9c42',
		'643443c9938854637e9c9c83',
		'64344571938854637e9c9d76',
		'643467f2938854637e9c9ef7',
		'643468dd938854637e9c9f63',
		'64348048938854637e9ca629',
		'643489e0938854637e9ca893']
		let descaux=[];
		auxpagos.forEach((element:any) => {
			this._adminService.obtener_detalles_ordenes_estudiante(element, this.token).subscribe((response) => {
				//this.pago = Object.assign(response.data);
				//this.detalles=Object.assign(response.detalles);
				
				descaux.push({'venta':element,'detalle':Object.assign(response.detalles)});
				
				
			});
		});
		console.log(descaux);
		*/

		this._adminService.obtener_detalles_ordenes_estudiante(this.id, this.token).subscribe((response) => {
			if (response.data != undefined) {
				this.pago = response.data;
				//console.log(this.pago);
				this.detalles = response.detalles;
				this.detalles.forEach((element: any) => {
					element.aniosup = new Date(
						new Date(element.idpension.anio_lectivo).setFullYear(
							new Date(element.idpension.anio_lectivo).getFullYear() + 1
						)
					).getFullYear();
				});
				this.load_data = false;
				this.detalle_data();
			} else {
				this.pago = undefined;
				this.load_data = false;
			}

			//console.log(this.detalles);
		});
	}
	exportTable() {
		TableUtil.exportToPdf(
			this.mesespdf[new Date(this.auxmes).getMonth()].toString() +
				' ' +
				new Date(this.auxmes).getFullYear().toString() +
				'-' +
				(new Date(this.auxmes).getFullYear() + 1).toString(),
			(this.url + 'obtener_portada/' + this.imagen).toString()
		);
	}
	exportTable2() {
		TableUtil2.exportToPdf(
			this.mesespdf[new Date(this.auxmes).getMonth()].toString() +
				' ' +
				new Date(this.auxmes).getFullYear().toString() +
				'-' +
				(new Date(this.auxmes).getFullYear() + 1).toString(),
			(this.url + 'obtener_portada/' + this.imagen).toString()
		);
	}
	detalle_data() {
		this._estudianteService
			.obtener_pension_estudiante_guest(this.pago.estudiante._id, this.token)
			.subscribe((response) => {
				this.pension = response.data;
				for (var i = 0; i <= this.pension.length; i++) {
					//console.log(this.pension[i]);
					//////console.log(i);

					if (this.pension[i]._id == this.detalles[0].idpension._id) {
						this.idpension = this.pension[i]._id;
						this.auxp = i;
						this.auxmes = this.pension[i].anio_lectivo;
						let j = 0;

						for (j = 0; j < 10; j++) {
							//if(j>=this.pension[i].meses){
							this.fecha.push({
								date: new Date(this.pension[i].anio_lectivo).setMonth(
									new Date(this.pension[i].anio_lectivo).getMonth() + j
								),
							});

							//}
						}
						//////console.log(this.fecha);
						if (this.pago.estado == 'Registrado' && this.pension[i].idanio_lectivo.facturacion != null) {
							this.linkfact = this.pension[i].facturacion;
							//this.facturar_electronica();
						}
						i = this.pension.length;
					}
				}
			});
	}

	//public  = require('soap');
	/*
	fsoap() {
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open('POST', 'https://somesoapurl.com/', true);

		// build SOAP request
		var sr =
			'<?xml version="1.0" encoding="utf-8"?>' +
			'<soapenv:Envelope ' + 
				'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' +
				'xmlns:api="http://127.0.0.1/Integrics/Enswitch/API" ' +
				'xmlns:xsd="http://www.w3.org/2001/XMLSchema" ' +
				'xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">' +
				'<soapenv:Body>' +
					'<api:some_api_call soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">' +
						'<username xsi:type="xsd:string">login_username</username>' +
						'<password xsi:type="xsd:string">password</password>' +
					'</api:some_api_call>' +
				'</soapenv:Body>' +
			'</soapenv:Envelope>';

		xmlhttp.onreadystatechange = function () {
			if (xmlhttp.readyState == 4) {
				if (xmlhttp.status == 200) {
					alert(xmlhttp.responseText);
					// alert('done. use firebug/console to see network response');
				}
			}
		}
		// Send the POST request
		xmlhttp.setRequestHeader('Content-Type', 'text/xml');
		xmlhttp.send(sr);
		// send request
		// ...
	}
*/

	factura_electronica_soap() {
		this.armado();
		console.log(this.registro);
		if (this.error_constru == '' && JSON.stringify(this.registro) != '{}') {
			this._adminService
				.marcar_finalizado_orden(this.pago._id, this.registro, this.token)
				.subscribe((response) => {
					console.log(response);
					if (response.message) {
						iziToast.info({
							title: 'RESP API:',
							titleColor: '#41CC62',
							color: '#ADE6BB',
							class: 'text-info',
							position: 'topRight',
							message: response.message,
						});
					} else {
						iziToast.show({
							title: 'DANGER',
							class: 'text-danger',
							titleColor: 'red',
							color: 'red',
							position: 'topRight',
							message: 'Algo Salio mal',
						});
					}
					setTimeout(() => {
						location.reload();
					}, 1000);
				});
		} else {
			iziToast.show({
				title: 'DANGER',
				class: 'text-danger',
				titleColor: 'red',
				color: 'red',
				position: 'topRight',
				message: this.error_constru,
			});
		}
	}
	private error_constru = '';
	armado() {
		//if(this.linkfact!=''){
		////console.log(this._adminService.ejemplo(1112,this.token));
		//console.log("this.pago",this.pago);

		//console.log("this.detalles",this.detalles);
		//console.log("this.pension[this.auxp]",this.pension[this.auxp]);
		let registro: any = {
			//detalleFactura:[]
		};
		this.registro.cedulaEstudiante = this.pago.estudiante.dni.toString();
		this.registro.nombreEstudiante = (
			this.pago.estudiante.apellidos +
			' ' +
			this.pago.estudiante.nombres
		).toString();
		this.registro.direccionEstudiante = this.pago.estudiante.direccion.toString();
		if (this.pago.estudiante.telefono) {
			this.registro.telefonoEstudiante = (this.pago.estudiante?.telefono).toString();
		} else {
			this.registro.telefonoEstudiante = '9999999999';
		}

		this.registro.emailEstudiante = this.pago.estudiante.email.toString();

		this.registro.cedulaPadre = this.pago.estudiante.dni_padre.toString();
		this.registro.nombrePadre = this.pago.estudiante.nombres_padre.toString();
		this.registro.facturarA = this.pago.estudiante.dni_factura.toString();
		this.registro.codigoTipocomprobante = parseInt(this.pago.tipo_documento);
		this.registro.subtotal = 0; //parseFloat(this.pago.total_pagar.toFixed(2));
		this.registro.tarifaCero = parseFloat(this.pago.total_pagar.toFixed(2));
		this.registro.tarifaDoce = parseFloat('0');
		this.registro.valorIva = parseFloat('0');
		this.registro.totalFactura = parseFloat(this.pago.total_pagar.toFixed(2));
		this.registro.codigoTipopagosri = parseInt('20');

		//this.registro.emailPadre=(this.pago.estudiante.email_padre).toString();

		//console.log(this.detalles.length);
		this.registro.detalleFactura = '';
		let detalle_aux = this.detalles; //.filter((element)=>element.tipo<11);
		//console.log("Detalles filstrados",detalle_aux);
		for (var k = 0; k < detalle_aux.length; k++) {
			let dtll = detalle_aux[k];
			//console.log(dtll);
			let aux: any = {};
			aux[0] = 0; //0
			aux[1] = 0; //0
			aux[2] = 0; //0
			aux[3] = k + 1; //numero de Item
			aux[4] = 0; //0
			aux[5] = 1; //1
			if (dtll.tipo == 0) {
				aux[6] = 99; //Codigo de Producto
			} else {
				aux[6] = dtll.tipo; //Codigo de Producto
			}

			aux[7] = this.pago.tipo_tarifa; //Tipo Tarifa
			aux[8] = 0; //0
			aux[9] = 2; //Tipo producto
			//aux[10]='0'; 		//Descripción
			if (dtll.tipo == 0) {
				aux[10] = 'Matricula';
				//aux[12] = parseFloat(parseFloat(this.pension[this.auxp].idanio_lectivo.matricula).toFixed(2)); //Precio Unitario
			} else if (dtll.tipo > 0 && dtll.tipo <= 11) {
				for (var i = 0; i < this.fecha.length; i++) {
					if (i + 1 == dtll.tipo) {
						var date = new Date(this.fecha[i].date);
						let month = date.toLocaleString('default', { month: 'long' });
						////console.log(month+' '+new Date (this.fecha[i].date).getFullYear());
						aux[10] = ('Pensión ' + month + ' ' + new Date(this.fecha[i].date).getFullYear()).toString();
					}
				}
				//aux[12] = parseFloat(parseFloat(this.pension[this.auxp].idanio_lectivo.pension).toFixed(2)); //Precio Unitario
			} else if (dtll.descripcion) {
				//aux[12] = parseFloat(parseFloat(this.pension[this.auxp].idanio_lectivo.pension).toFixed(2)); //Precio Unitario
				aux[10] = dtll.descripcion;
			} else {
				this.error_constru = 'Sin descripción, no se puede emitir';
			}

			aux[11] = dtll.estado; //Observación

			aux[13] = 0; //0
			aux[14] = 0; //0
			aux[15] = 1; //cantidad
			aux[16] = 0; //medida1
			aux[17] = 0; //0
			aux[18] = "''"; //''
			if (
				this.pension[this.auxp].condicion_beca == 'Si' &&
				dtll.tipo > 0 &&
				dtll.tipo <= 10 &&
				dtll.valor == parseFloat(this.pension[this.auxp].val_beca).toFixed(2) &&
				dtll.abono == 0
			) {
				aux[19] = parseFloat((parseFloat ( parseFloat(this.pension[this.auxp].idanio_lectivo.pension).toFixed(2)) -parseFloat(
					(
						(parseFloat(parseFloat(this.pension[this.auxp].idanio_lectivo.pension).toFixed(2)) *
							parseFloat(parseFloat(this.pension[this.auxp].desc_beca).toFixed(2))) /
						100
					).toFixed(2)
				) ).toFixed(2)); //descuento
				aux[20] = parseFloat(parseFloat(this.pension[this.auxp].idanio_lectivo.pension).toFixed(2)); //ValorParcialsinDescuento
				aux[21] = parseFloat(parseFloat(this.pension[this.auxp].val_beca).toFixed(2)); //valorParcialcondescuento
				aux[12] = parseFloat(parseFloat(this.pension[this.auxp].idanio_lectivo.pension).toFixed(2));
			} else {
				aux[19] = 0; //descuento
				aux[20] = dtll.valor; //ValorParcialsinDescuento
				aux[21] = dtll.valor; //valorParcialcondescuento
				aux[12] = dtll.valor;
			}
			this.registro.subtotal = this.registro.subtotal + aux[15] * aux[20];
			aux[22] = 0; //0
			aux[23] = 1; //1
			aux[24] = 0; //0
			//console.log(aux);
			for (var j = 0; j < 25; j++) {
				////console.log("J:",j,"valor",aux[j]);
				if (j == 0) {
					if (this.registro.detalleFactura == undefined) {
						this.registro.detalleFactura = '(' + aux[j];
					} else {
						this.registro.detalleFactura = this.registro.detalleFactura + '(' + aux[j];
					}
				} else {
					////console.log(typeof aux[j]==='string');
					if (typeof aux[j] === 'string' && j != 18) {
						this.registro.detalleFactura = this.registro.detalleFactura + ",'" + aux[j] + "'";
					} else {
						if (j == 18) {
							this.registro.detalleFactura = this.registro.detalleFactura + ',' + aux[j];
						} else {
							this.registro.detalleFactura = this.registro.detalleFactura + ',' + aux[j];
						}
					}
				}
				if (j == 24) {
					//console.log('K',k);
					if (k == detalle_aux.length - 1) {
						this.registro.detalleFactura = this.registro.detalleFactura + ')';
					} else {
						this.registro.detalleFactura = this.registro.detalleFactura + '),';
					}
				}
			}
			//console.log(this.registro.detalleFactura);
			/*
				if(registro.detalleFactura==undefined){
					registro.detalleFactura=JSON.stringify(aux);
				}else{
					registro.detalleFactura=registro.detalleFactura+','+JSON.stringify(aux);
				}
				*/
			////console.log(aux);
		}
		/*}else{
			console.log("sin link");
		}*/
		//console.log('registro', this.registro);
	}
	facturar_electronica() {
		try {
			if (this.linkfact != '') {
				////console.log(this._adminService.ejemplo(1112,this.token));
				////console.log(this.pago);

				////console.log(this.detalles);
				console.log(this.pension[this.auxp]);
				let registro: any = {
					//detalleFactura:[]
				};
				this.registro.cedulaEstudiante = this.pago.estudiante.dni.toString();
				this.registro.nombreEstudiante = (
					this.pago.estudiante.apellidos +
					' ' +
					this.pago.estudiante.nombres
				).toString();
				this.registro.direccionEstudiante = this.pago.estudiante.direccion.toString();
				if (this.pago.estudiante.telefono) {
					this.registro.telefonoEstudiante = (this.pago.estudiante?.telefono).toString();
				} else {
					this.registro.telefonoEstudiante = '9999999999';
				}

				this.registro.emailEstudiante = this.pago.estudiante.email.toString();

				this.registro.cedulaPadre = this.pago.estudiante.dni_padre.toString();
				this.registro.nombrePadre = this.pago.estudiante.nombres_padre.toString();
				this.registro.facturarA = this.pago.estudiante.dni_factura.toString();
				this.registro.codigoTipocomprobante = parseInt(this.pago.tipo_documento);
				this.registro.subtotal = parseFloat(this.pago.total_pagar);
				this.registro.tarifaCero = parseFloat(this.pago.total_pagar);
				this.registro.tarifaDoce = parseFloat('0');
				this.registro.valorIva = parseFloat('0');
				this.registro.totalFactura = parseFloat(this.pago.total_pagar);
				this.registro.codigoTipopagosri = parseInt('20');

				//this.registro.emailPadre=(this.pago.estudiante.email_padre).toString();

				//console.log(this.detalles.length);
				this.registro.detalleFactura = '';
				for (var k = 0; k < this.detalles.length; k++) {
					let dtll = this.detalles[k];
					////console.log(dtll);
					let aux: any = {};
					aux[0] = 0; //0
					aux[1] = 0; //0
					aux[2] = 0; //0
					aux[3] = k + 1; //numero de Item
					aux[4] = 0; //0
					aux[5] = 1; //1
					if (dtll.tipo == 0) {
						aux[6] = 99; //Codigo de Producto
					} else {
						aux[6] = dtll.tipo; //Codigo de Producto
					}

					aux[7] = this.pago.tipo_tarifa; //Tipo Tarifa
					aux[8] = 0; //0
					aux[9] = this.pago.tipo_producto; //Tipo producto
					//aux[10]='0'; 		//Descripción
					if (dtll.tipo == 0) {
						aux[10] = 'Matricula';
					} else if (dtll.tipo > 0 && dtll.tipo <= 11) {
						for (var i = 0; i < this.fecha.length; i++) {
							if (i + 1 == dtll.tipo) {
								var date = new Date(this.fecha[i].date);
								let month = date.toLocaleString('default', { month: 'long' });
								////console.log(month+' '+new Date (this.fecha[i].date).getFullYear());
								aux[10] = ('Pensión ' + month + ' ' + new Date(this.fecha[i].date).getFullYear()).toString();
							}
						}
					} else {
						aux[10] = dtll.descripcion;
					}

					aux[11] = dtll.estado; //Observación
					aux[12] = dtll.valor; //Precio Unitario
					aux[13] = 0; //0
					aux[14] = 0; //0
					aux[15] = 1; //cantidad
					aux[16] = 0; //medida1
					aux[17] = 0; //0
					aux[18] = "''"; //''
					if (
						(this.pension[this.auxp].condicion_beca != 'No' &&
							dtll.tipo > 0 &&
							dtll.tipo <= this.pension[this.auxp].meses) ||
						(dtll.tipo == 0 && this.pension[this.auxp].paga_mat == 1)
					) {
						aux[19] = this.pension[this.auxp].desc_beca; //descuento
						aux[21] = this.pension[this.auxp].val_beca; //valorParcialcondescuento
						aux[20] = this.pension[this.auxp].val_beca * (100 / this.pension[this.auxp].desc_beca); //ValorParcialsinDescuento
					} else {
						aux[19] = 0; //descuento
						aux[20] = dtll.valor; //ValorParcialsinDescuento
						aux[21] = dtll.valor; //valorParcialcondescuento
					}

					aux[22] = 0; //0
					aux[23] = 1; //1
					aux[24] = 0; //0
					//console.log(aux);
					for (var j = 0; j < 25; j++) {
						////console.log("J:",j,"valor",aux[j]);
						if (j == 0) {
							if (this.registro.detalleFactura == undefined) {
								this.registro.detalleFactura = '(' + aux[j];
							} else {
								this.registro.detalleFactura = this.registro.detalleFactura + '(' + aux[j];
							}
						} else {
							////console.log(typeof aux[j]==='string');
							if (typeof aux[j] === 'string' && j != 18) {
								this.registro.detalleFactura = this.registro.detalleFactura + ",'" + aux[j] + "'";
							} else {
								if (j == 18) {
									this.registro.detalleFactura = this.registro.detalleFactura + ',' + aux[j];
								} else {
									this.registro.detalleFactura = this.registro.detalleFactura + ',' + aux[j];
								}
							}
						}
						if (j == 24) {
							//console.log('K',k);
							if (k == this.detalles.length - 1) {
								this.registro.detalleFactura = this.registro.detalleFactura + ')';
							} else {
								this.registro.detalleFactura = this.registro.detalleFactura + '),';
							}
						}
					}
					//console.log(this.registro.detalleFactura);
					/*
			if(registro.detalleFactura==undefined){
				registro.detalleFactura=JSON.stringify(aux);
			}else{
				registro.detalleFactura=registro.detalleFactura+','+JSON.stringify(aux);
			}
			*/
					////console.log(aux);
				}
				//var a=1;
				//this.registro.soapenv='Envelope';
				//this.registro.xmlns="soapenv='http://schemas.xmlsoap.org/soap/envelope/'";

				////console.log(this.registro);
				let b,
					c = '';
				for (var value in this.registro) {
					if (value != 'detalleFactura') {
						if (b == undefined && c == undefined) {
							if (
								value == 'cedulaEstudiante' ||
								value == 'nombresEstudiante' ||
								value == 'cedulaPadre' ||
								value == 'nombrePadre' ||
								value == 'facturarA'
							) {
								c = value + '=' + this.registro[value];
							} else {
								c = value + '=' + this.registro[value];
							}

							b = '<' + value + '>' + this.registro[value] + '</' + value + '>';
						} else {
							if (
								value == 'cedulaEstudiante' ||
								value == 'emailEstudiante' ||
								value == 'direccionEstudiante' ||
								value == 'nombresEstudiante' ||
								value == 'cedulaPadre' ||
								value == 'nombrePadre' ||
								value == 'facturarA' ||
								value == 'telefonoEstudiante'
							) {
								c = c + '&&' + value + '=' + this.registro[value];
							} else {
								c = c + '&&' + value + '=' + this.registro[value];
							}

							b = b + '<' + value + '>' + this.registro[value] + '</' + value + '>';
						}
					}
				}
				c = c + '&&detalleFactura=' + this.registro.detalleFactura;

				c = 'numeroIdPago=' + this.pago._id + c;
				//c=c+"&&token="+this.token.toString();

				//console.log(c);

				//this.toXML(c);
				//this.loadXML();
			}
		} catch (error) {
			location.reload();
		}
	}
	eliminar_factura() {
		this.armado();
		console.log('registro', this.registro);

		if (this.error_constru == '' && JSON.stringify(this.registro) != '{}') {
			this.registro.codigoTipocomprobante = 35;
			this._adminService
				.marcar_finalizado_orden(this.pago._id, this.registro, this.token)
				.subscribe((response) => {
					console.log(response);
					if (response.message) {
						iziToast.info({
							title: 'RESP API:',
							titleColor: '#41CC62',
							color: '#ADE6BB',
							class: 'text-info',
							position: 'topRight',
							message: response.message,
						});
						this._adminService
							.eliminar_finalizado_orden(this.pago._id, this.registro, this.token)
							.subscribe((response) => {
								iziToast.show({
									title: 'SUCCESS',
									titleColor: '#1DC74C',
									color: '#FFF',
									class: 'text-success',
									position: 'topRight',
									message: 'El pago fue registrado correctamente.',
								});
								location.reload();

								//wind.close();
							});
					} else {
						iziToast.show({
							title: 'DANGER',
							class: 'text-danger',
							titleColor: 'red',
							color: 'red',
							position: 'topRight',
							message: 'Algo Salio mal',
						});
					}
					setTimeout(() => {
						location.reload();
					}, 1000);
				});
		} else {
			iziToast.show({
				title: 'DANGER',
				class: 'text-danger',
				titleColor: 'red',
				color: 'red',
				position: 'topRight',
				message: this.error_constru,
			});
		}
	}

	toXML(json: string) {
		//var myHeaders = new Headers();
		//org.apache.axis.client.Cal call =
		/*
		this.postData('http://181.113.65.229:7071/WS/Facturador', json)
	.then(data => {
	 // //console.log(data); // JSON data parsed by `data.json()` call
	});*/
		/* 
	

	var myInit:RequestInit  = { 
					method: 'POST',
				   headers: myHeaders,
				   mode: 'cors',
				   cache: 'default'
				 };
	
	var myRequest = new Request("http://192.168.180.1:7071/WS/Facturador?"+json,myInit);


	
	fetch(myRequest)
	.then(function(response) {
		////console.log(response);
	  return response.blob();
	})
	.then(function(myBlob) {
	  var objectURL = URL.createObjectURL(myBlob);
	  //myImage.src = objectURL;
	});
*/
		/*

	
	.then(function(myBlob) {
	  var objectURL = URL.createObjectURL(myBlob);
	  //myImage.src = objectURL;
	});
*/
		/*
this._adminService.facturacion(this.registro).subscribe(response=>{
	//console.log(response);
});/*
	var myInit:RequestInit  = { 
		method: 'POST',
	   headers: {
		"Content-Type": "text/html;charset=UTF-8",
	   },
	   credentials: "omit",
	   mode: 'no-cors',
	   cache: 'default'
	 };



	 //console.log("http://181.113.65.229:8080/interfaceFacturaWeb/index.xhtml?"+json);
	var myRequest = new Request("http://181.113.65.229:8080/interfaceFacturaWeb/index.xhtml?"+json,myInit);

	fetch(myRequest)
	.then((response:any)=>{
		//console.log(response);
		//console.log(response.clone());
		//console.log(response.redirected);
		//console.log(response.arrayBuffer());
		////console.log(response.formData());
		////console.log(response.blob());
		////console.log(response.json());
		//console.log(response.text());
		response.text();
	}).then(printData=>//console.log(printData));
*/

		////console.log("http://181.113.65.229:8080/interfaceFacturaWeb/index.xhtml?"+json);
		//var resultado = window.open("http://181.113.65.229:8080/interfaceFacturaWeb/index.xhtml?"+json);
		let params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=600,height=300,left=100,top=100`;
		//this.link = 'http://181.113.65.229:8080/interfaceFacturaWeb/index.xhtml?' + json;
		this.link = this.linkfact + json;
		//console.log(this.link);
		let wind = window.open(this.link, 'Facturación', params);
		if (wind == null || typeof wind == 'undefined') {
			alert('Se bloqueo la ventana emergente');
		} else {
			this._adminService
				.marcar_finalizado_orden(this.pago._id, this.registro, this.token)
				.subscribe((response) => {
					wind.close();
					iziToast.show({
						title: 'SUCCESS',
						titleColor: '#1DC74C',
						color: '#FFF',
						class: 'text-success',
						position: 'topRight',
						message: 'El pago fue emitido correctamente.',
					});
					location.reload();
				});
		}

		/*
	
	//var direccionURL1 = '<a href="http://norfipc.com/index.html">NombreDelVinculo</a>'; 
	var iframe1 = '<iframe id="ifsr" scrolling="no" height="60" frameborder="0" width="430" src='+this.link+'></iframe>'; 
	//document.getElementById('link1').innerHTML=direccionURL1; 
	document.getElementById('iframe1').innerHTML=iframe1;
	setTimeout(() => {
		console.log(document.getElementById('frmList:j_idt32'));
	}, 5000);
	//var link = "https://smartwateracademy.com/video/mivideo.php"
 */

		//console.log(wind.document.getElementById('frmList:j_idt32'));

		/*if(wind){
		wind.close();
	}*/

		/*
	setTimeout(() => {
		console.log(document.getElementById('frmList:j_idt32'));
	}, 1000);
	*/

		// window.prompt();
		/*
		var myInit:RequestInit  = { 
		method: 'POST',
	   headers: myHeaders,
	   credentials: "omit",
	   mode: 'no-cors',
	   cache: 'default',
	   body:json
	 };
	 var myRequest = new Request("http://181.113.65.229:7071/WS/Facturador?wsdl",myInit);

	fetch(myRequest)
	.then((response:any)=>{
		console.log(response);
		//console.log(response.clone());
		//console.log(response.redirected);
		//console.log(response.arrayBuffer());
		////console.log(response.formData());
		////console.log(response.blob());
		////console.log(response.json());
		//console.log(response.text());
		response.text();
	}).then(printData=>console.log(printData));
/*
	var myInit:RequestInit  = { 
		method: 'POST',
	   headers: myHeaders,
	   credentials: "omit",
	   mode: 'no-cors',
	   cache: 'default',
	   body:this.registro
	 };
	
	var myRequest = new Request("http://181.113.65.229:7071/WS/Facturador?wsdl",myInit);

	fetch(myRequest)
	.then((response:any)=>{
		//console.log(response);
		//console.log(response.clone());
		//console.log(response.redirected);
		//console.log(response.arrayBuffer());
		////console.log(response.formData());
		////console.log(response.blob());
		////console.log(response.json());
		//console.log(response.text());
		
		response.text();
	}).then(printData=>//console.log(printData));

	/*
	this._adminService.facturacion(this.registro).subscribe(response=>{
		//console.log(response);
	});
	//console.log("http://181.113.65.229:7071/WS/Facturador?"+this.registro);
	var myRequest = new Request("http://181.113.65.229:7071/WS/Facturador?");
	fetch(myRequest,{
		method: 'POST',
		//headers: myHeaders,
		mode: 'no-cors',
		cache: 'default',
		headers: [
			["Content-Type", "application/json"],
			["Content-Type", "text/plain"]
		  ],
		  credentials: "include",
		body:JSON.stringify(this.registro)
	})
	.then(result =>{
		//console.log(result)
		result.text()
	})
	.then(textformat => //console.log(textformat))

	
	fetch(myRequest)
	.then(function(response) {
		//console.log(response.clone());
		//console.log(response.redirected);
		//console.log(response.arrayBuffer());
		//console.log(response.formData());
		//console.log(response.blob());
		//console.log(response.json());
		//console.log(response.text());
		//console.log(response.json());
	  return response.blob();
	})
	.then(function(myBlob) {
	  var objectURL = URL.createObjectURL(myBlob);
	  //myImage.src = objectURL;
	});






		//const builder = new Builder();
		//var a = new parseString();
        ////console.log(builder.buildObject(json));
		
		//var a = this._adminService.toSoap(json);
		////console.log(a);
		//var codigo = new DOMParser();
		//var oDOM = codigo.parseFromString(a, "text/xml");
		////console.log(oDOM);
*/

		/*

		let res:any;

		var xmlReq = new XMLHttpRequest();
		//var myMode = xmlReq.mode();
		xmlReq.open('POST', 'http://181.113.65.229:8080/interfaceFacturaWeb/index.xhtml?'+json,true);	
		xmlReq.setRequestHeader('X-PINGOTHER', 'pingpong');
		xmlReq.setRequestHeader('Content-Type', 'application/xml');
		xmlReq.setRequestHeader('mode', 'no-cors');
		//xmlReq.onreadystatechange = handler;
		
		xmlReq.onreadystatechange = function(){
			//console.log(xmlReq);
			if(xmlReq.readyState===4){
				if(xmlReq.status===200){
					//console.log(xmlReq.responseText);
				}else{
					//console.log("ERROR: "+xmlReq.responseText);
				}
			}
		}
		xmlReq.send();

		




		/*
		xmlReq.onload=()=>{
			//console.log(xmlReq);
			//res=Object.assign(JSON.parse(xmlReq.response));
			////console.log(res);
		}

		/*
		xmlReq.open("GET", "https://reqres.in/api/users/");		
		xmlReq.onload=()=>{
			//console.log(xmlReq);
			res=Object.assign(JSON.parse(xmlReq.response));
			//console.log(res);
		}
		xmlReq.send();

		*/

		//this.soap.createClient('http://123.618.196.10/WCFTicket/Service1.svc?wsdl').subscribe(client => this.client = client);
		//var r:string = builder.buildObject(json);
		//r.replace('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>','<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ws="http://ws.davintri.com/">');
		//r.replace('<root>','<soapenv:Header/>  <soapenv:Body> <ws:GenerarFactura>');
		//r.replace('</root>','</ws:GenerarFactura> </soapenv:Body> </soapenv:Envelope>');
		/*
		this.soap.createClient(builder.buildObject(json)).then(
			client=>{
				//console.log(client);
				this.client=client;
			}
		);
*/
		////console.log(r);
		//this.loadXML(a);
		//this.loadXML(oDOM);
	}
}
