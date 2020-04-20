<template>
	<div
		:style="{backgroundImage: status && hasPeople ? 'url(' + OSS_PIC_BG_LIGHT + ')' : 'url(' + OSS_PIC_BG_DARK + ')'}"
		:class="['v-pk-scene', status && hasPeople ? 'has-pk' : 'no-pk', 'g-tc']">
		<!-- 还未开启 -->
		<div v-if="!status" class="_no-start" style="color: #fff;">
			<img :src="OSS_WYA_LOGO" height="60px">
			<div class="g-fs-40 g-m-t-30" style="font-weight: bold">{{ nowMonth }}月PK</div>
			<div class="g-fs-50 g-m-t-30" style="font-weight: bold">未开启</div>
		</div>
		<!-- 开启了没有人 -->
		<div v-if="status && !hasPeople" style="color: #fff; margin-top: 200px">
			<img :src="OSS_WYA_LOGO" height="60px">
			<div class="g-fs-40 g-m-t-30" style="font-weight: bold">{{ nowMonth }}月PK</div>
			<div class="g-fs-50 g-m-t-30">
				<div>
					<img :src="qrcode" height="160">
				</div>
				<div class="g-fs-16 g-m-t-20">扫一扫参与PK</div>
			</div>
		</div>
		<!-- pk中 -->
		<div v-if="status && hasPeople" style="color: #fff; overflow: hidden;height: 100%" class="g-relative">
			<img :src="OSS_WYA_LOGO" height="40" class="_logo">
			<div>
				<div style="font-size: 36px; margin-top: 40px;font-weight: bold">{{ month }}月PK</div>
				<div style="font-size: 30px">{{ staff_type }}PK</div>
			</div>
			<div style="overflow: hidden">
				<div class="g-fl g-pd-t-30 _left">
					<div :style="{backgroundImage:'url(' + OSS_PIC_JIN + ')'}" class="_avatar  g-relative">
						<div class="_pic g-bg-red-dark g-absolute">{{ guard_staff_name | sliceLastTwoOfName }}</div>
					</div>
					<div style="font-size: 22px; line-height: 40px;font-weight: bold;margin-top: 15px">
						{{ guard_staff_name }}（{{ guard_depart_name }}）
					</div>
					<div style="font-size: 22px; line-height: 40px">{{ mobile }}</div>
				</div>
				<div class="g-fr _right">
					<div v-for="(item, i) in attackPeople" :key="i" class="g-fl" style="margin-right: 15px">
						<div :style="{backgroundImage:'url(' + OSS_PIC_YIN + ')'}" class="_person" >
							<div class="_avatar g-bg-blue-dark">
								{{ item.attack_staff_name | sliceLastTwoOfName }}
							</div>
							<div class="_detail">{{ item.attack_staff_name }}({{ item.depart_name }})</div>
						</div>
					</div>
				</div>
			</div>
			<div class="_code">
				<img :src="qrcode" height="100">
				<div>扫码参与PK</div>
			</div>
			<div class="g-fs-30" style="font-weight: bold">
				PK金额：{{ pk_amount }}
			</div>
			<div class="_attended">当前已报名{{ pk_success_count }}&nbsp;/{{ attack_count }}人</div>
		</div>
	</div>
</template>
<script>
import API_ROOT, { baseUrl } from '@stores/apis/root';
import { sockets } from '@stores/services/socket';
import { getItem } from '@utils/utils';
import { OSS_WYA_LOGO, OSS_PIC_JIN, OSS_PIC_YIN, OSS_PIC_BG_DARK, OSS_PIC_BG_LIGHT, M_PK_URL } from '@constants/constants';

