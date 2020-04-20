import Explain from '@components/_common/explain/explain';
import AutoTooltip from "@common/auto-tooltip/auto-tooltip";
import { PModalDelete } from './popup/delete';
import { ModifyDrawer } from './popup/modify';
import { LEVEL_DESC } from './popup/add-new-role.vue';
import { StaffDetail } from './popup/staff-detail.vue';

const LEVEL = {
	'1': '高级管理 ',
	'2': '中级管理',
	'3': '普通员工'
};

export default {
	data() {
		return {
			columns: [
				{
					type: 'selection',
					width: 50
				},
				{
					title: '角色名称',
					key: 'role_name',
				},
				{
					title: '角色描述',
					key: 'role_describe',
					minWidth: 150,
					render(h, { row }) {
						return (
							<AutoTooltip content={ row.role_describe } labelClass=" "/>
						);
					}
				},
				{
					title: '角色人数',
					key: 'use_num',
					render: (h, { row }) => {
						return (
							<div class="g-c-blue-mid g-pointer" onClick={ () => StaffDetail.popup({ 
								role_id: row.role_id,
								role_name: row.role_name }).catch(err => () => {}) }>
								{ row.use_num }
							</div>);
					}
				},
				{
					title: '角色等级',
					renderHeader(h, param) {
						return (
							<span>
								角色等级
								<Explain style="margin-left: 5px" content={LEVEL_DESC} placement="bottom-start"/>
							</span>
						);
					},
					key: 'level',
					render(h, { row }) {
						return (
							<div>{ LEVEL[row.level] }</div>
						);
					}
				},
				{
					title: '操作',
					key: 'link',
					render: (h, params) => {
						return h('div', {
							style: {
								marginRight: '5px',
								position: 'relative'
							},
						}, [
							this.$auth['270'] ? h('span', {
								class: 'g-c-blue-dark g-pd-r-10 g-relative',
								on: {
									click() {
										ModifyDrawer.popup({ data: params.row });
									}
								},
								style: {
									// borderRight: this.$auth['271'] || this.$auth['270'] ? '1px solid #1f90ef' : '',
									cursor: 'pointer'
								}
							}, '修改') : '',
							this.$auth['271'] || this.$auth['270'] ? h('i', {
								'class': ['g-bg-blue-mid', 'g-absolute'],
								style: {
									width: '1px',
									height: '12px',
									display: 'inline-block',
									marginTop: '4px',
								}
							}, '') : '',
							this.$auth['271'] ? h('span', {
								class: 'g-c-blue-mid g-pd-l-10',
								on: {
									click() {
										let message = '';
										let canDelete = '';
										if (params.row.use_num) {
											canDelete = true;
											message = '当前角色人数不为0，不可以直接删除！';
										} else {
											canDelete = false;
											message = '是否确定删除该角色？删除后与该角色相关的功能设置也将被清空！';
										}
										PModalDelete.popup({
											role_ids: [params.row.role_id],
											message,
											canDelete
										 });
									}
								},
								style: {
									cursor: 'pointer'
								}
							}, '删除') : ''
						]);
					}
				}
			],
		};
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('HR_ROLE_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('HR_ROLE_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
	}
};

