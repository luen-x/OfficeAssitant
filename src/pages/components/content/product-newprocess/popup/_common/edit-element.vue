<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:mask-closable="false"
		:loading="true"
		class="v-edit-element"
		width="400"
		title="编辑内容"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div>
			<i-form ref="from" :model="formItem" :label-width="85" :rules="ruleValidate">
				<i-form-item label="元件类型:">
					<div>{{ formItem.component_type_name }}</div>
				</i-form-item>
				<i-form-item label="元件名称:">
					<div>{{ formItem.component_label }}</div>
				</i-form-item>
				<i-form-item v-if="formItem.component_type!=6&&formItem.component_type!=7" label="元件提示:" prop="placeholder">
					<i-input
						v-model="formItem.placeholder"
						style="width:220px"
						placeholder="请输入元件提示"
					/>
				</i-form-item>
				<i-form-item v-if="formItem.component_type==2||formItem.component_type==3" label="输入限制:" prop="input_limit">
					<i-input-number
						v-model="formItem.input_limit"
						:min="1"
						:max="1000"
						disabled
						style="width:220px"
						placeholder="请输入限制"
					/>
				</i-form-item>
				<i-form-item
					v-if="formItem.component_type==6"
					label="上传限制："
					prop="upload_limit"
				>
					<i-input-number
						v-model="formItem.upload_limit"
						:min="1"
						:max="10"
						:precision="0"
						style="width:220px"
						placeholder="请输入上传限制"
					/>
				</i-form-item>

				<i-form-item
					v-if="formItem.component_type==2||formItem.component_type==3"
				>
					<template slot="label">
						<span class="_require">字符限制:</span>
					</template>
					<i-checkbox-group v-model="reglist" class="g-col">
						<i-checkbox :label="0" disabled>中文</i-checkbox>
						<i-checkbox :label="1" disabled>英文</i-checkbox>
						<i-checkbox :label="2" disabled>数字</i-checkbox>
						<i-checkbox :label="3" disabled>特殊字符</i-checkbox>
					</i-checkbox-group>
				</i-form-item>
				<i-form-item v-if="formItem.component_type==7" label="选择类型：" prop="name">
					<i-radio-group v-model="formItem.check_type">
						<i-radio :label="1" disabled>单选</i-radio>
						<i-radio :label="2" disabled>多选</i-radio>
					</i-radio-group>
				</i-form-item>
				<i-form-item v-if="formItem.component_type==7" label="有无其他：" prop="name">
					<i-radio-group v-model="formItem.has_other">
						<i-radio :label="1" disabled>有</i-radio>
						<i-radio :label="0" disabled>无</i-radio>
					</i-radio-group>
				</i-form-item>
				<i-form-item
					v-if="formItem.component_type==1||formItem.component_type==7"
					label="添加条件："
				>
					<i v-if="0" class="iconfont icon-add1 g-c-blue-light" @click="handleAddOption"/>
					<div
						v-if="formItem.component_type==1||formItem.component_type==7"
						class="g-flex g-fw-w"
					>
						<div v-for="(item,i) in formItem.data" :key="i">
							<i-tooltip :content="item.label" placement="top-start">
								<div class="_option g-m-b-5 g-jc-sb g-flex-ac">
									<span class="g-col __label">{{ item.label }}</span>
									<i v-if="0" class="iconfont icon-close2" @click="handleDelOption(i)"/>
								</div>
							</i-tooltip>
						</div>
					</div>
				</i-form-item>
				<i-form-item v-if="formItem.component_type==4||formItem.component_type==5" label="时间类型" prop="name">
					<i-radio-group v-model="formItem.time_type">
						<i-radio :label="1" disabled>固定时间</i-radio>
						<i-radio :label="2" disabled>起始时间</i-radio>
					</i-radio-group>
				</i-form-item>
				<i-form-item
					v-if="formItem.component_type==2||formItem.component_type==3"
					label="错误提示："
					prop="error_tip"
				>
					<i-input
						v-model="formItem.error_tip"
						style="width:220px"
						placeholder="请输入错误提示"
					/>
				</i-form-item>
				<i-form-item label="是否必填：" prop="name">
					<i-radio-group v-model="formItem.required">
						<i-radio :label="1">是</i-radio>
						<i-radio :label="0">否</i-radio>
					</i-radio-group>
				</i-form-item>
				<i-form-item v-show="formItem.component_type==6" label="上传示例：" prop="name">
					<vc-imgs-picker
						:max="5"
						v-model="formItem.upload_example"
						style="width:300px"
						@error="handleError"
					/>
				</i-form-item>
			</i-form>
		</div>
	</i-modal>
</template>
<script type="text/ecmascript-6">
import { Modal, Form, FormItem, Tooltip, Input, Button, InputNumber, Checkbox, CheckboxGroup, RadioGroup, Select, Option, Radio } from 'iview';
import { CreatePortal, ImgsPicker } from 'wya-vc';
import { mapState } from 'vuex';
import { AddOption } from '../../../_common/popup/add-option';

