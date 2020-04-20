<template>
	<i-modal
		v-model="visible"
		:mask-closable="false"
		width="680"
		class-name="v-sale-main-rankings-all-zone"
		@on-ok="handleOk"
		@on-cancel="handleCancel">
		<div slot="header" class="g-flex g-jc-sb">
			<div class="g-tc _text-center">所有战区业绩排名</div>
			<div style="visibility: hidden;">
				<span>当前月份:</span>
				<span>2018-10</span>
				<span class="g-c-blue-light">重新选择</span>
			</div>
		</div>
		<div class="g-tc" style="margin-bottom: 16px;">
			<i-date-picker
				:value="value3"
				type="month"
				placeholder="选择日期"
				style="width: 220px;margin-right: 8px;"
				@on-change="handleChange"
			/>
			<vc-debounce-click :tag="Button" type="primary" @click="getData()">搜索</vc-debounce-click>
		</div>
		<div
			:style="{paddingRight:list.length>12?'15px':''}"
			class="g-flex _heard g-fs-12 g-c-black1">
			<div class="g-col">排名</div>
			<div class="g-col">部门</div>
			<div class="g-col">业绩</div>
		</div>
		<div class="_body">
			<div v-for="(item,i) in list" :key="i" class="g-flex __table g-c-black2">
				<div class="g-col">{{ item.sort_count }}</div>
				<div class="g-col">{{ item.depart_name }}</div>
				<div class="g-col">{{ item.current_money }}</div>
			</div>
		</div>
		<div slot="footer"/>
	</i-modal>
</template>

<script type="text/ecmascript-6">
import { Modal, Form, FormItem, Input, Button, DatePicker } from 'iview';
import API from '@stores/apis/root';
import moment from 'moment';
import { CreatePortal } from 'wya-vc';

export default {
	name: "ed-target",
	components: {
		"i-modal": Modal,
		"i-form": Form,
		"i-form-item": FormItem,
		"i-input": Input,
		"i-date-picker": DatePicker,
		"i-button": Button
	},
	data() {
		return {
			visible: false,
			open: false,
			list: '',
			value3: '',
			keyword: '',
		};
	},
	beforeCreate() {
		this.Button = Button;
	},
	mounted() {
		this.visible = true;
		let i = moment().format('YYYY-MM');
		this.value3 = i;
		this.getData();
	},
	methods: {
		handleSave() {
			this.visible = false;
		},
		getData() {
			this.$request({
				url: API._SALE_MAIN_ACHIEVEMENT_ZONE_ORDER_GET,
				type: "get",
				param: {
					month: this.value3
				}
			})
				.then(res => {
					this.list = res.data.zone_list;

				})
				.catch(error => {
					console.error(error);
				});
		},
		handleNull() {
			this.visible = false;
		},

		// 日历选择
		handleOpen() {
			this.open = !this.open;
		},
		handleChange(date) {
			this.value3 = date;
			this.open = false;
			// 设置初始时间；
		},
		handleSearch() {
			this.getData();
		},
		handleClear() {
			this.open = false;
		},
		handleDateClase() {
			this.open = false;
		},
		handleDateOk() {
			this.open = false;
		},
		handleOk() {
			/**
			 * v-model会默认被触发，要由该组件控制，给组件i-modal传值 loading: true
			 */
			// this.visible = false;
			this.$emit('sure');
		},
		handleCancel() {
			// this.visible = false;
			this.$emit('close');
		},
		handleDetail() {
			this.$router.push({ name: "full-casedetail" });
		}
	}
};
export const AllZone = CreatePortal({}, module.exports.default);
</script>

<style  lang="scss">
.v-sale-main-rankings-all-zone{
	._text-center{
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
	}
	._heard {
		padding-left: 60px;
		height: 40px;
		line-height: 40px;
		background: #f0f4fc;
		& > div {
			text-align: left;
		}
	}
	._body{
		max-height: 300px;
		overflow-y:auto;
        .__table {
			padding-left:60px;
            height: 38px;
            line-height: 38px;
            & > div {
                text-align: left;
            }
        }
        .__:nth-child(2n) {
            background: #fafafa;
        }
	}
}
</style>
