import {
	Directive,
	Input,
	OnInit,
	ElementRef,
	OnChanges,
	SimpleChanges
} from '@angular/core';
import { Smarti18nService } from '../services/smarti18n.service';

@Directive({
	selector: '[smarti18n]'
})

export class Smarti18nDirective implements OnInit, OnChanges {
	@Input('smarti18n') jsonMap: string;
	@Input('smarti18nParams') variables: any;

	private dotNotationRegex = /(^\w+((\.\w+)?)+[^\.]$)/;

	constructor(
		private hostEl: ElementRef,
		private smarti18nService: Smarti18nService
	) {}

	ngOnInit() {
		this.isValidDotNotation(this.jsonMap);

		this.smarti18nService.onLocaleChanged.subscribe(() => {
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
}
