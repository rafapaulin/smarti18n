import { Component } from '@angular/core';

@Component({
	selector: 'app-test',
	templateUrl: './test.component.html',
	styleUrls: ['./test.component.css']
})
export class TestComponent {
	public isTrue = false;
	public pipePath = 'pipe.works';

	constructor() { }
}
