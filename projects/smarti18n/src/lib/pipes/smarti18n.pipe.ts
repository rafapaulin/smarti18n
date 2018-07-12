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

	/**
	 *Creates an instance of Smarti18nPipe.
	 * @param {Smarti18nService} smarti18n
	 * @memberof Smarti18nPipe
	 */
	constructor(private smarti18n: Smarti18nService) { }

	/**
	 * destroy method - called by @angular
	 *
	 * @memberof Smarti18nPipe
	 */

	public ngOnDestroy(): void {
		this.unsubscribeAll.next();
		this.unsubscribeAll.complete();
	}

	/**
	 * localizes the input
	 *
	 * @param {string} value 		dot notation localizable path
	 * @param {*} [args] 			args for localized interpolation
	 * @returns {string}
	 * @memberof Smarti18nPipe
	 */
	public transform(value: string, args?: any): string {
		console.log('transform', { value });
		if (!this.unsubscribeAll) {
			this.init();
		}
		if (this.path !== value) {
			this.path = value;
			this.transformed = this.smarti18n.getTranslation(this.path);
		}
		return this.transformed;
	}

	/**
	 * init method
	 *
	 * @memberof Smarti18nPipe
	 */
	private init(): void {
		this.unsubscribeAll = new Subject();
		this.smarti18n
			.onLocaleChanged
			.pipe(takeUntil(this.unsubscribeAll))
			.subscribe(locale => this.transformed = this.smarti18n.getTranslation(this.path));
	}

}
