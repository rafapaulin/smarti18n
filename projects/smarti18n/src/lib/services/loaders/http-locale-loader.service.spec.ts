import { TestBed, getTestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ConfigService } from '../config/config.service';
import { HttpLocaleLoaderService } from './http-locale-loader.service';
import { Smarti18nConfigModel as Config } from '../../models';

class ConfigServiceStub {
	public get config(): Config { return {}; }
}

describe('HttpLoaderService', () => {
	let loader: HttpLocaleLoaderService;
	let configService: ConfigService;
	let httpMock: HttpTestingController;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
			providers: [
				HttpLocaleLoaderService,
				{ provide: ConfigService, useClass: ConfigServiceStub }
			]
		});
		loader = getTestBed().get(HttpLocaleLoaderService);
		httpMock = getTestBed().get(HttpTestingController);
		configService = getTestBed().get(ConfigService);
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

		it('should raise an error if no config loader config is set', () => {
			spyOnProperty(configService, 'config').and.returnValue({});
			expect(() => loader.load('pt-br')).toThrow(new Error('HttpLoaderService needs the property `loader` set in `setConfig()`'));
		});

		it('should do a http call to get locale', () => {
			spyOnProperty(configService, 'config').and.returnValue({
				loader: {
					baseUrl: 'http://baseUrl/locales'
				}
			});
			loader.load('pt-br').subscribe(localeData => {
				expect(localeData.test).toBe('testado');
			});

			const req = httpMock.expectOne('http://baseUrl/locales/pt-br');
			req.flush(dummyLocale_pt_br);
		});

		it('should do a http call to get locale with a suffix on url', () => {
			spyOnProperty(configService, 'config').and.returnValue({
				loader: {
					baseUrl: 'http://baseUrl/locales',
					suffix: 'suffix'
				}
			});
			loader.load('pt-br').subscribe(localeData => {
				expect(localeData.test).toBe('testado');
			});

			const req = httpMock.expectOne('http://baseUrl/locales/pt-br/suffix');
			req.flush(dummyLocale_pt_br);
		});
	});
});
