document.addEventListener('DOMContentLoaded', function() {
    var fileName = window.location.href.split("/")[5];
    var parameters = new URLSearchParams(window.location.search);
    var filter = parameters.get('filter') ? parameters.get('filter') : null;
    console.log("Filtro: ", filter);
    var page = parameters.get('page') ? parameters.get('page') : null;
    localStorage.setItem('page', page);
    localStorage.setItem('fileName', fileName);
    
    var h3_pag = document.getElementById('h3_pag');
    h3_pag.textContent += Number(page) + 1;
    
    if (fileName.includes('women_list.html')) {
        if (filter != null)
            h3_pag.textContent += " del listado total de usuarias filtradas por " + filter;
        else 
            h3_pag.textContent += " del listado total de usuarias";
        
        cargarDatosTabla(page);
        cargarBotones_totales(null, null, null);
    } else if (fileName.includes('women_search.html')) {
        var search = parameters.get('search');
        var tipoBusqueda = parameters.get('tipoBusqueda');
        console.log("Búsqueda: ", search);

        if (tipoBusqueda != 0) {
            if (tipoBusqueda == 1) { // Comprobar si el valor contiene solo letras para saber si has buscado un nombre o apellido
                query = "WHERE nombre LIKE '" + search + "' OR apellidos LIKE '" + search + "'";
            } else if (tipoBusqueda == 2) { // Comprobar si el valor contiene solo números y letras y tiene una longitud de 9 caracteres para saber si has buscado un DNI
                query = "WHERE CAST(AES_DECRYPT(dni, 'xyz123') AS CHAR) = '" + search + "'";
            } else if (tipoBusqueda == 3) {  // Comprobar si el valor contiene el carácter "/" o el carácter "-" para saber si has buscado una fecha
                query = "WHERE CAST(AES_DECRYPT(fecha_nac, 'xyz123') AS CHAR) = '" + search + "'";
            } else if (tipoBusqueda == 4){ // Estás buscando direcciones
                query = "WHERE CAST(AES_DECRYPT(direccion, 'xyz123') AS CHAR) = '" + search + "'";
            } else if (tipoBusqueda == 5) { // Estás buscando expedientes
                query = "WHERE CAST(AES_DECRYPT(expediente, 'xyz123') AS CHAR) = '" + search + "'";
            }
            console.log("Query: ", query);

            var xhr = new XMLHttpRequest();
            if (filter != null)  {
                h3_pag.textContent += " de la búsqueda: " + search + " (filtradas por " + filter + ")";
                xhr.open("GET", "tables.php?table=mujeres&query=" + query + "&page=" + page + "&filter=" + filter, true);
            } else {
                h3_pag.textContent += " de la búsqueda: " + search;  
                xhr.open("GET", "tables.php?table=mujeres&query=" + query + "&page=" + page, true);
            }
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=utf-8");
            xhr.onreadystatechange = function() {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    if (xhr.status === 200) {
                        //var response = xhr.responseText;
                        var response = JSON.parse(xhr.responseText);
                        console.log("Respuesta: ", response);

                        if (response.length != 0) {
                            introducirDatosTabla(response);
                            cargarBotones_totales(search, query, tipoBusqueda);
                        } else {
                            Swal.fire({
                                title: "No se han encontrado resultados!",
                                icon: "error",
                                timer: 1500
                            });
                            setTimeout(function() {
                                window.location.href = 'women_list.html?table=mujeres&page=0';
                            }, 1500);
                        }
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
                        if (xhr.readyState === 4) {
                            if (xhr.status === 200) {
                                var response = JSON.parse(xhr.responseText);
                                Swal.fire({
                                    position: "center",
                                    title: response.message,
                                    icon: response.status,
                                    timer: response.timer
                                });
                                setTimeout(function() {
                                    window.location.href = 'women_list.html?table=mujeres&page=0';
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

function cargarBotones_totales(search, query, tipoBusqueda) {
    //Aqui completamos la consulta de php comprobando que tipo de campo ha rellenado el usuario
    //var search = document.getElementById('busqueda');
    console.log("Valor de la búsqueda: ", search);
    console.log("Valor de la query: ", query);
    console.log("Valor del tipo de búsqueda: ", tipoBusqueda);

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
                        window.location.href = 'women_search.html?search=' + search + '&page=' + index + '&tipoBusqueda=' + tipoBusqueda;
                    });
                    div_paginacion.appendChild(button);
                })(i);
            } 
        }
    }
    xhr.send();
}

function tipoFiltro(numFilter) {
    var filter;
    if (numFilter == 1) 
        filter = 'nombre';
    else if (numFilter == 2)
        filter = 'apellidos';
    else if (numFilter == 3)
        filter = 'dni';
    else if (numFilter == 4)
        filter = 'fecha_nac';
    else if (numFilter == 5)
        filter = 'direccion';
    else if (numFilter == 6)
        filter = 'expediente';

    var fileName = localStorage.getItem('fileName');
    var parameters = new URLSearchParams(window.location.search);
    var page = parameters.get('page');

    if (fileName.includes('women_list.html')) {
        var table = parameters.get('table');
        window.location.href = 'women_list.html?table=' + table + '&page=' + page + '&filter=' + filter;
    } else if (fileName.includes('women_search.html')) {
        var search = parameters.get('search');
        var tipoBusqueda = parameters.get('tipoBusqueda');
        window.location.href = 'women_search.html?search=' + search + '&page=' + page + '&tipoBusqueda=' + tipoBusqueda + '&filter=' + filter;
    }
}
/*if (fileName.includes('women_list.html')) {
    window.location.href = 'women_list.html?table=mujeres&page=' + page + "&filter=" + filter;
} else if (fileName.includes('women_search.html')) {
    window.location.href = 'women_search.html?search=' + search + '&page=' + page + "tipoBusqueda=" + tipoBusqueda + "&filter=" + filter;
}*/