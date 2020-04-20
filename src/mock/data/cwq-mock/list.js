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
			id: Random.integer(0, 1),
			// status: Random.integer(0, 1) ? '生效中' : '已失效',
			status: Random.integer(1, 11),
			apply_status: Random.integer(0, 1),
			face_status: Random.integer(0, 1),
			type: Random.cword(2, 6),
			staff_name: Random.cword(2, 6),
			name: Random.cword(1, 3),
			phone: Random.integer(0, 5),
			work_id: Random.integer(0, 1000),
			join_date: Random.date('yyyy-MM-dd'),
			tran_date: Random.date('yyyy-MM-dd'),
			trans_date: Random.date('yyyy-MM-dd'),
			age: Random.integer(0, 100),
			count: Random.integer(0, 50),
			pact_date: Random.date('yyyy-MM-dd'),
			sign_time: Random.date('yyyy-MM-dd'),
			title: Random.cword(4, 6),
			address: 'Random.cword(4, 6)',
			isUploadID: Boolean,
			isShowNumber: Boolean,
			isWriteReExe: Boolean,
			isWriteListened: Boolean,
			isWriteType: Boolean,
			isMore: Boolean,
			attendType: Random.cword(2, 6),
			activityInst: Random.cword(8, 20),
			number: Random.integer(0, 100),
			activityType: Random.integer(1, 6)
		}
	// 	{
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
