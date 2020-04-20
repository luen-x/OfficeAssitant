<template>
	<div style="width: 100%">
		<div class="g-flex g-jc-sb g-m-b-10">
			<div>
				<i-button @click="handlePrev">上一个错误</i-button>
				<i-button style="marginLeft: 7px" @click="handleNext">下一个错误</i-button>
			</div>
			<div class="g-flex g-ai-c">
				<div class="g-red-btn-line" @click="handleExport">导出修改后的表</div>
				<i-button type="primary" class="g-m-l-10" @click="handleLeadin">确认导入</i-button>
			</div>
		</div>
		<i-form 
			ref="form"
			:model="formdata"
			:show-message="false"
			class="hr-leadin-table"
		>
			<div class="_header g-flex">
				<div>员工姓名</div>
				<div>
					<span style="color:#ed4014">*</span>
					手机号
				</div>
				<div>
					<span style="color:#ed4014">*</span>
					{{ name }}类型
				</div>
				<div>
					<span style="color:#ed4014">*</span>
					归属月份
				</div>
				<div>
					<span style="color:#ed4014">*</span>
					{{ name }}调整
				</div>
				<div>
					<span style="color:#ed4014">*</span>
					调整说明
				</div>
			</div>
			<div class="_body">
				<div
					v-for="(item, index) of formdata.arr"
					:key="index"
					class="_item g-flex"
				>
					<div>
						<i-formitem>
							<i-input 
								v-model="item.staff_name"
							/>
						</i-formitem>
					</div>
					<div>
						<i-poptip 
							v-if="err[index].mobile"
							trigger="hover" 
							transfer 
							placement="bottom-end"
						>
							<i-formitem 
								:prop="`arr.${index}.mobile`" 
								:rules="validator.mobile"
							>
								<i-input 
									:ref="'mobile' + index"
									v-model="item.mobile"
									placeholder="请输入手机号"
									@on-focus="handleFocus('mobile' + index)"
									@on-blur="handleBlur([item], index)"
								/>
							</i-formitem>
							<div slot="content">
								<div>
									<div 
										v-for="(info, i) of err[index].mobile"
										:key="i">
										{{ info }}
									</div>
								</div>
							</div>
						</i-poptip>
						<i-formitem 
							v-else
							:prop="`arr.${index}.mobile`" 
							:rules="validator.mobile">
							<i-input 
								:ref="'mobile' + index"
								v-model="item.mobile"
								placeholder="请输入手机号"
								@on-focus="handleFocus('mobile' + index)"
								@on-blur="handleBlur([item], index)"
							/>
						</i-formitem>
					</div>
					<div>
						<i-poptip 
							v-if="err[index].type_name"
							trigger="hover" 
							transfer 
							placement="bottom-end"
						>
							<i-formitem 
								:prop="`arr.${index}.type_name`" 
								:rules="validator.type_name">
								<i-input 
									:ref="'type_name' + index"
									v-model="item.type_name"
									placeholder="请输入积分类型"
									@on-focus="handleFocus('type_name' + index)"
									@on-blur="handleBlur([item], index)"
								/>
							</i-formitem>
							<div slot="content">
								<div>
									<div 
										v-for="(info, i) of err[index].type_name"
										:key="i">
										{{ info }}
									</div>
								</div>
							</div>
						</i-poptip>
						<i-formitem 
							v-else
							:prop="`arr.${index}.type_name`" 
							:rules="validator.type_name">
							<i-input 
								:ref="'type_name' + index"
								v-model="item.type_name"
								placeholder="请输入积分类型"
								@on-focus="handleFocus('type_name' + index)"
								@on-blur="handleBlur([item], index)"
							/>
						</i-formitem>
					</div>
					<div>
						<i-poptip 
							v-if="err[index].month"
							trigger="hover" 
							transfer 
							placement="bottom-end"
						>
							<i-formitem 
								:prop="`arr.${index}.month`" 
								:rules="validator.month">
								<i-input 
									:ref="'month' + index"
									v-model="item.month"
									placeholder="请输入归属月份"
									@on-focus="handleFocus('month' + index)"
									@on-blur="handleBlur([item], index)"
								/>
							</i-formitem>
							<div slot="content">
								<div>
									<div 
										v-for="(info, i) of err[index].month"
										:key="i">
										{{ info }}
									</div>
								</div>
							</div>
						</i-poptip>
						<i-formitem 
							v-else
							:prop="`arr.${index}.month`" 
							:rules="validator.month">
							<i-input 
								:ref="'month' + index"
								v-model="item.month"
								placeholder="请输入归属月份"
								@on-focus="handleFocus('month' + index)"
								@on-blur="handleBlur([item], index)"
							/>
						</i-formitem>
					</div>
					<div>
						<i-poptip 
							v-if="err[index].point"
							trigger="hover" 
							transfer 
							placement="bottom-end"
						>
							<i-formitem 
								:prop="`arr.${index}.point`" 
								:rules="validator.point">
								<i-input 
									:ref="'point' + index"
									v-model="item.point"
									placeholder="请输入积分调整"
									@on-focus="handleFocus('point' + index)"
									@on-blur="handleBlur([item], index)"
								/>
							</i-formitem>
							<div slot="content">
								<div>
									<div 
										v-for="(info, i) of err[index].point"
										:key="i">
										{{ info }}
									</div>
								</div>
							</div>
						</i-poptip>
						<i-formitem 
							v-else
							:prop="`arr.${index}.point`" 
							:rules="validator.point">
							<i-input 
								:ref="'point' + index"
								v-model="item.point"
								placeholder="请输入积分调整"
								@on-focus="handleFocus('point' + index)"
								@on-blur="handleBlur([item], index)"
							/>
						</i-formitem>
					</div>
					<div>
						<i-poptip 
							v-if="err[index].reason"
							trigger="hover" 
							transfer 
							placement="bottom-end"
						>
							<i-formitem 
								:prop="`arr.${index}.reason`" 
								:rules="validator.reason">
								<i-input 
									:ref="'reason' + index"
									v-model="item.reason"
									placeholder="请输入调整说明"
									@on-focus="handleFocus('reason' + index)"
									@on-blur="handleBlur([item], index)"
								/>
							</i-formitem>
							<div slot="content">
								<div>
									<div 
										v-for="(info, i) of err[index].reason"
										:key="i">
										{{ info }}
									</div>
								</div>
							</div>
						</i-poptip>
						<i-formitem 
							v-else
							:prop="`arr.${index}.reason`" 
							:rules="validator.reason">
							<i-input 
								:ref="'reason' + index"
								v-model="item.reason"
								placeholder="请输入调整说明"
								@on-focus="handleFocus('reason' + index)"
								@on-blur="handleBlur([item], index)"
							/>
						</i-formitem>
					</div>
				</div>
			</div>
		</i-form>
	</div>