export default {
	name: "edit-element",
	components: {
		"i-modal": Modal,
		"i-form": Form,
		"i-form-item": FormItem,
		"i-input": Input,
		"i-input-number": InputNumber,
		"i-checkbox": Checkbox,
		"i-checkbox-group": CheckboxGroup,
		"i-radio-group": RadioGroup,
		"i-select": Select,
		"i-option": Option,
		"i-radio": Radio,
		"i-tooltip": Tooltip,
		'vc-imgs-picker': ImgsPicker,
	},
	props: {
		data: Object,
	},
	data() {
		return {
			visible: false,
			formItem: {},
			reglist: [],
			i: '',
			num: '',
			rexger: [
				{ label: '请输入中文', value: 0 },
				{ label: '请输入英文', value: 1 },
				{ label: '请输入数字', value: 2 },
				{ label: '请输入特殊字符', value: 3 }
			],
			ruleValidate: {
				placeholder: [
					{ required: true, message: '请输入元件提示', trigger: 'blur' }
				],
				input_limit: [
					{ required: true, type: 'number', message: '请输入限制', trigger: 'blur' }
				],
				reglist: [
					{ required: true, message: '请输入字符限制', trigger: 'blur' }
				],
				option: [
					{ required: true, message: '请输入字符限制', trigger: 'blur' }
				],
				error_tip: [
					{ required: true, message: '请输入错误提示', trigger: 'blur' }
				],
				upload_limit: [
					{ required: true, type: 'number', message: '请输入限制', trigger: 'blur' }
				],
			}
		};
	},
	computed: {
		// ...mapState({ process: state => state.contentProductNewprocess.process }),
	},
	beforeCreate() {
		this.Button = Button;
	},
	mounted() {
		this.visible = true;
		this.i = this.data.i;
		this.num = this.data.num;
		this.formItem = { ...this.data.component };
		this.formItem.input_limit = Number(this.formItem.input_limit);
		if (this.formItem.data != null && this.formItem.data.length > 0) {
			this.formItem.data.forEach(ele => {
				 this.reglist.push(ele.value);
			});
		}
	},
	methods: {
		handleSave() {
			this.visible = false;
		},
		handleError(err) {
			this.$Message.error(err.msg);
		},
		handleNull() {
			this.visible = false;
		},
		handleOk() {
			/**
			 * v-model会默认被触发，要由该组件控制，给组件i-modal传值 loading: true
			 */
			// this.visible = false;
			if (this.formItem.component_type == 3 || this.formItem.component_type == 2) {
				if (this.reglist.length == 0) {
					this.$Message.error("请选择字符限制");
					this.$refs.modal.buttonLoading = false;
					return;
				}
			}
			if (this.formItem.component_type == 7 || this.formItem.component_type == 1) {
				if (this.formItem.data.length == 0) {
					this.$Message.error("请选择添加条件");
					this.$refs.modal.buttonLoading = false;
					return;
				}
			}
			if (this.formItem.component_type == 2 || this.formItem.component_type == 3) {
				this.formItem.data = [];
				this.reglist.forEach(element => {
					this.formItem.data.push(this.rexger[element]);
					this.$refs.modal.buttonLoading = false;
				});
			}
			this.$refs.from.validate((valid) => {
				if (valid) {
					let res = {
						i: this.i,
						num: this.num,
						data: this.formItem,
					};
					this.$emit('sure', res);
				} else {
					this.$Message.error("编辑内容请填写完整");
					this.$refs.modal.buttonLoading = false;
				}
			});
		},
		handleCancel() {
			// this.visible = false;
			this.$emit('close');
		},
		handleAddOption() {
			AddOption.popup({
				store: this.$store
			}).then((res) => {
				this.formItem.data.push({ label: res, value: Number(this.formItem.data.length + 1) });
			}).catch((res) => {

			});
		},
		handleDelOption(i) {
			this.formItem.data.splice(i, 1);
		}
	}
};
export const EditElement = CreatePortal({}, module.exports.default);
</script>

<style  lang="scss">
    .v-edit-element {
        .g-flex {
            margin-top: 10px;
        }
        .g-col {
            label {
                margin: 0;
            }
        }
		.__label {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
			max-width: 60px;
        }
		 ._require::before {
            content: "*";
            display: inline-block;
            margin-right: 4px;
            line-height: 1;
            font-family: SimSun;
            font-size: 12px;
            color: #ed4014;
        }
		 ._require-false::before {
            content: "" !important;
        }
        ._option {
            background: #ec505b;
            color: #fff;
            min-width: 80px;
            height: 18px;
            border-radius: 4px;
            padding-left: 15px;
            margin-right: 10px;
        }
		 .ivu-input-number {
            width: 220px !important;

            .ivu-input-number-handler-wrap {
                display: none !important;
            }
        }
    }
</style>
