import { auth, db } from "./firebase-config.js";

import {
    createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    doc,
    setDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const form =
    document.getElementById("providerSignupForm");

form.addEventListener("submit", async (e)=>{

    e.preventDefault();

    const name =
        document.getElementById("providerName").value;

    const email =
        document.getElementById("providerEmail").value;

    const phone =
        document.getElementById("providerPhone").value;

    const password =
        document.getElementById("providerPassword").value;

    const confirm =
        document.getElementById("providerConfirmPassword").value;

    const service =
        document.getElementById("serviceCategory").value;

    const experience =
        document.getElementById("experience").value;

    const state =
        document.getElementById("state").value;

    const city =
        document.getElementById("city").value;

    const area =
        document.getElementById("area").value;

    if(password !== confirm){
        alert("Passwords do not match");
        return;
    }

    try{

        const userCredential =
            await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

        await setDoc(
            doc(db,
            "providers",
            userCredential.user.uid),
            {
                name,
                email,
                phone,
                service,
                experience,
                state,
                city,
                area,
                role:"provider"
            }
        );

        alert("Provider Registered!");
        window.location.href =
            "provider-dashboard.html";

    }
    catch(error){
        alert(error.message);
    }

});