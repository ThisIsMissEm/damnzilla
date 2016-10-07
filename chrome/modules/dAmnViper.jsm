/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is copyright Micheil Smith (C) 2009.
 *
 * The Initial Developer of the Original Code is Micheil Smith.
 * Portions created by the Initial Developer are Copyright (C) 2009
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *  Henry Rapley <froggywillneverdie@msn.com>
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */


var EXPORTED_SYMBOLS = ["dAmnViper", "DUEL"];

const Ci = Components.interfaces;
const Cc = Components.classes;

//const Application = Cc["@mozilla.org/fuel/application;1"].getService(Ci.fuelIApplication);
const sts = Cc["@mozilla.org/network/socket-transport-service;1"].getService(Ci.nsISocketTransportService);
const bis = Cc["@mozilla.org/binaryinputstream;1"].createInstance(Ci.nsIBinaryInputStream);

/*
var Socket = function(host, port, callbacks){
    this.host = host;
    this.port = port;
    this.callbacks = callbacks;
    
    var transport = sts.createTransport(null, 0, this.host, this.port, null);
    var stream = transport.openInputStream(0,0,0);
    
    this.outputStream = transport.openOutputStream(0,0,0);
    this.inputStream = bis.setInputStream(stream);

    var _self = this;
    var pumpListener = {
        buffer : '',
        onStartRequest: function(request, context){
            try{
                if(typeof _self.callbacks["onStartRequest"] === 'function'){
                    _self.callbacks["onStartRequest"]({
                        "request": request,
                        "context": context
                    });
                }
            } catch(e){
                
            }
        },
        onStopRequest: function(request, context, status){
            try{
                if(typeof _self.callbacks["onStopRequest"] === 'function' ){
                    _self.callbacks["onStopRequest"]({"request": request,"context": context,"status": status});
                }
            } catch(e){
            }
        },
        onDataAvailable: function(request, context, inputStream, offset, count) {
            try{
                if(typeof _self.callbacks["onDataAvailable"] === 'function' ){
                    this.buffer += _self.inputStream.readBytes(count);
                    
                    if(this.buffer.length > 0){
                        var m = this.buffer.search('\0');
                        if(m > 0){
                            pckt = buffer.substr(0,packet);
                        
                                        buffer = buffer.substr(packet+1);
                                        dAS(pckt);
                                        if(buffer.length > 0) {
                                                processBuffer('');
                                        }

                            
                        var l = m.length-1;
                    
                    for(i=0;i<l;++i) {
                        _self.callbacks["onDataAvailable"]({
                            "request": request,
                            "context": context,
                            "inputStream": inputStream,
                            "offset": offset,
                            "count": count,
                            "data": m[i]
                        });
                    }
                    this.datablock = m[m.length-1];
                }
            } catch(e){
            }
        }
    };
    
    this.pump = Cc["@mozilla.org/network/input-stream-pump;1"].createInstance(Ci.nsIInputStreamPump);
    this.pump.init(stream, -1, -1, 0, 0, false);
    this.pump.asyncRead(pumpListener,null);
    
    return {
        close: function(){
            try{
                if (this.instream) {
                    this.instream.close();
                }
                if (this.outstream) {
                    this.outstream.close();
                }
                return {"data": null, "ok": true};
            } catch(e){
                return {"data": e, "ok": false};
            }
        },
        write:  function(data){
            try{
                this.outputStream.write(data,data.length);
                return {"data": data, "ok": true};
            } catch(e){
                return {"data": e, "ok": false};
            }
        }
    };
};
*/


/**************************************************
 *  DUEL
 *
 *    This module provides session control to
 *    dAmnViper. As well as providing an easy
 *    to use API to DiFi.
 *
 **************************************************/
