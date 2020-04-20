<template>
	<div class="v-tech-share-notice-content g-pd-t-20">
		<div class="g-m-l-20 g-flex _content">
			<div v-if="noticeList.length > 0" class="g-rb __left">
				<div
					v-for="(item,index) in noticeList"
					:key="index"
					:style="{'border-bottom': item.show ? '' : '1px solid #f5f5f6',color: item.show ? '#2397f9' : '#333333'}"
					class="g-pointer"
				>
					<div @click="handleToggle(`expand_${index}`,item)">
						<div
							:style="{'background': item.show ? 'rgba(35, 151, 249, 0.1)' : '#ffffff'}"
							class="g-flex g-flex-ac g-jc-sb g-pd-lr-20 __title"
						>
							<span class="g-fs-14">
								{{ item.project_name }}
							</span>
							<i
								:class="item.show ? 'icon-down' : 'icon-up'"
								class="iconfont g-fs-16"
							/>
						</div>

						<vc-expand :ref="`expand_${index}`" v-model="item.show">
							<div>
								<div v-if="item.count > 0">
									<div
										v-for="(element,id) in item.list"
										:key="'i' + id"
										class="g-flex g-c-black __contents"
										@click="handleChange($event,element.notice_id)"
									>
										<div class="g-m-l-20" style="width: 100%;border-bottom: 1px solid #f5f5f6;">
											<div 
												:style="{'color': noticeId == element.notice_id ? '#2397f9' : '#333333'}"
												class="g-pd-t-15 g-fs-12"
											>
												{{ element.show }}{{ element.title }}
											</div>
											<div class="g-m-t-15 g-fs-12" style="color: #666666;">
												{{ element.update_time }}
											</div>
										</div>
									</div>
									<div 
										v-if="noticeList[index].totalCount > 10 && noticeList[index].list.length < noticeList[index].totalCount" 
										class="g-pointer g-fs-12 g-c-blue-mid g-m-l-20 g-m-tb-15"
										@click="handleAdd(item,index)"
									>
										加载更多
									</div>
								</div>
								<div v-else class="g-tc g-c-black g-bb g-pd-l-20 g-pd-t-30 __contents">
									暂无数据
								</div>
							</div>
						</vc-expand>
					</div>
				</div>
			</div>

			<div v-if="detail[noticeId]" class="g-m-lr-20" style="width: 80%;">
				<div class="g-fs-18 g-c-black2 g-pd-t-20">
					{{ detail[noticeId].title }}({{ detail[noticeId].update_time }})
				</div>
				<div class="g-fs-12 g-m-tb-20" style="color: #666666;">
					发布时间：{{ detail[noticeId].update_time }}
				</div>
				<oa-editor-preview
					:content="detail[noticeId].text"
					max-height="88%"
				/>
			</div>
		</div>
	</div>
</template>

<script>
import { Expand } from 'wya-vc';
import EditorPreview from '@common/editor-preview/editor-preview';

export default {
	name: 'oa-share-notice',
	components: {
		'vc-expand': Expand,
		'oa-editor-preview': EditorPreview
	},
	data() {
		return {
			detail: {},
			noticeList: [],
			noticeId: "",
			pageSize: 10,
			page: 1,
			flag: true
		};
	},
	mounted() {
		this.loadData();
	},
	methods: {
		loadData() {
			this.$request({
				url: "_TECH_SHARE_NOTICE_GET",
				type: "GET",
				param: {}
			}).then(res => {
				res.data.forEach((item, index) => {
					item.show = false;
					item.list = [];
					this.noticeList.push(item);
				});

				if (this.$route.query.project_id) {
					for (let i = 0; i < this.noticeList.length; i++) {
						if (+this.noticeList[i].project_id === +this.$route.query.project_id) {
							this.handleToggle(`expand_${i}`, this.noticeList[i]);
							break;
						}
					}
				}
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},

		async loadNoticeData(v, index, $event) {
			return this.$request({
				url: "_TECH_SHARE_NOTICE_LIST_GET",
				type: "GET",
				param: {
					project_id: v.project_id,
					pageSize: this.pageSize,
					page: this.page
				}
			}).then(res => {
				this.noticeList[index].list.push(...res.data.list);
				this.noticeList[index].totalCount = res.data.totalCount;

				if (this.flag) {
					this.$route.query.notice_id && this.handleChange($event, this.$route.query.notice_id);
					this.flag = false;
				}
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},

		async handleToggle(value, v) {
			let id = value.split('_')[1];

			if (v.count != 0 && this.noticeList[id].totalCount != this.noticeList[id].list.length 
			&& this.noticeList[id].list.length === 0 && !v.show) {
				await this.loadNoticeData(v, id);
			}

			this.noticeList.forEach((item, index) => {
				if (+id != index) {
					this.$nextTick(() => {
						item.show == true && this.$refs[`expand_${index}`][0].toggle();
						item.show = false;
					});
				} else {
					this.$nextTick(() => {
						this.$refs[value][0].toggle();
					});
				}
			});
		},

		handleAdd(v, index, $event) {
			event.stopPropagation();
			this.page++;
			this.loadNoticeData(v, index);
		},

		handleChange($event, notice_id) {
			event.stopPropagation();
			this.page = 1;

			this.$request({
				url: "_TECH_SHARE_NOTICE_DETAIL_GET",
				type: "GET",
				param: {
					notice_id
				}
			}).then(res => {
				this.noticeId = notice_id + '';
				this.detail[notice_id + ''] = res.data;
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		}
	}
};
</script>

<style lang="scss">
.v-tech-share-notice-content{
	background: #fafafa;
	height: 100%;

	._content{
		width: 98%;
		height: 100%;
		background: #ffffff;

		.__left{
			width: 300px;
			height: 100%;
			border-right: 1px solid #F2F2F2;
			overflow-y: auto;
			.__title{
				height: 40px;
				line-height: 40px;
			}

			.__contents{
				height: 70px;

				&:hover{
					background: rgba(35, 151, 249, 0.1);
				}
			}
		}
	}
}
</style>