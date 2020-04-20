import { Dropdown, DropdownMenu, DropdownItem, Tooltip } from 'iview';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { ModalTip } from '@components/hr/academy-train-detail/_common/popup/model-tips';
import AutoToolTip from "@components/_common/auto-tooltip/auto-tooltip";
import API_ROOT from '@stores/apis/root';

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
					title: '签到名称',
					key: 'sign_topic',
					minWidth: 150,
					render: (h, params) => {
						let sign_topic = params.row.sign_topic;
	
						return (
							<AutoToolTip 
								content={sign_topic}
								width="130px"
								theme="dark"
								placement="bottom" 
								labelClass=" "
							/>
						);
					}
				},
				{
					title: '开场签到',
					key: 'start_time',
					minWidth: 200,
					render(h, { row }) {
						let in_time = row.in_start_time + '至' + row.in_end_time;
						return (
							<div>
								{
									in_time.length > 17
										? <Tooltip class="g-pointer" transfer max-width="300">
											<span>{ in_time.slice(0, 17) + '...' }</span>
											<div slot="content">
												{ in_time }
											</div>
										</Tooltip> : <span></span>
								}
							</div>
						);
					}
				},
				{
					title: '离场签退',
					key: 'start_time',
					minWidth: 200,
					render(h, { row }) {
						let back_time = row.back_start_time + '至' + row.back_end_time;
						return (
							<div>
								{
									back_time.length > 17
										? <Tooltip class="g-pointer" transfer max-width="300">
											<span>{ back_time.slice(0, 17) + '...' }</span>
											<div slot="content">
												{ back_time }
											</div>
										</Tooltip> : <span></span>
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
										? <span>
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
					title: '签到状态',
					key: 'activity_status_name',
					minWidth: 100,
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
									<DropdownItem name="4/result">结果</DropdownItem>
									<DropdownItem name="3/provide">发放</DropdownItem>
									<DropdownItem name="2/edit">编辑</DropdownItem>
									<DropdownItem name="delete">删除</DropdownItem>
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
			this.$store.commit('HR_ACADEMY_TRAIN_DETAIL_SIGN_0_MANAGE_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('HR_ACADEMY_TRAIN_DETAIL_SIGN_0_MANAGE_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
		handleOperate(name, { row }) {
			if (name == 'delete') {
				ModalTip.popup({
					title: '删除提示',
					content: "删除后不可恢复，是否确认删除？"
				}).then(res => {
					
					this.$request({
						url: API_ROOT._HR_ACADEMY_TRAIN_DETAIL_SIGN_DELETE_POST,
						param: { 
							sign_ids: [row.sign_id]
						},
						type: 'POST'
					}).then(response => {
						this.$Message.success(response.msg);
						this.$store.commit('HR_ACADEMY_TRAIN_DETAIL_SIGN_0_MANAGE_LIST_INIT');
					}).catch(err => {
						this.$Message.error(err.msg);
					});
				}).catch(error => {
					console.error(error);
				});
			} else {
				const targetPath = '/hr/academy/train/detail/sign/' + name;
				this.$router.push(getHashUrl(
					targetPath, 
					{ 
						sign_id: row.sign_id,
						project_id: this.$route.query.project_id,
						sign_topic: row.sign_topic,
						relation_type: row.relation_type,
						relation_id: row.relation_id.map(v => v.course_id),
						label: row.relation_id.length ? row.relation_id.map(v => v.course_name) : '整个项目'
					}
				));
			}
			
		}
	}
};

