<template>
	<div>
		<header class="mui-bar mui-bar-nav"><h1 class="mui-title">数据采集</h1></header>
		<div class="mui-content">
			<div class="upLoad">
				<div class="imgContainer">
					<div v-for="(item, index) in imgSrc" @change="getImg">
						<van-uploader :after-read="onRead" accept="image/*" :id="index" capture="camera"></van-uploader>
						<img :src="item" />
					</div>
				</div>
				<div>上传照片</div>
			</div>
			<div class="form">
				<div class="formRow">
					<div class="formTitle">录入时间*：</div>
					<input type="text" :placeholder="time()" disabled />
				</div>
				<div class="formRow">
					<div class="formTitle">作物选择*：</div>
					<div class="outSelect"><my-select v-model="crops" url="transport" :options="optionList" @listenSelect="upAddress"></my-select></div>
				</div>
				<div class="formRow">
					<div class="formTitle">批次编码：</div>
					<input type="text" v-model="code" disabled />
				</div>
				<div class="formRow">
					<div class="formTitle">出库数量*：</div>
					<input class="processing" type="text" @input="sNumber" id="unit" /><label for="unit">吨</label>
				</div>
				<div class="formRow">
					<div class="formTitle">运输单位*：</div>
					<input type="text" v-model="company" />
				</div>
				<div class="formRow">
					<div class="formTitle">运输方式*：</div>
					<div class="outSelect"><tran-select v-model="mode" @transportMode="tMode"></tran-select></div>
				</div>
				<div class="formRow">
					<div class="formTitle">定位*：</div>
					<input type="text" v-model="place" />
					<img class="mapIcon" src="../../../static/img/map.png" @click="place = locat" />
				</div>
				<div class="formRow">
					<div class="formTitle">运输负责人*：</div>
					<input type="text" v-model="name" />
				</div>
				<div class="formRow">
					<div class="formTitle">联系方式：</div>
					<input type="number" v-model="telPhone" />
				</div>
			</div>
			<button class="mui-btn" @click="upLoad()">生成二维码</button>
		</div>
		<van-popup v-model="show2" class="van-two" :close-on-click-overlay="false">
			<div @click="success()"><span>运输信息已录入成功！</span></div>
		</van-popup>
		<footer-nav :actived="1"></footer-nav>
	</div>
</template>

<script>
import footerNav from '@/components/footerNav.vue';
import imgRow from '@/components/imgRow.vue';
import mySelect from '../../components/mySelect.vue';
import tranSelect from '../../components/tranSelect.vue';
export default {
	data() {
		return {
			optionList: [{ sname: 'Loading' }],
			imgSrc: ['static/img/add.png', 'static/img/add.png', 'static/img/add.png'],
			imgId: '',
			imgData: [],
			crops: '',
			cid: '',
			index: '',
			locat: '',
			number: '',
			code: '',
			company: '',
			mode: '公路运输',
			place: '',
			name: '',
			telPhone: '',
			show2: false,
		};
	},
	methods: {
		success () {
			this.show2 = false;
			this.$router.push({ path: '/generate/entryTransport', query: { cid: this.cid } });
		},
		ready() {
			var geolocation = new BMap.Geolocation();
			geolocation.getCurrentPosition(
				r => {
					this.locat = r.address.city + r.address.province + r.address.district + r.address.street;
				},
				{ enableHighAccuracy: true }
			);
		},
		sNumber() {
			try {
				if (Number(event.target.value)) {
					if (event.target.value.match(/^\.(\.*)?/)[0] === '.') {
						event.target.value = '';
						this.number = event.target.value;
						return;
					}
				} else {
					event.target.value = '';
				}
			} catch (e) {
				event.target.value = event.target.value.match(/^0(\.\d{0,4})?|^[1-9][0-9]*(\.\d{0,4})?/g)[0];
				this.number = event.target.value;
			}
		},
		time() {
			this.$store.commit('newTime');
			return this.$store.state.time;
		},
		tMode(item) {
			this.mode = item;
			console.log(this.mode);
		},
		jump(src) {
			this.$router.push('collect/' + src);
		},
		toGood(name) {
			this.$router.push({
				path: 'collect/goods?name=' + name
			});
		},
		upAddress(item, id, idx, coding) {
			this.crops = item;
			this.cid = id;
			this.index = idx;
			this.code = coding;
		},
		getImg(event) {
			this.imgId = event.target.id;
		},
		onRead(file) {
			let ts = this;
			if (file.file.size < 1024 * 1024 * 2) {
				ts.imgSrc.splice(ts.imgId, 1, file.content);
				ts.imgData[ts.imgId] = file.content;
				console.log(file.content);
			} else {
				this.$toast({
					mask: true,
					message: '上传图片不能超过2M',
					duration: 2000
				});
			}
		},
		upLoad() {
			let transport = {
				adress: this.locat,
				cid: this.cid,
				index: this.index,
				entrytime: this.time(),
				status: 0,
				quantity: this.number,
				coding: this.code,
				courier: this.company,
				way: this.mode,
				principal: this.name,
				tel: this.telPhone,
				imgList: [...this.imgData]
			};
			if (transport.tel) {
				// 判断手机号是否标准
				if (this._common.phone(transport.tel)) {
					// 进行上传流程
					this.$axios
						.post(this.api.postInputTransport_url, transport)
						.then(response => {
							console.log(response);
							if (response.data.code === 200) {
								this.show2 = true;
								// 这里是处理正确的回调
							}
						})
						.catch(response => {
							//捕捉异常
							console.log(response);
						});
				} else {
					this.$toast('请输入正确的手机号');
				}
			} else {
				this.$toast('手机号为空');
			}
		}
	},
	created: function() {
		this.ready();
		this.$axios
			.get(this.api.getSeedForTransport_url)
			.then(response => {
				console.log(response);
				// 这里是处理正确的回调
				if (200 == response.data.code) {
					if (response.data.data.length !== 0) {
						this.optionList = response.data.data;
					} else {
						this.optionList = [{ sname: '暂无记录' }];
					}
				}
			})
			.catch(response => {
				//捕捉异常
				console.log(response);
			});
	},
	components: {
		footerNav,
		imgRow,
		mySelect,
		tranSelect
	}
};
</script>

<style scoped>
@import './src/assets/css/collect.css';
.mapIcon {
	margin: 0 20px 0 10px;
	width: 35px;
	height: 50px;
	position: relative;
	right: -15px;
}
.mui-icon {
	height: 50px;
	width: 50px;
}
.border {
	position: absolute;
	bottom: 0;
	left: 0;
	background-color: #007aff;
	width: 20%;
	height: 4px;
	border-radius: 4px;
}
.secTitle {
	color: #545454;
	font-size: 30px;
	padding: 20px 30px;
	background-color: #f2f2f2;
}
.rowContainer {
	position: absolute;
	width: 100%;
	height: 100%;
	background-color: #f2f2f2;
}
.outSelect {
	width: 68%;
}
.van-two {
	position: absolute;
	top: 500px;
	padding: 22px;
	width: 75%;
	height: 250px;
	border-radius: 10px;
	text-align: center;
}
.van-two span {
	height: 200px;
	line-height: 200px;
	color: #f4af0a;
	font-size: 34px;
	font-family: PingFang-SC-Medium;
}
</style>
