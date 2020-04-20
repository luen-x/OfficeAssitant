import { ModalTip } from '@components/hr/academy-train-detail/_common/popup/model-tips';
import API_ROOT from '@stores/apis/root';
import AutoTooltip from "@common/auto-tooltip/auto-tooltip";
import { Tooltip } from 'iview';

export default {
	data() {
		return {
			columns: [
				{
					type: 'selection',
					width: 50,
					fixed: 'left',
					align: 'center'
				},
				{
					title: '姓名',
					key: 'staff_name',
					fixed: 'left',
					minWidth: 100,
					render(h, { row }) {
						return (
							<div>
								{	
									row.all_echelon.length > 1 && <div 
										class="g-dp-ib g-bg-red-mid g-tc g-m-r-10 g-pointer" 
										style="width: 28px; line-height: 17px; color: #fff;border-radius: 2px">
										 <Tooltip 
											content={ `该人员存在于多个梯队中：${row.all_echelon.join('、')}，不同梯队之间中可能存在部分条件重合，请检查梯队设置条件！` } 
											placement="bottom-start"
											max-width="220"
											transfer
											theme="light">
											注
										</Tooltip>
									</div>
								}
								{ row.staff_name }
							</div>
						);
						

					}
				},
				{
					title: '部门',
					key: 'depart_name',
					minWidth: 60,
					render(h, { row }) {
						return (
							<AutoTooltip
								content={ row.depart_name }
								labelClass=" "
							/>
						);
					}
				},
				{
					title: '手机号码',
					key: 'mobile',
					minWidth: 90,
					render(h, { row }) {
						return (
							<AutoTooltip
								content={ row.mobile }
								labelClass=" "
							/>
						);
					}
				},
				{
					title: '入职时间',
					key: 'create_time',
					minWidth: 80,
					render(h, { row }) {
						return (
							<AutoTooltip
								content={ row.create_time }
								labelClass=" "
							/>
						);
					}
				},
				{
					title: '职位',
					key: 'position_name',
					minWidth: 60,
					render(h, { row }) {
						return (
							<AutoTooltip
								content={ row.position_name }
								labelClass=" "
							/>
						);
					}
				},
				{
					title: '工龄',
					key: 'seniority',
					minWidth: 50,
					render(h, { row }) {
						return (
							<AutoTooltip
								content={ row.seniority }
								labelClass=" "
							/>
						);
					}
				},
				{
					title: '业绩',
					key: 'achievement',
					minWidth: 40,
					render(h, { row }) {
						return (
							<AutoTooltip
								content={ row.achievement }
								labelClass=" "
							/>
						);
					}
				},
				{
					title: '操作',
					tooltip: true,
					align: 'center',
					fixed: 'right',
					width: 80,
					render: (h, { row }) => {
						return (
							<div 
								class="g-pointer g-c-blue-mid"
								onClick={ () => this.handleSingleDel(row) }
							>删除</div>
						);
					}
				}
			],
		};
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('HR_ACADEMY_ELITE_TALENT_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('HR_ACADEMY_ELITE_TALENT_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
		
	}
};

