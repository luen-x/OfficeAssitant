import API_ROOT from "@stores/apis/root";
import {
	Dropdown,
	DropdownMenu,
	DropdownItem,
	Tooltip
} from 'iview';
import { AddApprentice } from "./popup/add-apprentice";
import { ReduceApprentice } from "./popup/reduce-apprentice";

export default {
	data() {
		return {
			columns: [
				{
					title: '姓名',
					key: 'staff_name',
					fixed: "left",
					minWidth: 200,
					render: (h, params) => {
						const { staff_status } = params.row;
						return (
							<span
								style={{ display: 'block', width: '100%' }}
								onClick={() => this.handleLinkTo(params)}>
								{params.row.staff_name}
							</span>
						);
					}
				},
				{
					title: '手机号码',
					key: 'mobile',
					fixed: "left",
					minWidth: 120
				},
				{
					title: '工号',
					key: 'staff_number',
					minWidth: 120
				},
				{
					title: '部门',
					key: 'depart_name',
					minWidth: 200,
					
				},
				{
					title: '职位',
					key: 'position_name',
					minWidth: 200,
					
				},
				{
					title: '关联徒弟',
					key: 'apprentice_names',
					minWidth: 220,
					render: (h, params) => {
						const { apprentice_names } = params.row;
						return (
							<div>
								{apprentice_names.length > 15
									? <Tooltip 
										transfer 
										placement="bottom"
										style="display: block;maxWidth:200px"
									>
										<div>{apprentice_names.substr(0, 15) + '...'}</div>
										<div slot="content">
											<p style="whiteSpace: normal">
												{apprentice_names}
											</p>
								
										</div>
									</Tooltip>
									: apprentice_names}
							</div>
						);
					}
				},
				{
					title: '操作',
					key: 'status',
					minWidth: 100,
					render: (h, params) => {
						return (
							(this.$auth['1236'] || this.$auth['1236'] || this.$auth['1237']) && h(Dropdown, {
								props: {
									transfer: true, placement: 'left-start'
								},
								on: {
									'on-click': (name) => this.handleClick(name, params)
								}
							}, [
								h('i', {
									class: 'iconfont icon-point',
									style: 'font-size: 20px'

								}),
								h(DropdownMenu, {
									slot: 'list'
								}, [
									this.$auth['1236'] && h(DropdownItem, {
										props: {
											name: '1'
										},
									}, '分配徒弟'),
									 params.row.apprentice_names !== '' && this.$auth['1237'] && h(DropdownItem, {
										props: {
											name: '2'
										}
									}, '减少徒弟')
								])
							])
						);
					}
				}
			],
		};
	},
	methods: {
		handleClick(name, params) {
			switch (name) {
				case '1':
					AddApprentice.popup({
						master_id: params.row.master_id,
						type: 2
					}).then(res => {
					});
					break;
				case '2':
					ReduceApprentice.popup({
						master_id: params.row.master_id,
					}).then(res => {
					});
					break;
				default:
					break;
			}
		}
	}
};

