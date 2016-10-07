
// Load UP Short hand
    const Ci = Components.interfaces;
    const Cc = Components.classes;

// Namespaces:
    const XUL_NS = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";
    const HTML_NS = "http://www.w3.org/1999/xhtml";
    
    const ww = Cc["@mozilla.org/embedcomp/window-watcher;1"].getService(Ci.nsIWindowWatcher);
          ww.openWindow(null, "chrome://global/content/console.xul", "jsconsole", "chrome,centerscreen", null);
    
    const as = Cc['@mozilla.org/toolkit/app-startup;1'].getService(Ci.nsIAppStartup);

// Load up Viper
    Components.utils.import("resource://dAmnZilla/dAmnViper.jsm");

var dAmnChat = {
    initialize: function(){
        var res = DUEL.login('thims', 'G456Th');
        this.addMsg(res.response);
        
        
        if(res.success){
            dAmnViper.connect();
            dAmnViper.handshake('Client');
            
            dAmnViper.login('thims', DUEL.authToken);
        }
    },
    
    uninitialize: function(){
        as.quit(Ci.nsIAppStartup.eAttemptQuit);
    },
    
    addMsg: function(){
        var d = new Date();
        var hour = d.getHours(); if (hour < 10) hour = "0" + hour;
        var minute = d.getMinutes(); if (minute < 10) minute = "0" + minute;
        var sec = d.getSeconds(); if (sec < 10) sec = "0" + sec;
        
        var i = 0;
        var str = "["+ hour + ":" + minute + ":" + sec + "]"+Array.prototype.join.call(arguments, "<br />");
        
        //msg = dAmn.formatMsg(msg);
      
        /*if(msg.indexOf(client.connection.username) != -1){
          duel.messageService.notification({
            name: "damnzilla",
            imageURL: '',
            title: user.substr(7,user.length-15),
            text: "Mentioned your name in the chat",
            textClickable: true,
            cookie: "",
            observe: function(subject, topic, data) {
              win = wm.getMostRecentWindow("dAmnZilla:chat");
              win.focus();
            }
          });
        }
        
        if(msg.indexOf("***") != -1){
            str += '<span class="int">'+user+msg+"</span> ";
        }else if(msg.indexOf("**") != -1){
            str += '<span class="srv">'+user+msg+"</span> ";
        }else if(msg.substr(3,1) == "*"){
            str += '<span class="act">'+user+msg+"</span> ";
        }else{
            str += user+msg;
        }*/
        
        var item = document.createElementNS(XUL_NS, "richlistitem");
        var newdiv = document.createElementNS(HTML_NS, "div");
        newdiv.innerHTML = str;
        item.appendChild(newdiv);
      
        document.getElementById("dAmnZilla-chatLog").insertBefore(item, document.getElementById("dAmnZilla-chatLog").firstChild); // xmlns="http://www.w3.org/1999/xhtml"
    }
};

window.addEventListener("load", function(){
    dAmnChat.initialize();
}, false);
window.addEventListener("unload", function(){
    dAmnChat.uninitialize();
}, false);