import {
	Directive,
	Input,
	OnInit,
	ElementRef,
	OnChanges,
	SimpleChanges,
	OnDestroy
} from '@angular/core';
import { Smarti18nService } from '../services/smarti18n.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Directive({
	selector: '[smarti18n]'
})

export class Smarti18nDirective implements OnInit, OnChanges, OnDestroy {
	@Input('smarti18n') jsonMap: string;
	@Input('smarti18nParams') variables: any;

	/**
	 * Property used to track and automatically unsubscribe all subscriptions on the component.
	 */
	private unsubscribe = new Subject<void>();

	private dotNotationRegex = /(^\w+((\.\w+)?)+[^\.]$)/;

	constructor(
		private hostEl: ElementRef,
		private smarti18nService: Smarti18nService
	) {}

	ngOnInit() {
		this.isValidDotNotation(this.jsonMap);

		this.smarti18nService.onLocaleChanged
		.pipe(takeUntil(this.unsubscribe))
		.subscribe(() => {
			this.smarti18nService.getTranslation(this.jsonMap);
			this.hostEl.nativeElement.innerText =  this.smarti18nService.getTranslation(this.jsonMap);
		});
	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes.currentValue !== changes.previousValue)
			this.smarti18nService.getTranslation(this.jsonMap);
	}

	private isValidDotNotation(jsonMap: string) {
		if (!this.dotNotationRegex.test(jsonMap))
			throw new Error('Wrong dot-notation map format!');

		return true;
	}

	/**
	 * Destroy the component and unsubscribe from all observers.
	 */
	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}
}
