<template>
	<i-modal
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		class="v-add-step"
		title="编辑流程"
		width="650"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div class="g-flex g-flex-cc g-flex-ac  g-jc-sb g-m-t-10 g-m-b-10">

			<div style="width:230px" class="g-m-r-10">
				<span
					v-if="editvisible"
					class="_step-name g-m-r-10"
				>{{ process_step.step_name }}</span>

				<i-input
					v-else
					v-model="step_name"
					:maxlength="12"
					style="width:120px,margin-left:5px"
					type="text"
					name
					@on-blur="handleEditStep()"
					@on-enter="handleEditStep()"
				/>

				<i
					v-if="editvisible"
					style="font-size:15px"
					class="iconfont icon-edit1 g-operation"
					@click="handleEditName"
				/>
			</div>
			<div class="g-m-l-10 g-m-r-10">
				<i-select
					v-model="process_step.position_id"
					transfer
					clearable
					placeholder="请适用职位"
					style="width: 230px;"
					class="g-m-r-5"
					filterable
					label-in-value
					multiple
				>
					<i-option
						v-for="item in allPosition"
						:key="item.position_id"
						:value="item.position_id+''">
						{{ item.position_name }}
					</i-option>
				</i-select>
			</div>
			<div class="g-fr g-m-r-20 g-operation" @click="handleAddElement">添加元件</div>
		</div>
		<div class="_process-step">
			<div v-for="(item,i) in process_step.product_component" :key="i" >
				<div class="_step-item g-flex-ac g-jc-sb">
					<div :class="{_requrie:item.required==1}">{{ i-0+1 }}.{{ item.component_label }}</div>
					<div class="g-fr">
						<i class="iconfont c-point g-m-r-10 icon-delete1" @click="handleDelete(i)"/>
						<i class="iconfont c-point g-m-r-10 icon-edit1" @click="handleEdit(i)"/>
						<i class="iconfont c-point icon-back-top" @click="handleUpRecord(i)"/>
					</div>
				</div>
			</div>
		</div>
		<div slot="footer" class="__button ">
			<vc-debounce-click class="g-gray-btn-small g-m-r-10" @click="handleCancel()">取消</vc-debounce-click>
			<vc-debounce-click class="g-red-btn-small g-m-r-20" @click="handleOk">保存</vc-debounce-click>
		</div>
	</i-modal>
</template>

<script type="text/ecmascript-6">
import { Modal, Form, FormItem, Input, Button, InputNumber, Select, Option } from 'iview';
import { CreatePortal } from 'wya-vc';
import { mapState } from 'vuex';
import { services } from '@stores/services/hr';
import { EditStepName } from './edit-step-name';
import { AddElement } from './add-element';
import { EditElement } from './_common/edit-element';


