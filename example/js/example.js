let jsxc = new JSXC({
   loadConnectionOptions: (username, password) => {
      return Promise.resolve({
         xmpp: {
            url: $('#bosh-url').val(),
            domain: $('#xmpp-domain').val(),
         }
      });
   }
});

subscribeToInstantLogin();
watchForm();

function watchForm() {
   let formElement = $('#watch-form');
   let usernameElement = $('#watch-username');
   let passwordElement = $('#watch-password');
   let person = prompt("Please enter your name", "as@allwebsuite.com")
   jsxc.start('http://192.168.122.192/http-bind/', person, '1');
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
