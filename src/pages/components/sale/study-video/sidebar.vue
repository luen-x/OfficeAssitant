
<template>
	<div
		:style="{right:push?'0px':'-400px',width:push?'400px':'0px'}"
		class="v-sale-study-video-sidebar"
	>
		<div class="g-flex" style="margin-top:80px;margin-left:40px">
			<template v-for="(item,index) in lectures" >
				<div v-if="index===0" :key="index" class="g-flex">
					<div class="g-m-l-40">
						<img v-if="item.head_img" :src=" item.head_img " class="_img" alt>
						<img
							v-else
							class="_img"
							alt
						>
					</div>
					<div class="g-m-l-20 g-fs-16">
						<div class="g-m-t-10 g-m-b-10">
							<span>授课讲师:</span>
							<span>{{ item.staff_name }}</span>
						</div>
						<a
							v-if="currentAttachment.is_download"
							class="g-operation g-fs-14"
							@click="handleDownload(currentAttachment)"
						>点击下载</a>
					</div>
				</div>
			</template>
			<div v-if="lectures.length==0">
				<div class="g-flex">
					<div class="g-m-l-40">

						<img
							class="_img"
							alt
						>
					</div>
					<div class="g-m-l-20 g-fs-16">
						<div class="g-m-t-10 g-m-b-10">
							<span>授课讲师:</span>
							<span>无</span>
						</div>
						<a
							v-if="currentAttachment.is_download"
							class="g-operation g-fs-14"
							@click="handleDownload(currentAttachment)"
						>点击下载</a>
					</div>
				</div>
			</div>
		</div>
		<div v-show="0" class="g-flex g-fs-16" style=" margin-top:60px;background: rgba(0, 0, 0, 0.1); ">
			<template v-for="item in tabs" >
				<div
					:class="{_active:tabActive==item.value}"
					:key="item.value+'l'"
					class="g-col _tabPane"
					@click="handleActive(item.value)"
				>{{ item.label }}</div>
				<span v-if="item.value<3&&tabActive!=item.value&&tabActive!=2&&item.value!=tabActive-1" :key="item.value" class="_border"/>
			</template>
		</div>
		<div class="g-fs-14 g-m-t-20" style="max-height: 50vh;overflow-y: auto;padding-bottom: 20px;">
			<div
				v-for="(item,index) in studyData"
				:key="index"
				class="g-m-t-20"
				style="margin-left:40px"
			>
				<i class="iconfont icon-play1" style="margin-right:10px;display: inline-block"/>
				<span
					style="display: inline-block;margin-bottom: 10px;"
					class="g-pointer"
					@click="handlePreview(item.attachment[0],item.course_id,item.course_name,item.video_method,item.method,item.lectures)"
				>{{ item.course_name }}</span>
				<template v-for="(ele,i) in item.attachment">
					<div
						:key="i"
						:style="{ marginLeft:playing_file==ele.attachment_id?'':'20px'}"
						class="_point"
						style="margin-top:10px"
						@click="handlePreview(ele,item.course_id,item.course_name,item.video_method,item.method,item.lectures)"
					>
						<img
							v-if="playing_file==ele.attachment_id"
							:src="playing"
							style="height: 20px;"
							alt="">
						<oa-file-icon
							v-else
							:file-url="ele.attachment_url"
							style="margin-right:10px;display: inline-block"
						/>
						{{ ele.attachment_name?ele.attachment_name:'没有素材名称' }}
					</div>
				</template>
			</div>
		</div>
		<div :class="{_show:!push}" class="_right" @click="handleRetract">
			<i class="iconfont icon-triangle-right"/>
		</div>
		<oa-loading v-if="0&&loading"/>
		<div v-if="result.status==1" class="_footer-button">
			<vc-debounce-click
				:tag="Button"
				type="primary"
				class="g-m-l-20 g-m-t-5"
				@click="handleEidt"
			>重新编辑</vc-debounce-click>
		</div>
	</div>
</template>

<script type="text/ecmascript-6">
import API from "@stores/apis/root";
import { Tabs, TabPane, Input, Button } from 'iview';
import fileIcon from '@components/_common/file-icon/file-icon';
import { OSS_PLAYING } from '@constants/constants';
import { downloadFile } from '@utils/download';
import { Confirm } from '../../_common/confirm/confirm';
import { DownLoad } from './popup/download';

