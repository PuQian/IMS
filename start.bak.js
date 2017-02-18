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

var LSDP = null;

//此函数中获取Username Server Token方式要根据实际系统替换
var loginwebrtc = function(){
	var Username = document.getElementById("callerid").value;
	var Server = document.getElementById("server").value;

	console.log("begin");

	com.webrtc.sigSessionConfig.serverhost = Server;
	com.webrtc.sigSessionConfig.username = Username;
	com.webrtc.sigSessionConfig.token = "123";
	com.webrtc.starting();
	com.webrtc.sigSession.Login();
    com.webrtc.app.init(onNotify);

}


var logoutwebrtc = function(){
	
	com.webrtc.sigSession.Logout();

}

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

//此函数不能做任何修改，界面或其他函数可以调用它
var Callvideo = function(gRemoteUserID,SessionID)
{
    
  
    var tempSessionID = null;

    var newWOTTSession = new com.webrtc.WOTTSession();
    var newSessionBase = new com.webrtc.WUserSessionBase();

    newWOTTSession.calleeName = gRemoteUserID;
    newWOTTSession.init(onResponse);

    $.extend( true, newWOTTSession,newSessionBase);

    newWOTTSession.setSessionID(SessionID);

    com.webrtc.app.AddSession(newWOTTSession);

    var configuration = new Conf(com.webrtc.UserSession.TYPE.P2P,com.webrtc.UserSession.MODULE_TYPE.VIDEO,true,true, { "urls": "turn:222.200.180.144","url": "turn:222.200.180.144","credential":"123456","username":"gsta"},false);
    com.webrtc.app.usersessionlist[newWOTTSession.SessionID].Call(gRemoteUserID,configuration);
}
//此函数不能做任何修改，界面或其他函数可以调用它
var Callaudio = function(gRemoteUserID,SessionID)
{
    var tempSessionID = null;

    var newWOTTSession = new com.webrtc.WOTTSession();
    var newSessionBase = new com.webrtc.WUserSessionBase();

    newWOTTSession.calleeName = gRemoteUserID;
    newWOTTSession.init(onResponse);

    $.extend( true, newWOTTSession,newSessionBase);
    newWOTTSession.setSessionID(SessionID);
    com.webrtc.app.AddSession(newWOTTSession);

    var configuration = new Conf(com.webrtc.UserSession.TYPE.P2P,com.webrtc.UserSession.MODULE_TYPE.AUDIO,true,true, { "urls": "turn:222.200.180.144","url": "turn:222.200.180.144","credential":"123456","username":"gsta"},false);
    com.webrtc.app.usersessionlist[newWOTTSession.SessionID].Call(gRemoteUserID,configuration);
}

var CallMeetingVideo = function(roomId,SessionID){
    var tempSessionID = null;

    var newWMeetingSession = new com.webrtc.WMeetingSession();
    var newSessionBase = new com.webrtc.WUserSessionBase();

    newWMeetingSession.calleeName = roomId;
    newWMeetingSession.init(onResponse);

    $.extend( true, newWMeetingSession,newSessionBase);
    newWMeetingSession.setSessionID(SessionID);
    com.webrtc.app.AddSession(newWMeetingSession);

    var configuration = new Conf(com.webrtc.UserSession.TYPE.MEETING,com.webrtc.UserSession.MODULE_TYPE.VIDEOMEETING ,true,true, { "urls": "turn:222.200.180.144","url": "turn:222.200.180.144","credential":"123456","username":"gsta"},false);
    com.webrtc.app.usersessionlist[newWMeetingSession.SessionID].Call(roomId,configuration);
}

