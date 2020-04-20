<template>
	<div class="v-content-circle-list-detail g-flex g-jc-c g-m-tb-20">
		<div style="width: 800px;">
			<div class="g-fs-16" style="font-weight:600">
				{{ info.title || '--' }}
				<vc-copy :value="text" @after="handleAfterCopy">
					<i-button
						class="g-m-r-5 g-fr"
					>
						复制内容
					</i-button>
				</vc-copy>
				<oa-star 
					v-if="canCollect" 
					:source-id="info.circle_id" 
					:source-type="2"
					:collection-id="info.collection_id"
					class="g-fr g-m-r-10" 
					@change="handleStarChange">
					<i-button type="primary">{{ info.collection_id?'已收藏':'收藏' }}</i-button>
				</oa-star>
			</div>
			<div class="g-c-black7 g-m-tb-20 g-pd-b-20" style="border-bottom:1px solid #EBEBEB">
				<span>{{ info.staff_name }}</span>
				<span class="g-m-l-30" >{{ info.create_time }}</span>
			</div>
			<oa-editor-preview :content="info.content || ''" height="auto" />
			<div style="border-top:1px solid #EBEBEB" class="g-m-t-20 g-pd-t-10">
				<div class="g-m-b-10">
					<span class="g-pd-l-5" style="font-weight:600">附件下载：</span>  
					<span v-if="info.attachment_list.length" class="g-operation" @click="handleDownloadAll">一键下载</span>
				</div>
				<oa-upload
					v-model="info.attachment_list"
					:max="20"
					:show-title="true"
					style="width: 520px"
					placeholder="请上传凭证"
					disabled
				/>
			</div>
		</div>
	</div>
</template>
<script>
import { Input, Button } from 'iview';
import { Copy } from 'wya-vc';

import EditorPreview from '@common/editor-preview/editor-preview';
import Upload from '@common/upload/upload';
import { setData, getPlainText } from '@components/sale/_common/util';
import downloadFile from '@utils/download';
import Star from '@components/collect/_common/comp/star';

export default {
	name: 'oa-',
	components: {
		'i-input': Input,
		'i-button': Button,
		'oa-editor-preview': EditorPreview,
		'oa-upload': Upload,
		'oa-star': Star,
		'vc-copy': Copy
	},
	props: {
		canCollect: Boolean

	},
	data() {
		return {
			info: {
				circle_id: this.$route.query.circle_id,
				collection_id: "",
				title: '',
				staff_name: '',
				create_time: '',
				content: '',
				attachment_list: []
			}
		};
	},
	computed: {
		text() {
			return getPlainText(this.info.content || '');
		}

	},
	created() {
		this.loadData();
	},
	methods: {
		loadData() {
			if (this.info.circle_id) {
				this.$request({
					url: "_CONTENT_CIRCLE_DETAIL_GET",
					type: "GET",
					param: { circle_id: this.info.circle_id },
					loading: false,
				}).then(res => {
					setData(this.info, res.data);
				}).catch((res) => {
					this.$Message.error(res.msg);
				});
			} else {
				console.error('缺少路由参数 circle_id');
			}
		},
		handleDownloadAll() {
			this.info.attachment_list.forEach(i => {
				downloadFile({
					fileName: i.url
				});
				
			});
		},
		handleStarChange(data) {
			this.info.collection_id = data.collection_id;

		},
		handleAfterCopy() {
			this.$Message.success('复制成功');
			
		},
	}
};
</script>
<style lang="scss">
.v-content-circle-list-detail {

}
</style>