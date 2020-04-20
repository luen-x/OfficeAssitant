import { getParseUrl, getHashUrl } from '@utils/utils';
import AutoToolTip from '@components/_common/auto-tooltip/auto-tooltip';

export default {
	data() {
		const { query } = this.$route;
		return {
			columns: this.getColumns(),
			query
		};
	},
	watch: {
		type: {
			handler(val) {
				this.loadTitle(val);
			},
			immediate: true
		},
		cate() {
			this.loadTitle(this.type);
		},
		"$route.query.year": {
			handler(val) {
				this.loadTitle(this.type, val);
			}
		}
	},
	mounted() {
		const { year = '' } = this.$route.query;
		this.loadTitle(this.type, year);
	},
	methods: {
		handleJump(staff_id) {
			(this.cate === 1 ? this.$auth[869] : this.$auth[883]) 
				&& this.$router.push(
					getHashUrl(this.$route.path + '/detail', { staff_id, cate: this.cate })
				);
		},
		getColumns() {
			return [
				{
					title: '姓名',
					fixed: 'left',
					minWidth: 150,
					tooltip: true,
					key: 'staff_name'
				},
				{
					title: '手机号',
					fixed: 'left',
					minWidth: 120,
					key: 'mobile'
				},
				{
					title: '工号',
					minWidth: 120,
					key: 'staff_number'
				},
				{
					title: '部门',
					minWidth: 180,
					key: 'departs',
					tooltip: true
				},
				{
					title: '职位',
					minWidth: 120,
					key: 'position_name'
				},
				{
					title: '工龄',
					minWidth: 120,
					key: 'standing'
				},
				{
					title: '历史总分',
					minWidth: 120,
					key: 'history'
				},
				{
					title: '今年总分',
					minWidth: 120,
					key: 'this_year'
				},
				{
					title: '目前总分',
					minWidth: 120,
					key: 'all'
				},
				{
					title: this.cate === 1 ? '可用晋升积分' : '可用晋升学分',
					minWidth: 200,
					key: 'usable'
				},
				{
					title: '操作',
					fixed: 'right',
					minWidth: 120,
					key: 'action',
					render: (h, params) => {
						const { staff_id } = params.row;
						return (<span class="g-operation" onClick={(e) => this.handleJump(staff_id)}>详情</span>);
					}
				}
			];
		},
		loadTitle(val, year) {
			this.$request({
				url: '_HR_EMPLOYEE_SCORE_INTEGRATION_TITLE_GET',
				type: 'GET',
				param: {
					ic_system_id: val,
					year
				},
				loading: false
			}).then(res => {
				const columns = this.getColumns();
				res.data.length && res.data.forEach((item, index) => {
					columns.splice(7 + index, 0, {
						title: item.type_name,
						minWidth: 120,
						key: item.tab_name
					});
				});
				this.columns = columns;
			}).catch(err => {

			});
		},
		handleResetFirst() {
			this.$store.commit('HR_EMPLOYEE_SCORE_CREDIT_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('HR_EMPLOYEE_SCORE_CREDIT_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
	}
};

