// Load Bootstrap
import 'bootstrap'; // JS 
import '../scss/bootstrap.scss'; // SCSS

// Load Main Scss
import '../scss/main.scss';

const Swal = require('sweetalert2')

document.getElementById("klikMe").addEventListener("click",function(){
    Swal.fire({
        title: 'Error!',
        text: 'Do you want to continue',
        icon: 'error',
        confirmButtonText: 'Cool'
    })    
});