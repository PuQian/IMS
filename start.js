(function($)
{
    $(document).ready(function()
    {
        //用户关闭页面时调用，释放资源
        $(window).unload(function()
        {
            
        });
    });
})(jQuery);

com.interf = {
    login : function(obj){
        //var Server = com.websockets[0];
        
        console.log("begin to loginwebrtc");   
        //com.webrtc.sigSessionConfig.serverhost = Server;
        com.webrtc.sigSessionConfig.serverhost = obj.Server;
        com.webrtc.sigSessionConfig.username = obj.Username;
        com.webrtc.sigSessionConfig.token = obj.Token;
        com.webrtc.starting();
        com.webrtc.sigSession.Login();
        com.webrtc.app.init(obj.onNotify);
    },
    logout : function(){
        com.webrtc.sigSession.Logout();
    },
    call : function(obj){
        //var tempSessionID = null;
        //WOTTSession(video/audio)
        if(!obj.isIMSCall && !obj.isMeeting){
             var newWOTTSession = new com.webrtc.WOTTSession();          
             var newSessionBase = new com.webrtc.WUserSessionBase();
             newWOTTSession.calleeName = obj.gRemoteUserID;
             newWOTTSession.init(obj.onResponse);
             
             $.extend( true, newWOTTSession,newSessionBase);

             newWOTTSession.setSessionID(obj.sessionID);

             com.webrtc.app.AddSession(newWOTTSession);
                
             var configuration;
             if(obj.isVideo){
                 //var configuration = new Conf(com.webrtc.UserSession.TYPE.P2P,com.webrtc.UserSession.MODULE_TYPE.VIDEO,true,true, {"urls" : "stun:23.21.150.121","url" : "stun:23.21.150.121"},false);
                 configuration = new Conf(com.webrtc.UserSession.TYPE.P2P,com.webrtc.UserSession.MODULE_TYPE.VIDEO,true,true, { "urls": "turn:222.200.180.144","url": "turn:222.200.180.144","credential":"123456","username":"gsta"},false);
             }
             else if(obj.isAudio){
                 //var configuration = new Conf(com.webrtc.UserSession.TYPE.P2P,com.webrtc.UserSession.MODULE_TYPE.AUDIO,true,true, {"urls" : "stun:23.21.150.121","url" : "stun:23.21.150.121"},false);
                 configuration = new Conf(com.webrtc.UserSession.TYPE.P2P,com.webrtc.UserSession.MODULE_TYPE.AUDIO,true,true,{ "urls": "turn:222.200.180.144","url": "turn:222.200.180.144","credential":"123456","username":"gsta"},false);
             }
             com.webrtc.app.usersessionlist[newWOTTSession.SessionID].Call(obj.gRemoteUserID,configuration);
        }
        //IMSSession(IMSVideo/IMSAudio)
        else if(obj.isIMSCall && !obj.isMeeting){
            var newWIMSSession = new com.webrtc.WIMSSession();
            var newSessionBase = new com.webrtc.WUserSessionBase();
            newWIMSSession.calleeName = obj.gRemoteUserID;
            newWIMSSession.init(obj.onResponse);
            
            $.extend( true, newWIMSSession,newSessionBase);

            newWIMSSession.setSessionID(obj.sessionID);
            com.webrtc.app.AddSession(newWIMSSession);
            
            var configuration;
            if(obj.isVideo){
                var configuration = new Conf(com.webrtc.UserSession.TYPE.IMS,com.webrtc.UserSession.MODULE_TYPE.IMSVIDEO,true,true, { "urls": "turn:222.200.180.144", "url": "turn:222.200.180.144","credential":"123456","username":"gsta"},false);
            }
            else if(obj.isAudio){
                var configuration = new Conf(com.webrtc.UserSession.TYPE.IMS,com.webrtc.UserSession.MODULE_TYPE.IMSAUDIO,true,true, {"urls": "turn:222.200.180.144",  "url": "turn:222.200.180.144","credential":"123456","username":"gsta"},false);
            }           
            com.webrtc.app.usersessionlist[newWIMSSession.SessionID].Call(obj.gRemoteUserID,configuration);
            
        }
        //MeetingSession(MeetingVideo)
        else if(obj.isMeeting){
            var newWMeetingSession = new com.webrtc.WMeetingSession();
            var newSessionBase = new com.webrtc.WUserSessionBase();

            newWMeetingSession.calleeName = obj.gRemoteUserID;
            newWMeetingSession.init(obj.onResponse);

            $.extend( true, newWMeetingSession,newSessionBase);
            newWMeetingSession.setSessionID(obj.sessionID);
            com.webrtc.app.AddSession(newWMeetingSession);

            //var configuration = new Conf(com.webrtc.UserSession.TYPE.MEETING,com.webrtc.UserSession.MODULE_TYPE.VIDEOMEETING ,true,true, {"urls" : "stun:23.21.150.121","url" : "stun:23.21.150.121"},false);
            var configuration = new Conf(com.webrtc.UserSession.TYPE.MEETING,com.webrtc.UserSession.MODULE_TYPE.VIDEOMEETING ,true,true, { "urls": "turn:222.200.180.144","url": "turn:222.200.180.144","credential":"123456","username":"gsta"},false);
            
            com.webrtc.app.usersessionlist[newWMeetingSession.SessionID].Call(obj.gRemoteUserID,configuration);
        }
    
    },
    hangup: function(obj){
        if(true == com.webrtc.app.isExistSession(obj.sessionID))
        {
            //WOTTSession
            if(!obj.isIMSCall && !obj.isMeeting){
                if(obj.isVideo)
                    com.webrtc.app.usersessionlist[obj.sessionID].HangUp(obj.gRemoteUserID,com.webrtc.UserSession.MODULE_TYPE.VIDEO);
                else if(obj.isAudio)
                    com.webrtc.app.usersessionlist[obj.sessionID].HangUp(obj.gRemoteUserID,com.webrtc.UserSession.MODULE_TYPE.AUDIO);
            }
            //IMSSession
            else if(!obj.isIMSCall && obj.isMeeting){
                if(obj.isVideo){
                    com.webrtc.app.usersessionlist[obj.sessionID].HangUp(obj.gRemoteUserID,com.webrtc.UserSession.MODULE_TYPE.IMSVIDEO);
                }
                if(obj.isAideo){
                    com.webrtc.app.usersessionlist[obj.sessionID].HangUp(obj.gRemoteUserID,com.webrtc.UserSession.MODULE_TYPE.IMSAUDIO);
                }
            }
            //MeetingSession
            else if(obj.isMeeting){
                com.webrtc.app.usersessionlist[obj.sessionID].HangUp(obj.gRemoteUserID,com.webrtc.UserSession.MODULE_TYPE.VIDEOMEETING);
            }
        }
        else
        {
            console.log("UserSession do not exist!");
        }

    },
    
    sendFile: function(obj){
        if(true == com.webrtc.app.isExistSession(obj.sessionID) 
               && true == com.webrtc.app.usersessionlist[obj.sessionID].isExistModule(obj.sessionID))
        {   
            console.log("begin to sendFiles");
            com.webrtc.file.sendFiles(obj.gRemoteUserID,obj.sessionID);
            return;
        }

        var newWOTTSession = new com.webrtc.WOTTSession();
        var newSessionBase = new com.webrtc.WUserSessionBase();

        newWOTTSession.calleeName = obj.gRemoteUserID;
        newWOTTSession.init(obj.onResponse);

        $.extend( true, newWOTTSession,newSessionBase);
        newWOTTSession.setSessionID(obj.sessionID);
        com.webrtc.app.AddSession(newWOTTSession);

        //var configuration = new Conf(com.webrtc.UserSession.TYPE.P2P,com.webrtc.UserSession.MODULE_TYPE.FILE,true,true, {"urls" : "stun:23.21.150.121","url" : "stun:23.21.150.121"},true);
        var configuration = new Conf(com.webrtc.UserSession.TYPE.P2P,com.webrtc.UserSession.MODULE_TYPE.FILE,true,true,{ "urls": "turn:222.200.180.144","url": "turn:222.200.180.144","credential":"123456","username":"gsta"},true);
                
                
        com.webrtc.app.usersessionlist[newWOTTSession.SessionID].Call(obj.gRemoteUserID,configuration);
    },
    hangupFile: function(obj){
        if(true == com.webrtc.app.isExistSession(obj.sessionID))
        {
            com.webrtc.app.usersessionlist[SessionID].HangUp(obj.gRemoteUserID,com.webrtc.UserSession.MODULE_TYPE.FILE);
        }
        else
        {
            console.log("UserSession do not exist!");
        }
    }
    
};

