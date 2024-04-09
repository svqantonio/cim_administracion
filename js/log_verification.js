document.addEventListener('DOMContentLoaded', function() {
    // Verifica si Swal está definido
    if (typeof Swal === 'undefined') {
        // Si no está definido, carga el script de SweetAlert de forma dinámica
        var sweetalertScript = document.createElement("script");
        sweetalertScript.src = "https://cdn.jsdelivr.net/npm/sweetalert2@11";
        sweetalertScript.onload = function() {
            //Coge el token de localStorage
            var token = localStorage.getItem('token') ? localStorage.getItem('token') : null;
            console.log("Token: ", token);

            // Obtiene el nombre del archivo HTML actual
            var fileName = window.location.href.split("/").pop().split("?")[0];
            //console.log("Estamos en el archivo: ", fileName);
            
            //En el caso de que no sea la página de inicio de sesión hay que verificar que el usuario haya iniciado sesión
            if (fileName != 'index.html') {
                if (token == null) {
                    Swal.fire({
                        position: "center",
                        title: "No has iniciado sesión!",
                        icon: "warning",
                        timer: 1500
                    });
                    //Redirigimos a la página de inicio de sesión
                    setTimeout(function() {
                        window.location.href = 'index.html';
                    }, 1500);
                } else {
                    //Borramos los tokens antiguos
                    borrarAntiguosTokens();

                    checkearFechaToken(token)
                    .then((response) => {
                        var respuesta = response;
                        console.log("Respuesta de la promesa al checkeo de la fecha de los tokens (succesfull): ", respuesta); 
                    }).catch((error) => {
                        //No manejamos este caso ya que si que el token existe, previamente se borran los tokens antiguos 
                        var respuesta = error;
                        //console.log("Respuesta de la promesa (error): ", respuesta);
                        localStorage.removeItem('token');
                        Swal.fire({
                            position: "center",
                            title: respuesta.message,
                            icon: respuesta.status,
                            timer: respuesta.timer
                        });
                        setTimeout(function() {
                            window.location.href = 'index.html';
                        }, respuesta.timer);
                    });        
                }
            } else {
                //En el caso de que la página sea index.html (Que es la de inicio de sesión)
                if (token != null) {
                    Swal.fire({
                        position: "center",
                        title: "Ya has iniciado sesión!",
                        icon: "warning",
                        timer: 1500
                    });
                    setTimeout(function() {
                        window.location.href = 'main.html';
                    }, 1500);
                } 
            }            
        };
        document.body.appendChild(sweetalertScript);
    } else
        // Si Swal está definido, llama directamente a la función de verificación de inicio de sesión
        console.log("No es necesaria la carga de la biblioteca");
});

//A partir de aqui son funciones de apoyo que van a ser usadas en la funcion principal que es la de arriba
function initLoginVerification(token) {
    if (token == null) {
        Swal.fire({
            position: 'center',
            title: '¡No has iniciado sesión!',
            icon: 'warning',
            timer: 1500
        });
        setTimeout(function() {
            window.location.href = 'index.html';
        }, 1500);
    } else {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'manage_log.php?token=' + token, true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=utf-8");
        xhr.onreadystatechange = function() {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    var response = JSON.parse(xhr.responseText);
                    //console.log("Respuesta del servidor al inicio de sesion: ", response);
                    if (response.status != 'success') {
                        Swal.fire({
                            position: "center",
                            title: response.message,
                            icon: response.status,
                            timer: response.timer
                        });
                        setTimeout(function() {
                            window.location.href = 'index.html';
                        }, response.timer);
                    }
                }
            }
        };
        xhr.send();
    }
}

function checkearFechaToken(token) {
    return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'tokens.php?token=' + token, true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=utf-8");
        xhr.onreadystatechange = function() {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    //var response = xhr.responseText;
                    var response = JSON.parse(xhr.responseText);
                    //console.log("Fecha de expiracion del token: ", response);
                    if (response.token_expiration != null) {
                        var currentDate = new Date();
                        //console.log("Fecha actual: ", currentDate);
                        var expirationDate = new Date(response.token_expiration);
                        //console.log("Fecha de expiracion: ", expirationDate);
                        if (currentDate > expirationDate)
                            reject({
                                "status" : "error",
                                "message" : "El token ha expirado",
                                "timer" : 1500
                            });
                        else 
                            resolve({
                                "status" : "success",
                                "message" : "El token sigue vigente",
                                "timer" : null
                            });
                    } else 
                        reject({
                            "status" : "error",
                            "message" : "No se ha encontrado la fecha de expiración del token",
                            "timer" : 1500
                        });
                }
            }
        };
        xhr.send();
    });
}

function borrarAntiguosTokens() {    
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "tokens.php?function=deleteOldTokens", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=utf-8");
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            //var response = xhr.responseText;
            var response = JSON.parse(xhr.responseText);    
            console.log("Respuesta del servidor a borrar antiguos tokens: ", response);
        }
    };
    xhr.send();
}