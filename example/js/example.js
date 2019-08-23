let jsxc = new JSXC({
   loadConnectionOptions: (username, password) => {
      return Promise.resolve({
         xmpp: {
            url: $('#bosh-url').val(),
            domain: $('#xmpp-domain').val(),
         }
      });
   },
   connectionCallback: (jid, status) => {
      const CONNECTED = 5;
      const ATTACHED = 8;

      if (status === CONNECTED || status === ATTACHED) {
         $('.logout').show();
         $('.submit').hide();
      } else {
         $('.logout').hide();
         $('.submit').show();
      }
   }
});

let JSXC_MIN_VERSION = '4.0.0';
let JSXC_MAX_VERSION = '4.9999.0';

class GroupMeetingCall extends JSXC.AbstractPlugin {

   options;

   constructor(pluginAPI) {
      super(JSXC_MIN_VERSION, JSXC_MAX_VERSION, pluginAPI);

      this.options = {
         ...GroupMeetingCall.defaultOptions(),
         ...(pluginAPI.getOption(GroupMeetingCall.getId()) || {})
      };

      alert(this.getMeetUrl());
      if (!this.getMeetUrl()) {
         return;
      }

      pluginAPI.registerChatWindowInitializedHook((chatWindow) => {
         if (!chatWindow.getContact().isGroupChat()) {
            return;
         }
         chatWindow.addActionEntry('jsxc-audio-group',  (e) => {
            if (e) {
               e.stopImmediatePropagation();
               e.preventDefault();
            }
            this.startCall(chatWindow, true);
         });
         chatWindow.addActionEntry('jsxc-video-group',  (e) => {
            if (e) {
               e.stopImmediatePropagation();
               e.preventDefault();
            }
            this.startCall(chatWindow);
         });
      });
   }

   getMeetUrl() {
      return this.options.url;
   }

   static getName() {
      return 'GroupMeetingCall';
   }

   static getId() {
      return this.getName().toLowerCase();
   }

   static defaultOptions() {
      return {
         'url': 'https://meet.jitsi.si/'
      }
   }

   startCall(chatWindow, audioOnly=false) {
      let jid = chatWindow.getContact().getJid().node + '-sx-' + (new Date()).getTime();
      let url = this.getMeetUrl();

      if (!url.endsWith('/')) {
         url += '/';
      }

      let a = document.createElement('a');
      a.href = url + jid + (audioOnly ? '#config.startAudioOnly=true' : '');
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.click();
   }
}


subscribeToInstantLogin();
watchForm();
watchLogoutButton();


function watchForm() {
   let formElement = $('#watch-form');
   let usernameElement = $('#watch-username');
   let passwordElement = $('#watch-password');
   let person = prompt("Please enter your name", "as@allwebsuite.com");
   var groupCallPluginOptions = {'url': 'meet.allwebsuite.com'};
   jsxc.addPlugin(GroupMeetingCall, groupCallPluginOptions);
   jsxc.start('http://192.168.122.192/http-bind/', person, '1');
}

function watchLogoutButton() {
   let buttonElements = $('.logout');

   jsxc.watchLogoutClick(buttonElements);
}

function subscribeToInstantLogin() {
   $('#instant-login-form').submit(function(ev) {
      var url = $('#bosh-url').val();
      var domain = $('#xmpp-domain').val();

      var username = $(this).find('[name="username"]').val();
      var password = $(this).find('[name="password"]').val();

      var jid = username + '@' + domain;

      jsxc.start(url, jid, password)
         .then(function() {
            console.log('>>> CONNECTION READY')
         }).catch(function(err) {
            console.log('>>> catch', err)
         })

      return false;
   });
}
