<template>
	<i-modal
		v-model="visible"
		:mask-closable="false"
		title="添加产品规格"
		class-name="v-content-product-new-add-stuffs"
		width="400"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div class="g-flex">
			<div v-if="stuffList.length" class="g-col">
				<!-- <i-checkbox-group v-model="component" vertical @on-change="handleRadio"> -->
				<div v-for="(item,index) in stuffList" :key="index+'l'" class="g-m-t-10">
					<!-- <i-checkbox-group v-model="component" vertical @on-change="handleRadio(item.component_field)"> -->
					<i-checkbox
						v-model="component[item.component_field]"
						:label="item.component_field"
						:disabled="checkDisabled(item.component_field)"
						@on-change="handleCheckBox(item.component_field,item)"
					>{{ item.component_label }}</i-checkbox>
					<div>
						<i-checkbox-group
							v-if="component[item.component_field]"
							v-model="stuffs[item.component_field]"
							class="g-m-l-20"
						>
							<i-checkbox
								v-for="(item,index) in stuffList[index].default"
								:key="index"
								:label="item.value"
								class="g-m-t-10"
							>{{ item.label }}</i-checkbox>
						</i-checkbox-group>
					</div>
					<!-- </i-checkbox-group> -->
				</div>
				<div v-if="specs.length" class="g-m-t-20 ">
					<div class="g-m-b-20" style="width:100%;height:1px;background:rgba(238,238,238,1);"/>
					<span>已选：</span>
					<span v-for="(item,i) in specs" :key="i" class="g-c-blue-light ">
						{{ item.component_label }}
					</span>
				</div>
			</div>
		</div>
		<div slot="footer">
			<!-- <i-button  class="g-m-r-10" type="text" @click="handleCancel()">取消</i-button> -->
			<i-button type="primary" @click="handleOk()">{{ specs.length?"下一步":"确定" }}</i-button>
		</div>
	</i-modal>
</template>

<script>
import { Modal, Form, FormItem, Input, Button, InputNumber, RadioGroup, Radio, CheckboxGroup, Checkbox } from 'iview';
import { CreatePortal } from 'wya-vc';
import API from "@stores/apis/root";

export default {
	name: "v-add-stuff",
	components: {
		"i-modal": Modal,
		"i-form": Form,
		"i-form-item": FormItem,
		"i-input": Input,
		"i-input-number": InputNumber,
		"i-radio-group": RadioGroup,
		"i-radio": Radio,
		"i-checkbox-group": CheckboxGroup,
		"i-checkbox": Checkbox,
		"i-button": Button
	},
	props: {
		data: Object
	},
	data() {
		return {
			visible: false,
			component: {},
			stuffs: {},
			stuffList: [],
			specs: [],
		};
	},
	computed: {
	},
	created() {
		this.loadData();
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		loadData(api) {
			this.$request({
				url: API.CONTENT_PRODUCT_SKU_COMPONENT_TYPE_GET,
				type: "get",
			}).then(res => {
				this.stuffList = res.data;
				res.data.map(ele => {
					this.$set(this.stuffs, ele.component_field, []);
					this.$set(this.component, ele.component_field, false);
					return;
				});
				if (this.data.specs.length) {
					this.data.specs.map(element => {
						const v = this.stuffList.find(ele => {
							return ele.component_field == element.component_field;
						});
						this.specs.push(v);
						this.component[element.component_field] = true;
						element.values.forEach(it => {
							this.stuffs[element.component_field].push(it.value);
						});
						return;
					});
				}
			});
		},
		handleOk() {
			/**
             * v-model会默认被触发，要由该组件控制，给组件i-modal传值 loading: true
             */
			let error = false;
			this.specs.forEach(ele => {
				ele.values = [];
				this.stuffs[ele.component_field].sort((a, b) => { return a - b; }); // 排序
				this.stuffs[ele.component_field].forEach(element => {
					const v = ele.default.find(item => {
						return item.value == element;
					});
					if (v) ele.values.push(v);
				});
				if (!ele.values.length) {
					error = true;
				}
			});
			if (error) {
				this.$Message.error('请至少选择一种规格');
				return;
			}
			this.visible = false;
			this.$emit('sure', this.specs);
		},
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		},
		handleCheckBox(v, item) {
			this.stuffs[v] = [];
			const i = this.specs.findIndex(ele => {
				return v == ele.component_field;
			});
			if (i == -1) { this.specs.push(item); } else { this.specs.splice(i, 1); }
		},
		checkDisabled(v) {
			let i = 0;
			Object.keys(this.component).forEach(key => {
				if (this.component[key]) {
					i++;
				}
			});
			return i > 1 && !this.component[v];
		},
	}
};
export const AddStuffs = CreatePortal({}, module.exports.default);
</script>
<style lang="scss">
    .v-content-product-new-add-stuffs {
        .ivu-checkbox-group-item {
            margin-bottom: 10px;
        }
		.ivu-modal-footer{
			padding-top: 0 !important;
		}
    }
</style>

