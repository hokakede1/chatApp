
var socket = io("http://localhost:3001");

socket.on("failToLogin", function(){
  alert("User name is already registered")
})

socket.on("SuccessLogin", function(data){
  alert(`Successfully registered, Welcome to the chatroom ${data}`)
  $('#currentUser').html(data)
  $('#loginForm').hide(2000);
  $('#chatForm').show(1000);
})

socket.on('Userlist', function(data) {
  $(".boxContent").html('');

  data.forEach(function(i){
    $('.boxContent').append("<div class='user'>" + i + "</div>" );
  });

});

socket.on('server-send-message', function(data){
  $('#listMessages').append(`<div class='ms'>${data.un} : ${data.nd}</div>`)
});

socket.on('someoneIsTyping', function(data) {
  $('#thongbao').html(data);
});

socket.on('someoneStopTyping', function() {
  $('#thongbao').html("");
});

$(document).ready(function() {
  $('#loginForm').show();
  $('#chatForm').hide();

  $('#btnRegister').click(function(){
    socket.emit('client-send-Username', $("#txtUsername").val());
  });

  $('#btnLogout').click(function(){
    socket.emit("logout");
    $('#loginForm').show(2000);
    $('#chatForm').hide(1000);
  })

  $('#btnSendMessage').click(function(){
    socket.emit('user-send-message', $("#txtMessage").val());
  });

  $('#txtMessage').focusin(function(){
    socket.emit('typing');
  })

  $('#txtMessage').focusout(function(){
    socket.emit('stopTyping');
  })

})
