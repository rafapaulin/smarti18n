import { TestBed, getTestBed, inject } from '@angular/core/testing';
import { Observable, of as observableOf } from 'rxjs';

import { Smarti18nService } from './smarti18n.service';
import { LocaleLoaderService } from './loaders/locale-loader.service';
import { ObjMap } from '../models';


class LocaleLoaderServiceStub {
	public load(locale: string): Observable<ObjMap<string>> { return null; }
}

describe('Smarti18nService', () => {
	let loader: LocaleLoaderService;
	let smarti18n: Smarti18nService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				Smarti18nService,
				{ provide: LocaleLoaderService, useClass: LocaleLoaderServiceStub }
			]
		});
		smarti18n = getTestBed().get(Smarti18nService);
		loader = getTestBed().get(LocaleLoaderService);
	});

	it('should be created', () => {
		expect(smarti18n).toBeTruthy();
	});

	describe('should download new locales on', () => {
		const dummyLocale_en_us = {
			test: 'tested'
		};
		const dummyLocale_pt_br = {
			test: 'testado'
		};

		beforeEach(() => {
			spyOn(loader, 'load').and.callFake(locale => {
				switch (locale) {
					case 'pt-br':
						return observableOf(dummyLocale_pt_br);
					case 'en-us':
						return observableOf(dummyLocale_en_us);
				}
			});
		});

		it('setConfig({ defaultLocale, locale })', () => {
			smarti18n.setConfig({ defaultLocale: 'en-us', locale: 'pt-br' });
			smarti18n.onLocaleChanged.subscribe(() => {
				expect(smarti18n.getLocale()).toBe('pt-br');
				expect(smarti18n.getTranslation('test')).toBe('testado');
			});
		});

		it('setLocale()', () => {
			smarti18n.setLocale('pt-br');
			smarti18n.onLocaleChanged.subscribe(() => {
				expect(smarti18n.getLocale()).toBe('pt-br');
				expect(smarti18n.getTranslation('test')).toBe('testado');
			});
		});
	});

	describe('should translate when', () => {
		const dummyLocale_en_us = {
			test: 'tested',
			fallback: 'fallback'
		};
		const dummyLocale_pt_br = {
			test: 'testado'
		};

		beforeEach(() => {
			spyOn(loader, 'load').and.callFake(locale => {
				switch (locale) {
					case 'pt-br':
						return observableOf(dummyLocale_pt_br);
					case 'en-us':
						return observableOf(dummyLocale_en_us);
				}
			});
		});

		it('there is a fallback in default locale', () => {
			smarti18n.setConfig({ defaultLocale: 'en-us', locale: 'pt-br' });
			smarti18n.onLocaleChanged.subscribe(() => {
				expect(smarti18n.getLocale()).toBe('pt-br');
				expect(smarti18n.getTranslation('test')).toBe('testado');
				expect(smarti18n.getTranslation('fallback')).toBe('fallback');
			});
		});
	});
});