var OnLoginSuccess = function(){
    console.log("user login success!");
    var contents = "user login success! 用户登录成功";
    $.fillTipBox({type:'info', icon:'glyphicon-info-sign', content:contents})
    //alert("user login success!");
}

var OnLoginFail = function(){
    console.log("user login fail!");
    var contents = "user login fail! 服务器已断开连接";
    $.fillTipBox({type:'info', icon:'glyphicon-info-sign', content: contents})
}

var OnLogoutFinish = function(){
    console.log("user logout finish");
      var contents = "user logout finish 可能在别处登录";
    $.fillTipBox({type:'info', icon:'glyphicon-info-sign', content: contents})
}

//登录
//此函数中获取Username Server Token方式要根据实际系统替换
var loginwebrtc = function(){
    
    //var username = formatChange($('.pub_banner').attr("user"));
    //var token =   $('.pub_banner').attr("thirdpartytoken");

    var username = document.getElementById("callerid").value;
    var server = document.getElementById("server").value;
    var token = "123";

    var obj = {
        Username: username,
        Server: server,
        Token: token,
        onNotify: onNotify,
        onLoginSuccess: OnLoginSuccess,
        onLoginFail: OnLoginFail
    };
    com.interf.login(obj);
    
    console.log("end to loginwebrtc");
}
//登出
var logoutwebrtc = function(){
    var obj = {
        onLogoutFinish: OnLogoutFinish
    }
    com.interf.logout();

}

////////////////////////////////////////////////////demo 删除前端界面
//此函数针对demo，其他系统要结合自身界面进行必要的替换
var deleteSelectedLabel = function(RemoteID,sessionType,moduleType){
    var gRemoteUserID = RemoteID;
    var gLocaleUserID=com.webrtc.sigSessionConfig.username;

        if($(document.getElementById("tr"+gRemoteUserID+sessionType+moduleType)).length >0)
        {
            var $VIDEO=$(document.getElementById(gRemoteUserID+gLocaleUserID+sessionType+moduleType));
            var parentTr= $VIDEO.parent().parent();
            parentTr.remove();
        }
}

//发起音视频通话
var Callvideo = function(gRemoteUserID,SessionID)
{
    var obj = {
        gRemoteUserID: gRemoteUserID,
        sessionID: SessionID,
        isAudio: false,
        isVideo: true,
        isIMSCall: false,
        isMeeting: false,
        onResponse: onResponse
    };
    com.interf.call(obj);
}

var Callaudio = function(gRemoteUserID,SessionID)
{
    var obj = {
        gRemoteUserID: gRemoteUserID,
        sessionID: SessionID,
        isAudio: true,
        isVideo: false,
        isIMSCall: false,
        isMeeting: false,
        onResponse: onResponse
    };
    com.interf.call(obj);
}

var CallIMSvideo = function(gRemoteUserID,SessionID)
{
    var obj = {
        gRemoteUserID: gRemoteUserID,
        sessionID: SessionID,
        isAudio: false,
        isVideo: true,
        isIMSCall: true,
        isMeeting: false,
        onResponse: onResponse
    };
    com.interf.call(obj);
}

