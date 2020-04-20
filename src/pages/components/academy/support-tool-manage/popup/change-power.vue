<template>
	<i-modal
		ref="modal"
		:loading="true"
		:mask-closable="false"
		v-model="visible"
		title="权限调整"
		width="400"
		class-name="v-academy-support-tool-manage-modal"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div style="margin-left: 16px;">
			<i-form
				ref="form"
				:rules="ruleValidate"
				:model="formData"
				class="_input-wrapper">
				<i-form-item>
					<div v-if="material_list.length > 0" >
						<oa-file-icon :file-url="material_list[0].file_url"/>
						<oa-auto-tooltip
							:content="`${material_list[0].material_name}等${material_list.length}个文件`"
							width="250px"
							style="width: auto"
							class="g-fs-14"
							theme="dark"
							placement="bottom"
							label-class="g-pointer"
						/>
					</div>
				</i-form-item>
				<i-form-item label="职位限制：" class="_m-left">
					<oa-tree-select-check
						ref="treeSelectCheck"
						v-model="formData.position_ids"
						:data="departPosition"
						:width="220"
						:max-width="220"
						placeholder="请选择职位范围"
					/>
				</i-form-item>
				<i-form-item label="工龄限制：" class="_m-left">
					<i-input-number
						:min="1"
						:max="999"
						v-model="formData.work_age_min"
						:precision="0"
						placeholder="请输入数值"
						style="width:90px;"/>
					~
					<i-input-number
						:min="1"
						:max="999"
						v-model="formData.work_age_max"
						:precision="0"
						placeholder="请输入数值"
						style="width: 90px;"/>
					个月
				</i-form-item>
			</i-form>
		</div>
	</i-modal>
</template>
<script>
import { Modal, Button, Tree, Form, FormItem, Input, InputNumber, Icon, Select, Option, Poptip } from 'iview';
import treeSelectCheck from '@components/_common/tree-select-check/tree-select-check';
import { CreatePortal } from 'wya-vc';
import API_ROOT from "@stores/apis/root";
import { services } from "@stores/services/content";
import { getParseUrl } from '@utils/utils';
import AutoTooltip from '@common/auto-tooltip/auto-tooltip';
import fileIcon from '@common/file-icon/file-icon';
import inputTree from '../../_common/study-manage/input-tree';

export default {
	name: 'oa-add-material',
	components: {
		'i-modal': Modal,
		'i-button': Button,
		'i-tree': Tree,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-input': Input,
		'i-input-number': InputNumber,
		'i-icon': Icon,
		'i-select': Select,
		'i-option': Option,
		'i-poptip': Poptip,
		'oa-file-icon': fileIcon,
		'oa-input-tree': inputTree,
		'oa-tree-select-check': treeSelectCheck,
		'oa-auto-tooltip': AutoTooltip
	},
	mixins: [
		services.departPosition()
	],
	props: {
		data: Object,
		material_id: [Number, String],
		material_ids: Array,
		api: String,
		material_list: {
			type: Array,
			default() {
				return [];
			}
		},
		type: [Number, String],
	},
	data() {
		const { query } = this.$route || {};
		return {
			visible: false,
			roleList: [], // 权限列表
			positionList: [],
			kit_type: query.kit_type || 1,
			fileType: '',
			category_name: query.category_name,
			materialDetail: {},
			formData: {
				material_ids: this.material_ids,
				position_ids: [], // 查看职位
				work_age_min: null, // 最小工龄
				work_age_max: null, // 最大工龄
			},
			ruleValidate: {
				category_id: [{ required: true, type: 'number', message: '请选择类目名称', trigger: 'blur' }],
			}
		};
	},
	beforeCreate() {
		/**
		 * 这样不会被注册监听
		 */
		this.Button = Button;
	},
	mounted() {
		this.loadSalePosition();
		this.visible = true;
	},
	methods: {
		handleclear(v) {
			if (!v.target.value) this.formData.category_id = null;
		},
		loadSalePosition() {
			this.$request({
				url: '_HR_SALE_POSITION_GET',
				type: 'GET',
				noLoading: true
			}).then(res => {
				this.positionList = res.data;
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		handleOk() {
			/**
			 * v-model会默认被触发，要由该组件控制，给组件i-modal传值 loading: true
			 */
			// this.visible = false;
			let checkedTags = (this.$refs.treeSelectCheck && this.$refs.treeSelectCheck.checkedTags) || [];
			const position_ids = checkedTags.map(ele => ele.parent_id && ele.value).filter(Boolean).map(i => +i.replace('position_id-', ''));
			this.$refs.form.validate(valid => {
				if (valid) {
					if (this.formData.work_age_max != null && this.formData.work_age_max <= this.formData.work_age_min) {
						this.$Message.error('工龄限制第二位必须大于第一位');
						this.$refs.modal.buttonLoading = false;
						return;
					}
					this.$request({
						url: this.api,
						type: 'POST',
						param: {
							...this.formData,
							position_ids,
						}
					}).then((res) => {
						this.$Message.success(res.msg);
						this.$emit('sure');
					}).catch((error) => {
						this.$refs.modal.buttonLoading = false;
						this.$Message.error(error.msg);
					});
				} else {
					this.$refs.modal.buttonLoading = false;
				}
			});

		},
		handleCancel() {
			// this.visible = false;
			this.$emit('close');
		},
	}
};
export const ChangePower = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
    .v-academy-support-tool-manage-modal {
        ._input-wrapper {
            /deep/ .ivu-input[disabled] {
                background-color: #fff !important;
                color: #515a6e !important;
                cursor: pointer !important;
            }
            ._url-box {
                width: 365px;
            }
            .ivu-btn-primary {
                color: #fff;
            }
            ._m-left {
                margin-left: 11px;
            }
            ._select-width {
                width: 300px;
            }
        }
        ul {
            font-size: 14px !important;
        }
        .__menu-hover:hover {
            background: #eff5fc;
        }
        .__menu-active {
            background: #818895;
            color: #fff;
        }

    }
</style>
