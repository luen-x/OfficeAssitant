// 此混入只在用createPotal创建的modal，drawer使用,modal必须加上ref="modal"以移除本身的监听
// 为了按esc时，弹窗可按打开的顺序倒序关闭
// 如果在弹窗关闭前想进行一些处理，请添加beforeEsc方法，并返回Promise，promise的状态将决定是否关闭弹窗
const popupModals = [];

export default {
	data() {
		return { orderModalEnable: true };

	},
	mounted() {
		popupModals.push(this._uid);
		document.addEventListener('keyup', this.handleOrderModalKeyUp);
		if (this.$refs.modal) {
			document.removeEventListener('keydown', this.$refs.modal.EscClose);
		}
		this.$vc.on('ORDER_MODAL_ENABLE', this.handleOrderModalEnable);
	},
	beforeDestroy() {
		this.$vc.off('ORDER_MODAL_ENABLE', this.handleOrderModalEnable);
		document.removeEventListener('keyup', this.handleOrderModalKeyUp);
		const index = popupModals.findIndex(modalId => modalId === this._uid);
		if (index > -1) {
			popupModals.splice(index, 1);
		}
	},
	methods: {
		handleOrderModalKeyUp(event) {
			if (!this.orderModalEnable) return;
			const keyCode = event.keyCode;
			if (popupModals[popupModals.length - 1] === this._uid && keyCode === 27) {
				if (this.beforeEsc) {
					this.beforeEsc().then(() => {
						this.visible = false;
						this.$emit("close");
					}).catch((err) => console.error(err));
				} else {
					this.visible = false;
					this.$emit("close");
				}	
			}
		},
		handleOrderModalEnable({ enable }) {
			this.orderModalEnable = enable;
		}

	}
	


};