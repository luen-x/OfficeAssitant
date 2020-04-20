<template>
	<div>
		<i-modal
			ref="modal"
			v-model="visible"
			:width="400"
			:loading="true"
			:mask-closable="false"
			class="v-hr-system-assess-up-add-modal"
			@on-ok="handleOk"
			@on-cancel="handleCancel"
		>
			<div slot="header" class="g-tc">{{ position_info ? "职位编辑" : "新增职位" }}</div>
			<i-form
				ref="form"
				:model="formdata"
				:rules="validator"
				:label-width="80"
				style="marginTop: 14px">
				<i-formitem prop="position_id" label="职位名称:">
					<i-select
						v-model="formdata.position_id"
						:disabled="!!position_info"
						style="width: 220px"
						transfer
						placeholder="请选择职位名称"
					>
						<i-option
							v-for="item of jobArr"
							:key="item.position_id"
							:value="item.position_id">{{ item.position_name }}</i-option>
					</i-select>
				</i-formitem>
				<div
					v-for="(item, index) of formdata.calculate_role"
					:key="index"
					class="_role">
					<i-formitem
						:label="!index ? '核算角色:' : ''"
						:prop="`calculate_role.${index}.role_id`"
						:rules="validator.role_id"
					>
						<div class="g-flex g-ai-c" style="margin-left: -10px">
							<div
								:class="['g-m-b-10 g-pd-lr-10', index === 0 ? '' : 'g-pd-t-10', (index + 1)%2 === 0 ? '_actived' : '']"
								style="width: 240px">

								<i-select
									v-model="item.role_id"
									:remote-method="loadRole"
									:loading="roleLoading"
									filterable
									remote
									transfer
									style="width: 220px"
									placeholder="请输入角色关键字搜索"
									clearable
									class="g-m-b-10"
								>
									<i-option
										v-for="(option, index) in roleArr"
										:value="option.role_id"
										:key="index">{{ option.role_name }}</i-option>
								</i-select>
								<i-select
									ref="team"
									v-model="item.rate_case_id"
									:remote-method="(query) => loadTeam(query, item)"
									:loading="teamLoading"
									filterable
									remote
									transfer
									style="width: 220px"
									placeholder="请输入团队提成关键字搜索"
									clearable
								>
									<i-option
										v-for="item of teamData"
										:value="item.t_rate_case_id"
										:key="item.t_rate_case_id">{{ item.name }}</i-option>
								</i-select>
							</div>
							<div class="g-flex">
								<i
									v-if="index > 0"
									class="icon iconfont icon-remove-circle g-m-t-5 g-m-lr-5"
									style="font-size: 16px; color: #E74854"
									@click="() => handleItemDel(index)"
								/>
								<i
									v-if="index === formdata.calculate_role.length - 1"
									class="icon iconfont icon-add1 g-m-t-5 g-m-l-5"
									style="font-size: 16px; color: #2296f9"
									@click="handleItemAdd"
								/>
							</div>
						</div>
					</i-formitem>
				</div>
			</i-form>
		</i-modal>
	</div>
</template>

<script>
import { Modal, DatePicker, Button, Form, FormItem, Select, Input, InputNumber, Option, Row, Col } from 'iview';
import { CreatePortal } from 'wya-vc';
import API_ROOT from '@stores/apis/root';
import TextArea from '@components/_common/limit-words/limit-words';
import lodash from "lodash";


export default {
	name: 'hr-system-assess-up-job',
	components: {
		'i-modal': Modal,
		'i-datepicker': DatePicker,
		'i-form': Form,
		'i-formitem': FormItem,
		'i-select': Select,
		'i-option': Option,
		'i-input': Input,
		'i-input-number': InputNumber,
		'i-row': Row,
		'i-col': Col,
		'i-button': Button,
		'oa-textarea': TextArea
	},
	props: {
		name: String,
		depart_id: Number,
		position_info: Object
	},
	data() {
		return {
			visible: false,
			formdata: this.position_info || {
				calculate_role: [{}]
			},
			jobArr: [],
			teamData: [],
			teamLoading: false,
			roleLoading: false,
			roleArr: [],
			validator: {
				position_id: [
					{ required: true, type: 'number', message: '请选择职位', trigger: 'change' }
				],
				role_id: [
					{ required: true, type: 'number', message: '请选择角色', trigger: 'change' }
				]
			}
		};
	},
	mounted() {
		this.visible = true;
		this.loadJob();
	},
	methods: {
		handleItemDel(index) {
			this.formdata.calculate_role.splice(index, 1);
		},
		handleItemAdd() {
			this.formdata.calculate_role.push({});
		},
		loadJob() {
			this.$request({
				url: 'HR_POSITION_LIST_GET',
				type: 'GET',
				param: {
					depart_id: this.depart_id,
					type: 1
				},
				loading: false
			}).then(res => {
				this.jobArr = res.data.list;
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		loadTeam(query, item) {
			query = item.edit ? query : item.name;
			if (query !== '') {
				this.teamLoading = true;
				this.$request({
					url: API_ROOT._HR_SYSTEM_ASSESS_TEAM_RATE_GET,
					type: 'GET',
					param: {
						type: 2,
						depart_id: this.depart_id,
						name: query
					},
					loading: false
				}).then((res) => {
					this.teamLoading = false;
					this.teamData = res.data;
					item.edit = true;
				}).catch((error) => {
					this.teamLoading = false;
					item.edit = true;
				});
			} else {
				this.teamData = [];
				item.edit = true;
			}
		},
		loadRole(query) {
			if (query !== '') {
				this.roleLoading = true;
				this.$request({
					url: '_HR_ROLE_DATA_GET',
					type: 'GET',
					param: {
						role_name: query
					},
				}).then(res => {
					this.roleLoading = false;
					this.roleArr = res.data;
				}).catch(err => {
					this.$Message.error(err.msg);
				});
			} else {
				this.roleLoading = false;
				this.roleArr = [];
			}
		},
		handleOk() {
			this.$refs['form'].validateAndScroll((item) => {
				this.$refs.modal.buttonLoading = false;
				if (item) {
					this.$request({
						url: '_HR_SYSTEM_ASSESS_DPR_POST',
						type: 'POST',
						param: this.formdata,
						loading: false
					}).then((res) => {
						this.$Message.success(res.msg);
						this.$emit('sure');
					}).catch((err) => {
						this.$Message.error(err.msg);
					});
				}
			});
		},
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		}
	}
};
export const JobModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.v-hr-system-assess-up-add-modal {
	._actived {
		border-radius: 4px;
		background-color: #F8F8F8;
		padding-bottom: 10px;
		margin-bottom: 0px !important;
	}
	._role {
		.ivu-form-item {
			margin-bottom: 0 !important;
		}
	}
	.ivu-modal-body {
		max-height: 500px;
		overflow: auto;
	}		
}
</style>


