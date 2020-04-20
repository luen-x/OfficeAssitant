<template>
	<div class="v-content-preview">
		<div class="g-flex g-jc-sb _center">
			<div class="_center-left">
				<h3 class="g-fs-18 g-c-black">
					{{ detail.title ? detail.title : title }}
				</h3>

				<p class="g-fs-12 g-c-black5">
					<span class="g-m-r-20">
						{{ detail.staff_name ? detail.staff_name : username }}
					</span>
					<span class="g-m-r-20">
						{{ detail.staff_name ? detail.create_date : time }}
					</span>
					<i class="iconfont icon-accessory g-fs-12"/>
					<span class="g-m-r-20">
						{{ detail.staff_name ? detail.attachment_number : 0 }}
					</span>
					<i class="iconfont icon-download g-fs-12"/>
					<span class="g-m-r-20">
						{{ detail.staff_name ? detail.download_number : 0 }}
					</span>
					<i class="iconfont icon-open-eyes g-fs-12"/>
					<span class="g-m-r-20">
						{{ detail.staff_name ? detail.browse_number : 0 }}
					</span>
				</p>

				<div class="g-pd-t-10 g-pd-b-10 __chinese">
					<oa-editor-preview 
						:content="detail.title ? detail.content : content"
					/>
				</div>

				<div class="_load">
					<h4 class="g-m-b-20">附件下载：</h4>
					<div class="__item-wrapper">
						<div
							v-for = "(item,index) in list"
							:key="index" 
							class="__item"
							@mouseover="handleHover(item, index)"
							@mouseout="handleOut(item, index)"
						>
							<i class="iconfont icon-material"/>
							<span class="__attachment">
								{{ item.attachment_name }}
							</span>

							<span v-show="detail.title">
								<template v-if="detail.is_download">
									<i-tooltip content="请点击下载">
										<i 
											v-show="index == nowIndex" 
											class="iconfont icon-download1 g-m-l-5 g-c-blue-light g-operation _icon"
											@click="down(item)"
										/>
									</i-tooltip>
								</template>

								<i-tooltip content="请点击预览">
									<i 
										v-show="index == nowIndex && item.show" 
										class="iconfont icon-audit g-m-l-5 g-operation _icon" 
										@click="toPreview(item)" 
									/>
								</i-tooltip>
							</span>
						</div>
						
						<div 
							v-if="list.length > 1 && $route.query.status == '4'" 
							class="__all-down"
						>
							<span @click="handleDownAll">全部下载</span>
							<i 
								class="iconfont icon-download1 g-m-l-5 g-c-blue-light g-operation _icon"
								@click="handleDownAll"
							/>
						</div>
					</div>
				</div>
			</div>

			<div class="_center-right">
				<div>
					<oa-title title="相关资讯" class="_title" />
								
					<ul 
						v-if="relation_list.length != 0"
						class="_shadow-box g-jc-sb _related-material"
					>
						<li 
							v-for = "(item,index) in relation_list" 
							:key="index" 
							class="__operate" 
							@click="getContent(item)"
						>
							<div class="__operate-text">{{ item.title }}</div>
							<div>{{ item.create_date }}</div>
						</li>
					</ul>

					<div 
						v-else
						class="_shadow-box g-jc-sb _related-material _empty"
					>
						<img :src="OSS_EMPTY" class="g-m-t-30">
						<span style="text-align:center">暂无{{ relationTitle }}</span>
					</div>
				</div>

				<div>
					<oa-title title="最新资讯" class="_title" />
								
					<ul 
						v-if="new_list.length != 0"
						class="_shadow-box g-jc-sb _latest-material"
					>
						<li 
							v-for="(item,index) in new_list" 
							:key="index" 
							class="__operate" 
							@click="getContent(item)"
						>
							<div class="__operate-text">{{ item.title }}</div>
							<div>{{ item.create_date }}</div>
						</li>
					</ul>

					<div 
						v-else
						class="_shadow-box g-jc-sb _latest-material _empty"
					>
						<img :src="OSS_EMPTY" class="g-m-t-30">
						<span style="text-align:center">暂无{{ newTitle }}</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { getParseUrl, getHashUrl, getItem } from '@utils/utils';
import API_ROOT from "@stores/apis/root";
import { OSS_EMPTY } from '@constants/constants';
import { Tooltip } from "iview";
import FileType from "@components/_common/upload/file-type";
import { downloadFile } from '@utils/download';
import { Editor } from "wya-vc";
import EditorPreview from '@common/editor-preview/editor-preview';
import Title from "./title";
import { PreviewModal } from "../search-result/result-content/tabs/preview/content.vue";

