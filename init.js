if(typeof com == "undefined"){
    com = {};
}



com.webrtc = {
	app : null ,
	sigSession : null ,
	
	starting : function(){

		if(this.app == null){
			this.app = new com.webrtc.WAppBase();
		}

		if(this.sigSession == null){
			this.sigSession = new com.webrtc.WSigSessionBase();


    		$(this.sigSession).bind(com.webrtc.SigSessionEvents.LoginSuccess,OnLoginSuccess);
    		$(this.sigSession).bind(com.webrtc.SigSessionEvents.LoginFail,OnLoginFail);
   			$(this.sigSession).bind(com.webrtc.SigSessionEvents.LogoutFinish,OnLogoutFinish);
		}


	},

	DeleteUserSession:function(SessionID){

		com.webrtc.app.RemoveSession(SessionID);
	},
	
	getMediaSupport : function(){
		if(typeof navigator.webkitGetUserMedia == 'undefined' && (typeof navigator.mozGetUserMedia == 'undefined' || typeof mozRTCPeerConnection == 'undefined')){
			return false;
		} else{
			return true;
		}
	},
	//发送文件前端显示调用函数
	sendingfile:function(FileName,pre,iter,allchunkIDslength,RemoteID,SessionID){
		console.log(FileName+ " " + pre+ " " +iter+ " " +allchunkIDslength);
		if((pre+iter)==1){
			
            var div2=document.createElement("div");  
            div2.setAttribute("id",RemoteID+SessionID+FileName+"progressbar"); 
            document.getElementById("dialog-send").appendChild(div2);

            var div3=document.createElement("div");   
            div3.setAttribute("id",RemoteID+SessionID+FileName+"text1"); 
            var content = document.createTextNode(FileName);
            div3.appendChild(content);
            document.getElementById("dialog-send").appendChild(div3);

            var div4=document.createElement("div");  
            div4.setAttribute("id",RemoteID+SessionID+FileName+"text2"); 
            div4.setAttribute("class","progressbar-label"); 
            div2.appendChild(div4);

			$("#dialog-send").dialog({height:250,width:600, 
                     buttons:{"关闭": function() {$("#dialog-send").dialog("close");}} });

			var FileName_progressbar=document.getElementById(RemoteID+SessionID+FileName+"progressbar");
			var FileName_text1=document.getElementById(RemoteID+SessionID+FileName+"text1");
			var FileName_text2=document.getElementById(RemoteID+SessionID+FileName+"text2");

			$(FileName_progressbar).progressbar({ value: false,});
			$(FileName_progressbar).progressbar("value",(pre+iter)/allchunkIDslength*100);
		    $(FileName_text2).text("已发送：" + parseInt($(FileName_progressbar).progressbar( "value" )) + "%" );
		}
		else{
			var FileName_progressbar=document.getElementById(RemoteID+SessionID+FileName+"progressbar");
			var FileName_text1=document.getElementById(RemoteID+SessionID+FileName+"text1");
			var FileName_text2=document.getElementById(RemoteID+SessionID+FileName+"text2");

			$(FileName_progressbar).progressbar("value",(pre+iter)/allchunkIDslength*100);
		    $(FileName_text2).text("已发送：" + parseInt($(FileName_progressbar).progressbar( "value" ))+ "%" );
		}
	},
	//接受文件前端显示调用函数
	receivingfile:function(FileName,numOfVerifiedChunks,numOfChunks,RemoteID,SessionID)
	{
		console.log(FileName+ " " +numOfVerifiedChunks+ " " +numOfChunks);
		console.log(RemoteID+SessionID);
		if(numOfVerifiedChunks==1){
            
        	var div2=document.createElement("div");  
            div2.setAttribute("id",RemoteID+SessionID+FileName+"progressbar"); 
            document.getElementById("dialog-receive").appendChild(div2);

            var div3=document.createElement("div");  
            div3.setAttribute("id",RemoteID+SessionID+FileName+"text1"); 
            var content = document.createTextNode(FileName);
            div3.appendChild(content);
            document.getElementById("dialog-receive").appendChild(div3);

            var div4=document.createElement("div"); 
            div4.setAttribute("id",RemoteID+SessionID+FileName+"text2"); 
            div4.setAttribute("class","progressbar-label"); 
            div2.appendChild(div4);

            var FileName_progressbar=document.getElementById(RemoteID+SessionID+FileName+"progressbar");
			var FileName_text1=document.getElementById(RemoteID+SessionID+FileName+"text1");
			var FileName_text2=document.getElementById(RemoteID+SessionID+FileName+"text2");

			$("#dialog-receive").dialog({height:250,width:600, 
               buttons:{"关闭": function() {$("#dialog-receive").dialog("close");}} });

			$(FileName_progressbar).progressbar({ value: false,});
			$(FileName_progressbar).progressbar("value",numOfVerifiedChunks/numOfChunks*100);
		    $(FileName_text2).text("已接收：" + parseInt($(FileName_progressbar).progressbar( "value" )) + "%" );
			
		}
		else{
	       
            var FileName_progressbar=document.getElementById(RemoteID+SessionID+FileName+"progressbar");
			var FileName_text1=document.getElementById(RemoteID+SessionID+FileName+"text1");
			var FileName_text2=document.getElementById(RemoteID+SessionID+FileName+"text2");

		    $(FileName_progressbar).progressbar("value",numOfVerifiedChunks/numOfChunks*100);
		    $(FileName_text2).text("已接收：" + parseInt($(FileName_progressbar).progressbar( "value" )) + "%" );
			
		}
	},
	//发送完毕前端显示调用函数
	sendfilefinish:function(FileName,RemoteID,SessionID)
	{
		console.log(FileName+ " send finish!");

		var FileName_progressbar=document.getElementById(RemoteID+SessionID+FileName+"progressbar");
		var FileName_text1=document.getElementById(RemoteID+SessionID+FileName+"text1");
		var FileName_text2=document.getElementById(RemoteID+SessionID+FileName+"text2");

		$(FileName_text2).text("");
		$(FileName_progressbar).progressbar("destroy");

		var content = document.createTextNode("    发送成功！");
        document.getElementById(RemoteID+SessionID+FileName+"text1").appendChild(content);      
	},
	//接受完毕前端显示调用函数
	receivefilefinish:function(FileName,RemoteID,SessionID)
	{
		console.log(FileName+ " receive finish!");
		console.log(RemoteID+SessionID);

		var FileName_progressbar=document.getElementById(RemoteID+SessionID+FileName+"progressbar");
		var FileName_text1=document.getElementById(RemoteID+SessionID+FileName+"text1");

		console.log(FileName_text1);
		var FileName_text2=document.getElementById(RemoteID+SessionID+FileName+"text2");

		$(FileName_text2).text("");
		$(FileName_progressbar).progressbar("destroy");

		var content = document.createTextNode("    接收成功！");
        document.getElementById(RemoteID+SessionID+FileName+"text1").appendChild(content); 
	},


	//关闭显示界面调用函数
	recoverInterface:function(RemoteUserID,SessionType,ModuleType,SessionID){
		console.log("begin to delete interface");
		deleteSelectedLabel(RemoteUserID,SessionType,ModuleType);
	},

	//错误信息界面调用函数
	onCallFailed :function(RemoteUserID,errCode,SessionType,ModuleType){
		/* 1 ：对端拒绝请求；
           2 ：对端不在线；
           3 ：请求超时（现在设的是120s，如果对方没有接受请求会触发超时）；
           7 ：其他错误；
         */
		var contents = null;
		if(errCode == this.Session.SESSION_ERROR["refused"]){
			
			contents = "ERROR! "+RemoteUserID+" "+SessionType+" "+ModuleType+'对端拒绝请求';
			console.log("User refused!");
		} else if(errCode == this.Session.SESSION_ERROR["offline"]){
			contents = "ERROR! "+RemoteUserID+" "+SessionType+" "+ModuleType+'对端不在线';
			console.log("User offline!");
		} else if(errCode == this.Session.SESSION_ERROR["timeout"]){
			contents ="ERROR! "+RemoteUserID+" "+SessionType+" "+ModuleType+'请求超时';
			console.log("Session timeout!");
		} else if(errCode == this.Session.SESSION_ERROR["other"]){
			contents = "ERROR! "+RemoteUserID+" "+SessionType+" "+ModuleType+'其他错误';
			console.log("Other error:");
			console.log(errCode);
		}
		$.fillTipBox({type:'danger', icon:'glyphicon-alert', content:contents});
	},

	onCallActive:function(remoteID,sessionType,moduleType,sessionID){
		 console.log(remoteID+sessionType+moduleType);
        var str = null;
        var type = null;
        if (moduleType == "video")
        {
            str = "视频通话";
        }
        else if (moduleType == "audio")
        {
            str = "音频通话";
        }
        else if(moduleType == "file")
        {
           str ="文件传输";
        }
        else if(moduleType == "audiomeeting")
        {
           str ="会议音频通话";
        }
         else if(moduleType == "videomeeting")
        {
           str ="会议视频通话";
        }
         else if(moduleType == "imsaudio")
        {
           str ="IMS音频通话";
        }
         else if(moduleType == "imsvideo")
         {
           str ="IMS视频通话";
        }


        if(sessionType == "P2P")
        {
            type="P2P";
        }
        else if(sessionType == "IMS")
        {
            type="IMS";
        }
        else if(sessionType == "MEETING")
        {
            type="MEETING";
        }
        else{

        }

        var contents = "与" + remoteID + "的" + "类型为"+type+"的"+str + "正在进行中";
		
		$.fillTipBox({type:'success', icon:'glyphicon-ok-sign', content:contents});
	}



	

}