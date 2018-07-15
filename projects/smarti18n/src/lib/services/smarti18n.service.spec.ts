import { TestBed, getTestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { Smarti18nService } from './smarti18n.service';

describe('Smarti18nService', () => {
	let smarti18n: Smarti18nService;
	let httpMock: HttpTestingController;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
			providers: [Smarti18nService]
		});
		smarti18n = getTestBed().get(Smarti18nService);
		httpMock = getTestBed().get(HttpTestingController);
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

		afterEach(() => {
			httpMock.verify();
		});

		it('setConfig({ defaultLocale, locale })', () => {
			smarti18n.setConfig({ defaultLocale: 'en-us', locale: 'pt-br' });
			smarti18n.onLocaleChanged.subscribe(() => {
				expect(smarti18n.getLocale()).toBe('pt-br');
				expect(smarti18n.getTranslation('test')).toBe('testado');
			});

			const enReq = httpMock.expectOne('/assets/i18n/en-us.i18n.json');
			const ptReq = httpMock.expectOne('/assets/i18n/pt-br.i18n.json');
			enReq.flush(dummyLocale_en_us);
			ptReq.flush(dummyLocale_pt_br);
		});

		it('setLocale()', () => {
			smarti18n.setLocale('pt-br');
			smarti18n.onLocaleChanged.subscribe(() => {
				expect(smarti18n.getLocale()).toBe('pt-br');
				expect(smarti18n.getTranslation('test')).toBe('testado');
			});
			const req = httpMock.expectOne('/assets/i18n/pt-br.i18n.json');
			req.flush(dummyLocale_pt_br);
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

		afterEach(() => {
			httpMock.verify();
		});

		it('there is a fallback in default locale', () => {
			smarti18n.setConfig({ defaultLocale: 'en-us', locale: 'pt-br' });
			smarti18n.onLocaleChanged.subscribe(() => {
				expect(smarti18n.getLocale()).toBe('pt-br');
				expect(smarti18n.getTranslation('test')).toBe('testado');
				expect(smarti18n.getTranslation('fallback')).toBe('fallback');
			});

			const enReq = httpMock.expectOne('/assets/i18n/en-us.i18n.json');
			const ptReq = httpMock.expectOne('/assets/i18n/pt-br.i18n.json');
			enReq.flush(dummyLocale_en_us);
			ptReq.flush(dummyLocale_pt_br);
		});
	});
});
