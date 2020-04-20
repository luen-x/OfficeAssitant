import { Dropdown, DropdownMenu, DropdownItem, Tooltip } from 'iview';
import { getParseUrl, getHashUrl } from '@utils/utils';

export default {
	data() {
		return {
			columns: [
				{
					type: 'selection',
					width: 50,
				},
				{
					title: '报名主题',
					key: 'apply_topic',
					minWidth: 300,
					render(h, { row }) {
						return (
							<div>
								{
									row.apply_topic.length > 20
										? <Tooltip placement="bottom" theme="light" content={ row.apply_topic } max-width="220px" transfer>
											{ row.apply_topic.slice(0, 20) } ...
										</Tooltip>
										: <div>{ row.apply_topic }</div>
								}
							</div>				
						);
					}
				},
				{
					title: '报名时间',
					key: 'start_time',
					minWidth: 350,
					render(h, { row }) {
						return (
							<span>{ row.start_time ? row.start_time + ' 至 ' + row.end_time : '未安排' }</span>
						);
					}
				},
				{
					title: '关联事项',
					key: 'course_name',
					minWidth: 230,
					render(h, { row }) {
						return (
							<div>
								{
									row.course_name.length > 15
										? <Tooltip placement="bottom" theme="light" content={ row.course_name } max-width="220px" transfer>
											{ row.course_name.slice(0, 15) } ...
										</Tooltip>
										: <div>{ row.course_name }</div>
								}
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
									<DropdownItem name="result">结果</DropdownItem>
									<DropdownItem name="provide">发放</DropdownItem>
									<DropdownItem name="edit">编辑</DropdownItem>
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
			this.$store.commit('HR_ACADEMY_TRAIN_DETAIL_ENROLL_0_MANAGE_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('HR_ACADEMY_TRAIN_DETAIL_ENROLL_0_MANAGE_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
		handleOperate(name, { row }) {
			const targetPath = '/hr/academy/train/detail/enroll/2/' + name;
			this.$router.push(getHashUrl(
				targetPath, 
				{ 
					apply_id: row.apply_id,
					project_id: this.$route.query.project_id
				}
			));
		}
	}
};

