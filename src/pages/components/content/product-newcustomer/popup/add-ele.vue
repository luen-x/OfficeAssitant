
<template>
	<i-modal
		v-model="visible"
		:mask-closable="false"
		class-name="v-content-product-newcustomer-add-element"
		width="680"
		title="添加元件"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div class="g-flex">
			<i-select
				v-model="type"
				style="width:220px"
				clearable
				placeholder="请选择元件类型"
				@on-change="handleSearch"
			>
				<i-option
					v-for="(item,i) in componentsType"
					:key="i"
					:value="item.type"
				>{{ item.type_name }}</i-option>
			</i-select>
			<i-input
				v-model="keyword"
				style="width:220px"
				class="g-m-l-10"
				placeholder="请输入元件名称"
				@on-enter="handleSearch"
			/>
			<vc-debounce-click
				:tag="Button"
				type="primary"
				class="g-m-l-10"
				@click="handleSearch"
			>搜索</vc-debounce-click>
		</div>
		<div class="g-m-t-20">
			<i-checkbox-group v-model="selectList" class="g-flex g-fw-w">
				<div
					v-for="item in list"
					:key="item.component_id"
					:class="getItemClass(item.component_id)"
					class="_element"
					@click="handleChecked(item.component_id)"
				>
					<div class="g-flex g-jc-sb">
						<div class="g-fs-12 g-c-black3">{{ item.label }}</div>
						<div class>
							<i-checkbox :label="item.component_id"/>
						</div>
					</div>
					<div class="__describe g-fs-12">{{ item.type_name }}</div>
				</div>
			</i-checkbox-group>
		</div>
		<div v-if="list.length==0" style="height:276px;" class="g-flex-cc g-flex-ac">
			<div>暂无合适的搜索结果，换个关键词试试吧~</div>
		</div>
		<div>
			<i-page
				:total="total"
				:current="page"
				:page-size="12"
				class="g-fr"
				show-elevator
				@on-change="handleChangePage"
			/>
		</div>
	</i-modal>
</template>

<script type="text/ecmascript-6">
import { Modal, Form, FormItem, Input, Button, InputNumber, Checkbox, Select, Option, Page, CheckboxGroup } from 'iview';
import { CreatePortal } from 'wya-vc';
import API from '@stores/apis/root';

export default {
	name: "add-ele",
	components: {
		"i-modal": Modal,
		"i-form": Form,
		"i-form-item": FormItem,
		"i-input": Input,
		"i-input-number": InputNumber,
		"i-checkbox": Checkbox,
		"i-select": Select,
		"i-option": Option,
		"i-page": Page,
		"i-checkbox-group": CheckboxGroup
	},
	props: {
		data: Object
	},
	data() {
		return {
			visible: false,
			formItem: {},
			componentsType: [],
			keyword: '',
			selectList: [], // checkbox选择的元素
			list: [], // 请求到的数据
			type: '', // 类型
			elementList: [], // 存放选择的元件详情
			total: null, // 总页数
			label: '',
			page: null, // 当前页
			Element: {
				step_id: "1",
				sort: "2",
				component_label: "客户电话",
				component_type: "2",
				required: 1,
				data: "",
				component_type_name: "输入框"
			},
			dataList: []

		};
	},
	watch: {
		selectList(val) {
			this.elementList = [];
			this.selectList.forEach(item => {
				this.list.forEach(element => {
					if (item == element.component_id) {
						this.elementList.push(element);
					}
				});
			});
		}
	},
	beforeCreate() {
		this.Button = Button;
	},

	created() {
		let i = this.data.selectList;
		if (i.length > 0) {
			this.selectList = i;
		}
		this.$request({
			url: API._CONTENT_PRODUCT_COMPONENT_TYPE_GET,
			type: "GET",
			loading: false,
			param: {
			}
		}).then((res) => {
			this.componentsType = res.data;
		}).catch((err) => {
			console.error(err);
		});
	},
	mounted() {
		this.visible = true;
		this.fetch();
		this.getData();
	},
	methods: {
		handleChecked(i) {
			const v = this.selectList.findIndex(it => it == i);
			if (v == -1) {
				this.selectList.push(i);
			} else {
				this.selectList.splice(v, 1);
			}
		},
		handleChangePage(val) {
			this.pageSize = val;
			this.fetch();
		},
		fetch() {
			this.$request({
				url: API._CONTENT_PRODUCT_CUSTOMER_ELEMENT_GET,
				type: "GET",
				loading: false,
				param: {
					label: this.keyword,
					type: this.type,
					page: this.pageSize,
					pageSize: 12
				}
			}).then((res) => {
				this.list = res.data.list;
				this.total = res.data.totalCount;
				this.page = res.data.currentPage;
			}).catch((err) => {
				console.error(err);
			});
		},
		getItemClass(id) {
			if (this.selectList.find(item => {
				return item == id;
			})) {
				return '_active';
			} else {
				return '';
			}
		},
		getData() {
			this.$request({
				url: API._CONTENT_PRODUCT_CUSTOMER_ELEMENT_GET,
				type: "GET",
				loading: false,
				param: {
					label: this.label,
					type: this.type,
					get_num: 1,
				}
			}).then((res) => {
				this.dataList = res.data;
				if (this.data.component_field.length > 0) {
					this.dataList.forEach(ele => {
						this.data.component_field.forEach(item => {
							if (ele.field == item) {
								this.selectList.push(ele.component_id);
							}
						});
					});
				}
			}).catch((err) => {
				console.error(err);
			});
		},
		handleSave() {
			this.visible = false;
		},
		handleNull() {
			this.visible = false;
		},
		handleOk() {
			/**
             * v-model会默认被触发，要由该组件控制，给组件i-modal传值 loading: true
             */
			// this.visible = false;

			this.elementList = [];
			this.selectList.forEach(item => {
				this.dataList.forEach(element => {
					if (item == element.component_id) {
						this.elementList.push(element);
					}
				});
			});
			// this.$store.commit('clear_CUS_COMPONENT');
			this.$store.commit('ADD_CUS_COMPONENT', this.elementList);
			this.$emit('sure', this.selectList);
		},
		handleCancel() {
			// this.visible = false;
			this.$emit('close');
		},
		handleSearch() {
			this.pageSize = 1;
			this.fetch();
		}
	}
};
export const AddElement = CreatePortal({}, module.exports.default);
</script>

<style  lang="scss">
    .v-content-product-newcustomer-add-element {
        ._element {
            width: 150px;
            height: 80px;
            border: 1px solid #ebeef1;
            border-radius: 4px;
            padding: 10px;
            margin-right: 12px;
            margin-bottom: 12px;
            cursor: pointer;
            .ivu-checkbox-wrapper {
                margin: 0;
            }
            .__describe {
                color: #d4d7d8;
            }
        }
        ._active {
            border: 1px solid #e74854;
            box-shadow: 0px 1px 8px 0px rgba(0, 0, 0, 0.1);
        }
        .ivu-checkbox-wrapper {
            span:last-child {
                display: none !important;
            }
        }
		.ivu-modal-footer{
			padding-top: 23px !important;
		}
    }
</style>
