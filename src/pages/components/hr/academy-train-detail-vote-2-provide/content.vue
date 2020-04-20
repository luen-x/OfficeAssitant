<template>
	<div class="v-academy-tarain-detail-vote-result">
		<oa-provide-qcrode 
			v-if="!showNextStep && url" 
			:url="url" 
			:relation_id="relation_id"
			:activity_type="3"
			:activity_id="$route.query.vote_id"
		/>
		<oa-title style="margin-bottom: 15px">发放设置</oa-title>
		<i-form 
			ref="formValidate"
			:model="formValidate" 
			:rules="ruleValidate"
			:label-width="110"
		>
			<i-form-item label="选择投票时间：" prop="voteTime">
				<i-data-picker 
					v-model="formValidate.voteTime"
					:editable = "false"
					:options="voteOptions"
					format="yyyy-MM-dd HH:mm"
					type="datetimerange"
					transfer
					split-panels
					separator=" 至 "
					style="width: 300px"
					placeholder="请选择投票时间"
					class="_long"/>
			</i-form-item>

			<i-form-item label="投票方式：" prop="vote_method" style="margin-top: -10px">
				<i-radio-group v-model="formValidate.vote_method">
					<i-radio :label="1" >匿名投票</i-radio>
					<i-radio :label="2" >记名投票</i-radio>
				</i-radio-group>
			</i-form-item>

			<i-form-item label="投票限制：" prop="vote_method" style="margin-top: -15px">
				<i-radio-group v-model="formValidate.vote_limit">
					<i-radio :label="1" >允许任何人进行投票</i-radio>
					<i-radio :label="2">仅限"参与人员"进行投票</i-radio>
					<i-radio :label="3" style="margin-left: 20px">仅限"公司内部人员"进行投票</i-radio>
				</i-radio-group>
			</i-form-item>

			<i-form-item label="投票结果展示：" style="margin-top: -15px">
				<i-checkbox 
					v-model="formValidate.show_result"
					:true-value="1"
					:false-value="0"
				>投票后允许查看结果</i-checkbox>
			</i-form-item>
		</i-form>

		<div class="_footer">
			<i-button 
				type="primary"
				style="margin-right: 300px" 
				@click="handleNextStep">{{ showNextStep ? '下一步' : '保存' }}</i-button>
				<!-- <i-button 
				v-else 
				type="primary"
				style="margin-right: 300px" 
				@click="handleSaveChange">保存</i-button> -->
		</div>
	</div>
</template>

<script>
import { Form, FormItem, DatePicker, RadioGroup, Radio, Checkbox, Button } from 'iview';
import API_ROOT from '@stores/apis/root';
import provideQcrode from '@components/hr/academy-train-detail/_common/provide-qcode';
import moment from "moment";
import oaTitle from '@components/hr/academy-train-detail/_common/title';

export default {
	name: 'oa-tpl',
	components: {
		'i-form': Form,
		'i-form-item': FormItem,
		'i-data-picker': DatePicker,
		'i-radio': Radio,
		'i-radio-group': RadioGroup,
		'i-checkbox': Checkbox,
		'i-button': Button,
		'oa-title': oaTitle,
		'oa-provide-qcrode': provideQcrode,
	},
	data() {
		const validateCreatedTime = (rule, value, callback) => {
			if (!value[0] && !value[1]) {
				callback('请选择投票时间');
			} else if (value[0] >= value[1]) {
				callback('投票结束时间需大于开始时间奥');
			} else {
				callback();
			}
		};
		this.voteOptions = {
			disabledDate(date) {
				return date && date.valueOf() < Date.now() - 86400000;
			}
		};
		return {
			showNextStep: true,
			url: '',
			relation_id: [],
			formValidate: {
				voteTime: '',
				vote_method: 1,
				vote_limit: 1,
				show_result: 1
			},
			ruleValidate: {
				voteTime: { validator: validateCreatedTime, trigger: 'change', required: true, },
				vote_method: { required: true },
			}
		};
	},
	created() {
		this.handleInit();
	},
	methods: {
		handleNextStep() {
			this.$refs.formValidate.validateAndScroll((valid) => {
				if (valid) {
					// let startTime = new Date(this.formValidate.voteTime[0]).getTime();
					// let endTime = new Date(this.formValidate.voteTime[1]).getTime();
					// if (startTime >= endTime) {
					// 	this.$Message.warning('投票结束时间要大于投票开始时间');
					// 	return;
					// }
					this.$request({
						url: API_ROOT._HR_ACADEMY_TRAIN_DETAIL_VOTE_2_PROVIDE_POST,
						param: {
							vote_id: this.$route.query.vote_id,
							...this.formValidate,
							start_time: moment(this.formValidate.voteTime[0]).format("YYYY-MM-DD HH:mm"),
							end_time: moment(this.formValidate.voteTime[1]).format("YYYY-MM-DD HH:mm")
						},
						type: 'POST',
						loding: false
					}).then(res => {
						this.handleInit();
						this.$Message.success('保存成功');
					}).catch(res => {
						this.$Message.error(res.msg);
					});
					
				}
			});
		},
		handleSaveChange() {

		},
		handleInit() {
			return this.$request({
				url: API_ROOT._HR_ACADEMY_TRAIN_DETAIL_VOTE_2_VOTE_DETAIL_GET,
				param: {
					vote_id: this.$route.query.vote_id
				},
				type: "GET",
				loading: false
			}).then(({ data }) => {
				// 已安排的直接显示第二步
				if (data.start_time) {
					this.formValidate = {
						voteTime: [data.start_time, data.end_time],
						vote_method: +data.vote_method,
						vote_limit: +data.vote_limit,
						show_result: +data.show_result
					};
					this.url = data.url;
					this.relation_id = data.relation_id;
					this.showNextStep = false;
				}
			});
		}

	},
};
</script>

<style lang="scss" scoped>
.v-academy-tarain-detail-vote-result {
	padding: 15px 0 0 30px;
	width: 100%;
	._footer {
		position: fixed;
		bottom: 0;
		height: 45px;
		line-height: 45px;
		text-align: center;
		margin-left: -30px;
		width: 100%;
		box-shadow:0px -2px 10px 0px rgba(0, 0, 0, 0.08);
	}
}
</style>
