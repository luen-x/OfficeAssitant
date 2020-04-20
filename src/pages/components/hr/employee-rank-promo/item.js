import { Divider } from 'iview';
import AutoToolTip from "@components/_common/auto-tooltip/auto-tooltip";
import { PModal } from './popup/modal.vue';

export default {
	data() {
		return {
			columns: [
				{
					title: "姓名",
					key: "staff_name",
					fixed: "left",
					width: 170,
					renderHeader: (h, params) => {
						return (
							<div style="marginLeft: 33px;fontWeight: normal">姓名</div>
						);
					},
					render: (h, params) => {
						const { staff_status } = params.row;
						return (
							<div class="g-flex-ac">
								{ staff_status && staff_status === 4 && <div class="g-m-r-5 g-remark">离</div>}
								{ staff_status !== 4 && <div class="g-m-r-5 g-remark" style="opacity: 0">注</div>}
								{/* class={(staff_status && staff_status === 4) ? '' : 'g-c-blue-mid g-pointer'} */}
								<span
									class="g-c-blue-mid g-pointer"
									style={{ display: 'block', width: '100%' }}
									onClick={() => this.handleLinkTo(params)}>
									{params.row.staff_name}
								</span>
							</div>
						);
					}
				},
				{
					title: "手机号码",
					key: "mobile",
					fixed: "left",
					width: 120
				},
				{
					title: "工号",
					key: "staff_number",
					minWidth: 150,
				},
				{
					title: "部门",
					key: "depart_name",
					minWidth: 150,
					render: (h, params) => {
						return (
							<AutoToolTip
								content={params.row.depart_name}
								labelClass=""
								theme="dark"
							/>
						);
					}
				},
				{
					title: "职位",
					key: "position_name",
					minWidth: 150
				},
				{
					title: "当前级称",
					key: "rank_name",
					minWidth: 150
				},
				{
					title: "销工总数",
					key: "already_count",
					minWidth: 150
				},
				{
					title: "晋级销工",
					key: "need_count",
					minWidth: 150,
					sortable: 'custom',
				},
				{
					title: "上月业绩",
					key: "last_pk",
					minWidth: 150
				},
				{
					title: "晋级业绩",
					key: "sum_pk",
					minWidth: 150,
					sortable: 'custom',
				},
				{
					title: "考核周期",
					key: "cycle_date",
					minWidth: 180,
					render: (h, params) => {
						return (
							<AutoToolTip
								content={params.row.cycle_date}
								labelClass=""
								theme="dark"
							/>
						);
					}
				},
				{
					title: "评定时间",
					key: "month",
					minWidth: 160
				},
				{
					title: "操作",
					key: "action",
					fixed: "right",
					width: 120,
					render: (h, params) => {
						const { staff_status, up, down } = params.row;
						return <div>
							{ this.$auth[234] && (staff_status === 4 || up !== 1) && <span>
								晋级
							</span> }
							{ this.$auth[234] && staff_status !== 4 && up === 1 && <span
								class="g-c-blue-mid g-pointer" onClick={() => this.handlePromo(params)}>
								晋级
							</span> }
							{ this.$auth[234] && this.$auth[235] && (staff_status === 4 || up !== 1 || down !== 1) && <span
								class="iconfont icon-vertical-line g-fs-10 g-m-l-5 g-m-r-5 g-c-black1">
							</span> }
							{ this.$auth[234] && this.$auth[235] && staff_status !== 4 && up === 1 && down === 1 && <span
								style={{ paddingLeft: '3px', paddingRight: '3px' }}>
								<Divider
									type="vertical"
								/>
							</span> }
							{ this.$auth[235] && (staff_status === 4 || down !== 1) && <span>
								降级
							</span> }
							{ this.$auth[235] && staff_status !== 4 && down === 1 && <span
								class="g-c-blue-mid g-pointer" onClick={() => this.handleDegrade(params)}>
								降级
							</span> }
						</div>;
					}
				}
			]
		};
	},
	created() {
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('HR_EMPLOYEE_RANK_PROMO_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('HR_EMPLOYEE_RANK_PROMO_LIST_RESET', { type: this.type });
		},
		// 晋级
		handlePromo(params) {
			// 是否可晋级或降级 获取级称名称
			this.$request({
				url: '_HR_EMPLOYEE_RANK_PROMO_RANK_NAME_GET',
				type: 'GET',
				param: {
					rank_id: params.row.rank_id,
					type: 1,
				},
				loading: false
			}).then(res => {
				PModal.popup({
					data: {
						action: 'promo',
						info: params.row,
						name: res.data.after_rank
					}
				}).then(res1 => {
					this.$Message.success('晋升成功');
					this.$store.commit("HR_EMPLOYEE_RANK_PROMO_LIST_INIT", this.rank_system_id);
				}).catch(() => {});
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		// 降级
		handleDegrade(params) {
			// 是否可晋级或降级 获取级称名称
			this.$request({
				url: '_HR_EMPLOYEE_RANK_PROMO_RANK_NAME_GET',
				type: 'GET',
				param: {
					rank_id: params.row.rank_id,
					type: 2,
				},
				loading: false
			}).then(res => {
				PModal.popup({
					data: {
						action: 'degrade',
						info: params.row,
						name: res.data.after_rank
					}
				}).then(res1 => {
					this.$Message.success('降级成功');
					this.$store.commit("HR_EMPLOYEE_RANK_PROMO_LIST_INIT", this.rank_system_id);
				}).catch(() => {});
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		handleLinkTo(params) {
			// if (params.row.staff_status !== 4) {
			this.$router.push({
				path: '/hr/employee/summary/details',
				query: {
					staff_id: params.row.staff_id,
					staff_name: params.row.staff_name,
					type: params.row.staff_status !== 4 ? 6 : ''
				}
			});
			// }
		},
	}
};

