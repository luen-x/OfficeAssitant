let Mock = require('mockjs');

let { Random } = Mock;
let size = [
	'300x250', '250x250', '240x400', '336x280', 
	'180x150', '720x300', '468x260', '234x360', 
	'188x310', '120x190', '120x160', '120x240', 
	'325x125', '728x190', '360x420', '1200x510', 
	'300x600'
];
let images = [1, 2, 3].map(x => Random.image('200x100', Random.color(), Random.word(2, 6)));
data = [];
for (let i = 0; i < 30; i++) {

	let content = Random.cparagraph(0, 10);

	data.push(
		{
			id: i + '_' + i,
			tel: Random.integer(10000000000, 18888888888),
			bossName: Random.cword(2, 3),
			attendNum: Random.integer(1, 5),
			attendName: Random.cword(2, 3),
			department: Random.cword(2, 3),
			cooperate: Random.cword(2, 3),
			imgArr: [Random.image('1200x900', '#50B347', '#FFF', 'Hello Girl!'), Random.image('1200x900', '#50B347', '#FFF', 'Hello Girl!'), Random.image('1200x900', '#50B347', '#FFF', 'Hello Girl!')],
			startTime: Random.date('yyyy-MM-dd'),
			reExe: Random.cword(2, 3),
			isListened: Random.cword(2, 3),
			customerType: Random.cword(2, 3),
			status: Random.cword(2, 3),
		}
		// {
		// 	id: i + '_' + i,
		// 	title: Random.cword(8, 20),
		// 	// desc: content.substr(0, 40),
		// 	// tag: Random.cword(2, 6),
		// 	// views: Random.integer(100, 5000),
		// 	// images: images.slice(0, Random.integer(1, 3))
		// 	img: Random.image(size[parseInt(Math.random() * 16, 10)], Random.color(), Random.word(2, 6))
		// }
	);
}


module.exports = {
	currentPage: 1,
	totalPage: 10,
	list: data,
	totalCount: 100
};
