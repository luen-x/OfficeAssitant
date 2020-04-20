<template>
	<div class="v-academy-train-detail-basic-info-edit">
		<div class="_wrapper">
			<oa-title class="g-m-b-20">
				<template slot="title">
					详情信息
					<span
						class="g-pointer g-c-blue-mid g-m-l-5"
					>
						<span @click="handleToggle()">编辑</span>
					</span>
				</template>
			</oa-title>
			<div class="__detail">
				<div class="__item">
					<span class="g-c-black7">项目类型：</span>
					<span class="g-c-black1">{{ datas.type_name }}</span>
				</div>
				<div class="__item">
					<span class="g-c-black7">项目主题：</span>
					<span class="g-c-black1">{{ datas.project_topic }}</span>
				</div>
				<div class="__item">
					<span class="g-c-black7">项目时段：</span>
					<span class="g-c-black1">{{ datas.start_time }} 至 {{ datas.end_time }}</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import {
	Form, FormItem, Input, RadioGroup, Radio,
	Select, Option, DatePicker, Message
} from 'iview';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { cloneDeep } from 'lodash';
import moment from 'moment';
import API_ROOT from '@stores/apis/root';
import Title from '../academy-train-detail/_common/title';

export default {
	name: 'v-academy-train-detail-basic-info-edit',
	components: {
		'i-form': Form,
		'i-form-item': FormItem,
		'i-input': Input,
		'i-select': Select,
		'i-option': Option,
		'i-datepicker': DatePicker,
		'i-radio-group': RadioGroup,
		'i-radio': Radio,
		'oa-title': Title
	},
	props: {
		datas: Object
	},
	data() {
		const detailData = cloneDeep(this.datas);
		const validateAttends = (rule, value, callback) => {
			if (this.formData.project_type.type == '1' && this.formData.project_type.attends == '') {
				callback(new Error('请选择人才梯队'));
			} else {
				callback();
			}
		};
		const validateOther = (rule, value, callback) => {
			if (this.formData.project_type.type == '2' && this.formData.project_type.other == '') {
				callback(new Error('请填写其他主题名称'));
			} else {
				callback();
			}
		};
		return {
		};
	},
	created() {
	},
	methods: {
		handleToggle() {
			this.$emit('handleEditChange', true);
		},
		handleSave() {
			let obj = {
				project_id: this.$route.query.project_id,
				project_topic: this.formData.project_theme,
				type: this.formData.project_type.type,
				echelon_id: this.formData.project_type.type == '2'
					? this.formData.project_type.attends : '', // 人才梯队ID
				type_name: this.formData.project_type.type == '3'
					? this.formData.project_type.other : '', // 其他时名称
				start_time: moment(this.formData.project_time[0]).format('YYYY-MM-DD HH:mm:ss'),
				end_time: moment(this.formData.project_time[1]).format('YYYY-MM-DD HH:mm:ss')
			};
			this.$refs.form.validateAndScroll((valid) => {
				if (valid) {
					try {
						this.$request({
							url: API_ROOT['_HR_TRAIN_PROJECT_EDIT_SAVE_POST'], // eslint-disable-line
							type: "POST",
							param: obj
						}).then((res) => {
							this.$router.back();
						}).catch((error) => {
							this.$Message.error(error.msg);
						});
						this.isEdit = false;
					} catch (error) {
						console.error(error);
					}
				}
			});
		}
	}
};

</script>

<style lang="scss">
.v-academy-train-detail-basic-info-edit {
	._wrapper {
		.__detail{
			.__item {
				margin-bottom: 15px;
			}
		}
		.__edit {
			.__radio-item {
				display: inline-block;
				margin-right: 35px;
				.ivu-radio-wrapper:first-child {
					margin: 0
				}
			}
		}
	}
}
</style>
