import { By } from '@angular/platform-browser';
import { Component, DebugElement } from '@angular/core';
import { TestBed, getTestBed, ComponentFixture } from '@angular/core/testing';
import { Subject, Observable } from 'rxjs';

import { Smarti18nDirective } from './smarti18n.directive';
import { Smarti18nService } from '../services/smarti18n.service';


@Component({
	template: `<div id="test" smarti18n="test.path"></div>`
})
class TestComponent {}
class Smarti18nServiceStub {
	public get onLocaleChanged(): Observable<any> { return null; }
	public getTranslation(value: string): string { return ''; }
}

describe('Smarti18nDirective', () => {
	let fixture: ComponentFixture<TestComponent>;
	let smarti18n: Smarti18nService;
	let testEl: HTMLElement;

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [
				TestComponent,
				Smarti18nDirective
			],
			providers: [
				{ provide: Smarti18nService, useClass: Smarti18nServiceStub }
			]
		}).compileComponents();
		fixture = getTestBed().createComponent(TestComponent);
		smarti18n = getTestBed().get(Smarti18nService);
		testEl = fixture.debugElement.query(By.directive(Smarti18nDirective)).nativeElement;
	});

	it('should be created', () => {
		const directive = new Smarti18nDirective(null, null);
		expect(directive).toBeTruthy();
	});

	describe('should translate to inner text', () => {
		let localeLoaded: Subject<any>;

		beforeEach(() => {
			localeLoaded = new Subject();
			spyOnProperty(smarti18n, 'onLocaleChanged').and.returnValue(localeLoaded.asObservable());
		});

		it('from a simple path', () => {
			spyOn(smarti18n, 'getTranslation').and.returnValue('translated value');
			fixture.detectChanges();
			expect(testEl.innerText).toBe('translated value');
		});
	});
});
