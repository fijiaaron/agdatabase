
var livestockType = document.querySelector("[name=livestock_type]");
livestockType.addEventListener("change", addLivestockType);

var livestockQty = document.querySelector("[name=livestock_qty]");
livestockQty.addEventListener("change", addLivestockQty);

function addLivestockType(event) {
    console.log("add livestock: " + livestockType.value);
    if (livestockType.value) {
        livestockQty.disabled = false;
    }
    else {
        livestockQty.disabled = true;
    }
}

function addLivestockQty(event) {
    console.log("add livestock qty: " + livestockQty.value);
    
}