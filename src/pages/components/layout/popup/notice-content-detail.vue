<template>
	<div class="v-notice-detail">
		<div>
			<vc-paging
				ref="tableTarget"
				:data-source="listInfo.data"
				:total="listInfo.total"
				:load-data="loadData"
				:history="false"
				:page-opts="{showElevator:false,showSizer:true}"
				mode="piece"
				class="g-m-t-20 _notice-detail-list g-pd-20"
				@page-size-change="handleSizeChange"
				@page-change="handlePageChange"
			>
				<template slot-scope="slotProps">
					<div class="g-flex" >
						<i-checkbox
							v-model="listInfo.data[page][slotProps.index].checked"
							:label="slotProps.msg_id"
							class="g-m-t-10"
							@on-change="handleNoticeCheck"
						/>
						<div
							class="_notice-detail-item g-flex g-ai-c"
							style="flex: 1"
							@click="slotProps.is_read !== 1 && handleClick(slotProps.msg_id)">
							
							<div style="width:100px" class="g-flex">
								<span
									:style="{ background: slotProps.is_read === 1 ? '#b5bfce' : '#e74854' }"
									class="__circle g-m-t-5" 
								/>
								<span class="g-col">{{ slotProps.create_time }}</span>
							</div>
							<div class="g-col" @click="handleContent(slotProps.url_type)">{{ slotProps.content }}</div>
						</div>
					</div>
					
					
				</template>
				<div slot="extra">
					<div style="marginLeft:-18px">
						<i-checkbox
							v-model="isAll"
							@on-change="handleIsAll"/>
						<span style="marginLeft:-4px">全选</span>
						<vc-debounce-click
							class="g-gray-btn-line g-m-l-10"
							@click="handleMultiDelete">
							批量删除
						</vc-debounce-click>
						<span
							:style="{ background: listInfo.count === 0 ? '#b5bfce' : '#e74854' }"
							class="__circle g-m-l-20" />
						<span
							:class="{__all: listInfo.count !== 0}"
							@click="handleAllRead">全部设为已读</span>
					</div>
					
				</div>
			</vc-paging>
		</div>
	</div>
</template>

<script>
import { Paging } from 'wya-vc';
import { Checkbox, CheckboxGroup } from 'iview';
import { Confirm } from "@components/_common/confirm/confirm";
import API_ROOT from '@stores/apis/root';
import { getParseUrl, getHashUrl } from "@utils/utils";

export default {
	name: "notice-detail",
	components: {
		'vc-paging': Paging,
		'i-checkbox': Checkbox,
		'i-checkbox-group': CheckboxGroup,
	},
	props: {
		data: Object,
	},
	data() {
		return {
			page: 1,
			pageSize: 10,
			isAll: false,
			listInfo: {
				data: {}
			},
			checkAllGroup: []
		};
	},
	computed: {},
	created() {
	},
	methods: {
		loadData(page, pageSize) {
			this.page = page;
			this.pageSize = pageSize;
			return this.$request({
				url: API_ROOT._NOTICE_INFO_LIST_GET,
				type: 'GET',
				loading: false,
				param: {
					type: this.data && this.data.type ? this.data.type : '',
					page,
					pageSize
				},
			}).then(res => {
				this.$emit('save', res.data.no_read_count);
				this.listInfo = {
					...this.listInfo,
					total: res.data.totalCount,
					count: res.data.no_read_count,
					data: {
						...this.listInfo.data,
						[page]: res.data.list.map(i => ({ ...i, checked: false }))
					}
				};
				if (!res.data.list.length) {
					this.$nextTick(() => {
						this.$refs.tableTarget.currentPage = 1;
					});
				}
				
			}).catch(err => {
			});
		},
		handleBack() {
			this.$emit('clear');
		},
		handleClick(id) {
			this.$request({
				url: API_ROOT._COMMON_NOTICE_SET_READ_POST,
				type: 'POST',
				loading: false,
				param: {
					msg_id: id
				}
			}).then(res => {
				this.$store.commit('NOTICE_COUNT_SET', res.data.count);
				this.loadData(this.page, this.pageSize);
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		handleAllRead() {
			this.listInfo.count > 0 && this.$request({
				url: API_ROOT._NOTICE_ALL_READ_POST,
				type: 'POST',
				loading: false,
				param: {
					type: this.data && this.data.type ? this.data.type : '',
				}
			}).then(res => {
				this.$store.commit('NOTICE_COUNT_SET', res.data.count);
				this.loadData(1, this.pageSize);
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		handleSizeChange(size) {
			this.page = 1;
			this.pageSize = size;
			this.isAll = false;
			this.loadData(this.page, this.pageSize);
		},
		handleContent(url = '') {
			if (!url) return;
			const urlPath = url.split('?')[0];
			if (!urlPath) return;
			let { path } = getParseUrl();
			this.$router.push(url);
			this.$emit('close');
			if (urlPath == path.join('/')) {
				this.$vc.emit('query-notices-url-change');
			}
		},
		handleIsAll(val) {
			this.listInfo.data[this.page].forEach(item => {
				item.checked = val;	
			});
			this.$forceUpdate();
		},
		handleNoticeCheck() {
			const checkAll = !this.listInfo.data[this.page].find(i => !i.checked);
			this.isAll = checkAll;
		},
		handlePageChange(_page) {
			Object.keys(this.listInfo.data).forEach(page => {
				this.listInfo.data[page].forEach(i => {
					i.checked = false;
				});
			});
			this.isAll = false;
			this.page = _page;
		},
		handleMultiDelete() {
			let arr = [];
			arr = this.listInfo.data[this.page].filter(i => i.checked).map(i => i.msg_id);
			if (arr.length) {
				Confirm.popup({
					title: "",
					msg: "是否删除选择的消息通知，删除后不可恢复。",
					content: "是否删除选择的消息通知，删除后不可恢复。",
					showIcon: true
				}).then(() => {
					this.$request({
						url: API_ROOT._NOTICE_ALL_DELETE_POST,
						type: 'POST',
						loading: false,
						param: {
							msg_ids: arr.join(','),
						}
					}).then(res => {
						this.$store.commit('NOTICE_COUNT_SET', res.data.count);
						this.$Message.success(res.msg);
						this.loadData(1, this.pageSize);
						this.isAll = false;
					}).catch(err => {
						this.$Message.error(err.msg);
					});
				});
			} else {
				this.$Message.warning('请选择消息再进行删除操作~');
			}
		},
	}
};
</script>

<style lang="scss">
.v-notice-detail {
	._notice-detail-list {
		padding-top: 0px;
		._notice-detail-item {
			color: #818794;
			background: #f5f5f6;
			margin-bottom: 10px;
			padding: 10px 15px;
		}

		._notice-detail-item:hover {
			cursor: pointer;
		}
	}
	.__circle {
				display: inline-block;
				width: 8px;
				height: 8px;
				border-radius: 50%;
				margin-right: 10px;
			}
	.__all:hover {
		cursor: pointer;
	}
}
.v-notice-detail .vc-paging .__footer {
	width: 940px !important;
}
</style>
