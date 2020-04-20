<template>
	<i-drawer
		v-model="visible"
		:mask-closable="false"
		:mask="false"
		class="v-hr-side-detail v-hr-academy-course-detail"
		@on-close="handleCancel"
	>
		<oa-loading v-if="loading"/>
		<div
			class="_head-title"
			style="padding-bottom: 0;padding-left:26px"
		>
			课程详情
		</div>
		<div class="g-flex g-fw-w g-pd-l-30">
			<oa-info-item :content="courseInfo.course_name" label="课程名称"/>
			<oa-info-item :content="courseInfo.method_name" label="授课方式"/>
			<oa-info-item label="参与人员">
				<i-checkbox v-if="courseInfo.participant_type.includes(1)" :value="true" disabled>
					<oa-auto-poptip :data="courseInfo.echelon" label-key="echelon_name"/>
				</i-checkbox>
				<i-checkbox v-if="courseInfo.participant_type.includes(2)" :value="true" disabled>{{ courseInfo.participator_name }}</i-checkbox>
				<span v-if="courseInfo.participant_type.length==0">--</span>
			</oa-info-item>
			<oa-info-item label="授课讲师">
				<oa-auto-poptip :data="courseInfo.lecture" label-key="staff_name"/>
				<span v-if="courseInfo.lecture_type_name" class="g-c-black4">({{ courseInfo.lecture_type_name }})</span>
			</oa-info-item>
			<oa-info-item label="关联课题">
				<oa-auto-poptip :data="courseInfo.subject" label-key="subject_name"/>
			</oa-info-item>
			<oa-info-item :content="courseInfo.course_type_name" label="课程类型"/>
			<oa-info-item :content="courseInfo.organizer_depart_name" label="举办方"/>
			<oa-info-item :content="courseInfo.course_code" label="课程编码"/>
			<oa-info-item label="相关课件">
				<div v-for="(att, index) in courseInfo.attachment" :key="index" class="g-flex">
					<i 
						class="icon iconfont icon-accessory g-relative" 
						style="top:-4px"
					/> 
					<oa-auto-tooltip 
						:content="att.attachment_name"
						width="170px"
						@click-label="handlePreview($event,att)"
					/>
					<i 
						v-if="att.is_download" 
						style="top:0px" 
						class="icon iconfont icon-xiazai1 g-operation g-fr g-relative" 
						@click="handleDownload(att)"
					/>
					
				</div>
			</oa-info-item>
			<oa-info-item label="课程时长">
				{{ courseInfo.course_time ? courseInfo.course_time +' 分钟' : '--' }} 
			</oa-info-item>
			<oa-info-item label="用途">
				{{ courseInfo.use_name }}
			</oa-info-item>
		</div>
		<template v-if="author=='hr' && ($auth[1043] || $auth[1040])">
			<div style="height:60px"/>
			<div class="_footer">
		
				<i-button
					v-if="$auth[1043]"
					@click="handleEdit"
				>
					编辑 
				</i-button>
				<i-button
					v-if="$auth[1040]"
					@click="handleDelete"
				>
					删除
				</i-button>
			</div>
		</template>
	</i-drawer>
</template>

<script>
import { Drawer, Button, Checkbox, Poptip } from "iview";
import AutoTooltip from "@common/auto-tooltip/auto-tooltip";
import { FilePreview } from '@common/file-preview/file-preview';
import { CreatePortal, ImgsPicker, Fragment, ImgsPreview } from "wya-vc";
import { debounce } from 'lodash';
import Loading from '@components/_common/loading/loading';
import { getHashUrl, oneLinePipe } from '@utils/utils';
import InfoItem from "@components/sale/_common/info-item";
import { Confirm } from '@common/confirm/confirm';
import { services } from '@stores/services/hr';
import downloadFile from '@utils/download';
import AutoPoptip from '../components/auto-poptip';
import { setData, downloadDirecotory } from '../util';
import '../../hr-side';

const config = {
	hr: {
		infoUrl: '_HR_ACADEMY_COURSE_STORE_INFO_GET'
	},
	sale: {
		infoUrl: "_HR_TRAIN_PROJECT_DETAIL_GET"
	}
};

