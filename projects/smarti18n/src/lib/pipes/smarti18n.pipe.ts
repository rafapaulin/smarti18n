import { Pipe, PipeTransform, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Smarti18nService } from '../services/smarti18n.service';

@Pipe({
	name: 'smarti18n',
	pure: false
})
export class Smarti18nPipe implements PipeTransform, OnInit, OnDestroy {
	private value: any;
	private transformed: string;
	private unsubscribeAll = new Subject();

	constructor(private smarti18n: Smarti18nService) { }

	public ngOnInit(): void {
		this.smarti18n
			.onLocaleChanged
			.pipe(takeUntil(this.unsubscribeAll))
			.subscribe(_ => this.transformed = this.smarti18n.getTranslation(this.value));
	}
	public ngOnDestroy(): void {
		this.unsubscribeAll.next();
		this.unsubscribeAll.complete();
	}

	transform(value: any, args?: any): any {
		if (this.value !== value) {
			this.value = value;
			this.transformed = this.smarti18n.getTranslation(this.value);
		}
		return this.transformed;
	}
}
