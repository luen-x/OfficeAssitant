<template>
	<div>
		<i-modal
			ref="modal"
			v-model="visible"
			:width="400"
			:loading="true"
			:mask-closable="false"
			:footer-hide="true"
			class="hr-service-quality-evalute-confirm"
			@on-ok="handleOk"
			@on-cancel="handleCancel"
		>
			<div slot="header" class="g-tc">
				{{ title }}
			</div>
			<div>

				<template v-if="rowName=='integral_index'">
					<div
						class="g-operation g-fr"
						@click="handleHistory">
						{{ historyCount }}历史评定条数 <i class="iconfont icon-right g-fs-14"/>
					</div>
					<div class="g-c-black2 g-m-l-30 g-m-t-20 ">
						回款金额：{{ detail.return_amount }}万
					</div>
					<div class="g-c-black2 g-m-l-30 g-m-t-20 " >
						代理人数：{{ detail.agent_num }}人
					</div>
				</template>
				<template v-else>
					<div class="g-c-black2 g-m-l-30 g-m-t-20 " >
						服务项：{{ detail.service_name||detail.satisfaction_name }}
					<!-- <template v-if="name === 'confirm'">
						(<span class="g-c-red-mid">{{ detail.service_times }}次</span>)
					</template> -->
					</div>
				</template>
				<div v-if="detail.resource!=2" class="g-m-l-30 g-m-t-20 g-flex">
					<span class="g-inline-block">服务凭证：</span>
					<oa-imgae-preview :data-source="(resume || []).map(item => ({url: item.url}))"/>
				</div>
				<div class="g-m-l-30 g-m-t-20 g-flex">
					<span> {{ detail.resource==2?"立客户备注":'销售备注' }}：</span>
					<span class="g-inline-block" style="width: 250px;">{{ detail.remarks }}</span>
				</div>
			</div>
			<i-form
				ref="form"
				:model="form"
				:rules="rule"
				:label-width="100"
				class="g-m-t-20"
			>
				<i-form-item v-if=" (rowName!='integral_index') && (rowName !='satisfaction_index')" label="服务次数：" prop="service_times">
					<i-input-number
						v-model="form.service_times"
						:disabled="allPass"
						:min="1"
						:precision="0"
						:max="100"
						style="width: 220px;"
					/>
				</i-form-item>
				<i-form-item label="评定结果：" prop="check_result">
					<i-radiogroup v-model="form.check_result" @on-change="handleChangeResult">
						<i-radio :disabled="!flag && is_expire == 1 ? true : false" label="1">
							<span>通过</span>
						</i-radio>
						<i-radio :disabled="!flag && is_expire == 1 ? true : false" label="2">
							<span>驳回</span>
						</i-radio>
					</i-radiogroup>
				</i-form-item>
				<i-form-item v-if ="form.check_result === '2'" key="audit_mark" label="驳回原因：" prop="audit_mark">
					<oa-limit-words
						v-model="form.audit_mark"
						:max="200"
						placeholder="请输入驳回原因"
						width="220px"
					/>
				</i-form-item>
				<i-form-item v-else-if="rowName!='service_audit'&&within_system==1" key="point" label="评定积分：" prop="point">
					<i-input-number
						v-model="form.point"
						:precision="1"
						:active-change="false"
						style="width: 220px;"
					/>
				</i-form-item>
			</i-form>
			<div v-if="flag" class="_footer">
				<i-button type="text" @click="handleCancels">取消</i-button>
				<i-button type="primary" @click="handleContinue">{{ buttonText }}</i-button>
			</div>
		</i-modal>
	</div>
</template>

<script>
import { Modal, Progress, Button, Form, FormItem, RadioGroup, Radio, InputNumber } from 'iview';
import { CreatePortal, FilesPicker } from 'wya-vc';
import API_ROOT from '@stores/apis/root';
import LimitWords from '@components/_common/limit-words/limit-words';
import ImagePreview from '@components/hr/_common/image-preview';
import { isArray } from 'util';
import { HistoryRecord } from './history-record';

