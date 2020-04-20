<template>
	<i-form
		ref="form"
		:model="formValidate"
		:rules="ruleValidate"
		:label-width="100"
		class="v-administration-matter-sea-info-form">

		<div
			:class="edit ? 'g-m-t-20' : ''"
			class="_basic-info g-flex g-fw-w g-jc-sb">
			<oa-form-item
				:disabled="disabled"
				:value="info.staff_name"
				label="申请人"
				prop="staff_name"
			>
				<i-input
					v-model="formValidate.staff_name"
					:disabled="true"
					:maxlength="200"
					style="width: 300px"
				/>
			</oa-form-item>
			<oa-form-item
				:disabled="disabled"
				:value="info.apply_nature_name"
				label="申请性质"
				prop="apply_nature"
			>
				<i-radio-group v-model="formValidate.apply_nature" style="width: 300px;">
					<i-radio :label="1" disabled>部门</i-radio>
					<i-radio :label="0" disabled>个人</i-radio>
				</i-radio-group>
			</oa-form-item>
			<oa-form-item
				v-if="formValidate.apply_nature == 1"
				:disabled="disabled"
				:value="info.apply_depart_name"
				label="申请部门"
			>
				<i-input
					v-model="formValidate.apply_depart_name"
					:disabled="true"
					:maxlength="200"
					style="width: 300px"
				/>
			</oa-form-item>
			<oa-form-item
				:disabled="disabled"
				:value="info.event_type_name"
				label="事项类型"
				prop="event_type_name"
			>
				<i-input
					v-model="formValidate.event_type_name"
					:disabled="true"
					:maxlength="200"
					style="width: 300px"
				/>
			</oa-form-item>
			<oa-form-item
				:disabled="disabled"
				:value="info.head_staff_name"
				label="总负责人"
				prop="head_staff_id"
			>
				<i-input
					v-if="info.is_edit != 1"
					:disabled="true"
					v-model="formValidate.head_staff_name"
					style="width: 300px;"/>
				<i-select
					v-if="info.is_edit == 1"
					ref="head_staff"
					v-model="formValidate.head_staff_id"
					:remote-method="loadHeadStaff"
					:loading="headStaffLoading"
					style="width: 300px;"
					filterable
					remote
					clearable
					transfer
					label-in-value
					placeholder="请填写并选择总负责人"
					@on-change="handleChange($event, 'head_staff')"
					@on-query-change="handleQueryChange($event, 'head_staff')"
				>
					<i-option
						v-for="(item, index) in headStaffData"
						:key="index"
						:value="item.value"
					>{{ item.label }}</i-option>
				</i-select>
			</oa-form-item>
			<oa-form-item
				:disabled="disabled"
				:value="info.expected_completion_time"
				label="期待完成日期"
				prop="expected_completion_time"
			>
				<i-date-picker
					:value="formValidate.expected_completion_time"
					:disabled="true"
					type="datetime"
					clearable
					transfer
					format="yyyy-MM-dd HH:mm"
					style="width: 300px;"
				/>
			</oa-form-item>
			<oa-form-item
				:disabled="disabled"
				:value="info.create_time"
				label="申请日期"
				prop="create_time"
			>
				<i-date-picker
					:value="formValidate.create_time"
					:disabled="true"
					type="date"
					clearable
					transfer
					style="width: 300px;"
				/>
			</oa-form-item>
			<oa-form-item
				:disabled="disabled"
				:value="info.priority"
				:custom="true"
				label="优先级"
				prop="priority"
			>
				<i-select
					v-if="!disabled"
					v-model="formValidate.priority"
					transfer
					clearable
					style="width: 300px;">
					<i-option
						v-for="item in priorityList"
						:value="item.value"
						:label="item.label"
						:key="item.value">
						<div
							:style="{color: '#fff', backgroundColor: `${colors[item.value - 1]}`}"
							style="width: 16px;height: 16px;textAlign: center;display: inline-block;"
							class="g-m-r-10 g-br-sem g-lh-16">
							{{ item.value }}
						</div>
						<span>{{ item.label }}</span>
					</i-option>
				</i-select>
				<div v-else style="width: 300px;">
					<div
						:style="{color: '#fff', backgroundColor: `${colors[info.priority - 1]}`}"
						style="width: 16px;height: 16px;textAlign: center;display: inline-block;"
						class="g-m-r-10 g-br-sem g-lh-16 ">
						{{ info.priority }}
					</div>
					<span>{{ info.priority_name }}</span>
				</div>
			</oa-form-item>
			<oa-form-item
				:disabled="disabled"
				:value="info.completion_rate"
				:custom="true"
				label="事项进度"
				prop="completion_rate"
			>
				<div style="width: 300px">
					<i-slider
						v-if="!disabled"
						:disabled="type === 'basic' || type == 1"
						v-model="formValidate.completion_rate"/>
					<span v-else>{{ info.completion_rate }}%</span>
				</div>
			</oa-form-item>
			<oa-form-item
				:disabled="disabled"
				:value="info.event_theme"
				label="事项主题"
				prop="event_theme"
			>
				<i-input
					v-model="formValidate.event_theme"
					:disabled="true"
					:maxlength="200"
					style="width: 300px"
				/>
			</oa-form-item>
		</div>
		<oa-form-item
			:disabled="disabled"
			:value="info.participant_infos"
			:custom="true"
			label="参与人员"
			prop="participant_infos"
			style="width: 405px;"
		>
			<div style="width: 300px">
				<div v-if="!disabled" class="g-flex g-fw-w g-ai-c _take-part">
					<div
						v-for="(item, index) in formValidate.participant_infos"
						:key="index"
						class="g-flex g-ai-c g-m-r-10 g-m-b-5">
						<div class="_avator g-m-r-5">
							<img v-if="item.head_img" :src="item.head_img" alt="头像">
						</div>
						<div class="_name">{{ item.staff_name }}</div>
						<div
							class="g-fs-24 g-m-l-5 g-pointer"
							style="color: #999;marginBottom: 5px"
							@click="handleDeleteStaff(item)">×</div>
					</div>
					<i
						v-if="!showInput && formValidate.participant_infos && formValidate.participant_infos.length < 50"
						:style="{marginTop: (formValidate.participant_infos && formValidate.participant_infos.length != 0) ? '-5px' : ''}"
						class="iconfont icon-add1 g-fs-20 g-c-blue-mid"
						style="marginTop: -5px;"
						@click="showInput = !showInput" />
					<i-select
						v-else-if="showInput && formValidate.participant_infos && formValidate.participant_infos.length < 50"
						ref="part_staff"
						:value="formValidate.part_staff_id"
						:remote-method="loadPartStaff"
						:loading="partStaffLoading"
						style="width: 220px;"
						filterable
						remote
						clearable
						transfer
						label-in-value
						placeholder="请输入员工关键字进行搜索"
						@on-change="handleChange($event, 'part_staff')"
						@on-query-change="handleQueryChange($event, 'part_staff')"
					>
						<i-option
							v-for="(item, index) in partStaffData"
							:key="index"
							:value="item.value"
						>{{ item.label }}</i-option>
					</i-select>
				</div>
				<span v-else>
					<span v-if="info.participant_infos && info.participant_infos.length === 0">--</span>
					<span v-else>
						<span v-for="(item, index) in info.participant_infos" :key="index">
							{{ item.staff_name }}{{ index !== info.participant_infos.length - 1 ? '，' : '' }}
						</span>
					</span>
				</span>
			</div>
		</oa-form-item>
		<oa-form-item
			:disabled="disabled"
			:value="info.detail"
			label="详细说明"
			prop="detail"
			style="width: 405px;"
		>
			<i-input
				v-if="!disabled"
				v-model="formValidate.detail"
				:disabled="true"
				:maxlength="200"
				:rows="4"
				type="textarea"
				style="width: 300px"
			/>
		</oa-form-item>
		<oa-form-item
			v-if="type == 2 || type == 3 || type == 4"
			:disabled="disabled"
			:custom="true"
			:value="info.dispose_reasons"
			label="处理说明"
			prop="dispose_reason"
			style="width: 405px;"
		>
			<i-input
				v-if="!disabled"
				v-model="formValidate.dispose_reasons"
				:disabled="true"
				:maxlength="200"
				:rows="4"
				type="textarea"
				style="width: 300px"
			/>
			<div v-else style="width: 300px">
				<span v-if="info.dispose_reasons && info.dispose_reasons.length === 0">--</span>
				<span v-for="(item, index) in info.dispose_reasons" v-else :key="index">
					{{ item }}
					<br >
				</span>
			</div>
		</oa-form-item>
		<oa-form-item
			:disabled="disabled"
			:custom="true"
			label="上传附件"
			prop="image_url"
			style="width: 405px;"
		>
			<div
				v-if="formValidate.image_url && formValidate.image_url.length != 0"
				style="width: 300px"
				class="g-flex g-fw-w">
				<!-- <div
					v-for="(item, index) in formValidate.image_url"
					:key="index"
					class="_image g-m-r-10 g-m-b-10">
					<img :src="item" alt="附件">
				</div> -->
				<vc-imgs-preview
					:data-source="formValidate.image_url"
					@open="handleOpen"
					@close="handleClose" />
			</div>
			<span v-else>--</span>
		</oa-form-item>
	</i-form>
