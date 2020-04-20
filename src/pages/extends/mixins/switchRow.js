// table上下键切换数据
export default {
	data() {
		return {
			openIndex: -1 
		};

	},
	mounted() {
		document.body.addEventListener('keyup', this.handleKeyup);
	},
	beforeDestroy() {
		document.body.removeEventListener('keyup', this.handleKeyup);
	},
	methods: {
		nextRow() {
			let infoArr;
			if (this.type !== undefined && this.listInfo[this.type]) {
				infoArr = this.listInfo[this.type].data[this.$route.query.page || 1];
			} else {
				infoArr = this.listInfo.data[this.$route.query.page || 1];
			} 
			if (infoArr && this.openIndex < infoArr.length - 1) {
				this.openIndex++;
				if (this.type === undefined) {
					this.$refs.tableTarget.$refs.tableTarget.clickCurrentRow(this.openIndex);
				} else {
					const index = this.tabs.findIndex(item => item.value == this.type);
					index > -1 && this.$refs.tableTarget[index].$refs.tableTarget.clickCurrentRow(this.openIndex);
				}
			}
		},
		preRow() {
			if (this.openIndex > 0) {
				this.openIndex--;
				if (this.type === undefined) {
					this.$refs.tableTarget.$refs.tableTarget.clickCurrentRow(this.openIndex);
				} else {
					const index = this.tabs.findIndex(item => item.value == this.type);
					index > -1 && this.$refs.tableTarget[index].$refs.tableTarget.clickCurrentRow(this.openIndex);
				}
			}
		},
		handleKeyup(event) {
			const keyCode = event.keyCode;
			if (keyCode == 38) {
				this.preRow();
			} else if (keyCode == 40) {
				this.nextRow();
			}
		},
	},
};