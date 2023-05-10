import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/service/admin.service';
import Chart, { ChartDataset } from 'chart.js/auto';
import { TableUtil } from './tableUtil';
import { GLOBAL } from 'src/app/service/GLOBAL';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import * as pako from 'pako';

//import * as pdfMake from "pdfmake/build/pdfmake";
//import * as pdfFonts from 'pdfmake/build/vfs_fonts';

//(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

declare var iziToast: any;
declare var $: any;
interface Retirado {
	matricula: number;
	paga_mat: number;
	meses: number;
	condicion_beca: string;
	_id: string;
	idestudiante: {
	  estado: string;
	  _id: string;
	  nombres: string;
	  apellidos: string;
	  anio_desac: string;
	  f_desac: string;
	};
	val_beca:any,
	desc_beca:any,
	num_mes_res:any,
	num_mes_beca:any,
	anio_lectivo: string;
	curso: string;
	paralelo: string;
  }

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



	public actualizar_dashest=false;



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

	public recaudado: any = [];
	public myChart: Chart<'bar', number[], string> | any;
	public myChart3: Chart<'bar', number[], string> | any;
	public pagado = 0;
	public porpagar = 0;
	public deteconomico: any = [];
	public cursos: any = [];
	public cursos2: any = [];
	public casharray:any=['item','ref1','cedula','modena','valor','ref2','ref3','concepto','ref4','cedula2','alumno'];
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
				this.estadoestudiante();
			
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
			//console.log(response.data);
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
				//console.log(this.documentos);
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
		this.pagos_estudiante=undefined
		this.estudiantes=undefined
		this.arr_becas=undefined
		this.penest=undefined
		this.cursos=undefined
		this.pagospension=undefined
		this.porpagar=undefined
		this.pagado=undefined
		this.cursos2=undefined
		this.deteconomico=undefined
		this.pagospension=undefined

		let auxpen = [];
		this._adminService.obtener_config_admin(this.token).subscribe((responese) => {
			this.config = responese.data.map((item:any)=>{
				return{
					anio_lectivo:item.anio_lectivo,
					extrapagos:item.extrapagos,
					label:item.label,
					matricula:item.matricula,
					mescompleto	:item.mescompleto,
					numpension :item.numpension,
					pension	:item.pension,
					_id: item._id
				}
			});
			
			//console.log(this.config);
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
	actualizar_estudiante(){
		this.actualizar_dashest=true;
		this.active=-1;
		console.log("Actualizar");
		this.detalle_data(0);
	}
	public horaact:any;
	detalle_data(val: any) {
		if (this.active != val) {
			this.active = val;
			if (this.myChart3) {
				this.myChart3.destroy();
				
			}
			this.load_data_est = true;
			this.nmt = 0;
			this.nmt = this.config[val].numpension
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
			costopension = this.config[val].pension;
			if(this.config[val].extrapagos){
				var extrapagos= JSON.parse(this.config[val].extrapagos);
				extrapagos.forEach((element:any) => {
					costosextrapagos+=element.valor;
				});
			}
			
		
			costomatricula = this.config[val].matricula;
			if(this.actualizar_dashest==false){
				let sigu=true;
				//console.log(localStorage.getItem('dia'));
				if(localStorage.getItem('dia')){

					this.horaact=new Date(JSON.parse(localStorage.getItem('dia')));
					//console.log(this.horaact);
					if((new Date().getTime()-new Date(this.horaact).getTime())<3600000&&
						localStorage.getItem('pagos_estudiante')&&
						localStorage.getItem('estudiantes')&&
						localStorage.getItem('arr_becas')&&
						localStorage.getItem('penest')&&
						localStorage.getItem('cursos')&&
						localStorage.getItem('pagospension')&&
						localStorage.getItem('porpagar')&&
						localStorage.getItem('pagado')&&
						localStorage.getItem('cursos2')&&
						localStorage.getItem('deteconomico')&&
						localStorage.getItem('pagospension')){

				

						this.pagos_estudiante = JSON.parse( pako.inflate(new Uint8Array(atob(localStorage.getItem('pagos_estudiante')).split('').map(char => char.charCodeAt(0))), { to: 'string' }) );
						//console.log(this.pagos_estudiante);
						this.estudiantes = JSON.parse( pako.inflate(new Uint8Array(atob(localStorage.getItem('estudiantes')).split('').map(char => char.charCodeAt(0))), { to: 'string' }) );
						//console.log(this.estudiantes);
						this.arr_becas = JSON.parse( pako.inflate(new Uint8Array(atob(localStorage.getItem('arr_becas')).split('').map(char => char.charCodeAt(0))), { to: 'string' }) );
						//console.log(this.arr_becas);
						this.penest = JSON.parse( pako.inflate(new Uint8Array(atob(localStorage.getItem('penest')).split('').map(char => char.charCodeAt(0))), { to: 'string' }) );
						//console.log(this.penest);
						this.cursos = JSON.parse( pako.inflate(new Uint8Array(atob(localStorage.getItem('cursos')).split('').map(char => char.charCodeAt(0))), { to: 'string' }) );
						//console.log(this.cursos);
						this.pagospension = JSON.parse( pako.inflate(new Uint8Array(atob(localStorage.getItem('pagospension')).split('').map(char => char.charCodeAt(0))), { to: 'string' }) );
						//console.log(this.pagospension);
						this.porpagar = JSON.parse( pako.inflate(new Uint8Array(atob(localStorage.getItem('porpagar')).split('').map(char => char.charCodeAt(0))), { to: 'string' }) );
						//console.log(this.porpagar);
						this.pagado = JSON.parse( pako.inflate(new Uint8Array(atob(localStorage.getItem('pagado')).split('').map(char => char.charCodeAt(0))), { to: 'string' }) );
						//console.log(this.pagado);
						this.cursos2 = JSON.parse( pako.inflate(new Uint8Array(atob(localStorage.getItem('cursos2')).split('').map(char => char.charCodeAt(0))), { to: 'string' }) );
						//console.log(this.cursos2);
						this.deteconomico = JSON.parse( pako.inflate(new Uint8Array(atob(localStorage.getItem('deteconomico')).split('').map(char => char.charCodeAt(0))), { to: 'string' }) );
						//console.log(this.deteconomico);
						this.pagospension = JSON.parse( pako.inflate(new Uint8Array(atob(localStorage.getItem('pagospension')).split('').map(char => char.charCodeAt(0))), { to: 'string' }) );
						//console.log(this.pagospension);
						sigu=false;
						this.cargar_canvas3(costosextrapagos)
					}
				}
				//console.log(sigu);
				if(sigu){
					this._adminService.getDashboar_estudiante(this.token).subscribe(response=>{
					
						if(response.obj!=''&&response.ms=='' &&(new Date().getTime()-new Date(response.obj.dia).getTime())<3600000){
							//console.log(response.obj.hora);
							this.horaact=new Date(response.obj.dia);
							this.pagos_estudiante=response.obj.pagos_estudiante;
							this.estudiantes=response.obj.estudiantes;
							this.arr_becas=response.obj.arr_becas;
							this.penest=response.obj.penest;
							this.cursos=response.obj.cursos;
							this.pagospension=response.obj.pagospension;
							this.porpagar=response.obj.porpagar;
							this.pagado=response.obj.pagado;
							this.cursos2=response.obj.cursos2;
							this.deteconomico=response.obj.deteconomico;
							this.pagospension=response.obj.pagospension;
		
							this.cargar_canvas3(costosextrapagos)
						}else{
							this.actualizar_dashest=true
							
							this.armado_matriz(val,costosextrapagos,costopension,costomatricula);
							
	
					
						}
						
					});
				}
				
			}else{
				this.armado_matriz(val,costosextrapagos,costopension,costomatricula);
			}
			

			
			

		}
	}
	armado_matriz(val:any,costosextrapagos:any,costopension:any,costomatricula:any){
		if(this.actualizar_dashest==true){
			this._adminService
			.obtener_detallespagos_admin(this.token, this.config[val].anio_lectivo)
			.subscribe((response) => {
				this.estudiantes = response.data.map((item:any)=>{
					return{
						abono:item.abono,
						documento:item.documento,
						estado:item.estado,
						estudiante:item.estudiante,
						idpension:{
							anio_lectivo:item.idpension.anio_lectivo,
							condicion_beca:item.idpension.condicion_beca,
							curso:item.idpension.curso,
							extrapagos:item.idpension.extrapagos,
							idanio_lectivo:item.idpension.idanio_lectivo,
							idestudiante:item.idpension.idestudiante,
							matricula:item.idpension.matricula,
							meses:item.idpension.meses,
							paga_mat:item.idpension.paga_mat,
							paralelo:item.idpension.paralelo,
							_id:item.idpension._id,
						},
						pago :{
							dni_factura:item.pago.dni_factura,
							estado:item.pago.estado,
							total_pagar:item.pago.total_pagar,
							_id:item.pago._id,
						},
						tipo:item.tipo,
						valor: item.valor
					}
				});
				//console.log(this.estudiantes[1]);
					
					//this.nmt=10;
					this._adminService.obtener_becas_conf(this.config[val]._id, this.token)
					.subscribe((response) => {
						this.arr_becas=response.becas.map((item:any)=>{
							return{
								etiqueta:item.etiqueta,
								_id:item._id,
								usado:item.usado,
								idpension:{
									_id:item.idpension._id,
								}
							}
						});
						//console.log(this.arr_becas);
						this._adminService.listar_pensiones_estudiantes_tienda(this.token,this.config[val].anio_lectivo).subscribe((response) => {
							//console.log(response.data[109],response.data[1]);
							this.penest = response.data.map((item:any)=>{
								return{
									curso:item.curso,
									paralelo:item.paralelo,
									anio_lectivo:item.anio_lectivo,
									condicion_beca:item.condicion_beca,
									idestudiante:{
										apellidos:item.idestudiante.apellidos,
										nombres:item.idestudiante.nombres,
										f_desac:item.idestudiante.f_desac,
										estado:item.idestudiante.estado,
										genero:item.idestudiante.genero,
										dni:item.idestudiante.dni,
										_id:item.idestudiante._id,
										anio_desac:item.idestudiante.anio_desac
									},
									_id:item._id,
									val_beca:item.val_beca,
									desc_beca:item.desc_beca,
									paga_mat:item.paga_mat,
									matricula:item.matricula,
									meses:item.meses,
									num_mes_beca:item.num_mes_beca,
									num_mes_res:item.num_mes_res,
								}
							});
						//	console.log(this.penest[0]);
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
										
											let auxpagos = this.pagospension.find((elementpp:any)=>elementpp.label==element.curso + element.paralelo);
											if(auxpagos!=undefined){
												
												if(element.idestudiante.genero=="Masculino"){
													auxpagos.genero[0]++
												}else if(element.idestudiante.genero=="Femenino"){
													auxpagos.genero[1]++
												}else{
													auxpagos.genero[2]++
												}
												auxpagos.num = auxpagos.num + 1;
												
												if (element.condicion_beca == 'Si') {
												
														for (var i = 1; i <= this.nmt; i++) {
															
																if (this.arr_becas.find(elementbecas=>elementbecas.idpension._id==element._id&&elementbecas.etiqueta==(i).toString())!=undefined) {
																	
																	auxpagos.data[1] =  element.val_beca + auxpagos.data[1];
																	this.porpagar = element.val_beca+this.porpagar;

																} else {
																	
																	auxpagos.data[1] = this.config[val].pension+auxpagos.data[1];
																	this.porpagar = this.config[val].pension+this.porpagar;
																}	
														}

														if (element.paga_mat == 0) {
															
															auxpagos.data[1] = costosextrapagos + this.config[val].matricula+auxpagos.data[1];
															this.porpagar = this.config[val].matricula+costosextrapagos+this.porpagar;
														}
													
												} else {
														auxpagos.data[1] =
															auxpagos.data[1] + costosextrapagos+
															(this.nmt * this.config[val].pension) +
															this.config[val].matricula;

														this.porpagar = (this.nmt * this.config[val].pension) + costosextrapagos + this.config[val].matricula +this.porpagar;
													
												}
											}
											
										
									}
								});
								//Conteo de pagos
								this.estudiantes.forEach((element) => {
									if (element.tipo <= this.nmt || element.tipo>=25 && (element.pago.estado=="Registrado"||element.pago.estado=="Emitido")) {

										if (
											new Date(this.config[val].anio_lectivo).getTime() ==
											new Date(element.idpension.anio_lectivo).getTime()
										) {

											let auxpagosd = this.pagospension.find((elementpp:any)=>elementpp.label==element.idpension.curso + element.idpension.paralelo);	
											let estudiante_estado = this.penest.find((elementee:any)=>elementee.idestudiante._id==element.estudiante);
											if(estudiante_estado.idestudiante.estado=='Desactivado'&& new Date(estudiante_estado.idestudiante.anio_desac).getTime() ==new Date(this.config[val].anio_lectivo).getTime()){
												
											}else{
												auxpagosd.data[0] = auxpagosd.data[0] + element.valor;
												auxpagosd.data[1] = auxpagosd.data[1] - element.valor;

												this.pagado = this.pagado+element.valor;
												this.porpagar = this.porpagar - element.valor;
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

							this.cargar_canvas3(costosextrapagos);
	
						});
					});
				


			});
		}
		
	}
	cargar_canvas3(costosextrapagos:any){
		
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
		if(this.actualizar_dashest==true){
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
		}
		

		this.deteconomico.forEach((element: any) => {
			this.myChart3.data.datasets.push(element);
		});

		
		//this.pagospension = this.pagospension;
		this.armado(10, this.active,costosextrapagos);
		this.myChart3.update();
		this.load_data_est = false;
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
		
			this.pensionesestudiantearmado = this.penest;
			this.detalles = this.estudiantes;
			this.auxbecares = 0;
			this.total_pagar = 0;
			

		if(this.actualizar_dashest==true){
			this.pagos_estudiante= [];
			//console.log(this.pensionesestudiantearmado);
			//console.log(this.detalles);
			
			this.pensionesestudiantearmado.forEach((elementpent: any, index: any) => {
	
				
				/*this._adminService.obtener_becas_conf(elementpent._id, this.token)
				.subscribe((response) => {
					this.arr_becas=Object.assign(response.becas);*/
	
					this.idexpension = index;
					var f = elementpent.anio_lectivo;
					let auxtiempo=0;
					if(elementpent.idestudiante.estado!="Desactivado"){
						//console.log(elementpent.idestudiante)
						//auxtiempo=new Date(elementpent.idestudiante.f_desac).getMonth()-new Date(elementpent.idestudiante.anio_desac).getMonth();
					
						auxtiempo=tiempo;
						if(auxtiempo<0){
							auxtiempo=0;
						}
	
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
										var porpagar=0
										
											porpagar = this.config[idxconfi].pension - valor;
										
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
										if(j>auxtiempo){
											porpagar=0
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
										if(j>auxtiempo){
											porpagar=0
										}
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
						
							this.pagos_estudiante.push({
								nombres: (elementpent.idestudiante.apellidos + ' ' + elementpent.idestudiante.nombres).toString(),
								curso: elementpent.curso,
								paralelo: elementpent.paralelo,
								detalle: this.pagopension,
								estado: elementpent.idestudiante.estado,
								dni:elementpent.idestudiante.dni
							});
						
						
						
					
					}


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
			
			this.guardardashboard_estudiante();
		}
		this.retirados();
		//console.log(this.pagos_estudiante);
		

	}
	
	  

	public retirados_arr:Retirado[]= [] ;
	ordenarPor(columna: string): void {
		//this.load_data_est = true;
		if(columna=='curso'){
			this.retirados_arr.sort((a:any, b:any) => {
				if (parseInt(a[columna])< parseInt(b[columna]) ) {
					return -1; // a debe aparecer antes que b
				  } else if (parseInt(a[columna])> parseInt(b[columna]) ) {
					return 1; // b debe aparecer antes que a
				  } else {
					if (a.paralelo < b.paralelo) {
					  return -1; // a debe aparecer antes que b
					} else if (a.paralelo > b.paralelo) {
					  return 1; // b debe aparecer antes que a
					} else {
					  return 0; // a y b son iguales
					}
				  }
			  });
		}else if(columna=='f_desac'){
			this.retirados_arr.sort((a:any, b:any) => {
				if ( a.idestudiante[columna]!=undefined && b.idestudiante[columna]!=undefined && new Date( a.idestudiante[columna] ).getTime()>new Date(b.idestudiante[columna]).getTime() ) {
				  return 1;
				} else if (a.idestudiante[columna]!=undefined && b.idestudiante[columna]!=undefined &&new Date( a.idestudiante[columna] ).getTime() < new Date(b.idestudiante[columna]).getTime()) {
				  return -1;
				} else {
				  return 0;
				}
			  });
		}else{
			this.retirados_arr.sort((a:any, b:any) => {
				if ( a.idestudiante[columna]!=undefined && b.idestudiante[columna]!=undefined && a.idestudiante[columna] > b.idestudiante[columna]) {
				  return 1;
				} else if (a.idestudiante[columna]!=undefined && b.idestudiante[columna]!=undefined && a.idestudiante[columna] < b.idestudiante[columna]) {
				  return -1;
				} else {
				  return 0;
				}
			  });
		}
	
		//this.load_data_est = false;
	  }
	
	retirados(){
		this.retirados_arr=[]as any;
		this.penest.forEach((element:any) => {
			if(new Date(element.anio_lectivo).getTime() == new Date(this.fbeca).getTime()
			 &&	element.idestudiante.estado == 'Desactivado' &&	new Date(element.anio_lectivo).getTime()
				==new Date(element.idestudiante.anio_desac).getTime()
			){
				this.retirados_arr.push(element);
			}
		});
		//console.log(this.retirados_arr);
	}

	exportarcash(){
		const json:any=[]
		var j=1;
		this.pagos_estudiante.forEach((element:any) => {
			if(this.sumarcash(element.detalle)>0 &&element.estado!='Desactivado'){
				var auxsuma=this.sumarcash(element.detalle)
				auxsuma= parseFloat((auxsuma).toFixed(2))*100
				json.push({'Item':j,'Ref':'CO','Cedula':element.dni,'Modena':'USD','Valor':auxsuma,'Ref1':'REC','Ref2':'','Ref3':'','Concepto':'PENSION DE '+ (this.meses[ new Date(new Date(this.fbeca).setMonth( new Date(this.fbeca).getMonth()+this.nmt-1)).getMonth()]).toUpperCase(),'Ref4':'C','Cedula2':element.dni,'Alumno':element.nombres});
				j++;
			}
		});
		
		//= this.pagos_estudiante; // Reemplaza "this.data" con el nombre de tu variable que contiene los datos en formato JSON
		const worksheet = XLSX.utils.json_to_sheet(json);
		const workbook = { Sheets: { 'cash': worksheet }, SheetNames: ['cash'] };
		const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
		const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
		const fileName = 'cash_'+this.meses[new Date().getMonth()]+'_'+this.pdffecha+'.xlsx';
		saveAs(blob, fileName); // La función saveAs es parte de la librería "file-saver", debes instalarla e importarla para que funcione.
	  }
	  public auxdasboarestudiante: any = {};
	guardardashboard_estudiante(){
		if(this.active==0){
			/*if (navigator.storage && navigator.storage.estimate) {
				navigator.storage.estimate().then((estimate) => {
				  console.log(`El almacenamiento disponible es de ${estimate.quota} bytes.`);
				  console.log(`Se están utilizando ${estimate.usage} bytes.`);
				});
			  } else {
				console.log('El API de storage no está disponible en este navegador.');
			  }*/
			
			this.auxdasboarestudiante.dia=new Date();
			this.auxdasboarestudiante.pagos_estudiante=this.pagos_estudiante;
			this.auxdasboarestudiante.estudiantes=this.estudiantes;
			this.auxdasboarestudiante.arr_becas=this.arr_becas;
			this.auxdasboarestudiante.penest=this.penest;
			this.auxdasboarestudiante.cursos=this.cursos;
			this.auxdasboarestudiante.pagospension=this.pagospension;
			this.auxdasboarestudiante.porpagar=this.porpagar;
			this.auxdasboarestudiante.pagado=this.pagado;
			
			this.auxdasboarestudiante.cursos2=this.cursos2;
			this.auxdasboarestudiante.deteconomico=this.deteconomico;
			this.auxdasboarestudiante.pagospension=this.pagospension;
			
			let fileContent =JSON.stringify(this.auxdasboarestudiante);
			// Convertir objeto a string JSON
	
	
			localStorage.setItem('dia',JSON.stringify(this.auxdasboarestudiante.dia));
	
			localStorage.setItem('pagos_estudiante',btoa(String.fromCharCode.apply(null, pako.deflate(JSON.stringify(this.auxdasboarestudiante.pagos_estudiante)))));
	
			localStorage.setItem('estudiantes',btoa(String.fromCharCode.apply(null, pako.deflate(JSON.stringify(this.auxdasboarestudiante.estudiantes)))) );
	
			localStorage.setItem('arr_becas',btoa(String.fromCharCode.apply(null, pako.deflate(JSON.stringify(this.auxdasboarestudiante.arr_becas)))) );
	
			localStorage.setItem('penest',btoa(String.fromCharCode.apply(null, pako.deflate(JSON.stringify(this.auxdasboarestudiante.penest)))) );
	
			localStorage.setItem('cursos',btoa(String.fromCharCode.apply(null, pako.deflate(JSON.stringify(this.auxdasboarestudiante.cursos)))) );
	
			localStorage.setItem('pagospension', btoa(String.fromCharCode.apply(null, pako.deflate(JSON.stringify(this.auxdasboarestudiante.pagospension)))));
	
			localStorage.setItem('porpagar',btoa(String.fromCharCode.apply(null, pako.deflate(JSON.stringify(this.auxdasboarestudiante.porpagar)))));
			
			localStorage.setItem('pagado', btoa(String.fromCharCode.apply(null, pako.deflate(JSON.stringify(this.auxdasboarestudiante.pagado)))));
	
			localStorage.setItem('cursos2',btoa(String.fromCharCode.apply(null, pako.deflate(JSON.stringify(this.auxdasboarestudiante.cursos2)))) );
	
			localStorage.setItem('deteconomico',btoa(String.fromCharCode.apply(null, pako.deflate(JSON.stringify(this.auxdasboarestudiante.deteconomico)))) );
	
			localStorage.setItem('pagospension',btoa(String.fromCharCode.apply(null, pako.deflate(JSON.stringify(this.auxdasboarestudiante.pagospension)))) );
			
			
			this._adminService.actualizzas_dash(this.token,this.auxdasboarestudiante).subscribe(response=>{
				
				console.log("Guardado",response)
				if(response.message=='Guardado con exito'){
					this.horaact=new Date();
				}
			});
		}
		
	}

	public url = GLOBAL.url;
	public mostar=1;
	exportTabletotal(val: any) {
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
				(this.url + 'obtener_portada/' + this.imagen).toString(),
				admtitulo
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
			this.pagospension.forEach((element:any) => {
				genero[0]=genero[0]+element.genero[0];
				genero[1]=genero[1]+element.genero[1];
				genero[2]=genero[2]+element.genero[2];
			});
			this.mostar=0;
			//$('#btncursos'+val).hide();
			this.pagospension.forEach((element: any) => {
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
			this.pagospension.forEach((element: any) => {
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
				this.retirados_arr.forEach((element:any) => {
					if(element.idestudiante.genero=='Masculino'){
						genero[0]++;
					}else if(element.idestudiante.genero=='Femenino'){
						genero[1]++;
					}else{
						genero[2]++;
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
					this.pagospension.forEach((element:any) => {
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
	  sumarcash(valores:any){
		var suma=0;
		for(var i=0; i<=this.nmt;i++){
			if(this.isNumber(valores[i].porpagar)){
				suma=valores[i].porpagar+suma;
			}
		}
		return suma
		}
	  sumarrecuadado(indice:any, label:any){
		var suma=0;
		var aux=Object.assign(this.pagos_estudiante);
		if(indice!=12){
			aux.forEach((element:any) => {
				
				try {
					if((element.curso+element.paralelo).toString() === label && element.detalle[indice] && element.detalle[indice].valor>=0){
						suma=element.detalle[indice].valor+suma;
					}	
				} catch (error) {
					//console.log(element);
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
