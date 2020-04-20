<template>
	<i-modal
		ref="modal"
		:loading="true"
		:mask-closable="false"
		v-model="visible"
		title="文件信息"
		width="400"
		class-name="v-content-satoolkit-manage-modal-small"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div style="margin-left: 16px;">
			<i-form
				ref="form"
				:rules="ruleValidate"
				:model="formData"
				:label-width="84"
				class="_input-wrapper">
				<i-form-item :label-width="0">
					<div >
						<oa-file-icon :file-url="fileUrl"/>
						<oa-auto-tooltip
							:content="materialDescribe"
							width="250px"
							style="width: auto"
							class="g-fs-14"
							theme="dark"
							placement="bottom"
							label-class="g-pointer"
						/>
					</div>
				</i-form-item>
				<i-form-item label="上传类目：" prop="category_id" >
					<oa-input-tree
						:width="220"
						:title="category_name"
						v-model="formData.category_id"
						:data-source="categoryList"
						@change="handleSelectCategory"
						@on-change="handleclear"
					/>
				</i-form-item>
				<i-form-item label="职位限制：">
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
				<i-form-item label="工龄限制：">
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
		'oa-input-tree': inputTree,
		'oa-tree-select-check': treeSelectCheck,
		'oa-auto-tooltip': AutoTooltip,
		'oa-file-icon': fileIcon,
	},
	mixins: [
		services.departPosition()
	],
	props: {
		data: Object,
		material_id: [Number, String],
		type: [Number, String], // 1文件,2文件夹
		material_list: {
			type: Array,
			default() {
				return [];
			}
		}
	},
	data() {
		const { query } = this.$route;
		return {
			visible: false,
			categoryList: [], // 类目列表
			serviceList: [], // 服务关联列表
			roleList: [], // 权限列表
			positionList: [], // 权限列表
			category_name: query.category_name,
			materialDetail: {},
			formData: {
				"type": this.type, // 1-文件，2-文件夹
				"material_id": this.material_id, // 编辑时必传
				"category_id": Number(query.category_id) || null, // 类目id
				"material_list": this.material_list,
				"relation_service_id": '', // 关联服务项，服务工具包下上传素材
				"position_ids": [], // 查看职位
				"work_age_min": null, // 最小工龄
				"work_age_max": null// 最大工龄
			},
			ruleValidate: {
				category_id: [{ required: true, type: 'number', message: '请选择类目名称', trigger: 'change' }],
			}
		};

	},
	computed: {
		fileUrl() {
			return this.formData.material_list.length ? this.formData.material_list[0].file_url : this.materialDetail.file_url || '.mp3';
		},
		materialDescribe() {
			return this.formData.material_list.length
				? `${this.formData.material_list[0].material_name}等${this.formData.material_list.length}个文件`
				: `${this.materialDetail.material_name}等${this.materialDetail.file_count}个文件` || '';
		}
	},
	beforeCreate() {
		/**
		 * 这样不会被注册监听
		 */
		this.Button = Button;
	},
	mounted() {
		this.loadSalePosition();
		this.loadCategoryList();
		this.material_id ? this.loadMatertal(this.material_id) : this.loadCategoryDetail();
		this.visible = true;
	},
	methods: {
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
			return this.$request({
				url: '_ACADEMY_SUPPORT_LIBRARY_CATEGORY_DETAIL_GET',
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
		loadCategoryList() {
			this.$request({
				url: '_ACADEMY_SUPPORT_LIBRARY_CATEGORY_ALL_GET',
				type: 'GET',
				param: { },
			}).then((res) => {
				let listString = '';
				listString = (JSON.stringify(res.data)).replace(/category_name/g, 'title');
				this.categoryList = JSON.parse(listString);
			});
		},
		loadMatertal(material_id) {
			return this.$request({
				url: '_ACADEMY_SUPPORT_LIBRARY_MATERIAL_DETAIL_GET',
				type: 'GET',
				param: {
					material_id
				},
			}).then((res) => {
				res.data.position_ids = res.data.position_ids.map(i => 'position_id-' + i);
				Object.keys(this.formData).forEach(key => {
					this.formData[key] = res.data[key];
				});
				this.formData.material_list = [];
				this.category_name = res.data.category_name;
				this.materialDetail = res.data;
				// this.loadCategoryDetail();
			});
		},
		// handleSelectCategory(categoryId) {
		// 	this.formData.category_id = categoryId;
		// },
		handleSelectCategory(v) {
			this.formData.position_ids = v.position_ids.map(i => 'position_id-' + i);
			this.formData.work_age_max = v.work_age_max;
			this.formData.work_age_min = v.work_age_min;
			this.formData.category_id = v.category_id;
		},
		handleclear(v) {
			if (!v.target.value) this.formData.category_id = null;
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
					this.$request({ url: this.formData.material_list.length
						? '_ACADEMY_SUPPORT_LIBRARY_MATERIAL_SAVE_GET' : '_ACADEMY_SUPPORT_LIBRARY_MATERIAL_EDIT_GET',
					type: 'POST',
					param: {
						...this.formData,
						position_ids
					}
					}).then((res) => {
						this.$Message.success(res.msg);
						this.$store.commit('ACADEMY_SUPPORT_STUDY_MANAGE_LIST_INIT');
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
		handleExpand() {
			for (let i in this.classListData2) {
				this.handleData(this.classListData2[i]);
			}
		},
	}
};
export const AddMaterial = CreatePortal({}, module.exports.default);
</script>

<style lang="scss" soped>
    .v-content-satoolkit-manage-modal-small {
        .btn-red {
            background: #e74854;
            color: #fff !important;
        }
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
            ._select-class {
                display: inline-block;
                box-sizing: border-box;
                vertical-align: middle;
                color: #515a6e;
                font-size: 12px;
                line-height: 32px;
                outline: 0;
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
                cursor: pointer;
                position: relative;
                padding: 0 10px 0 4px;
                background-color: #fff;
                border-radius: 4px;
                border: 1px solid #dcdee2;
                transition: all 0.2s ease-in-out;
                ._tag {
                    height: 24px;
                    line-height: 22px;
                    margin: 0 4px 3px 0;
                    display: inline-block;
                    padding: 0 8px;
                    border: 1px solid #e8eaec;
                    border-radius: 3px;
                    background: #f7f7f7;
                    font-size: 12px;
                    vertical-align: middle;
                    opacity: 1;
                    overflow: hidden;
                    cursor: pointer;
                }
            }
        }
        ._poptip-content {
            width: 330px;
            height: 200px;
            overflow-y: hidden;
            &:hover {
                overflow-y: auto;
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
        .ivu-icon-ios-arrow-forward {
            font-family: "iconfont" !important;
            font-size: 15px !important;
        }
        .ivu-icon-ios-arrow-forward:before {
            content: "\eb97" !important;
        }
        .ivu-tree-arrow {
            position: relative;
            margin-right: 5px;
            z-index: 0;
            padding-left: 14px;
            color: #e74854;
            i {
                font-size: 25px;
            }
        }

        .ivu-tree-title {
            vertical-align: middle;
        }
        .ivu-tree-empty {
            text-align: center;
        }
    }
</style>
