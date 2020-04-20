import { Dropdown, DropdownMenu, DropdownItem, Tooltip } from 'iview';
import { ImgsPreview } from 'wya-vc';
import API_ROOT from '@stores/apis/root';
import AutoTooltip from "@common/auto-tooltip/auto-tooltip";
import { Confirm } from '@common/confirm/confirm';
import { PModalRefuse } from './popup/refuse';
import { DetailDrawer } from './popup/detail';

export const CUSTOMER_TYPE = {
	'1': "已合作客户",
	'2': "自己的未合作",
	'3': "非自己未合作"
};
export default {
	data() {
		return {
			columns: [
				{
					title: '活动名称',
					key: 'activity_name',
					fixed: 'left',
					width: 230,
					render(h, params) {
						return h('div', {
							class: ['g-c-blue-dark', 'g-operation'],
							style: {
								cursor: 'pointer'
							},
						}, [
							params.row.activity_name.length > 15
								?	h(Tooltip, {
									props: {
										content: params.row.activity_name,
										transfer: true,
										maxWidth: 250
									}
								}, params.row.activity_name.slice(0, 14) + '...')
								: params.row.activity_name
						]);
					}
				},
				{
					title: '活动类型',
					key: 'category_name',
					minWidth: 150,
				},
				{
					title: '公司名称',
					key: 'customer_company',
					minWidth: 150,
					render(h, { row }) {
						return (
							<AutoTooltip
								content={ row.customer_company }
								labelClass=" "
							/>
						);
					}
				},
				{
					title: '客户名称',
					key: 'boss_name',
					minWidth: 150,
				},
				{
					title: '客户电话',
					key: 'boss_tel',
					minWidth: 150,
				},
				{
					title: '合作类别',
					key: 'cooperate_category',
					minWidth: 150,
				},
				{
					title: '实际打款金额',
					key: 'payment_amount',
					minWidth: 150,
				},
				{
					title: '参与人数',
					key: 'apply_num',
					minWidth: 120,
				},
				{
					title: '参加人',
					key: 'apply_users',
					minWidth: 150,
					render(h, { row }) {
						return (
							<AutoTooltip
								content={ row.apply_users }
								labelClass=" "
							/>
						);
					}
				},
				{
					title: '是否参加过策略班',
					key: 'is_join_strategy',
					minWidth: 140,
				},
				{
					title: '对接部门',
					key: 'depart_name',
					minWidth: 120,
				},
				{
					title: '部门简称',
					key: 'abbreviation',
					minWidth: 150,
				},
				{
					title: '对接人',
					key: 'staff_name',
					minWidth: 120,
				},
				{
					title: '凭证',
					key: 'voucher',
					minWidth: 120,
					render: (h, params) => {
						const dataSource = params.row.voucher;
						return dataSource ? h('span', {
							style: {
								marginRight: '5px',
								color: '#2e9dfa',
								cursor: 'pointer'
							},
							on: {
								click: (e) => {
									e.stopPropagation();
									ImgsPreview.popup({
										visible: true,
										dataSource: dataSource.split(',')
									});
								}
							}
						}, '查看凭证') : h('span', '未上传凭证');

					}
				},
				{
					title: '报名时间',
					key: 'create_time',
					minWidth: 150,
				},
				{
					title: '复训',
					key: 'retrain_number',
					minWidth: 120,
				},
				{
					title: '是否听完',
					key: 'listen_finish',
					minWidth: 120
				},
				{
					title: '客户类别',
					key: 'customer_type_name',
					minWidth: 120,
				},
				{
					title: '合作时间',
					key: 'cooperate_date',
					minWidth: 150,
				},
				{
					title: '是否起盘',
					key: 'lift_plate_month',
					minWidth: 150,
				},
				{
					title: '已招代理数',
					key: 'proxy_num_name',
					minWidth: 150,
				},
				{
					title: '报名状态',
					key: 'status_name',
					minWidth: 120,
				},
				{
					title: '操作',
					key: 'operate',
					width: 100,
					fixed: 'right',
					align: 'center',
					render: (h, params) => {
						return h(Dropdown, {
							style: 'cursor: pointer; width: 100%; height: 100%; text-align: center',
							props: {
								transfer: true,
								placement: 'left-start'
							},
							on: {
								'on-click': name => {
									switch (name) {
										case '1':
											this.$request({
												url: API_ROOT._CONTENT_ACTIVITY_AUDIT_PASS_POST,
												type: 'POST',
												param: {
													type: 1,
													apply_id: params.row.apply_id
												}
											}).then(res => {
												this.$Message.success(res.msg);
												this.handleResetCur();
											}).catch(err => this.$Message.error(err.msg));
											break;
										case '2':
											PModalRefuse.popup({ data: params.row }).then(res => {
												this.handleResetCur();
											}).catch(() => {});
											break;
										case '3':
											DetailDrawer.popup({ detailData: params.row }).catch(() => {});
											break;
										case '4':
											Confirm.popup({
												msg: '是否确认将此企业变更到缺席状态？',
												title: '温馨提示'
											}).then(res => {
												this.handleAbsentOrRecovery(params.row.apply_id);
											}).catch(() => {});
											break;
										case '5':
											Confirm.popup({
												msg: '是否确认将此企业变更到已通过状态？',
												title: '温馨提示'
											}).then(res => {
												this.handleAbsentOrRecovery(params.row.apply_id, 2);
											}).catch(() => {});
											break;
										default:
											throw Error('这是一个bug');
									}
								}
							}
						}, [
							h('i', {
								class: 'iconfont icon-point',
								style: "font-size: 20px; display: block",
								on: {
									'click': (e) => { e.stopPropagation(); },
								}
							}),
							h(DropdownMenu, { slot: 'list' }, [
								params.row.status == 1
									? [this.$auth['71'] ? h(DropdownItem, { props: { name: '1' } }, '通过') : '',
										this.$auth['72'] ? h(DropdownItem, { props: { name: '2' } }, '拒绝') : '']
									 : null,
								params.row.status == 2 && h(DropdownItem, { props: { name: '4' } }, '缺席'),
								params.row.status == 4 && h(DropdownItem, { props: { name: '5' } }, '恢复'),
								h(DropdownItem, { props: { name: '3' } }, '查看')
							])
						]);
					}
				}
			],
		};
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('CONTENT_ACTIVITY_AUDIT_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('CONTENT_ACTIVITY_AUDIT_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
		handleAbsentOrRecovery(apply_id, type = 1) {
			this.$request({
				url: type === 1
					? API_ROOT._CONTENT_ACTIVITY_AUDIT_ABSENT_POST
					: API_ROOT._CONTENT_ACTIVITY_AUDIT_RECEVORY_POST,
				type: "GET",
				param: { apply_id }
			}).then(res => {
				this.$Message.success(res.msg);
				this.handleResetCur();
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		}
	}
};

