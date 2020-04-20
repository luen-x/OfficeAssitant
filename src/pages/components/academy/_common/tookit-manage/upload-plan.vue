<template>
	<div class="g-fr">
		<vc-upload
			ref="uploads"
			:multiple="true"
			:size="1024 * 5"
			:max="100000"
			mode="file"
			@error="handleError"
			@file-before="handleFileBefore"
			@file-progress="handleFileProgress"
			@file-success="handleFileSuccess"
			@file-error="handleFileError"
			@complete="handleUpload"
		>
			<div class="g-red-btn-line">添加素材</div>
		</vc-upload>
		<transition-group name="uploadList" tag="div" class="oa-upload">
			<div
				v-for="(item, index) in loadItem"
				:key="'All' + item.loadList[0].uid"
				class="_upload-item"
			>
				<div class="_file-number">
					<span v-if="item.number !== item.loadList.length">正在上传 {{ item.number }}/{{ item.loadList.length }}</span>
					<span v-else>上传完成</span>
					<span
						class="_right-icon"
						style="float: right; font-size: 12px;"
					>
						<i
							:class="item.toggle ? 'iconfont icon-down-cycle' : 'iconfont icon-up-cycle'"
							@click="toggleLoadList(index)"
						/>
						<i class="iconfont icon-close" @click="closeLoadItem(index)"/>
					</span>
				</div>
				<ul v-if="item.toggle" class="_loading-list">
					<li v-for="(list, i) in item.loadList" :key="list.uid">
						<i class="iconfont icon-pdf _file-type"/>
						<div class="info">
							<div class="info-title" style="font-size: 14px;">{{ list.name }}</div>
							<div>
								<i-progress v-if="list.status === ''" :percent="parseInt(list.percent)" :stroke-width="4"/>
								<span v-if="list.status === 'error'" style="color: #e84c57">{{ list.msg }}</span>
							</div>
						</div>
						<div style="flex: 1;text-align: right;">
							<i
								v-if="parseInt(list.percent) !== 100"
								class="iconfont icon-uncomplete"
								style="display: inline-block;vertical-align: middle;"
								@click="cancelUpload(index, i)"
							/>
							<span class="size">{{ (list.size/(1024*1024)).toFixed(2) }}MB</span>
						</div>
					</li>
				</ul>
			</div>
		</transition-group>
	</div>
</template>
<script>
import { Progress, Button } from 'iview';
import { CreatePortal, Upload } from 'wya-vc';
import { setTimeout, clearTimeout } from 'timers';

export default {
	name: 'oa-upload',
	components: {
		'i-progress': Progress,
		'vc-upload': Upload,
		'i-button': Button
	},
	props: {
		data: Array
	},
	data() {
		return {
			isShowList: true,
			isShowLoadList: true,
			fileInfoArray: [],
			loadItem: [],
			isUploading: false,
			loadList: {
				loadList: []
			},
			timer: ''
		};
	},
	mounted() {
	},
	methods: {
		toggleLoadList(index) {
			this.loadItem[index].toggle = !this.loadItem[index].toggle;
			this.$forceUpdate();
		},
		closeLoadItem(index) {
			this.loadItem.splice(index, 1);
			clearTimeout(this.timer);
		},
		handleError(error) {
			this.$Message.error(error.msg);
		},
		handleFileBefore(res) {
			let newObj = {
				current: res.current,
				lastModified: res.lastModified,
				name: res.name,
				percent: res.percent,
				size: res.size,
				total: res.total,
				type: res.type,
				uid: res.uid,
				status: ''
			};
			this.loadList.loadList.push(newObj);
			this.loadList.toggle = true;
			this.loadList.number = 0;
			!this.isUploading && this.loadItem.push(this.loadList);
			this.isUploading = true;
		},
		handleFileProgress(e, file) {
			if (parseInt(e.percent, 10) <= 100) {
				for (let i in this.loadItem) {
					for (let j in this.loadItem[i].loadList) {
						if (file.uid === this.loadItem[i].loadList[j].uid) {
							this.loadItem[i].loadList[j].percent = e.percent;
						}
					}
				}
			}
		}, // 文件上传进度
		handleFileError(res, file) {
			for (let i in this.loadItem) {
				let loadListArr = this.loadItem[i].loadList;
				for (let j in loadListArr) {
					if (loadListArr[j].uid === file.uid) {
						this.loadItem[i].loadList[j].status = 'error';
						this.loadItem[i].loadList[j].msg = res.msg;
						this.$forceUpdate();
					}
				}
			}
		},
		handleFileSuccess(res) {
			for (let i in this.loadItem) {
				let loadListArr = this.loadItem[i].loadList;
				for (let j in loadListArr) {
					if (loadListArr[j].uid === res.data.uid) {
						this.loadItem[i].number += 1;
						this.$forceUpdate();
					}
				}
			}
		},
		handleUpload(res) {
			this.isUploading = false;
			this.timer = setTimeout(() => {
				this.loadItem = [];
			}, 30000);
			this.loadList = {
				loadList: []
			};
			this.fileInfoArray = [];
			if (res.success !== 0) {
				for (let i in res.imgs) {
					this.fileInfoArray.push(res.imgs[i].data);
				}
				this.$emit('uploadInfo', this.fileInfoArray);
			}
		},
		cancelUpload(index, i) {
			let file = this.loadItem[index].loadList[i];
			this.$refs.uploads.cancel(file);
			this.loadItem[index].loadList[i].status = 'error';
			this.loadItem[index].loadList[i].msg = '已中断上传';
		}
	}
};
</script>
<style lang="scss">
    .oa-upload {
        position: fixed;
        bottom: 10px;
        right: 10px;
        z-index: 1000000;
        ._upload-item {
            width: 300px;
            padding: 0 10px;
            box-shadow: 0px 2px 20px 0px #dfdfdf;
            border-radius: 4px;
            box-sizing: border-box;
            background: #f9fafb;
            margin-bottom: 10px;
            ._file-number {
                line-height: 40px;
                ._right-icon {
                    i {
                        cursor: pointer;
                        margin-left: 5px;
                    }
                }
            }
            ._loading-list {
                width: 100%;
                max-height: 200px;
                overflow-y: scroll;
                li {
                    width: 100%;
                    display: flex;
                    align-items: center;
                    padding-bottom: 10px;
                    ._file-type {
                        margin-right: 10px;
                        font-size: 15px;
                    }
                    .info {
                        width: 180px;
                        .info-title {
                            width: 100%;
                            overflow: hidden;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                        }
                    }
                    .size {
                        margin-left: 10px;
						display: inline-block;
						vertical-align: middle;
                    }
                }
            }
        }
    }
    .uploadList-enter-active,
    .uploadList-leave-active {
        transition: all 0.5s;
    }
    .uploadList-enter { /* .fade-leave-active below version 2.1.8 */
        opacity: 0;
    }
	.uploadList-leave-to{
		transform: translateX(300px);
		opacity: 0;
	}

    .uploadList-move {
        transition: transform 0.5s;
    }
</style>
