<template>
	<i-modal
		v-model="visible"
		:mask-closable="false"
		title="编辑活动"
		width="680"
		class="v-activity-list-new"
		ok-text="保存"
		cancel-text="取消"
		footer-hide
	>
		<i-form 
			ref="formValidate"
			:model="formValidate" 
			:rules="ruleValidate"
			:label-width="160"
		>
			<oa-content-title title="" class="g-fs-14 g-c-black2">活动信息</oa-content-title>

			<i-form-item label="活动分类：" prop="category_id">
				<i-select 
					v-model="formValidate.category_id" 
					placeholder="请选择活动分类"
					class="_long">
					<i-option v-for="item in activityCategory" :value="item.category_id" :key="item.category_id">
						{{ item.category_name }}
					</i-option>
				</i-select>
			</i-form-item>

			<i-form-item label="活动名称：" prop="activity_name">
				<i-input 
					v-model="formValidate.activity_name" 
					:maxlength="30"
					placeholder="请填写活动名称"
					class="_long"/>
				<span class="_tips">30字以内</span>
			</i-form-item>

			<i-form-item label="报名时间：" prop="startTime">
				<i-data-picker 
					v-model="formValidate.startTime"
					format="yyyy-MM-dd HH:mm"
					type="datetimerange"
					transfer
					placeholder="请选择开始时间"
					class="_long"/>
			</i-form-item>
			
			<i-form-item label="活动时间：" prop="createdTime">
				<i-data-picker 
					v-model="formValidate.createdTime" 
					format="yyyy-MM-dd HH:mm"
					type="datetimerange"
					transfer
					placeholder="请选择开始时间"
					class="_long"/>
			</i-form-item>

			<i-form-item label="上传封面图片：" prop="coverImage">
				<vc-imgs-picker 
					v-model="formValidate.coverImage" 
					:max="1"
					@error="handleError"
				/>
			</i-form-item>

			<i-form-item label="活动地址：" prop="address">
				<i-input 
					v-model="formValidate.address" 
					:maxlength="50"
					placeholder="请输入活动地址"
					class="_long"/>
				<span class="_tips">50字以内</span>
			</i-form-item>

			<i-form-item label="活动说明：" prop="describe" style="position: relative">
				<oa-limit-words
					v-model="formValidate.describe"
					:rows="4"
					:max="500"
					width="300px"
					placeholder="在此输入活动相关说明"/>
			</i-form-item>

			<oa-content-title title="" class="g-fs-14 g-c-black2">报名设置</oa-content-title>
			<div class="g-flex _height">
				<i-form-item class="g-1of2 _height" label="每家限制报名人数：" prop="apply_limit">
					<i-select 
						v-model="formValidate.apply_limit"
						transfer
						style="width:100px" 
						class="_shorter">
						<i-option v-for="num in 5" :value="num" :key="num">{{ num }}</i-option>
					</i-select>
				</i-form-item>
				<i-form-item label="可多报名人数：" prop="extra_apply">
					<i-select
						v-model="formValidate.extra_apply"
						transfer
						style="width:100px"
						class="_shorter">
						<i-option v-for="num in [0, 1, 2, 3]" :value="num" :key="num">{{ num }}</i-option>
					</i-select>
				</i-form-item>
			</div>
			
			<i-form-item label="可报名客户类型：" prop="customer_type" class="_height">
				<i-checkbox-group v-model="formValidate.customer_type">
					<i-checkbox :label="1">已合作客户</i-checkbox>
					<i-checkbox :label="2">自己未合作客户</i-checkbox>
					<i-checkbox :label="3">非自己未合作客户</i-checkbox>
				</i-checkbox-group>
			</i-form-item>

			<div class="g-flex _height">
				<i-form-item label="是否上传打款凭证：" class="g-1of2 _height" prop="has_voucher">
					<i-radio-group v-model="formValidate.has_voucher">
						<i-radio :label="1" disabled class="_radio">是</i-radio>
						<i-radio :label="0" disabled class="_radio">否</i-radio>
					</i-radio-group>
				</i-form-item>

				<i-form-item class="g-1of2 _height"	label="显示报名人数：" prop="show_apply_num">
					<i-radio-group v-model="formValidate.show_apply_num">
						<i-radio :label="1" disabled class="_radio">是</i-radio>
						<i-radio :label="0" disabled class="_radio">否</i-radio>
					</i-radio-group>
				</i-form-item>
			</div>

			<div class="g-flex _height">
				<i-form-item class="g-1of2 " label="填写复训次数：" prop="write_retrain_num">
					<i-radio-group v-model="formValidate.write_retrain_num">
						<i-radio :label="1" disabled class="_radio">填写</i-radio>
						<i-radio :label="0" disabled class="_radio">不填写</i-radio>
					</i-radio-group>
				</i-form-item>

				<i-form-item label="填写是否听完：" class="g-1of2 _height" prop="write_listen_finish">
					<i-radio-group v-model="formValidate.write_listen_finish">
						<i-radio :label="1" disabled class="_radio">填写</i-radio>
						<i-radio :label="0" disabled class="_radio">不填写</i-radio>
					</i-radio-group>
				</i-form-item>
			</div>

			<div class="g-flex _height">
				<i-form-item label="填写是否参加过策略班：" class="g-1of2 _height" prop="write_join_strategy">
					<i-radio-group v-model="formValidate.write_join_strategy">
						<i-radio :label="1" disabled class="_radio">填写</i-radio>
						<i-radio :label="0" disabled class="_radio">不填写</i-radio>
					</i-radio-group>
				</i-form-item>
				<i-form-item label="填写是否起盘：" class="g-1of2 _height" prop="write_lift_plate">
					<i-radio-group v-model="formValidate.write_lift_plate">
						<i-radio :label="1" disabled class="_radio">填写</i-radio>
						<i-radio :label="0" disabled class="_radio">不填写</i-radio>
					</i-radio-group>
				</i-form-item>
			</div>

			<div class="g-flex _height">
				<i-form-item class="g-1of2 _height" label="填写合作类别：" prop="write_category">
					<i-radio-group v-model="formValidate.write_category">
						<i-radio :label="1" disabled class="_radio">填写</i-radio>
						<i-radio :label="0" disabled class="_radio">不填写</i-radio>
					</i-radio-group>
				</i-form-item>

				<i-form-item class="g-1of2 _height" label="填写已招代理数：" prop="write_proxy_num">
					<i-radio-group v-model="formValidate.write_proxy_num">
						<i-radio :label="1" disabled class="_radio">填写</i-radio>
						<i-radio :label="0" disabled class="_radio">不填写</i-radio>
					</i-radio-group>
				</i-form-item>
			</div>

			<div class="g-flex _height">
				<i-form-item class="g-1of2 _height" label="是否填写续费：" prop="write_is_renew">
					<i-radio-group v-model="formValidate.write_is_renew">
						<i-radio :label="1" class="_radio">填写</i-radio>
						<i-radio :label="0" class="_radio">不填写</i-radio>
					</i-radio-group>
				</i-form-item>
			</div>
		</i-form>
		<div name="footer" style="height: 40px; overflow: hidden">
			<vc-debounce-click 
				:tag="Button"
				type="primary" 
				class="g-fr" 
				@click="handleSubmit('formValidate')">保存</vc-debounce-click>
			<vc-debounce-click 
				:tag="Button"
				type="text" 
				class="g-fr g-m-r-10"
				@click="handleCancel">取消</vc-debounce-click>
		</div>
	</i-modal>