</template>

<script>
import { Form, FormItem, Input, Button, Poptip, Tooltip } from 'iview';
import { debounce } from 'lodash';
import { formatMoment, getItem, getParseUrl, getHashUrl } from "@utils/utils";

export default {
	name: 'hr-leadin-table',
	components: {
		'i-form': Form,
		'i-formitem': FormItem,
		'i-input': Input,
		'i-button': Button,
		'i-poptip': Poptip,
		'i-tooltip': Tooltip
	},
	props: {
		cate: String,
		lists: Array,
		errs: Array
	},
	data() {
		return {
			formdata: {
				arr: this.lists,
			},
			err: this.errs,
			errindex: 0,
			errLists: [],
			validator: {
				mobile: [
					{ 
						required: true, 
						validator: (rule, val, cb) => {
							this.validateFn(rule, val, cb, 'mobile');
						} 
					}
				],
				type_name: [
					{ 
						required: true,
						validator: (rule, val, cb) => {
							this.validateFn(rule, val, cb, 'type_name');
						} 
					}
				],
				month: [
					{ 
						required: true,
						validator: (rule, val, cb) => {
							this.validateFn(rule, val, cb, 'month');
						} 
					}
				],
				point: [
					{ 
						required: true,
						validator: (rule, val, cb) => {
							this.validateFn(rule, val, cb, 'point');
						} 
					}
				],
				reason: [
					{ 
						required: true,
						validator: (rule, val, cb) => {
							this.validateFn(rule, val, cb, 'reason');
						} 
					}
				]
			}
		};
	},
	computed: {
		name() {
			return this.cate === '1' ? '积分' : '学分';
		}
	},
	watch: {
		errindex(val) {
			if (this.errLists[val]) {
				let errNode = this.errLists[val].$children[0];
				errNode.focus();
			}
		}
	},
	mounted() {
		this.handleValidate();
	},
	methods: {
		validateFn({ field }, value, cb, key) {
			let index = this.getIndex(field);
			if (!value) {
				cb('为空了');
				return;
			}
			if (this.err[index][key] && this.err[index][key][0]) {
				cb('出错了');
			} else {
				cb();
			}
		},
		handleValidate() {
			this.$refs.form.validate().then((res) => {
				this.errLists = this.$refs.form.errorList;
			});
		},
		getIndex(field) {
			return field.split('.')[1];
		},
		handleFocus(ref) {
			let vNode = this.$refs[ref][0];
			this.errLists.forEach((item, index) => {
				let inputNode = item.$children[0];
				if (inputNode._uid === vNode._uid) {
					this.errindex = index;
				}
			});
		},
		handleBlur: debounce(function (list, index) {
			this.$request({
				url: '_HR_SCORE_LEADIN_ITEM_VALIDATE_POST',
				type: 'POST',
				loading: true,
				param: {
					list,
					cate: this.cate
				}
			}).then(res => {
				const { errors } = res.data;
				// this.err[index] = errors[0];
				this.$set(this.err, index, errors[0]);
				this.$nextTick(() => {
					this.handleValidate();
				});
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		}, 400),
		handlePrev() {
			let errindex = this.errindex === 0 ? this.errLists.length - 1 : this.errindex - 1;
			this.errindex = errindex;
			this.handleToast(errindex);
		},
		handleNext() {
			let errindex = this.errindex === this.errLists.length - 1 ? 0 : this.errindex + 1;
			this.errindex = errindex;
			this.handleToast(errindex);
		},
		handleToast(errindex) {
			this.errLists[errindex].$el.scrollIntoView(
				{ behavior: 'smooth' }
			);
			if (!this.errLists.length) {
				this.$Message.success("所有错误信息已经修改完毕！");
			}
		},
		handleLeadin() {
			this.$request({
				url: '_HR_EMPLOYEE_SCORE_INTEGRATION_MAIN_POST',
				type: 'POST',
				loading: true,
				param: {
					list: this.formdata.arr,
					cate: this.cate
				}
			}).then(res => {
				const { total_count, error_count } = res.data;
				this.$emit('jump', { total_count, error_count });
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		handleExport() {
			this.$request({
				url: '_HR_SCORE_LEADIN_EXPORT_LIST_POST',
				type: 'POST',
				loading: true,
				param: {
					list: this.formdata.arr,
					cate: this.cate
				}
			}).then(res => {
				const { url } = res.data;
				window.open(getHashUrl(url, {
					'-token': getItem(`staff_${this.$global.version}`).token
				}));
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		}
	}
};
</script>

<style lang="scss">
.hr-leadin-table {
	flex: 1;
	// overflow: auto;
	display: flex;
	flex-direction: column;
	border: 1px solid #dcdee2;

	.ivu-poptip {
		width: 100%;

		.ivu-poptip-rel {
			width: 100%;
		}
	}

	._header {
		background: #f0f4fc;
		height: 36px;
		line-height: 36px;

		& > div {
			flex: 1;
			text-align: center;
			border-right: 1px solid #e8eaec;
		}
		& > div:last-child {
			border-right: none;
		}
	}
	._body {
		flex: 1;

		._item {
			height: 36px;
			line-height: 36px;

			& > div {
				flex: 1;
				text-align: center;
				border-right: 1px solid #e8eaec;

				.ivu-form-item {
					margin-bottom: 0 !important;
					height: 36px;
					line-height: 36px;
					.ivu-form-item-content {
						line-height: 36px !important;
					}

					.ivu-input {
						border: 1px solid transparent;
						border-radius: 0;
						height: 36px !important;
						background: transparent !important;
					}
					.ivu-input:focus {
						border-color: #57a3f3;
					}
				}
				.ivu-form-item-error {
					.ivu-input {
						color: #ed4014;
					}
					.ivu-input:focus {
						box-shadow: 0 0 0 2px rgba(45, 140, 240, 0.2)
					}
					.ivu-input::placeholder {
						color: #ed4014;
					}
				}

			}
			& > div:last-child {
				border-right: none;
			}
		}
		._item:nth-child(2n) {
			background: #f8f8f8;
		}
	}
}
</style>


