<template>
	<div class="v-pk-scene">
		<div class="_operate">
			<i-button class="g-fr g-m-l-10 __btn" type="error" ghost>
				<vc-copy :value="PcLink">复制大屏链接</vc-copy>
			</i-button>
			<i-button class="g-fr g-m-l-10 __btn" type="error" ghost>
				<vc-copy :value="phoneLink">复制手机链接</vc-copy>
			</i-button>
			<i-button 
				v-if="$auth['372'] && PKStatus" 
				class="g-fr g-m-l-10 __btn" 
				type="error" 
				ghost
				@click="handleTogglePK">关闭PK</i-button>
			<i-button 
				v-if="$auth['371'] && !PKStatus"
				class="g-fr g-m-l-10 __btn"
				type="error" 
				ghost
				@click="handleTogglePK">开启PK</i-button>
		</div>
		<div class="_filter">
			<div class="g-m-b-15">月份：&nbsp;{{ handleNowMonth() }}</div>
			<div>
				<i-form ref="formValidate" :model="formValidate" :rules="ruleValidate">
					<i-form-item
						:label-width="120"
						prop="staff"
						label="擂主："
						class="_form-item">
						<i-select
							ref="staff"
							:remote-method="loadStaff"
							:loading="staffLoading"
							v-model="formValidate.staff"
							filterable
							clearable
							remote
							label-in-value
							class="_short"
							placeholder="请输入员工姓名/手机搜索"
							@on-change="handleSelectChallenger"
							@on-query-change="handleQueryChange"
						>
							<i-option v-for="(option, index) in staffData" :value="option.value" :key="index">{{ option.label }}</i-option>
						</i-select>
					</i-form-item>
					<i-form-item
						:label-width="120"
						prop="type"
						label="类型："
						class="_form-item">
						<i-input
							v-model="formValidate.type"
							disabled
							class="_short"/>
					</i-form-item>
					<i-form-item
						:label-width="120"
						prop="surplus"
						label="剩余PK人数："
						number="true"
						class="_form-item">
						<i-input-number
							v-model="formValidate.surplus"
							:min="1"
							:max="maxSurplus"
							class="_short"/>
					</i-form-item>						
					<i-form-item
						:label-width="120"
						prop="pk_amount"
						label="PK金额："
						number="true"
						class="_form-item">
						<i-input
							v-model="formValidate.pk_amount"
							style="width: 220px;margin-right: 8px"/>
					</i-form-item>
					<vc-debounce-click 
						:tag="Button"
						class="g-red-btn-small"
						type="primary"
						@click="handleSubmit">添加</vc-debounce-click>
				</i-form>
			</div>
		</div>
		<div style="padding-left: 30px">
			<iframe id="FrameID" :src="Url" class="_iframe"/>
		</div>
	</div>
</template>

<script>
import { Button, Select, Option, Input, InputNumber, Form, FormItem } from 'iview';
import { Copy } from 'wya-vc';
import { M_PK_URL } from '@constants/constants';
// import { staffByMutiTerm } from '@stores/services/hr'; // 从人事部门接口获取部门级联
import API_ROOT from "@stores/apis/root";
import { initTreeData } from '@utils/utils';

