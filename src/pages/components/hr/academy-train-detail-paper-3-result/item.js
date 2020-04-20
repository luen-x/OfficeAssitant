import AutoTooltip from "@common/auto-tooltip/auto-tooltip";
import { AuditPaper } from './popup/audit-paper';

const noteStyle = {
	display: 'inline-block',
	borderRadius: ' 3px',
	padding: '2px 10px',
	lineHeight: '20px',
	transform: 'scale(0.8)'
};

export default {
	data() {
		return {
			allColumns: [
				{
					title: '排名',
					key: 'rank',
					width: 80,
					fixed: 'left',
					sortable: 'custom',
					align: 'center'
				},
				{
					title: '姓名',
					key: 'staff_name',
					fixed: 'left',
					width: 200,
					render(h, { row }) {
						return (
							<div style="white-space: nowrap;">
								<span class="g-c-black1">{ row.staff_name }</span> 
								{
									!row.in_list && <div 
										class="g-bg-red-mid"
										style={ noteStyle }>
										名单外人员
									</div>
								}
							</div>
						);
					}
				},
				{
					title: '部门',
					key: 'depart_name',
					minWidth: 100,
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
					minWidth: 120,
				},
				{
					title: '首考分数',
					key: 'exam_times_0',
					sortable: 'custom',
					minWidth: 110,
					render(h, { row }) {
						return (
							<div>
								{ typeof row.exam_times_0 === 'number' ? row.exam_times_0 : '' }
							</div>
						);
					}
				},
				{
					title: '补考1分数',
					key: 'exam_times_1',
					sortable: 'custom',
					minWidth: 110,
					render(h, { row }) {
						return (
							<div>
								{ typeof row.exam_times_1 === 'number' ? row.exam_times_1 : '' }
							</div>
						);
					}
				},
				{
					title: '补考2分数',
					key: 'exam_times_2',
					minWidth: 110,
					sortable: 'custom',
					render(h, { row }) {
						return (
							<div>
								{ typeof row.exam_times_2 === 'number' ? row.exam_times_2 : '' }
							</div>
						);
					}
				},
				{
					title: '补考3分数',
					sortable: 'custom',
					key: 'exam_times_3',
					minWidth: 110,
					render(h, { row }) {
						return (
							<div>
								{ typeof row.exam_times_3 === 'number' ? row.exam_times_3 : '' }
							</div>
						);
					}
				},
				{
					title: '平均分',
					key: 'average_score',
					width: 80,
					render(h, { row }) {
						return (
							<div>
								{ typeof row.average_score === 'number' ? row.average_score : '' }
							</div>
						);
					}
				}
			],
			examColumns: [
				{
					title: '排名',
					key: 'rank',
					width: 80,
					fixed: 'left',
					sortable: 'custom',
					align: 'center'
				},
				{
					title: '姓名',
					key: 'staff_name',
					fixed: 'left',
					width: 200,
					render(h, { row }) {
						return (
							<div>
								<span class="g-c-black1" style=" width: 200px">{ row.staff_name }</span> 
								{
									!row.in_list && <div 
										class="g-bg-red-mid"
										style={ noteStyle }>
										名单外人员
									</div>
								}
							</div>
						);
					}
				},
				{
					title: '部门',
					key: 'depart_name',
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
					minWidth: 120
				},
				{
					title: '状态',
					key: 'exam_status_name',
					minWidth: 60,
				},
				{
					title: '分数',
					key: 'score',
					sortable: 'custom',
					minWidth: 80,
				},
				{
					title: '用时',
					key: 'total_time',
					sortable: 'custom',
					width: 150
				},
				{
					title: '交卷时间',
					key: 'end_time',
					sortable: 'custom',
					width: 150
				},
				{
					title: '有效性',
					key: 'is_effective',
					width: 80, 
					render(h, { row }) {
						return (<div>
							{ Number(row.is_effective) === 1 ? '有效' : '无效' }
						</div>);
					}
				},
				{
					title: '操作',
					align: 'center',
					fixed: 'right',
					width: 60, 
					render: (h, { row }) => {
						return (
							<div
								class="g-pointer g-c-blue-mid"
								onClick={ () => this.handleOpenDraw(row) }>
								{ 
									+row.exam_status === 1 ? '阅卷' : '查看'
								}
							</div>
						);
					}
				}
			],
			waitColumns: [
				{
					title: '姓名',
					key: 'staff_name',
					fixed: 'left',
					width: 200,
					render(h, { row }) {
						return (
							<div>
								<span class="g-c-black1">{ row.staff_name }</span> 
								{
									!row.in_list && <div 
										class="g-bg-red-mid"
										style={ noteStyle }>
										名单外人员
									</div>
								}
							</div>
						);
					}
				},
				{
					title: '部门',
					key: 'depart_name',
					minWidth: 100,
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
					minWidth: 120
				},
				{
					title: '首次考试',
					sortable: 'custom',
					minWidth: 60,
					render: (h, { row }) => {
						return (
							<div
								class="g-pointer g-c-blue-mid"
								onClick={ () => this.handleOpenDraw(row.exam_result.exam_times_0) }>
								{ 
									+row.exam_result.exam_times_0.exam_status === 1 ? '阅卷' : '查看'
								}
							</div>
						);
					}
				},
				{
					title: '一次补考',
					sortable: 'custom',
					minWidth: 60,
					render: (h, { row }) => {
						return <div
							class="g-pointer g-c-blue-mid"
							onClick={ () => this.handleOpenDraw(row.exam_result.exam_times_1) }>
							{ 
								+row.exam_result.exam_times_1.exam_status === 1 ? '阅卷' : '查看'
							}
						</div>;
					}
				},
				{
					title: '二次补考',
					sortable: 'custom',
					minWidth: 60,
					render: (h, { row }) => {
						return <div
							class="g-pointer g-c-blue-mid"
							onClick={ () => this.handleOpenDraw(row.exam_result.exam_times_2) }>
							{ 
								+row.exam_result.exam_times_2.exam_status === 1 ? '阅卷' : '查看'
							}
						</div>;
					}
				},
				{
					title: '三次补考',
					sortable: 'custom',
					minWidth: 60,
					render: (h, { row }) => {
						return <div
							class="g-pointer g-c-blue-mid"
							onClick={ () => this.handleOpenDraw(row.exam_result.exam_times_3) }>
							{ 
								+row.exam_result.exam_times_3.exam_status === 1 ? '阅卷' : '查看'
							}
						</div>;
					}
				}
			],
			passColumns: [
				{
					title: '姓名',
					key: 'staff_name',
					fixed: 'left',
					width: 200,
					render(h, { row }) {
						return (
							<div>
								<span class="g-c-black1">{ row.staff_name }</span> 
								{
									!row.in_list && <div 
										class="g-bg-red-mid"
										style={ noteStyle }>
										名单外人员
									</div>
								}
							</div>
						);
					}
				},
				{
					title: '部门',
					key: 'depart_name',
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
				},
				{
					title: '首考分数',
					key: 'exam_times_0',
					sortable: 'custom',
					// minWidth: 80,
					render: (h, { row }) => {
						return JSON.stringify(row.exam_result.exam_times_0) !== "{}" ? <div>
							{ row.exam_result.exam_times_0.score }（{ row.exam_result.exam_times_0.exam_status_name }）
						</div> : <div>--</div>;
					}
				},
				{
					title: '补考1分数',
					sortable: 'custom',
					// minWidth: 80,
					key: 'exam_times_1',
					render: (h, { row }) => {
						return JSON.stringify(row.exam_result.exam_times_1) !== "{}" ? <div>
							{ row.exam_result.exam_times_1.score }（{ row.exam_result.exam_times_1.exam_status_name }）
						</div> : <div>--</div>;
					}
				},
				{
					title: '补考2分数',
					// minWidth: 80,
					sortable: 'custom',
					render(h, { row }) {
						return JSON.stringify(row.exam_result.exam_times_2) !== "{}" ? <div>
							{ row.exam_result.exam_times_2.score }（{ row.exam_result.exam_times_2.exam_status_name }）
						</div> : <div>--</div>;
					}
				},
				{
					title: '补考3分数',
					// minWidth: 80,
					sortable: 'custom',
					render(h, { row }) {
						return JSON.stringify(row.exam_result.exam_times_3) !== "{}" ? <div>
							{ row.exam_result.exam_times_3.score }（{ row.exam_result.exam_times_3.exam_status_name }）
						</div> : <div>--</div>;
					}
				},
				{
					title: '平均分',
					width: 80,
					key: 'average_score',
					render(h, { row }) {
						return (
							<div>{ row.average_score }</div>
						);
					}
				}
			]
		};
	},
	methods: {
		getColumns(type) {
			switch (Number(type)) {
				case 1:
					if (!this.first0) {
						this.first0 = 1;
						this.hasExamColumns = [...this.allColumns];
						switch (this.tabs.length) {
							case 6:
								return this.hasExamColumns.splice(5, 3);
							case 7:
								return this.hasExamColumns.splice(6, 2);
							case 8:
								return this.hasExamColumns.splice(7, 1);
							default: return this.allColumns;
						}
					} else {
						return this.hasExamColumns;
					}
				case 2:
					if (!this.first1) {
						this.first1 = 1;
						this.noExamColumns = [...this.allColumns];
						switch (this.tabs.length) {
							case 6:
								this.noExamColumns.splice(5, 3);
								return this.noExamColumns.slice(1);
							case 7:
								this.noExamColumns.splice(6, 2);
								return this.noExamColumns.slice(1);
							case 8:
								this.noExamColumns.splice(7, 1);
								return this.noExamColumns.slice(1);
							default: return this.allColumns;
						}
					} else {
						return this.noExamColumns.slice(1);
					}
				case 3:
				case 4:
				case 5:
				case 6:
					return this.examColumns;
				case 7:
					if (!this.first5) {
						this.first5 = 1;
						switch (this.tabs.length) {
							case 6:
								return this.waitColumns.splice(4, 3);
							case 7:
								return this.waitColumns.splice(5, 2);
							case 8:
								return this.waitColumns.splice(6, 1);
							default: return this.waitColumns;
						}
					} else {
						return this.waitColumns;
					}
				case 8:
				case 9:
					if (!this.first6) {
						this.first6 = 1;
						switch (this.tabs.length) {
							case 6:
								return this.passColumns.splice(4, 3);
							case 7:
								return this.passColumns.splice(5, 2);
							case 8:
								return this.passColumns.splice(6, 1);
							default: return this.passColumns;
						}
					} else {
						return this.passColumns;
					}
				default: return this.allColumns;
			}
		},
		handleResetFirst() {
			this.$store.commit('HR_ACADEMY_TRAIN_DETAIL_PAPER_3_RESULT_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('HR_ACADEMY_TRAIN_DETAIL_PAPER_3_RESULT_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
		handleOpenDraw(rowData) {
			if (!Reflect.has(rowData, 'result_id')) {
				this.$Message.error('暂未考试');
				return;
			}
			AuditPaper.popup({
				examData: rowData
			})
				.catch(() => {})
				.finally(() => {
					this.handleResetFirst();
					this.$parent.$children[0].loadHeaderData();
				});
		}
	}
};

