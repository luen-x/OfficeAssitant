<template>
	<i-modal
		ref="modal"
		:loading="true"
		:mask-closable="false"
		v-model="visible"
		title="文件信息"
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
					<div v-if="formData.material_list.length > 0" >
						<oa-file-icon :file-url="formData.material_list[0].file_url"/>
						<oa-auto-tooltip
							:content="`${formData.material_list[0].material_name}等${formData.material_list.length}个文件`"
							width="250px"
							style="width: auto"
							class="g-fs-14"
							theme="dark"
							placement="bottom"
							label-class="g-pointer"
						/>
					</div>
				</i-form-item>
				<i-form-item :label-width="84" label="上传类目：" prop="category_id" >
					<oa-input-tree
						v-if="$route.query.category_id"
						:width="220"
						:title="category_name"
						v-model="formData.category_id"
						:data-source="categoryList"
						@change="handleSelectCategory"
						@on-change="handleclear"
					/>
				</i-form-item>
				<i-form-item v-if="kit_type==2" label="服务项关联：">
					<i-select
						v-model="formData.relation_service_id"
						clearable
						transfer
						style="width:220px"
						class="_select-width">
						<i-option
							v-for="item in serviceList"
							:key="item.id"
							:value="item.id"
						>{{ item.name }}</i-option>
					</i-select>
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
					<!-- <i-select
						v-model="formData.position_ids"
						multiple
						transfer
						clearable
						style="width:220px"
						class="_select-width">
						<i-option
							v-for="item in positionList"
							:key="item.position_id"
							:value="item.position_id"
						>{{ item.position_name }}</i-option>
					</i-select> -->
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
			categoryList: [], // 类目列表
			serviceList: [], // 服务关联列表
			roleList: [], // 权限列表
			positionList: [],
			kit_type: query.kit_type || 1,
			fileType: '',
			category_name: query.category_name,
			materialDetail: {},
			formData: {
				material_id: this.material_id, // 编辑时必传
				category_id: Number(query.category_id) || null, // 类目id
				material_list: this.material_list,
				relation_service_id: '', // 关联服务项，服务工具包下上传素材
				position_ids: [], // 查看职位
				work_age_min: null, // 最小工龄
				work_age_max: null, // 最大工龄
				type: this.type || ''
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
		this.loadCategoryList();
		this.loadServiceList();
		this.loadSalePosition();
		this.material_id ? this.loadMatertal(this.material_id) : this.loadCategoryDetail();
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
		loadCategoryDetail() {
			const { query } = this.$route;
			if (!query.category_id) return;
			this.$request({
				url: '_ACADEMY_SUPPORT_TOOL_CATEGORY_DETAIL_GET',
				type: 'GET',
				param: {
					category_id: query.category_id
				}
			}).then((res) => {
				this.formData.position_ids = res.data.position_ids.map(i => 'position_id-' + i);
				this.formData.work_age_min = res.data.work_age_min;
				this.formData.work_age_max = res.data.work_age_max;
			});
		},
		loadServiceList() {
			this.$request({
				url: '_CONTENT_SERVICE_LIST_GET',
				type: 'GET'
			}).then((res) => {
				this.serviceList = res.data;
			});
		},
		loadCategoryList() {
			this.$request({
				url: '_ACADEMY_SUPPORT_TOOL_CATEGORY_ALL_GET',
				type: 'GET',
				param: { },
			}).then((res) => {
				let listString = '';
				listString = (JSON.stringify(res.data)).replace(/category_name/g, 'title');
				this.categoryList = JSON.parse(listString);
			});
		},
		loadMatertal(material_id) {
			this.$request({
				url: '_ACADEMY_SUPPORT_TOOL_MATERIAL_DETAIL_GET',
				type: 'GET',
				param: {
					material_id
				},
			}).then((res) => {
				res.data.position_ids = res.data.position_ids.map(i => 'position_id-' + i);
				Object.keys(this.formData).forEach(key => {
					this.formData[key] = res.data[key];
				});
				this.category_name = res.data.category_name;
				this.materialDetail = res.data;
				this.formData.material_list = [{
					material_name: res.data.material_name, // 素材名称
					file_url: res.data.file_url, // 地址
					file_size: res.data.file_size // 文件大小，字节B
				}
				];
				this.fileType = res.data.materialname;
				// this.loadCategoryDetail();
			});
		},
		handleSelectCategory(v) {
			this.kit_type = v.kit_type;
			this.formData.position_ids = v.position_ids.map(i => 'position_id-' + i);
			this.formData.work_age_max = v.work_age_max;
			this.formData.work_age_min = v.work_age_min;
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
						url: this.material_id ? '_ACADEMY_SUPPORT_TOOL_MATERIAL_EDIT_GET' : '_ACADEMY_SUPPORT_TOOL_MATERIAL_SAVE_GET',
						type: 'POST',
						param: {
							...this.formData,
							position_ids,
						}
					}).then((res) => {
						this.$Message.success(res.msg);
						this.$store.commit('ACADEMY_SUPPORT_TOOL_MANAGE_LIST_INIT');
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
export const AddMaterial = CreatePortal({}, module.exports.default);
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
