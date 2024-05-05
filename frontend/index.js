const myBtn = document.querySelector('#myBtn');
async function RequestOtp(){
    try {
        const apiUrl = 'http://localhost:8000/api/users/request-otp'
        const emailField = document.querySelector('#email');
        const usernameField = document.querySelector('#Username');
        const username = usernameField.value;
        const email = emailField.value
        const paragraph = document.querySelector('p');
        paragraph.textContent = "";
        const textContent = "mail delivered check your mailBox!"
        axios.post(apiUrl,{
            email:email,
            userName:username
        })
        .then(function (res){
            console.log(res.data.toString())
            paragraph.textContent = res.data.toString();
        })
        .catch(function (err){
            console.log(err);
        })
    
    } catch (error) {
        console.log(error);
    }
}

myBtn.addEventListener('click',  function(event) {
    event.preventDefault(); // Prevent default form submission
    RequestOtp();
  });