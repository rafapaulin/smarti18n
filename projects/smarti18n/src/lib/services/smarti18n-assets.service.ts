import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateRequestModel } from '../models/translate-request.model';

@Injectable()

export class Smarti18nAssets {
	constructor(
		private http: HttpClient
	) {}

	public getString(componentName: string) {
		return this.http.get(`/assets/i18n/${componentName}/default.i18n.json`);
	}
}
