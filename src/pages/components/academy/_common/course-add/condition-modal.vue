<template>
	<div>
		<i-modal
			ref="modal"
			:loading="true"
			v-model="visible"
			:width="680"
			:mask-closable="false"
			title="设置条件选择"
			class="v-academy-condition-modal"
			@on-ok="handleOk"
			@on-cancel="handleCancel"
		>
			<i-form
				ref="form" 
				:model="formData" 
				:label-width="50" 
				:rules="formdataRule" 
				class="g-m-t-20 g-pd-l-10"
			>
				<i-form-item label="" prop="activity_id">
					<i-checkbox v-model="formData.age_range">
						工龄范围
						<span style="color: #999999">（当前工龄要求，精确到月）</span>
					</i-checkbox>
				</i-form-item>
				<i-form-item v-if="formData.age_range" label="" prop="age">
					在
					<i-input-number 
						v-model="formData.age.work_year_min" 
						:max="999"
						:min="0"
						:precision="0"
						placeholder="输入最小值(整数)"
						style="width: 120px;"
					/>
					-
					<i-input-number 
						v-model="formData.age.work_year_max" 
						:max="999"
						:min="0"
						:precision="0"
						placeholder="输入最大值(整数)"
						style="width: 120px;"
					/>
				</i-form-item>
				<i-form-item label="" prop="activity_id">
					<i-checkbox v-model="formData.depart_name_single">
						职位
						<span style="color: #999999">（当前职位要求）</span>
					</i-checkbox>
				</i-form-item>
				<i-form-item v-if="formData.depart_name_single" label="" prop="activity_id">
					当前所处
					<i-select
						v-model="formData.position_ids"
						style="width: 220px"
						clearable
						transfer
						multiple
						placeholder="选择职位（可多选）"
					>
						<i-option
							v-for="(item, index) in positionList"
							:key="index"
							:value="item.position_id"
						>
							{{ item.position_name }}
						</i-option>
					</i-select>
					（可多选）
				</i-form-item>
				<i-form-item label="" prop="activity_id">
					<i-checkbox v-model="formData.is_need_master">
						师傅身份
						<span style="color: #999999">（当前师傅身份要求）</span>
					</i-checkbox>
				</i-form-item>
				<i-form-item label="" prop="activity_id">
					<i-checkbox v-model="formData.sale_master_single">
						销工等级
						<span style="color: #999999">（当前销工等级要求）</span>
					</i-checkbox>
				</i-form-item>
				<i-form-item v-if="formData.sale_master_single" label="" prop="activity_id">
					当前等级
					<i-select
						v-model="formData.rank_ids"
						style="width: 220px"
						clearable
						transfer
						multiple
						placeholder="选择等级（可多选）"
					>
						<i-option
							v-for="(item, index) in rankList"
							:key="index"
							:value="item.rank_id"
						>
							{{ item.rank_name }}
						</i-option>
					</i-select>
					（可多选）
				</i-form-item>
			</i-form>
		</i-modal>
	</div>
</template>

<script>
import { Modal, DatePicker, Form, FormItem, Message, Select,
	Radio, RadioGroup, Option, Cascader, InputNumber, Input, Checkbox } from 'iview';
import API_ROOT from '@stores/apis/root';
import { services as commonServices } from '@stores/services/common';
import { CreatePortal } from 'wya-vc';
import { dataValidity, getItem, setItem } from '@utils/utils';
import moment from 'moment';
import { setTimeout } from 'timers';

