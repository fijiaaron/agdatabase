
var livestockType = document.querySelector("#livestock_type");
livestockType.addEventListener("change", addLivestockType);

var livestockQty = document.querySelector("#livestock_qty");
livestockQty.addEventListener("keyup", addLivestockQty);

var addLivestockButton = document.querySelector("#addLivestock");
addLivestockButton.addEventListener("click", addLivestock);

var message = document.querySelector("#message");

var livestock = retrieveLivestock();

function addLivestockType(event) {
    console.log("livestock type: " + livestockType.value);
    if (livestockType.value) {
        livestockQty.disabled = false;
    }
    else {
        livestockQty.disabled = true;
    }
}

function addLivestockQty(event) {
    console.log("livestock qty: " + livestockQty.value);
    if (livestockQty.value && livestockQty.value != "") {
        if (isNaN(livestockQty.value))
        {
            console.log("not a valid quantity: " + livestockQty.value);
            message.innerHTML = "quantity must be a number";
            message.classList.add("error");
            addLivestock.disabled = true;
        }
        else {
            console.log("valid quantity: " + + livestockQty.value)
            addLivestockButton.disabled = false;
            message.innerHTML = "";
            message.classList.remove("error");
        }
    }
    else {
        addLivestock.disabled = true;
    }
}

function addLivestock(event) {
    var type = livestockType.value;
    var qty = livestockQty.value;

    if (! isNaN(qty))
    {
        qty = 1 * qty;
    }

    console.log("add livestock", type, qty);
    message.innerHTML = `adding livestock: ${type} : ${qty}`;
    
    var livestock = retrieveLivestock();
    console.log('existing livestock', livestock);

    if (livestock[type] != undefined)
    {
        console.log(type + " already exists");
        
        livestock[type] = (1 * livestock[type]) + qty;
        console.log("added " + qty + " to " + type);

    }
    else
    {
        console.log(type + " doesn't exist yet");
        livestock[type] = livestockQty.value;
        console.log("created " + type + " with qty " + qty);
    }
    
    localStorage.setItem("livestock", JSON.stringify(livestock));

    livestock = retrieveLivestock();
}

function retrieveLivestock() {
    console.log("retrieveLivestock() ...");

    var livestockJSON = localStorage.getItem("livestock");
    console.log("livestockJSON", livestockJSON);

    var livestock = {};
    if (livestockJSON && livestockJSON != "")
    {
        try {
            livestock = JSON.parse(livestockJSON);
        }
        catch (e) {
            console.warn(e);
        }
    }

    console.log("livestock", livestock);
    livestockData.innerHTML = JSON.stringify(livestock, null, 1);

    return livestock;
}