import { CaseClearance } from './popup/case-clearance';
import { TalkingClearance } from './popup/talking-clearance';
import { CumulativeClearance } from './popup/cumulative-clearance';

export default {
	data() {
		return {
			columns: [
				{
					type: "selection",
					fixed: "left",
					minWidth: 50	
				},
				{
					title: '姓名',
					key: 'staff_name',
					minWidth: 170,
					fixed: "left"
				},
				{
					title: '部门',
					key: 'depart_name',
					minWidth: 100
				},
				{
					title: '手机号',
					key: 'mobile',
					minWidth: 120
				},
				{
					title: '工龄',
					key: 'workage',
					minWidth: 100,
					render: (h, params) => {
						return (
							<div>{params.row.workage}个月</div>
						);
					}
				},
				{
					title: '第一通话术',
					key: 'score_1',
					minWidth: 120
				},
				{
					title: '价值传递话术',
					key: 'score_2',
					minWidth: 120
				},
				{
					title: '选查通关疑难话术',
					key: 'score_3',
					minWidth: 140
				},
				{
					title: '抽查通关疑难话术',
					key: 'score_4',
					minWidth: 140
				},
				{
					title: '累计通关案例',
					key: 'pass_num',
					minWidth: 120,
					render: (h, params) => {
						if (params.row.record.length === 0) {
							return (
								<div>{params.row.pass_num}</div>
							);
						} else {
							return (
								<div class="g-operation" onClick={() => { this.handleOperation(3, params.row); }}>
									{params.row.pass_num}
								</div>
							);
						}
					}
				},
				{
					title: '操作',
					key: '',
					minWidth: 160,
					fixed: "right",
					render: (h, params) => {
						return (
							<div class="g-flex g-operation">
								{
									this.$auth[1600]
										? <div onClick={() => { this.handleOperation(1, params.row); }}>
											话术通关
										</div>
										: null
								}
								{
									this.$auth[1600] && this.$auth[1601]
										? <div class="g-m-lr-5">|</div>
										: null
								}
								{
									this.$auth[1601]
										? <div onClick={() => { this.handleOperation(2, params.row); }}>
											案例通关
										</div>
										: null
								}
							</div>
						);
					}
				}
			]
		};
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('ACADEMY_TRAIN_UPLOAD_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('ACADEMY_TRAIN_UPLOAD_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
		handleOperation(name, obj) {
			if (name === 1) {
				TalkingClearance.popup({
					staffId: Number(obj.staff_id)
				}).then(res => {
					res && this.handleResetCur();
				});
			} else if (name === 2) {
				CaseClearance.popup({
					staffId: Number(obj.staff_id)
				}).then(res => {
					res && this.handleResetCur();
				});
			} else {
				CumulativeClearance.popup({
					record: obj.record
				}).then(res => {
					res && this.handleResetCur();
				});
			}
		}
	}
};