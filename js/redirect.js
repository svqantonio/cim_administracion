function redirectTo(page, status, table) {
    var token = localStorage.getItem('token');
    var xhr = new XMLHttpRequest();
    var ruta = "routes.php?pag=" + page + "&token=" + token;
    if (status != null)
        ruta += status; 
    if (table != null)
        ruta += table;

    xhr.open("GET", ruta, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                if (response.redirect)
                    window.location.href = response.redirect + "?table=" + response.table;
                else 
                    console.error("Error: No se ha especificado una redireccion: ");
            }
        }
    };
    xhr.send();
}