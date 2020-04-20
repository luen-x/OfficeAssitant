import { Divider } from 'iview';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { ConfirmModal } from '@components/hr/_common/popup/confirm';
import AutoToolTip from '@components/_common/auto-tooltip/auto-tooltip';
import { DeployModal } from './popup/deploy';

export default {
	data() {
		return {
			columns: {
				'1': this.getColumns()['1'],
				'2': this.getColumns()['2']
			}
		};
	},
	methods: {
		getColumns() {
			return {
				'1': [
					{
						title: '战区',
						minWidth: 100,
						key: 'depart_name',
					},
					// {
					// 	title: '政委',
					// 	minWidth: 150,
					// 	key: 'staff_name',
					// },
					{
						title: '数据类型',
						minWidth: 100,
						key: 'data_type',
					},
					{
						title: '已选数据',
						minWidth: 200,
						key: 'selected_field',
						render: (h, { row }) => {
							return <AutoToolTip 
								labelClass=""
								width="200px"
								theme="dark" 
								content={row.selected_field}/>;
						}
					},
					{
						title: '未选数据',
						minWidth: 200,
						key: 'unselected_field',
						render: (h, { row }) => {
							return <AutoToolTip 
								labelClass=""
								width="200px"
								theme="dark" 
								content={row.unselected_field}/>;
						}
					},
					{
						title: '操作',
						key: 'action',
						minWidth: 100,
						fixed: 'right',
						render: (h, params) => {
							const { data_conf_id } = params.row;
							return (this.$auth[1190] && <span 
								class="g-operation" 
								onClick={() => this.handleDeployEdit(data_conf_id)}>编辑</span>);
						}
					}
				],
				'2': [
					{
						title: '名称',
						key: 'name',
					},
					{
						title: '填写人级别',
						key: 'written_rank',
					},
					{
						title: '起止时间',
						key: 'time',
						minWidth: 150
					},
					{
						title: '编辑时间',
						key: 'update_time',
					},
					{
						title: '操作',
						key: 'status',
						fixed: 'right',
						render: (h, params) => {
							const { recommend_conf_id, time } = params.row;
							const arr = time.split('~');
							const start_time = new Date(arr[0] + " ").getTime();
							const end_time = new Date(arr[1] + " ").getTime() + 86400000;
							const now_time = Date.now();
							return (
								<div>
									{
										(now_time > end_time || now_time < start_time) && <div>
											{
												this.$auth[1186] && <span 
													onClick={() => this.handleEdit(recommend_conf_id)} 
													class="g-operation">编辑</span>
											}
											{ this.$auth[1186] && this.$auth[1187] && <Divider type="vertical" /> }
											{ this.$auth[1187] && <span 
												onClick={() => this.handleDel(recommend_conf_id)} 
												class="g-operation">删除</span> }
										</div>
									}
								</div>
							);
						}
					}
				]
			};
		},
		handleEdit(recommend_conf_id) {
			this.$router.push(getHashUrl('/hr/system/assess/statistics/add', { recommend_conf_id }));
		},
		handleDeployEdit(data_conf_id) {
			DeployModal.popup({
				dataHide: [],
				data_conf_id
			}).then().catch(err => {});
		},
		handleDel(recommend_conf_id) {
			ConfirmModal.popup({
				content: '真的要删除我吗？删除就无法恢复咯'
			}).then(res => {
				this.request({
					url: 'HR_SYSTEM_ASSESS_STATISTICS_DEL_POST',
					type: 'POST',
					param: {
						recommend_conf_id
					}
				}).then(info => {
					this.$Message.success(info.msg);
					this.$store.commit('HR_SYSTEM_ASSESS_STATISTICS_DEL_POST');
				}).catch(err => {
					this.$Message.error(err.msg);
				});
			});
			
		},
		handleResetFirst() {
			this.$store.commit('HR_SYSTEM_ASSESS_STATISTICS_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('HR_SYSTEM_ASSESS_STATISTICS_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
	}
};

