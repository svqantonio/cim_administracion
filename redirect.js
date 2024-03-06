function redirectTo(page) {
    var token = localStorage.getItem('token');
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "routes.php?pag=" + page + "&token=" + token, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            if (response.redirect)
                window.location.href = response.redirect;
            else 
                console.error("Error: No se ha especificado una redireccion: ");
        }
    };
    xhr.send();
}

function redirectTo_Logout(page) {
    var token = localStorage.getItem('token');
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "routes.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                console.log(xhr.responseText);
                if (response.redirect) {
                    window.location.href = response.redirect; }
                else 
                    console.error("Error: No se ha especificado una redireccion: ");

            } else {
                console.error("Error al enviar la solicitud:", xhr.status);
            }
        }
    };
    xhr.send("pag=" + page + "&token=" + token + "&logout=true");
}