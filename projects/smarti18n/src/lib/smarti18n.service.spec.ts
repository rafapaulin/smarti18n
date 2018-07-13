import { TestBed, inject } from '@angular/core/testing';

import { Smarti18nService } from './services/smarti18n.service';

describe('Smarti18nService', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [Smarti18nService]
		});
	});

	it('should be created', inject([Smarti18nService], (service: Smarti18nService) => {
		expect(service).toBeTruthy();
	}));
});