export default {
	name: 'oa-preview',

	components: {
		"oa-title": Title,
		"i-tooltip": Tooltip,
		'vc-editor': Editor,
		'oa-editor-preview': EditorPreview
	},

	data() {
		const { query = {} } = this.$route;
		return {
			list: [], // 附件下载
			relation_list: [], // 相关素材
			new_list: [], // 详情页最新素材
			detail: {},
			username: "", // 咨询创建人
			content: "", // 富文本内容
			time: "", // 咨询创建时间
			title: "", // 咨询标题
			nowIndex: -1, // 当前显示 logo 的附件
			relationTitle: '', // 相关列表 title
			newTitle: '', // 最新列表 title
			product: "",
			fileType: [], // 文件类型
			OSS_EMPTY,
			status: '' || query.status
		};
	},

	mounted() {
		// flag 为true表示是从资讯管理预览按钮进来的,否则从标题进来的
		if (this.$route.query.flag) {
			this.username = getItem(`staff_${this.$global.version}`).staff.staff_name;
			let form = getItem(`form_${this.$global.version}`);
			this.content = form.content;
			this.title = form.title;
			this.time = getItem(`time_${this.$global.version}`);
			this.handleGetList(form.attachment_list);
		}

		if (!this.$route.query.flag) {
			this.getContent();
		}

		for (let key in FileType) {
			if (key != ".zip" && key != ".rar" && key != ".txt" && key != "undefined" && key != "") {
				this.fileType.push(key);
			}
		}
	},

	updated() {
		this.$nextTick(() => {
			if (document.querySelector(".__chinese").children.length != 0) {
				let arr = document.querySelector(".__chinese").children;

				for (let i = 0; i < arr.length; i++) {
					if (arr[i].outerHTML.indexOf("ql-indent-") != -1) {
						arr[i].style.paddingLeft = arr[i].className.substring(10) + "em";
					}	
				}
			}
		});
	},

	methods: {
		// 全部下载
		handleDownAll() {
			let src = [];
			this.list.forEach(item => {
				downloadFile({
					fileName: item.url,
					downSumParams: {
						information_ids: [this.$route.query.information_id]
					}
				});
			});
		},
		// 附件下载
		down(e) {
			downloadFile({
				fileName: e.url,
				downSumParams: {
					information_ids: [this.$route.query.information_id]
				}
			});
		},

		// 附件预览
		toPreview(element) {
			let obj = {};
			obj.material_name = element.attachment_name;
			obj.information_id = element.information_id;
			obj.file_url = element.url;
			obj.file_type = element.file_type;
			obj.file_size = element.file_size;
			PreviewModal.popup({ datas: obj }).then(res => {});
		},

		handleHover(e, index) {
			this.nowIndex = index;
		},

		handleOut(e) {
			this.nowIndex = -1;
		},

		// 获取内容数据
		getContent(item) {
			if (item) {
				let path = '';

				if (+this.$route.query.status === 1) {
					path = '/content/preview';
				} else {
					path = ['/collage/consultation', '/finnance/consultation', '/hr/consultation', '/sc/consultation'][this.status - 7];
				}

				this.$router.replace({
					path,
					query: {
						keyword: this.$route.query.keyword,
						status: this.$route.query.status,
						information_id: item.information_id
					}
				});
			}

			let API = +this.$route.query.status === 1 ? "_CONTENT_INFORMATION_MANAGE_CHECK_GET" : "_CONTENT_INFORMATION_MANAGE_CHECK_PLUS_GET";

			this.$request({
				url: API_ROOT[API],
				type: "GET",
				param: {
					information_id: item ? item.information_id : this.$route.query.information_id
				}
			}).then(res => {
				this.detail = res.data;
				this.handleGetList(this.detail.attachment_list);
				this.getRelationData(this.detail.keyword, item);
				this.getNewData(item ? item.information_id : this.$route.query.information_id);
			}).catch(error => {
			});
		},

		// 获取相关列表数据,v表示点击相关列表的那条数据
		getRelationData(keyword, v) {
			this.$request({
				url: "_CONTENT_INFORMATION_MANAGE_RELATION_GET",
				type: "GET",
				param: {
					keyword,
					information_id: v ? v.information_id : this.$route.query.information_id
				}
			}).then(res => {
				this.relation_list = res.data;
			}).catch(error => {
			});
		},

		// 获取最新列表数据
		getNewData(information_id) {
			this.$request({
				url: "_CONTENT_INFORMATION_MANAGE_NEW_GET",
				type: "GET",
				param: {
					information_id
				}
			}).then(res => {
				this.new_list = res.data;
			}).catch(error => {
			});
		},

		// 处理附件
		handleGetList(list) {
			let attachment_name = "";
			this.list = [];
			let arr = [];

			list.forEach(item => {
				attachment_name = item.attachment_name || item.name;
				arr = attachment_name.split(".");

				if (this.fileType.indexOf("." + arr[arr.length - 1].toLowerCase()) === -1) {
					this.list.push({
						attachment_name,
						url: item.url || item.attachment_url,
						show: false
					});
				} else {
					this.list.push({
						attachment_name,
						url: item.url || item.attachment_url,
						file_size: item.file_size,
						file_type: item.file_type,
						material_id: item.material_id,
						show: true
					});
				}
			});
		}
	},
};
</script>

