<template>
	<div class="v-hr-academy-train-detail-basic-detail g-m-l-20 g-m-t-10">
		<div class="g-flex g-fw-w g-pd-l-30">
			<oa-info-item label="课程名称">
				<div v-if="courseInfo.course_name" class="_content">
					<i-tooltip
						v-if="courseInfo.course_name.length > 15" 
						:content="courseInfo.course_name" 
						:transfer="true"
						placement="bottom"
						max-width="250"
					>
						{{ courseInfo.course_name.substr(0, 15) + "..." }}
					</i-tooltip>
					<span v-else>{{ courseInfo.course_name }}</span>
				</div>
				<div v-else class="_content">
					--
				</div>
			</oa-info-item>
			<oa-info-item :content="courseInfo.method_name" label="授课方式"/>
			<oa-info-item label="参与人员">
				<i-checkbox v-if="courseInfo.participant_type.includes(1)" :value="true" disabled>
					<oa-auto-poptip :data="courseInfo.echelon" placement="bottom" label-key="echelon_name"/>
				</i-checkbox>
				<i-checkbox v-if="courseInfo.participant_type.includes(2)" :value="true" disabled>{{ courseInfo.participator_name }}</i-checkbox>
				<span v-if="courseInfo.participant_type.length==0">--</span>
			</oa-info-item>
			<oa-info-item label="授课讲师">
				<oa-auto-poptip :data="courseInfo.lecture" label-key="staff_name"/>
				<span>({{ courseInfo.lecture_type_name }})</span>
			</oa-info-item>
			<oa-info-item label="关联课题">
				<oa-auto-poptip :data="courseInfo.subject" label-key="subject_name"/>
			</oa-info-item>
			<oa-info-item :content="courseInfo.course_type_name" label="课程类型"/>
			<oa-info-item :content="courseInfo.organizer_depart_name" label="举办方"/>
			<oa-info-item :content="courseInfo.course_code" label="课程编码"/>
			<oa-info-item :content="courseInfo.use_name" label="用途">
				<span v-if="courseInfo.use_name">{{ courseInfo.use_name }}</span>
				<span v-else>--</span>
			</oa-info-item>
			<oa-info-item label="课程时长">
				<span v-if="courseInfo.course_time">{{ courseInfo.course_time }} 分钟</span>
				<span v-else>--</span>
			</oa-info-item>
			<oa-info-item label="授课时间">
				<div v-if="courseInfo.time" class="_content">
					<i-tooltip
						v-if="courseInfo.time.length > 26" 
						:content="courseInfo.time" 
						:transfer="true"
						placement="bottom"
						max-width="250"
					>
						{{ courseInfo.time.substr(0, 26) + "..." }}
					</i-tooltip>
					<span v-else>{{ courseInfo.time }}</span>
				</div>
				<div v-else class="_content">
					--
				</div>
			</oa-info-item>
			<oa-info-item :content="courseInfo.position" label="授课地点">
				<div v-if="courseInfo.position" class="_content">
					<i-tooltip
						v-if="courseInfo.position.length > 15" 
						:content="courseInfo.position" 
						:transfer="true"
						placement="bottom"
						max-width="250"
					>
						{{ courseInfo.position.substr(0, 15) + "..." }}
					</i-tooltip>
					<span v-else>{{ courseInfo.position }}</span>
				</div>
				<div v-else class="_content">
					--
				</div>
			</oa-info-item>
			<oa-info-item :content="courseInfo.is_save_course" label="同步到课程表"/>
			<oa-info-item :content="courseInfo.teach_depart_name" label="授课部门"/>
			<oa-info-item label="相关课件">
				<div v-for="(att, index) in courseInfo.attachment" :key="index" class="g-flex">
					<i class="icon iconfont icon-accessory"/>
					<oa-auto-tooltip 
						:content="(att.attachment_name || getFileNameFromUrl(att.attachment_url))" 
						width="170px" 
						@click-label="handlePreview($event,att)"
					/>
					<i 
						v-if="att.is_download"
						style="top:4px" 
						class="icon iconfont icon-xiazai1 g-operation g-fr g-relative" 
						@click="handleDownload(att)"
					/>
				</div>
			</oa-info-item>
		</div>
		<div class="_button">
			<span 
				class="g-pointer g-c-blue-light"
				@click="handleEdit()"
			>
				编辑
			</span>
		</div>
	</div>
