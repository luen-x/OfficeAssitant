<template>
	<div class="v-sale-property-control-add g-m-t-20">
		<div class="g-flex g-jc-c">
			<i-form 
				ref="form" 
				:model="formData" 
				:rules="ruleValidate" 
				:label-width="120"
				style="min-width: 850px" 
				position="left"
				@submit.native.prevent
			>	
				<div
					class="g-fs-16 g-lh-16 g-pd-l-10 g-m-t-30 g-m-b-30"
					style="border-left: 2px solid #e84854;height: 16px;color:#e84854;"
				>
					基本信息
				</div>
				<div class="g-flex">
					<div>
						<i-form-item label="选择道具：" prop="type_id">
							<i-select 
								v-model="formData.type_id"
								:disabled="!!$route.query.edit"
								clearable 
								transfer
								filterable
								placeholder="请选择道具"
								style="width: 300px;"
								@on-change="handleChangeProp"
							>
								<i-option 
									v-for="(item, index) in propertyList" 
									:key="index"
									:value="item.type_id"
								>{{ item.type_name }}</i-option>
							</i-select>
						</i-form-item>
						<i-form-item label="道具说明：" prop="remark">
							<oa-limit-words
								v-model="formData.remark" 
								:max="500" 
								style="width:300px;"
								class="g-dp-ib"
								placeholder="文本输入，限制500字"
							/>
						</i-form-item>
					</div>
					<div>
						<i-form-item label="功效：" prop="title">
							<i-input 
								v-model="formData.title" 
								:maxlength="100"
								disabled
								placeholder="请选择道具" 
								style="width: 300px;"
							/>
						</i-form-item>
						<!-- <i-form-item ref="img" label="道具主图：" prop="image_url">
							<oa-imgs-picker
								v-model="formData.image_url"
								:max="1"
								@change="handleImgChange"
								@error="handleError"
							/>
						</i-form-item> -->
					</div>
				</div>
				<div>
					<div
						class="g-fs-16 g-lh-16 g-pd-l-10 g-m-t-30 g-m-b-30"
						style="border-left: 2px solid #e84854;height: 16px;color:#e84854;"
					>
						价格
					</div>
					<i-form-item label="价格：" prop="price">
						<i-input-number
							v-model="formData.price" 
							:max="99999999"
							:min="1"
							:precision="0"
							:active-change="false"
							placeholder="限制数字，最多输入8位数" 
							style="width: 300px;"
						/>
					</i-form-item>
				</div>
			</i-form>
		</div>
		<div class="_footer g-flex-cc">
			<span
				class="g-gray-btn-small g-m-r-10"
				style="font-size: 12px;"
				@click="handleCancel"
			>
				取消
			</span>
			<i-button
				type="primary"
				@click="handlePublish"
			>
				保存并上架
			</i-button>
		</div>
	</div>
</template>

<script>
import { Input, Button, Form, FormItem, Select, Option, DatePicker, InputNumber } from 'iview';
import moment from 'moment';
import { Editor } from "wya-vc";
import ImgsPicker from '@common/imgs-picker/imgs-picker';

export default {
	name: 'oa-content',
	components: {
		'i-input': Input,
		'i-button': Button,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-select': Select,
		'i-option': Option,
		'i-date-picker': DatePicker,
		"vc-editor": Editor,
		'oa-imgs-picker': ImgsPicker,
		'i-input-number': InputNumber
	},
	data() {
		const { query = {} } = this.$route;

		return {
			loading: false,
			formData: {
				type_id: null,
				title: '',
				remark: '',
				image_url: [],
				price: null
			},
			ruleValidate: {
				type_id: [
					{ required: true, type: 'number', message: '请选择道具', trigger: 'change' }
				],
				title: [
					{ required: true, message: '请填写副标题', trigger: 'change' }
				],
				remark: [
					{ required: true, message: '请填写道具说明', trigger: 'blur' }
				],
				image_url: [
					{ required: true, type: 'array', message: '请选择主图', trigger: 'change' }
				],
				price: [
					{ required: true, type: 'number', message: '请填写价格', trigger: 'change' }
				],
			},
			propertyList: []
		};
	},
	async mounted() {
		this.loadPropTitle();
		this.$route.query.edit ? this.loadEditData() : this.loadPropertyData();
	},
	methods: {
		async loadEditData() {
			await this.loadPropertyData();
			await this.loadData();
		},
		loadData() {
			return this.$request({
				url: "_SALE_PROPERTY_CENTER_PROPERTY_DETAIL_GET",
				type: 'GET',
				param: {
					prop_id: this.$route.query.prop_id
				},
				loading: false
			}).then((res) => {
				this.formData = {
					...res.data,
				};
				this.formData.image_url = [res.data.image_url];
			});
		},
		loadPropTitle() {
			this.$request({
				url: "_SALE_PROPERTY_CONTROL_TITLE_POST",
				type: 'POST',
				param: {},
				loading: false
			}).then((res) => {
				this.titleList = res.data;
			});
		},
		handleChangeProp(e) {
			e ? this.formData.title = this.titleList.filter(v => v.type_id == e)[0].rules_str : '';
		},
		handleError(err) {
			this.$Message.error(err.msg);
		},
		handleImgChange(val) {
			this.$refs.form.validateField("image_url");
		},
		loadPropertyData() {
			return this.$request({
				url: "_SALE_PROPERTY_LIST_GET",
				type: 'GET',
				param: {},
				loading: false
			}).then((res) => {
				this.propertyList = this.$route.query.edit
					? res.data : res.data.filter(v => !v.is_used);
			});
		},
		handlePublish() {
			this.$refs.form.validate(valid => {
				if (valid) {
					this.handleSave();
				}
			});
		},
		handleSave() {
			let param = {
				...this.formData,
				image_url: this.formData.image_url[0],
				prop_name: this.propertyList.filter(v => v.type_id == this.formData.type_id)[0].type_name
			};
			this.$request({
				url: '_SALE_PROPERTY_CONTROL_PROPERTY_SAVE_POST', // eslint-disable-line
				type: "POST",
				param
			}).then((res) => {
				this.$Message.success('保存成功');
				this.$router.push({
					path: '/sale/property/control'
				});
			}).catch((error) => {
				this.$Message.error(error.msg);
			});
		},
		handleCancel() {
			this.$router.go(-1);
		}
	},
};
</script>

<style lang="scss">
.v-sale-property-control-add {
	._footer {
		position: absolute;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 45px;
		background-color: #fff;
		box-shadow: 0px -2px 9.9px 0.1px rgba(0, 0, 0, 0.08);
	}
}
</style>