export default {
	filters: {
		sliceLastTwoOfName(name) {
			if (!name) return '';
			return name.trim().slice(-2);
		}
	},
	mixins: [sockets.pkScene()],
	data() {
		const getNowMonth = () => {
			const date = new Date();
			const year = date.getFullYear();
			let month = date.getMonth() + 1;
			month = month < 10 ? '0' + month : month;
			return year + '-' + month;
		};
		return {
			status: 1,	// 处于PK状态
			hasPeople: 0, // 是否有人上台
			month: '',
			nowMonth: getNowMonth(),
			guard_staff_name: '',
			guard_depart_name: '',
			mobile: '',
			head_img: '',
			pk_amount: '',
			pk_num: '',
			staff_type: '', // PK类型， 员工|经理
			attack_count: '',
			pk_success_count: '',
			attackPeople: [],
			qrcode: '',
			OSS_WYA_LOGO,
			OSS_PIC_JIN,
			OSS_PIC_YIN,
			OSS_PIC_BG_DARK,
			OSS_PIC_BG_LIGHT,
		};
	},
	created() {
		// 先获取当前PK状态
		this.handleRequest('_SALE_MAIN_PK_STATUS_GET', 'GET').then(({ data: { status } }) => {
			this.status = Number(status);
			if (!this.status) return;
			// 用socket修改
			this.handlePKData();
		});
		// 获取二维码
		this.qrcode = `${API_ROOT._SALE_MAIN_PK_QRCODE}?-token=${getItem(`staff_${this.$global.version}`).token}&url=${M_PK_URL}`;
	},
	mounted() {
		setTimeout(() => {
			this.socket.on(e => {
				if (e.event == '100') {
					this.handleUpdateData(e.data);
				}
				if (e.event == '300') {
					this.handlePKData();
				}
			});
		}, 0);
	},
	methods: {
		handleRequest(url, type, param) {
			return this.$request({
				url: API_ROOT[url],
				type,
				param
			});
		},
		handlePKData() {
			this.handleRequest('_SALE_MAIN_PK_FULL_SCREEN_DATA_GET', 'GET').then(res => {
				this.hasPeople = Number(res.data.type);
				this.month = res.data.month;
				this.guard_staff_name = res.data.guard_staff_name;
				this.guard_depart_name = res.data.guard_depart_name;
				this.mobile = res.data.mobile;
				this.head_img = res.data.head_img;
				this.pk_amount = res.data.pk_amount;
				this.pk_num = res.data.pk_num;
				this.attack_count = res.data.attack_count;
				this.pk_success_count = res.data.pk_success_count;
				this.attackPeople = res.data.attack;
				this.staff_type = Number(res.data.staff_type) ? '部门' : '员工';
			}).catch(err => this.$Message.error(err.msg));
		},
		handleUpdateData({ data }) {
			this.pk_success_count = data.pk_success_count;
			this.attack_count = data.attack_count;
			switch (Number(data.opt_type)) {
				case 1:
				 // 攻擂者发起pk 且发起成功才加上数据
					if (data.pk_status == 2) {
						this.attackPeople.push({
							attack_staff_name: data.staff_name,
							depart_name: data.depart_name,
							attack_staff_id: data.staff_id,
							head_img: data.head_img
						});
						this.pk_success_count = data.pk_success_count;
						this.attack_count = data.attack_count;
					}
					return;
				case 3:
					this.attackPeople.push({
						attack_staff_name: data.staff_name,
						depart_name: data.depart_name,
						attack_staff_id: data.staff_id,
						head_img: data.head_img
					});
					this.pk_success_count = data.pk_success_count;
					this.attack_count = data.attack_count;
					return;
				case 2:
				case 4:
					this.attackPeople = this.attackPeople.filter(v => v.attack_staff_id != data.staff_id);
					return;
				default:
					return;
			}
		}
	}
};
</script>

<style lang="scss" scoped>
  .v-pk-scene {
    width: 100%;
    height: 100vh;
    overflow: hidden;
    ._logo {
      position: absolute;
      top: 40px;
      left: 50px;
    }
    ._code {
      position: absolute;
      bottom: 40px;
      left: 50px;
      width: 130px;
    }
    ._left {
      width: 390px;
      height: 380px;
			border-radius: 6px;
			margin: 150px 0 0 150px;
      background-color: rgba(0, 0, 0, 0.4);
			padding-top: 55px;
      ._avatar {
        width: 200px;
				height: 200px;
				margin: 0 auto;
				background: no-repeat;
				background-size: cover;
				._pic {
					width: 128px;
					height: 128px;
					line-height: 128px;
					font-size: 40px;
					font-weight: bold;
					border-radius: 50%;
					top: 40px;
					left: 40px;
				}
      }
    }
    ._right {
      width: 604px;
      height: 740px;
			background-color: rgba(0, 0, 0, 0.4);
			margin: 0px 50px 0 0;
			padding: 15px 15px 25px 25px;
			._person {
				width: 110px;
				height:110px;
				background: no-repeat;
				background-size: 80%;
				margin: 5px 0px 15px 15px;
				position: relative;
				._avatar {
					width: 68px;
				height: 68px;
				line-height: 68px;
				position: absolute;
				border-radius: 50%;
				top: 17px;
				right: 32px;
				font-size: 22px;
				font-weight: bold
				}
				._detail {
					position: absolute;
					font-size: 13px;
					font-weight: bold;
					text-align: center;
					top: 100px;
				}
			}
    }
		._attended {
			position: absolute;
			right: 250px;
			bottom: 20px;
			font-size: 20px;
			font-weight: bold;
			font-size: 22px;
			color: #fff;
		}
  }
  .has-pk {
    background: center no-repeat;
    background-size: cover;
  }
  .no-pk {
    background: center no-repeat;
    background-size: cover;
  }
	._no-start {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%)
	}

</style>