var CallIMSaudio = function(gRemoteUserID,SessionID)
{
    var obj = {
        gRemoteUserID: gRemoteUserID,
        sessionID: SessionID,
        isAudio: true,
        isVideo: false,
        isIMSCall: true,
        isMeeting: false,
        onResponse: onResponse
    };
    com.interf.call(obj);
    
}
var CallIMSaudioCalled = function(RemoteID,SessionID){
            var newWIMSSession = new com.webrtc.WIMSSession();
            var newSessionBase = new com.webrtc.WUserSessionBase();
            newWIMSSession.calleeName = RemoteID;
            newWIMSSession.init(onResponse);
            
            $.extend(true, newWIMSSession,newSessionBase);

            newWIMSSession.setSessionID(SessionID);
            com.webrtc.app.AddSession(newWIMSSession);
            
            //sessiontype,moduletype,caller,booldtls,iceservers,booldatechannel
            //onLocalStreamSuccess等需要用到caller，所以不能单纯把caller变为false
            var configuration = new Conf(com.webrtc.UserSession.TYPE.IMS,com.webrtc.UserSession.MODULE_TYPE.IMSAUDIO,true,true, {"urls": "turn:222.200.180.144",  "url": "turn:222.200.180.144","credential":"123456","username":"gsta"},false);          
            com.webrtc.app.usersessionlist[newWIMSSession.SessionID].Call(RemoteID,configuration,"Called");
}

var CallIMSvideoCalled = function(RemoteID,SessionID){
            var newWIMSSession = new com.webrtc.WIMSSession();
            var newSessionBase = new com.webrtc.WUserSessionBase();
            newWIMSSession.calleeName = RemoteID;
            newWIMSSession.init(onResponse);
            
            $.extend(true, newWIMSSession,newSessionBase);

            newWIMSSession.setSessionID(SessionID);
            com.webrtc.app.AddSession(newWIMSSession);
            
            //sessiontype,moduletype,caller,booldtls,iceservers,booldatechannel
            //onLocalStreamSuccess等需要用到caller，所以不能单纯把caller变为false
            var configuration = new Conf(com.webrtc.UserSession.TYPE.IMS,com.webrtc.UserSession.MODULE_TYPE.IMSVIDEO,true,true, {"urls": "turn:222.200.180.144",  "url": "turn:222.200.180.144","credential":"123456","username":"gsta"},false);          
            com.webrtc.app.usersessionlist[newWIMSSession.SessionID].Call(RemoteID,configuration,"Called");
}

var CallMeetingVideo = function(roomId,SessionID){
    console.log("CallMeetingVideo-------roomId"+roomId+"SessionID"+SessionID);
    var obj = {
        gRemoteUserID: roomId,
        sessionID: SessionID,
        isAudio: false,
        isVideo: false,
        isIMSCall: false,
        isMeeting: true,
        onResponse: onResponse
    };
    com.interf.call(obj);
    
   
}

//挂断音视频通话
var HangUpvideo = function(gRemoteUserID,SessionID)
{
    var obj = {
        gRemoteUserID: gRemoteUserID,
        sessionID: SessionID,
        isAudio: false,
        isVideo: true,
        isIMSCall: false,
        isMeeting: false
    };
    com.interf.hangup(obj);
    
}

var HangUpaudio = function(gRemoteUserID,SessionID)
{
    var obj = {
        gRemoteUserID: gRemoteUserID,
        sessionID: SessionID,
        isAudio: true,
        isVideo: false,
        isIMSCall: false,
        isMeeting: false
    };
    com.interf.hangup(obj);
}

var HangUpIMSvideo = function(gRemoteUserID,SessionID)
{
    var obj = {
        gRemoteUserID: gRemoteUserID,
        sessionID: SessionID,
        isAudio: false,
        isVideo: true,
        isIMSCall: true,
        isMeeting: false
    };
    com.interf.hangup(obj);
}

var HangUpIMSaudio = function(gRemoteUserID,SessionID)
{
    var obj = {
        gRemoteUserID: gRemoteUserID,
        sessionID: SessionID,
        isAudio: true,
        isVideo: false,
        isIMSCall: true,
        isMeeting: false
    };
    com.interf.hangup(obj);
}


var HangUpMeetingvideo = function(gRemoteUserID,SessionID)
{
    var obj = {
        gRemoteUserID: gRemoteUserID,
        sessionID: SessionID,
        isAudio: false,
        isVideo: false,
        isIMSCall: false,
        isMeeting: true
    };
    com.interf.hangup(obj);
}
////////////////////////////////////////////////////////////////////////////////////////////
//此函数不能做任何修改，界面或其他函数可以调用它
//SendFileRequest:请求被叫允许打开数据通道，对方同意后会传输文件
var SendFileRequest = function(gRemoteUserID,SessionID)
{
    console.log(SessionID);
    var obj = {
        gRemoteUserID: gRemoteUserID,
        sessionID: SessionID,
        onResponse: onResponse
    };
    com.interf.sendFile(obj);

}
var HangUpfile = function(gRemoteUserID,SessionID)
{
    com.interf.hangupFile({
        gRemoteUserID: gRemoteUserID,
        sessionID: SessionID
    });
}