//此函数不能做任何修改，界面或其他函数可以调用它
var HangUpvideo = function(gRemoteUserID,SessionID)
{
    if(true == com.webrtc.app.isExistSession(SessionID))
    {
        com.webrtc.app.usersessionlist[SessionID].HangUp(gRemoteUserID,com.webrtc.UserSession.MODULE_TYPE.VIDEO);
    }
    else
    {
        console.log("UserSession do not exist!");
    }

   


}
//此函数不能做任何修改，界面或其他函数可以调用它
var HangUpaudio = function(gRemoteUserID,SessionID)
{
    if(true == com.webrtc.app.isExistSession(SessionID))
    {
        com.webrtc.app.usersessionlist[SessionID].HangUp(gRemoteUserID,com.webrtc.UserSession.MODULE_TYPE.AUDIO);
    }
    else
    {
        console.log("UserSession do not exist!");
    }
}
//此函数不能做任何修改，界面或其他函数可以调用它
var HangUpfile = function(gRemoteUserID,SessionID)
{
    if(true == com.webrtc.app.isExistSession(SessionID))
    {
        com.webrtc.app.usersessionlist[SessionID].HangUp(gRemoteUserID,com.webrtc.UserSession.MODULE_TYPE.FILE);
    }
    else
    {
        console.log("UserSession do not exist!");
    }
}
var HangUpMeetingvideo = function(gRemoteUserID,SessionID)
{
    if(true == com.webrtc.app.isExistSession(SessionID))
    {
        com.webrtc.app.usersessionlist[SessionID].HangUp(gRemoteUserID,com.webrtc.UserSession.MODULE_TYPE.VIDEOMEETING);
    }
    else
    {
        console.log("UserSession do not exist!");
    }
}
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

//此函数不能做任何修改，界面或其他函数可以调用它
//SendFileRequest:请求被叫允许打开数据通道，对方同意后会传输文件
var SendFileRequest = function(gRemoteUserID,SessionID)
{
    var tempSessionID = null;
    
    if(true == com.webrtc.app.isExistSession(SessionID) 
        && true == com.webrtc.app.usersessionlist[SessionID].isExistModule(SessionID))
    {   
        console.log("begin to sendFiles");
        com.webrtc.file.sendFiles(gRemoteUserID,SessionID);
        return;
    }



    var newWOTTSession = new com.webrtc.WOTTSession();
    var newSessionBase = new com.webrtc.WUserSessionBase();

    newWOTTSession.calleeName = gRemoteUserID;
    newWOTTSession.init(onResponse);

    $.extend( true, newWOTTSession,newSessionBase);
    newWOTTSession.setSessionID(SessionID);
    com.webrtc.app.AddSession(newWOTTSession);

    var configuration = new Conf(com.webrtc.UserSession.TYPE.P2P,com.webrtc.UserSession.MODULE_TYPE.FILE,true,true, { "urls": "turn:222.200.180.144","url": "turn:222.200.180.144","credential":"123456","username":"gsta"},true);
    com.webrtc.app.usersessionlist[newWOTTSession.SessionID].Call(gRemoteUserID,configuration);
}


