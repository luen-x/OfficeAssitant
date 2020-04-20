<template>
	<div class="v-hr-salary-social-setting" >
		<div class="_content">
			<i-form 
				ref="form" 
				:model="formDate" 
				:label-width="100" 
				style="width: 830px" 
				position="left">
				<div class="g-flex g-flex-ac">
					<oa-title title="默认值配置" />
					<oa-explain 
						class="g-m-l-10"
						style="transform: translateY(2px);"
						content="默认值配置后，此后的新员工以及从补贴转入社保的员工将自动填入这里配置的数据"
					/>
				</div>
				<div>
					<i-row>
						<i-col span="12">
							<i-form-item label="新增原因:">
								<i-select 
									v-model="formDate.social_security_reason" 
									placeholder="请选择新增原因" 
									transfer 
									clearable
									style="width: 300px">
									<i-option v-for="(item, index) in reason" :key="index" :value="item.social_value">
										{{ item.lable }}
									</i-option>
								</i-select>
							</i-form-item>
						</i-col>
						<i-col span="12">
							<i-form-item label="用工形式:">
								<i-select 
									v-model="formDate.employment_foremployment_form" 
									style="width: 300px" 
									clearable
									placeholder="请选择用工形式" 
									transfer>
									<i-option 
										v-for="(item, index) in foremployment" 
										:key="index" 
										:value="item.foremployment_value">
										{{ item.label }}
									</i-option>
								</i-select>
							</i-form-item>
						</i-col>
						<i-col span="12">
							<i-form-item label="月工资收入:">
								<i-input-number 
									v-model="formDate.salary" 
									:max="9999999" 
									placeholder="请输入月工资收入" 
									style="width: 300px"/>
							</i-form-item>
						</i-col>
						<i-col span="12">
							<i-form-item label="工种:">
								<i-input 
									v-model="formDate.work_type" 
									:maxlength="20" 
									placeholder="请输入工种" 
									style="width: 300px"
								/>
							</i-form-item>
						</i-col>
					</i-row>
				</div>
			</i-form>
			<oa-title title="社保公司配置" />
			<i-table :columns="columns" :data="formDate.conf_arr" stripe class="g-m-l-10"/>
		</div>
		<footer class="g-flex-cc">
			<div class="g-gray-btn-small g-m-r-10" @click="handleTip">重置</div>
			<div
				style="display: inline-block;"
				class="g-m-r-10 g-red-btn-small"
				@click="handleSubmit"
			>
				保存
			</div>
		</footer>
	</div>
</template>

<script>
import API_ROOT from "@stores/apis/root";
import {
	Form,
	FormItem,
	Input,
	Select,
	Option,
	DatePicker,
	Row,
	Col,
	InputNumber,
	Table 
} from "iview";
// utils
import { services } from "@stores/services/hr";
import Explain from '@components/_common/explain/explain';
import { dataValidity } from "@utils/utils";
import { ImgsPicker } from "wya-vc";
import { TipModal } from "./popup/tip";
import Title from "../_common/title";
import item from "./item";

export default {
	name: "v-hr-salary-social-setting",
	components: {
		"i-form": Form,
		"i-form-item": FormItem,
		"i-input": Input,
		"i-select": Select,
		"i-option": Option,
		"i-date-picker": DatePicker,
		"i-row": Row,
		"i-col": Col,
		"i-table": Table,
		"oa-title": Title,
		'oa-explain': Explain,
		'i-input-number': InputNumber,
	},
	mixins: [services.residenceList(), item],
	data() {
		return {
			reason: [{
				social_value: 1,
				lable: "新参加工作"
			},
			{
				social_value: 2,
				lable: "个体再就业"
			}
			],
			foremployment: [{
				foremployment_value: 1,
				label: "合同工"
			},
			{
				foremployment_value: 2,
				label: "编外合同工"
			}
			],
			formDate: {
				salary: '',
				social_security_reason: '',
				employment_foremployment_form: '',
				work_type: '',
				conf_arr: []
			}
		
		};
	},
	
	mounted() {
		this.loadConfigureInfo();
	},
	methods: {
		loadConfigureInfo(type) {
			this.$request({
				url: API_ROOT._HR_SALARY_SOCIAL_SETTING_GET,
				type: "GET",
				param: {
				},
				loading: false
			}).then(res => {
				this.formDate = res.data;
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		handleSubmit() {
			this.$request({
				url: API_ROOT._HR_SALARY_SOCIAL_SETTING_ADD_POST,
				type: "POST",
				param: {
					...this.formDate
				},
			}).then(res => {
				this.$Message.success(res.msg);
				this.loadConfigureInfo();
				
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		handleTip() {
			TipModal.popup({
			}).then(res => {
				this.loadConfigureInfo();
			}).catch(err => {});
		}
	}
};
</script>

<style lang="scss">
.v-hr-salary-social-setting {
	padding:20px;
	._content{
		margin-bottom: 80px;
		
	}
	.ivu-table-row{
		height:52px;
	}
	.ivu-select-placeholder, .ivu-select-single .ivu-select-selection .ivu-select-selected-value {
		height:32px !important;
	}
	th:nth-child(2)>.ivu-table-cell,th:nth-child(3)>.ivu-table-cell{
		margin-left: 30px;
	}
	
	footer {
        position: absolute;
        bottom: 0;
        left: 0;
        z-index: 999;
        background-color: #ffffff;
        width: 100%;
        height: 60px;
        box-shadow: 0px -2px 9.9px 0.1px rgba(0, 0, 0, 0.08);
    }
}
</style>
