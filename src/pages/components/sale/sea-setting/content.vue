<template>
	<div>
		<oa-loading v-if="loading"/>
		<i-form
			v-else
			ref="setForm"
			:model="setForm"
			:label-width="120"
			class="v-sale-sea-setting"
			position="left"
		>
			<div class="_title g-m-t-10   g-m-b-20 g-fs-14">
				<span class="__title-bar g-m-r-10"/>
				<span class="g-fs-16">公海领取设置</span>
			</div>
			<div class="_content">
				<i-form-item
					v-for="(item, index) in setForm.sea_set"
					:key="index">
					<i-select
						v-model="item.role_id"
						clearable
						transfer
						placeholder="请选择角色"
					>
						<i-option
							v-for="data in role_sea_list"
							:key="data.role_name"
							:value="data.role_id"
							:disabled="sea_set_role_ids.includes(data.role_id)"
						>
							{{ data.role_name }}
						</i-option>
					</i-select>
					<span class="__label g-pd-l-10 g-pd-r-20">每日可领取</span>
					<i-radio-group v-model="item.type">
						<i-radio :label="0">不限</i-radio>
						<i-radio :label="1">
							<i-input-number
								v-model.number="item.number"
								:max="999999"
								:min="0"
								style="width: 100px;"
								placeholder="请输入数量"
								@on-focus="handleSeaFocus(index)"
							/>
						</i-radio>
					</i-radio-group>
					<span>个</span>
					<i
						v-if="index != 0"
						class="icon iconfont icon-remove-circle g-c-red-mid g-pointer g-m-l-20"
						@click="handleSeaReduce(index)"
					/>
					<i
						v-if="(index == setForm.sea_set.length - 1)
						&& setForm.sea_set.length < role_sea_list.length"
						class="icon iconfont icon-add1 g-c-blue-mid g-pointer g-m-l-20"
						@click="handleSeaAdd"
					/>
				</i-form-item>
			</div>

			<div class="_title  g-m-t-40 g-m-b-20 g-fs-14">
				<span class="__title-bar g-m-r-10"/>
				<span class="g-fs-16">客户等级设置</span>
			</div>
			<div class="_content _level-set">
				<i-form-item
					v-for="(_item, _index) in setForm.level_set"
					:key="_index">

					<i-select
						v-model="_item.role_id"
						placeholder="请选择角色"
						clearable
						transfer
					>
						<i-option
							v-for="_data in role_level_list"
							:key="_data.role_name"
							:disabled="level_set_role_ids.includes(_data.role_id)"
							:value="_data.role_id"
						>
							{{ _data.role_name }}
						</i-option>
					</i-select>
					<div class="__count">
						<div
							v-for="(__item, __index) in _item.list"
							:key="__index"
							class="__right g-m-b-10">
							<span class="__label g-pd-l-10 g-pd-r-20">
								{{ ['普通客户','重要客户'][__item.level*1-1] }}
							</span>
							<i-radio-group v-model="__item.type">
								<i-radio :label="0">不限</i-radio>
								<i-radio :label="1">
									<i-input-number
										v-model.number="__item.number"
										:max="999999"
										:min="0"
										style="width: 100px;"
										placeholder="请输入数量"
										@on-focus="handleLevelFocus(_index,__index)"
									/>
								</i-radio>
							</i-radio-group>
							<span>个</span>
						</div>
					</div>
					<i
						v-if="_index > 2"
						class="icon iconfont icon-remove-circle g-c-red-mid g-pointer g-m-l-20"
						@click="handleLevelReduce(_index)"
					/>
					<i
						v-if="(_index == setForm.level_set.length - 1)
						&& setForm.level_set.length < role_level_list.length"
						class="icon iconfont icon-add1 g-c-blue-mid g-pointer g-m-l-20"
						@click="handleLevelAdd"
					/>
				</i-form-item>
			</div>
			<div style="height:60px;"/>
			<div class="_submit">
				<i-button
					type="primary"
					@click="handleSave"
				>
					保存
				</i-button>
			</div>
		</i-form>
	</div>
</template>

<script>
import { Form, FormItem, Input, Select, Option, RadioGroup, Radio, Button, InputNumber } from 'iview';
import Loading from '@components/_common/loading/loading';
import { Confirm } from "@components/_common/confirm/confirm";
// utils
import { dataValidity } from '@utils/utils';

