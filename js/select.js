function rellenarSelect_seleccionado(tabla, selectRellenar, idSeleccionado) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "tables.php?table=" + tabla, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=utf-8");
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                var select = document.getElementById(selectRellenar);
                response.forEach(function(valores, index) {
                    var option = document.createElement("option");
                    option.value = valores.id;
                    option.textContent = valores.valor;
                    
                    select.appendChild(option);
                });
                select.value = idSeleccionado;
            }
        }
    }
    xhr.send();
}