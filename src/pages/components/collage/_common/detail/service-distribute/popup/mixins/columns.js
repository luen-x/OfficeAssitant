import { Radio, Tooltip } from 'iview';
import AutoTooltip from '@common/auto-tooltip/auto-tooltip';

export default {
	data() {
		const personColumns = [
			{
				title: '姓名',
				key: 'staff_name',
				minWidth: 100
			},
			{
				title: '部门',
				key: 'depart_name',
				minWidth: 120
			},
			{
				title: '职位',
				key: 'position_name',
				minWidth: 120
			},
			{
				title: '待完成流程',
				key: 'wait_process',
				minWidth: 120,
				render: (h, { row, index }) => {
					return (
						<div>
							{
								row.wait_process ? <Tooltip 
									transfer
									placement="right-start"
									maxWidth={300}
									onOn-popper-show={() => {
										this.handleContent(row, 1, index, 'wait_process');
									}}
								>
									<span class="g-c-blue-mid">{ row.wait_process }</span>
									<div slot="content">
										{this.renderPopContent(index, 'wait_process')}
									</div>
								</Tooltip> : <span class="g-c-blue-mid">{ row.wait_process }</span>
							}
						</div>
					);
				}
			},
			{
				title: '待讲课数',
				key: 'wait_lesson',
				minWidth: 120,
				render: (h, { row, index }) => {
					return (
						<div>
							{
								row.wait_lesson ? <Tooltip 
									transfer
									placement="right-start"
									maxWidth={300}
									onOn-popper-show={() => {
										this.handleContent(row, 4, index, 'wait_lesson');
									}}
								>
									<span class="g-c-blue-mid">{ row.wait_lesson }</span>
									<div slot="content">
										{this.renderPopContent(index, 'wait_lesson')}
									</div>
								</Tooltip> : <span class="g-c-blue-mid">{ row.wait_lesson }</span>
							}
						</div>
					);
				}
			},
			{
				title: '本月完成流程',
				key: 'month_complete_process_count',
				minWidth: 120
			},
			{
				title: '本月完成讲课',
				key: 'month_complete_lecture_count',
				minWidth: 120
			},
			{
				title: '本年完成流程',
				key: 'year_complete_process_count',
				minWidth: 120
			},
			{
				title: '本年完成讲课',
				key: 'year_complete_lecture_count',
				minWidth: 120
			},
			{
				title: '累计完成流程',
				key: 'has_process',
				minWidth: 120
			},
			{
				title: '累计完成讲课',
				key: 'has_lesson',
				minWidth: 120
			},
			{
				title: '最近一次对接时间',
				key: 'last_process_time',
				minWidth: 160
			},
			{
				title: '最近一次讲课时间',
				key: 'last_lesson_time',
				minWidth: 160
			}
		];
		return {
			content: null,
			popContent: {},
			dockerColumns: [
				{
					title: ' ',
					width: 60,
					fixed: "left",
					render: (h, { row }) => {
						return (
							<div onClick={() => window.event.stopPropagation()}>
								<Radio label={row.staff_id}>
									<span></span>
								</Radio>
							</div>
						);
					}
				},
				...personColumns
			],
			otherRoleColumns: [
				{
					type: "selection",
					width: 60,
					fixed: "left",
				},
				...personColumns
			],
			recordColumns: [
				{
					title: '公司名称',
					key: 'contract_company_name',
					minWidth: 150,
					render: (h, { row }) => {
						return (
							<div>
								<AutoTooltip 
									content={row.contract_company_name}
									theme="dark"
									placement="bottom"
									labelClass="g-c-black3"
								/>
							</div>
						);
					}
				},
				{
					title: '下单产品',
					key: 'product_name',
					minWidth: 150,
					render: (h, { row }) => {
						return (
							<div>
								<AutoTooltip 
									content={row.product_name}
									theme="dark"
									placement="bottom"
									labelClass="g-c-black3"
								/>
							</div>
						);
					}
				},
				{
					title: '客户姓名',
					key: 'customer_name',
					minWidth: 100
				},
				{
					title: '角色',
					key: 'role_type_name',
					minWidth: 120
				},
				{
					title: '负责人',
					key: 'staff_name',
					minWidth: 100
				},
				{
					title: '分配时间',
					key: 'assign_time',
					minWidth: 160
				},
				{
					title: '合同编号',
					key: 'contract_num',
					minWidth: 120,
					render: (h, { row }) => {
						return (
							<div>
								<AutoTooltip 
									content={row.contract_num}
									theme="dark"
									placement="bottom"
									labelClass="g-c-black3"
								/>
							</div>
						);
					}
				}
			]
		};
	},
	methods: {
		handleContent(row, role_type, index, colKey) {
			if (this.popContent[colKey + index]) return;
			this.$request({
				url: '_COLLAGE_BUSINESS_STAFF_ORDER_DETAIL_GET',
				type: 'GET',
				loading: false,
				param: {
					staff_id: row.staff_id,
					role_type
				},
				autoTip: false
			}).then((res) => {
				this.$set(this.popContent, colKey + index, res.data);
			}).catch((error) => {
				this.$Message.error(error.msg);
			});
		},
		renderPopContent(index, colKey) {
			const data = this.popContent[colKey + index];
			if (!data) return <span/>;
			return (
				<div>
					{data.map((item) => {
						return (
							<div>
								<span>{ item.contract_company_name }</span>
								<span>（{ item.num }）</span>
							</div>
						);
					})}
				</div>
			);
		}
	},
};