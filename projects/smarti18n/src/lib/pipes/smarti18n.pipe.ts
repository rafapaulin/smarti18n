import { Pipe, PipeTransform, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Smarti18nService } from '../services/smarti18n.service';

@Pipe({
	name: 'smarti18n',
	pure: false
})

export class Smarti18nPipe implements PipeTransform, OnDestroy {
	private path: string;
	private transformed: string;
	private unsubscribeAll: Subject<any>;
	private args: any;

	/**
	 * Creates an instance of Smarti18nPipe.
	 * @param {Smarti18nService} smarti18n
	 * @memberof Smarti18nPipe
	 */
	constructor(private smarti18n: Smarti18nService) { }

	/**
	 * Destroy method - called by @angular
	 * @memberof Smarti18nPipe
	 */
	public ngOnDestroy(): void {
		this.unsubscribeAll.next();
		this.unsubscribeAll.complete();
	}

	/**
	 * Localizes the input
	 * @param {string} value dot notation localizable path
	 * @param {*} args ```Key:Value``` pairs object for localized interpolation
	 * @returns {string}
	 * @memberof Smarti18nPipe
	 */
	public transform(value: string, args: any = null): string {
		if (!this.unsubscribeAll)
			this.init();

		if (this.path !== value || this.argsPropertyHasChanged(args)) {
			this.args = args;
			this.path = value;
			this.transformed = this.smarti18n.getTranslation(this.path, args);
		}

		return this.transformed;
	}

	/**
	 * Checks if any of the properties of the args object has changed.
	 * @param {*} args ```Key:Value``` pairs object for localized interpolation.
	 * @returns {boolean} True if there is any change do the value of the properties.
	 * @memberof Smarti18nPipe
	 */
	private argsPropertyHasChanged(args: any): boolean {
		if (this.args && args)
			for (const key in Object.keys(this.args))
				if (this.args[key] !== args[key])
					return true;
		else
			return true;

		return false;
	}

	/**
	 * Init method
	 * @memberof Smarti18nPipe
	 */
	private init(): void {
		this.unsubscribeAll = new Subject();
		this.smarti18n
			.onLocaleChanged
			.pipe(takeUntil(this.unsubscribeAll))
			.subscribe(locale => this.transformed = this.smarti18n.getTranslation(this.path, this.args));
	}
}
