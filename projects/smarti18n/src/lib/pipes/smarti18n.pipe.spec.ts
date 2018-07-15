import { TestBed, getTestBed } from '@angular/core/testing';
import { Subject, Observable } from 'rxjs';

import { Smarti18nPipe } from './smarti18n.pipe';
import { Smarti18nService } from '../services/smarti18n.service';

class Smarti18nServiceStub {
	public get onLocaleChanged(): Observable<any> { return null; }
	public getTranslation(value: string): string { return ''; }
}

describe('Smarti18nPipe', () => {
	let pipe: Smarti18nPipe;
	let smarti18n: Smarti18nService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				{ provide: Smarti18nService, useClass: Smarti18nServiceStub }
			]
		});
		smarti18n = getTestBed().get(Smarti18nService);
		pipe = new Smarti18nPipe(smarti18n);
	});

	it('should be created', () => {
		expect(pipe).toBeTruthy();
	});

	describe('should translate', () => {
		let localeLoaded: Subject<any>;

		beforeEach(() => {
			localeLoaded = new Subject();
			spyOnProperty(smarti18n, 'onLocaleChanged').and.returnValue(localeLoaded.asObservable());
		});

		it('a simple path', () => {
			spyOn(smarti18n, 'getTranslation').and.callFake(label => {
				expect(label).toBe('test.value');
				return 'translated value';
			});
			expect(pipe.transform('test.value')).toBe('translated value');
		});
	});
});
