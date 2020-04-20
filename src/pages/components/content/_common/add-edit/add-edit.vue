<template>
	<div class="v-content-add-edit">
		<div class="_add">
			<i-form 
				ref="form" 
				:model="formData" 
				:rules="rule" 
				:label-width="120"
				@submit.native.prevent
			>
				<i-form-item label="资讯标题：" prop="title">
					<i-input 
						v-model="formData.title" 
						:maxlength="30" 
						placeholder="请输入标题（30字以内）"
						style="width:300px"
					/>
				</i-form-item>

				<i-form-item label="关键词：" prop="keyword">
					<i-input 
						v-model="formData.keyword"
						:maxlength="30"  
						placeholder="请输入关键字（多个时用空格隔开）,30字以内" 
						style="width:300px"
					/>
				</i-form-item>

				<i-form-item label="资讯描述：" prop="describe">
					<oa-limit-words
						v-model="formData.describe" 
						:max="200" 
						placeholder="请输入资讯描述..." 
						style="width:300px;min-height:85px"
					/>
				</i-form-item>

				<i-form-item label="选择分类：" prop="category_id">
					<i-select
						v-model="formData.category_id" 
						style="width:300px"
						placeholder="请选择分类"
						clearable
					>
						<i-option 
							v-for="item in materialClassAll" 
							:value="item.category_id" 
							:key="item.category_id"
						>
							{{ item.category_name }}
						</i-option>
					</i-select>
				</i-form-item>

				<div class="g-flex">
					<i-form-item
						:key="formData.is_all_position"
						:rules="!formData.is_all_position ? rule.position_list : { required: false }"
						label="查看职位："
						prop="position_list"
					>
						<oa-tree-select-check 
							ref="treeSelectCheck"
							v-model="formData.position_list" 
							:data="departPosition" 
							:disabled="formData.is_all_position ? true : false" 
							placeholder="请选择职位"
							width="300"
							max-width="300"
							style="position:relative;left:-2px" 
						/>
					</i-form-item>

					<i-checkbox 
						v-model="formData.is_all_position" 
						class="g-m-l-20 g-m-t-5"
						style="height: 20px;"
					>
						所有职位可见
					</i-checkbox>
				</div>
		
				<i-form-item label="入职年限：" prop="material_year">
					<i-select
						v-model="formData.material_year" 
						style="width:300px;max-height:100px;"
						placeholder="请选择入职年限"
						clearable
					>
						<i-option 
							v-for="item in material_years" 
							:value="item.value"
							:key="item.value"
						>
							{{ item.label }}
						</i-option>
					</i-select>
				</i-form-item>

				<i-form-item label="正文：" prop="content">
					<vc-editor
						ref="editor"
						v-model="formData.content"
						:options="options"
						:disabled="disabled"
						style="min-width:400px;"
					/>	
				</i-form-item>

				<i-form-item label="添加附件：" prop="addAttachments">
					<vc-files-picker 
						ref="filesPicker"
						v-model="files"
						:upload="{multiple: true,max: 10, size: 200}"
						:max="10"
						@error="handleError"
					>
						<template slot-scope="slotProps">
							<div 
								v-for="(item, index) in slotProps.files" 
								:key="index"
								style="width:30%;"
							>
								<div style="width:90%;">
									<i class="iconfont icon-accessory"/>
									<span :style="{color: item.errorFlag ? 'red':''}">
										{{ item.title }}
									</span>
									<span 
										class="g-fr g-c-blue-light" 
										@click="handleDeleteFile(item, index)"
									>
										删除
									</span>
								</div>
								<i-progress v-if="!item.errorFlag" :percent="parseInt(item.percent)"/>
							</div>
						</template>

						<div v-if="files.length < 10" slot="trigger" class="g-tc g-c-black _upload">
							浏览...
						</div>
					</vc-files-picker>
					<div class="g-absolute g-c-black5 _prompt">(上限10个)</div>
				</i-form-item>
				<i-form-item v-if="files.length > 0" label="附件下载：">
					<i-radio-group v-model="formData.is_download">
						<i-radio :label="1">
							开
						</i-radio>
						<i-radio :label="0">
							关
						</i-radio>
					</i-radio-group>
				</i-form-item>
			</i-form>

			<footer class="g-flex-ac">
				<div class="g-gray-btn-small g-m-r-10" @click="handlePreview">预览</div>
				<vc-debounce-click class="g-red-btn-small" @click="handleSend">保存</vc-debounce-click>
			</footer>
		</div>
	</div>
</template>

