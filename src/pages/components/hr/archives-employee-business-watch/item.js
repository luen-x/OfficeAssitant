import API_ROOT from "@stores/apis/root";
import { Divider } from 'iview';
import AutoToolTip from "@components/_common/auto-tooltip/auto-tooltip";
import { DelTipModal } from '../_common/delete-tip';
import { employeePModal } from './popup/employee';
import { managerPModal } from './popup/manager';
import { meetPModal } from './popup/meet';
import { DetailDrawer } from './popup/detail.vue';

export default {
	data() {
		const { query } = this.$route;
		return {
			columns1: query.prevType === '1' ? this.getColumns1() : [],
			columns2: query.prevType === '2' ? {
				'1': this.getColumns2('1'),
				'2': this.getColumns2('2'),
				'3': this.getColumns2('3'),
				'4': this.getColumns2('4'),
				'5': this.getColumns2('5'),
			} : {}
		};
	},
	methods: {
		handleEdit(info) {
			this.$request({
				url: '_HR_ARCHIVES_EMPLOYEE_DATA_DETAIL_GET',
				type: "GET",
				param: {
					staff_id: this.$route.query.staff_id,
					data_id: info.data_id,
					type: this.type
				},
				loading: false
			}).then(res => {
				if (!res.data.can_edit) {
					this.$Message.warning('客户暂不能编辑！');
					return;
				}
				if (this.$route.query.prevType === '2') {
					if (this.type === '4') {
						meetPModal.popup({
							detail: res.data,
							type: 'edit',
							staff_id: this.$route.query.staff_id,
						}).then(() => {
							this.$store.commit('HR_ARCHIVES_EMPLOYEE_BUSINESS_WATCH_LIST_INIT');
						}).catch(err => {});
					} else {
						employeePModal.popup({
							detail: res.data,
							staff_id: this.$route.query.staff_id,
							type: this.type,
							action: 'edit'
						}).then(() => {
							this.$store.commit('HR_ARCHIVES_EMPLOYEE_BUSINESS_WATCH_LIST_INIT');
						}).catch(err => {});
					}
				} else {
					managerPModal.popup({
						detail: res.data,
						staff_id: this.$route.query.staff_id,
						type: this.type,
						action: 'edit'
					}).then(() => {
						this.$store.commit('HR_ARCHIVES_EMPLOYEE_BUSINESS_WATCH_LIST_INIT');
					}).catch(err => {});
				}
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		handleDelete(info) {
			DelTipModal.popup({
				title: "提示",
				content: "是否删除此数据，删除后，数据将不能恢复"
			}).then(() => {
				this.$request({
					url: "_HR_ARCHIVES_EMPLOYEE_DATA_DELETE_POST",
					type: "POST",
					param: {
						staff_id: this.$route.query.staff_id,
						data_id: info.data_id
					},
					loading: false,
				}).then(res => {
					this.$Message.success('操作成功');
					this.$store.commit('HR_ARCHIVES_EMPLOYEE_BUSINESS_WATCH_LIST_INIT');
				}).catch((res) => {
					this.$Message.error(res.msg);
				});
			}).catch(() => {
			});
		},
		handleShowDetail(params) {
			if (this.$route.query.prevType === '2' && this.type === '4') {
				DetailDrawer.popup({
					info: params,
					staff_id: this.$route.query.staff_id,
				}).then(res => {
				}).catch(err => {
				});
			}
		},
		getColumns1() {
			let columns = [
				{
					title: "公司名称",
					key: "company_name",
					minWidth: 170,
					render: (h, params) => {
						return (
							<AutoToolTip
								content={params.row.company_name}
								labelClass=""
								theme="dark"
							>{params.row.company_name}</AutoToolTip>
						);
					}
				},
				{
					title: "客户名称",
					key: "customer_name",
					minWidth: 120
				},
				{
					title: "邀约人",
					key: "invite_staff_name",
					minWidth: 120
				},
				{
					title: "主跟人",
					key: "follow_up_person",
					minWidth: 120
				},
				{
					title: "客户类别",
					key: "customer_type",
					minWidth: 100
				},

				{
					title: "所属行业",
					key: "industry",
					minWidth: 120,
					render: (h, params) => {
						return (
							<AutoToolTip
								content={params.row.industry}
								labelClass=""
								theme="dark"
							/>
						);
					}
				},
				{
					title: "产品",
					key: "product",
					minWidth: 120,
					render: (h, params) => {
						return (
							<AutoToolTip
								content={params.row.product}
								labelClass=""
								theme="dark"
							/>
						);
					}
				},
				{
					title: "地区",
					key: "region",
					minWidth: 200,
					render: (h, params) => {
						return (
							<AutoToolTip
								content={params.row.region}
								labelClass=""
								theme="dark"
							/>
						);
					}
				},
				{

					title: '操作',
					key: 'action',
					width: 140,
					fixed: 'right',
					align: 'center',
					render: (h, params) => {
						return (
							<span>
								{ params.row.can_edit === 1 && <span>
									{ this.$auth[1107]
										? <span class="g-c-blue-mid g-pointer" onClick={() => this.handleEdit(params.row)}>
											编辑
										</span> : null }
									{ (this.$auth[1107] && this.$auth[1109]) ? <Divider type="vertical" /> : null }

									{ this.$auth[1109]
										? <span class="g-c-blue-mid g-pointer" onClick={() => this.handleDelete(params.row)}>
											删除
										</span> : null }
								</span> }
							</span>
						);
					}
				}
			];
			return columns;
		},
		getColumns2(type) {
			let columns1 = [
				{
					title: "公司名称",
					key: "company_name",
					minWidth: 170,
					render: (h, params) => {
						return (
							<AutoToolTip
								content={params.row.company_name}
								labelClass=""
								theme="dark"
							>{params.row.company_name}</AutoToolTip>
						);
					}
				},
				{
					title: "注册资金（万元）",
					key: "capital",
					minWidth: 140
				},
				{
					title: "所属行业",
					key: "industry",
					minWidth: 120,
					render: (h, params) => {
						return (
							<AutoToolTip
								content={params.row.industry}
								labelClass=""
								theme="dark"
							/>
						);
					}
				},
				{
					title: "产品",
					key: "product",
					minWidth: 120,
					render: (h, params) => {
						return (
							<AutoToolTip
								content={params.row.product}
								labelClass=""
								theme="dark"
							/>
						);
					}
				},
				{
					title: "地区",
					key: "region",
					minWidth: 200,
					render: (h, params) => {
						return (
							<AutoToolTip
								content={params.row.region}
								labelClass=""
								theme="dark"
							/>
						);
					}
				},
				{
					title: "是否老板",
					key: "is_boss",
					minWidth: 100,
					render: (h, params) => {
						return <span>{ params.row.is_boss === 1 ? '是' : '否'}</span>;
					}
				},
				{

					title: '操作',
					key: 'action',
					width: 140,
					fixed: 'right',
					align: 'center',
					render: (h, params) => {
						return (
							<span>
								{ params.row.can_edit === 1 && <span>
									{ this.$auth[1107]
										? <span class="g-c-blue-mid g-pointer" onClick={(e) => { e.stopPropagation(); this.handleEdit(params.row); }}>
											编辑
										</span> : null }
									{ (this.$auth[1107] && this.$auth[1109]) ? <Divider type="vertical" /> : null }

									{ this.$auth[1109]
										? <span
											class="g-c-blue-mid g-pointer"
											onClick={(e) => { e.stopPropagation(); this.handleDelete(params.row); }}>
											删除
										</span> : null }
								</span> }
							</span>
						);
					}
				}
			];

			let columns2 = [
				{
					title: "公司名称",
					key: "company_name",
					minWidth: 170,
					render: (h, params) => {
						const { company_name } = params.row;
						return (
							<span class="g-c-blue-mid g-pointer">
								{ company_name.length <= 7 ? company_name
									: <AutoToolTip
										content={company_name}
										labelClass=""
										width="105px"
										theme="dark"
									>
										{company_name}
									</AutoToolTip>
								}
							</span>
						);
					}
				},
				{
					title: "谈判时间",
					key: "create_time",
					minWidth: 150
				},
				{
					title: "谈判手",
					key: "negotiator_arr",
					minWidth: 160,
					render: (h, params) => {
						const { negotiator_arr } = params.row;
						let name = negotiator_arr.join(',');
						return (
							<span>
								{ name.length <= 10 ? name
									: <AutoToolTip
										content={name}
										labelClass=""
										width="105px"
										theme="dark"
									>
										{name}
									</AutoToolTip>
								}
							</span>
						);
					}
				},
				{
					title: "客户名称",
					key: "customer_name",
					minWidth: 120
				},
				{
					title: "职务",
					key: "position",
					minWidth: 150
				},
				{
					title: "手机号码",
					key: "customer_tel",
					minWidth: 120
				},
				{
					title: "注册资金（万元）",
					key: "capital",
					minWidth: 140
				},
				{
					title: "所属行业",
					key: "industry",
					minWidth: 120,
					render: (h, params) => {
						return (
							<AutoToolTip
								content={params.row.industry}
								labelClass=""
								theme="dark"
							/>
						);
					}
				},
				{
					title: "产品",
					key: "product",
					minWidth: 120,
					render: (h, params) => {
						return (
							<AutoToolTip
								content={params.row.product}
								labelClass=""
								theme="dark"
							/>
						);
					}
				},
				{
					title: "是否签单",
					key: "is_deal",
					minWidth: 100,
					render: (h, params) => {
						return <span>{ params.row.is_boss === 1 ? '是' : '否'}</span>;
					}
				},
				{
					title: "签单金额",
					key: "payment",
					minWidth: 120
				},
				{

					title: '操作',
					key: 'action',
					width: 140,
					fixed: 'right',
					align: 'center',
					render: (h, params) => {
						return (
							<span>
								{ params.row.can_edit === 1 && <span>
									{ this.$auth[1107]
										? <span class="g-c-blue-mid g-pointer" onClick={(e) => { e.stopPropagation(); this.handleEdit(params.row); }}>
											编辑
										</span> : null }
									{ (this.$auth[1107] && this.$auth[1109]) ? <Divider type="vertical" /> : null }

									{ this.$auth[1109]
										? <span
											class="g-c-blue-mid g-pointer"
											onClick={(e) => { e.stopPropagation(); this.handleDelete(params.row); }}>
											删除
										</span> : null }
								</span> }
							</span>
						);
					}
				}
			];

			switch (type) {
				case '1':
				case '2':
				case '3':
				case '5':
					return columns1;
				case '4':
					return columns2;
				default:
					break;
			}
		}
	}
};

