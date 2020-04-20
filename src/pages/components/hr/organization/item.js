import {
	Dropdown,
	DropdownMenu,
	DropdownItem,
	Tooltip
} from 'iview';
import { oneLinePipe } from '@utils/utils';
import { DelTipModal } from './popup/delete-tip';
import { OrganizationEditModal } from './popup/edit';
import { OrganizationAddModal } from './popup/add';

export default {
	data() {
		return {
			columns: [
				{
					title: '　　组织名称',
					key: 'depart_name',
					minWidth: 200,
					render: (h, params) => {
						const { row: { __level__, __expand__, depart_name, children }, index } = params;

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
							}, depart_name)
						]);
					}
				},
				{
					title: '简称',
					minWidth: 200,
					key: 'abbreviation'
				},
				{
					title: '排序',
					minWidth: 100,
					key: 'sort'
				},
				{
					title: '关联公司',
					minWidth: 200,
					key: 'contract_company_name',
					render: (h, params) => {
						if (params.row.contract_company_name && params.row.contract_company_name.length > 0) {
							if (params.row.contract_company_name.length > 15) {
								return (
									<Tooltip maxWidth={200} content={params.row.contract_company_name}>
										{oneLinePipe(params.row.contract_company_name)}
									</Tooltip>
								);
							}
							return h('div', {}, params.row.contract_company_name);
						}

						return h('div', {}, '');
					}
				},
				{
					title: '管理人',
					minWidth: 200,
					key: 'manager',
					render: (h, params) => {
						if (params.row.manager && params.row.manager.length > 0) {
							if (params.row.manager.join(',').length > 15) {
								return (
									<Tooltip maxWidth={200} content={params.row.manager.join(',')}>
										{oneLinePipe(params.row.manager.join(','))}
									</Tooltip>
								);
							}
							return h('div', {}, params.row.manager.join(','));
						}

						return h('div', {}, '');
					}
				},
				{
					title: '总人数',
					minWidth: 100,
					key: 'depart_num',
				},
				{
					title: '操作',
					minWidth: 100,
					key: 'options',
					render: (h, params) => {
						const { row: { level } } = params; // eslint-disable-line
						let options = [
							h(DropdownItem, {
								props: {
									name: 'del',
									disabled: level === 0
								}
							}, '删除'),
							h(DropdownItem, {
								props: {
									name: 'edit',
									disabled: level === 0
								}
							}, '修改'),
							h(DropdownItem, {
								props: {
									name: 'add'
								}
							}, '添加下级部门')
						];
						if (!this.$auth[273]) options.shift();
						if (!this.$auth[274]) options.shift();
						if (!this.$auth[272]) options.shift();
						return h(Dropdown, {
							props: {
								transfer: true,
								placement: 'left-start'
							},
							on: {
								'on-click': (name) => {
									switch (name) {
										case 'del':
											this.handleDel(params.row);
											break;
										case 'edit':
											this.handleEdit(params.row);
											break;
										case 'add':
											this.handleAdd(params.row);
											break;
										default:
											break;
									}
								}
							}
						}, [
							h('i', {
								class: 'iconfont icon-point g-fs-20 g-pointer',
							}),
							h(DropdownMenu, {
								slot: 'list'
							}, options)
						]);
					}
				}
			],
		};
	},
	methods: {
		handleDel(item) {
			let canDel = parseInt(item.depart_num, 10) == 0;
			let content = !canDel
				? '当前部门员工人数不为0，不可以直接删除，请将员工移出该部门后，在进行操作。'
				: '是否确定删除该部门，删除后，其所有的子部门也将自自动删除？';
			DelTipModal.popup({
				title: "删除提示",
				content,
				departId: item.depart_id,
				canDel
			}).then(res => {

			}).catch(error => {

			});
		},
		handleEdit(item) {
			OrganizationEditModal.popup({
				departId: item.depart_id,
				level: item.level
			}).then(res => {

			}).catch(error => {

			});
		},
		handleAdd(item) {
			OrganizationAddModal.popup({
				departId: item.depart_id,
				departName: item.depart_name,
				level: item.level
			}).then(res => {

			}).catch(error => {

			});
		},
		handleResetFirst() {
			this.$store.commit('HR_ORGANIZATION_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('HR_ORGANIZATION_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
	}
};

