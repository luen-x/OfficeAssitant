<template>
	<div class="v-hr-academy-train-detail-exam-audit-start g-m-b-15">
		<div class="g-c-black4">开启审核考试后，学员的考试情况将由审核结果决定。
		设置好审核事项后，学员将根据设置的事项提交审核材料。</div>
		<oa-title class="g-m-b-20 g-m-t-20">
			开启审核考试
		</oa-title>
		<div class="g-m-l-10">
			<i-form
				ref="auditForm"
				:label-width="120"
				class="_audit"
			>
				<i-form-item label="是否开启审核考试:">
					<i-radio-group v-model="is_audit" @on-change="handleChangeAudit">
						<i-radio label="1">是</i-radio>
						<i-radio label="0">否</i-radio>
					</i-radio-group>
				</i-form-item>
			</i-form>
			<div v-if="is_audit == '1'" class="_wrapper">
				<!-- <i-tooltip 
					class="__icon g-pointer" 
					content="保存并生效" 
					placement="bottom"
				>
					<i class="iconfont icon-duihaocheckmark17-copy" @click="handleSave"/>
				</i-tooltip> -->
				<i-form
					ref="form"
					:model="formData"
					:rules="formDataRule"
					:label-width="115"
				>
					<i-form-item label="设置审核事项:">
						<div class="g-c-black4">学员将根据设置的事项提交审核材料。（需要点击保存之后才能生效）</div>
						<i-form-item label="填写证明人:" prop="need_witness">
							<i-radio-group v-model="formData.need_witness">
								<i-radio :label="1">是</i-radio>
								<i-radio :label="0">否</i-radio>
							</i-radio-group>
						</i-form-item>
						<i-form-item label="审核凭证:" prop="need_voucher">
							<i-switch v-model="formData.need_voucher" :true-value="1" :false-value="0" size="small"/>
							<span class="g-m-l-10 g-c-black4 g-inline-block" style="line-height: 31px;height: 31px;">开启后，学员必须上传凭证，才能提交审核。</span>
						</i-form-item>
					</i-form-item>
					<i-form-item ref="relation" label="关联事项：" prop="label">
						<span class="g-c-blue-mid g-pointer" @click="hadleRelatedMaster()">关联事项</span>
						<span 
							v-if="formData.relation_type"
							class="g-nobreak"
						>{{ formData.label }}</span>
					</i-form-item>
					<i-button type="primary" class="g-m-t-10" style="margin-left: 114px;" @click="handleSave">保存</i-button>
				</i-form>
			</div>
		</div>
	</div>
</template>

<script>
import lodash from 'lodash';
import { Input, Button, Switch, Radio, RadioGroup, Form, FormItem, Tooltip, Message } from 'iview';
import { Expand } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
import Title from '@components/hr/academy-train-detail/_common/title';
import API_ROOT from '@stores/apis/root';
import { PModalRetatedMatter } from '@components/hr/academy-train-detail/_common/popup/related-matter';

export default {
	name: 'v-hr-academy-train-detail-exam-audit-start',
	components: {
		'i-input': Input,
		'i-button': Button,
		'vc-expand': Expand,
		'oa-title': Title,
		'i-switch': Switch,
		'i-radio': Radio,
		'i-radio-group': RadioGroup,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-tooltip': Tooltip
	},
	data() {
		return {
			is_audit: '',
			formData: {
				need_witness: 1,
				need_voucher: 1,
				label: '',
				relation_id: [],
				relation_type: ''
			},
			formDataRule: {
				need_witness: [{ required: true, type: 'number', message: '请选择是否填写证明人', trigger: 'change' }],
				need_voucher: [{ type: 'number', required: true, message: '请选择是是否选择凭证', trigger: 'change' }],
				label: [{ required: true, message: '请选择关联事项', trigger: 'change' }]
			}
		};
	},
	created() {
		this.loadData();
	},
	methods: {
		handleChangeAudit(e) {
			if (e == '0') {
				let obj = {
					project_id: this.$route.query.project_id,
					status: e
				};
				this.$request({
					url: API_ROOT['_HR_ACADEMY_TRAIN_DETAIL_EXAM_AUDIT_ADD_POST'], // eslint-disable-line
					type: "POST",
					param: obj
				}).then((res) => {
					this.$Message.success('关闭审核考试成功');
					this.$store.commit('HR_ACADEMY_TRAIN_DETAIL_PAPER_0_AUDIT_LIST_INIT');
				}).catch((error) => {
					this.$Message.error(error.msg);
				});
			}
		},
		loadData() {
			this.$request({
				url: API_ROOT['_HR_ACADEMY_TRAIN_DETAIL_PAPER_AUDIT_INFO_GET'], // eslint-disable-line
				type: "GET",
				param: {
					project_id: this.$route.query.project_id
				}
			}).then((res) => {
				this.is_audit = res.data.status + '';
				this.formData.need_voucher = res.data.need_voucher || 1;
				this.formData.need_witness = res.data.need_witness || 1;
				this.formData.relation_type = res.data.relation_type;
				res.data.relation_type == 1 ? this.formData.label = '关联项目'
					: this.formData.label = res.data.relation_id.map(v => v.course_name).join(',');
				this.formData.relation_id = res.data.relation_id.map(v => v.course_id);
			}).catch((error) => {
				this.$Message.error(error.msg);
			});
		},
		hadleRelatedMaster() {
			PModalRetatedMatter.popup({ 
				type: 'exam',
				datas: {
					relation_type: this.formData.relation_type,
					relation_id: this.formData.relation_id
				}
			}).then(res => {
				this.formData.label = res.label;
				this.formData.relation_id = res.relation_id;
				this.formData.relation_type = res.relation_type;
				if (this.$refs.relation) {
					this.$refs.form.validateField("label");
				}
			});
		},
		handleSave: lodash.debounce(function (event) {
			this.$refs.form.validateAndScroll((valid) => {
				if (valid) {
					try {
						let obj = {
							status: this.is_audit,
							need_witness: this.formData.need_witness,
							need_voucher: this.formData.need_voucher,
							project_id: this.$route.query.project_id,
							relation_type: this.formData.relation_type,
							relation_id: this.formData.relation_id
						};
						this.$request({
							url: API_ROOT['_HR_ACADEMY_TRAIN_DETAIL_EXAM_AUDIT_ADD_POST'], // eslint-disable-line
							type: "POST",
							param: obj
						}).then((res) => {
							this.$Message.success('开启成功');
							this.$store.commit('HR_ACADEMY_TRAIN_DETAIL_PAPER_0_AUDIT_LIST_INIT');
						}).catch((error) => {
							this.$Message.error(error.msg);
						});
					} catch (error) {
						console.error(error);
					}
				}
			});
		}, 300),
	}
};

</script>

<style lang="scss">
.v-hr-academy-train-detail-exam-audit-start {
    .ivu-form-item {
            margin-bottom: 10px !important;
        }
    ._wrapper {
        position: relative;
        background-color: #F5F5F6;
        padding: 20px 0 20px 0;
        .__icon {
            z-index: 1000;
            position: absolute;
            top: 20px;
            right: 40px;
            font-size: 26px;
        }
        .__label {
            display: inline-block;
            height: 32px;
            line-height: 32px;
        }
    }
}
</style>
