<template>
	<div>
		<i-drawer
			ref="drawer"
			:mask="false"
			:mask-closable="false"
			:styles="styles"
			v-model="visible"
			:loading="true"
			:before-close="handleBeforeClose"
			title="统一面试"
			width="720"
			class="v-hr-recruit-school-summary-interview g-fs-14"
			@on-close="handleClose"
		>
			<i-form 
				ref="formValidate" 
				:model="formValidate" 
				:label-width="100"
				@submit.native.prevent>
				<i-row>
					<i-col 
						v-for="(item, i) in formValidate.list"
						:key="item.applicant_id"
						class="g-m-b-15"
						span="12"
					>
					
						<i-form-item label="应聘者：">
							{{ item.applicant_name }}
						</i-form-item>

						<i-form-item label="备注：" style="margin-top: -10px">
							<oa-limit-words
								v-model="formValidate.list[i].remark" 
								:max="200" 
								width="300px"
								placeholder="请输入备注"
							/>
						</i-form-item>

						<i-form-item label="审核结果：">
							<i-select
								v-model="formValidate.list[i].interview_result"
								clearable
								transfer
								style="width: 300px"
								placeholder="请填写面试结果"
							>
								<i-option
									v-for="(status, i) in STATUS"
									:key="i"
									:value="i + 1"
								>{{ STATUS[i] }}</i-option>
							</i-select>
						</i-form-item>
					</i-col>	
				</i-row>
				
			</i-form>
		


			<div class="_footer">
				<i-button
					type="primary"
					class="g-m-l-20"
					@click="handleSubmitOrTransfer(1)"
				>
					提交并转移
				</i-button>

				<i-button
					type="default"
					class="g-m-l-10"
					@click="handleSubmitOrTransfer(0)"
				>
					提交
				</i-button>
			</div>
		</i-drawer>
	</div>
</template>
<script>
import { Button, Drawer, Input, Form, FormItem, Select, Option, Col, Row } from "iview";
import { CreatePortal } from "wya-vc";
import Loading from '@components/_common/loading/loading';
import API_ROOT from '@stores/apis/root';
import { Confirm } from '@common/confirm/confirm';

const STATUS = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-'];

export default {
	name: "oa-hr-recruit-school-summary-interview",
	components: {
		"i-button": Button,
		"i-drawer": Drawer,
		'oa-loading': Loading,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-option': Option,
		'i-select': Select,
		'i-col': Col,
		'i-row': Row
	},
	props: {
		selected: {
			required: true,
			type: Array
		}
	},
	data() {
		return {
			STATUS,
			visible: false,
			styles: {
				height: "calc(100% - 55px)",
				overflow: "hidden",
				paddingBottom: "100px",
				position: "static"
			},
			formValidate: {
				list: this.handleFormvalidateData()
			}
		};
	},
	beforeCreate() {
		this.Button = Button;
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleClose() {
			this.$emit('close');
		},
		handleBeforeClose() {
			if (this.$refs.drawer.$el.getElementsByTagName('form').length) {
				return Confirm.popup({
					msg: '离开后刚刚辛辛苦苦修改的数据将会丢失，你还要继续操作吗？',
					title: '温馨提示'
				}).then(res => {
				}).catch(() => {
					return new Promise(() => {});
				});
			}
		},
		handleFormvalidateData() {
			return this.selected.map(v => ({
				applicant_id: v.applicant_id,
				interview_result: v.interview_result,
				remarks: '',
				applicant_name: v.applicant_name,
			}));
		},
		handleSubmitOrTransfer(is_transfer) {
			this.$request({
				url: '_HR_RECRUIT_SCHOOL_UNIFY_INTERVIEW_POST',
				type: "POST",
				param: {
					is_transfer,
					info: this.formValidate.list
				}
			}).then((res) => {
				this.$Message.success(res.msg);
				this.$emit("sure", true);
				this.visible = false;
			}).catch(err => {
				console.error(err);
				this.$Message.error(err.msg);
			});
		},
	}
};
export const InterviewDrawer = CreatePortal({
	alive: true
}, module.exports.default);
</script>
<style lang="scss">
.v-hr-recruit-school-summary-interview {
	._footer {
		width: 100%;
		position: absolute;
		background-color: #fff;
		left: 0;
		bottom: 0;
		height: 60px;
		line-height: 60px;
		box-shadow: 0 -2px 9.9px 0.1px rgba(0, 0, 0, 0.08);
	}
	.ivu-drawer-body {
		overflow: auto !important;
        padding: 20px;
	}
}
</style>

