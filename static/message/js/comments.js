//選擇班級後送出
var showMessageAction = {
	"action" : "show_message",
	"hash" : localStorage.getItem("hash"),
	"Class" : "",
	
}
//按下next後送出
var sendMsg = {
	"action" : "send_message",
	"userName" : "",
	"date" : "",
	"time" : "",
	"content" : "",
	"hash" : localStorage.getItem("hash"),
}
//一開始送出
var collectClass = {
	"action" : "selectClass",
	"userName" : localStorage.getItem("userName"),
	"hash" : localStorage.getItem("hash"),

	"Classes":
	[
		{"Class" : "CSIE110"},
		{"Class" : "CSIE111"},
		{"Class" : "LOL201"},
	]
}

//----navbar設定----
var navapp = new Vue({
	delimiters : ['${', '}'],
	el : "#navapp",
	data:{
		whichShow : "",
		userid : "",
		name : "",
	},
	created(){
		this.chooseProblems()
	},
	methods:{
		chooseProblems(){
			let self = this
			self.name = localStorage.getItem("userName")
			self.userid = localStorage.getItem("who")
			if(self.userid === "admin"||self.userid === "teacher"){
				self.whichShow = "teacher"
			}
			else if(self.userid === "student"){
				self.whichShow = "student"
			}
		},
		clearStorage(){
			localStorage.clear()
		}
	},
})

//----留言內容輸入----
Vue.component('v-textarea', {
	delimiters : ['${', '}'],
	template: '#v-textarea',
	props : {
		who : {
			type : String,
			default : ""
		},
		value : {
			type : String,
			default : ""
		},
		username : {
			type : String,
			default : localStorage.getItem("userName")
		}
	},
});

//----留言結果顯示----
Vue.component("v-list", {
	delimiters : ['${', '}'],
	template : '#v-list',
	props : {
		list : {
			type : Array,
			default : []
		},
		candelete: {
			type : Boolean
		},
	},
	data : function(){
		return {
			itemlist : this.list
		}
	},
	methods : {
		handleReply(index){
			this.$emit("reply", index)
		},
		handleDelete(index){
			this.$emit("delete", index)
		}
	}
});

//----留言區域父組件---
var app1 = new Vue({
	delimiters : ['${', '}'],
	el : "#app1",
	data : {
		inputContent : "", //使用者輸入訊息
		list : [],      //準備顯示的資訊列表
		msgList : [],    //接收其他人的訊息列表
		msgSend : "",    //接收使用者傳的訊息
		dateSend : "",   //送出的日期
		timeSend : "",   //送出的時間
		username : localStorage.getItem("userName"),
		who : localStorage.getItem("who"),
		candelete : false,
		classSet : [],   //使用者的班級列表(或全部?)
		selectedClass : "", //選擇的班級
		nowFalse : false,   //班級列表先藏起來
	},
	created(){
		this.checkID()
		this.setClass()
	},
	mounted(){
		this.showMessages()
	},
	methods : {
		checkID(){
			let self = this
			if(self.who === "admin"){
				self.candelete = true
			}
		},
		setClass(){//取得使用者參加之班級
			let self = this
			axios.post("http://127.0.0.1:8000/message/",collectClass)
				.then(function(response){
					console.log(response.data)
					console.log(response.status)
					console.log(response.statusText)
					console.log(response.headers)
					console.log(response.config)
					self.classSet = response.data.Classes
				})
				.catch(function(error){
					console.log(error)
				})
		},
		showMessages(){//點擊班級列表時秀出所點擊班級之留言
			let self = this
			axios.post("http://127.0.0.1:8000/message/",showMessageAction)
				.then(function(response){
					console.log(response.data)
					console.log(response.status)
					console.log(response.statusText)
					console.log(response.headers)
					console.log(response.config)
					console.log(self.selectedClass)
					self.msgList = response.data.message
					for(let i=self.msgList.length-1; i>=0; i--){
						let date = self.msgList[i].date
						let time = self.msgList[i].time
						self.msgList[i].showtime = date.substring(0,4) + "/" + date.substring(4,6) + "/" + date.substring(6,8) + " " + time.substring(0,2) + ":" + time.substring(2,4)
						self.list.push({
							name : self.msgList[i].userName,
							message : self.msgList[i].content,
							time : self.msgList[i].showtime,
						})
					}
				})
				.catch(function(error){
					console.log(error)
				})
		},
		setTime(){//設定觸發時的時間
			let self = this
			self.dateSend = ""
			self.timeSend = ""
      var now = new Date()
			var year = now.getFullYear()
			var month = now.getMonth() + 1
			var day = now.getDate()
			var hh = now.getHours()
			var mm = now.getMinutes()
			self.dateSend = String(year)
			if(month < 10){
				self.dateSend += "0"
			}
			self.dateSend += String(month)
			if(day < 10){
				self.dateSend += "0"
			}      
			self.dateSend += String(day)   
					
			if(hh < 10){
				self.timeSend += "0"
			}
			self.timeSend += String(hh)
			if (mm < 10){
				self.timeSend += '0'
			}
			self.timeSend += String(mm)
			console.log(self.dateSend)
			console.log(self.timeSend)
    },
		handleSend(){
			let self = this
			self.msgSend = ""
			self.setTime()
			sendMsg.userName = localStorage.getItem("userName")
			sendMsg.date = this.dateSend
			sendMsg.time = this.timeSend
			sendMsg.content = this.inputContent
			axios.post("http://127.0.0.1:8000/message/",sendMsg)
				.then(function(response){
					console.log(response.data)
					console.log(response.status)
					console.log(response.statusText)
					console.log(response.headers)
					console.log(response.config)
					console.log(self.selectedClass)
					self.msgSend = response.data
					let date = self.msgSend.date
					let time = self.msgSend.time
					self.msgSend.showtime = date.substring(0,4) + "/" + date.substring(4,6) + "/" + date.substring(6,8) + " " + time.substring(0,2) + ":" + time.substring(2,4)
					self.msgList.push({
						userName : self.msgSend.userName,
						content : self.msgSend.content,
						showtime : self.msgSend.showtime,
					})
					self.list.splice(0,self.list.length)
					for(let i=self.msgList.length-1; i>=0; i--){
						self.list.push({
							name : self.msgList[i].userName,
							message : self.msgList[i].content,
							time : self.msgList[i].showtime,
						})
					}
				})
				.catch(function(error){
					console.log(error)
				})
			if(this.inputContent === ""){
				alert("Please enter comments")
				return
			}
			this.inputContent = ""
		},
		handleReply : function(index){
			var name = this.list[index].name;
			this.inputContent = "reply@" + name + ": ";
		},
		handleDelete : function(index){
			this.list.splice(index, 1)
		}
	}
});
