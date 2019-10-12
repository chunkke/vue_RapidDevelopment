<template>
	<div>
		<header class="mui-bar mui-bar-nav">
			<img src="static/img/iconback.png" alt="" @click="back">
			<h1 class="mui-title">扫描</h1>
		</header>
		<div id="bcid"></div>
		<div class="res" v-if="codeUrl">扫描结果：{{ codeUrl }}</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			codeUrl: '',
			_scan: null
		};
	},
	mounted() {
		setTimeout(() => {
			this.startRecognize();
		}, 500);
	},
	methods: {
		back(){
			this.$router.go(-1)
		},
		startRecognize() {
			let _this = this;
			if (!window.plus) return;
			//创建扫描控件
			var scan = new plus.barcode.Barcode('bcid', [plus.barcode.QR, plus.barcode.CODE128], { frameColor: '#00FF00', scanbarColor: '#00FF00' });
			_this._scan = scan;
			//开始扫描
			scan.start();
			scan.onmarked = onmarked;
			function onmarked(type, result, file) {
				switch (type) {
					case plus.barcode.QR:
						type = 'QR';
						break;
					case plus.barcode.CODE128:
						type = 'CODE128';
						break;
					default:
						type = '其它' + type;
						break;
				}
				_this.codeUrl = result;
				_this.sendCode(result, _this);
				console.log(result ,type);
				_this.$store.commit('setCode', result);
				_this.$router.push({ path: '/generate_two', query: { cid: result } });
			}
		},
		sendCode(qrcode, self) {
			console.log('二维码');
			self.$axios
				.get(self.api.qrcode_url, {
					params: {
						qrcode
					}
				})
				.then(res => {
					console.log('获取到' + res);
				})
				.catch(err => {
					console.log(err);
				});
		}
	},
	beforeDestroy() {
		if (this._scan) {
			//关闭扫描控件
			this._scan.close();
		}
	},
	computed: {}
};
</script>

<style lang="css">
.outCode {
  position: fixed;
  top: 88px;
  left: 0;
  right: 0;
  bottom: 0;
}
#bcid {
  width: 100%;
  position: fixed;
  top: 88px;
  left: 0;
  right: 0;
  bottom: 0;
  text-align: center;
  color: #fff;
  z-index: 100;
}
.res{
  position: fixed;
  bottom: 0;
  text-align: center;
  font-size: 28px;
  color: #333;
}
</style>
