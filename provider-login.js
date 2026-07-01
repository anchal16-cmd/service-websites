import { auth } from "./firebase-config.js";

import {
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const form =
    document.getElementById("providerLoginForm");

form.addEventListener("submit", async (e)=>{

    e.preventDefault();

    const email =
        document.getElementById("providerEmail").value;

    const password =
        document.getElementById("providerPassword").value;

    try{

        await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        window.location.href =
            "provider-dashboard.html";

    }
    catch(error){
        alert(error.message);
    }

});
