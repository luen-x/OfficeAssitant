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
					title: '投票主题',
					key: 'vote_topic',
					minWidth: 300,
					render(h, { row }) {
						return (
							<div>
								{
									row.vote_topic.length > 20
										? <Tooltip placement="bottom" theme="light" content={ row.vote_topic } max-width="220px" transfer>
											{ row.vote_topic.slice(0, 20) } ...
										</Tooltip>
										: <div>{ row.vote_topic }</div>
								}
							</div>				
						);
					}
				},
				{
					title: '投票时间',
					key: 'start_time',
					minWidth: 260,
					render(h, { row }) {
						return (
							<span>{ row.start_time ? row.start_time + ' 至 ' + row.end_time : '未安排' }</span>
						);
					}
				},
				{
					title: '投票方式',
					key: 'vote_method_name',
					minWidth: 150
				},
				{
					title: '投票小标题',
					key: 'item',
					minWidth: 400,
					render: (h, { row }) => {
						return (
							<div style={{ cursor: 'pointer' }}>
								{
									row.item.length == 1 
									&& <span>
										投票1：{ row.item[0].item_title }
									</span>
								}
								{
									row.item.length > 1
									&& <Tooltip 
										placement="bottom" 
										theme="light" 
										maxWidth={ 380 } 
										transfer>
										<span style={{ wordBreak: 'break-all', wordWrap: "break-word" }}>投票1：{ row.item[0].item_title }...</span>
										<div slot="content">
											{
												row.item.map((v, i) => (
													<p style={{ wordBreak: "break-all", wordWrap: "break-word" }}>
														投票{ i + 1 }：{ v.item_title }
													</p>
												))
											}
										</div>
									</Tooltip>
								}
							</div>
						);
					}
				},
				{
					title: '操作',
					align: 'center',
					width: 80,
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
			this.$store.commit('HR_ACADEMY_TRAIN_DETAIL_VOTE_0_MANAGE_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('HR_ACADEMY_TRAIN_DETAIL_VOTE_0_MANAGE_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
		handleOperate(name, { row }) {
			const targetPath = '/hr/academy/train/detail/vote/2/' + name;
			this.$router.push(getHashUrl(
				targetPath, 
				{ 
					vote_id: row.vote_id,
					project_id: this.$route.query.project_id
				}
			));
		}
	}
};

