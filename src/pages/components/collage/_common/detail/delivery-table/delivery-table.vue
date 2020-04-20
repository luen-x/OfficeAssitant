<template>
	<div ref="delivery" class="v-collage-delivery-table g-relative g-pd-t-20 g-pd-l-20">
		<div v-if="spin">
			<div v-if="show">
				<oa-online-delivery-table 
					v-if="lesson_type === 1"
					:online_data="online_data"
					:lesson_type="lesson_type"
					:project_id="project_id"
				/>
				<oa-offline-delivery-table 
					v-else
					:offline_data="offline_data"
					:lesson_type="lesson_type"
					:project_id="project_id"
				/>
			</div>
			<div v-else class="g-tc" style="margin-top: 200px;">
				<img :src="OSS_NO">
				<p class="g-m-t-10">暂未上传交付表</p>
			</div>
		</div>

		<oa-loading v-else />
	</div>
</template>

<script>
import { OSS_NO } from "@constants/constants";
import OnlineDeliveryTable from "./online-delivery-table";
import OfflineDeliveryTable from "./offline-delivery-table";

export default {
	name: "collage-delivery-table",

	components: {
		"oa-online-delivery-table": OnlineDeliveryTable,
		"oa-offline-delivery-table": OfflineDeliveryTable
	},

	props: {
		project_id: Number,
		lesson_type: Number, // 1 表示线上 2表示线下
		name: String,
		type: String
	},

	data() {
		return {
			OSS_NO,
			online_data: {}, // 线上数据
			offline_data: {}, // 线下数据
			spin: false
		};
	},

	computed: {
		show() {
			return (this.name === "cooperate" && (["3", "4", "6"].indexOf(this.type)) > -1) 
			|| this.name === "service";
		}
	},

	mounted() {
		if (((["3", "4", "6"].indexOf(this.type) > -1) && this.name === "cooperate")
		|| this.name === "service") {
			this.loadData();
		} else {
			this.spin = true;
		}

		this.$vc.on('COLLAGE_DELIVERY_TABLE', () => {
			this.loadData();
		});
	},

	beforeDestroy() {
		this.$vc.off('COLLAGE_DELIVERY_TABLE');
	},

	methods: {
		loadData() {
			this.spin = false;

			this.$request({
				url: "_COLLAGE_CUSTOMER_COOPERATE_DELIVERY_GET",
				type: "GET",
				param: {
					project_id: this.project_id,
					lesson_type: this.lesson_type
				},
				loading: false
			}).then(res => {
				if (this.lesson_type === 1) {
					this.online_data = res.data;
					this.online_data.status ? this.online_data.images = this.handleImages(this.online_data.images) : null;
				} else {
					this.offline_data = res.data;
					this.offline_data.has_lesson && this.offline_data.delivery.forEach(item => {
						item.show = false;

						item.is_assign && item.record.forEach(element => {
							element.show = false;
							element.status ? element.images = this.handleImages(element.images) : null;
						});
					});
				}

				this.spin = true;
			}).catch(error => {
				this.$Message.error(error.msg);
				this.spin = true;
			});
		},

		handleImages(images) {
			let arr = [];

			images.forEach(item => {
				arr.push({
					url: item,
					title: item.substring(item.lastIndexOf("/") + 1, item.length),
					type: "." + item.substring(item.lastIndexOf(".") + 1, item.length),
					uid: item,
					file_id: item
				});
			});

			return JSON.parse(JSON.stringify(arr));
		},

		delBefore(file_id) {
			return this.$request({
				url: API_ROOT._SC_CUSTOMER_COOPERATE_DEL_DELIVERY_POST,
				type: "POST",
				param: {
					file_id,
					project_id: this.project_id
				},
				loading: false
			}).then(res => {
				this.$Message.success(res.msg);

				return true;
			}).then(() => {
				this.handleGetData();
			}).catch(error => {
				this.$Message.warning(error.msg);

				return false;
			});
		}
	}
};
</script>

<style lang="scss">
.v-collage-delivery-table {
	min-height: 400px;

    // ._delivery-table {
	// 	border-bottom: 1px solid #e7e7e7;
	// 	width: 350px;

    //     span {
    //         width: 120px;
	// 		color: #818794;
    //     }
    // }

	.__btn{
		display: none !important;
	}

	._title{
		display: none;
	}

	._empty{
		height: 200px;
		left: 50%;
		top: 50%;
		transform: translate(-50%,-80%);
		-webkit-transform: translate(-50%,-80%);

		img{
			width: 200px;
			height: 200px;
		}
	}
}
</style>