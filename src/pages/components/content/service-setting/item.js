import { Tooltip } from "iview";
import { ContentServiceSettingPromptModal } from "./modal/prompt.vue";
import { AddServiceModal } from './modal/add-service';

export default {
	data() {
		return {
			columns: [
				{
					title: "服务项名称",
					key: "service_name",
					minWidth: 100,
					tooltip: true
				},
				{
					title: "服务项类型",
					key: "service_type",
					minWidth: 100,
					tooltip: true
				},
				{
					title: "服务项定义",
					key: "service_define",
					minWidth: 100,
					tooltip: true
				},
				{
					title: "关联产品",
					key: "product_items",
					minWidth: 160,
					tooltip: true,
					render: (h, params) => {
						let product_items = params.row.product_items 
						&& params.row.product_items.length != 0 ? params.row.product_items.join('、') : "-";

						return h("div", {}, 
							[product_items && product_items.length > 8
								?	h(Tooltip, {
									props: {
										content: product_items,
										transfer: true,
										maxWidth: 250
									}
								}, product_items.slice(0, 8) + '...')
								: product_items]);
					}
				},
				{
					title: "适用部门",
					key: "depart_items",
					minWidth: 100,
					tooltip: true,
					render: (h, params) => {
						let depart_items = params.row.depart_items 
						&& params.row.depart_items.length != 0 ? params.row.depart_items.join('、') : "-";

						return h("div", {}, 
							[depart_items && depart_items.length > 8
								?	h(Tooltip, {
									props: {
										content: depart_items,
										transfer: true,
										maxWidth: 250
									}
								}, depart_items.slice(0, 8) + '...')
								: depart_items]);
					}
				},
				{
					title: "适用职位",
					key: "position_items",
					minWidth: 100,
					tooltip: true,
					render: (h, params) => {
						let position_items = "";

						if (params.row.position_items && params.row.position_items.length != 0) {
							params.row.position_items.forEach((item, index, array) => {
								if (index < array.length - 1) {
									position_items += item.position_name + "、";
								} else {
									position_items += item.position_name;
								}
							});
						}

						return h("div", {}, 
							[position_items && position_items.length > 8
								?	h(Tooltip, {
									props: {
										content: position_items,
										transfer: true,
										maxWidth: 250
									}
								}, position_items.slice(0, 8) + '...')
								: (position_items || '-')]);
					}
				},
				{
					title: "第一阶段",
					key: "first_time",
					minWidth: 100,
					tooltip: true
				},
				{
					title: "第二阶段",
					key: "second_time",
					minWidth: 100,
					tooltip: true
				},
				{
					title: "第三阶段",
					key: "third_time",
					minWidth: 100,
					tooltip: true
				},
				{
					title: "服务项有效期",
					key: "service_validity",
					minWidth: 100,
					tooltip: true,
					render: (h, params) => {
						if (params.row.service_validity && params.row.service_validity !== '-') {
							return (
								<div>{params.row.service_validity}个月</div>
							);
						} else {
							return <span>-</span>;
						}	
					}
				},
				{
					title: "操作",
					key: "",
					minWidth: 100,
					tooltip: true,
					render: (h, params) => {
						let edit = "none";
						let del = "none";
						
						this.$auth["733"] ? edit = "inline-block" : "none";
						this.$auth["1191"] ? del = "inline-block" : "none";

						return h('div', {
							style: {
								minWidth: '150px',
								marginRight: '20px'
							}
						}, [
							h('span', {
								style: {
									color: '#2397f9',
									display: edit,
									padding: '2px 8px 2px 0px',
									cursor: 'pointer'
								},
								on: {
									click: () => {
										let set_id = Number(params.row.set_id);

										AddServiceModal.popup({
											set_id
										}).then(res => {
											res && this.$store.commit('CONTENT_SERVICE_SETTING_LIST_RESET', { type: "" });
										});
									}
								}
							}, '编辑'),
							h('span', {
								style: {
									background: '#2397f9',
									display: edit,
									width: '1px',
									height: '10px'
								}
							}),
							h('span', {
								style: {
									color: '#2397f9',
									display: del,
									padding: '2px 8px',
									cursor: 'pointer'
								},
								on: {
									click: () => {
										let set_id = Number(params.row.set_id);

										ContentServiceSettingPromptModal.popup({
											set_id
										}).then(res => {
											res && this.$store.commit('CONTENT_SERVICE_SETTING_LIST_RESET', { type: "" });
										});
									}
								}
							}, '删除')
						]);
					}
				}
			],
		};
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('CONTENT_SERVICE_SETTING_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('CONTENT_SERVICE_SETTING_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
	}
};

