import { Directive, Input, OnInit, ElementRef } from '@angular/core';

@Directive({
	selector: '[smarti18n]'
})

export class Smarti18nDirective implements OnInit {
	@Input('smarti18n') data: any;

	private dotNotationRegex = /(\w+)(\.\w+)*/;
	private jsonMap: string;
	private variables: Object = null;

	constructor(
		private hostEl: ElementRef
	) {}

	ngOnInit() {
		switch (typeof this.data) {
			case 'string':
				if (!this.isJsonString(this.data)) {
					this.assembleJsonMap(this.data);
				}
				break;
			case 'object':
				if (!this.data.jsonMap) {
					throw new Error('"jsonMap" property is missing!');
				}

				this.assembleJsonMap(this.data.jsonMap);
				break;
			default:
				throw new Error('Wrong data format!');
		}

		this.hostEl.nativeElement.textContent = 'Localized text from from the smarti18n service';
	}

	private assembleJsonMap(mapString: string) {
		if (!this.dotNotationRegex.test(mapString)) {
			throw new Error('Wrong dot-notation map format!');
		}

		this.jsonMap = mapString;
	}

	private isJsonString(str: string) {
		try {
			JSON.parse(str);
		} catch (e) {
			return false;
		}

		return true;
	}
}
