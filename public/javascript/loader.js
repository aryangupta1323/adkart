const loader=document.getElementById('loading')
function lp(){
    setTimeout(()=>{
        loader.style.display="none";
    },1300)
   
}


function myFunction() {
    var x = document.querySelector("input[name=password]");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  }
