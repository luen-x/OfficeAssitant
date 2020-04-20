import { Dropdown, DropdownMenu, DropdownItem } from 'iview';
import ROOT_API from '@stores/apis/root';
import AutoTooltip from "@common/auto-tooltip/auto-tooltip";
import { PModalDelete } from './popup/delete';
import { PModalDetail } from './popup/detail';

export default {
	data() {
		return {
			columns: [
				{
					type: 'selection',
					width: 50
				},
				{
					title: '通知标题',
					key: 'title',
					minWidth: 160,
					render: (h, { row }) => {
						return (
							<div onClick={() => this.handleLookDetail(row)}>
								<AutoTooltip content={ row.title } />
							</div>
						);
					}
				},
				{
					title: '通知类型',
					key: 'notice_type_name',
					minWidth: 150,
				},
				{
					title: '通知内容',
					key: 'content',
					minWidth: 150,
					render(h, { row }) {
						return (
							<AutoTooltip
								content={ row.content }
								labelClass=" "
							/>
						);
					}
				},
				{
					title: '接收角色',
					key: 'notice_role',
					minWidth: 150,
					render(h, { row }) {
						return (
							<AutoTooltip
								content={ row.notice_role }
								labelClass=" "
							/>
						);
					}
				},
				{
					title: '发送类型',
					key: 'send_type_name',
					minWidth: 100,
				},
				{
					title: '使用状态',
					key: 'status_name',
					minWidth: 100,
				},
				{
					title: '操作',
					key: 'operate',
					width: 100,
					align: 'center',
					fixed: 'right',
					render: (h, params) => {
						return h(Dropdown, {
							style: 'cursor: pointer; width: 100%; height: 100%; text-align: center;',
							props: { transfer: true, placement: 'left-start' },
							on: {
								'on-click': (name) => {
									switch (name) {
										case '1':
											PModalDetail.popup({ data: params.row }).catch(() => {});
											break;
										case '2':
											PModalDelete.popup({ data: [params.row] }).then(res => {
												this.handleResetCur();
											}).catch(() => {});
											break;
										case '3':
											this.handleToggle(params.row.notice_id);
											break;
										default:
											throw Error('这是一个bug');
									}
								}
							}
						}, [
							h('i', {
								class: 'iconfont icon-point',
								style: 'font-size: 20px;',
							}),
							h(DropdownMenu, { slot: 'list', }, [
								[
									this.$auth['62'] ? h(DropdownItem, { props: { name: '1' } }, '查看') : '',
									this.$auth['63'] ? h(DropdownItem, { props: { name: '2' } }, '删除') : '',
									params.row.status != '3'
										? [
											params.row.status == '1' ? h(DropdownItem, { 
												props: { name: '3' },
												style: { display: this.$auth['64'] ? 'block' : 'none' } },
											'关闭') : '',
											params.row.status != '1' ? h(DropdownItem, { 
												props: { name: '3' },
												style: { display: this.$auth['65'] ? 'block' : 'none' }
											 },
											'开启') : '']
										: null]
							])
						]);
					}
				}
			],
		};
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('CONTENT_NOTICE_INFORM_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('CONTENT_NOTICE_INFORM_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
		handleLookDetail(row) {
			PModalDetail.popup({ data: row }).catch(() => {});
		},
		handleToggle(id) {
			this.$request({
				url: ROOT_API._CONTENT_NOTICE_INFORM_TOGGLE_STATUS_POST,
				type: 'POST',
				param: {
					notice_id: id
				}
			}).then(res => {
				this.$Message.success(res.msg);
				this.$store.commit('CONTENT_NOTICE_INFORM_LIST_RESET', { type: this.type });
			}).catch(err => this.$Message.error(err.msg));
		}
	}
};