///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
var onNotify = function(message)
{
    console.log("onNotify!!!");
    var msg = JSON.parse(message.data);
    var SessionID = msg.sessionID;
    var remoteID = msg.from;


    console.log("onnotify sessionID:"+SessionID);
    console.log(remoteID);

    if(typeof sessionID == 'undefined'){
        SessionID = msg.roap.offerSessionId;  //收到offer时为空
    }

    console.log(SessionID);
    console.log("msg.roap.type="+msg.roap.type);  //type为offer

    if(msg.roap.type === com.webrtc.protocol.RTCRoapType['offer']){
        console.log("is offer");
       
        if(false == com.webrtc.app.isExistSession(SessionID)){
            

            var SessionType = msg.sessionType;  //没有sessionType和moduletype
            var ModuleType = msg.moduleType;

            console.log(SessionType);
            console.log(ModuleType);

            if(typeof SessionType == 'undefined'){
                SessionType = setSessionType(remoteID);
            }

            if(typeof ModuleType == 'undefined'){
                var sdpString = new String(JSON.stringify(msg.roap.sdp)+ " ");
                ModuleType = setModuleType(sdpString);
            }

            console.log(SessionType);
            console.log(ModuleType);
            




            var newUserSession = null;

            if(SessionType == com.webrtc.UserSession.TYPE.P2P && ModuleType == com.webrtc.UserSession.MODULE_TYPE.VIDEO)
            {
                    console.log("begin to create videolabel!");
                    createVideoLabel(remoteID,SessionType,ModuleType,SessionID);
                    newUserSession = new com.webrtc.WOTTSession(); 
            }
            else if(SessionType == com.webrtc.UserSession.TYPE.P2P && ModuleType == com.webrtc.UserSession.MODULE_TYPE.AUDIO)
            {
                    console.log("begin to create audiolabel!");
                    createAudioLabel(remoteID,SessionType,ModuleType,SessionID);
                    newUserSession = new com.webrtc.WOTTSession();
            }
            else if(SessionType == com.webrtc.UserSession.TYPE.P2P && ModuleType == com.webrtc.UserSession.MODULE_TYPE.FILE)
            {
                    console.log("begin to create filelabel!");
                    createFileLabel(remoteID,SessionType,ModuleType,SessionID);
                    newUserSession = new com.webrtc.WOTTSession();
            }  
            else if(SessionType == com.webrtc.UserSession.TYPE.IMS && ModuleType == com.webrtc.UserSession.MODULE_TYPE.IMSVIDEO)
            {      
                    createIMSVideoLabel(remoteID,SessionType,ModuleType,SessionID);
                    newUserSession = new com.webrtc.WIMSSession();
            }
            else if(SessionType == com.webrtc.UserSession.TYPE.IMS && ModuleType == com.webrtc.UserSession.MODULE_TYPE.IMSAUDIO)
            {       
                    //现在还没有用到
                    createIMSAudioLabel(remoteID);
                    newUserSession = new com.webrtc.WIMSSession();
            }
            else if(SessionType == com.webrtc.UserSession.TYPE.MEETING && ModuleType == com.webrtc.UserSession.MODULE_TYPE.VIDEOMEETING)
            {
                    //现在还没有用到
                    createMeetingVideoLabel(remoteID,SessionType,ModuleType,SessionID);
                    newUserSession = new com.webrtc.WMeetingSession();
            }
            else if(SessionType == com.webrtc.UserSession.TYPE.MEETING && ModuleType == com.webrtc.UserSession.MODULE_TYPE.AUDIOMEETING)
            {
                    createMeetingAudioLabel(remoteID,SessionType,ModuleType,SessionID);
                    newUserSession = new com.webrtc.WMeetingSession();
            }
            else{
                console.log("other sessiontype :" + SessionType + "or other moduletype :" + ModuleType);
            }

            console.log("后续收到offer操作");
            var newSessionBase = new com.webrtc.WUserSessionBase();

            newUserSession.calleeName = remoteID;
            newUserSession.init(onResponse);

            $.extend( true, newUserSession,newSessionBase);

            newUserSession.setSessionID(SessionID);

            console.log("set usersession to sessionlist");
            com.webrtc.app.AddSession(newUserSession);
        }
    } //end of offer
    //8 （1）auth （2）IMS的info
    else if(msg.roap.type === com.webrtc.protocol.RTCRoapType['auth']){
        console.log("is auth or info");
        //ims的info
        if(msg.from.indexOf("open-ims.com")>=0){
            console.log(msg.roap.msgContent);
            var SessionType = "IMS";
            if(msg.roap.msgContent.indexOf("imsaudio")>=0){
                console.log("收到offer的IMSAudio，转为发送名为answer的offer")
                //收到offer的IMSAudio，开始创建offer(名为answer)
                createIMSAudioLabel3(msg.from,SessionID);
            }
            else if(msg.roap.msgContent.indexOf("imsvideo")>=0){
                console.log("收到offer的IMSVideo，转为发送名为answer的offer")
                //收到offer的IMSAudio，开始创建offer(名为answer)
                createIMSVideoLabel3(msg.from,SessionID);
            }
            return;
        }
    }

    if(true == com.webrtc.app.isExistSession(SessionID)){
        com.webrtc.app.usersessionlist[SessionID].HandleMessage(message);
    }
    else{
        console.log("abandon");
        console.log(message);
    }    
}

var setSessionType=function(RemoteID){
    console.log("begin to set SessionType");
    if(RemoteID.indexOf(com.webrtc.DOMAIN.IMSGZDX)>=0){
        console.log("it is GZDX ims");
        return com.webrtc.UserSession.TYPE.IMS;
    }
    else if(RemoteID.indexOf(com.webrtc.DOMAIN.IMSBUPT)>=0){
        console.log("it is BUPT ims");
        return com.webrtc.UserSession.TYPE.IMS;
    }
    else{
        console.log("can not set SessionType for RemoteID:"+RemoteID);
        return null;
    }
}

var setModuleType = function(sdpString)
{  
    console.log("begin to set ModuleType");

    if(sdpString.indexOf("video") != -1)        
    {
        console.log("it is video");
        return com.webrtc.UserSession.MODULE_TYPE.VIDEO;
    }       
    else if(sdpString.indexOf("audio") != -1) 
    {
        console.log("it is audio");
        return com.webrtc.UserSession.MODULE_TYPE.AUDIO;
    }
    else
    {
        console.log("can not set ModuleType for sdpSting:"+sdpString);
        return null;         
    }
}

