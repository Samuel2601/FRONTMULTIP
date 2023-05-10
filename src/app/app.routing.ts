import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { RegistroComponent } from './components/cuenta/registro/registro.component';
import { IndexEstudiantesComponent } from './components/estudiantes/index-estudiantes/index-estudiantes.component';
import { IndexDocumentoComponent } from './components/documentos/index-documento/index-documento.component';
import { CreateDocumentoComponent } from './components/documentos/create-documento/create-documento.component';
import { EditDocumentoComponent } from './components/documentos/edit-documento/edit-documento.component';
import { AuthGuard } from '../app/guards/auth.guard';

import { ConfigComponent } from './components/config/config.component';
import { IndexPagosComponent } from './components/pagos/index-pagos/index-pagos.component';
import { CreatePagosComponent } from './components/pagos/create-pagos/create-pagos.component';
import { ShowPagosComponent } from './components/pagos/show-pagos/show-pagos.component';

import { EditEstudianteComponent } from './components/estudiantes/edit-estudiante/edit-estudiante.component';

import { DetalleEstudianteComponent } from './components/estudiantes/detalle-estudiante/detalle-estudiante.component';
import { CreateEstudianteComponent } from './components/estudiantes/create-estudiante/create-estudiante.component';

import { IndexAdminComponent } from './components/administrativo/index-administrativo/index-administrativo.component';
import { EditAdminComponent } from './components/administrativo/edit-administrativo/edit-administrativo.component';
import { CreateAdminComponent } from './components/administrativo/create-administrativo/create-administrativo.component';

import { ForgotPasswordComponent } from './components/cuenta/forgot-password/forgot-password.component';
import { NewPasswordComponent } from './components/cuenta/new-password/new-password.component';
import { ControlComponent } from './components/cuenta/control/control.component';

import { EgresosComponent } from './components/egresos/egresos.component';
import { ProveedoresComponent } from './components/proveedores/proveedores.component';
const appRoute: Routes = [
	{ path: '', redirectTo: 'login', pathMatch: 'full' },

	{ path: 'egresos', component: EgresosComponent, canActivate: [AuthGuard] },
	{ path: 'proveedores', component: ProveedoresComponent, canActivate: [AuthGuard] },

	{ path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
	{ path: 'control', component: ControlComponent, canActivate: [AuthGuard] },
	{ path: 'login', component: LoginComponent },
	{ path: 'registrate', component: RegistroComponent },
	{ path: 'forgot-password', component: ForgotPasswordComponent },
	{
		path: 'new-password/:id',
		component: NewPasswordComponent,
	},
	{ path: 'estudiantes', component: IndexEstudiantesComponent, canActivate: [AuthGuard] },
	{
		path: 'estudiantes/create',
		component: CreateEstudianteComponent,
		canActivate: [AuthGuard],
	},
	{
		path: 'estudiantes/edit/:id',
		component: EditEstudianteComponent,
		canActivate: [AuthGuard],
	},
	{
		path: 'estudiantes/detalle/:id',
		component: DetalleEstudianteComponent,
		canActivate: [AuthGuard],
	},

	{ path: 'administrativo', component: IndexAdminComponent, canActivate: [AuthGuard] },
	{
		path: 'administrativo/create',
		component: CreateAdminComponent,
		canActivate: [AuthGuard],
	},
	{
		path: 'administrativo/edit/:id',
		component: EditAdminComponent,
		canActivate: [AuthGuard],
	},

	{ path: 'documentos', component: IndexDocumentoComponent, canActivate: [AuthGuard] },
	//{path: 'documentos/create', component: CreateDocumentoComponent, canActivate:[AuthGuard]},
	//{path: 'documentos/edit/:id', component: EditDocumentoComponent, canActivate:[AuthGuard]},

	{ path: 'pagos', component: IndexPagosComponent, canActivate: [AuthGuard] },
	{ path: 'pagos/create', component: CreatePagosComponent, canActivate: [AuthGuard] },
	{ path: 'pagos/:id', component: ShowPagosComponent, canActivate: [AuthGuard] },

	{ path: 'configuraciones', component: ConfigComponent, canActivate: [AuthGuard] },

	/* {path: '**', component: NotFoundComponent}, */
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders<any> = RouterModule.forRoot(appRoute);
