<template>
	<i-modal
		v-model="visible"
		:mask-closable="false"
		:title="title"
		class-name="v-content-config-upload-files"
		width="400"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<i-form ref="form" :model="formData" :rules="ruleValidate" :label-width="123">
			<i-form-item label="类目选择：" prop="category_id">
				<oa-input-tree
					:title="category_name"
					v-model="formData.category_id"
					:data-source="categoryList"
					@input="handleGetRole"
				/>
			</i-form-item>
			<i-form-item label="排序重值：" style="margin:0 !important;" prop>
				<i-input-number
					v-model="formData.sort_value"
					style="width: 220px"
					placeholder="请输入数值"
				/>
				<i-form-item
					:label-width="75"
					prop
					label="是否显示："
					style="display: flex;
						align-items: flex-end;
						margin:10px 0 10px 0 !important;"
				>
					<i-radio-group v-model="formData.is_show">
						<i-radio :label="1" class="_radio">是</i-radio>
						<i-radio :label="0" class="_radio">否</i-radio>
					</i-radio-group>
				</i-form-item>
			</i-form-item>
			<i-form-item label="查看部门：" prop="depart_list">
				<i-cascader
					v-model="formData.depart_list"
					:data="departAll"
					style="width: 220px; display: inline-block"
					clearable
					transfer
					change-on-select
					trigger="click"
					placeholder="请选择组织架构"
				/>
			</i-form-item>
			<i-form-item key="" label="查看权限：" prop="role_list">
				<i-select
					ref="roleListSelect"
					v-model="formData.role_list"
					transfer
					style="width: 220px"
					placeholder="请选择查看权限"
					multiple
				>
					<i-option
						v-for="item in roleList"
						:key="item.role_id"
						:value="item.role_id "
					>{{ item.role_name }}</i-option>
				</i-select>
			</i-form-item>
			<i-form-item label="消息通知：" prop="role_notice">
				<i-select
					ref="roleNoticeSelect"
					v-model="formData.role_notice"
					transfer
					style="width: 220px"
					placeholder="请选择消息通知"
					multiple
				>
					<i-option
						v-for="item in roleList"
						:key="item.role_id"
						:value="item.role_id "
					>{{ item.role_name }}</i-option>
				</i-select>
			</i-form-item>
			<i-form-item label="素材提供人：" prop="provider_ids">
				<i-select
					ref="provider"
					v-model="formData.provider_ids"
					:remote-method="remote1"
					:loading="loading1"
					placeholder="请输入素材提供人"
					filterable
					clearable
					transfer
					remote
					multiple
					class="g-m-r-5"
					style="width: 220px"
					@on-change="handleProvider"
					@on-query-change="handleQueryChange"
				>
					<i-option
						v-for="(option, index) in providerData"
						:value="option.staff_id"
						:key="index"
					>{{ option.staff_name }}</i-option>
				</i-select>
			</i-form-item>
			<i-form-item label="素材类型：" prop="material_type">
				<i-select
					v-model="formData.material_type"
					transfer
					style="width: 220px"
					placeholder="请选择素材类型"
				>
					<i-option
						v-for="item in materialType"
						:key="item.value"
						:value="item.value"
					>{{ item.name }}</i-option>
				</i-select>
			</i-form-item>
			<i-form-item label="关联课程：" prop="course_id">
				<i-select
					ref="course"
					v-model="formData.course_id"
					:remote-method="remote3"
					:loading="loading3"
					placeholder="请选择关联课程"
					filterable
					clearable
					transfer
					remote
					label-in-value
					class="g-m-r-5"
					style="width: 220px"
				>
					<i-option
						v-for="(option, index) in courseList"
						:value="option.course_id"
						:key="index"
					>{{ option.course_name }}</i-option>
				</i-select>
			</i-form-item>
			<i-form-item label="素材用途：" prop="material_use">
				<i-select
					v-model="formData.material_use"
					transfer
					style="width: 220px"
					placeholder="请选择素材用途"
					@on-change="handleChangeTape"
				>
					<i-option
						v-for="item in materialUse"
						:key="item.value"
						:value="item.value"
					>{{ item.name }}</i-option>
				</i-select>
			</i-form-item>
			<i-form-item :style="{marginBottom:formData.has_sharer==1?'0 !important':''}" prop="has_sharer" label="有无主要分享者：">
				<i-radio-group v-model="formData.has_sharer" @on-change="handleHasSharer">
					<i-radio :label="1" class="_radio">有</i-radio>
					<i-radio :label="0" class="_radio">无</i-radio>
				</i-radio-group>
				<i-form-item v-if="formData.has_sharer==1" :label-width="0" prop="sharer_ids">
					<i-select
						ref="sharer"
						v-model="formData.sharer_ids"
						:remote-method="remote"
						:loading="loading"
						placeholder="请选择分享人"
						filterable
						multiple
						clearable
						transfer
						remote
						class="g-m-r-5 g-m-t-10"
						style="width: 220px"
						@on-change="handleSharer"
					>
						<i-option
							v-for="(option, index) in staffData"
							:value="option.staff_id"
							:key="index"
						>{{ option.staff_name }}({{ option.position_name }})</i-option>
					</i-select>
				</i-form-item>
			</i-form-item>
			<i-form-item label="素材简介：" prop="describe">
				<oa-limit-words
					v-model="formData.describe"
					:placeholder="'请输入素材简介'"
					:max="500"
					style="width: 220px"
				/>
			</i-form-item>
		</i-form>
		<div slot="footer">
			<i-button class="g-m-r-10" type="text" @click="handleCancel()">取消</i-button>
			<i-button type="primary" @click="handleOk()">开始上传</i-button>
		</div>
	</i-modal>