//此函数针对demo，其他系统要结合自身界面进行必要的替换
var onNotify = function(message)
{
    console.log("onNotify!!!");
    var msg = JSON.parse(message.data);
    var SessionID = msg.sessionID;
    var remoteID = msg.from;


    //console.log(SessionID);
    console.log(remoteID);

    if(typeof sessionID == 'undefined'){
        SessionID = msg.roap.offerSessionId;
    }

    console.log(SessionID);

    if(msg.roap.type === com.webrtc.protocol.RTCRoapType['offer']){
        console.log("is offer");
       
        if(false == com.webrtc.app.isExistSession(SessionID)){
            

            var SessionType = msg.sessionType;
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
                    createIMSAudioLabel(remoteID,SessionType,ModuleType,SessionID);
                    newUserSession = new com.webrtc.WIMSSession();
            }
            else if(SessionType == com.webrtc.UserSession.TYPE.MEETING && ModuleType == com.webrtc.UserSession.MODULE_TYPE.VIDEOMEETING)
            {
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

            var newSessionBase = new com.webrtc.WUserSessionBase();

            newUserSession.calleeName = remoteID;
            newUserSession.init(onResponse);

            $.extend( true, newUserSession,newSessionBase);

            newUserSession.setSessionID(SessionID);

            console.log("set usersession to sessionlist");
            com.webrtc.app.AddSession(newUserSession);
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

//此函数不能做任何修改，界面或其他函数可以调用它
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

//此函数不能做任何修改，界面或其他函数可以调用它
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

//此函数针对demo，其他系统要结合自身界面进行必要的替换
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


//此函数不能做任何修改，界面或其他函数可以调用它
var OnLoginSuccess = function(){
    console.log("user login success!");
    var contents = "user login success!";
    $.fillTipBox({type:'info', icon:'glyphicon-info-sign', content:contents})
}
//此函数不能做任何修改，界面或其他函数可以调用它
var OnLoginFail = function(){
    console.log("user login fail!");
    var contents = "user login fail!";
    $.fillTipBox({type:'info', icon:'glyphicon-info-sign', content: contents})
}
//此函数不能做任何修改，界面或其他函数可以调用它
var OnLogoutFinish = function(){
    console.log("user logout finish");
      var contents = "user logout finish";
    $.fillTipBox({type:'info', icon:'glyphicon-info-sign', content: contents})
}


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


//此函数不能做任何修改，界面或其他函数可以调用它
var CallIMSvideo = function(gRemoteUserID,SessionID)
{
    var tempSessionID = null;

    var newWIMSSession = new com.webrtc.WIMSSession();
    var newSessionBase = new com.webrtc.WUserSessionBase();

    newWIMSSession.calleeName = gRemoteUserID;
    newWIMSSession.init(onResponse);

    $.extend( true, newWIMSSession,newSessionBase);

    newWIMSSession.setSessionID(SessionID);
    com.webrtc.app.AddSession(newWIMSSession);

    var configuration = new Conf(com.webrtc.UserSession.TYPE.IMS,com.webrtc.UserSession.MODULE_TYPE.IMSVIDEO,true,true, { "urls": "turn:222.200.180.144","url": "turn:222.200.180.144","credential":"123456","username":"gsta"},false);
    com.webrtc.app.usersessionlist[newWIMSSession.SessionID].Call(gRemoteUserID,configuration);
}
//此函数不能做任何修改，界面或其他函数可以调用它
var CallIMSaudio = function(gRemoteUserID,SessionID)
{
    var tempSessionID = null;

    var newWIMSSession = new com.webrtc.WIMSSession();
    var newSessionBase = new com.webrtc.WUserSessionBase();

    newWIMSSession.calleeName = gRemoteUserID;
    newWIMSSession.init(onResponse);

    $.extend( true, newWIMSSession,newSessionBase);
    newWIMSSession.setSessionID(SessionID);
    com.webrtc.app.AddSession(newWIMSSession);

    var configuration = new Conf(com.webrtc.UserSession.TYPE.IMS,com.webrtc.UserSession.MODULE_TYPE.IMSAUDIO,true,true, { "urls": "turn:222.200.180.144","url": "turn:222.200.180.144","credential":"123456","username":"gsta"},false);
    com.webrtc.app.usersessionlist[newWIMSSession.SessionID].Call(gRemoteUserID,configuration);
}

//此函数不能做任何修改，界面或其他函数可以调用它
var HangUpIMSvideo = function(gRemoteUserID,SessionID)
{
    if(true == com.webrtc.app.isExistSession(SessionID))
    {
        com.webrtc.app.usersessionlist[SessionID].HangUp(gRemoteUserID,com.webrtc.UserSession.MODULE_TYPE.IMSVIDEO);
    }
    else
    {
        console.log("UserSession do not exist!");
    }
}
//此函数不能做任何修改，界面或其他函数可以调用它
var HangUpIMSaudio = function(gRemoteUserID,SessionID)
{
    if(true == com.webrtc.app.isExistSession(SessionID))
    {
        com.webrtc.app.usersessionlist[SessionID].HangUp(gRemoteUserID,com.webrtc.UserSession.MODULE_TYPE.IMSAUDIO);
    }
    else
    {
        console.log("UserSession do not exist!");
    }
}

