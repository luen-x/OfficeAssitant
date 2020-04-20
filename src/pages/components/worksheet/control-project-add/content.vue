<template>
	<div class="v-worksheet-control-project-add">
		<div class="g-m-t-20 g-flex g-jc-c" style="width: 100%;">
			<i-form 
				ref="form" 
				:model="formData" 
				:rules="rules" 
				:label-width="120"
				style="margin-bottom: 44px auto;"
				@submit.native.prevent
			>
				<i-form-item 
					label="项目名称：" 
					prop="system_name" 
				>
					<i-input 
						v-model="formData.system_name"
						:maxlength="30"
						placeholder="请输入项目名称"
						clearable
						style="width: 430px;"
					/>
				</i-form-item>
				<i-form-item 
					label="产品描述：" 
					prop="describe" 
				>
					<oa-limit-words 
						v-model="formData.describe"
						placeholder="请输入产品描述"
						clearable
						style="width: 430px;"
					/>
				</i-form-item>
				<i-form-item 
					label="添加模块：" 
					prop="module" 
					class="g-pd-t-20"
				>
					<oa-projects :data-source="formData.module" :system-id="formData.system_id"/>
				</i-form-item>
			</i-form>
			<div class="_submit">
				<i-button class="g-m-r-10" @click="handleCancel">取消</i-button>
				<i-button :loading="loading" type="primary" @click="handleSave">保存</i-button>
			</div>
		</div>
	</div>
</template>

<script>
import { Input, Button, Form, FormItem } from 'iview';
import LimitWords from '@components/_common/limit-words/limit-words';
import { Confirm } from '@components/_common/confirm/confirm';
import { uid } from '@utils/utils';
import { projectModuleAdd } from './popup/module-add';
import Projects from "./_common/projects";

export default {
	name: 'oa-control-project-add',
	components: {
		'i-input': Input,
		'i-button': Button,
		'i-form': Form,
		'i-form-item': FormItem,
		'oa-limit-words': LimitWords,
		'oa-projects': Projects
	},
	data() {
		return {
			loading: false,
			formData: {// 表单
				system_name: '',
				describe: '',
				system_id: this.$route.query.system_id ? +this.$route.query.system_id : '',
				module: []
			},
			query: { ...this.$route.query },
			rules: {// 表单验证
				system_name: [
					{ required: true, message: "项目名称不能为空", trigger: "blur" }
				],
				module: [
					{ required: true, type: 'array', message: "请添加模块", trigger: "blur" }
				]
			}
		};
	},
	mounted() {
		this.query.action == 'update' && this.loadData();
		this.$vc.on('WORKSHEET_CONTROL_PROJECT_UPDATE_MODULE', () => {
			this.loadData(true);
		});
		this.$vc.on('WORKSHEET_CONTROL_PROJECT_ADD_MODULE', () => {
			this.$refs.form.validate();
		});
	},
	beforeDestroy() {
		this.$vc.off('WORKSHEET_CONTROL_PROJECT_ADD_MODULE');
		this.$vc.off('WORKSHEET_CONTROL_PROJECT_UPDATE_MODULE');
	},
	methods: {
		loadData(onlyUpdateModule = false) {
			this.$request({
				url: '_WORKSHEET_CONTROL_PROJECT_DETAIL_GET',
				type: 'GET',
				loading: false,
				param: {
					system_id: this.query.system_id
				},
				autoTip: false
			}).then(res => {
				if (!onlyUpdateModule) {
					this.formData.system_name = res.data.project.system_name;
					this.formData.describe = res.data.project.describe;
				}
				
				this.formData.module = this.formatModule(res.data.project.module);
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		handleCancel() {
			Confirm.popup({
				title: "提示",
				msg: "取消后你所填写的内容将无法恢复，确认取消？",
				showIcon: false
			}).then(() => {
				this.$router.back();
			}).catch(err => {
				err && console.error(err);
			});
		},
		handleSave() {
			const { query = {} } = this.$route;
			this.loading = true;
			this.$refs.form.validate(valid => {
				if (valid) {
					const param = { ...this.formData };
					if (this.query.action == 'update') {
						delete param.module;
					}
					this.$request({
						url: '_WORKSHEET_CONTROL_PROJECT_ADD_POST',
						type: 'POST',
						loading: false,
						param,
						autoTip: true
					}).then(res => {
						this.loading = false;
						this.$router.back();
					}).catch(err => {
						this.loading = false;
					});
				} else {
					this.loading = false;
				}
			});
		},
		formatModule(modules) {
			modules && modules.forEach(item => {
				item.uid = uid();
				if (!item.child) {
					item.child = [];
				}
				this.formatModule(item.child);
			});
			return modules;
		}
	},
};
</script>

<style lang="scss">
.v-worksheet-control-project-add {
	._submit {
		position: fixed;
		width: 100%;
		height: 45px;
		line-height: 45px;
		text-align: center;
		bottom: 0;
		right: 0;
		box-shadow: 0px -2px 9.9px 0.1px rgba(0, 0, 0, 0.08);
		background: #fff;
	}
	.ivu-form .ivu-form-item-label {
		padding-right: 0;
	}
}
</style>
