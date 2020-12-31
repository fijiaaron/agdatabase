var livestockType = document.querySelector("#livestock_type");
livestockType.addEventListener("change", addLivestockType);

var livestockQty = document.querySelector("#livestock_qty");
livestockQty.addEventListener("keyup", addLivestockQty);

var addLivestockButton = document.querySelector("#addLivestock");
addLivestockButton.addEventListener("click", addLivestock);

var clearLivestockButton = document.querySelector("#clearLivestock");
clearLivestockButton.addEventListener("click", clearLivestock)

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

async function addLivestock(event) {
    console.log("addLivestock()...");

    var type = livestockType.value;
    var qty = livestockQty.value;

    if (! isNaN(qty))
    {
        qty = 1 * qty;
    }

    console.log("adding livestock", type, 1*qty);
    message.innerHTML = `adding livestock: ${type} : ${qty}`;
    
    livestock = await retrieveLivestock();
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
        livestock[type] = qty;
        console.log("created " + type + " with qty " + qty);
    }

    storeLivestock(livestock);
    
    livestock = await retrieveLivestock();
}

async function retrieveLivestock()
{
    console.log("retrieveLivestock()...");
    
    livestock = await localforage.getItem("livestock");
    console.log("livestock", livestock);

    if (livestock == undefined || livestock == null || livestock == "")
    {
        console.log("livestock has not been created yet, creating empty object");
        livestock = {};
        clearLivestock.disabled = true;
    }
    else {
        clearLivestock.disabled = false;
    }

    console.log("livestock", livestock);
    livestockData.innerHTML = JSON.stringify(livestock, null, 1);


    return livestock;
    
}

function storeLivestock()
{
    console.log("storeLivestock()");

    localforage.setItem("livestock", livestock, function (err) {
        if (err) {
            console.error("failed to save livestock to localforage", err);
        }
        else {
            console.log("saved livestock to localforage");
            retrieveLivestock();
        }
    });
}


function clearLivestock() {
    console.log("clear");
    localforage.removeItem("livestock");
    livestock = retrieveLivestock();
}