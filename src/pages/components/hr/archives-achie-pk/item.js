import {
	Tooltip
} from "iview";
import { AddModal } from './popup/add.vue';

export default {
	data() {
		const {
			query = {}
		} = this.$route;
		return {
			columns: {
				'1': [],
				'2': [],
				'3': [],
				
			}
		};
	},

	methods: {
		handleAddModal(params) {
			AddModal.popup({
				pk_id: params.row.pk_id,
				pk_amount: params.row.pk_amount,
				guard_depart_ids: params.row.guard_list.map(item => { return Number(item.depart_id); }),
				attack_depart_ids: params.row.attack_list.map(item => { return Number(item.depart_id); }),
				tittle: '编辑战区PK'
			}).then(res => {
				this.$store.commit('HR_ARCHIVES_ACHIE_PK_LIST_INIT');
			});
		},
		handleColor(name) {
			let newColor = '';
			switch (name) {
				case '21':
					newColor = '#FA61C9';
					break;
				case '22':
					newColor = '#E84C57';
					break;
				case '23':
					newColor = '#8FA4FF';
					break;
				case '24':
					newColor = '#4CD4E8';
					break;
				case '29':
					newColor = '#4CE8A0';
					break;
				case '30':
					newColor = '#FFD940';
					break;
				case '54':
					newColor = '#2397F9';
					break;
				case '55':
					newColor = '#D200FF';
					break;
				case '56':
					newColor = '#2923A6';
					break;
				case '57':
					newColor = '#ED8F4A';
					break;
				case '58':
					newColor = '#FFB2AE';
					break;
				case '12':
					newColor = '#FF0000';
					break;
				default:
					newColor = '#0000FF';
					break;
			}
			return <i class="iconfont icon-yuan g-fs-12 g-m-r-5" style={{ color: newColor }} />;
		},
		getColumns(type) {
			let columns = [];
			switch (type) {
				case '1':
					columns.push(
						{
							title: '擂主战区',
							key: 'guard_zone_name',
							minWidth: 180,
							render: (h, params) => {
								const { guard_zone_name } = params.row;
								return (
									<div>
										{guard_zone_name.length > 15
											? <Tooltip 
												transfer 
												placement="top"
												max-width="200"
											>
												<div>{guard_zone_name.substr(0, 15) + '...'}</div>
												<div slot="content">
													{params.row.guard_list.map(item => {
														return <p>
															{this.handleColor(item.depart_id)}
															<span>{item.depart_name}</span>
														</p>;
													})
													}
												</div>
											</Tooltip>
											: guard_zone_name}
									</div>
								);
							}
						},
						{
							title: '擂主业绩总计',
							key: 'guard_performance',
							minWidth: 120,
							render: (h, params) => {
								return (
									<Tooltip placement="top" transfer>
										<div>
											{params.row.guard_performance}
										</div>
										<div slot="content">
											{params.row.guard_list.map(item => {
												return <p>
													{this.handleColor(item.depart_id)}
													<span>{item.depart_name}</span>：<span>{item.performance}</span>
												</p>;
											})
											}
										</div>
									</Tooltip>
								);
							}
						},
						{
							title: 'PK金额',
							key: 'pk_amount',
							minWidth: 120,
						},
						
						{
							title: '攻擂者战区',
							key: 'attack_zone_name',
							minWidth: 180,
							render: (h, params) => {
								const { attack_zone_name } = params.row;
								return (
									<div>
										{attack_zone_name.length > 15
											? <Tooltip 
												transfer 
												placement="top"
												max-width="200"
											>
												<div>{attack_zone_name.substr(0, 15) + '...'}</div>
												<div slot="content">
													{params.row.attack_list.map(item => {
														return <p>
															{this.handleColor(item.depart_id)}
															<span>{item.depart_name}</span>
														</p>;
													})
													}
												</div>
											</Tooltip>
											: attack_zone_name}
									</div>
								);
							}
						},
						{
							title: '攻擂者业绩总计',
							key: 'attack_performance',
							minWidth: 120,
							render: (h, params) => {
								return (
									<Tooltip placement="top" transfer>
										<div>
											{params.row.attack_performance}
										</div>
										<div slot="content">
											{params.row.attack_list.map(item => {
												return <p>
													{this.handleColor(item.depart_id)}
													<span>{item.depart_name}</span>：<span>{item.performance}</span>
												</p>;
											})
											}
										</div>
									</Tooltip>
								);
							}
						},
						{
							title: '总业绩差额',
							key: 'difference_value',
							minWidth: 120,
						}
					);
					this.listInfo && this.listInfo[type] && this.listInfo[type].data.enable_add === 1 && this.$auth['1124'] && columns.push(
						{
							title: '操作',
							width: 100,
							fixed: 'right',
							render: (h, params) => {
								return (
									<div>
										<span 
											class="g-operation" 
											onClick={() => this.handleAddModal(params)}
										>编辑</span>
									</div>
								);
							}
						}
					);
					return columns;
				case '2':
					columns.push(
						{
							title: '擂主部门',
							key: 'guard_staff',
							minWidth: 120,
						},
						{
							title: '擂主业绩',
							key: 'guard_performance',
							minWidth: 120,
						},
						{
							title: 'PK金额',
							key: 'pk_amount',
							minWidth: 120,
						},
						{
							title: '攻擂者部门',
							key: 'attack_staff',
							minWidth: 120,
						},
						{
							title: '攻擂者业绩',
							key: 'attack_performance',
							minWidth: 120,
						},
						{
							title: '业绩差额',
							key: 'difference_value',
							minWidth: 120,
						}
					);
					return columns;
				case '3':
					columns.push(
						{
							title: '擂主姓名',
							key: 'guard_staff',
							minWidth: 120,
						},
						{
							title: '擂主部门',
							key: 'guard_staff_depart',
							minWidth: 120,
						},
						{
							title: '擂主业绩',
							key: 'guard_performance',
							minWidth: 120,
						},
						{
							title: 'PK金额',
							key: 'pk_amount',
							minWidth: 120,
						},
						{
							title: '攻擂者姓名',
							key: 'attack_staff',
							minWidth: 120,
						},
						{
							title: '攻擂者部门',
							key: 'attack_staff_depart',
							minWidth: 120,
						},
						{
							title: '攻擂者业绩',
							key: 'attack_performance',
							minWidth: 120,
						},
						{
							title: '业绩差额',
							key: 'difference_value',
							minWidth: 120,
						}
					);
					return columns;
				default:
					return columns;
			}
		},
	},
};
