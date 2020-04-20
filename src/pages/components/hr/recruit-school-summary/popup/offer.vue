<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		ok-text="预览"
		class="g-flex"
		width="400"
		@on-ok="handleOk"
		@on-cancel="handleCancel">

		<div slot="header" class="g-tc">
			发offer
		</div>

		<div>
			<i-form
				ref="offerForm"
				:model="offerForm"
				:rules="offerRule"
				:label-width="90"
				class="g-m-lr-20">
				<i-form-item label="附件样式：" prop="offer_id">
					<i-select
						v-model="offerForm.offer_id"
						style="width: 220px;"
						clearable
						transfer
						placeholder="请选择附件样式"
					>
						<i-option
							v-for="(item, index) in offerData"
							:key="index"
							:value="item.offer_id"
						>{{ item.offer_name }}</i-option>
					</i-select>
				</i-form-item>
				<i-form-item label="聘用职位：" prop="position_id">
					<i-select
						v-model="offerForm.position_id"
						style="width: 220px;"
						clearable
						transfer
						placeholder="请选择聘用职位"
					>
						<i-option
							v-for="(item, index) in positionData"
							:key="index"
							:value="item.position_id"
						>{{ item.position_name }}</i-option>
					</i-select>
				</i-form-item>
				<i-form-item label="试用期：" prop="try_time">
					<i-select
						v-model="offerForm.try_time"
						style="width: 220px;"
						clearable
						transfer
						placeholder="请选择试用期"
					>
						<i-option
							v-for="(item, index) in offerProbation"
							:key="index"
							:value="item.value"
						>{{ item.value }}</i-option>
					</i-select>
				</i-form-item>
				<i-form-item label="发函时间：" prop="letter_time">
					<i-date-picker
						v-model="offerForm.letter_time"
						type="date"
						clearable
						transfer
						placeholder="请选择发函时间"
						style="width: 220px"
						@on-change="handleOfferTime"/>
				</i-form-item>
				<i-form-item label="有效期限：" >
					<!-- <i-input
						v-model="offerForm.valid_date"
						placeholder="请选择有效期限"
						style="width: 220px"
						disabled/> -->
					<i-date-picker
						v-model="offerForm.valid_date"
						type="date"
						clearable
						transfer
						placeholder="请选择有效期限"
						style="width: 220px"
						@on-change="handleValidDate"/>
				</i-form-item>
			</i-form>
		</div>

	</i-modal>
</template>

<script>
import moment from 'moment';
import API_ROOT from "@stores/apis/root";
import { CreatePortal, Copy } from "wya-vc";
import {
	Cascader,
	Modal,
	Input,
	Select,
	Option,
	Form,
	FormItem,
	DatePicker
} from "iview";

export default {
	name: "hr-recruit-school-summary-offer",
	components: {
		"i-modal": Modal,
		"i-input": Input,
		"i-select": Select,
		"i-option": Option,
		"i-form": Form,
		"i-cascader": Cascader,
		"i-form-item": FormItem,
		"i-date-picker": DatePicker,
		"vc-copy": Copy
	},
	// mixins: [searchOffer({ type: 2 })],
	props: {
		data: Object
	},
	data() {
		return {
			visible: false,
			offerProbation: [ // 黄苏伟要求这么设计
				{
					label: "3~6个月",
					value: "3~6个月",
				},
				{
					label: "1~3个月",
					value: "1~3个月",
				}
			],
			offerData: [],
			offerForm: {
				letter_time: new Date(),
				valid_date: '',
				try_time: "3~6个月",
				position_id: null,
			},
			offerRule: {
				offer_id: [{ required: true, message: "请选择附件样式", pattern: /.+/, trigger: "change" }],
				position_id: [{ required: true, type: 'number', message: "请选择聘用职位", trigger: "change" }],
				try_time: [{ required: true, message: "请输入试用期", trigger: "blur" }],
				letter_time: [{ required: true, message: "请选择发函时间", type: 'object', trigger: "change" }],
				valid_date: [{ required: true, message: "请选择有限期限", trigger: "change" }]
			},
			monthList: [
				{ label: '一个月', value: '一个月' },
				{ label: '两个月', value: '两个月' },
				{ label: '三个月', value: '三个月' },
				{ label: '四个月', value: '四个月' },
				{ label: '五个月', value: '五个月' },
				{ label: '六个月', value: '六个月' }
			],
			positionData: []
		};
	},
	computed: {},
	created() {
		this.visible = true;
		this.fetchOfferData();
		if (this.offerForm.letter_time) {
			this.offerForm.valid_date = moment(this.offerForm.letter_time).add(60, 'days').format('YYYY-MM-DD');
		}
		this.data.alternative_position_id 
			? this.positionData.push({ position_id: this.data.alternative_position_id, position_name: this.data.alternative_position_name })
			: '';
		this.data.position_id
			? this.positionData.push({ position_id: this.data.position_id, position_name: this.data.position_name })
			: '';
	},
	methods: {
		handleOfferTime(val) {
			// this.offerForm.valid_date = moment(val).add(60, 'days').format('YYYY-MM-DD');
		},
		handleValidDate(val) {
			this.offerForm.valid_date = moment(val).format('YYYY-MM-DD');
			// this.offerForm.valid_date = moment(val).add(60, 'days').format('YYYY-MM-DD');
		},
		handleOk() {
			/**
             * v-model会默认被触发，要由该组件控制，给组件i-modal传值 loading: true
             */
			this.$refs['offerForm'].validate(valid => {
				if (valid) {
					// 跳转发offer页面
					this.$emit('sure', this.offerForm);
				} else {
					this.$refs.modal.buttonLoading = false;
					this.$Message.warning('请按照提示完善表单信息');
				}
			});
		},
		handleCancel() {
			this.$emit("close");
		},
		fetchOfferData() {
			this.$request({
				url: API_ROOT['_HR_MODULE_GET'],
				type: 'GET',
				param: {
					type: 2
				},
				loading: false
			}).then((res) => {
				this.offerData = res.data;
			}).catch((error) => {
			});
		}
	}
};
export const offerPModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss" >
</style>
