<template>
	<i-modal
		v-model="visible"
		:mask-closable="false"
		width="680"
		class-name="v-sale-main-rankings-lower-depart"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div slot="header" class="g-flex g-jc-sb">
			<div class="g-fl">
				<span class="g-c-blue-light">当前月份:</span>
				<span class="g-operation">
					<i-date-picker
						:open="open"
						:value="value3"
						type="month"
						@on-change="handleChange"
						@on-clear="handleDateClose"
						@on-ok="handleDateOk"
						@on-open-change="handleOpenChange"
					>
						<a href="javascript:void(0)" @click="handleOpen">
							<template v-if="value3 === ''">2018-10</template>
							<template v-else>{{ value3 }}</template>
						</a>
					</i-date-picker>
				</span>
			</div>
			<div class="g-tc _text-center">所有部门业绩排名</div>
			<div style="visibility: hidden;">
				<span>当前月份:</span>
				<span>2018-10</span>
				<span class="g-c-blue-light">重新选择</span>
			</div>
		</div>
		<div class="g-flex">
			<div class="g-col g-m-r-20">
				<div class="_title g-m-b-20">
					<span>我的下级部门业绩排行</span>
				</div>
				<div
					:style="{paddingRight:list.length>12?'15px':''}"
					class="g-flex _heard g-fs-12 g-c-black1"
				>
					<div class="g-col">排名</div>
					<div class="g-col">战区</div>
					<div class="g-col">业绩</div>
				</div>
				<div class="_body">
					<div
						v-for="(item,i) in list"
						:key="i"
						class="g-flex g-fs-12 __table g-c-black2"
					>
						<div class="g-col">{{ item.sort_count }}</div>
						<div class="g-col">{{ item.depart_name }}</div>
						<div class="g-col">{{ item.current_money }}</div>
					</div>
				</div>
			</div>
			<div class="g-col" style="padding-left:20px">
				<div class="_title g-m-b-20">
					<span>所有下级部门业绩排行</span>
				</div>
				<div class="g-tc g-m-b-10">
					<i-input v-model="keyword" placeholder="请输入部门名称" style="width:200px"/>
					<vc-debounce-click :tag="Button" type="primary" @click="getData()">搜索</vc-debounce-click>
				</div>
				<div
					:style="{paddingRight:brothers_list.length>12?'15px':''}"
					class="g-flex _heard"
				>
					<div class="g-col">排名</div>
					<div class="g-col">部门</div>
					<div class="g-col">业绩</div>
				</div>
				<div class="_body">
					<div
						v-for="(item,i) in brothers_list"
						:key="i"
						class="g-flex __table g-c-black1"
					>
						<div class="g-col">{{ item.sort_count }}</div>
						<div class="g-col">{{ item.depart_name }}</div>
						<div class="g-col">{{ item.current_money }}</div>
					</div>
				</div>
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
		"i-date-picker": DatePicker
	},
	data() {
		return {
			visible: false,
			open: false,
			list: '', // 我的下级部门
			brothers_list: '', // 所有下级
			value3: '',
			keyword: '',
		};
	},
	beforeCreate() {
		this.Button = Button;
	},
	mounted() {
		this.value3 = moment().format('YYYY-MM');
		this.visible = true;
		this.getData();
	},
	methods: {
		handleOpenChange(v) {
			this.open = v;
		},
		handleSave() {
			this.visible = false;
		},
		getData() {
			this.$request({
				url: API._SALE_MAIN_ACHIEVEMENT_DEPART_ORDER_GET,
				type: "get",
				param: {
					month: this.value3,
					keyword: this.keyword
				}
			}).then(res => {
				this.list = res.data.lowest_depart_list;
				this.brothers_list = res.data.brothers_lowest_depart_list;
			}).catch(error => {
				console.error(error);
			});
		},
		handleDateClose() {
			this.open = false;
		},
		handleDateOk() {
			this.open = false;
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
			this.getData();
		},
		handleClear() {
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
export const LowerDepart = CreatePortal({}, module.exports.default);
</script>

<style  lang="scss">
.v-sale-main-rankings-lower-depart{
    ._text-center {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
    }
    ._heard {
        height: 40px;
        line-height: 40px;
        background: #f0f4fc;
        & > div {
            text-align: center;
        }
    }
    ._title {
        padding-left: 15px;
        border-left: 2px solid red;
    }
    ._body {
        max-height: 300px;
        overflow-y: auto;
        .__table {
            height: 38px;
            line-height: 38px;
            & > div {
                text-align: center;
            }
        }
        .__table:nth-child(2n) {
            background: #fafafa;
        }
    }
}
</style>