</template>

<script>
import { Divider, Checkbox, Button, Tooltip } from 'iview';
import API_ROOT from '@stores/apis/root';
import { getParseUrl, getHashUrl, setItem, getItem } from '@utils/utils';
import { FilePreview } from '@common/file-preview/file-preview';
import { downloadFile } from '@utils/download';
import InfoItem from "@components/sale/_common/info-item";
import AutoTooltip from "@common/auto-tooltip/auto-tooltip";
import { services } from '@stores/services/hr';
import DetailItem from '../academy-train-detail/_common/detail-item';
import AutoPoptip from '../_common/academy-course/components/auto-poptip';
import { setData, downloadDirecotory } from '../_common/academy-course/util';

export default {
	name: 'oa-tpl',
	components: {
		'i-divider': Divider,
		'oa-detail-item': DetailItem,
		'oa-info-item': InfoItem,
		'oa-auto-poptip': AutoPoptip,
		'oa-auto-tooltip': AutoTooltip,
		'i-checkbox': Checkbox,
		'i-button': Button,
		'i-tooltip': Tooltip
	},
	mixins: [services.stageTree()],
	data() {
		return {
			detailData: {
				attachment: []
			},
			courseInfo: {
				course_id: '',
				method_name: '',
				course_name: '',
				participant_type: [],
				participator_name: '',
				lecture: [],
				subject: [],
				echelon: [],
				course_type_name: '',
				organizer_depart_name: '',
				course_code: '',
				attachment: [],
				course_time: '',
				use_name: '',
				time: '',
				position: '',
				is_save_course: '',
				teach_depart_name: '',
				lecture_type_name: ''
			}
		};
	},
	created() {
		this.loadData();
	},
	methods: {
		loadData() {
			this.$request({
				url: API_ROOT['_HR_TRAIN_PROJECT_DETAIL_GET'], // eslint-disable-line
				type: "GET",
				param: {
					course_id: this.$route.query.course_id
				}
			}).then((res) => {
				setData(this.courseInfo, res.data);
				this.courseInfo.lecture_type_name = res.data.lecture_type == 1 ? '被邀请' : res.data.lecture_type == 2 ? '主动申请' : '其他';
				this.courseInfo.time = res.data.start_time + ' 至 ' + res.data.end_time;
				this.courseInfo.is_save_course = res.data.is_save_course ? '是' : '否';
				this.courseInfo.echelon = this.getEchelon();
			}).catch((error) => {
				
			});
		},
		
		handleEdit() {
			this.$router.push(getHashUrl(
				'/hr/academy/train/detail/basic/2/edit', 
				{ 
					...this.$route.query
				}
			));
		},
		handleBack() {
			this.$router.go(-1);
		},
		handleDownload(att) {
			downloadDirecotory(att);
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
			// }

		},
	},
};
</script>

<style lang="scss">
.v-hr-academy-train-detail-basic-detail {
	position: relative;
	width: 60%;
	._item {
		display: inline-block;
		width: 370px;
		padding-bottom: 20px;
		margin-right: 50px;
		div{
			display: flex;
			._label {
				display: inline-block;
				color: #818794;
				width: 120px;
				position: relative;
				top: 0px;
			}

			._content {
				display: inline-block;
				color: #000000;
				width: 240px;
				position: relative;
				.__down-item {
					margin-bottom: 20px;
				}
			}

			.ivu-poptip-body-content-inner{
				color: #4b4f57;
			}

			/deep/ ._title{
				display: none;
			}
		}
	}
	._button {
		position: fixed;
		z-index: 1000;
		top: 170px;
		left: 431px;
		.ivu-divider, .ivu-divider-vertical {
			background-color: #CDCDCD !important;
		}
	}
}
</style>
