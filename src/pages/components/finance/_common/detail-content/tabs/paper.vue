<template>
	<div v-show="show" class="v-finance-tab">
		<div v-if="spin">
			<i-form 
				v-if="data.archive_info.archive_staff_name === '' || !data.archive_info.archive_staff_name" 
				ref="form"
				:inline="true"
				:rules="validator"
				:model="formdata" 
				:label-width="90" 
				label-position="left">
				<i-form-item prop="submit_name" label="合同投递人:">
					<i-input
						v-model="formdata.submit_name" 
						placeholder="请输入市场部合同投递人"
						style="width: 220px"
					/>
				</i-form-item>
				<i-form-item prop="archive_time" class="g-m-l-30" label="归档时间:">
					<i-datepicker 
						v-model="formdata.archive_time"
						placeholder="请选择归档时间"
						style="width: 220px"
						transfer
					/>
				</i-form-item>
				<br>
				<i-button type="primary" @click="handleSubmit">保存</i-button>
			</i-form>
			<div v-else class="g-fw-w">
				<oa-detail-item :content="data.archive_info.submit_name" label="合同递交人">{{ data.archive_info.submit_name }}</oa-detail-item>
				<oa-detail-item :content="data.archive_info.archive_time" label="归档时间">{{ data.archive_info.archive_time }}</oa-detail-item>
				<oa-detail-item 
					:content="data.archive_info.archive_staff_name" 
					class="g-m-t-15" 
					label="操作人">{{ data.archive_info.archive_staff_name }}</oa-detail-item>
				<oa-detail-item 
					:content="data.archive_info.operate_time" 
					class="g-m-t-15" 
					label="操作时间">{{ data.archive_info.operate_time }}</oa-detail-item>
			</div>
		</div>
		<oa-loading v-else fix/>
	</div> 
</template>

<script>
import API_ROOT from '@stores/apis/root';
import { Form, FormItem, Input, DatePicker, Button, Spin } from 'iview';
import Loading from '@components/_common/loading/loading';
import { formatMoment } from '@utils/utils';
import DetailItem from '../../detail-item';

export default {
	name: 'finance-detail-tabs-paper',
	components: {
		'oa-detail-item': DetailItem,
		'i-input': Input,
		'i-datepicker': DatePicker,
		'i-button': Button,
		'i-form': Form,
		'i-form-item': FormItem,
		'oa-loading': Loading
	},
	props: {
		contractId: Number,
		show: Boolean
	},
	data() {
		return {
			data: {
				archive_info: {

				}
			},
			spin: true,
			isfetching: 0,
			formdata: {},
			validator: {
				submit_name: [
					{ required: true, message: '请输入市场部合同投递人', trigger: 'blur' }
				],
				archive_time: [
					{ required: true, type: 'date', message: '请选择归档时间', trigger: 'blur' }
				]
			}
		};
	},
	watch: {
		show(val, old) {
			val && this.isfetching === 0 && this.loadData();
		},
		contractId() {
			this.loadData();
		}
	},
	created() {
		this.show && this.loadData();
	},
	methods: {
		loadData() {
			this.spin = false;
			this.isfetching = 1;
			this.$request({
				url: API_ROOT._FINANCE_CUSTOMER_ELECTRONIC_GET,
				type: 'GET',
				param: {
					contract_id: this.contractId
				},
				loading: false
			}).then(res => {
				this.data = res.data;
				this.spin = true;
			}).catch(err => {
				this.$Message.error(err.msg);
				this.spin = true;
			});
		},
		handleSubmit() {
			this.$refs['form'].validate((item) => {
				if (item) {
					this.$request({
						url: API_ROOT._FINANCE_CUSTOMER_ELECTRIC_ARCHIVE,
						type: 'GET',
						param: {
							contract_id: this.contractId,
							...this.formdata,
							archive_time: formatMoment(this.formdata.archive_time, 'YYYY-MM-DD HH:mm:ss')
						},
						loading: false
					}).then(res => {
						this.loadData();
					}).catch(err => {
						this.$Message.error(err.msg);
					});
				}
			});
		}
	}
};
</script>

<style lang="scss">

</style>