<script>
import { Form, FormItem, Input, Button, Select, Option, Progress, Message, Checkbox, RadioGroup, Radio } from "iview";
import { Editor, FilesPicker } from "wya-vc";
import API_ROOT from "@stores/apis/root";
import { services } from "@stores/services/content";
import Upload from '@components/_common/upload/upload';
// import { Editor } from "@components/_common/editor";
import moment from "moment";
import { setItem, getItem } from '@utils/utils';
// import { services as service } from "@stores/services/hr";
import TreeSelectCheck from "@components/_common/tree-select-check/tree-select-check";

export default {
	name: "content-add-edit",
    
	components: {
		"i-form": Form,
		"i-form-item": FormItem,
		"i-input": Input,
		"i-button": Button,
		"i-select": Select,
		"i-option": Option,
		"i-progress": Progress,
		"i-checkbox": Checkbox,
		"i-radio": Radio,
		"i-radio-group": RadioGroup,
		"oa-tree-select-check": TreeSelectCheck,
		"vc-editor": Editor,
		"vc-files-picker": FilesPicker
	},
    
	mixins: [services.departPosition()],

	data() {
		return {
			files: [], // 上传的文件
			time: "",
			formData: {
				title: '', // 标题
				keyword: '', // 关键词
				describe: '', // 描述
				content: '', // 内容
				category_id: '', // 分类id
				attachment_list: [], // 附件
				position_list: [],
				material_year: null,
				is_all_position: false, // //所有职位可见：0-否；1-是
				is_download: 0 // 0-关，1-开
			},
			rule: {
				title: [
					{ required: true, message: '素材标题不可为空！', trigger: 'blur' }
				],
				keyword: [
					{ required: true, message: '关键词不可为空！', trigger: 'blur' }
				],
				category_id: [
					{ required: true, type: 'number', message: '分类不可为空！', trigger: 'change' }
				],
				material_year: [
					{ required: true, type: 'number', message: '入职年限不可为空！', trigger: 'change' }
				],
				position_list: [
					{ required: true, type: 'array', message: '请选择职位！', trigger: 'change' }
				],
				content: [
					{ required: true, message: '正文不可为空！', trigger: 'change' }
				]
			},
			options: {
				modules: {
					toolbar: '#toolbar'
				},
			},
			disabled: false,
			materialClassAll: [],
			material_years: [{
				value: 0,
				label: "所有人可见"
			}, {
				value: 1,
				label: "一年以上"
			}]

		};
	},

	watch: {
		'formData.is_all_position': {
			handler(value) {
				if (value) {
					this.$nextTick(() => {
						this.$refs.treeSelectCheck.initValue();
					});
					this.formData.position_list = [];
					
				}
			}
		}
	},

	created() {
		this.loadGetClassAll();
	},

	mounted() {
		let form = getItem(`form_${this.$global.version}`);

		if (form) {
			this.formData = { ...form };
			this.files = [];

			this.formData.attachment_list.forEach(item => {
				this.files.push({
					original: item.name,
					percent: "100.00",
					title: item.name,
					url: item.url,
					size: item.file_size
				});
			});

			this.$nextTick(() => {
				this.$refs.treeSelectCheck.initValue();
			});
		} else if (this.$route.query.information_id) {
			this.$request({
				url: "_CONTENT_INFORMATION_MANAGE_CHECK_GET",
				type: 'GET',
				param: {
					information_id: this.$route.query.information_id
				},
			}).then(res => {
				this.handleData(res.data);
			}).catch((error) => {
				this.$Message.error(error.msg);
			});
		} else {
			this.formData.material_year = 0;
		}
	},
    
	methods: {
		// 预览
		handlePreview() {
			this.$refs.form.validateAndScroll((valid) => {
				if (valid) {
					this.formData.attachment_list = [];
					
					this.files.forEach(item => {
						this.formData.attachment_list.push({
							name: item.title,
							url: item.url,
							file_size: item.size
						});
					});

					this.time = new Date() && moment(new Date()).format("YYYY-MM-DD HH:mm:ss");

					setItem(`time_${this.$global.version}`, this.time);
					setItem(`form_${this.$global.version}`, this.formData);

					this.$router.push(
						{ 
							path: '/content/preview',
							query: { 
								information_id: this.$route.query.information_id,
								keyword: this.formData.keyword,
								flag: true,
								status: this.$route.query.status
							} 
						}
					);
				}
			});
		},

		// 保存
		handleSend() {
			let arr_position_list = [];

			if (this.formData.is_all_position) {
				this.formData.position_list = [];
			} else {
				let arr = [];

				this.formData.position_list.forEach(item => {
					typeof item === "string" ? arr.push(+item.split("-")[1]) : arr.push(item);
				});

				this.departPosition.forEach(item => {
					if (arr.indexOf(item.value) > -1) {
						item.children && item.children.length && item.children.forEach(element => {
							arr_position_list.push({
								position_id: +element.value.split("-")[1],
								position_name: element.title
							});
						});
					} else {
						item.children && item.children.length && item.children.forEach(element => {
							if (arr.indexOf(+element.value.split("-")[1]) > -1) {
								arr_position_list.push({
									position_id: +element.value.split("-")[1],
									position_name: element.title
								});
							}
						});
					}
				});
			}

			this.$refs.form.validateAndScroll((valid) => {
				if (valid) {
					this.formData.attachment_list = [];

					this.files.forEach(item => {
						this.formData.attachment_list.push({
							attachment_name: item.title,
							attachment_url: item.url,
							file_size: item.size
						});
					});

					this.$request({
						url: "_CONTENT_INFORMATION_MANAGE_CREATE_AND_EDIT_POST",
						type: 'POST',
						param: { 
							...this.formData,
							information_id: this.$route.query.information_id || "",
							is_download: this.formData.is_download,
							is_all_position: this.formData.is_all_position ? 1 : 0,
							position_list: !this.formData.is_all_position ? arr_position_list : null,
							attachment_list: this.formData.attachment_list
						},
					}).then(res => {
						this.$Message.success(res.msg);
					}).then(() => {
						this.$router.push({ path: "/content/information/manage" });
					}).catch(error => {
						this.$Message.error(error.msg);
					});
				}
			});
		},

		handleError(err) {
			this.$Message.warning(err.msg);
		},

		handleData(data) {
			this.formData = JSON.parse(JSON.stringify(data));
			this.formData.is_all_position ? this.formData.is_all_position = +this.formData.is_all_position === 1 : null;
			this.files = [];
			this.formData.position_list = [];

			let arr = [];

			this.departPosition.forEach(item => {
				arr.push(item.value);
			});
			data.position_list.forEach(item => {
				if (arr.indexOf(item.position_id) > -1) {
					this.formData.position_list.push(item.position_id);
				} else {
					this.formData.position_list.push("position_id-" + item.position_id);
				}
			});

			+this.formData.is_all_position === 0 ? this.formData.is_all_position = false : null;

			this.$nextTick(() => {
				this.$refs.treeSelectCheck && this.$refs.treeSelectCheck.initValue();
			});

			data.attachment_list.forEach(item => {
				this.files.push({
					original: item.attachment_name,
					percent: 100.00,
					title: item.attachment_name,
					url: item.attachment_url,
					size: item.file_size
				});
			});
		},

		handleDeleteFile(item, index) {
			this.$refs.filesPicker && this.$refs.filesPicker.handleDel(item, index);
		},

		loadGetClassAll() {
			this.$request({
				url: "_CONTENT_INFORMATION_MANAGE_SIMPLE_GET",
				type: 'GET',
				param: {},
			}).then(res => {
				let result = [];

				const deep = arr => {
					arr.map(v => {
						result.push(v);

						if (v.children) {
							deep(v.children);
						}

						return v;
					});
				};

				deep(res.data.list);

				this.materialClassAll = result;
				let form = getItem(`formValidate_${this.$global.version}`);
			}).catch((error) => {
			});
		}
	}
};
</script>

<style lang="scss">
.v-content-add-edit{
	._add{
		padding: 20px 0 60px 100px;

		textarea.ivu-input{
			min-height: 84px;
			resize: none;
		}
	}

	._prompt{
		top: 18px;
		left: -74px;
	}

	.vcp-files-picker {
		box-sizing: border-box;
		display: flex;
		flex-direction: column-reverse;
		cursor: pointer;
		margin: 0;
	}

	._upload {
		height: 32px;
		line-height: 32px;
		width: 80px;
		background: #fafafa;
		border: 1px solid #d4d7d8 !important;
		border-radius: 4px;

		&:hover{
			color: #d9444f;
			border: 1px solid #d9444f !important;
		}
	}

	footer {
		position: absolute;
		bottom: 0;
		left: 0;
		background-color: #ffffff;
		width: 100%;
		height: 60px;
		padding-left: 240px;
		z-index: 100;
		box-shadow: 0px -2px 9.9px 0.1px rgba(0, 0, 0, 0.08);
	}

	.ivu-select-multiple .ivu-select-selection {
		max-height: 100px;
		overflow-y: auto;
	}

	.vc-tree-select{
		margin-top: 0px;
	}
}
</style>