<template>
	<div class="v-academy-train-detial-group-member-modal">
		<i-modal
			ref="modal"
			v-model="visible"
			:width="680"
			:loading="true"
			@on-ok="handleOk"
			@on-cancel="handleCancel"
		>
			<div slot="header" class="g-tc">
				编辑组员
			</div>
			<div class="_content">
				<div class="g-m-t-10 g-m-b-20">
					<i-input
						v-model="search" 
						placeholder="请输入姓名进行搜索" 
						style="width: 320px" 
						class="g-m-r-5"
						clearable
						@on-change="handleTextChange"
						@on-enter="handleSearch"
					/>
					<i-button 
						type="primary"
						class="g-red-btn-small"
						@click="handleSearch"
					>
						搜索
					</i-button>
				</div>
				<i-table 
					ref="tableTarget" 
					:columns="columns"
					:data="list" 
					:height="400"
					stripe
					@on-selection-change="handleSelectChange"
				/>
				<div class="__btn-box">
					<i-page 
						:total="totalCount"
						:current="currentPage"
						:page-size="pageSize"
						show-total 
						show-sizer
						class="__page g-fr"
						@on-change="handleChange"
						@on-page-size-change="handlePageSizeChange"
					/>
				</div>
			</div>
		</i-modal>
	</div>
</template>

<script>
import { chunk } from 'lodash'; 
import { Table, Message, Modal, Page, Input, Button } from 'iview';
import { CreatePortal, ImgsPreview } from 'wya-vc';
import AutoToolTip from "@components/_common/auto-tooltip/auto-tooltip";

import API_ROOT from '@stores/apis/root';

export default {
	name: 'sc-service-detail-modal',
	components: {
		'i-table': Table,
		'i-modal': Modal,
		'i-page': Page,
		'i-input': Input,
		'i-button': Button
	},
	props: {
		datas: Array
	},
	data() {
		return {
			search: '',
			visible: false,
			columns: [
				{
					type: 'selection',
					minWidth: 50,
					align: 'center'
				},
				{
					title: '姓名',
					key: 'staff_name',
					minWidth: 150,
				},
				{
					title: '手机',
					key: 'mobile',
					minWidth: 120
				},
				{
					title: '组名',
					key: 'group_name',
					minWidth: 120,
					render: (h, params) => {
						let group_name = params.row.group_name;
						return (
							<AutoToolTip 
								content={group_name}
								width="100px"
								theme="dark"
								placement="bottom" 
								labelClass=" "
							/>
						);
					}
				}
			],
			tableList: this.datas,
			list: [],
			selected: [],
			loading: false,
			pageSize: 10,
			totalCount: 0,
			currentPage: 1,
		};
	},
	mounted() {
		this.visible = true;
		this.initData();
	},
	methods: {
		fuzzyQuery(list, keyWord) {
			let reg = new RegExp(keyWord);
			let arr = [];
			for (let i = 0; i < list.length; i++) {
				if (reg.test(list[i].staff_name)) {
					arr.push(list[i]);
				}
			}
			return arr;
		},
		handleSearch() {
			let searchArr = this.fuzzyQuery(this.tableList, this.search);
			this.list = chunk(searchArr, this.pageSize)[this.currentPage - 1];
			this.totalCount = searchArr.length;
		},
		handleTextChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},
		initData() {
			if (this.tableList.length < this.pageSize) {
				this.list = this.tableList;
			} else {
				this.list = chunk(this.tableList, this.pageSize)[this.currentPage - 1];
			}
			this.totalCount = this.tableList.length;
		},
		handleOk() {
			this.visible = false;
			this.$emit('sure', this.selected);
		},
		handleCancel() {
			this.$emit('close');
		},
		handleSelectChange(val) {
			this.selected = val;
		},
		handleChange(page) {
			this.list = chunk(this.tableList, this.pageSize)[page - 1];
		},
		handlePageSizeChange(size) {
			this.pageSize = size;
			this.initData();
			this.handleSearch();
		},
	}
};
export const MemberModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.v-academy-train-detial-group-member-modal {
	._content {
		.__btn-box {
			width: 100%;
			height: 70px;
			position: fixed;
			background-color: #fff;
			bottom: 0;
			padding: 0 16px;
			margin: 15px 0 30px 0;
			.__page {
				margin-top: 10px;
				padding: 0px 0px;
				float:right
				.ivu-page-total {
					margin-right: 5px !important;
				}
			}
		}
	}
}
</style>


