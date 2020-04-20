import { Dropdown, DropdownMenu, DropdownItem, Tooltip } from 'iview';
import { getParseUrl, getHashUrl } from '@utils/utils';
import AutoToolTip from "@components/_common/auto-tooltip/auto-tooltip";

export default {
	data() {
		return {
			columns: [
				{
					type: 'selection',
					fixed: 'left',
					minWidth: 50,
					align: 'center'
				},
				{
					title: '试卷名称',
					key: 'paper_name',
					minWidth: 150,
					render: (h, params) => {
						let paper_name = params.row.paper_name;
	
						return (
							<AutoToolTip 
								content={paper_name}
								width="130px"
								theme="dark"
								placement="bottom" 
								labelClass=" "
							/>
						);
					}
				},
				{
					title: '能否补考',
					key: 'exam_again_name',
					minWidth: 100
				},
				{
					title: '及格分数',
					key: 'pass_score',
					minWidth: 100
				},
				{
					title: '试卷类型',
					key: 'paper_type_name',
					minWidth: 100
				},
				{
					title: '考试时间',
					key: 'start_time',
					minWidth: 260,
					render(h, { row }) {
						return (
							<div>
								{
									row.again.length
										? <Tooltip class="g-pointer" transfer max-width="300">
											<span>{ row.start_time + ' 至 ' + row.end_time }</span>
											<div slot="content">
												{ row.again.map((item, index) => <div key={index}>补考{index + 1} 
												：{item.start_time} 至 {item.end_time}</div>)}
											</div>
										</Tooltip>
										: row.start_time ? <span>{ row.start_time + ' 至 ' + row.end_time }</span>
											: <span>未安排</span>
								}
							</div>
						);
					}
				},
				{
					title: '关联事项',
					key: 'relation_id',
					minWidth: 200,
					render: (h, params) => {
						const { relation_id, relation_type } = params.row;
						let content = relation_type == 1
							? '整个项目' : relation_id.map(v => v.course_name).join(',');
						return (
							<div class="g-flex-ac">
								<span>
									{ content.length <= 11
										? <span class="g-pointer">
											{content}
										</span>
										: <Tooltip class="g-pointer" transfer>
											{content.slice(0, 11) + '...'}
											<div slot="content">
												{content}
											</div>
										</Tooltip>
									}
								</span>
							</div>
						);
					}
				},
				{
					title: '操作',
					align: 'center',
					width: 120,
					fixed: 'right',
					render: (h, params) => {
						return (
							<Dropdown 
								style={{ cursor: 'pointer', width: '100%', height: '100%', textAlign: 'center' }}
								transfer
								placement="left-start"
								onOn-click={ (name) => this.handleOperate(name, params) }>
								<i class="iconfont icon-point" style={{ fontSize: '20px' }}></i>
								<DropdownMenu slot="list">
									<DropdownItem name="3/result">结果</DropdownItem>
									<DropdownItem name="2/arrange">安排考试</DropdownItem>
									<DropdownItem name="1/add">编辑</DropdownItem>
								</DropdownMenu>
							</Dropdown>
						);
					}
				}
			],
		};
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('HR_ACADEMY_TRAIN_DETAIL_PAPER_0_PASS_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('HR_ACADEMY_TRAIN_DETAIL_PAPER_0_PASS_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
		handleOperate(name, { row }) {
			const targetPath = '/hr/academy/train/detail/paper/' + name;
			//  [
			// 	'/hr/academy/train/detail/exam/6/result',
			// 	'/hr/academy/train/detail/exam/6/arrange',
			// 	'/hr/academy/train/detail/exam/6/edit'
			// ]
			this.$router.push(getHashUrl(
				targetPath, 
				{ 
					paper_id: row.paper_id,
					project_id: this.$route.query.project_id,
					paper_name: row.paper_name,
					exam_id: row.exam_id
				}
			));
		}
	}
};

