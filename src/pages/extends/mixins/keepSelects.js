import { getParseUrl } from '@utils/utils';
// table维持勾选状态
const keepSelect = (opts = {}) => {
	const { rowKey = 'id', typeKey = '' } = opts;
	return {
		data() {
			return {
				isAll: false,
				selects: []
			};
		},
		methods: {
			handleChangePageSize() {
				this.beforeChangePageSize && this.beforeChangePageSize();
				this.isAll = false;
			},
			handleIsAll(val) {
				this.$refs.tableTarget.$refs.tableTarget.selectAll(val);
			},
			toggleSelect() {
				setTimeout(() => {
					let table;
					if (typeKey) {
						table = this.$refs.tableTarget[+this[typeKey] - 1].$refs.tableTarget;
					} else {
						table = this.$refs.tableTarget.$refs.tableTarget;
					}
					
					let length = 0;
					let isCheckAll = true;
					for (const data of table.rebuildData) {
						length++;
						const it = table.objData[data._index];
						const index = this.selects.findIndex(select => select[rowKey] == it[rowKey]);
						if (it._isChecked && index == -1) {
							it._isChecked = false;
						} else if (!it._isChecked && index > -1) {
							it._isChecked = true;
						}
						if (!it._isChecked) {
							isCheckAll = false;
						}
					}
					if (length > 0 && isCheckAll) {
						this.handleIsAll(true);
					} else {
						this.isAll = false;
						// this.handleIsAll(false);
					}
				}, 10);
			},
			afterLoadData() {
				this.toggleSelect();

			},
			handleSelectionChange(selection) {
				let { query = {} } = getParseUrl();
				let page = query.page || 1;
				let list;
				if (typeKey) {
					list = this.$refs.tableTarget[+this[typeKey] - 1].rebuildData[page];
				} else {
					list = this.$refs.tableTarget.rebuildData[page];
				}
				list && (this.isAll = (list.length == selection.length));
				let table;
				if (typeKey) {
					table = this.$refs.tableTarget[+this[typeKey] - 1].$refs.tableTarget;
				} else {
					table = this.$refs.tableTarget.$refs.tableTarget;
				}
				
				for (const data of table.rebuildData) {
					 const it = table.objData[data._index];
					const index = this.selects.findIndex(select => select[rowKey] == it[rowKey]);
					if (it._isChecked && index == -1) {
						this.selects.push(it);
					} else if (!it._isChecked && index > -1) {
						this.selects.splice(index, 1);
					}
				 }
				this.$emit('keep-select-change', this.selects);
			},
			handlePageChange(event) {
				this.beforePageChange && this.beforePageChange(event);
				this.isAll = false;
				this.$nextTick(() => {
					this.toggleSelect();
				});
			},
		}
	};
};
export default keepSelect;
