import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/service/admin.service';
import Chart, { ChartDataset } from 'chart.js/auto';
import { TableUtil } from './tableUtil';
import { GLOBAL } from 'src/app/service/GLOBAL';
//import * as pdfMake from "pdfmake/build/pdfmake";
//import * as pdfFonts from 'pdfmake/build/vfs_fonts';

//(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

declare var iziToast: any;
declare var $: any;

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
	public documentos: Array<any> = [];
	public documentos_const: Array<any> = [];
	public ventas: Array<any> = [];
	public const_ventas: Array<any> = [];
	public estudiantes: Array<any> = [];
	public const_estudiantes: Array<any> = [];
	public token = localStorage.getItem('token');
	public page = 1;
	public pageSize = 10;
	public filtro = '';
	public desde: any = undefined;
	public hasta: any = undefined;

	public load_ventas = false;
	public load_documentos = false;
	public load_estudiantes = false;
	public load_administrativo = false;
	public load_registro = false;
	public nmt = 0;
	public meses = new Array(
		'Enero',
		'Febrero',
		'Marzo',
		'Abril',
		'Mayo',
		'Junio',
		'Julio',
		'Agosto',
		'Septiembre',
		'Octubre',
		'Noviembre',
		'Diciembre'
	);

	public factual = new Date().setMonth(new Date().getMonth());
	public auxfactual = new Date(this.factual).getMonth();
	public mactual = new Date().getMonth();
	public idmactual: Array<any> = [];
	public faux = new Date().setFullYear(new Date().getFullYear() - 1);
	public totalfaux = 0;
	public totalfactual = 0;
	public pagosmes = 0;

	public sobrante = 0;

	public datosventa = {};
	public anio: Array<any> = [];
	public auxanio: Array<any> = [];

	public pensionesestudiante: any = [];
	public pagospension: any = [];
	public constpagospension: any = {};

	public recaudado: any = [];
	public myChart: Chart<'bar', number[], string> | any;
	public myChart3: Chart<'bar', number[], string> | any;
	public pagado = 0;
	public porpagar = 0;
	public deteconomico: any = [];
	public cursos: any = [];
	public cursos2: any = [];
	public documento_arr: Array<any> = [];
	public resgistro_arr: Array<any> = [];
	public resgistro_const: Array<any> = [];
	public pdffecha = '';
	public rol: any;
	public yo = 0;
	public director = '';
	public naadmin = '';
	public nadelegado = '';
	public load_data_est = true;
	public config: any = [];
	public penest: any = [];
	public fbeca = '';
	public active: any;
	public imagen: any;

	public pagos_estudiante: Array<any> = [];

	constructor(private _adminService: AdminService) {}

	ngOnInit(): void {
		this.imagen = JSON.parse(localStorage.getItem('user_data'))?.portada;
		let aux = localStorage.getItem('identity');
		this._adminService.obtener_admin(aux, this.token).subscribe((response) => {
			this.rol = response.data.rol;
			this.naadmin = response.data.nombres + ' ' + response.data.apellidos;
			if (this.rol == 'admin') {
				
			}
			if (response.data.email == 'samuel.arevalo@espoch.edu.ec') {
				this.yo = 1;
			}
			if (this.rol == 'admin' || this.rol == 'direc' || this.rol == 'delegado') {
				this._adminService.listar_admin(this.token).subscribe((response) => {
					let respon = response.data;
					respon.forEach((element) => {
						if (element.rol == 'direc') {
							this.director = element.nombres + ' ' + element.apellidos;
						}
						if (element.rol == 'delegado') {
							this.nadelegado = element.nombres + ' ' + element.apellidos;
						}
					});
				});
				this.estadoventas();
			}
		});
	}
	public pagos:any
	estadoventas(): void {
		this.load_data_est = true;
		this.auxanio = [];
		this.load_documentos = false;
		this.load_estudiantes = false;
		this.load_administrativo = false;
		this.load_registro = false;
		this.load_ventas = true;
		this.ventas = [];
		this.anio = [];
		this.totalfactual = 0;
		this.pagosmes = 0;
		this._adminService.obtener_detallespagos_admin(this.token, null).subscribe((response) => {
			this.ventas = response.data;
			if (this.ventas != undefined) {
				for (var i = 0; i < this.ventas.length; i++) {
					if (
						new Date(this.ventas[i].createdAt).getFullYear() == new Date(this.faux).getFullYear() &&
						this.ventas[i].pago.estado == 'Registrado'
					) {
						this.totalfaux = this.ventas[i].valor + this.totalfaux;
					} else if (
						new Date(this.ventas[i].createdAt).getFullYear() == new Date(this.factual).getFullYear()
					) {
						this.totalfactual += this.ventas[i].valor;
					}

					if (
						i == 0 &&
						new Date(this.ventas[i].createdAt).getFullYear() == new Date(this.factual).getFullYear()
					) {
						this.anio.push({
							label:
								new Date(this.ventas[i].idpension.anio_lectivo).getFullYear().toString() +
								' ' +
								this.ventas[i].idpension.curso +
								this.ventas[i].idpension.paralelo +
								' ' +
								this.ventas[i].estudiante.estado,
							data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
							backgroundColor: 'rgba(54,162,235,0.2)',
							borderColor: 'rgba(54,162,235,1)',
							borderWidth: 2,
						});
						this.anio[0].data[new Date(this.ventas[i].createdAt).getMonth()] =
							this.anio[0].data[new Date(this.ventas[i].createdAt).getMonth()] + this.ventas[i].valor;
					} else if (
						new Date(this.ventas[i].createdAt).getFullYear() == new Date(this.factual).getFullYear()
					) {
						let aux =
							new Date(this.ventas[i].idpension.anio_lectivo).getFullYear().toString() +
							' ' +
							this.ventas[i].idpension.curso +
							this.ventas[i].idpension.paralelo +
							' ' +
							this.ventas[i].estudiante.estado;
						let con = -1;
						for (var j = 0; j < this.anio.length; j++) {
							if (this.anio[j].label.toString() == aux) {
								con = j;
							}
						}
						if (con == -1) {
							var auxcolor1 = Math.random() * 255;
							var auxcolor2 = Math.random() * 255;

							this.anio.push({
								label:
									new Date(this.ventas[i].idpension.anio_lectivo).getFullYear().toString() +
									' ' +
									this.ventas[i].idpension.curso +
									this.ventas[i].idpension.paralelo +
									' ' +
									this.ventas[i].estudiante.estado,
								data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
								backgroundColor: 'rgba(' + auxcolor2 + ',' + auxcolor1 + ',200,0.2)',
								borderColor: 'rgba(' + auxcolor2 + ',' + auxcolor1 + ',200,1)',
								borderWidth: 2,
							});
							this.anio[this.anio.length - 1].data[new Date(this.ventas[i].createdAt).getMonth()] =
								this.anio[this.anio.length - 1].data[new Date(this.ventas[i].createdAt).getMonth()] +
								this.ventas[i].valor;
						} else {
							this.anio[con].data[new Date(this.ventas[i].createdAt).getMonth()] =
								this.anio[con].data[new Date(this.ventas[i].createdAt).getMonth()] + this.ventas[i].valor;
						}
					}
				}

				if (document.getElementById('myChart') != null) {
					var canvas = <HTMLCanvasElement>document.getElementById('myChart');

					var ctx: CanvasRenderingContext2D | any;
					ctx = canvas.getContext('2d');
					if (this.myChart) {
						this.myChart.destroy();
					}
					this.myChart = new Chart(ctx, {
						type: 'bar',
						data: {
							labels: [
								'Enero',
								'Febrero',
								'Marzo',
								'Abril',
								'Mayo',
								'Junio',
								'Julio',
								'Agosto',
								'Septiembre',
								'Octubre',
								'Noviembre',
								'Dicembre',
							],
							datasets: [],
						},
						options: {
							scales: {
								y: {
									beginAtZero: true,
								},
							},
						},
					});
					//console.log(this.anio);

					this.anio.forEach((element) => {
						var fech: string = element.label;
						
						//this.myChart.data.datasets.push(element);
						this.auxanio.push(element);

						this.pagosmes += element.data[this.auxfactual];
						
					});
					var labels= [
						'Enero',
						'Febrero',
						'Marzo',
						'Abril',
						'Mayo',
						'Junio',
						'Julio',
						'Agosto',
						'Septiembre',
						'Octubre',
						'Noviembre',
						'Dicembre',
					]
					//console.log(labels);
					this.pagos=[{label:'Valores Recaudados',data:{
						'Enero':0,'Febrero':0,'Marzo':0,'Abril':0,'Mayo':0,'Junio':0,'Julio':0,'Agosto':0,'Septiembre':0,'Octubre':0,'Noviembre':0,'Dicembre':0},backgroundColor
					:"rgba(54,162,235,0.2)",borderColor:"rgba(54,162,235,1)",borderWidth:2}]
					this.anio.forEach((element:any) => {
						element.data.forEach((elementdata:any, index:any) => {
							this.pagos[0].data[labels[index]]=this.pagos[0].data[labels[index]]+elementdata
						});
					});
					this.myChart.data.datasets=this.pagos
					//console.log(pagos);
					//console.log(this.auxfactual);
					//console.log(this.auxanio);

					this.ordenarmes(0);

					//console.log(this.auxanio);
					this.myChart.update();
					this.load_data_est = false;
				}

			}
		});
	}
	ordenarmes(eve ){
		let aux=parseInt(this.auxfactual.toString());
		this.auxanio = this.auxanio.sort(function (a, b) {

			if(a.data[aux]<b.data[aux]){
				return 1
			}
			if(a.data[aux]>b.data[aux]){
				return -1
			}

			/*
			if (a.label.charAt(5) + a.label.charAt(6) > b.label.charAt(5) + b.label.charAt(6)) {
				return 1;
			}
			if (a.label.charAt(5) + a.label.charAt(6) < b.label.charAt(5) + b.label.charAt(6)) {
				return -1;
			}*/


			// a must be equal to b
			return 0;

		});
	}

	estadodocumento(): void {
		this.load_data_est = true;

		this.sobrante = 0;
		this.load_ventas = false;
		this.load_documentos = true;
		this.load_estudiantes = false;
		this.load_registro = false;
		this.load_administrativo = false;
		this.documento_arr = [];
		this._adminService.listar_documentos_admin(this.token).subscribe((response) => {
			let lb: Array<any> = [];
			this.documentos_const = response.data;
			this.documentos = this.documentos_const;
			//console.log(this.documentos);
			if (this.documentos != undefined) {
				for (var i = 0; i < this.documentos.length; i++) {
					if (i == 0 && new Date(this.documentos[i].f_deposito).getFullYear() == new Date().getFullYear()) {
						lb.push(this.documentos[i].cuenta);
					} else if (lb.indexOf(this.documentos[i].cuenta) == -1) {
						lb.push(this.documentos[i].cuenta);
					}
				}

				var data: Array<any> = [];
				for (var k = 0; k < lb.length; k++) {
					data.push(0);
				}
				for (var i = 0; i < this.documentos.length; i++) {
					if (new Date(this.documentos[i].f_deposito).getFullYear() == new Date().getFullYear()) {
						if (i == 0) {
							this.documento_arr.push({
								label:
									new Date(this.documentos[i].createdAt).getFullYear().toString() +
									' ' +
									this.documentos[i].cuenta,
								data: this.documentos[i].valor,
								backgroundColor: 'rgba(54,162,235,0.2)',
								borderColor: 'rgba(54,162,235,1)',
								borderWidth: 2,
							});
						} else {
							let aux =
								new Date(this.documentos[i].createdAt).getFullYear().toString() +
								' ' +
								this.documentos[i].cuenta;
							let con = -1;
							con = this.documento_arr.indexOf(aux);
							for (var j = 0; j < this.documento_arr.length; j++) {
								if (this.documento_arr[j].label.toString() == aux) {
									con = j;
								}
							}
							if (con == -1) {
								var auxcolor1 = Math.random() * 130;
								this.documento_arr.push({
									label:
										new Date(this.documentos[i].createdAt).getFullYear().toString() +
										' ' +
										this.documentos[i].cuenta,
									data: this.documentos[i].valor,
									backgroundColor: 'rgba(' + auxcolor1 + ',255,200,0.2)',
									borderColor: 'rgba(' + auxcolor1 + ',255,200,1)',
									borderWidth: 2,
								});
							} else {
								this.documento_arr[con].data =
									this.documento_arr[con].data + parseFloat(this.documentos[i].valor);
							}
						}
					}
				}

				for (let item of this.documento_arr) {
					var fech: string = item.label;
					if (fech.includes(new Date().getFullYear().toString())) {
						this.sobrante += parseFloat(item.data);
					}
				}
				for (let itm of this.documento_arr) {
					var aux = [];
					for (var k = 0; k < lb.length; k++) {
						aux.push(0);
					}
					var aux1 = itm.label;
					var palabrasProhibidas = [
						new Date().getFullYear().toString() + ' ',
						'tonto',
						'palabra-vulgar-1',
						'palabra-vulgar-2',
					];
					var numeroPalabrasProhibidas = palabrasProhibidas.length;

					while (numeroPalabrasProhibidas--) {
						if (aux1.indexOf(palabrasProhibidas[numeroPalabrasProhibidas]) != -1) {
							aux1 = aux1.replace(new RegExp(palabrasProhibidas[numeroPalabrasProhibidas], 'ig'), '');
						}
					}
					var aux2 = lb.indexOf(aux1);
					aux[aux2] = itm.data;
					itm.data = aux;
				}

				var canvas = <HTMLCanvasElement>document.getElementById('myChart2');
				var ctx: CanvasRenderingContext2D | any;
				ctx = canvas.getContext('2d');

				var myChart2 = new Chart(ctx, {
					type: 'bar',
					data: {
						labels: lb,
						datasets: [],
					},
					options: {
						scales: {
							y: {
								beginAtZero: true,
							},
						},
					},
				});

				this.documento_arr.forEach((element) => {
					var fech: string = element.label;
					if (fech.includes(new Date().getFullYear().toString())) {
						myChart2.data.datasets.push(element);
					}
				});
				myChart2.update();
				this.documentos=this.documentos.filter(o=>o.valor>0.01);
				this.documentos = this.documentos.sort(function (a, b) {

					if(a.valor<b.valor){
						return 1
					}
					if(a.valor>b.valor){
						return -1
					}

					return 0;
		
				});
				console.log(this.documentos);
				this.load_data_est = false;
			}
		});
	}
	estadoestudiante(): void {
		this.load_data_est = true;
		this.load_administrativo = false;
		this.load_ventas = false;
		this.load_documentos = false;
		this.load_estudiantes = true;
		this.load_registro = false;

		let auxpen = [];
		this._adminService.obtener_config_admin(this.token).subscribe((responese) => {
			this.config = responese.data;
			this.config.forEach((element:any) => {
				element.label=this.meses[new Date(element.anio_lectivo).getMonth()] +
				' ' +
				new Date(element.anio_lectivo).getFullYear() +
				'-' +
				new Date(
					new Date(element.anio_lectivo).setFullYear(
						new Date(element.anio_lectivo).getFullYear() + 1
					)
				).getFullYear()
			});
			this.active = -1;
			this.detalle_data(0);
		});
	}

	detalle_data(val: any) {
		if (this.active != val) {
			this.active = val;
			if (this.myChart3) {
				this.myChart3.destroy();
				
			}

			this.load_data_est = true;
			this.nmt = 0;
			this.pdffecha = (
				this.meses[new Date(this.config[val].anio_lectivo).getMonth()] +
				' ' +
				new Date(this.config[val].anio_lectivo).getFullYear() +
				'-' +
				new Date(
					new Date(this.config[val].anio_lectivo).setFullYear(
						new Date(this.config[val].anio_lectivo).getFullYear() + 1
					)
				).getFullYear()
			).toString();
			
			this.fbeca = this.config[val].anio_lectivo;

			
			this.pagado = 0;
			this.porpagar = 0;
			this.pagospension = [];
			this.cursos = [];
			this.deteconomico = [];
			let costopension = 0;
			let costomatricula = 0;
			let costosextrapagos=0;
			this._adminService
				.obtener_detallespagos_admin(this.token, this.config[val].anio_lectivo)
				.subscribe((response) => {
					this.estudiantes = response.data;
						costopension = this.config[val].pension;
						if(this.config[val].extrapagos){
							var extrapagos= JSON.parse(this.config[val].extrapagos);
							extrapagos.forEach((element:any) => {
								costosextrapagos+=element.valor;
							});
						}
						
					
						costomatricula = this.config[val].matricula;
						this.nmt = this.config[val].numpension
						//this.nmt=10;
						this._adminService.obtener_becas_conf(this.config[val]._id, this.token)
						.subscribe((response) => {
							this.arr_becas=response.becas;
							//console.log(this.arr_becas)
							this._adminService.listar_pensiones_estudiantes_tienda(this.token,this.config[val].anio_lectivo).subscribe((response) => {
						
								this.penest = response.data;
								//console.log(this.penest)
								if (this.penest != undefined) {
									//Armado de matriz
									this.penest.forEach((element: any) => {
											var con = -1;
											for (var i = 0; i < this.pagospension.length; i++) {
												if (this.pagospension[i].label == element.curso + element.paralelo) {
													con = i;
												}
											}
											if (con == -1) {
												if (!this.cursos.includes(element.curso)) {
													this.cursos.push(element.curso);
												}
		
												this.pagospension.push({
													label: element.curso + element.paralelo,
													num: 0,
													data: [0, 0],
													genero: [0, 0,0],
												});
												
											}
										
									});
									//Conteo de Estudiantes
									this.penest.forEach((element: any) => {							
										if (element.idestudiante.estado == 'Activo' || element.idestudiante.estado == 'Activado') {
											if (
												new Date(this.config[val].anio_lectivo).getTime() ==
												new Date(element.anio_lectivo).getTime()
											) {
												this.pagospension.forEach((elementpp: any) => {
													
													if (element.curso + element.paralelo == elementpp.label) {
														if(element.idestudiante.genero=="Masculino"){
															elementpp.genero[0]++
														}else if(element.idestudiante.genero=="Femenino"){
															elementpp.genero[1]++
														}else{
															elementpp.genero[2]++
														}
														
		
														elementpp.num = elementpp.num + 1;
		
														if (element.condicion_beca == 'Si') {
															if (
																new Date(element.anio_lectivo).getTime() ==
																new Date(this.config[val].anio_lectivo).getTime()
															) {
																for (var i = 1; i <= this.nmt; i++) {
																	
																	if (
																		new Date(
																			new Date(element.anio_lectivo).setMonth(
																				new Date(element.anio_lectivo).getMonth() + i - 1
																			)
																		).getTime() == new Date(this.config[val].mescompleto).getTime()
																	) {
																		elementpp.data[1] = elementpp.data[1] + this.config[val].pension;
																		this.porpagar += this.config[val].pension;
																	} else {
																		if (element.num_mes_beca - i >= 0) {
																			elementpp.data[1] = elementpp.data[1] + element.val_beca;
																			this.porpagar += element.val_beca;
																		} else {
																			elementpp.data[1] = elementpp.data[1] + this.config[val].pension;
																			this.porpagar += this.config[val].pension;
																		}
																	}
																}
																if (element.paga_mat == 0) {
																	elementpp.data[1] = elementpp.data[1] + costosextrapagos + this.config[val].matricula;
																	this.porpagar += this.config[val].matricula+costosextrapagos;
																}
															} else {
																for (var i = 1; i <= this.nmt; i++) {
																	if (
																		new Date(
																			new Date(element.anio_lectivo).setMonth(
																				new Date(element.anio_lectivo).getMonth() + i - 1
																			)
																		).getTime() == new Date(new Date(element.anio_lectivo).setMonth(11)).getTime()
																	) {
																		elementpp.data[1] = elementpp.data[1] + costopension;
																		this.porpagar += costopension;
																	} else {
																		if (element.num_mes_beca - i >= 0) {
																			elementpp.data[1] = elementpp.data[1] + element.val_beca;
																			this.porpagar += element.val_beca;
																		} else {
																			elementpp.data[1] = elementpp.data[1] + costopension;
																			this.porpagar += costopension;
																		}
																	}
																}
																if (element.paga_mat == 0) {
																	elementpp.data[1] = elementpp.data[1] + costosextrapagos+ costomatricula;
																	this.porpagar += costomatricula+costosextrapagos;
																}
		
															}
														} else {
															
															if (
																new Date(element.anio_lectivo).getTime() ==
																new Date(this.config[val].anio_lectivo).getTime()
															) {
																elementpp.data[1] =
																	elementpp.data[1] + costosextrapagos+
																	this.nmt * this.config[val].pension +
																	this.config[val].matricula;
		
																this.porpagar += this.nmt * this.config[val].pension + costosextrapagos + this.config[val].matricula;
															} else {
																elementpp.data[1] = elementpp.data[1] + 10 * costopension + costomatricula+costosextrapagos;
		
																this.porpagar += 10 * costopension + costomatricula+costosextrapagos;
															}
														}
													}
												});
											}
										} else if (element.idestudiante.estado == 'Desactivado') {
											if (
												new Date(this.config[val].anio_lectivo).getTime() ==
												new Date(element.anio_lectivo).getTime()
											) {
												var auxmeses;
												let mes =
													(new Date(element.idestudiante.f_desac).getFullYear() -
														new Date(element.anio_lectivo).getFullYear()) *
													12;
												mes -= new Date(element.anio_lectivo).getMonth();
												mes += new Date(element.idestudiante.f_desac).getMonth();
												if (mes > 10) {
													auxmeses = 10;
												} else {
													auxmeses = mes + 1;
												}
												if (this.nmt < auxmeses) {
													auxmeses = this.nmt;
												}
												
												this.pagospension.forEach((elementpp: any) => {
													
													if (element.curso + element.paralelo == elementpp.label) {
														elementpp.num = elementpp.num + 1;
		
														if (element.condicion_beca == 'Si') {
															if (
																new Date(element.anio_lectivo).getTime() ==
																new Date(this.config[val].anio_lectivo).getTime()
															) {
																for (var i = 1; i <= auxmeses; i++) {
																	if (
																		new Date(
																			new Date(element.anio_lectivo).setMonth(
																				new Date(element.anio_lectivo).getMonth() + i - 1
																			)
																		).getTime() == new Date(new Date(element.anio_lectivo).setMonth(11)).getTime()
																	) {
																		elementpp.data[1] = elementpp.data[1] + this.config[val].pension;
																		this.porpagar += this.config[val].pension;
																	} else {
																		if (element.num_mes_beca - i >= 0) {
																			elementpp.data[1] = elementpp.data[1] + element.val_beca;
																			this.porpagar += element.val_beca;
																		} else {
																			elementpp.data[1] = elementpp.data[1] + this.config[val].pension;
																			this.porpagar += this.config[val].pension;
																		}
																	}
																}
																if (element.paga_mat == 0) {
																	elementpp.data[1] = elementpp.data[1] + this.config[val].matricula+costosextrapagos;
																	this.porpagar += this.config[val].matricula+costosextrapagos;
																}
															} else {
																for (var i = 1; i <= auxmeses; i++) {
																	
																	if (
																		new Date(
																			new Date(element.anio_lectivo).setMonth(
																				new Date(element.anio_lectivo).getMonth() + i - 1
																			)
																		).getTime() == new Date(new Date(element.anio_lectivo).setMonth(11)).getTime()
																	) {
																		elementpp.data[1] = elementpp.data[1] + costopension;
																		this.porpagar += costopension;
																	} else {
																		if (element.num_mes_beca - i >= 0) {
																			elementpp.data[1] = elementpp.data[1] + element.val_beca;
																			this.porpagar += element.val_beca;
																		} else {
																			elementpp.data[1] = elementpp.data[1] + costopension;
																			this.porpagar += costopension;
																		}
																	}
																}
																if (element.paga_mat == 0) {
																	elementpp.data[1] = elementpp.data[1] + costomatricula+costosextrapagos;
																	this.porpagar += costomatricula+costosextrapagos;
																}
															}
														} else {
															for (var i = 1; i <= auxmeses; i++) {
																if (
																	new Date(
																		new Date(element.anio_lectivo).setMonth(
																			new Date(element.anio_lectivo).getMonth() + i - 1
																		)
																	).getTime() == new Date(new Date(element.anio_lectivo).setMonth(11)).getTime()
																) {
																	elementpp.data[1] = elementpp.data[1] + costopension;
																	this.porpagar += costopension;
																} else {
																	if (element.num_mes_beca - i >= 0) {
																		elementpp.data[1] = elementpp.data[1] + element.val_beca;
																		this.porpagar += element.val_beca;
																	} else {
																		elementpp.data[1] = elementpp.data[1] + costopension;
																		this.porpagar += costopension;
																	}
																}
															}
															elementpp.data[1] = elementpp.data[1] + costomatricula+costosextrapagos;
															this.porpagar += costomatricula+costosextrapagos;
														}
													}
												});
											}
										}
									});
									//Conteo de pagos
									this.estudiantes.forEach((element) => {
										if (element.tipo <= this.nmt || element.tipo>=25) {
											var aux =
												this.meses[new Date(element.idpension.anio_lectivo).getMonth()] +
												' ' +
												new Date(element.idpension.anio_lectivo).getFullYear() +
												'-' +
												new Date(
													new Date(element.idpension.anio_lectivo).setFullYear(
														new Date(element.idpension.anio_lectivo).getFullYear() + 1
													)
												).getFullYear();
											if (
												new Date(this.config[val].anio_lectivo).getTime() ==
												new Date(element.idpension.anio_lectivo).getTime()
											) {
												for (var k = 0; k < this.pagospension.length; k++) {
													if (
														this.pagospension[k].label ==
														element.idpension.curso + element.idpension.paralelo
													) {
														this.pagospension[k].data[0] = this.pagospension[k].data[0] + element.valor;
														this.pagospension[k].data[1] = this.pagospension[k].data[1] - element.valor;
		
														this.pagado += element.valor;
														this.porpagar = this.porpagar - element.valor;
		
														k = this.pagospension.length;
													}
												}
											}
										}
									});
		
									this.cursos = this.cursos.sort(function (a: any, b: any) {
										if (parseInt(a) > parseInt(b)) {
											return 1;
										}
										if (parseInt(a) < parseInt(b)) {
											return -1;
										}
										return 0;
									});
									this.cursos2 = [];
									this.cursos2.push('descr');
									this.cursos.forEach((element) => {
										this.cursos2.push(element);
									});
		
									var datos1: any = [];
									var datos2: any = [];
									var datos3: any = [];
									this.cursos.forEach((element: any) => {
										datos1.push(0);
										datos2.push(0);
										datos3.push(0);
									});
									this.deteconomico.push({
										label: 'N° de Estudiantes',
										data: datos1,
										backgroundColor: 'rgba(0,214,217,0.5)',
										borderColor: 'rgba(0,214,217,1)',
										borderWidth: 2,
									});
		
									this.deteconomico.push({
										label: 'Valor Recaudado',
										data: datos2,
										backgroundColor: 'rgba(0,217,97,0.5)',
										borderColor: 'rgba(0,217,97,1)',
										borderWidth: 2,
									});
									this.deteconomico.push({
										label: 'Valor por Pagar',
										data: datos3,
										backgroundColor: 'rgba(218,0,16,0.5)',
										borderColor: 'rgba(218,0,16,1)',
										borderWidth: 2,
									});
		
									this.pagospension.forEach((elementp: any) => {
										for (var i = 0; i < this.cursos.length; i++) {
											var aux = elementp.label.substring(0, elementp.label.length - 1);
											if (aux == this.cursos[i]) {
												
												this.deteconomico.forEach((elementde: any) => {
													if (elementde.label == 'N° de Estudiantes') {
														
														elementde.data[i] = elementde.data[i] + elementp.num;
													} else if (elementde.label == 'Valor Recaudado') {
														
														elementde.data[i] = elementde.data[i] + elementp.data[0];
													} else {
														
														elementde.data[i] = elementde.data[i] + elementp.data[1];
													}
												});
												i = this.cursos.length;
											}
										}
									});
								} else {
									this.load_data_est = false;
								}
								var canvas = <HTMLCanvasElement>document.getElementById('myChart3');
								var ctx: CanvasRenderingContext2D | any;
								ctx = canvas.getContext('2d');
		
								this.myChart3 = new Chart(ctx, {
									type: 'bar',
									data: {
										labels: this.cursos,
										datasets: [],
									},
									options: {
										scales: {
											y: {
												beginAtZero: true,
											},
										},
									},
								});
								this.pagospension = this.pagospension.sort(function (a: any, b: any) {
									if (a.label > b.label) {
										return 1;
									}
									if (a.label < b.label) {
										return -1;
									}
									// a must be equal to b
									return 0;
								});
								this.deteconomico.forEach((element: any) => {
									this.myChart3.data.datasets.push(element);
								});
		
								
								this.constpagospension = this.pagospension;
								this.armado(10, this.active,costosextrapagos);
								this.myChart3.update();
								this.load_data_est = false;
		
		
							});
						});
					


				});
		}
	}
	public idexpension = 0;
	public auxbecares = 0;
	public total_pagar = 0;
	public condicion = '';
	public detalles: any = {};
	public pagopension: Array<any> = [];
	public diciembre: any;
	public p: any = [];
	public arr_pagos: Array<any> = [];
	public arr_becas: Array<any> = [];
	public pensionesestudiantearmado: Array<any> = [];
	isNumber(val): boolean {
		return typeof val === 'number';
	}
	armado(tiempo: any, idxconfi: any,costosextrapagos:any) {
		this.pagos_estudiante= [];
		this.pensionesestudiantearmado = this.penest;
		this.detalles = this.estudiantes;
		//console.log(this.pensionesestudiantearmado);
		//console.log(this.detalles);
		this.auxbecares = 0;
		this.total_pagar = 0;
		this.pensionesestudiantearmado.forEach((elementpent: any, index: any) => {
			/*this._adminService.obtener_becas_conf(elementpent._id, this.token)
			.subscribe((response) => {
				this.arr_becas=Object.assign(response.becas);*/

				this.idexpension = index;
				var f = elementpent.anio_lectivo;
	
				if (elementpent.num_mes_beca != undefined) {
					this.auxbecares = elementpent.num_mes_beca;
				}
				this.condicion = elementpent.condicion_beca;
				if (this.detalles != undefined) {
					this.pagopension = [];
					let est;
					let valor;
					let idpago: any = [];
					let tipo;
					let rubro=0;
					for (var j = 0; j <= tiempo+1; j++) {
						est = 'Sin Pago';
						valor = 0;
						idpago = undefined;
						tipo = 'no';
						idpago = [];
						for (let k = 0; k < this.detalles.length; k++) {
							if (j == this.detalles[k].tipo && this.detalles[k].idpension._id == elementpent._id) {
								est = this.detalles[k].estado;
								valor += this.detalles[k].valor;
								idpago.push(this.detalles[k].pago);
								tipo = this.detalles[k].tipo;
							}else if(j>10&&this.detalles[k].tipo>11&&this.detalles[k].idpension._id == elementpent._id){
								est = this.detalles[k].estado;
								valor += this.detalles[k].valor;
								idpago.push(this.detalles[k].pago);
								tipo = this.detalles[k].tipo;
								rubro=1;
							}
						}
	
						//this.p.push({ pago: idpago, tp: tipo });
						if (j == 0) {
							var porpagar = this.config[idxconfi].matricula - valor;
							if (elementpent.paga_mat == 1) {
								porpagar = 0;
							}
							this.pagopension.push({
								date: 'Matricula',
								estado: est,
								valor: valor,
								pago: idpago,
								tipo: tipo,
								porpagar: porpagar,
							});
						} else if(rubro==0){
	
							var porpagar = this.config[idxconfi].pension - valor;
							var beca = 0;
							
							//console.log(elementpent.condicion_beca == 'Si');
							if (elementpent.condicion_beca == 'Si') {
								
									this.arr_becas.forEach((elementbeca: any) => {
										//console.log(tipo);
										//console.log(elementbeca.etiqueta);
										if ((tipo).toString()==(elementbeca.etiqueta).toString()) {
											
											porpagar = elementpent.val_beca - valor;
											beca = 1;
										}
										//console.log(beca);
									});
								
								
							}
							//console.log(beca);
							this.pagopension.push({
								date: new Date(f).setMonth(new Date(f).getMonth() + j - 1),
								estado: est,
								valor: valor,
								pago: idpago,
								tipo: tipo,
								porpagar: porpagar,
								beca: beca,
							});
						}else{
							
							var porpagar = costosextrapagos - valor;
	
							this.pagopension.push({
								date: "Rubro",
								estado: est,
								valor: valor,
								pago: idpago,
								tipo: tipo,
								porpagar: porpagar,
								beca: beca,
							});
						}
					}
	
				}
				//console.log(this.p);
				/*this.total_pagar = 0;
				this.pagopension.forEach((element: any) => {
					this.total_pagar += element.porpagar;
				});
				*/
				this.pagos_estudiante.push({
					nombres: (elementpent.idestudiante.apellidos + ' ' + elementpent.idestudiante.nombres).toString(),
					curso: elementpent.curso,
					paralelo: elementpent.paralelo,
					detalle: this.pagopension,
				});
			
			});
			
		///});
		
		this.pagos_estudiante = this.pagos_estudiante.sort(function (a, b) {
			if (parseInt(a.curso) > parseInt(b.curso)) {
				return 1;
			}
			if (parseInt(a.curso) < parseInt(b.curso)) {
				return -1;
			}
			// a must be equal to b
			return 0;
		});

		this.pagos_estudiante = this.pagos_estudiante.sort(function (a, b) {
			if (parseInt(a.curso) + a.paralelo > parseInt(b.curso) + b.paralelo) {
				return 1;
			}
			if (parseInt(a.curso) + a.paralelo < parseInt(b.curso) + b.paralelo) {
				return -1;
			}
			// a must be equal to b
			return 0;
		});

		this.pagos_estudiante = this.pagos_estudiante.sort(function (a, b) {
			if (parseInt(a.curso) + a.paralelo > parseInt(b.curso) + b.paralelo || a.nombres > b.nombres) {
				return 1;
			}
			if (parseInt(a.curso) + a.paralelo < parseInt(b.curso) + b.paralelo || a.nombres < b.nombres) {
				return -1;
			}
			// a must be equal to b
			return 0;
		});
		let contador=1,paralelo='';

		this.pagos_estudiante.forEach((element:any) => {
			if(paralelo==''){
				paralelo=element.curso+element.paralelo;
				element.indice=contador;
				contador++;
			}else if(element.curso+element.paralelo==paralelo){
				element.indice=contador;
				contador++;
			}else{
				paralelo=element.curso+element.paralelo;
				contador=1;
				element.indice=contador;
				contador++;
			}
			
		});
		//console.log(this.pagos_estudiante);

	}

	public url = GLOBAL.url;
	public mostar=1;
	exportTabletotal(val: any) {
		this.mostar=0;
		setTimeout(() => {
			this.cursos.forEach((element: any) => {
				document.getElementById('btncursos' + element).style.display = 'none';
				document.getElementById(element).style.borderCollapse = 'collapse';
				document.getElementById(element).style.width = '100%';
				document.getElementById(element).style.textAlign = 'center';
			});
			
			
			
			document.getElementById('btncvs').style.display = 'none';
			document.getElementById('btnxlsx').style.display = 'none';
			document.getElementById('btnpdf').style.display = 'none';
	
			document.getElementById('detalleeconomico').style.borderCollapse = 'collapse';
			document.getElementById('detalleeconomico').style.width = '100%';
	
			TableUtil.exportToPdftotal(
				val.toString(),
				this.pdffecha.toString(),
				this.director,
				this.nadelegado,
				this.naadmin,
				new Intl.DateTimeFormat('es-US', { month: 'long' }).format(new Date()),
				(this.url + 'obtener_portada/' + this.imagen).toString()
			);
	
		
		}, 100);
		setTimeout(() => {
			this.mostar=1;
			this.cursos.forEach((element: any) => {
				document.getElementById('btncursos' + element).style.display = '';
				document.getElementById(element).style.borderCollapse = '';
				document.getElementById(element).style.tableLayout = '';
				document.getElementById(element).style.marginLeft = '';
			});
			document.getElementById('btncvs').style.display = '';
			document.getElementById('btnxlsx').style.display = '';
			document.getElementById('btnpdf').style.display = '';
	
			document.getElementById('detalleeconomico').style.borderCollapse = '';
			document.getElementById('detalleeconomico').style.tableLayout = '';

		}, 100);
		
	}

	exportTable(val: any,genero:{}) {
		let admtitulo='';

		if(this.rol == 'admin'){
			admtitulo="Administrador(a)";
		}else if(this.rol == 'direc'){
			admtitulo="Director(a)";
		}else if(this.rol == 'delegado'){
			admtitulo="Delegado";
		}else{
			admtitulo="Colectora(a)";
		}
		
		if (val == 'detalleeconomico') {
			genero={0:0,1:0,2:0}
			this.constpagospension.forEach((element:any) => {
				genero[0]=genero[0]+element.genero[0];
				genero[1]=genero[1]+element.genero[1];
				genero[2]=genero[2]+element.genero[2];
			});
			this.mostar=0;
			//$('#btncursos'+val).hide();
			this.constpagospension.forEach((element: any) => {
				$('#' + element.label).hide();
				document.getElementById(element.label).style.display = 'none';
			});

			TableUtil.exportToPdf(
				val.toString(),
				this.pdffecha.toString(),
				'Detalle Economico de pensiones',
				this.director,
				this.nadelegado,
				this.naadmin,
				new Intl.DateTimeFormat('es-US', { month: 'long' }).format(new Date()),
				(this.url + 'obtener_portada/' + this.imagen).toString(),
				admtitulo,
				genero
			);
			//$('#btncursos'+val).show();
			this.constpagospension.forEach((element: any) => {
				$('#' + element.label).show();
				document.getElementById(element.label).style.display = 'block';
			});
		} else {
			
			if (val == 'becados') {
				genero={0:0,1:0,2:0}
			this.penest.forEach((element:any) => {
				
				if(element.condicion_beca=='Si'){
					if(element.idestudiante.genero=='Masculino'){
						
					genero[0]++;
					}else if(element.idestudiante.genero=='Femenino'){
						genero[1]++;
					}else{
					genero[2]++;
					}
				}
				

			});
				TableUtil.exportToPdf(
					val.toString(),
					this.pdffecha.toString(),
					'Becados: ' + this.pdffecha,
					this.director,
					this.nadelegado,
					this.naadmin,
					new Intl.DateTimeFormat('es-US', { month: 'long' }).format(new Date()),
					(this.url + 'obtener_portada/' + this.imagen).toString(),
					admtitulo,
					genero
				);
			} else if (val == 'eliminados') {
				
				genero={0:0,1:0,2:0}
				this.penest.forEach((element:any) => {
					
					if(element.idestudiante.estado == 'Desactivado'){
						if(element.idestudiante.genero=='Masculino'){
							
						genero[0]++;
						}else if(element.idestudiante.genero=='Femenino'){
							genero[1]++;
						}else{
						genero[2]++;
						}
					}
					
	
				});
				TableUtil.exportToPdf(
					val.toString(),
					this.pdffecha.toString(),
					'Estudiantes Retirados: ' + this.pdffecha,
					this.director,
					this.nadelegado,
					this.naadmin,
					new Intl.DateTimeFormat('es-US', { month: 'long' }).format(new Date()),
					(this.url + 'obtener_portada/' + this.imagen).toString(),
					admtitulo,
					genero
				);
			} else {
				if(val.includes('A')||val.includes('B')||val.includes('C')||val.includes('D')||val.includes('E')||val.includes('F')){
					$('#btncursos' + val).hide();
					TableUtil.exportToPdf(
						val.toString(),
						this.pdffecha.toString(),
						'Curso: ' + val,
						this.director,
						this.nadelegado,
						this.naadmin,
						new Intl.DateTimeFormat('es-US', { month: 'long' }).format(new Date()),
						(this.url + 'obtener_portada/' + this.imagen).toString(),
						admtitulo,
						genero
					);
					$('#btncursos' + val).show();

				}else{

					this.mostar=0;
					$('#btncursos' + val).hide();
					genero={0:0,1:0,2:0}
					this.constpagospension.forEach((element:any) => {
						if(element.label==val+'A'||element.label==val+'B'||element.label==val+'C'||element.label==val+'D'||element.label==val+'E'||element.label==val+'F'){
							genero[0]=genero[0]+element.genero[0];
							genero[1]=genero[1]+element.genero[1];
							genero[2]=genero[2]+element.genero[2];
						}
					});
					setTimeout(() => {
						TableUtil.exportToPdf(
							val.toString(),
							this.pdffecha.toString(),
							'Curso: ' + val,
							this.director,
							this.nadelegado,
							this.naadmin,
							new Intl.DateTimeFormat('es-US', { month: 'long' }).format(new Date()),
							(this.url + 'obtener_portada/' + this.imagen).toString(),
							admtitulo,
							genero
						);
					}, 100);
					
					setTimeout(() => {
							
					$('#btncursos' + val).show();
					this.mostar=1;
					}, 100);
				}
				
			}
		}
	}
	getCount(name:any) {
		var aux=Object.assign(this.pagos_estudiante);
		//console.log(aux[0],name,aux[0].curso+aux[0].paralelo,aux[0].detalle[0], (aux[0].curso+aux[0].paralelo).toString() === name);
		return aux.filter((o:any) => (o.curso+o.paralelo).toString() === name&&o.detalle[0].porpagar==0).length;
	  }

	  getCountno(name:any) {
		var aux=Object.assign(this.pagos_estudiante);
		return aux.filter((o:any) => (o.curso+o.paralelo).toString() === name&&o.detalle[0].porpagar!=0).length;
	  }
	  getCountTotal(name:any) {
		var aux=Object.assign(this.pagos_estudiante);
		return aux.filter((o:any) => (o.curso).toString() === name&&o.detalle[0].porpagar==0).length;
	  }

	  getCountnoTotal(name:any) {
		
		var aux=Object.assign(this.pagos_estudiante);
		return aux.filter(o => (o.curso).toString() === name&&o.detalle[0].porpagar!=0).length;
	  }
	  sumarvalores(valores:any){
		var suma=0;
		valores.forEach((element:any) => {
			if(this.isNumber(element.valor)){
				suma=element.valor+suma;
			}
		});
		return suma
	  }
	  sumarrecuadado(indice:any, label:any){
		var suma=0;
		var aux=Object.assign(this.pagos_estudiante);
		if(indice!=12){
			aux.forEach((element:any) => {
			
				if((element.curso+element.paralelo).toString() === label && element.detalle[indice].valor>=0){
					suma=element.detalle[indice].valor+suma;
				}
			});
		}else{
			aux.forEach((element:any) => {
			
				if((element.curso+element.paralelo).toString() === label ){
					element.detalle.forEach((elementdt:any) => {
						
						suma=elementdt.valor+suma;
					});
					
				}
			});
		}
		
		return suma
	  }

	estadoadministrativo(): void {
		this.load_data_est = true;
		this.load_ventas = false;
		this.load_documentos = false;
		this.load_estudiantes = false;
		this.load_registro = false;
		this.load_administrativo = true;
		this._adminService.listar_registro(this.token).subscribe((response) => {
			this.resgistro_arr = response.data;
			this.resgistro_const = response.data;
			this.load_data_est = false;
		});
	}
	filtrar_documento() {
		this.load_data_est = true;
		if (this.filtro) {
			var term = new RegExp(this.filtro.toString().trim(), 'i');
			this.resgistro_arr = this.resgistro_const.filter(
				(item) => term.test(item.admin.email) || term.test(item.tipo) || term.test(item.createdAt)
			);
		} else {
			this.resgistro_arr = this.resgistro_const;
		}
		this.load_data_est = false;
	}
}
