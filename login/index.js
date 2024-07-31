function zc(){
            let zc=document.getElementById('zc')
            let dl=document.getElementById('dl')
            zc.hidden=false
            dl.hidden=true
        }
        function dl(){
            let zc=document.getElementById('zc')
            let dl=document.getElementById('dl')
            zc.hidden=true
            dl.hidden=false
        }
        // 模拟用户数据库
        let users = [];

        document.getElementById('registerForm').addEventListener('submit', function(e) {
            e.preventDefault();
            let username = document.getElementById('regUsername').value;
            let email = document.getElementById('regEmail').value;
            let password = document.getElementById('regPassword').value;
            let confirmPassword = document.getElementById('regConfirmPassword').value;
            
            if (password !== confirmPassword) {
                alert('两次输入的密码不一致');
                return;
            }
            
            // 检查用户名是否已存在
            if (users.some(user => user.username === username)) {
                alert('用户名已存在')
                return;
            }
            
            // 添加新用户
            users.push({username, email, password});
            alert('注册成功');
            confirm.console.log(users);
            this.reset();
        });

        document.getElementById('loginForm').addEventListener('submit', function(e) {
            e.preventDefault();
            let username = document.getElementById('loginUsername').value;
            let password = document.getElementById('loginPassword').value;
            
            let user = users.find(u => u.username === username && u.password === password);
            
            if (user) {
                alert('登录成功');
                this.reset();
            } else {
                alert('用户名或密码错误');
            }
        });