<template>
	<i-form
		ref="form"
		:model="formdata"
		:rules="validator"
		:label-width="90"
		style="overflow: auto; height: 100%"
		class="v-system-assess-add"
	>
		<div class="g-flex g-jc-c g-bg-gray-mid g-pd-t-20 g-pd-r-20 g-m-20">
			<i-formitem label="起止时间" prop="time">
				<i-datepicker
					v-model="formdata.time" 
					:options="options"
					type="daterange"
					split-panels
					placeholder="请选择起止时间"
					style="width: 270px"
					transfer
				/>
			</i-formitem>
			<i-formitem style="margin-left: 30px" label="填写人级别" prop="written_rank">
				<i-select
					v-model="formdata.written_rank"
					style="width: 270px"
					multiple
				>
					<i-option value="1">员工</i-option>
					<i-option value="2">经理</i-option>
					<i-option value="3">总监</i-option>
				</i-select>
			</i-formitem>
		</div>
		<div class="g-flex g-fd-c g-ai-c" style="padding-bottom: 80px;">
			<oa-item 
				ref="businessForm" 
				:data-info="formdata" 
				info-key="business" 
				name="业务"/>
			<i-divider />
			<oa-item 
				ref="mentalityForm" 
				:data-info="formdata" 
				info-key="mentality" 
				name="心态"/>
		</div>
		<oa-footer 
			ok-text="确认"
			@ok="handleOk"
			@cancel="handleCancel"
		/>
	</i-form>
</template>

<script>
import { Form, FormItem, DatePicker, Select, Option, Divider } from 'iview';
import moment from 'moment';
import Footer from '@components/_common/footer/footer';
import { ConfirmModal } from '@components/hr/_common/popup/confirm';
import Item from './item';

export default {
	name: 'oa-tpl',
	components: {
		'i-form': Form,
		'i-formitem': FormItem,
		'i-datepicker': DatePicker,
		'i-select': Select,
		'i-option': Option,
		'i-divider': Divider,
		'oa-item': Item,
		'oa-footer': Footer
	},
	data() {
		return {
			some: {},
			other: {},
			formdata: {
				business: [{
					question_arr: [{}, {}, {}]
				}],
				mentality: [{
					question_arr: [{}, {}, {}]
				}]
			},
			options: {
				disabledDate(date) {
					return date && date.valueOf() < Date.now() - 86400000;
				}
			},
			validator: {
				time: [
					{ 
						required: true, 
						type: 'array', 
						fields: {
							0: { type: 'date', required: true, message: '请选择起止时间' },
							1: { type: 'date', required: true, message: '请选择起止时间' }
						}
					}
				],
				written_rank: [
					{ required: true, type: 'array', message: '请选择填写人级别', trigger: 'change' }
				]
			}
		};
	},
	mounted() {
		const { query } = this.$route;
		query.recommend_conf_id && this.loadDetail();
	},
	methods: {
		loadDetail() {
			const { query } = this.$route;
			this.$request({
				url: '_HR_SYSTEM_ASSESS_STATISTICS_DETAIL_GET',
				type: 'GET',
				param: query
			}).then(res => {
				this.formdata = {
					...res.data,
					time: [res.data.start_time, res.data.end_time]
				};
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		handleOk() {
			ConfirmModal.popup({
				content: '优劣势互荐内容是否确认，确认后在规定起止时间 内不可修改'
			}).then(async inf => {
				this.$refs.form.validateAndScroll(valid => {
					if (valid) {
						const { query } = this.$route;
						this.$request({
							url: '_HR_SYSTEM_ASSESS_STATISTICS_ADD_POST',
							type: 'POST',
							param: {
								...this.formdata,
								...query,
								start_time: moment(this.formdata.time[0]).format('YYYY-MM-DD'),
								end_time: moment(this.formdata.time[1]).format('YYYY-MM-DD')
							}
						}).then(info => {
							this.$Message.success(info.msg);
							this.$router.back();
						}).catch(err => {
							this.$Message.error(err.msg);
						});
					}
				});
			});
		},
		handleCancel() {
			this.$router.back();
		}
	},
};
</script>

<style lang="scss" scoped>
</style>
