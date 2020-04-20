<template>
	<div>
		<i-modal
			ref="modal"
			:loading="true"
			v-model="visible"
			:title="type == 1 ? '随机分配' : '总监分配'"
			:width="500"
			:mask-closable="false"
			class="v-hr-recruit-school-tryassign-allocate-modal"
			@on-ok="handleOk"
			@on-cancel="handleCancel"
		>
			<i-form
				ref="form" 
				:model="formData" 
				:label-width="100" 
				:rules="formDataRule" 
				class="g-m-t-20"
			>
				<i-form-item label="分配方式：" prop="method">
					<i-radio-group v-model="formData.method" @on-change="handleChangeMethod">
						<i-radio :label="1">按男女</i-radio>
						<i-radio :label="2">按总数</i-radio>
					</i-radio-group>
				</i-form-item>
				<i-form-item label="可分配人数：">
					<span>{{ totalNumber }}（{{ manNumber }}男/{{ womanNumber }}女）</span>
				</i-form-item>
				<i-form-item
					label="可分配期限："
					prop="deadline_time"
				>
					<i-datepicker
						v-model="formData.deadline_time"
						:editable="false"
						:options="options"
						type="daterange"
						split-panels
						separator=" 至 "
						format="yyyy-MM-dd"
						style="width: 220px"
						placeholder="请选择可分配期限"
						transfer
					/>
				</i-form-item>
				<i-form-item
					label="可分配战区："
					prop="assign_departs"
				>
					<div v-for="(item, index) in formData.assign_departs" :key="index" class="g-m-b-10">
						<i-checkbox 
							v-model="item.checked" 
							@on-change="handleChangeCheck($event, item)"
						>
							{{ item.depart_name }}
						</i-checkbox>
						<span v-if="formData.method == 1">
							<span class="g-m-r-5">男</span>
							<i-input-number 
								v-model="item.man_count" 
								:disabled="!item.checked"
								:precision="0"
								:active-change="false"
								:min="0"
								:max="999"
								style="width: 57px;"
								class="g-m-l-5"
							/>
							<span style="margin: 0 6px 0 6px;">女</span>
							<i-input-number 
								v-model="item.woman_count" 
								:disabled="!item.checked"
								:precision="0"
								:active-change="false"
								:min="0"
								:max="999"
								style="width: 57px;"
								class="g-m-l-5"
							/>
							<span class="g-m-l-5">共{{ item.man_count + item.woman_count }}人</span>
						</span>
						<span v-else>
							<i-input-number 
								v-model="item.total_count" 
								:disabled="!item.checked"
								:precision="0"
								:active-change="false"
								:min="0"
								:max="999"
							/>
						</span>
					</div>
				</i-form-item>
				<div style="margin-left: 40px;">
					<span style="margin-right: 12px;">已分配：</span>
					{{ departTotal }}个战区/{{ assignTotal }}人
					<span v-if="formData.method == 1">（{{ assignMan }}男/{{ assignWoman }}女）</span>
				</div>
			</i-form>
		</i-modal>
	</div>
</template>

<script>
import { Modal, Form, FormItem, Message, Select, Option, Radio, RadioGroup,
	InputNumber, Input, Checkbox, CheckboxGroup, DatePicker } from 'iview';
import API_ROOT from '@stores/apis/root';
import { CreatePortal } from 'wya-vc';
import { dataValidity } from '@utils/utils';
import moment from 'moment';