export default {
	name: 'oa-sea-setting',
	components: {
		'i-form': Form,
		'i-form-item': FormItem,
		'i-input': Input,
		'i-input-number': InputNumber,
		'i-select': Select,
		'i-option': Option,
		'i-radio-group': RadioGroup,
		'i-radio': Radio,
		'i-button': Button,
		'oa-loading': Loading,
	},
	data() {
		return {
			loading: false,
			sea_set_role_ids: [],
			level_set_role_ids: [],
			role_sea_list: [], // 公海角色列表
			role_level_list: [], // 客户等级角色列表
			sea_set_default: [{// 默认公海设置
				id: 0,
				role_id: 0,
				number: 0,
				type: 0
			}],
			level_set_default: [{// 默认及客户等级设置
				role_id: 0,
				list: [{
					id: 0,
					level: 1,
					number: 0,
					type: 0
				},
				{
					id: 0,
					level: 2,
					number: 0,
					type: 0
				}]
			}],
			setForm: {// 表单
				sea_set: [],
				level_set: []
			}
		};
	},
	mounted() {
		this.loadData();
	},
	methods: {
		/**
		 * 初始化加载
		 */
		loadData() {
			this.loading = true;
			let temp = {};
			let set_level_list = {};
			this.level_set_role_ids = [];
			this.$request({
				url: '_SALE_SEA_CUSTOMER_CONFIG_GET',
				type: 'GET',
				loading: false,
				param: {},
				autoTip: false
			}).then(res => {
				this.loading = false;
				set_level_list = res.data.set_level_list;
				this.role_sea_list = res.data.role_sea_list;
				this.role_level_list = res.data.role_level_list;

				if (res.data.set_sea_list.length) {
					this.setForm.sea_set = res.data.set_sea_list;
					this.sea_set_role_ids = res.data.set_sea_list.map(it => it.role_id);
				} else {
					this.setForm.sea_set = this.sea_set_default;
				}
				if (JSON.stringify(set_level_list) != '{}') {
					this.setForm.level_set = [];
					Object.keys(res.data.set_level_list).forEach(key => {
						this.setForm.level_set.push({
							role_id: Number(key),
							list: res.data.set_level_list[key]
						});
						this.level_set_role_ids.push(Number(key));
					});
				} else {
					this.setForm.level_set = this.level_set_default;
				}
			}).catch(error => {
				this.loading = false;
				this.$Message.error(error.msg);
			});
		},
		/**
		 * 添加公海领取
		 */
		handleSeaAdd() {
			this.setForm.sea_set.push({
				id: 0,
				role_id: 0,
				number: 0,
				type: 0
			});
		},
		/**
		 * 删除公海领取
		 */
		handleSeaReduce(index) {
			if (this.setForm.sea_set[index].role_id) {
				Confirm.popup({
					title: "",
					msg: "删除后无法恢复，确认删除？",
					showIcon: true
				}).then(() => {
					this.$request({
						url: '_SALE_SEA_CONFIG_DEL_POST',
						type: 'POST',
						loading: false,
						param: {
							id: this.setForm.sea_set[index].id,
							role_id: this.setForm.sea_set[index].role_id,
							type: '1'
						},
						autoTip: true
					}).then(res => {
						this.loadData();
					}).catch(error => {});
				}).catch(error => {
					error && console.error(error);
				});
			} else {
				this.setForm.sea_set.splice(index, 1);
			}
		},
		/**
		 * 添加客户等级
		 */
		handleLevelAdd() {
			let temp = [{
				id: 0,
				level: 1,
				number: 0,
				type: 0
			},
			{
				id: 0,
				level: 2,
				number: 0,
				type: 0
			}];

			this.setForm.level_set.push({
				role_id: 0,
				list: temp
			});
		},
		/**
		 * 删除客户等级
		 */
		handleLevelReduce(index) {
			if (this.setForm.level_set[index].role_id) {
				Confirm.popup({
					title: "",
					msg: "删除后无法恢复，确认删除？",
					showIcon: true
				}).then(() => {
					this.$request({
						url: '_SALE_SEA_CONFIG_DEL_POST',
						type: 'POST',
						loading: false,
						param: {
							id: this.setForm.level_set[index].id,
							role_id: this.setForm.level_set[index].role_id,
							type: '2'
						},
						autoTip: true
					}).then(res => {
						this.loadData();
					}).catch(error => {});
				}).catch(error => {
					error && console.error(error);
				});
			} else {
				this.setForm.level_set.splice(index, 1);
			}
		},
		/**
		 * 点击保存
		 */
		handleSave() {
			let sea_set = this.setForm.sea_set;
			let level_set = this.setForm.level_set;

			sea_set.forEach(item => {
				if (item.type == 0) {
					item.number = 0;
				}

				delete item['type'];
			});

			level_set.forEach(item => {
				item.list.forEach(_item => {
					if (_item.type == 0) {
						_item.number = 0;
					}

					delete _item['type'];
				});
			});

			this.$request({
				url: '_SALE_SEA_CONFIG_SAVE_POST',
				type: 'POST',
				loading: false,
				param: {
					sea_set,
					level_set
				},
				autoTip: true
			}).then(res => {
				this.setForm = {
					sea_set: [],
					level_set: []
				};

				this.loadData();
			}).catch(error => {});
		},
		/**
		 * 公海领取设置 获取焦点
		 */
		handleSeaFocus(index) {
			this.setForm.sea_set[index].type = 1;
		},
		/**
		 * 客户等级设置 获取焦点
		 */
		handleLevelFocus(_index, __index) {
			this.setForm.level_set[_index].list[__index].type = 1;
		}
	},
};
</script>

<style lang="scss">
.v-sale-sea-setting {
	._title {
		color: #e84854;
		.__title-bar {
			display: inline-block;
			width: 2px;
			height: 14px;
			position: relative;
			top: 2px;
			background-color: #e84857
		}
	}
	._submit {
		position: fixed;
		width:105%;
		height: 60px;
		line-height: 60px;
		text-align: center;
		bottom: 0;
		right: 0;
		box-shadow: 0px -2px 9.9px 0.1px rgba(0, 0, 0, 0.08);
		background: #fff;
	}
	.ivu-radio-wrapper {
		margin-left: 20px;
	}
	._level-set{
		.ivu-form-item-content{
			background: #fafafa;
			padding: 20px 20px 10px 20px;
		}
	}
	.ivu-form-item-content {
		width: 700px;
		margin-left: 20px!important;
		display: flex;
	}
	.v-sea-setting-content .ivu-form-item-content {
		align-items: center;
	}
	.ivu-select {
		width: 220px;
	}
	.ivu-radio-checked .ivu-radio-inner {
		border-color: #e84854;
	}
	input.ivu-radio-input {
		background-color: #e84854;
	}
	.ivu-radio-inner:after {
		background-color: #e84854;
	}
	.ivu-form-item-content{
		padding-left: 20px;
	}
	.ivu-input-number-handler-wrap{
		display: none;
	}
}
</style>