</template>

<script>
import { Modal, Form, FormItem, Input, Select, Option, Button, Cascader, InputNumber, RadioGroup, Radio, CheckboxGroup, Checkbox } from 'iview';
import { services, staffByMutiTerm } from "@stores/services/hr";
import { CreatePortal } from 'wya-vc';
import API from "@stores/apis/root";
import { initTreeData } from '@utils/utils';
import { InformTape } from "./inform-tape.vue";
import { ServiceMaterial } from "./service-material";
import { TalksTape } from "./talks-tape";
import { TrainedTape } from "./trained-tape";
import InputTree from '../../_common/study-manage/input-tree';
import util from '../../_common/util';

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
		'i-cascader': Cascader,
		'i-select': Select,
		'i-option': Option,
		"i-button": Button,
		'oa-input-tree': InputTree
	},
	mixins: [
		services.departAll(), staffByMutiTerm, util
	],
	props: {
		data: {
			type: Object,
			default() {
				return {};
			},
		}

	},
	data() {
		return {
			visible: false,
			component: '',
			title: '上传文件',
			category_name: '',
			categoryList: [], // 选择类目
			loading: false,
			loading1: false,
			loading3: false,
			providerData: [],
			courseList: [],
			staffData: [],
			options1: [],
			depart_id: [],
			roleList: [],
			formData: {
				material_id: '',
				type: '',
				material_name: "",
				category_id: "",
				describe: "",
				sort_value: null,
				provider_ids: [],
				has_sharer: null,
				sharer_ids: [],
				is_show: null,
				course_id: null,
				material_type: '',
				material_use: null,
				depart_list: [],
				role_list: [],
				role_notice: [],
				material_list: [], // 素材列表
				tape: {} // 录音表单
			},
			ruleValidate: {
				category_id: { required: true, type: 'number', message: '请选择类目', trigger: 'change' },
				depart_list: { required: true, type: 'array', message: '请选择查看部门', trigger: 'change' },
				role_list: { required: true, type: 'array', message: '请选择查看权限', trigger: 'change' },
				role_notice: { required: true, type: 'array', message: '请选择消息通知', trigger: 'change' },
				provider_ids: { required: true, type: 'array', message: '请选择素材提供人', trigger: 'change' },
				material_type: { required: true, type: 'number', message: '请选择素材类型', trigger: 'change' },
				material_use: { required: true, type: 'number', message: '请选择素材用途', trigger: 'change' },
				// course_id: { required: true, message: '请选择关联课程', trigger: 'change' },
				has_sharer: { required: true, type: 'number', message: '请选择有无分享者', trigger: 'change' },
				sharer_ids: { required: true, type: 'array', message: '请选择主要分享者', trigger: 'change' },
				describe: { required: true, message: '请输入素材简介', trigger: 'change' },
			},
		};
	},
	computed: {
		check() {
			return this.data.check || '';
		},
		type() {
			return this.data.type || '';
			// type:1编辑
		}
	},
	created() {
		this.loadAllRole();
		this.handleCategoryAll();
	},
	mounted() {
		this.visible = true;
		if (!this.check) {
			const com = {
				material_id: '',
				type: "1", // 文件类型：1-文件，2-文件夹
				material_name: "", // 素材名称
				file_url: "", // 文件地址
				file_size: "", // 文件大小
				path: ''
			};
			this.data.file.forEach(ele => {
				let com1 = { ...com };
				if (this.data.fileType == 2) {
					com1.type = 2;
				}
				com1.material_name = ele.name;
				com1.file_size = ele.size;
				com1.path = ele.webkitRelativePath;
				this.formData.material_list.push(com1);
			});
			this.formData.type = this.data.fileType;
			this.title = this.formData.type == 2 ? '上传文件夹' : '上传文件';
			if (this.data.category_id) {
				this.handleGetRole(this.data.category_id);
				this.formData.category_id = Number(this.data.category_id);
				this.category_name = this.data.category_name;
			}
		} else {
			this.title = this.type == 1 ? '编辑' : '审核通过';
			this.loadData(this.data.params.material_id);
			this.formData.material_id = this.data.params.material_id;
		}
	},
	methods: {
		handleSharer(e) {
			this.$nextTick(() => {
				if (this.formData.sharer_ids.length > 5) {
					const v = [...this.$refs.sharer.values];
					this.$refs.sharer.$children[0].removeTag(v[v.length - 1]);
				}
			});
			const v = this.formData.provider_ids.find(ele => {
				return ele == e[e.length - 1];
			});
			if (v) {
				this.$nextTick(() => {
					const m = [...this.$refs.sharer.values];
					this.$refs.sharer.$children[0].removeTag(m[m.length - 1]);
				});
				this.$Message.error('主要分享人不能是素材提供人');
			}
		},
		handleProvider(e) {
			this.$nextTick(() => {
				if (this.formData.provider_ids.length > 5) {
					const v = [...this.$refs.provider.values];
					this.$refs.provider.$children[0].removeTag(v[v.length - 1]);
				}
			});
			const v = this.formData.sharer_ids.find(ele => {
				return ele == e[e.length - 1];
			});
			if (v) {
				this.$nextTick(() => {
					const m = [...this.$refs.provider.values];
					this.$refs.provider.$children[0].removeTag(m[m.length - 1]);
				});
				this.$Message.error('主要分享人不能是素材提供人');
			}
		},
		handleHasSharer() {
			this.formData.sharer_ids = [];
		},
		handleGetRole(v, type = 1) {
			this.$request({
				url: API._CONTENT_CONFIG_LIBRARY_CATEGORY_ROLE_LIST_GET,
				type: "get",
				param: {
					category_id: v || '0',
				},
			}).then((res) => {
				this.roleList = [];
				this.roleList = res.data;
				if (type == 1) {
					this.$refs.roleNoticeSelect.reset();
					this.$refs.roleListSelect.reset();
					this.$nextTick(() => {
						res.data.map(ele => {
							this.formData.role_list.push(ele.role_id);
							this.formData.role_notice.push(ele.role_id);
							return;
						});
					});
				}
			});
		},
		handleCategoryAll() {
			this.$request({
				url: API._CONTENT_CONFIG_LIBRARY_CATEGORY_ALL_GET,
				type: 'GET',
				param: {
					kit_type: 2,
				}
			}).then((res) => {
				let firtObj = {
					title: '根类目',
				};
				let listString = '';
				listString = (JSON.stringify(res.data)).replace(/category_name/g, 'title');
				this.categoryList = JSON.parse(listString);
			});
		},
		loadData(material_id) {
			this.$request({
				url: API._CONTENT_CONFIG_MATERIAL_MATERIAL_DETAIL_GET,
				type: "get",
				param: {
					material_id
				},
			}).then((res) => {
				this.courseList = [{ course_name: res.data.course_name, course_id: res.data.course_id }];
				this.providerData = res.data.provider_list;
				this.staffData = res.data.sharer_list;
				this.$nextTick(() => {
					this.formData.course_id = res.data.course_id || null;
					this.formData.sharer_ids = res.data.sharer_ids || [];
					this.formData.provider_ids = res.data.provider_ids || [];
				});
				Object.keys(this.formData).forEach(key => {
					if (key == 'course_id') return;
					this.formData[key] = res.data[key];
				});
				this.category_name = res.data.category_name;
				this.formData.sort_value = Number(this.formData.sort_value);
				this.handleGetRole(this.formData.category_id, 2);
			});
		},
		remote1(query) {
			if (query !== '') {
				this.loading1 = true;
				this.handleLoadStaffData(query, 1);
			}
		},
		remote3(query, type) {
			if (query !== '') {
				this.loading3 = true;
				return this.$request({
					url: API._CONTENT_LIBRARY_MATERIAL_GET_COURSE_POST,
					type: 'GET',
					param: {
						course_name: query //
					},
					loading: false
				}).then((res) => {
					this.loading3 = false;
					// this.staffData = initTreeData(res.data, 'staff_id', 'staff_name');

					if (type == 2) {
						let v = {
							course_id: this.formData.course_id,
							course_name: query,
						};
						this.courseList.push(v);
					} else {
						this.courseList = res.data;
					}
				});
			}
		},
		remote(query) {
			if (query !== '') {
				this.loading = true;
				this.handleLoadStaffData(query, 2);
			}
		},
		handleStaffSearch(staff = {}) {
			this.staff = staff.value || '';
			this.staff_label = staff.label || '';
		},
		loadAllRole(isFirst) {
			this.$request({
				url: API._CONTENT_ALL_ROLE_GET,
				type: 'GET',
			}).then((res) => {
				this.roleList = res.data;
			});
		},
		handleLoadStaffData(query, type) {
			return this.$request({
				url: API._CONTENT_CONFIG_GET_ALL_STAFF_BY_SEARCH_GET,
				type: 'GET',
				param: {
					search: query // 为了能搜索到全部的员工数据（手机号码必定有1）
				},
				loading: false
			}).then((res) => {
				this.loading1 = false;
				this.loading = false;
				// this.staffData = initTreeData(res.data, 'staff_id', 'staff_name');
				if (type == 1) {
					this.providerData = res.data;
				} else if (type == 2) {
					this.staffData = res.data;
				}
			});
		},
		handleQueryChange(query = '') {
			// return;
			// ！！！！！！！！！！！！！！！不要忘记VC的上面更改！！！！！！！！！！！！！！！！！！！！！！！！！！！！

		},
		remoteMethod1(query) {
			if (query !== '') {
				this.loading1 = true;
				setTimeout(() => {
					this.loading1 = false;
				}, 200);
			} else {
				this.options1 = [];
			}
		},
		saveFormdata(api) {
			this.$request({
				url: api,
				type: "POST",
				param: {
					...this.formData,
				},
			}).then((res) => {
				this.$Message.success(res.msg);
				this.visible = false;
				this.$emit('sure', res);
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		handleChangeTape(v) {
			if (v < 4 || v > 7) {
				return;
			}
			const modules = {
				4: TalksTape,
				5: TrainedTape,
				6: InformTape,
				7: ServiceMaterial,
			};
			modules[v].popup({}).then(res => {
				this.formData.tape = { ...res };
			});
		},
		handleOk() {
			// this.visible = false;
			// this.$emit('sure', { material_ids: [156] });
			this.$refs.form.validateAndScroll((valid) => {
				if (valid) {
					if (this.type == 1) {
						// 编辑
						this.saveFormdata(API._CONTENT_CONFIG_MATERIAL_EDIT_POST);
					} else if (this.check) {
						// 审核
						this.saveFormdata(API._CONTENT_CONFIG_MATERIAL_CHECK_PASS_POST);
					} else {
						this.saveFormdata(API._CONTENT_CONFIG_MATERIAL_MATERIAL_SAVE_GET);
					}
				} else {
					this.$Message.error('内容请填写完整');
				}
			});
		},
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		},
	}
};
export const UploadFiles = CreatePortal({}, module.exports.default);
</script>
<style lang="scss">
    .v-content-config-upload-files {
        .ivu-modal-body {
            height: 500px;
            overflow: auto;
        }
    }
</style>
