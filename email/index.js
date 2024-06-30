document.addEventListener('DOMContentLoaded', function() {  
    document.getElementById('mailForm').addEventListener('submit', function(event) {  
        event.preventDefault(); // 阻止表单的默认提交行为  
  
        var recipientEmail = document.getElementById('recipientEmail').value;  
        var subject = document.getElementById('subject').value;  
        var message = document.getElementById('message').value;  
  
        // 构造mailto链接  
        var mailtoLink = 'mailto:' + encodeURIComponent(recipientEmail) +  
                         '?subject=' + encodeURIComponent(subject) +  
                         '&body=' + encodeURIComponent(message);  
  
        // 使用window.location.href打开mailto链接  
        window.location.href = mailtoLink; // 默认方式打开，即在当前窗口或标签页中  
        var message=""
    });  
});