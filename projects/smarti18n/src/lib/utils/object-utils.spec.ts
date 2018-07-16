import { ObjectUtils } from './object-utils';

describe('ObjectUtils', () => {
	describe('should have deepMerge()', () => {
		const base = {
			a: 1,
			b: {
				c: 2,
				d: 4
			}
		};
		const data = {
			a: 1,
			b: {
				c: 3
			}
		};

		it('that deep merges data properly', () => {
			const result = ObjectUtils.deepMerge(base, data);
			expect(result.b.c).toBe(3);
			expect(result.b.d).toBeTruthy();
			expect(result.b.d).toBe(4);
		});
	});
});
