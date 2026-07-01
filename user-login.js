import { auth } from "./firebase-config.js";

import {
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const form =
    document.getElementById("userLoginForm");

form.addEventListener("submit", async (e)=>{

    e.preventDefault();

    const email =
        document.getElementById("userEmail").value;

    const password =
        document.getElementById("userPassword").value;

    try{

        await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        window.location.href =
            "dashboard.html";

    }
    catch(error){
        alert(error.message);
    }

});