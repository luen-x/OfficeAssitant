<template>
	<div>
		<i-modal
			ref="modal"
			v-model="visible"
			:loading="true"
			:mask-closable="false"
			:title="title"
			width="400"
			@on-ok="handleOk"
			@on-cancel="handleCancel"
		>
			<i-form
				ref="formValidate"
				:model="formValidate"
				:rules="ruleValidate"
				:label-width="120"
				class="g-m-t-20"
			>
				<i-form-item v-if="action==='add'" label="需求职位:" prop="position_id">
					<i-select
						v-model="formValidate.position_id"
						:style="{ width: '80%' }"
						clearable
						filterable
						transfer
						placeholder="请选择需求职位"
					>
						<i-option
							v-for="(item, index) in positionArr"
							:key="index"
							:value="item.position_id"
						>{{ item.position_name }}</i-option>
					</i-select>
				</i-form-item>
				<i-form-item label="需求人数:" prop="need_number">
					<i-input-number
						v-model="formValidate.need_number"
						:max="999"
						:min="1"
						:style="{ width: '80%' }"
						placeholder="请输入需求人数"
					/>
				</i-form-item>
				<i-form-item label="招聘需求:" prop="staff_standard">
					<oa-limit-words
						v-model="formValidate.staff_standard"
						:max="200"
						:style="{ width: '80%' }"
						placeholder="请输入招聘需求"
					/>
				</i-form-item>
			</i-form>
		</i-modal>
	</div>
</template>

<script>
import {
	Modal,
	Form,
	FormItem,
	Input,
	InputNumber,
	Select,
	Option,
	Button
} from "iview";
import lodash from "lodash";
import { CreatePortal } from "wya-vc";
import API from "@stores/apis/root";
import { getParseUrl, getHashUrl, initTreeData, getItem } from '@utils/utils';
import LimitWords from "@components/_common/limit-words/limit-words";

export default {
	name: "hr-add-customer-modal",
	components: {
		"i-modal": Modal,
		"i-input": Input,
		"i-input-number": InputNumber,
		"i-select": Select,
		"i-option": Option,
		"i-form": Form,
		"i-form-item": FormItem,
		"i-button": Button,
		"oa-limit-words": LimitWords
	},
	props: {
		title: String,
		action: String,
		info: Object,
	},
	data() {
		return {
			visible: false,
			positionArr: [],
			staff: "",
			formValidate: {
				staff_standard: (this.info && this.info.staff_standard) || "",
				need_number: (this.info && this.info.need_number) || null,
				position_id: (this.info && this.info.position_id) || "",
			},
			ruleValidate: {
				need_number: [
					{
						required: true,
						message: "需求人数为必填",
						type: 'number',
						trigger: "blur"
					}
				],
				position_id: [
					{
						required: true,
						type: "number",
						message: "请选择需求职位",
						trigger: "change"
					}
				],
				staff_standard: [
					{
						required: true,
						message: "招聘需求为必填",
						pattern: /.+/,
						trigger: "blur"
					}
				]
			}
		};
	},
	computed: {},
	mounted() {
		this.visible = true;
		this.loadPositionData();
	},
	methods: {
		loadPositionData() {
			this.$request({
				url: API._HR_RECRUIT_SOCIAL_POSITION_ANALYZE_FIND_GET,
				type: "GET",
				param: {}
			}).then(res => {
				this.positionArr = res.data;
			}).catch(err => {});
		},
		
		handleOk: lodash.debounce(function (event) {
		// handleOk() {
			this.$refs.formValidate.validate(valid => {
				if (valid) {
					this.$request({
						url: API._HR_RECRUIT_SOCIAL_POSITION_ANALYZE_ADD_GET,
						type: "GET",
						param: {
							...this.formValidate,
							depart_id: this.info && this.info.depart_id,
						},
					}).then(res => {
						this.visible = false;
						this.$Message.success(res.msg);
						this.$emit("sure", true);
					}).catch(error => {
						this.$Message.error(error.msg);
						this.$refs.modal.buttonLoading = false;
					});
				} else {
					this.$refs.modal.buttonLoading = false;
				}
			});
		}, 0),
		handleCancel() {
			this.visible = false;
			this.$emit("close");
		}
	}
};

export const AuditModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
</style>