<style lang="scss" scoped>
.v-content-preview{
	width: 100%;
	min-width: 1100px;

	._center{
		width: 1080px;
		min-height: 580px;
		margin: 0 auto;
		margin-top: 30px;

		._center-left{
			width: 706px;
			box-shadow: 0px 1px 8px 0px rgba(0,0,0,0.1);
			padding: 22px 38px;

			p{
				height: 54px;
				line-height: 54px;
			}

			.__chinese{
				min-height: 282px;
				border-top: 1px solid #ebeef1;
				border-bottom: 1px solid #ebeef1;
			}

			h4{
				margin-top: 16px;
			}

			ul{
				width: 550px;
				display: flex;
				justify-content: space-between;
				flex-wrap: wrap;
				padding-bottom: 20px;

				li{
					margin-top: 16px;
					width: 275px;
				}
			}
		}

		._center-right{
			width: 362px;
			background-color: #f5f5f7;
			padding: 26px 15px 0 15px;

			ul,._empty{
				width: 100%;
				background: #ffffff;
				padding: 14px;
				margin: 16px 0;
				overflow: auto;	

				span{
					display: inline-block;
					text-align: center;
					width: 100%;
					margin-top: 40px;
				}

				li{
					line-height: 25px;
					border-bottom: 1px solid #ebeef1;
				}
			}

			._related-material{
				height: 280px;
				overflow-y: overlay;

				.__operate {
					cursor: pointer;
					&:hover {
						color: #2397f9
					}
					.__operate-text {
						overflow:hidden; 
						text-overflow:ellipsis;
						white-space:nowrap;
					}
				}	
			}

			._latest-material{
				height: 275px;
				overflow-y: overlay;

				.__operate {
					cursor: pointer;
					&:hover {
						color: #2397f9
					}
					.__operate-text {
						overflow:hidden; 
						text-overflow:ellipsis;
						white-space:nowrap;
					}
				}		
			}
		}
	}

	._load{
		min-height: 104px;
		border-bottom: 1px solid #ebeef1;

		.__item-wrapper {
			position: relative;
			display: flex;
			justify-content: space-between;
			flex-wrap: wrap;
			width: 100%;

			.__item {
				width: 48%;
				height: 30px;
				line-height: 30px;
				margin-right: 10px;
				display: flex;
				flex-wrap: wrap;
				
				.__attachment{
					display: inline-block;
					max-width: 75%;
					margin-right: 5px;
					margin-left: 9px;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
			}
		}
		.__all-down {
			position: absolute;
			top: -30px;
			transform: translateY(-50%);
			right: 0px;
			display: inline-block;
			padding-left: 40px; 
			text-align: center;
			color: #2296f9;
			cursor: pointer;
		}
	}

	._relate_product{
		display: flex;
		margin-top: 12px;

		.__left{
			width: 68px;
			padding-top: 4px;
		}

		.__right{
			width: 100%;
			display: flex;
			flex-wrap: wrap;
			max-height: 50px;
			overflow-y: auto;
			justify-content: space-between;

			div{
				margin-left: 15px;
				height: 25px;
				line-height: 25px;
				color: #2397f9;
				text-decoration: underline #2397f9;
				cursor: pointer;
			}
		}
	}

	._icon{
		font-size: 16px;
	}
}
</style>