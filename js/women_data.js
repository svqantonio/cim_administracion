document.addEventListener('DOMContentLoaded', function() { //Con esta función cargamos los datos de las paginas women_list y women_search segun el fileName sea
    var fileName = window.location.href.split("/")[5]; //Coge el nombre del archivo actual
    var parameters = new URLSearchParams(window.location.search); //Coge los parametros de la URL a partir de aqui a 3 lineas abajo
    var filter = parameters.get('filter') ? parameters.get('filter') : null;
    var page = parameters.get('page') ? parameters.get('page') : null;
    var search = parameters.get('search') ? parameters.get('search') : null;
    var tipoBusqueda = parameters.get('tipoBusqueda') ? parameters.get('tipoBusqueda') : null;
    localStorage.setItem('page', page);
    localStorage.setItem('fileName', fileName);
    
    var h3_pag = document.getElementById('h3_pag');
    h3_pag.textContent += Number(page) + 1; //Da igual en el archivo en el que esté, pone el número de la página actual
    
    if (fileName.includes('women_list.html')) { //Si estamos dentro de la lista total de las mujeres
        if (filter != null) //Si hay filtro, lo añade al h3
            h3_pag.textContent += " del listado total de usuarias. (Filtradas por " + filter + ")";
        else    
            h3_pag.textContent += " del listado total de usuarias."; 
        
        cargarDatosTabla(fileName, page, null, null); //Carga los datos de la tabla según la página donde está
        cargarBotones_totales(null, null, null); //Carga los botones de paginación
    } else if (fileName.includes('women_search.html')) { //Si estamos dentro de la página con la que buscamos usuarias
        if (filter == null)
            h3_pag.textContent += ' de la búsqueda: ' + search;
        else 
            h3_pag.textContent += ' de la búsqueda: ' + search + ' (Filtrado por ' + filter + ')';
        
        if (tipoBusqueda == 1) { //Predeterminadamente si no selecciona otro tipo de búsqueda, se busca por nombre
            query = "WHERE nombre LIKE '%" + search + "%' OR apellidos LIKE '%" + search + "%'";
        } else if (tipoBusqueda == 2) { // Estás buscando DNI
            query = "WHERE CAST(AES_DECRYPT(dni, 'xyz123') AS CHAR) = '%" + search + "%'";
        } else if (tipoBusqueda == 3) {  // Estás buscando fechas de nacimiento
            query = "WHERE CAST(AES_DECRYPT(fecha_nac, 'xyz123') AS CHAR) = '%" + search + "%'";
        } else if (tipoBusqueda == 4){ // Estás buscando direcciones
            query = "WHERE CAST(AES_DECRYPT(direccion, 'xyz123') AS CHAR) = '%" + search + "%'";
        } else if (tipoBusqueda == 5) { // Estás buscando expedientes
            query = "WHERE CAST(AES_DECRYPT(expediente, 'xyz123') AS CHAR) = '%" + search + "%'";
        }

        cargarDatosTabla(fileName, page, query, filter); //Carga los datos de la tabla según la página donde está
        cargarBotones_totales(search, query, tipoBusqueda); //Carga los botones de paginación
    }
});

function cargarDatosTabla(fileName, page, query, filter) { //Funcion que carga los datos de las usuarias en base a ciertos parametros y al archivo donde quiere cargar los datos
    $middleware = 'tables.php?table=mujeres&page=' + page; //Variable que hace mas liviano la ruta de la petición

    if (fileName.includes('women_list.html')) { //Si estamos en la lista total de las mujeres hacemos una peticion en la que antes comprobamos si hay filtro o no y metemos los datos en la tabla
        var xhr = new XMLHttpRequest();
        if (filter != null) {
            xhr.open('GET', $middleware + '&filter=' + filter, true);
        } else {
            xhr.open('GET', $middleware, true);
        }
        xhr.onreadystatechange = function() {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    var response = JSON.parse(xhr.responseText);
                    introducirDatosTabla(response);
                }
            }
        };
        xhr.send();
    } else if (fileName.includes('women_search.html')) { //Si estamos en la página de búsqueda de mujeres hacemos una petición en la que antes comprobamos si hay filtro o no y metemos los datos en la tabla y buscamos por el campo que haya seleccionado el usuario y en caso de no haber nada, mensajito de error y te devuelve a la lista completa de las mujeres
        var xhr = new XMLHttpRequest();
        if (filter != null) {
            xhr.open('GET', $middleware + '&query=' + query + '&filter=' + filter, true);
        } else {
            xhr.open('GET', $middleware + '&query=' + query, true);
        }
        xhr.onreadystatechange = function() {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    var response = JSON.parse(xhr.responseText);
                    if (response.length != 0) {
                        introducirDatosTabla(response);
                    } else {
                        Swal.fire({
                            title: "No se ha encontrado ninguna usuaria con esos datos",
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
    }
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

    //Aqui antes de hacer la peticion de los datos hacer una peticion del count
    var xhr = new XMLHttpRequest();
    if (search !== null) {
        xhr.open("GET", "tables.php?table=mujeres&function=count&query=" + query, true);
    } else {
        xhr.open("GET", "tables.php?table=mujeres&function=count", true);
    } 
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=utf-8');
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            var paginas = Math.ceil(response.count / 50);
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
                        if (localStorage.getItem('fileName').includes('women_list.html')) 
                            window.location.href = 'women_list.html?table=mujeres&page=' + index;
                        else if (localStorage.getItem('fileName').includes('women_search.html'))
                            window.location.href = 'women_search.html?search=' + search + '&page=' + index + '&tipoBusqueda=' + tipoBusqueda;   
                    });
                    div_paginacion.appendChild(button);
                })(i);
            } 
        }
    }
    xhr.send();
}

function tipoFiltro(numFilter) { //Función que se ejecuta cuando se cambia el select de los filtros
    var filter; //Variable para indicar al php porque metodo queremos filtrar, esto lo inyectaremos en la consulta que se ejecuta en el servidor
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

    var parameters = new URLSearchParams(window.location.search); //Recoge los parametros de la URL
    var page = parameters.get('page'); //Ya que este parametro está en ambos archivos

    if (localStorage.getItem('fileName').includes('women_list.html')) { //Si el nombre del archivo es women_list
        window.location.href = 'women_list.html?table=mujeres' + '&page=' + page + '&filter=' + filter;
    } else if (localStorage.getItem('fileName').includes('women_search.html')) {
        var search = parameters.get('search');
        var tipoBusqueda = parameters.get('tipoBusqueda');
        window.location.href = 'women_search.html?search=' + search + '&page=' + page + '&tipoBusqueda=' + tipoBusqueda + '&filter=' + filter;
    }
}