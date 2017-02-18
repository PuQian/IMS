	var socket;


	var temp ;
	if (!window.WebSocket) {
		window.WebSocket = window.MozWebSocket;
	}
	if (window.WebSocket) {
		// socket = new WebSocket("ws://10.108.114.252:8650/ws");
		socket = new WebSocket("ws://10.108.113.208:8650/ws");
		socket.onmessage = function(event) {
			console.log(event.data);
			var ta = document.getElementById('responseText');
			var JSONMessage= JSON.parse(event.data);
			console.log(JSONMessage);
			ta.value = ta.value + '\n' + "username = " + JSONMessage.username+"  "+event.data;
			handleCSMessage(JSONMessage);
		};
		socket.onopen = function(event) {
			var ta = document.getElementById('responseText');
			ta.value = "连接开启!";
		};
		socket.onclose = function(event) {
			var ta = document.getElementById('responseText');
			ta.value = ta.value + "连接被关闭";
		};
	} else {
		alert("你的浏览器不支持 WebSocket！");
	}

	function send(message) {
		if (!window.WebSocket) {
			return;
		}
		if (socket.readyState == WebSocket.OPEN) {
			//先变成json格式再发出	
			socket.send(JSON.stringify(message));
		} else {
			alert("连接没有开启.");
		}
	}

	//JSONMessage 已经是JSON格式了
	function handleCSMessage(JSONMessage){
		var Event = JSONMessage.event;
		if(Event == com.webrtc.Socket.TYPE.OK){
			var username = JSONMessage.username;
			var roomid = JSONMessage.roomid;
			console.log(username+roomid);
            createMeetingVideoLabel2(roomid);
			//至此已收到UDPClient的"UDP_OK"响应信息了，应该构造信令发往wcs了
		}
		else if(Event == com.webrtc.Socket.TYPE.FAILED){
			var username = JSONMessage.username;
			var reason = JSONMessage.reason;
			console.log(username+reason);
			//至此已收到UDPClient的"UDP_OK"响应信息了，应该构造信令发往wcs了
		}
		else if(Event == com.webrtc.Socket.TYPE.JOIN){
			var roomid = JSONMessage.roomid;
            createMeetingVideoLabel2(roomid);
		}
		else if(Event == com.webrtc.Socket.TYPE.MESSAGE){
			var username = JSONMessage.username;
			var content = JSONMessage.content;
			console.log(username);
			console.log(content);


		}
	}

	function sendBefore() {
		var username = com.webrtc.sigSessionConfig.username;
		var events = $("input[name='event']").val();
		var theme = $("input[name='theme']").val();
		var confName = $("input[name='confName']").val();
		var confType =  Number($("input[name='confType']").val());
		var duration = Number($("input[name='duration']").val());
		var isImmediateConf = Number($("input[name='isImmediateConf']").val());
		var reservationTime = $("input[name='reservationTime']").val();
		var cycle = Number($("input[name='cycle']").val());
		var member_num = Number($("input[name='member_num']").val());
		var members = $("input[name='members']").val();

		var socketMsg = com.webrtc.Socket.SocketMessage(events, username, theme, confName, confType, duration, isImmediateConf, reservationTime, cycle, member_num, members);
		console.log("Send socket : " + JSON.stringify(socketMsg));


		send(socketMsg);
	}


	function loginTonetty(){
		var Username = document.getElementById("callerid").value;
		var ConnectMsg = com.webrtc.Socket.ConnectMessage(com.webrtc.Socket.ConnectType.CONNECT, Username);
		console.log("Send socket : " + JSON.stringify(ConnectMsg));


		send(ConnectMsg);
	}

	var requestmeetinginfo = function(){
		var Username = "9999";

		var RequestMsg = com.webrtc.Socket.RequestMessage(com.webrtc.Socket.TYPE.REQUEST, Username,com.webrtc.Socket.MeeetingType.MeetingList);
		console.log("Send socket : " + JSON.stringify(RequestMsg));


		send(RequestMsg);
	}

	com.webrtc.Socket = {

		SocketProtocol: function(events, username, theme, confName, confType, duration, isImmediateConf, reservationTime, cycle, member_num, members) {
			var temp = {
				"event": events,
				"username": username,
				"theme": theme,
				"confName": confName,
				"confType": confType,
				"duration": duration,
				"isImmediateConf": isImmediateConf,
				"reservationTime": reservationTime,
				"cycle": cycle,
				"member_num": member_num,
				"members": members,

			};
			return temp;
		},

		SocketMessage: function(events, username, theme, confName, confType, duration, isImmediateConf, reservationTime, cycle, member_num, members) {
			var socketMsg = new com.webrtc.Socket.SocketProtocol(events, username, theme, confName, confType, duration, isImmediateConf, reservationTime, cycle, member_num, members);
			return socketMsg;
		},

		ConnectProtocol: function(type,username) {
			var temp = {
				"type": type,
				"username": username,
			};
			return temp;
		},
		ConnectMessage: function(type,username) {
			var socketMsg = new com.webrtc.Socket.ConnectProtocol(type,username);
			return socketMsg;
		},

		RequestProtocol: function(type,username,content) {
			var temp = {
				"type": type,
				"username": username,
				"content":content
			};
			return temp;
		},
		RequestMessage: function(type,username,content) {
			var socketMsg = new com.webrtc.Socket.RequestProtocol(type,username,content);
			return socketMsg;
		}
	},

	com.webrtc.Socket.TYPE = {
    	OK:"UDP_OK",
    	FAILED:"UDP_FAILED",
        JOIN:"UDP_JOIN",
        MESSAGE:"UDP_MESSAGE",
        REQUEST:"UDP_REQUEST"

	},

	com.webrtc.Socket.ConnectType = {
		CONNECT: "connect",
		DISCONNECT: "disconnect"
	},

	com.webrtc.Socket.MeeetingType = {
		MeetingList: "meetinglist" 
	}
