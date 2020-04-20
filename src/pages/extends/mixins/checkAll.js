import { getParseUrl } from '@utils/utils';

// table勾选
export const createCheckAll = (opts = {}) => {
	const { key = '' } = opts;
	return {
		data() {
			return {
				isAll: false,
				selected: []
			};
		},
		methods: {
			handlePageChange(page) {
				this.isAll = false;
				this.selected = [];
			},
			// 被选项发生变化
			handleSelectionChange(selection) {
				let { query = {} } = getParseUrl();
				let page = query.page || 1;
				if (this[key]) {
					const data = this.listInfo[this[key]].data && this.listInfo[this[key]].data[page || 1];
					data && (this.isAll = (data.filter(v => {
						return v._disabled ? v._disabled == false : v;
					}).length == selection.length));
				} else {
					const data = this.listInfo.data[page || 1];
					data && (this.isAll = (data.filter(v => {
						return v._disabled ? v._disabled == false : v;
					}).length == selection.length));
				}
				this.selected = selection;
			},
		}
	};
};

export default createCheckAll({ key: 'type' });
