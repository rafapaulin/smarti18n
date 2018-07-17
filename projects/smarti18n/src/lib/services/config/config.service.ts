import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

import { Smarti18nConfigModel as Config, ConfigChange } from '../../models';

@Injectable({
	providedIn: 'root'
})
export class ConfigService {
	private _config: Config = {};
	private configChanged = new Subject<ConfigChange>();
	public get config(): Config { return this._config; }
	public get onConfigChanged(): Observable<ConfigChange> { return this.configChanged.asObservable(); }

	/**
	 * Creates an instance of ConfigService.
	 * @memberof ConfigService
	 */
	constructor() {}

	/**
	 * apply changes to the config
	 * @param newConfig Config changes to apply
	 * @memberof ConfigService
	 */
	applyConfig(newConfig: Config): void {
		this._config = { ...this._config, ...newConfig };
		this.configChanged.next({
			changes: newConfig,
			config: this._config
		});
	}
}
