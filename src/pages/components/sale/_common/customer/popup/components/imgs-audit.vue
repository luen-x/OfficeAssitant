<template>
	<div>
		<div class="g-pd-b-10 g-m-t-20" >
			<span class="_title-bar g-bg-red-mid" /> 
			<span class="g-fs-14 g-m-lr-5">{{ title }}</span>
			<span v-if="!disabledEdit" class="g-m-l-20">
				<span v-if="imgChanged" class="g-operation" @click="handleSave">保存</span>
				<span v-if="imgChanged" class="g-m-l-10" style="color:gray;cursor:pointer" @click="handleCancelEdit">取消</span>
			</span>
		</div>
		<template v-if="imgs_.length>0 || !disabledEdit " >
			<div style="min-height:80px" class="g-m-l-10">
				<oa-imgs-picker
					ref="imgPicker"
					v-model="imgs_"
					:disabled="disabledEdit"
					:max="10"
					reactive
					@change="handleImgChange"
					@error="handleError"
				/>
			</div>
			<div v-if="auditInfo" class="g-flex g-fw-w g-m-l-10" style="width:910px">
				<oa-info-item :content="auditInfo.status_name" label="审核状态"/>
				<oa-info-item :content="auditInfo.audit_staff_name" label="审核人" />
				<oa-info-item :content="auditInfo.audit_time" label="审核时间" />
				<oa-info-item 
					v-if="auditInfo.status!=1" 
					:content="auditInfo.audit_remark" 
					:label="(auditInfo.status==2?'通过':'驳回')+'说明'" 
					tooltip
				/>
			</div>
		</template>
		<div v-else class="g-tc g-m-t-20">
			<img :src="OSS_NO_MESSAGE05" style="width: 160px;height: 160px;">
			<p>该合同没有上传{{ title }}~</p>
		</div>
	</div>
</template>
<script>
import { debounce } from 'lodash';
import ImgsPicker from '@common/imgs-picker/imgs-picker';
import { OSS_NO_MESSAGE05 } from '@constants/constants';
import InfoItem from '../../../info-item';



export default {
	name: 'oa-',
	components: {
		'oa-imgs-picker': ImgsPicker,
		'oa-info-item': InfoItem,
	},
	props: {
		title: String,
		imgs: Array,
		auditInfo: Object,
		saveFn: Function,
		disabled: Boolean
	},
	data() {
		return {
			imgs_: this.imgs,
			imgChanged: false,
			orignImgs: [],
			OSS_NO_MESSAGE05
		};
	},
	computed: {
		disabledEdit() {
			return this.disabled || (this.auditInfo && this.auditInfo.status == 2);

		}
	},
	watch: {
		imgs(v) {
			this.imgs_ = v;

		}

	},
	methods: {
		handleImgChange() {
			this.imgChanged = true;
		},
		handleSave: debounce(function () {
			this.saveFn(this.$refs.imgPicker.$refs.imgPicker.data).then(res => this.imgChanged = !res).catch(err => err && console.error(err));
		}, 100),
		handleCancelEdit() {
			this.imgs_ = [...this.orignImgs];
			this.imgChanged = false;
		},
		setOriginImgs(imgs) {
			this.orignImgs = imgs;
		},
		handleError(err) {
			this.$Message.error(err.msg);
		},
	}
};
</script>
<style lang="scss">
</style>