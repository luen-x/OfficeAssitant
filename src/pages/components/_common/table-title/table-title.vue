<template>

	<i-modal
		ref="modal"
		v-model="visible"
		:width="680"
		:mask-closable="false"
		:loading="true"
		class="v-table-title"
		@on-ok="handleSave"
		@on-cancel="handleCancel"
	>
		<div slot="header" class="g-tc">
			请选择表头
		</div>
		<div>
			<div>
				<div class="g-m-l-10 g-m-b-10">
					<span style="color: #4b4f57">已选择</span>
					<span style="color: #818794">（可通过拖拽移动表头顺序）</span>
				</div>
				<vc-sort-list
					v-model="dataSource"
					:mask="false"
					value-key="key"
					draggable-key="is_optional"
				>
					<template slot-scope="it">
						<oa-default-title
							v-if="!it.is_optional"
							:data="it" />
						<oa-show-title
							v-if="it.is_optional"
							:data="it"
							style="cursor:move"
							@hide="(key) => handleEdit('dataSource', 'dataOther', key)"
						/>
					</template>
				</vc-sort-list>
			</div>
			<i-divider />
			<div>
				<div class="g-m-l-10 g-m-b-10" style="color: #4b4f57">未选择</div>
				<div class="g-flex g-fw-w">
					<oa-hide-title
						v-for="item of dataOther"
						:key="item.key"
						:data="item"
						@add="(key) => handleEdit('dataOther', 'dataSource', key)"
					/>
				</div>
			</div>
		</div>
		<!-- <div slot="footer" class="g-tc">
			<i-button
				class="g-m-l-10"
				@click="handleCancel"
			>
				取消
			</i-button>
			<i-button
				type="primary"
				class="g-m-l-10"
				@click="handleSave"
			>
				保存并生效
			</i-button>
		</div> -->
	</i-modal>

</template>

<script>
import { Modal, Button, Divider } from 'iview';
import { CreatePortal, SortList } from 'wya-vc';
import { debounce } from 'lodash';
import DefaultTitle from './show-default-title';
import ShowTitle from './show-title';
import HideTitle from './hide-title';

export default {
	name: 'table-title',
	components: {
		'i-modal': Modal,
		'i-button': Button,
		'i-divider': Divider,
		'vc-sort-list': SortList,
		'oa-default-title': DefaultTitle,
		'oa-show-title': ShowTitle,
		'oa-hide-title': HideTitle
	},
	props: {
		dataShow: { // 显示的列
			type: Array,
			default: () => (
				 [
					{
						"key": "staff_name",
						"value": "员工姓名",
						"is_optional": false
					},
					{
						"key": "sex",
						"value": "员工性别",
						"is_optional": false
					},
					{
						"key": "mobile",
						"value": "员工电话",
						"is_optional": true
					},
					{
						"key": "sex1",
						"value": "员工性别1",
						"is_optional": true
					},
					{
						"key": "mobile1",
						"value": "员工电话1",
						"is_optional": true
					},
					{
						"key": "sex2",
						"value": "员工性别2",
						"is_optional": true
					},
					{
						"key": "mobile2",
						"value": "员工电话2",
						"is_optional": true
					}
				]
			)
		},
		dataHide: Array, // 隐藏的列
		saveUrl: String, // 保存时请求的地址
		mutation: String, // 保存数据到vuex时的mutation
		type: { // 所在的tab的type
			type: String,
			default: '1'
		},
		scenario: Number, // 保存数据时的场景
		params: {			// 保存时的参数
			type: Object,
			default() {
				return {};
			}
		}
	},
	data() {
		return {
			visible: false,
			dataSource: this.dataShow.map(it => ({ ...it, is_optional: !!it.is_optional })),
			dataOther: [...this.dataHide]
		};
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk() {
			this.visible = false;
			this.$emit('sure');
		},
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		},
		handleEdit(handeArr, targetArr, key) {
			const dataItem = this[handeArr].filter(item => item.key === key)[0];
			this[handeArr] = this[handeArr].filter(item => item.key !== key);
			this[targetArr].push(dataItem);
		},

		handleSave: debounce(function () {
			this.$request({
				url: this.saveUrl,
				type: "POST",
				param: {
					fields: this.dataSource.map(col => col.key),
					type: this.type,
					scenario: this.scenario,
					...this.params
				},
				loading: false,
			}).then(res => {
				this.$Message.success(res.msg);
				this.$store.commit(this.mutation, {
					title_show: this.dataSource,
					title_hide: this.dataOther,
					type: this.type,
				});
				this.handleOk();
			}).catch((res) => {
				this.$refs.modal.buttonLoading = false;
				this.$Message.error(res.msg);
			});
		}, 200)
	}
};

export const TableTitle = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.v-table-title{
	.vc-sort-list > div{
		cursor:auto
	}
	.ivu-divider-horizontal {
		margin: 15px 0 !important;
	}
}
</style>


