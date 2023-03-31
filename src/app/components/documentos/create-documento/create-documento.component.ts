import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/service/admin.service';
declare var iziToast: any;
declare var $: any;

@Component({
	selector: 'app-create-documento',
	templateUrl: './create-documento.component.html',
	styleUrls: ['./create-documento.component.css'],
})
export class CreateDocumentoComponent implements OnInit {
	public documento: any = {};
	public imgSelect: any;
	public categorias: Array<any> = [];
	public config: any = {};
	public load_btn = false;
	public file: any = undefined;

	public arr_etiquetas: Array<any> = [];
	public token = localStorage.getItem('token');
	public new_etiqueta = '';
	public load_data_etiqueta = false;
	public etiquetas: Array<any> = [];

	constructor(private _adminService: AdminService, private _router: Router) {
		this.config = {
			height: 500,
		};
	}

	ngOnInit(): void {}

	fileChangeEvent(event: any): void {
		var file: any;
		if (event.target.files && event.target.files[0]) {
			file = <File>event.target.files[0];
		} else {
			iziToast.show({
				title: 'ERROR',
				titleColor: '#FF0000',
				color: '#FFF',
				class: 'text-danger',
				position: 'topRight',
				message: 'No hay un imagen de envio',
			});
		}

		if (file.size <= 4000000) {
			if (file.type == 'pdf' || file.type == 'image/png' || file.type == 'image/jpg') {
				const reader = new FileReader();
				reader.onload = (e) => (this.imgSelect = reader.result);
				////console.log(this.imgSelect);

				reader.readAsDataURL(file);

				$('#input-portada').text(file.name);
				this.file = file;
			} else {
				iziToast.show({
					title: 'ERROR',
					titleColor: '#FF0000',
					color: '#FFF',
					class: 'text-danger',
					position: 'topRight',
					message: 'El archivo debe ser una imagen',
				});
				$('#input-portada').text('Seleccionar imagen');
				this.imgSelect = 'assets/img/01.jpg';
				this.file = undefined;
			}
		} else {
			iziToast.show({
				title: 'ERROR',
				titleColor: '#FF0000',
				color: '#FFF',
				class: 'text-danger',
				position: 'topRight',
				message: 'La imagen no puede superar los 4MB',
			});
			$('#input-portada').text('Seleccionar imagen');
			this.imgSelect = 'assets/img/01.jpg';
			this.file = undefined;
		}

		////console.log(this.file);
	}
	registro(registroForm: any) {
		if (registroForm.valid) {
			this.load_btn = true;

			this._adminService.registro_documento_admin(this.documento, this.token).subscribe(
				(response) => {
					if (response.data == undefined) {
						iziToast.show({
							title: 'ERROR',
							titleColor: '#FF0000',
							color: '#FFF',
							class: 'text-danger',
							position: 'topRight',
							message: response.message,
						});
						this.load_btn = false;
					} else {
						iziToast.show({
							title: 'SUCCESS',
							titleColor: '#1DC74C',
							color: '#FFF',
							class: 'text-success',
							position: 'topRight',
							message: 'Se registro correctamente el nuevo documento.',
						});
						this.load_btn = false;

						this._router.navigate(['/documentos']);
					}
				},
				(error) => {
					this.load_btn = false;
				}
			);

			this.load_btn = false;
		} else {
			iziToast.show({
				title: 'ERROR',
				titleColor: '#FF0000',
				color: '#FFF',
				class: 'text-danger',
				position: 'topRight',
				message: 'Los datos del formulario no son validos',
			});
			this.load_btn = false;
		}
	}
	/*
  registro(registroForm:any){
    if(registroForm.valid){
      
        this.load_btn = true;
        
        this._adminService.registro_documento_admin(this.documento,this.file,this.token).subscribe(
          response=>{
  
            if(response.data == undefined){
              iziToast.show({
                  title: 'ERROR',
                  titleColor: '#FF0000',
                  color: '#FFF',
                  class: 'text-danger',
                  position: 'topRight',
                  message: response.message
              });
              this.load_btn = false;
            }else{
              iziToast.show({
                  title: 'SUCCESS',
                  titleColor: '#1DC74C',
                  color: '#FFF',
                  class: 'text-success',
                  position: 'topRight',
                  message: 'Se registro correctamente el nuevo documento.'
              });
              this.load_btn = false;

              this._router.navigate(['/documentos']);
            }
          },
          error=>{
            this.load_btn = false;
          }
        );

        this.load_btn = false;
      
      
    }else{

      iziToast.show({
          title: 'ERROR',
          titleColor: '#FF0000',
          color: '#FFF',
          class: 'text-danger',
          position: 'topRight',
          message: 'Los datos del formulario no son validos'
      });
      this.load_btn = false;

      
    }
  }
*/
}
