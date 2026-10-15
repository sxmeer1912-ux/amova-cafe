import { db } from "./firebase.js";

import {
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";


async function placeOrder() {

    const name = document.getElementById("name").value.trim();
    const mobile = document.getElementById("mobile").value.trim();
    const address = document.getElementById("address").value.trim();

    const cart = JSON.parse(localStorage.getItem("amovaCart")) || [];

    if (!name || !mobile || !address) {
        alert("Please fill all details.");
        return;
    }

    if (cart.length === 0) {
        alert("Your cart is empty.");
        return;
    }

    let total = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;
    });

    try {

        await addDoc(collection(db, "orders"), {

            customerName: name,

            mobile: mobile,

            address: address,

            items: cart,

            total: total,

            status: "New",

            createdAt: serverTimestamp()

        });

        alert(
            "✅ Order placed successfully!\n\n" +
            "Thank you, " + name + "!"
        );

        localStorage.removeItem("amovaCart");

        window.location.href = "index.html";

    } catch (error) {

        console.error(error);

        alert(
            "❌ Order could not be placed.\n\n" +
            error.message
        );
    }
}