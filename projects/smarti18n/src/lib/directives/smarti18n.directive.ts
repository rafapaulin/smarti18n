import {
	Directive,
	Input,
	OnInit,
	ElementRef,
	ViewContainerRef
} from '@angular/core';
import { Smarti18nAssets } from '../services/smarti18n-assets.service';

@Directive({
	selector: '[smarti18n]'
})

export class Smarti18nDirective implements OnInit {
	@Input('smarti18n') data: any;

	private dotNotationRegex = /(^\w+((\.\w+)?)+[^\.]$)/;
	private jsonMap: string;
	private variables: Object = null;
	private hostComponent: any;

	constructor(
		private hostEl: ElementRef,
		private vcRef: ViewContainerRef,
		private smarti18nAssets: Smarti18nAssets
	) {}

	ngOnInit() {
		this.hostComponent = (<any>this.vcRef)._view.component;

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

		this.smarti18nAssets
			.getString(this.hostComponent.constructor.name)
			.subscribe(
				result => {
					this.hostEl.nativeElement.textContent = result[this.jsonMap];
				}
			);
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