export default {
	name: "c-sale-customer-detail",
	components: {
		"i-drawer": Drawer,
		'oa-loading': Loading,
		'i-button': Button,
		'oa-info-item': InfoItem,
		'i-checkbox': Checkbox,
		'i-poptip': Poptip,
		'oa-auto-poptip': AutoPoptip,
		'oa-auto-tooltip': AutoTooltip
	},
	mixins: [services.stageTree()],
	props: {
		courseId: Number,
		author: {
			validator(val) {
				return ['sale', 'hr'].includes(val);
			},
			default: 'hr'
		}
	},
	data() {
		return {
			visible: false,
			loading: false,
			courseInfo: {
				course_id: '',
				method_name: '',
				course_name: '',
				participant_type: [],
				participator_name: '',
				lecture: [],
				lecture_type_name: '',
				subject: [],
				echelon: [],
				course_type_name: '',
				organizer_depart_name: '',
				course_code: '',
				attachment: [],
				course_time: '',
				use_name: ''


			}
		};
	},
	computed: {

	},
	watch: {
		'courseId': function (newVal, oldVal) {
			this.loadData();
		}
	},
	mounted() {
		this.visible = true;
		this.loadData();

	},
	methods: {
		handleOk() {
			this.visible = false;
			this.$emit("sure");
		},
		handleCancel() {
			this.visible = false;
			this.$emit("close");
		},
		
		loadData() {
			this.$request({
				url: config[this.author].infoUrl,
				type: "GET",
				param: {
					course_id: this.courseId
				},
				loading: false,
			}).then(res => {
				setData(this.courseInfo, res.data);
				this.courseInfo.echelon = this.getEchelon();
			}).catch((res) => {
				console.error(res);
				this.$Message.error(res.msg);
			});

		},
		handleEdit() {
			this.handleOk();
			setTimeout(() => {
				this.$router.push({
					path: '/hr/academy/course/store/add',
					query: {
						course_id: this.courseId,
						action: 'update'
					}
				});	
			}, 200);
			

		},
		handleDelete() {
			Confirm.popup({
				msg: "删除后将无法恢复，确定要删除吗？"
			}).then(() => {
				this.$request({
					url: "_HR_ACADEMY_COURSE_STORE_DELETE_POST",
					type: "POST",
					param: {
						course_ids: [this.courseId]
					},
					loading: false,
				}).then(res => {
					this.$Message.success(res.msg);
					this.handleCancel();
					this.$store.commit('HR_ACADEMY_COURSE_STORE_LIST_RESET', { type: this.$route.query.type || 0 });
				}).catch((res) => {
					this.$Message.error(res.msg);
				});

			}).catch(() => {

			});
		},
		handleDownload(att) {
			downloadDirecotory(att);
			// downloadFile({ fileName: att.attachment_url });
		},
		getFileNameFromUrl(url = '') {
			return url.substring(url.lastIndexOf('/') + 1);
		},
		getEchelon() {
			const echelon1 = [];
			const echelon2 = [];
			let stage = [];
			this.courseInfo.echelon.forEach(ech => {
				ech.stage_id = ech.stage_id.map(it => 'stage-' + it);
				const node = this.findNode(ech.echelon_id);
				if (!node) return;
				if (node.children.length == ech.stage_id.length) {
					echelon2.push({ echelon_id: node.value, echelon_name: node.title });
				} else {
					stage = [...stage, ...ech.stage_id.map(id => this.findNode(id)).map(it => ({ echelon_id: it.value, echelon_name: it.title }))];
				}
			});
			this.stageTree.forEach(item => {
				const exist = item.children.find(it => { // 如果能找到一个在echolon2中不存在的说明没满
					return !echelon2.find(i => i.echelon_id == it.value);
				});
				if (!exist) { // 如果满了
					item.children.forEach(it => {
						const index = echelon2.findIndex(i => i.echelon_id == it.value);
						echelon2.slice(index, 0);
					});
					echelon1.push({ echelon_name: item.title, echelon_id: item.value });
				}
			});
			return [...echelon1, ...echelon2, ...stage];

		},
		findNode(id, arr) {
			if (!arr) arr = this.stageTree;
			for (let i = 0; i < arr.length; i++) {
				if (arr[i].value == id) {
					return arr[i];
				} else if (arr[i].children && arr[i].children.length > 0) {
					const exist = this.findNode(id, arr[i].children);
					if (exist) return exist;
				}
			}
		},
		handlePreview(e, item) {
			if (item.attachment_type == 2) {
				this.$Message.error('暂不支持文件夹预览');
				return;
			}
			this.$emit('preview-start');
			FilePreview.popup({
				data: {
					fileUrl: item.attachment_url,
					x: e.clientX,
					y: e.clientY
				}
			}).then((res) => {

			}).catch((err) => {

			}).finally(() => {
				this.$emit('preview-end');
			});
		},
	}
};
export const CourseDetail = CreatePortal({ alive: true }, module.exports.default);
</script>
<style lang="scss" >
.v-hr-academy-course-detail {
	.ivu-checkbox-wrapper-disabled {
		cursor: default
	}
	._ecllips {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

}
</style>
