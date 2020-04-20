<template>
	<div class=" v-sal-customer-paste-pane g-flex g-jc-c">
		<div>
			<oa-limit-words	
				v-model="content"
				:autosize="{ minRows: rows, maxRows: rows }"
				:max="100000"
				:readonly="canPaste"
				:style="'width:'+width+'px'"
				placeholder="请Ctrl + v 直接粘贴客户信息"
				@paste.native="handlePaste"
				@input="handleInput"
			/>
			<div :style="{width:width+'px'}" class="g-tc g-pointer g-pd-10 _clear-btn" @click="handleClear" >
				清空信息
			</div>
		</div>
	</div>
</template>
<script>
import { Input, Button } from 'iview';
import LimitWords from '@components/_common/limit-words/limit-words';
import { Confirm } from '@common/confirm/confirm';
import { setItem, objRegex } from '@utils/utils';
import { getInfo } from './search';

export default {
	name: 'oa-',
	components: {
		'i-input': Input,
		'i-button': Button,
		'oa-limit-words': LimitWords
	},
	props: {
		width: {
			type: Number,
			default: 800
		},
		rows: {
			type: Number,
			default: 20
		},
		value: String,
		beforeLoadState: Function
	},
	data() {
		return {
			content: this.value
		};
	},
	computed: {
		canPaste() { 
			return !!this.content.length;
		}
	},
	watch: {
		value(val) {
			this.content = val;

		},
		content(val) {
			this.$emit('input', val);
		}
	},
	methods: {
		handleInput(val, event) {
			if (val && val.length < 100) {
				this.$nextTick(() => this.content = '');
			}
		},
		handleClear() {
			this.content = '';
		},
		handlePaste() {
			if (this.content) this.content = '';
			setTimeout(() => {
				const text = this.content;
				if (!text) return;
				const length1 = (text.match(/企查查/g) || []).length;
				const length2 = (text.match(/天眼查/g) || []).length;
				if (text.length < 500 || (length1 < 5 && length2 < 5)) {
					Confirm.popup({ msg: "未识别到正确的数据，请检查后再复制粘贴，谢谢您的合作！", okText: '确定，并清空信息' }).then(() => {
						this.content = '';
					}).catch((e) => { e && console.error(e); });
					return;
				}
				const info = getInfo(text);
				// 检查是否有数据
				if (!info.company_name || !objRegex.validCompanyName.regex.test(info.company_name)) {
					Confirm.popup({ 
						msg: "暂时无法提取到该平台的信息，建议更换到另一个平台复制客户信息，或联系OA项目部", 
						okText: '确定，并清空信息' 
					}).then(() => {
						this.content = '';
					}).catch((e) => { e && console.error(e); });
					return;
				}
				// 检查登陆
				if ((info.tel && info.tel.includes('*')) || (info.email && info.email.includes('*'))) {
					Confirm.popup({ msg: "检查到当前您未登录，请登录该平台后重新复制粘贴该客户的信息", okText: '确定，并清空信息' }).then(() => {
						this.content = '';
					}).catch((e) => { e && console.error(e); });
					return;
				}
				if (this.beforeLoadState) {
					const ok = this.beforeLoadState(info);
					if (!ok) return;
				}
				// 远程验证
				this.$request({
					url: "_SALE_CUSTOMER_CUSTOMER_STATUS_GET",
					type: "GET",
					param: {
						company_name: info.company_name
					},
					loading: false,
				}).then(({ data }) => {
					/**
					 *  {
							"can_save": 1,    // 是否可以保存
							"customer_id": 398798,    // 客户ID 如果系统存在的话
							"is_new": 0,    // 是否为新的数据 0 否 1 是
							"is_update": 0,    // 是否已经更新过 0 未更新过 1 已更新过
							"is_delete": 0,    // 是否删除  0 未删除 1 删除 2 黑名单 3 白名单
							"status": 0,    // 客户状态：0 未领取 1 已领取 2 已下单
							"tips": "",    // 不能保存的原因
							"change_times": 1,    // 转手次数
							"exist_time": 244    // 已经存在天数
						}
					 */
					this.$emit('get-info', { info, data, });
					// this.handleCustomerStatus(data, info);
				}).catch((res) => {
					console.error(res);
					this.$Message.error(res.msg);
				});
			}, 100);
		},
	}
};
</script>
<style lang="scss">
.v-sal-customer-paste-pane {
	.c-limit-words {
		._remain {
			display: none
		}
		textarea {
			border-radius: 0;
			resize: none;
		}
	}
	._clear-btn {
		border: 1px solid #e7e7e7;
		border-top: none;
		transition: color .2s ease;
		// &:hover{
		// 	color: #2296f9
		// }
	}
}
</style>