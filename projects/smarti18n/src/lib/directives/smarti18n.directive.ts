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
	@Input('smarti18nParams') variables: any = null;
	@Input('smarti18nToCount') toCount: number = null;

	/**
	 * Property used to track and automatically unsubscribe all subscriptions on the component.
	 */
	private unsubscribe = new Subject<void>();

	private dotNotationRegex = /(^\w+((\.\w+)?)+[^\.]$)/;

	/**
	 *Creates an instance of Smarti18nDirective.
	 * @param hostEl
	 * @param smarti18nService
	 * @memberof Smarti18nDirective
	 */
	constructor(
		private hostEl: ElementRef,
		private smarti18nService: Smarti18nService
	) {}

	/**
	 * Init method - called by @angular
	 * @memberof Smarti18nDirective
	 */
	public ngOnInit(): void {
		this.isValidDotNotation(this.jsonMap);

		this.smarti18nService.onLocaleChanged
		.pipe(takeUntil(this.unsubscribe))
		.subscribe(() => this.translate());
	}

	/**
	 * destroy method - called by @angular
	 * @memberof Smarti18nDirective
	 */
	public ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}

	/**
	 * On changes method - called by @angular
	 * @param changes Changes object
	 * @memberof Smarti18nDirective
	 */
	ngOnChanges(changes: SimpleChanges): void {
		if (changes.currentValue !== changes.previousValue)
			this.isValidDotNotation(this.jsonMap);
			this.translate();
	}

	/**
	 * validates if the current dot notation is valid
	 * @param jsonMap The map to the translation object key.
	 * @returns True if it was a valid dot notation
	 * @memberof Smarti18nDirective
	 */
	private isValidDotNotation(jsonMap: string): boolean {
		if (!this.dotNotationRegex.test(jsonMap))
			throw new Error('Wrong dot-notation map format!');
		return true;
	}

	/**
	 * Does the actual translation and changing of DOM
	 * @memberof Smarti18nDirective
	 */
	private translate(): void {
		const translation = this.smarti18nService.getTranslation(this.jsonMap, this.variables, this.toCount);

		this.hostEl.nativeElement.innerText = translation || '';
	}
}