</template>


<script>
import API_ROOT from "@stores/apis/root";
import {
	Form, FormItem, Input, InputNumber, RadioGroup, Radio,
	Select, Option, DatePicker, Cascader, Message, Slider
} from 'iview';
import { CreatePortal, ImgsPreview } from 'wya-vc';
import Upload from '@components/_common/upload/upload';
import { services, searchManager, searchPKStaff } from '@stores/services/administration';
import formItem from '../_common/form-item';

export default {
	name: 'oa-info',
	components: {
		'i-form': Form,
		'i-form-item': FormItem,
		'i-input': Input,
		'i-input-number': InputNumber,
		'i-select': Select,
		'i-option': Option,
		'i-date-picker': DatePicker,
		'i-cascader': Cascader,
		'i-radio-group': RadioGroup,
		'i-radio': Radio,
		'i-slider': Slider,
		'oa-form-item': formItem,
		'vc-imgs-preview': ImgsPreview,
	},
	mixins: [
		services.priorityList(),
		searchManager({ key: 'headStaff' }),
		searchPKStaff({ key: 'partStaff' })
	],
	props: {
		edit: Boolean,
		info: Object,
		type: Boolean | String
	},
	data() {
		return {
			showInput: false,
			headStaff: '',
			partStaff: '',
			colors: ['#d71319', '#d83615', '#db7c12', '#dcbe1a', '#a8dc1a'],
			formValidate: {
				head_staff_id: null
			},
			ruleValidate: {
				head_staff_id: [{ required: true, message: '请填写总负责人', pattern: /.+/, trigger: "change" }],
				priority: [{ required: true, message: '请选择优先级', pattern: /.+/, trigger: "change" }],
				participant_infos: [{ required: true, message: '请选择参与人', type: 'array', trigger: "change" }]
			}
		};
	},
	computed: {
		disabled() {
			return !this.edit;
		}
	},
	mounted() {
		// 初始化form对象
		if (Object.keys(this.info).length != 0) {
			this.headStaff = this.info.head_staff_name;
			this.formValidate = {
				...this.info,
				participant_infos: [...this.info.participant_infos],
				dispose_reasons: this.info.dispose_reasons.join(' \r\n ')
			};
		}
	},
	methods: {
		// 删除参与人
		handleDeleteStaff(staff) {
			let index = this.formValidate.participant_infos.findIndex(item => item.staff_id == staff.staff_id);
			this.formValidate.participant_infos.splice(index, 1);
		},
		// 员工
		handleChange(obj, type) {
			this.formValidate[`${type}_id`] = obj && obj.value ? obj.value : '';
			this.formValidate[`${type}_name`] = obj && obj.label ? obj.label : '';
			if (type === 'part_staff' && obj && obj.value) {
				if (this.formValidate.participant_infos.findIndex(item => item.staff_id == obj.value) != -1) {
					this.$Message.warning('该员工已选，请重新选择');
				} else {
					this.showInput = false;
					let staff = this.partStaffData.find(item => item.staff_id == obj.value);
					this.formValidate.participant_infos.push({ ...staff });
					this.formValidate.part_staff_id = '';
					this.formValidate.part_staff_name = '';
				}
			}
		},
		handleQueryChange(query = '', type) {
			let targetQuery = this.formValidate[`${type}_name`] || '';
			if (targetQuery.length > query.length) {
				this.$refs[`${type}`].clearSingleSelect();
			}
		},
		handleOpen() {
			this.$vc.emit('ORDER_MODAL_ENABLE', { enable: false });
		},
		handleClose() {
			this.$vc.emit('ORDER_MODAL_ENABLE', { enable: true });
		}
	}
};
</script>

<style lang="scss">
.v-administration-matter-sea-info-form {
	._take-part {
		._avator {
			width: 36px;
			height: 36px;
			border-radius: 50%;
			border: 1px solid #e6e6e6;
			img {
				width: 100%;
				height: 100%;
				border-radius: 50%;
			}
		}
	}
	._image {
		width: 70px;
		height: 70px;
		border: 1px solid #e6e6e6;
		img {
			width: 100%;
			height: 100%;
		}
	}
}
</style>
