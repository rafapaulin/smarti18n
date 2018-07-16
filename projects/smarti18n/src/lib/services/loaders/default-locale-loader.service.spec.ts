import { TestBed, getTestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DefaultLoaderService } from './default-locale-loader.service';

describe('DefaultLoaderService', () => {
	let loader: DefaultLoaderService;
	let httpMock: HttpTestingController;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
			providers: [DefaultLoaderService]
		});
		loader = getTestBed().get(DefaultLoaderService);
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

			const req = httpMock.expectOne('/assets/i18n/pt-br.i18n.json');
			req.flush(dummyLocale_pt_br);
		});
	});
});
