function redirectTo(page) {
    var token = localStorage.getItem('token');
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "routes.php?pag=" + page + "&token=" + token, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            console.log(response);
            if (response.redirect)
                window.location.href = response.redirect;
            else 
                console.error("Error: No se ha especificado una redireccion: ");
        }
    };
    xhr.send();
}