export default {
	name: "to-ticket",
	components: {
		"i-tabs": Tabs,
		"i-tabPane": TabPane,
		"i-input": Input,
		'oa-file-icon': fileIcon
	},
	props: {
		data: Object,
	},
	data() {
		const tabs = [
			{ label: "三立培训", value: "2" }
			// { label: "三立训练", value: "3" }
		];
		return {
			playing: OSS_PLAYING,
			playing_file: null,
			visible: false,
			loading: true,
			push: true,
			result: {},
			currentAttachment: {},
			lectures: [],
			tabs,
			tabActive: '2',
			studyData: [],
		};
	},
	beforeCreate() {
		this.Button = Button;
	},
	created() {
		let { query } = this.$route;
		this.loadData();
		// this.loadLecturerData(query.course_id);
	},
	mounted() {
		this.visible = true;

	},
	methods: {
		handleRetract() {
			this.push = !this.push;
		},
		handleDownload(file) {
			if (file.attachment_type == 2 && file.children.length > 0) {
				file.children.forEach(ele => {
					this.handleDownload(ele);
				});
			} else {
				downloadFile({ fileName: file.attachment_url });
			}
		},
		renderRow(h, params) {
			const { src, index } = params;
			return h('img', {
				attrs: {
					src: src + '!4-4',
					width: 70,
					height: 70,
				}
			});
		},
		handlePreview(data, course_id, name, video_method, method, lectures) {
			this.currentAttachment = data;
			if (lectures) this.lectures = lectures;
			this.playing_file = data.attachment_id || null;
			this.$emit('changeTitle', name);
			// this.loadLecturerData(course_id);
			data.video_method = video_method;
			data.method = method;
			this.$vc.emit('PREVIEW_FILE', data);
		},
		handleActive(v) {
			this.tabActive = v;
			this.loadData();
		},
		handleSave() {
			this.visible = false;
		},
		loadData() {
			this.$request({
				url: API._SALE_TRAIN_STUDY_ONLINE_STUDY_GET,
				type: "get",
				loading: false,
				param: {
					course_type: this.tabActive
				}
			}).then(res => {
				this.studyData = res.data;
				if (res.data.length > 0) {
					const value = res.data.find(ele => {
						return ele.course_id == this.$route.query.course_id;
					});
					this.lectures = value.lectures;
					this.handlePreview(value.attachment[0]);
				} else {
					this.lectures = [];
					this.handlePreview({});
				}
			}).catch(error => {
				console.error(error);
			});
		},
		handleNull() {
			this.visible = false;
		},
		getimgurl(array) {
			let i = [];
			array.forEach(ele => {
				i.push(ele.image_url);
			});
			return i;
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
		handleEidt() {
			this.$router.push({ name: "sale-ticket-apply", query: { invoice_id: this.data.invoice_id } });
		},
	}
};
</script>

<style  lang="scss">
    .v-sale-study-video-sidebar {
        position: relative;
        background: rgba(75, 79, 87, 1);
        color: #fff;
        width: 400px;
        transition: all 0.5s ease;
        ._point {
            cursor: pointer;
        }
        ._right {
            position: absolute;
			z-index: 999;
            top: 37%;
            width: 20px;
            height: 40px;
            background: rgba(0, 0, 0, 0.1);
            border-radius: 0px 4px 4px 0px;
            line-height: 40px;
            transition: all 0.5s ease;
        }
        ._show {
            right: 380px;
            transform: rotateY(180deg);
            transform-origin: left;
        }
        ._img {
            width: 76px;
            height: 76px;
            border-radius: 60%;
			background: white;
        }
        ._tabPane {
            cursor: pointer;
            height: 55px;
            line-height: 55px;
            // background: rgba(0, 0, 0, 1);
            color: #fff;
            text-align: center;
        }
        ._border {
            position: relative;
            top: 10px;
            width: 1px;
            height: 30px;
            background: rgba(129, 135, 148, 1);
        }
        ._active {
            background: rgba(232, 76, 87, 1);
        }
        ._footer-button {
            background: #fff;
            position: fixed;
            width: 720px;
            bottom: 0;
            right: 0;
            height: 60px;
            line-height: 60px;
            box-shadow: 0px -2px 9.9px 0.1px rgba(0, 0, 0, 0.08);
        }
        .ivu-drawer-header {
            border-bottom: none;
        }
    }
</style>
