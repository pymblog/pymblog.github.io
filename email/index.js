// send()
// document.addEventListener('DOMContentLoaded', function() {  
//     document.getElementById('mailForm').addEventListener('submit', function(event) {  
//         event.preventDefault(); 
  
//         var recipientEmail = document.getElementById('recipientEmail').value;  
//         var subject = document.getElementById('subject').value;  
//         var message = document.getElementById('message').value;  
  
//         var mailtoLink = 'mailto:' + encodeURIComponent(recipientEmail) +  
//                          '?subject=' + encodeURIComponent(subject) +  
//                          '&body=' + encodeURIComponent(message);  
  
       
//         window.location.href = mailtoLink; 
        
//     });  
// });
// function send(){
//     var input=document.getElementById('message').value;
//     input=''
// }
document.addEventListener('DOMContentLoaded', function() {  
    document.getElementById('mailForm').addEventListener('submit', function(event) {  
        event.preventDefault(); // 阻止表单的默认提交行为  
  
        // 清空多行输入框  
        var messageTextarea = document.getElementById('message');  
        messageTextarea.value = ''; // 清空输入框内容  
  
        // 生成 mailto 链接并尝试打开  
        var recipientEmail = document.getElementById('recipientEmail').value;  
        var subject = document.getElementById('subject').value;  
        var message = messageTextarea.value; // 注意：这里其实已经是空字符串了  
  
        var mailtoLink = 'mailto:' + encodeURIComponent(recipientEmail) +  
                         '?subject=' + encodeURIComponent(subject) +  
                         '&body=' + encodeURIComponent(message); // 这里的 message 是空的  
  
        // 尝试使用 window.location.href 打开 mailto 链接  
        // 注意：这可能会立即打开用户的默认邮件客户端，用户可能会离开当前页面  
        window.location.href = mailtoLink;  
  
        // 如果需要，可以在这里添加额外的逻辑来处理跳转后的页面状态（但在这个场景下可能不适用）  
    });  
});  