export default {
	name: 'sc-service-start-modal',
	components: {
		'i-modal': Modal,
		'i-datepicker': DatePicker,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-select': Select,
		'i-option': Option,
		'i-input-number': InputNumber,
		'i-input': Input,
		'i-cascader': Cascader,
		'i-radio-group': RadioGroup,
		'i-radio': Radio,
		'i-checkbox': Checkbox
	},
	mixins: [
		commonServices.region()
	],
	props: {
		name: Number,
		condition: {
			type: Object,
			default: () => {}
		},
		edit: {
			type: Number,
			default: 1
		},
		calendar_id: Number
	},
	data() {
		return {
			visible: false,
			formData: {
				age_range: false,
				depart_name_single: false,
				is_need_master: false,
				sale_master_single: false,
				age: {
					work_year_min: null,
					work_year_max: null,
				},
				position_ids: [],
				rank_ids: []
			},
			formdataRule: {
			},
			positionList: [],
			rankList: [],
			options: {
				disabledDate(date) {
					return date && date.valueOf() < Date.now() - 86400000;
				}
			},
		};
	},
	watch: {
	},
	mounted() {
		this.visible = true;
		this.loadPosition();
		this.loadRank();
		this.edit ? this.loadData() : '';
	},
	methods: {
		loadData() {
			if (this.condition.age_range == '1') {
				this.formData.age_range = true;
				this.formData.age.work_year_min = this.condition.age.work_year_min;
				this.formData.age.work_year_max = this.condition.age.work_year_max;
			}
			if (this.condition.depart_name_single == '1') {
				this.formData.depart_name_single = true;
				this.formData.position_ids = this.condition.position_ids;
			}
			if (this.condition.is_need_master == '1') {
				this.formData.is_need_master = true;
			}
			if (this.condition.sale_master_single == '1') {
				this.formData.sale_master_single = true;
				this.formData.rank_ids = this.condition.rank_ids;
			}
		},
		loadPosition() {
			this.$request({
				url: API_ROOT._HR_DEPART_POSITION_GET,
				type: 'GET',
				loading: false
			}).then((res) => {
				let depart = getItem("firstDepartId_" + _global.version, 'localStorage');
				this.positionList = res.data.filter(item => item.depart_id === depart.res.data.sale)[0].positions;
			}).catch((error) => {});
		},
		loadRank() {
			this.$request({
				url: API_ROOT._ACADEMY_COMMON_ALL_RANK_GET,
				type: 'GET',
				loading: false
			}).then((res) => {
				this.rankList = res.data;
			}).catch((error) => {});
		},
		handleOk() {
			this.$refs.form.validateAndScroll((valid) => {
				if (valid) {
					if (this.formData.age_range 
					&& this.formData.age.work_year_max && this.formData.age.work_year_min > this.formData.age.work_year_max) {
						this.$Message.warning('工龄最小值不能大于最大值');
					} else if (this.formData.age_range && (!this.formData.age.work_year_min && !this.formData.age.work_year_max)) {
						this.$Message.warning('工龄至少填写一个');
					} else if (this.formData.depart_name_single && !this.formData.position_ids.length) {
						this.$Message.warning('请选择职位要求');
					} else if (this.formData.sale_master_single && !this.formData.rank_ids.length) {
						this.$Message.warning('请选择等级要求');
					} else {
						this.visible = false;
						this.handleSave();
					}
					this.$refs.modal.buttonLoading = false;
				} else {
					this.$refs.modal.buttonLoading = false;
				}
			});
		},
		handleSave() {
			let obj = {
				conditions: {
					age: {},
					position: {},
					master: {
						is_need_master: this.formData.is_need_master
					},
					rank: {}
				}
			};
			if (this.formData.age_range) {
				if (this.formData.age.work_year_min) {
					obj.conditions.age.work_year_min = this.formData.age.work_year_min;
				}
				if (this.formData.age.work_year_max) {
					obj.conditions.age.work_year_max = this.formData.age.work_year_max;
				}
			}
			this.formData.sale_master_single ? obj.conditions.rank.rank_ids = this.formData.rank_ids : '';
			this.formData.depart_name_single ? obj.conditions.position.position_ids = this.formData.position_ids : '';
			this.$request({
				url: API_ROOT._ACADEMY_COMMON_SELECT_STAFF_CONDITION_GET,
				type: 'POST',
				param: obj,
				loading: false
			}).then((res) => {
				let val = {
					staff: res.data,
					condition: this.formData
				};
				this.$emit('sure', val);
			}).catch((error) => {});
		},
		handleCancel() {
			this.$emit('close');
		}
	}
};
export const ConditionModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.v-academy-condition-modal {
	.ivu-form-item {
		margin-bottom: 10px !important;
	}
}
</style>