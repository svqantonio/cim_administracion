document.addEventListener('DOMContentLoaded', function() {
    var fileName = window.location.href.split("/").pop().split("?")[0];
    var parameters = new URLSearchParams(window.location.search);
    var page = parameters.get('page') ? parameters.get('page') : null;
    localStorage.setItem('page', page);

    var h3_pag = document.getElementById('h3_pag');
    h3_pag.textContent += Number(page) + 1;

    if (fileName === 'women_list.html') {
        h3_pag.textContent += " del listado total de usuarias";
        cargarDatosTabla(page);
        cargarBotones_totales(null, null);
    } else if (fileName === 'women_search.html') {
        h3_pag.textContent += " de la búsqueda: " + parameters.get('search'); 
        console.log("Filename: ", fileName);
        var search = parameters.get('search');

        if (search.length != 0) {
            if (/^[a-zA-Z]+$/.test(search)) { // Comprobar si el valor contiene solo letras para saber si has buscado un nombre o apellido
                query = "WHERE nombre LIKE '" + search + "' OR apellidos LIKE '" + search + "'";
                console.log("El valor contiene solo letras.");
            } else if (/^[0-9a-zA-Z]{9}$/.test(search)) { // Comprobar si el valor contiene solo números y letras y tiene una longitud de 9 caracteres para saber si has buscado un DNI
                query = "WHERE dni LIKE '" + search + "'";
                console.log("El valor contiene números y letras y tiene una longitud de 9 caracteres.");
            } else if (/(\/{2}|-{2})\d{8}$/.test(search) || /(\/{2}|-{2})\d{6}$/.test(search)) {  // Comprobar si el valor contiene el carácter "/" o el carácter "-" para saber si has buscado una fecha
                query = "WHERE fecha_nac LIKE '" + search + "'";
                console.log("El valor contiene el carácter '/' o el carácter '-'.");
            } else { // Si no se cumple ninguna de las condiciones anteriores significa que estás buscando direcciones
                query = "WHERE direccion LIKE '" + search + "'";
                console.log("El valor no cumple con ninguna condición especificada.");
            }
            console.log("Query: ", query);

            var xhr = new XMLHttpRequest();
            xhr.open("GET", "tables.php?table=mujeres&query=" + query + "&page=" + page, true);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=utf-8");
            xhr.onreadystatechange = function() {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    if (xhr.status === 200) {
                        //var response = xhr.responseText;
                        var response = JSON.parse(xhr.responseText);
                        console.log("Respuesta: ", response);
                        introducirDatosTabla(response);
                        cargarBotones_totales(search, query);
                    }
                }
            };
            xhr.send();
        } else {
            Swal.fire({
                title: "No has buscado nada!",
                icon: "error",
                timer: 1500
            });
            setTimeout(function() {
                window.location.href = 'women_list.html?table=mujeres&page=0';
            }, 1500);
        }

        window.addEventListener('beforeunload', function() {
            
        });
    }
});

function cargarDatosTabla(page) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'tables.php?table=mujeres&page=' + page, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=utf-8');
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                console.log("Usuarias de la página "  + localStorage.getItem('page') + ": (La página aquí está restada 1, no preocuparse por eso)", response);
                introducirDatosTabla(response);
            }
        }
    };
    xhr.send();
}

function introducirDatosTabla(response) {
    var women_table = document.getElementById('women_table');
    //Metemos los datos en la tabla con los botones y funciones respectivas de los botones
    response.forEach(function(response) {
        var tr = document.createElement('tr');

        var nameTD = document.createElement('td');
        nameTD.textContent = response.nombre;

        var secondNameTD = document.createElement('td');
        secondNameTD.textContent = response.apellidos;

        var dniTD = document.createElement('td');
        dniTD.textContent = response.dni;

        var birth_dateTD = document.createElement('td');
        birth_dateTD.textContent = response.fecha_nac;

        var directionTD = document.createElement('td');
        directionTD.textContent = response.direccion;

        var expedienteTD = document.createElement('td');
        expedienteTD.textContent = response.expediente;

        var editButtonTD = document.createElement('td');
        var editButton = document.createElement('button');
        editButton.textContent = "Editar";
        editButton.classList = 'btn btn-outline-success';
        editButton.onclick = function() {
            window.location.href = 'women_id.html?table=mujeres&id=' + response.id;
        };
        editButtonTD.appendChild(editButton);

        var deleteButtonTD = document.createElement('td');
        var deleteButton = document.createElement('button');
        deleteButton.textContent = 'Borrar';
        deleteButton.classList = 'btn btn-outline-success';
        deleteButton.onclick = function() {
            Swal.fire({
                title: "¿Estás seguro de que quieres borrar a esta usuaria?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Borrar",
                cancelButtonText: "Cancelar"
            }).then((result) => {
                if (result.isConfirmed) {
                    var xhr = new XMLHttpRequest();
                    xhr.open("POST", "tables.php?table=mujeres" + "&id=" + response.id + "&function=deleteValues", true);
                    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                    xhr.onreadystatechange = function() {
                        if (t_xhr.readyState === 4) {
                            if (t_xhr.status === 200) {
                                var response = JSON.parse(xhr.responseText);
                                Swal.fire({
                                    position: "center",
                                    title: response.message,
                                    icon: response.status,
                                    timer: response.timer
                                });
                                setTimeout(function() {
                                    location.reload(true);
                                }, response.timer);
                            }
                        }
                    }
                    xhr.send();
                } 
            });
            return false;
        };
        deleteButtonTD.appendChild(deleteButton);

        tr.appendChild(nameTD); tr.appendChild(secondNameTD); tr.appendChild(dniTD); tr.appendChild(birth_dateTD); tr.appendChild(directionTD); tr.appendChild(expedienteTD); tr.appendChild(editButtonTD); tr.appendChild(deleteButtonTD);
        women_table.appendChild(tr);
    });
}

function cargarBotones_totales(search, query) {
    //Aqui completamos la consulta de php comprobando que tipo de campo ha rellenado el usuario
    //var search = document.getElementById('busqueda');
    console.log("Valor de la búsqueda: ", search);
    console.log("Valor de la query: ", query);

    //Aqui antes de hacer la peticion de los datos hacer una peticion del count
    var xhr = new XMLHttpRequest();
    if (search !== null) {
        xhr.open("GET", "tables.php?table=mujeres&function=count&query=" + query, true);
        console.log("Me meto dentro del count con la consulta");
    } else {
        xhr.open("GET", "tables.php?table=mujeres&function=count", true);
        console.log("Me meto dentro del console.log sin la consulta");
    } 
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=utf-8');
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            //console.log("Número de resultados a la búsqueda: ", response);
            var paginas = Math.ceil(response.count / 50);
            //console.log("Número de páginas: ", paginas);
            var div_paginacion = document.getElementById('paginacion');

            for (var i = 0; i < paginas; i++) {
                (function(index) { // Closure para capturar el valor actual de i
                    var button = document.createElement('button');
                    button.textContent = index + 1;
                    button.id = 'buttons';
                    if (Number(localStorage.getItem('page')) === index) {
                        button.classList = 'btn btn-success';
                        button.disabled = true; // Deshabilitar el botón que coincide con la página actual
                    } else {
                        button.classList = 'btn btn-outline-success';
                    }
                    button.addEventListener('click', function() {
                        //console.log("Botón que estoy tocando: ", index);
                        window.location.href = 'women_search.html?search=' + search + '&page=' + index;
                    });
                    div_paginacion.appendChild(button);
                })(i);
            } 
        }
    }
    xhr.send();
}