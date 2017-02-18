/**
*  This js file defines the rtc protocol library, 
*  include roap protocol, rtc private protocol
*
*  @Filename: rtcprotocol.js
*  @Version : 2.3
*  @Author  : Zhao Guoshuai
*  @Date    : 2012-10-08
*/

/*
var Message = {
	"type" : "register/session-initiate/session-refuse/session-bye/ack/heartbeat",
	"from" : "alice@gmail.com",
	"to"   : "bob@gmail.com",
	"roap" : {
		"type"           : "offer/answer/ok/candidate/shutdown/error",
		"offerSessionId" : 1,
		"answerSessionId": 2,
		"seq"            : 1,
		"sdp"			 : {},
		"media"          : "audio/video"
		"label"          : {},
		"error"          : "",
		"moreComingFlag" : true,
		"tiebreaker"     : "123456"
	}
}
*/

com.webrtc.protocol = {
	/*
	* Func: define the sdp type
	*/
	RTCSdpType : {
		"offer"    : 1,
		"pranswer" : 2,
		"answer"   : 3
	},

	/*
	* Func define the roap type
	*/
	RTCRoapType : {
		"offer"    : 1,
		"answer"   : 2,
		"ok"       : 3,
		"candidate": 4,
		"shutdown" : 5,
		"error"    : 6,
		"message"  : 7,
		"auth"	   : 8,
		"extend"   : 9,
		"authreturn" : 10
	},
	
	RTCRoapErrorType : {
		"offline" : 1,
		"timeout" : 2,
		"nomatch" : 3,
		"refused" : 4,
		"conflict" : 5,
		"doubleconflict" : 6,
		"mediafailed" : 7,
		"failed" : 8
	},
	
	RTCVasType : {
		"roundCallList" : 1
	},
	/*
	* Func define the roap constructor
	*/
	Roap : function(roapType, token, offerSessionId, answerSessionId, seq, sdp, label, error, moreComingFlag, msgSize, msgContent){
		if(typeof roapType == "undefined"){
			com.webrtc.Util.debug("Unknown roap type : " + roapType);
			return;
		}
		return {
			"type"            : roapType,
			"token"			  : token,
			"offerSessionId"  : offerSessionId,
			"answerSessionId" : answerSessionId,
			"seq"             : seq,
			"sdp"             : sdp,
			"label"           : label,
			"error"           : error,
			"moreComingFlag"  : moreComingFlag,
			"tiebreaker"      : null,
			"msgSize"		  : msgSize,
			"msgContent"      : msgContent
		}
	},

	/*
	* Func define the rtc message type
	*/
	RTCMsgType : {
		"register"         : 1,
		"session-initiate" : 2,
		"session-refuse"   : 3,
		"session-bye"      : 4,
		"session-ack"      : 5,
		"heartbeat"        : 6
	},

	/*
	* Func define the rtc constructor
	*/
	RTCProtocol : function(rtcType, from, to, roap, moduleType, sessionType,sessionID){
		if(typeof rtcType == "undefined"){
			com.webrtc.Util.debug("Unknown rtc type : " + rtcType);
			return;
		}
		var temp = {
			"type" : rtcType,
			"from" : from,
			"to"   : to,
			"roap" : roap
		};
		if(typeof moduleType != "undefined")
			temp["moduleType"] = moduleType;
		if(typeof sessionType != "undefined")
			temp["sessionType"] = sessionType;
		if(typeof sessionID != "undefined")
			temp["sessionID"] = sessionID;
		return temp;
	},

	/*
	* Func define the rtc message constructor
	*/
	RTCMessage : function(rtcType, roapType, description, gOfferSessionId, gAnswerSessionId, gRemoteUserID){
		//construct the roap message body
		var roap = null;
		//the "register" rtc message doesn't need roap field
		if(description != null){
			if(typeof description.sdpMLineIndex != "undefined"){
				//the "candidate" roap message body doesn't have label field
				roap = new com.webrtc.protocol.Roap(roapType, com.webrtc.sigSessionConfig.token, gOfferSessionId, gAnswerSessionId, com.webrtc.sigSessionConfig.gSeq, description.candidate, description.sdpMLineIndex, null, com.webrtc.sigSessionConfig.gMoreComing, com.webrtc.sigSessionConfig.msgSize, com.webrtc.sigSessionConfig.msgContent);
			}else{
				//the offer or answer message
				roap = new com.webrtc.protocol.Roap(roapType, com.webrtc.sigSessionConfig.token, gOfferSessionId, gAnswerSessionId, com.webrtc.sigSessionConfig.gSeq, description, null, null, com.webrtc.sigSessionConfig.gMoreComing, com.webrtc.sigSessionConfig.msgSize, com.webrtc.sigSessionConfig.msgContent);
			}
		}else{
			//the register, error message
			var errorType = arguments[6];
			roap = new com.webrtc.protocol.Roap(roapType, com.webrtc.sigSessionConfig.token, gOfferSessionId, gAnswerSessionId, com.webrtc.sigSessionConfig.gSeq, null, null, errorType, com.webrtc.sigSessionConfig.gMoreComing, com.webrtc.sigSessionConfig.msgSize, com.webrtc.sigSessionConfig.msgContent);
		}
		//construct the rtc message
		var rtcMsg = new com.webrtc.protocol.RTCProtocol(rtcType, com.webrtc.sigSessionConfig.username, gRemoteUserID, roap, arguments[7],arguments[8],arguments[9]);
		return rtcMsg;
	}
}