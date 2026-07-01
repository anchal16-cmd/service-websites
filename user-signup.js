import { auth, db } from "./firebase-config.js";

import {
    createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    doc,
    setDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const form = document.getElementById("userSignupForm");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const name = document.getElementById("userName").value;
    const email = document.getElementById("userEmail").value;
    const phone = document.getElementById("userPhone").value;
    const password = document.getElementById("userPassword").value;
    const confirm = document.getElementById("userConfirmPassword").value;

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
            doc(db, "users", userCredential.user.uid),
            {
                name,
                email,
                phone,
                role: "user"
            }
        );

        alert("Account Created Successfully!");
        window.location.href = "dashboard.html";

    }
    catch(error){
        alert(error.message);
    }

});