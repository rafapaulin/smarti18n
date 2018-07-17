import { Pipe, PipeTransform, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Smarti18nService } from '../services/smarti18n.service';
import { ObjectUtils } from '../utils';

@Pipe({
	name: 'smarti18n',
	pure: false
})

export class Smarti18nPipe implements PipeTransform, OnDestroy {
	private path: string;
	private transformed: string;
	private unsubscribeAll: Subject<any>;
	private vars: any;
	private count: number;

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
	 * @param {*} vars ```Key:Value``` pairs object for localized interpolation
	 * @param {number} count Value to be taken in account in the pluralization process
	 * @returns {string} translated string.
	 * @memberof Smarti18nPipe
	 */
	public transform(value: string, vars: any = null, count?: number): string {
		if (!this.unsubscribeAll)
			this.init();

		if (
			this.path !== value ||
			this.varsPropertyHasChanged(vars) ||
			(ObjectUtils.isTruthy(this.count) && ObjectUtils.isTruthy(count) && this.count !== count)
		) {
			this.vars = vars;
			this.path = value;
			this.count = count;
			this.transformed = this.smarti18n.getTranslation(this.path, this.vars, this.count);
		}

		return this.transformed;
	}

	/**
	 * Checks if any of the properties of the vars object has changed.
	 * @param {*} vars ```Key:Value``` pairs object for localized interpolation.
	 * @returns {boolean} True if there is any change do the value of the properties.
	 * @memberof Smarti18nPipe
	 */
	private varsPropertyHasChanged(vars: any): boolean {
		if (this.vars && vars)
			for (const key in Object.keys(this.vars))
				if (this.vars[key] !== vars[key])
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
			.subscribe(locale => this.transformed = this.smarti18n.getTranslation(this.path, this.vars, this.count));
	}
}