let DUEL = {
    authToken: null,
    username: null,
    session: null,
    cookie: null,
    
    /**
     * Create a new login, given username and password.
     * @param username string The username to login with.
     * @param password string The corresponding password.
     * @returns object Status of request.
     */
    login: function(username, password){
        var self = this;
        var response = false;
        var xml = Cc["@mozilla.org/xmlextras/xmlhttprequest;1"].createInstance();
        
        xml.open("POST", "https://www.deviantart.com/users/login/", false);
        xml.setRequestHeader('Cookie', 'skipintro=1');
        xml.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        
        xml.send("username="+username+"&password="+password+"&reusetoken=1");
        delete password;
        
        var xmlResponse = {
 	    responseText:    xml.responseText,
            readyState:      xml.readyState,
            status:         (xml.readyState == 4 ? xml.status : 0),
            responseHeaders:(xml.readyState == 4 ? xml.getAllResponseHeaders() : '')
        };
        
        xml.onreadystatechange = function(xmlResponse){
            if(req.readyState == 4 && req.status == 200){
                if(req.responseText.indexOf("logout") != -1){
                    req.responseHeaders = decodeURIComponent(req.responseHeaders);
                    if(req.responseHeaders.indexOf("Set-Cookie:") && req.responseHeaders.indexOf("authtoken")){
                        var bits = req.responseHeaders.split('authtoken\";s:32:\"');
                        var token = bits[1].split('";');
                        token = token[0];
                        
                        self.authToken = token;
                        self.username = username;
                        self.session = req;
                        self.loggedin = true;
                        
                        // BUG FIX 29/01/2008 DD/MM/YYYY
                        self.cookie = req.responseHeaders.split("\n")[6].split(": ")[1].split("; ")[0];
                        response = {success: true, status: 'OKAY', response: "Logged in"};
                    } else{
                        response = {success: false, status: 'ERROR', response: "Could not find cookie"};
                    }
                }else{
                    response = {success: false, status: 'UNAUTHORISED', response: 'Could not login'};
                }
            } else {
                response = {success: false, status: 'NOTREADY', response: 'The Request isn\'t ready yet'};
            }
        }
        return response;
    },
    
    /**
     * Ends the current session
     * @returns object Status of the request
     */
    logout: function(){
        var self = this;
        var response = false;
        var xml = Cc["@mozilla.org/xmlextras/xmlhttprequest;1"].createInstance();
        
        xml.open("POST", "https://www.deviantart.com/users/logout/", false);
        xml.setRequestHeader('Cookie', 'skipintro=1');
        xml.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        
        xml.send("username="+username+"&password="+password+"&reusetoken=1");
        
        var xmlResponse = {
 	    responseText:    xml.responseText,
            readyState:      xml.readyState,
            status:         (xml.readyState == 4 ? xml.status : 0),
            responseHeaders:(xml.readyState == 4 ? xml.getAllResponseHeaders() : '')
        };
        
        xml.onreadystatechange = function(xmlResponse){
            if(req.readyState == 4 && req.status == 200){
                if(req.responseText.indexOf("Logged Out") != -1){
                    self.session = null;
                    self.authToken = null;
                    self.username = null;
                    self.loggedin = false;
                    
                    response = {success: true, status: 'OKAY', response: "Logged out"};
                } else {
                    response = {success: false, status: 'UNAUTHORISED', response: 'Could not logout'};
                }
            } else {
                response = {success: false, status: 'NOTREADY', response: 'The Request isn\'t ready yet'};
            }
        }
        return response;
    },
    
    /**
     * Returns a valid authToken
     * @param username string A username to login with.
     * @param password string A password to use in login.
     * @returns mixed Either the authToken or false.
     */
    getToken: function(username, password){
        if(this.loggedin && this.username != username){
            if(this.logout().success === true){
                if(this.login(username, password).success === true){
                    return this.authToken;
                }
            }
            return false;
        } else if (this.loggedin && this.username == username){
            return this.authToken ? this.authToken : '';
        } else {
            return false;
        }
    },


    /**************************************************
     *  DiFi
     *
     *    This module of DUEL provides the developer
     *    with an API to deviantART's Interactive
     *    Fragmented Interface.
     *
     *    For more information on DiFi, please refer to
     *
     *      http://moeffju.net/dA/wiki/DiFi:Main_Page
     *
     **************************************************/
    DiFi: {}
};

/*let dAmnViper = {
    resource: {
        Socket: false
    },
    
    flags: {
        connecting: false,
        loggingin: false,
        shaking: false,
        connected: false
    },
    
    
    
    
}*/