export default {
	name: "add-step",
	components: {
		"i-modal": Modal,
		"i-form": Form,
		"i-form-item": FormItem,
		"i-input": Input,
		"i-input-number": InputNumber,
		"i-select": Select,
		"i-option": Option,
	},
	mixins: [
		services.allPosition()
	],
	props: {
		data: Object,
	},
	data() {
		return {
			visible: false,
			editvisible: true,
			formItem: {},
			list: ['1', '2', '3', '4'],
			selectList: [],
			component_field: [],
			step_name: String,
			process_step: {}, // 暂存数据
		};
	},
	computed: {
		...mapState({ process: state => state.contentProductNewprocess.process }),
		num() {
			return (this.data ? this.data.num : this.process.product_process_step.length - 1);
		},
	},
	beforeCreate() {
		this.Button = Button;
	},
	created() {
		const data = { ...this.process.product_process_step[this.num] };
		data.product_component = [...data.product_component];
		this.process_step = data;
		this.process_step.is_push = data.is_push || 0;

	},
	mounted() {
		this.visible = true;
	},
	methods: {
		// 数组元素删除
		handleDelete(i) {
			this.process_step.product_component.splice(i, 1);
		},
		// 步骤编辑
		handleEdit(i) {
			EditElement.popup({
				store: this.$store,
				data: {
					component: this.process_step.product_component[i],
					'num': this.num,
					i
				}
			}).then((res) => {
				this.process_step.product_component.splice(i, 1, res.data);
			}).catch((res) => {

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
			this.process_step.product_component_num = this.process_step.product_component.length;
			this.$store.commit('SAVE_PRODUCT_PROCESS_STEP', { num: this.num, data: this.process_step });
			this.visible = false;
			this.$emit('sure', {});
		},
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		},
		handleAddElement() {
			this.selectList = [];
			this.component_field = [];
			let i = this.process_step.product_component;
			if (i.length > 0) {
				i.forEach(ele => {
					this.component_field.push(ele.component_field);
				});
			}
			AddElement.popup({
				data: {
					selectList: this.selectList,
					component_field: this.component_field,
				}
			}).then((res) => {
				this.component_field = [];
				this.selectList = [];
				res.forEach(ele => {
					this.selectList.push(ele.component_id);
				});
				let com0 = {
					component_label: "", // 元件名称
					component_field: "", // 元件字段
					component_type: "", // 元件类型
					sort: "1", // 排序
					placeholder: "", // 元件提示
					input_limit: 20, // 输入限制 最大值
					check_type: 1, //  选择类型 1单选  2多选
					has_other: 0, // 有无其他 0无 1 有
					upload_limit: 10, // 上传限制
					time_type: 1, // 时间类型 1固定时间 2 起始时间
					data: [], // 元件限制内容
					required: 1, // 是否必填  1-必填，0-选填
					component_type_name: "" // 元件类型名称
				};
				 /* ***********  */
				let list = [];
				res.forEach((item, index) => {
					const com = { ...com0 };
					com.component_label = item.label;
					com.component_field = item.field;
					com.component_type = item.type;
					com.component_type_name = item.type_name;
					com.data = item.default.data;
					com.error_tip = item.default.error_tip;
					com.input_limit = item.default.input_limit;
					com.placeholder = item.default.placeholder;
					com.required = item.default.required;
					com.has_other = item.default.has_other;
					com.time_type = item.default.time_type;
					com.upload_limit = item.default.upload_limit;
					com.check_type = item.default.check_type;
					com.upload_example = item.default.upload_example;
					com.sort = index;
					list.push(com);
				});
				list.forEach((item, index) => {
					const x = this.process_step.product_component.find(it => {
						return item.component_field == it.component_field;
					});
					if (x) {
						list[index] = x;
					}
				});
				this.process_step.product_component = list;
			});
		},
		// 更改名称
		handleEditName() {
			this.step_name = this.process_step.step_name;
			this.editvisible = false;
		},
		handleEditStep() {
			this.editvisible = !this.editvisible;
			this.process_step.step_name = this.step_name;
		},
		handleUpRecord(i) {
			if (i > 0) {
				this.process_step.product_component[i] = this.process_step.product_component
				 .splice(i - 1, 1, this.process_step.product_component[i])[0];
			}
		},
	}
};
export const AddStep = CreatePortal({}, module.exports.default);
</script>

<style  lang="scss">
    .v-add-step {
        position: relative;
        .ivu-modal-body {
            padding: 0;
        }
        ._step-name {
            padding: 16px;
            color: #333;
            font-size: 14px;
            font-weight: 700;
        }
		._process-step{
			padding-bottom:60px;
			max-height: 360px;
			overflow-y:auto;
		}
		 ._process-step::-webkit-scrollbar {
            width: 10px;
        }

        ._process-step::-webkit-scrollbar-track {
            border-radius: 5px;
            background-color: #eee;
        }

        ._process-step::-webkit-scrollbar-thumb {
            border-radius: 5px;
            background: #e84c57;
        }
        .__button {
            height: 60px;
            width: 650px;
            line-height: 40px;
            position: absolute;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            z-index: 2;
            right: 0;
            bottom: 0px;
            background: #fff;
            box-shadow: 0px -2px 9.9px 0.1px rgba(0, 0, 0, 0.08);
        }
		._requrie::after{
			content: ' *';
			display: inline-block;
			line-height: 1;
			font-family: SimSun;
			font-size: 12px;
			color: #ed4014;
		}
        ._step-item {
            height: 40px;
            padding: 0 16px;
            border-bottom: 1px solid #ebeef1;
        }
        ._step-item:hover {
            background: #f0f4fc;
        }
        .c-point {
            cursor: pointer;
        }
    }
</style>