</template>

<script>
import { Modal, Form, FormItem, Input, Select,
	DatePicker, Col, Row, Option, RadioGroup,
	Radio, CheckboxGroup, Checkbox, Button } from 'iview';
import { CreatePortal, ImgsPicker } from 'wya-vc';
import API_ROOT from "@stores/apis/root";
import { formatDate } from '@utils/utils';
import Title from "../../_common/title";
import item from './add-new-item';

export default {
	name: "c-modal-detail",
	components: {
		'i-modal': Modal,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-input': Input,
		'i-select': Select,
		'i-option': Option,
		'i-data-picker': DatePicker,
		'i-col': Col,
		'i-row': Row,
		'i-radio': Radio,
		'i-radio-group': RadioGroup,
		'i-checkbox-group': CheckboxGroup,
		'i-checkbox': Checkbox,
		'i-button': Button,
		'oa-content-title': Title,
		'vc-imgs-picker': ImgsPicker
	},
	mixins: [item],
	props: {
		data: Object,
	},
	data() {
		return {
			visible: false,
			activityCategory: [],
			validatorCreateTime: '',
		};	
	},
	beforeCreate() {
		this.Button = Button;
	},
	async created() {
		this.formValidate = {
			...this.data,
			has_voucher: +this.data.has_voucher,
			show_apply_num: +this.data.show_apply_num,
			write_retrain_num: +this.data.write_retrain_num,
			write_listen_finish: +this.data.write_listen_finish,
			write_category: +this.data.write_category,
			apply_limit: +this.data.apply_limit,
			extra_apply: +this.data.extra_apply,
			category_id: +this.data.category_id,
			write_join_strategy: +this.data.write_join_strategy,
			write_lift_plate: +this.data.write_lift_plate,
			write_proxy_num: +this.data.write_proxy_num,
			customer_type: this.data.customer_type.split(',').map(Number),
			createdTime: [this.data.start_time, this.data.end_time],
			startTime: [this.data.apply_start_time, this.data.apply_end_time],
			coverImage: [this.data.cover_image]
		};
		this.ruleValidate.startTime = [
			{ required: true, type: 'array', message: '请选择开始时间', trigger: 'change' }
		];
		const activityCategory = await this.$request({
			url: API_ROOT._CONTENT_ACTIVITY_CATEGORY_GET,
			type: 'GET'
		});
		this.activityCategory = await activityCategory.data;
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleSubmit(name) {
			this.$refs[name].validateAndScroll((valid) => {
				if (valid) {
					const [startTime, endTime] = this.formValidate.createdTime;
					const [applyStartTime, applyEndTime] = this.formValidate.startTime;
					if (Number(startTime) < Number(applyEndTime)) {
						this.$Message.error('活动时间需要大于报名结束时间');
						return;
					}
					const sendData = {
						...this.formValidate
					};
					delete sendData.createdTime;
					delete sendData.startTime;
					this.$request({
						url: API_ROOT._CONTENT_ACTIVITY_EDIT_POST,
						type: 'POST',
						param: {
							...this.formValidate,
							start_time: formatDate(startTime, 'minute'),
							end_time: formatDate(endTime, 'minute'),
							apply_start_time: formatDate(applyStartTime, 'minute'),
							apply_end_time: formatDate(applyEndTime, 'minute'),
							customer_type: sendData.customer_type.join(','),
							cover_image: this.formValidate.coverImage[0]
						}
					}).then(res => {
						this.visible = false;
						this.$emit('sure');
						this.$Message.success(res.msg);
						app.$store.commit('CONTENT_ACTIVITY_LIST_RESET', { type: '' });
					}).catch(err => {
						this.visible = true;
						this.$Message.error(err.msg);
					});
				}
			});
		},
		handleCancel() {
			this.$emit('close');
		},
		handleChange() {
			const a = this.formValidate.createdTime[0];
		},
		handleSelect() {
		},
		handleError(err) {
			this.$Message.error(err.msg);
		}
	}
};

export const CreateModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.v-activity-list-new {
  ._header {
		height: 50px;
		line-height: 50px;
		color: red;
	}
	._detail {
		border-left: 4px solid #f14b5f;
		padding: 0 10px;
  }
  ._long {
    width: 300px;
  }
  ._short {
    width: 200px;
  }
  ._end {
    margin-bottom: 0;
  }
  ._tips {
    font-size: 12px;
    color: #bbb;
    padding-right: 10px;
  }
  ._radio {
		margin-right: 20px;
		min-width: 50px
  }
	._height {
		height: 35px;
	}
	._num-tip {
		position: absolute;
		bottom: -5px;
		right: 205px;
	}
	textarea {
		font-size: 12px;
	}
	.ivu-form.ivu-form-label-right {
		max-height: 355px;
		margin-bottom: 30px;
		overflow-y: scroll;
	}
}
	
</style>