export default {
	name: 'oa-tpl',
	components: {
		'i-button': Button,
		'vc-copy': Copy,
		"i-select": Select,
		'i-option': Option,
		'i-input': Input,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-input-number': InputNumber
	},
	// mixins: [staffByMutiTerm],
	data() {
		const pkAmountValidata = (rule, value, callback) => {
			if (!value) {
				callback('请填写pk金额');
				return;
			}
			const re = /^[1-9]+[0-9]*]*$/;
			if (!re.test(value)) {
				callback('pk金额为正整数');
				return;	
			}
			callback();
		};
		return {
			Url: `${location.origin}/sale/pk`,
			phoneLink: M_PK_URL,
			PcLink: `${location.origin}/sale/pk`,
			// isLoading: false,
			status: '',
			staff_label: '',
			staffLoading: false, 
			staffData: [],
			formValidate: {
				staff: '',
				type: '',
				surplus: 0,
				pk_amount: ''
			},
			maxSurplus: 20, // 最多可PK人数
			ruleValidate: {
				staff: [
					{ required: true, type: 'number', message: '请填写姓名', trigger: 'change' }
				],
				type: [
					{ required: true, message: ' ', trigger: 'change' }
				],
				surplus: [
					{ required: true, type: 'number', message: '请填写剩余人数', trigger: 'change' }
				],
				pk_amount: [
					{ required: true, message: '请填写PK金额', trigger: 'change' },
					{ validator: pkAmountValidata, trigger: 'change' }
				]
			}
		};
	},
	computed: {
		PKStatus() {
			return this.status;
		}
	},
	beforeCreate() {
		this.Button = Button;
	},
	created() {
		this.handleRequest('_SALE_MAIN_PK_STATUS_GET', 'GET').then(({ data: { status } }) => {
			this.status = Number(status);
		});
	},
	methods: {
		async handleSelectChallenger(staffInfo = {}) {
			this.staff_label = staffInfo.label || '';
			if (!staffInfo.value) return;
			const getStaffType = this.handleRequest('_SALE_MAIN_PK_SURPLUS_GET', 'GET', { staff_id: staffInfo.value });
			const getSurplus = this.handleRequest('_SALE_MAIN_PK_STAFF_IDENTIFY_GET', 'GET', { staff_id: staffInfo.value });
			const [{ data: { surplus } }, { data: type }] = await Promise.all([getStaffType, getSurplus]);
			this.formValidate.staff_id = staffInfo.value;
			this.formValidate.surplus = Number(surplus);
			this.maxSurplus = Number(surplus);
			this.formValidate.type = type[0];
			this.formValidate.pk_amount = type[0] === '员工' ? '200' : '1000';
		},
		handleSubmit() {
			this.$refs['formValidate'].validate((valid) => {
				if (valid) {
					this.handleRequest('_SALE_MAIN_PK_START_PK_POST', 'POST', {
						month: this.handleNowMonth(),
						guard_staff_id: this.formValidate.staff_id,
						surplus: Number(this.formValidate.surplus),
						pk_amount: Number(this.formValidate.pk_amount)
					}).then(res => {
						this.$Message.success(res.msg);
					}).catch(err => this.$Message.error(err.msg));
				} else {
					this.$Message.error('请填写正确信息！');
				}
			});
		},
		handleTogglePK() {
			this.handleRequest('_SALE_MAIN_PK_TOGGLE_PK_POST', "POST", {
				status: this.status ? 0 : 1
			}).then(res => {
				this.status = this.status ? 0 : 1;
				this.$Message.success(res.msg); 
				document.getElementById('FrameID').contentWindow.location.reload(true);
			}).catch(err => this.$Message.error(err.msg));
		},
		handleRequest(url, type, param) {
			return this.$request({
				url: API_ROOT[url],
				type,
				param
			});
		},
		handleNowMonth() {
			const date = new Date();
			const year = date.getFullYear();
			let month = date.getMonth() + 1;
			month = month < 10 ? '0' + month : month;
			return year + '-' + month;
		},
		loadStaff(query) {
			if (query !== '') {
				this.staffLoading = true;
				this.$request({
					url: API_ROOT._SALE_MAIN_PK_STAFF_GET,
					type: 'GET',
					param: {
						search: query.trim()
					},
					loading: false
				}).then((res) => {
					this.staffLoading = false;
					this.staffData = initTreeData(res.data, 'staff_id', 'staff_name');
				}).catch((error) => {
					this.staffLoading = false;
				});
			} else {
				this.staffData = [];
			}

		},
		handleQueryChange(query = '') {
			let targetQuery = this.staff_label || '';
			if (targetQuery.length > query.length) {
				this.$refs.staff.clearSingleSelect();
			}
		}
	},

};
</script>

<style lang="scss" scoped>
	.v-pk-scene {
		margin-top: 25px;
		._short {
			width: 220px;
			margin-right: 20px;;
		}
		width: 100%;
		._operate {
			overflow: hidden;
			min-width: 750px;
			margin: 10px 8px 0 0;
		}
		._filter {
			height: auto;
			min-height: 100px;
			background-color: #f5f5f6;
			width: 98%;
			min-width: 750px;
			margin: 25px 30px;
			padding: 20px;
		}
		._form-item {
			display: inline-block;
			margin-left: -30px
		}
		._iframe {
			width: 100%;
			min-width: 1200px;
			height: 1000px;
			overflow: hidden;
		}
		.__btn {
			height: 32px!important;
			&:hover {
				background-color: #e84c57;
				border: 1px solid #e84c57;
				color: #fff !important;
			}
			&:active {
				background-color: #d9444f !important;
			}
		}
	}
</style>
