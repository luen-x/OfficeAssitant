<template>
	<div class="v-hr-personnel-info-recommend">
		<i-form 
			ref="formData" 
			:model="formData"
			:label-width="120"
			class="_form"
		>
			<div class="g-flex g-jc-c g-pd-tb-10 g-m-t-10 g-m-lr-20 _basic-info">
				<div class="g-flex g-ai-c g-fs-16">
					<div class="g-m-r-30">
						<span>评价人：</span>
						<span class="g-c-black1">{{ formData.staff_name }}</span>
					</div>
					<div class="g-m-lr-30">
						<span>部门：</span>
						<span class="g-c-black1">{{ formData.depart_name }}</span>
					</div>
					<div class="g-m-lr-30">
						<span>级别：</span>
						<span class="g-c-black1">{{ formData.staff_identity }}</span>
					</div>
					<div class="g-flex g-ai-c g-m-l-30">
						<label>被评人：</label>
						<i-select
							v-model="formData.staff_id"
							:remote-method="(search)=>loadStaffList(search)"
							:loading="staff_list_loading"
							filterable
							remote
							transfer
							placeholder="请输入名称搜索"
							style="width: 300px;"
							@on-change="handleChange($event)"
						>
							<i-option
								v-for="(item,index) in staff_list"
								:key="index"
								:value="item.staff_id"
							>{{ item.staff_name }}</i-option>
						</i-select>
					</div>
				</div>
			</div>
			<div class="g-flex g-fd-c g-ai-c">
				<div>
					<div class="g-m-t-40 g-fs-16 g-c-red-mid">
						<span class="_title-bar"/>
						<span class="g-pd-l-15">业务</span>
					</div>
					<div 
						v-for="(item, index) in formData.business" 
						:key="index"
					>
						<div class="g-m-tb-15 g-fs-14 g-c-black1">{{ item.cate_name }}</div>
						<i-form-item 
							v-for="it in item.question_arr"
							:key="it.question_id"
							:label="it.question_name"
						>
							<i-radio-group v-model="it.value">
								<i-radio :label="1" class="g-pd-l-30">很好</i-radio>
								<i-radio :label="2" class="g-pd-l-30">一般</i-radio>
								<i-radio :label="3" class="g-pd-l-30">很差</i-radio>
								<i-radio :label="4" class="g-pd-l-30">特差</i-radio>
							</i-radio-group>
							<label style="margin-left: 50px;">描述：</label>
							<i-input 
								v-model="it.description" 
								:maxlength="20" 
								placeholder="请输入描述"
								style="width: 300px;"
							/>
						</i-form-item>
					</div>
				</div>
				<div>
					<div class="g-m-t-40 g-fs-16 g-c-red-mid">
						<span class="_title-bar"/>
						<span class="g-pd-l-15">心态</span>
					</div>
					<div v-for="(item, index) in formData.mentality" :key="index">
						<div class="g-m-tb-15 g-fs-14 g-c-black1">{{ item.cate_name }}</div>
						<i-form-item 
							v-for="it in item.question_arr"
							:key="it.question_id"
							:label="it.question_name"
						>
							<i-radio-group v-model="it.value">
								<i-radio :label="1" class="g-pd-l-30">很好</i-radio>
								<i-radio :label="2" class="g-pd-l-30">一般</i-radio>
								<i-radio :label="3" class="g-pd-l-30">很差</i-radio>
								<i-radio :label="4" class="g-pd-l-30">特差</i-radio>
							</i-radio-group>
							<label style="margin-left: 50px;">描述：</label>
							<i-input 
								v-model="it.description" 
								:maxlength="20" 
								placeholder="请输入描述"
								style="width: 300px;"
							/>
						</i-form-item>
					</div>
				</div>
			
			</div>
		</i-form>
		<footer class="g-flex g-flex-ac g-flex-cc">
			<i-button class="g-m-r-10" @click="handleCancel">取消</i-button>
			<i-button class="g-m-r-10" type="primary" @click="handleConfirm">确定</i-button>
			<i-button type="primary" @click="handleSave">保存并继续</i-button>
		</footer>
	</div>
</template>

<script>
import { Input, Select, Option, Button, Form, FormItem, RadioGroup, Radio } from 'iview';
import { setTimeout } from 'timers';
import { Confirm } from '@components/_common/confirm/confirm';

