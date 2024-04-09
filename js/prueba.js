document.addEventListener('DOMContentLoaded', function() {
    //El orden de parametros de la funcion es query (porque campo vas a buscar), page (pagina en la que estás), filter (filtro de búsqueda), functionn (en caso de que quieras borrar algun valor) (Dentro de manage_tables.php está bien desglosado)
    cargarDatosTabla(null, 0, null);
});

/*La idea de este archivo es cargar mediante una funcion la tabla de mujeres para poder llamar a la funcion y cambiar los parametros al gusto del usuario y poder filtrar y demas

El parametro table es para introducir la tabla, evidentemente
El parametro query se refiere a porque metodo de busqueda 
El parametro page se refiere a la paginacion 
El parametro filter sirve para introducir el filtro por el que se ordena la tabla
*/

function cargarBotones(count) {
    var xhr = new XMLHttpRequest();
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=utf-8');
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            var paginas = Math.ceil(response.count / 50);
            var div_paginacion = document.getElementById('paginacion');
            for (i=0; i<paginas; i++) {
                var button = document.createElement('button');
                button.textContent = i + 1;
                button.classList = 'btn btn-outline-success';
                button.id = 'buttons';
                div_paginacion.appendChild(button);
                button.onclick = function() {
                    //cargarDatosTabla(null, i, null); 
                    console.log("Pagina: ", i);
                    //Eso lo único que hace es volver a sacar más números
                }
            } 
        }
    }
    xhr.send();
}

function cargarDatosTabla(query, page, filter) {
    //Aqui completamos la consulta de php comprobando que tipo de campo ha rellenado el usuario
    var search = document.getElementById('busqueda').value;
    
    //Para comprobar que haya usado el select del filter
    if (search.length != 0) {
        if (/^[a-zA-Z]+$/.test(search)) { // Comprobar si el valor contiene solo letras
            query = "WHERE nombre LIKE " + search + " OR apellidos LIKE " + search;
            console.log("El valor contiene solo letras.");
        } else if (/^[0-9a-zA-Z]{9}$/.test(search)) { // Comprobar si el valor contiene solo números y letras y tiene una longitud de 9 caracteres
            query = "WHERE dni LIKE " + search;
            console.log("El valor contiene números y letras y tiene una longitud de 9 caracteres.");
        } else if (/[\/-]/.test(search)) { // Comprobar si el valor contiene el carácter "/" o el carácter "-"
            query = "WHERE fecha_nac LIKE " + search;
            console.log("El valor contiene el carácter '/' o el carácter '-'.");
        } else { // Si no se cumple ninguna de las condiciones anteriores
            query = "WHERE direccion LIKE " + search;
            console.log("El valor no cumple con ninguna condición especificada.");
        }
    }
    //Aqui antes de hacer la peticion de los datos hacer una peticion del count
    var xhr = new XMLHttpRequest();
    if (search.length != 0) {
        xhr.open("GET", "prueba.php?table=mujeres&function=count&query=" + query, true);
        console.log("Me meto dentro del count con el query");
    } else {
        xhr.open("GET", "prueba.php?table=mujeres&function=count", true);
        console.log("Me meto dentro del console.log sin el query");
    } 

    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=utf-8');
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            var paginas = Math.ceil(response.count / 50);
            var div_paginacion = document.getElementById('paginacion');
            for (i=0; i<paginas; i++) {
                var button = document.createElement('button');
                button.textContent = i + 1;
                button.classList = 'btn btn-outline-success';
                button.id = 'buttons';
                div_paginacion.appendChild(button);
                button.onclick = function() {
                    //cargarDatosTabla(null, i, null); 
                    //Eso lo único que hace es volver a sacar más números
                }
            }  

            var s_xhr = new XMLHttpRequest();
            s_xhr.open('GET', 'prueba.php?table=mujeres' + '&query=' + query + '&page= ' + page + '&filter=' + filter, true);
            s_xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=utf-8');
            s_xhr.onreadystatechange = function() {
                if (s_xhr.readyState === XMLHttpRequest.DONE) {
                    if (s_xhr.status === 200) {
                        var response = JSON.parse(s_xhr.responseText);
                        //var response = xhr.responseText;
                        //resolve(response);
                        var women_table = document.getElementById('women_table');

                        //Metemos los datos en la tabla con los botones y funciones respectivas de los botones
                        response.forEach(function(response) {
                            var tr = document.createElement('tr');
                            var idTD = document.createElement('td');
                            idTD.textContent = response.id;

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

                            var editButtonTD = document.createElement('td');
                            var editButton = document.createElement('button');
                            editButton.textContent = "Editar";
                            editButton.onclick = function() {
                                window.location.href = 'women_changes_id.html?table=mujeres&id=' + response.id;
                            };
                            editButtonTD.appendChild(editButton);

                            var deleteButtonTD = document.createElement('td');
                            var deleteButton = document.createElement('button');
                            deleteButton.textContent = 'Borrar';
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
                                        var t_xhr = new XMLHttpRequest();
                                        t_xhr.open("POST", "prueba.php?table=mujeres" + "&id=" + response.id + "&function=deleteValues", true);
                                        t_xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                                        t_xhr.onreadystatechange = function() {
                                            if (t_xhr.readyState === 4) {
                                                if (t_xhr.status === 200) {
                                                    var response = JSON.parse(t_xhr.responseText);
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
                                        t_xhr.send();
                                    } 
                                });
                                return false;
                            };
                            deleteButtonTD.appendChild(deleteButton);
                            //Necesito un count de los resultados para poder dividirlo entre 50, de ahi me sale el numero de botones, de ahi hago un for con longitud del numero que me haya dado resultado, y de ahi meto los botones y a cada boton le pongo la funcion cargarDatosTabla con los parametros del numero de boton donde este y la consulta en la que estaba, que por cierto las consultas las tengo que almacenar por localStorage, los filtros se pueden reiniciar sin problema, pero la consulta en la que estaba no. Tambien tengo que poner un boton cancelar consulta que reinicie todo al estado inicial con la consulta inicial.

                            tr.appendChild(idTD); tr.appendChild(nameTD); tr.appendChild(secondNameTD); tr.appendChild(dniTD); tr.appendChild(birth_dateTD); tr.appendChild(directionTD); tr.appendChild(editButtonTD); tr.appendChild(deleteButtonTD);
                            women_table.appendChild(tr);
                        });
                    } 
                }
            }
            s_xhr.send();
        }
    }
    xhr.send();
}