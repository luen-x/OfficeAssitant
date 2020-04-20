import { getObjectValue } from '../../src/pages/utils/utils';

test('adds 1 + 2 to equal 3', () => {
	util.getObjectValue({ a: 1 }, 'a');
	expect(util.getObjectValue({ a: 1 }, 'a')).toBe(1);
});