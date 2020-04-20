import {
	Dropdown,
	DropdownMenu,
	DropdownItem,
	Tooltip
} from 'iview';
import AutoToolTip from "@components/_common/auto-tooltip/auto-tooltip";
import { TableModal } from './popup/table.vue';
import { AuditModal } from "../position-analyze/popup/add.vue";

export default {
	data() {
		return {
			columns: [
				{
					title: '　　部门',
					key: 'depart_name',
					minWidth: 200,
					render: (h, params) => {
						const { row: { __level__, __expand__, depart_name, children, position_name }, index } = params;

						// 点击展开事件
						const handleClick = (e) => {
							this.$refs.table.expand({ index });
						};

						return h('div', {
							style: {
								marginLeft: `${(__level__ - 1) * 20}px`,
								boxSizing: `content-box`
							},
							class: children && "g-pointer",
							on: {
								click: handleClick
							}
						}, [
							h('i', {
								class: `iconfont g-c-black2 g-fs-12 g-m-r-10 ${children ? !__expand__ ? 'icon-triangle-right' : 'icon-triangle-down' : ''}`  // eslint-disable-line
							}),
							h('span', {
							}, depart_name),
							h('span', {
							}, position_name)
						]);
					}
				},
				{
					title: '部门管理',
					key: 'manager',
					minWidth: 220,
					render: (h, params) => {
						return (
							<AutoToolTip
								content={params.row.manager}
								labelClass=""
								theme="dark"
							/>
						);
					}
				},
				{
					title: '在职人数',
					minWidth: 100,
					key: 'inservice_num'
				},
				{
					title: '需求人数',
					minWidth: 100,
					key: 'need_number'
				},
				{
					title: '试岗人数',
					minWidth: 100,
					key: 'try_count'
				},
				{
					title: '入职人数',
					minWidth: 100,
					key: 'entry_count'
				},
				{
					title: '剩余任务',
					minWidth: 100,
					key: 'residue_count'
				},
				{
					title: '招聘要求',
					key: 'staff_standard',
					minWidth: 220,
					render: (h, params) => {
						return (
							<AutoToolTip
								content={params.row.staff_standard}
								labelClass=""
								theme="dark"
							/>
						);
					}
				},
				{
					title: '操作',
					minWidth: 100,
					key: 'options',
					render: (h, params) => {
						const { is_edit  } = params.row; // eslint-disable-line
						return (
							<div>
								{
									this.$auth[1528] && is_edit == 1 
										? <div 
											class="g-operation" 
											onClick={() => this.handleEdit(params.row)}
										>编辑</div> 
										: ''
								}
							</div>
						);	
					}
				}
			],
		};
	},
	methods: {
		handleEdit(info) {
			AuditModal.popup({ title: "需求修改", info }).then(res => {
				this.$store.commit('HR_RECRUIT_SOCIAL_SOCIAL_NEED_POSITION_LIST_INIT');
			}).catch(err => err && console.error(err.msg));
		},
		handleLinkTo() {
			this.$router.push('/');
		},
	}
};

