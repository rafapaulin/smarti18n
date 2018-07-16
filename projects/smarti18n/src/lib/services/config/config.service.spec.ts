import { TestBed, getTestBed } from '@angular/core/testing';

import { ConfigService } from './config.service';

describe('ConfigService', () => {
	let service: ConfigService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [ConfigService]
		});
		service = getTestBed().get(ConfigService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	describe('when changes are applied', () => {
		beforeEach(() => {
			service.applyConfig({
				defaultLocale: 'en-us'
			});
		});

		it('should merge the changes', () => {
			service.applyConfig({
				locale: 'pt-br'
			});
			expect(service.config.defaultLocale).toBe('en-us');
			expect(service.config.locale).toBe('pt-br');
		});

		it('should emit observable new config', () => {
			service.onConfigChanged.subscribe(newConfig => {
				expect(newConfig.config.defaultLocale).toBe('en-us');
				expect(newConfig.changes.locale).toBe('pt-br');
			});
			service.applyConfig({
				locale: 'pt-br'
			});
		});
	});
});
