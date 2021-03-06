import { TestBed, getTestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DefaultLocaleLoaderService } from './default-locale-loader.service';

describe('DefaultLoaderService', () => {
	let loader: DefaultLocaleLoaderService;
	let httpMock: HttpTestingController;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
			providers: [DefaultLocaleLoaderService]
		});
		loader = getTestBed().get(DefaultLocaleLoaderService);
		httpMock = getTestBed().get(HttpTestingController);
	});

	it('should be created', () => {
		expect(loader).toBeTruthy();
	});

	describe('when load() is called', () => {
		const dummyLocale_pt_br = {
			test: 'testado'
		};

		afterEach(() => {
			httpMock.verify();
		});

		it('should do a http call to get locale', () => {
			loader.load('pt-br').subscribe(localeData => {
				expect(localeData.test).toBe('testado');
			});

			const req = httpMock.expectOne('/assets/i18n/pt-br/base.i18n.json');
			req.flush(dummyLocale_pt_br);
		});
	});
});