var onResponse = function(remoteID,sessionType,moduleType,sessionID){

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
        else if (moduleType == "audiomeeting")
        {
            str = "会议音频通话";
        }
         else if (moduleType == "videomeeting")
        {
            str = "会议视频通话";
        }       
        else if (moduleType == "imsaudio")
        {
            str = "IMS音频通话";
        }
         else if (moduleType == "imsvideo")
        {
            str = "会议视频通话";
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

        var content = "同意来自" + remoteID + "的" + "类型为"+type+"的"+str + "请求？";

        // if(!confirm("同意来自" + remoteID + "的" + "类型为"+type+"的"+str + "请求？")){
        //     return false;
        // }else{
        //     return true;
        // }  
    $.tipModal('confirm', 'warning', content, 
        function(result) {
        console.log('warning callback: ' + result);
        if(result == false){
            if(com.webrtc.app.usersessionlist[sessionID] != null && com.webrtc.app.usersessionlist[sessionID].moduleList[sessionID] !=null)
            {   
                com.webrtc.app.usersessionlist[sessionID].moduleList[sessionID].setupRefuse();
                com.webrtc.app.usersessionlist[sessionID].moduleList[sessionID]=null;
            
                com.webrtc.DeleteUserSession(sessionID);
            }
        }
        else{
            if(com.webrtc.app.usersessionlist[sessionID] != null && com.webrtc.app.usersessionlist[sessionID].moduleList[sessionID] !=null)
            {
                com.webrtc.app.usersessionlist[sessionID].moduleList[sessionID].setupAccept();
            }
        }
    }
    );
    
    console.log("lalala");

}
//////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////demo call预处理与界面//////////////////////////////////////////////
//此函数针对demo，其他系统要结合自身界面进行必要的替换
var createVideoLabel2 =  function()
{
     var SessionID = null;
     var RemoteID = document.getElementById("calleeid").value;
    if(false == isLabelExist(RemoteID,com.webrtc.UserSession.TYPE.P2P,com.webrtc.UserSession.MODULE_TYPE.VIDEO))
    {
        console.log("videolabel for "+RemoteID+"is not exist!");
        console.log("we new a SessionID");
        SessionID = guid();
        console.log(SessionID);
        createVideoLabel(RemoteID,com.webrtc.UserSession.TYPE.P2P,com.webrtc.UserSession.MODULE_TYPE.VIDEO,SessionID);
        Callvideo(RemoteID,SessionID);
    }
    else{
        console.log("videolabel for "+RemoteID+"is exist!");
        SessionID=$(document.getElementById("tr"+RemoteID+com.webrtc.UserSession.TYPE.P2P+com.webrtc.UserSession.MODULE_TYPE.VIDEO)).find('.SESSIONFLAG').html();
    }   
}

//此函数针对demo，其他系统要结合自身界面进行必要的替换
var createAudioLabel2 =  function()
{   

     var SessionID = null;
     var RemoteID = document.getElementById("calleeid").value;
    if(false == isLabelExist(RemoteID,com.webrtc.UserSession.TYPE.P2P,com.webrtc.UserSession.MODULE_TYPE.AUDIO))
    {
        console.log("audiolabel for "+RemoteID+"is not exist!");
        console.log("we new a SessionID");
        SessionID = guid();
        console.log(SessionID);
        createAudioLabel(RemoteID,com.webrtc.UserSession.TYPE.P2P,com.webrtc.UserSession.MODULE_TYPE.AUDIO,SessionID);
        Callaudio(RemoteID,SessionID);
    }
    else{
        console.log("audiolabel for "+RemoteID+"is exist!");
        SessionID=$(document.getElementById("tr"+RemoteID+com.webrtc.UserSession.TYPE.P2P+com.webrtc.UserSession.MODULE_TYPE.AUDIO)).find('.SESSIONFLAG').html();
    }   
}

var createMeetingVideoLabel2 = function(roomID){
     var SessionID = null;
     var RemoteID = roomID;
    if(false == isLabelExist(RemoteID,com.webrtc.UserSession.TYPE.MEETING,com.webrtc.UserSession.MODULE_TYPE.VIDEOMEETING))
    {
        console.log("meetingvediolabel for "+RemoteID+"is not exist!");
        console.log("we new a SessionID");
        SessionID = guid();
        console.log(SessionID);
        createMeetingVideoLabel(RemoteID,com.webrtc.UserSession.TYPE.MEETING,com.webrtc.UserSession.MODULE_TYPE.VIDEOMEETING,SessionID);
        CallMeetingVideo(RemoteID,SessionID);
    }
    else{
        console.log("meetingvediolabel for "+RemoteID+"is exist!");
        SessionID=$(document.getElementById("tr"+RemoteID+com.webrtc.UserSession.TYPE.MEETING+com.webrtc.UserSession.MODULE_TYPE.VIDEOMEETING)).find('.SESSIONFLAG').html();
    }   
}

//此函数针对demo，其他系统要结合自身界面进行必要的替换
var isLabelExist =function(RemoteID,sessionType,moduleType){
            var gRemoteUserID = RemoteID;
            var gLocaleUserID=com.webrtc.sigSessionConfig.username;
                  
            if($(document.getElementById("tr"+gRemoteUserID+sessionType+moduleType)).length>0)
            {
                return true;
            }
            else{
                return false;
            }

}
////////////////////////////////////////////////////////////////////////////////////////////
//此函数针对demo，其他系统要结合自身界面进行必要的替换
var createVideoLabel =function(RemoteID,sessionType,moduleType,SessionID){
            var gRemoteUserID = RemoteID;
            var gLocaleUserID=com.webrtc.sigSessionConfig.username;
        
            
            
            if($(document.getElementById("tr"+gRemoteUserID+sessionType+moduleType)).length>0)
            {
                return;
            }

            var addTr=$("<tr></tr>");

            var addTd=$("<td></td>");

            var addRemoteVideo= $("<video width='320' height='240' id='" +gRemoteUserID+gLocaleUserID+sessionType+moduleType+ "' autoplay='autoplay'  ></video>");

            var addLocalVideo= $("<video width='320' height='240' id='" +gLocaleUserID+gRemoteUserID+sessionType+moduleType+ "' autoplay='autoplay'></video>");
            
            // var addRemoteVideo= $("<video  id='" +gRemoteUserID+gLocaleUserID+sessionType+moduleType+ "' autoplay='autoplay'></video>");

            // var addLocalVideo= $("<video  id='" +gLocaleUserID+gRemoteUserID+sessionType+moduleType+ "' autoplay='autoplay'></video>");
            

            var addHangUpInput = $("<input type='button' id='" + "hangup"+gRemoteUserID+gLocaleUserID+sessionType+moduleType+ "' value='hangUpThis' onclick='HangUpvideo(\""+gRemoteUserID+"\","+"\""+SessionID+"\")'/>");
            
            var addSessionID =$("<div class = 'SESSIONFLAG'>"+SessionID +"</div>");

            addTd.append(addSessionID);
            addTd.append(addLocalVideo);
            addTd.append(addRemoteVideo);
            addTd.append(addHangUpInput);
       
            addTr.append(addTd);

            var tbodyHTML=$("tbody");

            tbodyHTML.append(addTr);
            
            var $VIDEO=$(document.getElementById(gRemoteUserID+gLocaleUserID+sessionType+moduleType));
            var parentTr=  $VIDEO.parent().parent();
            parentTr.attr("id","tr"+gRemoteUserID+sessionType+moduleType);

            //本端静音
            document.getElementById(gLocaleUserID+gRemoteUserID+sessionType+moduleType).muted=true;

}
//此函数针对demo，其他系统要结合自身界面进行必要的替换
var createAudioLabel =function(RemoteID,sessionType,moduleType,SessionID){
            var gRemoteUserID = RemoteID;
            var gLocaleUserID=com.webrtc.sigSessionConfig.username;
        
            
            if($(document.getElementById("tr"+gRemoteUserID+sessionType+moduleType)).length>0)
            {
                return;
            }

            var addTr=$("<tr></tr>");

            var addTd=$("<td></td>");

            var addRemoteVideo= $("<video width='320' height='240' id='" +gRemoteUserID+gLocaleUserID+sessionType+moduleType+ "' autoplay='autoplay'></video>");

            var addLocalVideo= $("<video width='320' height='240' id='" +gLocaleUserID+gRemoteUserID+sessionType+moduleType+ "' autoplay='autoplay'></video>");
            
            
            var addHangUpInput = $("<input type='button' id='" + "hangup"+gRemoteUserID+gLocaleUserID+sessionType+moduleType+ "' value='hangUpThis' onclick='HangUpaudio(\""+gRemoteUserID+"\","+"\""+SessionID+"\")'/>");
            var addSessionID =$("<div id = 'sessionid'>"+SessionID +"</div>");
          
            // var addCallVideoInput = $("<input type='button' id='" + "call"+gRemoteUserID+gLocaleUserID+sessionType+moduleType+ "' value='callaudio' onclick='Callaudio(\""+gRemoteUserID+"\")'/>");
            // var addCloseLabel = $("<input type='button' id='" + "closeLabel"+gRemoteUserID+gLocaleUserID+sessionType+moduleType+ "' value='CloseLabel' onclick='deleteSelectedLabel(\""+gRemoteUserID+"\","+"\""+sessionType+"\","+"\""+moduleType+"\")'/>");
        

           
            addTd.append(addSessionID);
            addTd.append(addLocalVideo);
            
            addTd.append(addRemoteVideo);
            addTd.append(addHangUpInput);
            //addTd.append(addCallVideoInput);

            //addTd.append(addCloseLabel);
         
            addTr.append(addTd);

            var tbodyHTML=$("tbody");

            tbodyHTML.append(addTr);
            
            var $VIDEO=$(document.getElementById(gRemoteUserID+gLocaleUserID+sessionType+moduleType));
            var parentTr=  $VIDEO.parent().parent();
            parentTr.attr("id","tr"+gRemoteUserID+sessionType+moduleType);


            //本端静音
            document.getElementById(gLocaleUserID+gRemoteUserID+sessionType+moduleType).muted=true;


}

var createMeetingVideoLabel =function(RemoteID,sessionType,moduleType,SessionID){
            var gRemoteUserID = RemoteID;
            var gLocaleUserID=com.webrtc.sigSessionConfig.username;                
            
            if($(document.getElementById("tr"+gRemoteUserID+sessionType+moduleType)).length>0)
            {
                return;
            }

            var addTr=$("<tr></tr>");

            var addTd=$("<td></td>");

            var addRemoteVideo= $("<video width='320' height='240' id='" +gRemoteUserID+gLocaleUserID+sessionType+moduleType+ "' autoplay='autoplay'  ></video>");

            var addLocalVideo= $("<video width='320' height='240' id='" +gLocaleUserID+gRemoteUserID+sessionType+moduleType+ "' autoplay='autoplay'></video>");
            
            // var addRemoteVideo= $("<video  id='" +gRemoteUserID+gLocaleUserID+sessionType+moduleType+ "' autoplay='autoplay'></video>");

            // var addLocalVideo= $("<video  id='" +gLocaleUserID+gRemoteUserID+sessionType+moduleType+ "' autoplay='autoplay'></video>");
            

            var addHangUpInput = $("<input type='button' id='" + "hangup"+gRemoteUserID+gLocaleUserID+sessionType+moduleType+ "' value='hangUpThis' onclick='HangUpMeetingvideo(\""+gRemoteUserID+"\","+"\""+SessionID+"\")'/>");
            
            var addSessionID =$("<div class = 'SESSIONFLAG'>"+SessionID +"</div>");

            addTd.append(addSessionID);
            addTd.append(addLocalVideo);
            addTd.append(addRemoteVideo);
            addTd.append(addHangUpInput);
       
            addTr.append(addTd);

            var tbodyHTML=$("tbody");

            tbodyHTML.append(addTr);
            
            var $VIDEO=$(document.getElementById(gRemoteUserID+gLocaleUserID+sessionType+moduleType));
            var parentTr=  $VIDEO.parent().parent();
            parentTr.attr("id","tr"+gRemoteUserID+sessionType+moduleType);

            //本端静音
            document.getElementById(gLocaleUserID+gRemoteUserID+sessionType+moduleType).muted=true;

}
//////////////////////////////////////////////////////////////////
//此函数针对demo，其他系统要结合自身界面进行必要的替换
var SendFileRequest2 = function()
{
    //SendFileRequest(document.getElementById("calleeid").value,com.webrtc.UserSession.TYPE.P2P,com.webrtc.UserSession.MODULE_TYPE.FILE);
 
    var SessionID = null;
    var RemoteID = document.getElementById("calleeid").value;
    if(false == isLabelExist(RemoteID,com.webrtc.UserSession.TYPE.P2P,com.webrtc.UserSession.MODULE_TYPE.FILE))
    {
        console.log("filelabel for "+RemoteID+"is not exist!");
        console.log("we new a SessionID");
        SessionID = guid();
        console.log(SessionID);
        createFileLabel(RemoteID,com.webrtc.UserSession.TYPE.P2P,com.webrtc.UserSession.MODULE_TYPE.FILE,SessionID);
        SendFileRequest(RemoteID,SessionID);
    }
    else{
        console.log("filelabel for "+RemoteID+"is exist!");
        SessionID=$(document.getElementById("tr"+RemoteID+com.webrtc.UserSession.TYPE.P2P+com.webrtc.UserSession.MODULE_TYPE.FILE)).find('.SESSIONFLAG').html();
        SendFileRequest(RemoteID,SessionID);
    }   
}

//此函数针对demo，其他系统要结合自身界面进行必要的替换
var createFileLabel =function(RemoteID,sessionType,moduleType,SessionID){
            var gRemoteUserID = RemoteID;
            var gLocaleUserID=com.webrtc.sigSessionConfig.username;
        
            
            
           
            if($(document.getElementById("tr"+gRemoteUserID+sessionType+moduleType)).length>0)
            {
                return;
            }

            var addTr=$("<tr></tr>");

            var addTd=$("<td></td>");
            var addFileIndex= $("<div id='" +gRemoteUserID+gLocaleUserID+sessionType+moduleType+"'></div>");
            var addHangUpInput = $("<input type='button' id='" + "hangup"+gRemoteUserID+gLocaleUserID+sessionType+moduleType+ "' value='hangUpThis' onclick='HangUpfile(\""+gRemoteUserID+"\","+"\""+SessionID+"\")'/>");
            var addSessionID =$("<div class = 'SESSIONFLAG'>"+SessionID +"</div>");

            addTd.append(addSessionID);
            addTd.append(addFileIndex);
            addTd.append(addHangUpInput);

         
            addTr.append(addTd);

            var tbodyHTML=$("tbody");

            tbodyHTML.append(addTr);
            
            var $VIDEO=$(document.getElementById(gRemoteUserID+gLocaleUserID+sessionType+moduleType));
            console.log($VIDEO);
            var parentTr=  $VIDEO.parent().parent();
            console.log(parentTr);
            parentTr.attr("id","tr"+gRemoteUserID+sessionType+moduleType);

}

//////////////////////////////////////////////////////////////////////
//此函数针对demo，其他系统要结合自身界面进行必要的替换
var createIMSVideoLabel2 =  function()
{
    var SessionID = null;
    var RemoteID=document.getElementById("calleeprefix").value+
                        document.getElementById("calleenumber").value+
                        document.getElementById("calleedomain").value;
    if(false == isLabelExist(RemoteID,com.webrtc.UserSession.TYPE.IMS,com.webrtc.UserSession.MODULE_TYPE.IMSVIDEO))
    {
        console.log("imsvideolabel for "+RemoteID+"is not exist!");
        console.log("we new a SessionID");
        SessionID = guid();
        console.log(SessionID);
        createIMSVideoLabel(RemoteID,com.webrtc.UserSession.TYPE.IMS,com.webrtc.UserSession.MODULE_TYPE.IMSVIDEO,SessionID);
        CallIMSvideo(RemoteID,SessionID);
    }
    else{
        console.log("imsvideolabel for "+RemoteID+"is exist!");
        SessionID=$(document.getElementById("tr"+RemoteID+com.webrtc.UserSession.TYPE.IMS+com.webrtc.UserSession.MODULE_TYPE.IMSVIDEO)).find('.SESSIONFLAG').html();
    }       
}
//////////////////////////////////////////////////////////////////////
//此函数针对demo，其他系统要结合自身界面进行必要的替换(IMSVideo被叫)
var createIMSVideoLabel3 =  function(RemoteID,SessionID)
{
    if(false == isLabelExist(RemoteID,com.webrtc.UserSession.TYPE.IMS,com.webrtc.UserSession.MODULE_TYPE.IMSVIDEO))
    {
        console.log("收到IMSoffer，转为发送名为answer的offer");
        createIMSVideoLabel(RemoteID,com.webrtc.UserSession.TYPE.IMS,com.webrtc.UserSession.MODULE_TYPE.IMSVIDEO,SessionID);
        //CallIMSvideo(RemoteID,SessionID);
        CallIMSvideoCalled(RemoteID,SessionID);
    }
    else{
        console.log("imsvideolabel for "+RemoteID+"is exist!");
        SessionID=$(document.getElementById("tr"+RemoteID+com.webrtc.UserSession.TYPE.IMS+com.webrtc.UserSession.MODULE_TYPE.IMSVIDEO)).find('.SESSIONFLAG').html();
    }       
}
//此函数针对demo，其他系统要结合自身界面进行必要的替换
var createIMSAudioLabel2 =  function()
{
    var SessionID = null;
     var RemoteID=document.getElementById("calleeprefix").value+
                        document.getElementById("calleenumber").value+
                        document.getElementById("calleedomain").value;
    if(false == isLabelExist(RemoteID,com.webrtc.UserSession.TYPE.IMS,com.webrtc.UserSession.MODULE_TYPE.IMSAUDIO))
    {
        console.log("imsaudiolabel for "+RemoteID+"is not exist!");
        console.log("we new a SessionID");
        SessionID = guid();
        console.log(SessionID);
        createAudioLabel(RemoteID,com.webrtc.UserSession.TYPE.IMS,com.webrtc.UserSession.MODULE_TYPE.IMSAUDIO,SessionID);
        CallIMSaudio(RemoteID,SessionID);
    }
    else{
        console.log("audiolabel for "+RemoteID+"is exist!");
        SessionID=$(document.getElementById("tr"+RemoteID+com.webrtc.UserSession.TYPE.IMS+com.webrtc.UserSession.MODULE_TYPE.IMSAUDIO)).find('.SESSIONFLAG').html();
    }   
}

//此函数针对demo，其他系统要结合自身界面进行必要的替换(IMSaudio被叫)
var createIMSAudioLabel3 =  function(RemoteID,SessionID)
{
    if(false == isLabelExist(RemoteID,com.webrtc.UserSession.TYPE.IMS,com.webrtc.UserSession.MODULE_TYPE.IMSAUDIO))
    {
        console.log("收到offer发送名为answer的offer");
        createAudioLabel(RemoteID,com.webrtc.UserSession.TYPE.IMS,com.webrtc.UserSession.MODULE_TYPE.IMSAUDIO,SessionID);
        //CallIMSaudio(RemoteID,SessionID);
        CallIMSaudioCalled(RemoteID,SessionID);
    }
    else{
        console.log("audiolabel for "+RemoteID+"is exist!");
        SessionID=$(document.getElementById("tr"+RemoteID+com.webrtc.UserSession.TYPE.IMS+com.webrtc.UserSession.MODULE_TYPE.IMSAUDIO)).find('.SESSIONFLAG').html();
    }   
}

//此函数针对demo，其他系统要结合自身界面进行必要的替换
var createIMSVideoLabel =function(RemoteID,sessionType,moduleType,SessionID){
            var gRemoteUserID = RemoteID;
            var gLocaleUserID=com.webrtc.sigSessionConfig.username;
        
            
            if($(document.getElementById("tr"+gRemoteUserID+sessionType+moduleType)).length>0)
            {
                return;
            }

            var addTr=$("<tr></tr>");

            var addTd=$("<td></td>");

            var addRemoteVideo= $("<video width='320' height='240' id='" +gRemoteUserID+gLocaleUserID+sessionType+moduleType+ "' autoplay='autoplay'></video>");

            var addLocalVideo= $("<video width='320' height='240' id='" +gLocaleUserID+gRemoteUserID+sessionType+moduleType+ "' autoplay='autoplay'></video>");
            
            var addHangUpInput = $("<input type='button' id='" + "hangup"+gRemoteUserID+gLocaleUserID+sessionType+moduleType+ "' value='hangUpThis' onclick='HangUpIMSvideo(\""+gRemoteUserID+"\","+"\""+SessionID+"\")'/>");
            
            var addSessionID =$("<div class = 'SESSIONFLAG'>"+SessionID +"</div>");
            addTd.append(addSessionID);
            addTd.append(addLocalVideo);
            addTd.append(addRemoteVideo);
            addTd.append(addHangUpInput);
         
            addTr.append(addTd);

            var tbodyHTML=$("tbody");

            tbodyHTML.append(addTr);
            
            var $VIDEO=$(document.getElementById(gRemoteUserID+gLocaleUserID+sessionType+moduleType));
            var parentTr=  $VIDEO.parent().parent();
            parentTr.attr("id","tr"+gRemoteUserID+sessionType+moduleType);


            //本端静音
            document.getElementById(gLocaleUserID+gRemoteUserID+sessionType+moduleType).muted=true;


}
//此函数针对demo，其他系统要结合自身界面进行必要的替换
var createIMSAudioLabel =function(RemoteID,sessionType,moduleType,SessionID){
            var gRemoteUserID = RemoteID;
            var gLocaleUserID=com.webrtc.sigSessionConfig.username;
        
            
            if($(document.getElementById("tr"+gRemoteUserID+sessionType+moduleType)).length>0)
            {
                return;
            }

            var addTr=$("<tr></tr>");

            var addTd=$("<td></td>");

            var addRemoteVideo= $("<video width='320' height='240' id='" +gRemoteUserID+gLocaleUserID+sessionType+moduleType+ "' autoplay='autoplay'></video>");

            var addLocalVideo= $("<video width='320' height='240' id='" +gLocaleUserID+gRemoteUserID+sessionType+moduleType+ "' autoplay='autoplay'></video>");
            
            
            var addHangUpInput = $("<input type='button' id='" + "hangup"+gRemoteUserID+gLocaleUserID+sessionType+moduleType+ "' value='hangUpThis' onclick='HangUpIMSaudio(\""+gRemoteUserID+"\","+"\""+SessionID+"\")'/>");
            
            var addSessionID =$("<div id = 'sessionid'>"+SessionID +"</div>");
           
            addTd.append(addSessionID);
            addTd.append(addLocalVideo);
            
            addTd.append(addRemoteVideo);
            addTd.append(addHangUpInput);
            
            addTr.append(addTd);

            var tbodyHTML=$("tbody");

            tbodyHTML.append(addTr);
            
            var $VIDEO=$(document.getElementById(gRemoteUserID+gLocaleUserID+sessionType+moduleType));
            var parentTr=  $VIDEO.parent().parent();
            parentTr.attr("id","tr"+gRemoteUserID+sessionType+moduleType);


            
            //本端静音
            document.getElementById(gLocaleUserID+gRemoteUserID+sessionType+moduleType).muted=true;
}