export default {
	name: "c-archives-person-recommend",
	components: {
		'i-input': Input,
		'i-select': Select,
		'i-option': Option,
		'i-button': Button,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-radio-group': RadioGroup,
		'i-radio': Radio
	},
	data() {
		return {
			staff_list: [], // 搜索出来的员工列表
			staff_list_loading: false,
			formData: {
				staff_id: '',
				staff_name: '',
				depart_name: '',
				staff_identity: '',
				business: [],
				mentality: []
			}
		};
	},
	mounted() {
		this.loadData();
	},
	methods: {
		/**
		 * 初始化加载数据
		 */
		loadData() {
			this.loadConfig();
		},
		/**
		 * 加载配置详情数据
		 */
		loadConfig(staff_id) {
			let param = { staff_id } || {};
			this.$request({
				url: '_HR_PERSONNEL_INFO_RECOMMEND_CONF_GET',
				type: 'GET',
				loading: false,
				param: {
					...param
				},
				autoTip: false
			}).then(res => {
				this.formData = {
					...res.data,
					staff_id
				};
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},
		/**
		 * 根据被评人姓名搜索
		 */
		loadStaffList(search) {
			this.staff_list_loading = true;

			this.$request({
				url: '_HR_MUTI_TERM_STAFF_GET',
				type: 'GET',
				loading: false,
				param: {
					search: search ? search.split('-')[0] : ''
				},
				autoTip: false
			}).then(res => {
				this.staff_list_loading = false;
				if (Array.isArray(res.data)) {
					res.data.forEach(item => {
						item.staff_name = item.staff_name.split('/')[0] + '-' + item.mobile + '-' + item.depart_name;
					});
					this.staff_list = res.data;
				}
			}).catch(error => {
				this.staff_list_loading = false;
				this.$Message.error(error.msg); 
			});
		},
		/**
		 * 监听选择被评人change事件
		 */
		handleChange(staff_id) {
			if (staff_id) {
				this.$request({
					url: '_HR_PERSONNEL_INFO_CHECK_RECOMMEND_STAFF_POST',
					type: "POST",
					loading: false,
					param: {
						staff_id
					},
					autoTip: false
				}).then(res => {
					if (res.status == 1) {
						this.$Message.success(res.msg);
						setTimeout(() => {
							this.loadConfig(staff_id);
						}, 3000);
					} else {
						this.$Message.error(res.msg);
					}
				}).catch(error => {
					this.$Message.error(error.msg);
				});
			}
		},
		/**
		点击取消
		 */
		handleCancel() {
			Confirm.popup({
				title: '提示',
				msg: '是否退出当前页面，退出后，页面内容不能保存'
			}).then(() => {
				this.$router.go(-1);
			}).catch((error) => {
				error && console.error(error);
			});
		},
		/**
		点击确定
		 */
		handleConfirm() {
			this.$request({
				url: '_HR_PERSONNEL_INFO_RECOMMEND_CONF_ADD_POST',
				type: "POST",
				loading: false,
				param: this.formData,
				autoTip: true
			}).then(res => {
				setTimeout(() => {
					this.$router.go(-1);
				}, 3000);
			}).catch(error => {});
		},
		/**
		点击保存并继续
		 */
		handleSave() {
			this.$request({
				url: '_HR_PERSONNEL_INFO_RECOMMEND_CONF_ADD_POST',
				type: "POST",
				loading: false,
				param: this.formData,
				autoTip: true
			}).then(res => {
				setTimeout(() => {
					this.loadData();
				}, 3000);
			}).catch(error => {});
		}
	}
};

export const HrPersonnelInfoRecommend = module.exports.default;

</script>

<style lang="scss">
.v-hr-personnel-info-recommend {
	height: 100%;
	._basic-info {
		background-color: #f6f6f6;
		.ivu-form-item {
			margin-bottom: 0!important;
		}
	}
	._title-bar {
			display: inline-block;
			width: 2px;
			height: 14px;
			position: relative;
			top: 1px;
			background-color: #e84854;
		}
	.ivu-input-wrapper, .ivu-select {
		width: 220px;
	}
	.ivu-radio-wrapper:first-child {
		margin-right: 0;
	}
	.ivu-radio-group {
		vertical-align: top;
		margin-top: -2px;
	}
	.ivu-form-item-label {
		text-align: left;
	}
	._form{
		padding-bottom: 60px;
	}
	footer {
		position: fixed;
		bottom: 0;
		left: 0;
		background-color: #ffffff;
		width: 100%;
		height: 60px;
		box-shadow: 0px -2px 9.9px 0.1px rgba(0, 0, 0, 0.08);
	}
}
</style>

