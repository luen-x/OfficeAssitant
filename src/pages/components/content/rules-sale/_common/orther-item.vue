<template>
	<div class="v-content-rules-sale-orther-item ">
		<div>
			<span class="g-fs-16 g-c-red-mid"><span class="_border g-m-r-10"/>{{ title }}</span>
			<span v-if="!edit" class="g-operation _show" @click="()=>{edit=!edit}">编辑</span>
			<template v-else>
				<span class="g-operation" @click="handleSave">保存</span>
				<span class="g-operation" @click="handleCancel">取消</span>
			</template>
		</div>
		<div v-if="edit " class="g-m-t-20 g-m-l-20 g-red-btn-line _custom" @click="handleCustom">+自定义</div>
		<div class="g-flex g-m-l-20 g-m-t-20 g-fw-w" >
			<div
				v-for="(item,index) in baseList"
				v-show="item.is_delete!=1"
				:key="index"
				:class="{'__active-item':item.selected==1||selected}"
				class="__item g-flex-cc g-m-b-20"
				@click="handleSelect(item,index)">
				<oa-auto-tooltip v-if="item.frequency" :content="item.frequency+'次/人/天'" label-class="g-c-black-3" width="70px"/>
				<oa-auto-tooltip v-if="item.reason" :content="item.reason" label-class="g-c-black-3" width="70px"/>
				<div v-if="item.depart_names" >
					{{ item.depart_names.join('、') }}：{{ item.staff_names.join('、') }}
				</div>
				<i
					v-if="edit"
					style="font-size: 12px;position: absolute; right: 5px; cursor: pointer;"
					class="icon iconfont icon-icon-test g-pointer"
					@click.stop="handleDelete(item)"/>
			</div>
		</div>
	</div>
</template>

<script>
import autoTooltip from '@components/_common/auto-tooltip/auto-tooltip';
import { Confirm } from '@components/_common/confirm/confirm';
import { AddRules } from "../popup/add-rules";


export default {
	components: {
		'oa-auto-tooltip': autoTooltip
	},
	props: {
		title: {
			type: String,
			default: '“错误关联”举报次数限制'
		},
		type: {
			type: String,
			default: ''
		},
		selectList: {
			type: Array,
			default() {
				return ['15 次/人/天', '20 次/人/天', '30 次/人/天'];
			}
		},
		api: {
			type: String,
			default: ''
		},
		selected: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			activated: '1',
			edit: false,
			baseList: JSON.parse(JSON.stringify(this.selectList)) || []
		};
	},
	watch: {
		selectList(newVal) {
			this.baseList = JSON.parse(JSON.stringify(newVal));
		}
	},
	methods: {
		handleSelect(item) {
			if (this.edit && item.selected === 0) {
				this.baseList.forEach(ele => {
					ele.selected = 0;
				});
				item.selected = 1;
			}
		},
		handleDelete(item) {
			if (item.selected) { this.$Message.error('选择的规则不能删除'); return; }
			item.is_delete = 1;
		},
		handleCustom() {
			const com1 = {
				"frequency": '', // 次数
				"selected": 0, // 是否选中
				"is_delete": 0, // 是否删除
			};
			const com2 = {
				"reason": "已注销", // 标记原因
				"is_delete": 0 // 是否删除
			};
			const com3 = {
				"reason": "已注销", // 标记原因
				"is_delete": 0 // 是否删除
			};
			const title = {
				record: '自定义-举报次数',
				relation: '自定义-举报次数',
				protect: '自定义-申请延长保护期原因',
				sign: '自定义-标记原因配置',
				audit: '跟进记录审核人设置',
			};
			const data = {
				record: { ...com1 },
				relation: { ...com1 },
				protect: { ...com2 },
				sign: { ...com2 },
				audit: {
					"depart_ids": [], // 战区
					"staff_ids": [], // 审核人
					"is_delete": 0 // 是否删除
				}
			};
			const label = {
				record: 'frequency',
				relation: 'frequency',
				sign: 'reason',
				protect: 'reason',

			};
			let validList = this.baseList.filter((ele) => !ele.is_delete) || [];
			if (validList.length > 9 && this.type != 'audit') { this.$Message.error("自定义规则最多添加10个"); return; }
			AddRules.popup({
				type: this.type,
				title: title[this.type],
				data: {}

			}).then(res => {
				let com = { ...data[this.type] };
				if (this.type == 'audit') {
					com.depart_ids = res.depart_ids;
					com.staff_ids = res.staff_ids;
					com.depart_names = res.depart_names;
					com.staff_names = res.staff_names;
				} else {
					com[label[this.type]] = res[label[this.type]];
				}
				this.baseList.push(com);
			}).catch();
		},
		handleCancel() {
			this.edit = false;
			this.baseList = JSON.parse(JSON.stringify(this.selectList));
		},
		handleSave() {
			let param = {
				record: {
					log: this.baseList
				},
				relation: {
					relation: this.baseList
				},
				protect: {
					protect: this.baseList
				},
				sign: {
					sign: this.baseList
				},
				audit: {
					audit: {
						...this.baseList,
						depart_names: '',
						staff_names: '',
					}
				},
			};
			this.$request({
				url: this.api,
				type: 'post',
				param: param[this.type]
			}).then((res) => {
				this.staffList = res.data;
				this.edit = false;
				this.$Message.success(res.msg);
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		}
	}
};
</script>

<style  lang="scss">
.v-content-rules-sale-orther-item{
	padding-bottom: 40px;
	._show{
		opacity: 0;
	}
	._show:hover{
		opacity: 1;
	}
	._border{
		display: inline-block;
		width: 2px;
		height: 14px;
		position: relative;
		top: 2px;
		background-color: #e84854;
	}
	.__item{
		padding-left:15px;
		padding-right:20px;
		height:28px;
		margin-right:10px;
		border-radius: 4px;
		color: #4B4F57;
		border: 1px solid #D9DCE0;
		position: relative;
		overflow: hidden;
	}

	._custom{
		width:80px;
		height:28px;
		text-align: center;
		padding: 0;
	}
	.__active-item{
		background:rgba(231,72,84,0.1);
		border:none;
		color: #e84c57;
		._ecllips{
			color: #e84c57 !important;
		}
	}
}
</style>
