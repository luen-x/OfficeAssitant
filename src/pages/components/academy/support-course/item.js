import AutoTooltip from "@components/_common/auto-tooltip/auto-tooltip";
import { Confirm } from "@common/confirm/confirm";
import API_ROOT from "@stores/apis/root";
import { PreModal } from './popup/pre-modal';

export default {
	data() {
		return {
			preColumns: [
				{
					type: "selection",
					fixed: "left",
					width: 50
				},
				{
					title: '课程名称',
					minWidth: 180,
					fixed: "left",
					key: 'course_name',
					render: (h, params) => {
						return (
							<AutoTooltip content={params.row.course_name} theme="dark" placement="bottom" labelClass=" "/>
						);
					}
				},
				{
					title: 'TAB命名',
					minWidth: 150,
					key: 'tab',
				},
				{
					title: '适用部门',
					minWidth: 150,
					key: 'depart_str',
					render: (h, params) => {
						return (
							<AutoTooltip content={params.row.depart_str} theme="dark" placement="bottom" labelClass=" "/>
						);
					}
				},
				{
					title: '创建人',
					minWidth: 150,
					key: 'staff_name',
				},
				{
					title: '创建时间',
					minWidth: 170,
					key: 'create_time',
				},
				{
					title: '更新人',
					minWidth: 150,
					key: 'update_staff_name',
				},
				{
					title: '更新时间',
					minWidth: 170,
					key: 'update_time',
				}
			],
			supportColumns: [
				{
					type: "selection",
					fixed: "left",
					width: 50
				},
				{
					title: '课程名称',
					minWidth: 180,
					fixed: "left",
					key: 'course_name',
					render: (h, params) => {
						return (
							<AutoTooltip content={params.row.course_name} theme="dark" placement="bottom" labelClass=" "/>
						);
					}
				},
				{
					title: '创建人',
					minWidth: 150,
					key: 'staff_name',
				},
				{
					title: '创建时间',
					minWidth: 170,
					key: 'create_time',
				},
				{
					title: '更新人',
					minWidth: 150,
					key: 'update_staff_name',
				},
				{
					title: '更新时间',
					minWidth: 170,
					key: 'update_time',
				}
			]
		};
	},
	computed: {
		getColumns() {
			let columns = [{
				title: '操作',
				minWidth: 130,
				key: 'options',
				fixed: 'right',
				render: (h, params) => {
					return (
						<div>
							{
								this.$auth[1633] ? <span class="g-operation" onClick={(e) => {
									e.stopPropagation();
									this.handleEdit(params.row);
								}}>编辑</span> : ''
							}
							{
								this.$auth[1634]
									? <span style={{ color: "#2397f9", width: "1px", height: "10px", margin: "0 10px 0 10px" }}>
								|
									</span> : ''
							}
							{
								this.$auth[1634] ? <span class="g-operation" onClick={(e) => {
									e.stopPropagation(); 
									this.handleDelete([params.row.course_id]);
								}}>删除</span> : ''
							}
						</div>
							
					);
				}
			}];
			if (this.type == '1') {
				columns.unshift(...this.preColumns);
			} else {
				columns.unshift(...this.supportColumns);
			}
			return columns;
		},
	},
	methods: {
		handleEdit(row) {
			if (this.type == '1') {
				PreModal.popup({
					data: row,
					edit: 1
				}).then().catch(error => {
					console.error(error);
				});
			} else {
				this.$router.push({
					path: '/academy/support/course/add',
					query: {
						edit: 1,
						course_id: row.course_id
					}
				});
			}
		},
		handleDelete(item) {
			Confirm.popup({
				title: "",
				msg: "删除后将无法恢复，确定要删除吗？",
				showIcon: true
			}).then(() => {
				let api = this.type == '1'
					? '_ACADEMY_SUPPORT_COURSE_PRE_DELETE_POST' : '_ACADEMY_SUPPORT_COURSE_DELETE_POST';
				this.$request({
					url: api,
					type: "POST",
					param: {
						course_ids: item
					},
					loading: false
				}).then(res => {
					this.$Message.success(res.msg);
					this.$store.commit('ACADEMY_SUPPORT_COURSE_LIST_INIT');
				}).catch(error => {
					this.$Message.error(error.msg);
				});
			});
		},
		handleResetFirst() {
			this.$store.commit('ACADEMY_SUPPORT_COURSE_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('ACADEMY_SUPPORT_COURSE_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
	}
};