var dAmnViper = {
    resource: {
        Socket: null,
        Server: {
            host: 'chat.deviantart.com',
            version: '0.3',
            port: 3900
        }
    },
    
    flags: {
        connecting: false,
        loggingin: false,
        shaking: false,
        connected: false
    },
    
    Socket: {
        // This flag defines whether we are closing the socket on the next loop or not:
        close_next: false,
        
        buffer: '',
        packets: [],
        
        pump: null,
        
        // "Initialise up in this motherfucka"
        connect: function(){
            dump("Socket Connecting");
            // We should only have one socket, close others on this contructor:
            this.connected() ? this.close() : null;
            
            var transport = sts.createTransport(null, 0, this.host, this.port, null);
            var stream = transport.openInputStream(0,0,0);
            
            dAmnViper.resource.Sockets.outputStream = transport.openOutputStream(0,0,0);
            dAmnViper.resource.Sockets.inputStream = bis.setInputStream(stream);
        
            var dVrs = dAmnViper.resource.Sockets;
            var pumpListener = {
                onStartRequest: function(request, context){
                    try{/* empty */} catch(e){}
                },
                onStopRequest: function(request, context, status){
                    try{/* empty */} catch(e){}
                },
                onDataAvailable: function(request, context, inputStream, offset, count) {
                    try{
                        var packet;
                        if(dAmnViper.Socket.connected()){
                            dAmnViper.Socket.buffer += dVrs.inputStream.readBytes(count);
                            if(dAmnViper.Socket.buffer.length > 0){
                                var pktLen = dAmnViper.Socket.buffer.search('\0');
                                if(pktLen > 0){
                                    packet = dAmnViper.Socket.buffer.substr(0,pktLen);
                                    dump(packet);
                                    dAmnViper.Socket.packets.push(packet);
                                    dAmnViper.Socket.buffer = dAmnViper.Socket.buffer.substr(pktLen+1);
                                }
                            }
                        }
                    } catch(e){
                        throw e;
                    }
                }
            };

            this.pump = Cc["@mozilla.org/network/input-stream-pump;1"].createInstance(Ci.nsIInputStreamPump);
            this.pump.init(stream, -1, -1, 0, 0, false);
            this.pump.asyncRead(pumpListener,null);
        },
        
        connected: function(){
            // All this really does is check self.sock...
	    if(dAmnViper.resource.Socket == null){
                return false;
            }
	    return true;
        },
        
        read: function(){
            if(this.connected()){
                dAmnViper.Socket.buffer += dVrs.inputStream.readBytes(count);
                if(dAmnViper.Socket.buffer.length > 0){
                    var pktLen = dAmnViper.Socket.buffer.search('\0');
                    if(pktLen > 0){
                        dAmnViper.Socket.packets.push(dAmnViper.Socket.buffer.substr(0,pktLen));
                        dAmnViper.Socket.buffer = dAmnViper.Socket.buffer.substr(pktLen+1);
                    }
                }
            }
        },

        close: function(){
            if(this.connected()){
                try{
                    if (dAmnViper.resource.Socket.inputStream) {
                        dAmnViper.resource.Socket.inputStream.close();
                    }
                    if (dAmnViper.resource.Socket.outputStream) {
                        dAmnViper.resource.Socket.outputStream.close();
                    }
                    
                    return true;
                } catch(e){
                    return false;
                }
            } else {
                throw "Cannot close an unopen socket";
            }
        },
        write:  function(data){
            if(this.connected()){
                try{
                    dAmnViper.resource.Socket.outstream.write(data+'\0', data.length+1);
                    dAmnViper.resource.Socket.outputStream.write(data,data.length);
                    return true;
                } catch(e){
                    return false;
                }
            } else {
                throw "Cannot close an unopen socket";
            }
        }
    },
    
    Packet: {},
    
    /**
     *	The below functions make up
     *	the dAmn Interface API. This
     *	used to be a class, but it is
     *	now just a set of functions.
     */
    format_ns: function(ns){
        var un = (arguments.length>1) ? arguments[1] : null;
        var pre = ns.substr(0,1);
        
        if(pre == '#'){
            return 'chat:'+ns.substr(1);
        } else if(pre == '@'){
            if(arguments.length<1){
                return 'pchat:'+ns.substr(0,1);
            } else {
                var para = [ns.substr(1), arguments[1]].sort();
                return 'pchat:'+para[0]+para[1];
            }
        } else {
            return '';
        }
    },
    deform_ns: function(){
        
    },
    
    send: function(data){
        if(this.Socket.connected()){
            this.Socket.write(data);
        }
    },
    handshake: function(agent){
	// Send a handshake to the server! You can send additional info, but give it as a dict!
	this.flags.shaking = true;
	shake = 'dAmnClient '+resource.Socket.server['version']+'\nagent='+agent;
	if(arguments.length == 1){
            shake += '\n';
        } else {
            //shake+= "\n{0}\n".format("\n".join(['='.join([key, vals[key]]) for key in vals]))
        }
	this.send(shake);
    },
    
    login: function(username, token){
	// Send our login packet. Set the loggingin flag to true.
	this.flags.loggingin = true;
	this.send('login '+username+'\npk='+token+'\n');
    },
    
    connect: function(){
        if(this.resource.Socket != null && !this.Socket.connected()){
            this.Socket.connect();
        }
    },
    disconnect: function(){
        if(this.resource.Socket != null && !this.Socket.connected()){
            this.send('disconnect\n');
        }
    },
    
    
    close: function(){},
    
    // PROTOCOL
    pong: function(){
        this.send('pong\n');
    },
    
    join: function(ns){
        this.send('join '+ns+'\n');
    },
    part: function(){},
    
    say: function(){},
    action: function(){},
    me: function(){},
    npmsg: function(){},
    
    promote: function(){},
    demote: function(){},
    
    kick: function(){},
    ban: function(){},
    unban: function(){},
    
    get: function(){},
    set: function(){},
    
    admin: function(){},
    kill: function(){}
}






