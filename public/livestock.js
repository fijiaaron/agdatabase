var livestockType = document.querySelector("#livestock_type");
livestockType.addEventListener("change", addLivestockType);

var livestockQty = document.querySelector("#livestock_qty");
livestockQty.addEventListener("keyup", addLivestockQty);
livestockQty.addEventListener("change", addLivestockQty);

var addLivestockButton = document.querySelector("#add_livestock");
addLivestockButton.addEventListener("click", addLivestock);

var clearLivestockButton = document.querySelector("#clear_livestock");
clearLivestockButton.addEventListener("click", clearLivestock)

var message = document.querySelector("#message");

var livestock = retrieveLivestock();

function addLivestockType(event)
{
    console.log("addLivestockType()...");
    var type = livestockType.value;
    console.log("type:", type);
    
    updateUI();

    console.log("...addLivestockType()");
}

function addLivestockQty(event)
{
    console.log("addLivestockQty()...");
    var qty = livestockQty.value;
    console.log("qty: ", qty);

    if (qty) {
        if (isNaN(livestockQty.value)) {
            console.log("invalid quantity: " + livestockQty.value);
            message.innerHTML = "quantity must be a number";
            message.classList.add("error");
        }
        else {
            console.log("valid quantity: " + + livestockQty.value)
            message.innerHTML = "";
            message.classList.remove("error");
        }
    }

    updateUI();

    console.log("...addLivestockQty()");
}

async function addLivestock(event)
{
    console.log("addLivestock()...");

    var type = livestockType.value;
    var qty = livestockQty.value;

    if (! type) {
        console.log("invalid type");
        return;
    }

    if (! qty || isNaN(qty)) {
        console.log("invalid quantity");
        return;
    }

    console.log("adding livestock", type, qty);
    message.innerHTML = `adding livestock: ${type} : ${qty}`;
    
    livestock = await retrieveLivestock();

    if (livestock && livestock[type]) {
        console.log(type + " already exists");
        livestock[type] = (1 * qty) + livestock[type];
        console.log("added " + qty + " to " + type);
    }
    else {
        console.log(type + " doesn't exist yet");
        livestock[type] = (1 * qty);
        console.log("created " + type + " with qty " + qty);
    }

    storeLivestock(livestock);
    livestock = await retrieveLivestock();
    console.log("livestock", livestock);

    console.log("...addLivestock()");
}

async function retrieveLivestock() 
{
    console.log("retrieveLivestock()...");
    
    livestock = await localforage.getItem("livestock");

    if (! livestock)
    {
        console.log("livestock has not been created yet, creating empty object");
        livestock = {};
    }
    else {
        console.log("livestock retrieved from storage");
    }

    console.log("livestock", livestock);
    updateUI();

    console.log("...retrieveLivestock()");
    return livestock;
}

function storeLivestock()
{
    console.log("storeLivestock()...");

    localforage.setItem("livestock", livestock, function (err) {
        if (err) {
            console.error("failed to save livestock to localforage", err);
        }
        else {
            console.log("saved livestock to localforage");
            retrieveLivestock();
        }
    });

    updateUI();

    console.log("...storeLivestock()");
}

function clearLivestock() {
    console.log("clearLivestock()...");
    localforage.removeItem("livestock");
    livestock = retrieveLivestock();

    updateUI();

    console.log("...clearLivestock()");
}

function updateUI()
{
    console.log("updateUI()...");
    var type = livestockType.value;
    var qty = livestockQty.value;

    if (! type) {
        livestockQty.disabled = true;
    }
    else {
        livestockQty.disabled = false;
    }
    
    if (! qty || isNaN(qty) || livestockQty.disabled) {
        addLivestockButton.disabled = true;
    }
    else {
        addLivestockButton.disabled = false;
    }

    if (! livestock || isEmptyObject(livestock)) {
        clearLivestockButton.disabled = true;
    }
    else {
        clearLivestockButton.disabled = false;
    }

    livestockData.innerHTML = JSON.stringify(livestock, null, 1);
    console.log("...updateUI()");
}


function isEmptyObject(obj)
{
    return Object.keys(obj).length === 0;
}