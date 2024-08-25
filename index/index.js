// 获取LOGO图片元素  
var logo = document.getElementById('logo');  
var p =document.getElementById('p')
  
// 定义一个函数来根据窗口宽度更改LOGO  
function adjustLogoSize() {  
    if (window.innerWidth < 500) {  
        // 如果窗口宽度小于500px，则更换为小LOGO  
        logo.src = '../style3.png';  
        var mode='ph';
        p.innerText=mode
    } else {  
        // 否则，更换回大LOGO  
        logo.src = '../styleb.webp';  
        var mode='pc';
        p.innerText=mode
    }  
}  
  
// 初始时调用一次  
adjustLogoSize();  
  
// 监听窗口大小变化事件  
window.addEventListener('resize', adjustLogoSize);