export default {
	name: 'hr-service-evaluate-confirm-modal',

	components: {
		'i-modal': Modal,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-button': Button,
		'oa-limit-words': LimitWords,
		'i-radiogroup': RadioGroup,
		'i-radio': Radio,
		'i-input-number': InputNumber,
		'oa-imgae-preview': ImagePreview
	},

	props: {
		flag: Boolean,
		edit: Boolean,
		arr: Array,
		title: {
			type: String,
			default: '评定'
		},
		params: [Object, Array],
		rowName: String,
		within_system: [String, Number],
		contract_company_id: [String, Number],
		handleRefresh: Function
	},

	data() {
		return {
			checkList: this.arr,
			historyCount: 0,
			sale: [],
			sc: [],
			name: this.rowName,
			currentRow: this.params.row ? this.params.row : this.params,
			visible: false,
			resume: [],
			form: {
				check_result: '1',
				audit_mark: "",
				service_times: null,
				point: null,
			},
			rule: {
				check_result: [{
					required: true,
					message: "请选择评定结果",
					trigger: "change"
				}],
				service_times: [{
					type: 'number',
					required: true,
					message: "服务次数是必填的",
					trigger: "change"
				}],
				audit_mark: [{
					required: true,
					message: "驳回原因是必填的",
					trigger: "blur"
				}],
				point: [{
					type: 'number',
					required: true,
					message: "评定积分分是必填的",
					trigger: "blur"
				}]
			},
			detail: {},
			key: null,
			is_expire: ""
		};
	},
	computed: {
		buttonText() {
			if (Array.isArray(this.currentRow) && !this.edit) {
				return '整体评定';
			} else if (this.checkList.length > 1 && !this.edit) {
				return this.rowName != 'service_audit' && this.within_system == 1 ? "确定并继续评分" : '确定并继续';
			} else {
				return '确定';
			}
		},
		allPass() {
			return Array.isArray(this.currentRow) || (!!this.params.row.group_first_record_id);// 整体评定
		},
		api() {
			if (this.edit) {
				return this.rowName == 'service_audit' ? '_HR_EMPLOYEE_SCORE_SERVICE_EXAMINE_CHECK_GET' : '_HR_EMPLOYEE_SCORE_INTEGRATION_EDIT_POST';
			} else {
				return this.rowName == 'service_audit' ? '_HR_EMPLOYEE_SCORE_SERVICE_EXAMINE_CHECK_GET' : '_HR_EMPLOYEE_SCORE_INTEGRATION_GRADE_POST';
			}
		}
	},
	mounted() {
		this.loadData(this.params.row || this.currentRow);
		this.visible = true;

	},
	methods: {
		handleChangeResult() {
			this.form.audit_mark = '';
			this.form.point = null;
		},
		// 服务审核需要换接口
		handleHistory() {
			HistoryRecord.popup({
				sale: this.sale,
				sc: this.sc
			}).then().catch();
		},
		loadData(obj) {
			this.rowName == 'integral_index' && this.loadHistory();
			this.resume = [];
			if (this.edit && this.allPass) {
			 this.currentRow = this.checkList.filter(ele => {
					return ele.group_first_record_id == this.params.row.group_first_record_id;
				});
				const [list] = this.currentRow;
				Object.keys(this.form).forEach(key => {
					this.form[key] = this.params.row[key];
				});
				 this.form.point = this.form.point ? parseFloat(this.form.point, 1) : null;
				this.form.check_result = list.service_status == 2 || list.service_status == 4 ? "1" : "2";
			}
			if (Array.isArray(this.currentRow)) {
				let fileImage = [];
				let remarks = '';
				let service_times = 0;
				this.currentRow.forEach(ele => {
					fileImage = fileImage.concat(ele.fileImage);
					remarks = remarks + ele.remarks + ';';
					service_times += ele.service_times;
				});
				fileImage.forEach(item => {
					this.resume.push({
						url: item.img_url,
						title: item.img_url.split("/")[6],
						type: "." + item.img_url.split("/")[6].split(".")[1],
						uid: item.img_url,
						file_id: item.relation_id
					});
				});
				this.detail = {
					service_name: this.currentRow[0].service_name,
					service_times,
					remarks
				};
				this.form.service_times = this.detail.service_times || null;
			} else {
				obj.fileImage && obj.fileImage.forEach(item => {
					this.resume.push({
						url: item.img_url,
						title: item.img_url.split("/")[6],
						type: "." + item.img_url.split("/")[6].split(".")[1],
						uid: item.img_url,
						file_id: item.relation_id
					});
				});
				this.is_expire = obj.is_expire;
				if (obj.service_status > 1) {
					Object.keys(this.form).forEach(key => {
						this.form[key] = obj[key];
					});
					this.form.check_result = obj.service_status == 2 || obj.service_status == 4 ? "1" : "2";
					this.form.point = this.form.point && parseFloat(this.form.point, 1);
				}
				this.form.service_times = obj.service_times || null;
				this.detail = obj;
			}
		},
		loadHistory() {
			this.$request({
				url: '_HR_EMPLOYEE_SCORE_INTEGRATION_AMOUNT_HISTORY_POST',
				type: "get",
				loading: false,
				param: {
					contract_company_id: this.currentRow.contract_company_id,
				}
			}).then(res => {
				const { sale, sc } = res.data;
				this.sale = sale;
				this.sc = sc;
				this.historyCount = sale.length + sc.length;
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},
		handleOk() {
		// 	this.$refs.form.validate((valid) => {
		// 		if (valid) {
		// 			let record_id = (this.name === "confirm" ? this.params.row.record_id : this.params.row.integral_index_id);

		// 			this.handleSave(record_id, true);
		// 		} else {
		// 			this.$refs.modal.buttonLoading = false;
		// 		}
		// 	});
		},

		handleSave(flag) {
			const rule_type = {
				basic_point_audit: 14, // 基础服务
				consult_point_audit: 15, // 咨询服务
				integral_index: 16, // 基础服务
				satisfaction_index: 17, // 基础服务
			};
			let record_id = this.currentRow.record_id || '';
			if (this.name == 'satisfaction_index') { record_id = this.currentRow.satis_id; }
			if (this.name == 'integral_index') { record_id = this.currentRow.integral_index_id; }
			let service_record_id = Array.isArray(this.currentRow) ? this.currentRow.map(ele => ele.record_id)
				: [record_id];
			this.$request({
				url: this.api,
				type: "POST",
				param: {
					...this.form,
					rule_type: rule_type[this.rowName],
					record_id,
					contract_company_id: this.contract_company_id,
					is_range: this.within_system,
					service_record_id: Array.isArray(this.currentRow) ? this.currentRow.map(ele => ele.record_id)
						: [record_id]
				}
			}).then(res => {
				this.$Message.success(res.msg);
				let key = {
					satisfaction_index: 'satis_id',
					integral_index: 'integral_index_id',
					basic_point_audit: 'record_id',
					service_audit: 'record_id',
					consult_point_audit: 'record_id'
				};
				if (this.checkList.length > 1 && !this.edit) {
					this.checkList = this.checkList.filter(row => { return row[key[this.name]] != this.currentRow[key[this.name]]; });
					this.currentRow = this.checkList[0];
					this.form.check_result = '1';
					this.form.audit_mark = '';
					this.form.service_times = null;
					this.form.point = null;
					this.handleRefresh();
					this.loadData(this.currentRow);
					this.visible = true;
				} else {
					this.$emit("sure", true);
					this.visible = false;
				}
			}).catch(error => {
				this.$Message.error(error.msg);
				this.$refs.modal.buttonLoading = false;
				this.visible = true;
			});
		},

		handleCancel() {
			this.$emit('close');
		},

		handleCancels() {
			this.$emit('close');
			// this.handleRefresh(this.name);
		},

		handleError(err) {
			this.$Message.warning(err.msg);
		},

		// 评定并继续
		handleContinue() {
			this.$refs.form.validate((valid) => {
				if (valid) {
					this.handleSave(true);
					// if (this.count === 0) {
					// 	this.count++;
					// 	let record_id = (this.name === "confirm" ? this.params.row.record_id : this.params.row.integral_index_id);
					// 	if (this.arr.length === 1) {
					// 		this.handleSave(record_id, true);
					// 	} else {
					// 		this.handleSave(record_id, false);
					// 	}
					// } else {
					// 	this.count++;
					// 	let record_id = (this.name === "confirm" ? this.arr[this.key].record_id : this.arr[this.key].integral_index_id);

					// 	if (this.count === this.arr.length) {
					// 		this.handleSave(record_id, true);
					// 	} else {
					// 		this.handleSave(record_id, false);
					// 	}
					// }
				} else {
					this.$refs.modal.buttonLoading = false;
				}
			});
		}
	}
};

export const EvaluteConfirmModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.hr-service-quality-evalute-confirm {
	._footer{
		height: 72px;
		line-height: 72px;
		text-align: right;
	}

	.hr-image-preview{
		max-width: 278px;
	}
}
</style>