export default {
	name: 'sc-service-start-modal',
	components: {
		'i-modal': Modal,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-select': Select,
		'i-option': Option,
		'i-input': Input,
		'i-input-number': InputNumber,
		'i-radio-group': RadioGroup,
		'i-radio': Radio,
		'i-checkbox': Checkbox,
		'i-checkbox-group': CheckboxGroup,
		'i-datepicker': DatePicker
	},
	props: {
		applicant: {
			type: Array,
			default: () => []
		},
		type: {
			type: Number,
			default: 1, // 1 随机分配 2 总监分配
		}
	},
	data() {
		let newDate = new Date();
		return {
			visible: false,
			options: {
				disabledDate(date) {
					return date && date.valueOf() < Date.now() - 86400000;
				}
			},
			formData: {
				method: 1,
				deadline_time: [],
				assign_departs: []
			},
			formDataRule: {
				method: [{ type: 'number', required: true, message: '请选择分配方式', trigger: 'change' }],
				deadline_time: [
					{
						type: 'array',
						required: true,
						fields: {
							0: { type: 'date', required: true, message: '请选择可分配期限' },
							1: [{ type: 'date', required: true, message: '请选择可分配期限' }
							],
						}
					}
				],
				assign_departs: [{ type: 'array', required: true, message: '请至少勾选一个战区', trigger: 'chagne' }]
			},
		};
	},
	computed: {
		// 部门总数
		departTotal() {
			return this.formData.assign_departs.filter(v => v.checked).length;
		},
		// 已分配总数
		assignTotal() {
			return this.formData.method == 2 ? this.formData.assign_departs.reduce((pre, cur) => {
				return cur.total_count + pre;
			}, 0) : this.assignMan + this.assignWoman;
		},
		// 已分男
		assignMan() {
			return this.formData.assign_departs.reduce((pre, cur) => {
				return cur.man_count + pre;
			}, 0);
		},
		// 已分女
		assignWoman() {
			return this.formData.assign_departs.reduce((pre, cur) => {
				return cur.woman_count + pre;
			}, 0);
		},
		// 男生总数
		manNumber() {
			return this.applicant.filter(v => v.sex == 0).length;
		},
		// 女生总数
		womanNumber() {
			return this.applicant.filter(v => v.sex == 1).length;
		},
		// 总人数
		totalNumber() {
			return this.applicant.length;
		}
	},
	mounted() {
		this.visible = true;
		this.loadDepartData();
		this.formData.deadline_time = [new Date(), moment().subtract('days', -2)._d];
	},
	methods: {
		// 每次改变方法将重新随机分配
		handleChangeMethod() {
			this.loadDepartData();
		},

		// 取消多选选中，当前部门分配人数置0
		handleChangeCheck(event, item) {
			if (!event) {
				item.man_count = 0;
				item.woman_count = 0;
				item.total_count = 0;
			}
		},
        
		// 请求部门
		loadDepartData() {
			this.$request({
				url: '_HR_DEPART_TWO_LEVEL_DEPART_GET',
				type: "GET",
				param: {},
				loading: false
			}).then((res) => {
				res.data.forEach(v => {
					v.checked = true;
					v.man_count = 0;
					v.woman_count = 0;
					v.total_count = 0;
				});
				this.formData.assign_departs = res.data;
			}).then(res => {
				let manArr = this.randomChangeAssign(this.manNumber);
				let womanArr = this.randomChangeAssign(this.womanNumber);
				let totalArr = this.randomChangeAssign(this.totalNumber);
				this.formData.assign_departs.forEach((v, index) => {
					v.man_count = manArr[index];
					v.woman_count = womanArr[index];
					v.total_count = totalArr[index];
				});
			}).catch((error) => {

			});
		},
        
		// 随机打乱数组
		shuffle(array) {
			let m = array.length;
			let t = 0;
			let i = 0;
			while (m) {
				i = Math.floor(Math.random() * m--);
				t = array[m];
				array[m] = array[i];
				array[i] = t;
			}
			return array;
		},
        
		// 传入男女或总数，返回一个长度与当前部门数量相匹配 随机分配好人数的数组
		randomChangeAssign(num) {
			let count = 0;
			let additionalNumber = 0;
			count = parseInt(num / this.departTotal, 10);
			let additionalNumberArr = new Array(this.departTotal).fill(count);
			additionalNumber = num >= this.departTotal ? num % this.departTotal : num;
			for (let i = 0; i < additionalNumber; i++) {
				additionalNumberArr[i] += 1;
			}
			additionalNumberArr = this.shuffle(additionalNumberArr);
			return additionalNumberArr;
		},
		handleOk() {
			this.$refs.form.validateAndScroll((valid) => {
				if (valid) {
					if (this.formData.method == 1 && (this.assignMan !== this.manNumber || this.assignWoman !== this.womanNumber)) {
						this.$Message.warning('已分配总人数/男女数必须与可分配人数总人数/男女数相等');
						this.$refs.modal.buttonLoading = false;
					} else if (this.assignTotal !== this.totalNumber) {
						this.$Message.warning('已分配总人数/男女数必须与可分配人数总人数/男女数相等');
						this.$refs.modal.buttonLoading = false;
					} else {
						this.visible = false;
						this.handleSave();
					}
				} else {
					this.$refs.modal.buttonLoading = false;
				}
			});
		},
		handleSave() {
			let param = {
				...this.formData,
				assign_type: this.type,
				deadline_start_time: moment(this.formData.deadline_time[0]).format('YYYY-MM-DD'),
				deadline_end_time: moment(this.formData.deadline_time[1]).format('YYYY-MM-DD'),
				applicant_arr: this.applicant
			};
			this.$request({
				url: '_HR_RECRUIT_SCHOOL_TRYASSIGN_ALLOCATE_SETTING_POST',
				type: "POST",
				param,
				loading: false
			}).then((res) => {
				this.$Message.success('设置成功');
				this.$emit('sure');
				this.$router.push(this.type == 1
					? '/hr/recruit/school/tryassign/random' 
					: '/hr/recruit/school/tryassign/chief');
			}).catch((error) => {
				this.$Message.error(error.msg);
			});
		},
		handleCancel() {
			this.$emit('close');
		}
	}
};
export const AllocateModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.v-hr-recruit-school-tryassign-allocate-modal{
    .ivu-form-label-right {
		padding-left: 30px;
    }
	.ivu-checkbox-wrapper {
		display: inline-block;
		width: 78px;
	}
}
</style>