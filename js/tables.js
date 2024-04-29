const parametros = new URLSearchParams(window.location.search); //Recogemos los parametros de la URL
table = parametros.get('table'); //Cogemos el parametro table
var fields; //Variable global para todo el archivo a la que mas tarde le meteremos datos.

document.addEventListener('DOMContentLoaded', function() { //Evento que carga los datos 
    var fileName = window.location.href.split("/")[5]; //Coge el nombre del archivo actual

    if (fileName.includes("main.html")) {
        cargarTablas(); //Cargamos las tablas
    } else if (fileName.includes("tables.html")) {
        if (table == 'users') {
            cargarCampos(table);
            cargarDatos(table);
        } else {
            cargarCampos(table); //Cargamos los campos de la tabla que seleccionemos
            cargarDatos(table); //Cargamos los datos de la tabla que seleccionemos
            localStorage.setItem('form', null);
        }
    }
});

function cargarTablas() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", 'tables.php?function=pickTables', true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=utf-8");
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                crearEnlaces(response);
            }
        }
    };
    xhr.send();
}

function crearEnlaces(response) {
    var centeredDiv = document.getElementById('centrar');
    response.forEach(function(index) {
        if (index.TABLE_NAME != 'tokens' && index.TABLE_NAME != 'mujeres2' && index.TABLE_NAME != 'consultas2' && index.TABLE_NAME != 'documentos') { //Para excluir ciertas tablas
            var button = document.createElement('button');
            button.textContent = capitalizeFirstLetter(index.TABLE_NAME);
            button.classList = 'btn btn-link';

            if (index.TABLE_NAME == 'mujeres') { //Le cambio el enlace en caso de que la tabla sea mujeres ya que el archivo tables.js y tables.html vale para todas las tablas incluidas users pero no para 
                button.onclick = function() {
                    window.location.href = 'women_list.html?table=' + index.TABLE_NAME + '&page=0';
                }
            } else {
                button.onclick = function() {
                    window.location.href = 'tables.html?table=' + index.TABLE_NAME;
                };
            }
            centeredDiv.appendChild(button);
        }
    });
}

function cargarCampos(table) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", 'tables.php?table=' + table + "&function=pickFields", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=utf-8");
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                fields = response;
                console.log("Campos de la tabla " + table + ":", response);
                meterCampos(response);
            }
        }
    };
    xhr.send();
}

function meterCampos(response) { //Esta funcion segun los campos de una tabla crea th y los mete en el thead de la tabla y luego crea los td del edit y delete
    var thead = document.getElementById('thead_tr_sinCompletar');
    response.forEach(function(index) { //Añadimos a la tabla los th de los campos de la tabla
        var th = document.createElement('th');
        th.textContent = capitalizeFirstLetter(index.COLUMN_NAME);
        thead.appendChild(th);
    });
    //Añadimos a la tabla los th de editar y borrar
    var thEdit = document.createElement('th');
    var thDelete = document.createElement('th');
    thEdit.textContent = "Editar";
    thDelete.textContent = "Borrar";
    thead.appendChild(thEdit); 
    thead.appendChild(thDelete);
}

function cargarDatos(table) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", 'tables.php?table=' + table, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=utf-8");
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                //var response = xhr.responseText;
                console.log("Datos de la tabla " + table + ":", response);
                introducirDatos(response, fields);
            }
        }
    };
    xhr.send();
}

function introducirDatos(data, fields) {
    if (fields && Array.isArray(fields)) {
        data.forEach(function(json_portion) {
            var tr = document.createElement('tr');

            fields.forEach(function(campoObj) {
                var field = campoObj.COLUMN_NAME; // Obtener el nombre del campo

                var td = document.createElement('td');
                td.textContent = json_portion[field]; //No me deja aplicarle el capitalizeFirstLetter, me dice que string.charAt is not a function, supongo que el valor que le llegara no es exactamente un string y habra que hacer una comprobacion o un casting
                tr.appendChild(td);
            });

            introducir_edit_delete_buttons(json_portion, tr);
            tabla_bbdd.appendChild(tr);
        });
    }
}

function introducir_edit_delete_buttons(json_portion, tr) { //Refactorizar para hacer bien
    var response = json_portion;

    //Parte para coger valores
    var bothForms = document.getElementById('bothForms');
    var h3_form = document.getElementById('h3_form');
    var id_value = document.getElementById('id_bothForms');
    var label_value = document.getElementById('value_bothForms');
    var value_inputValue = document.getElementById('valor_bothForms');
    var submitBtn = document.getElementById('btnSubmit');

    var editButtonTD = document.createElement('td');
    var editButton = document.createElement('button');
    editButton.textContent = 'Editar';
    editButton.classList = 'btn btn-outline-success';
    editButton.onclick = function() {
        if (table != 'users') {
            h3_form.textContent = 'Formulario para EDITAR el valor: ' + capitalizeFirstLetter(response.valor);
            id_value.value = response.id;
            value_inputValue.value = response.valor;
            idFormEdit.style.display = 'block'; div_id.style.display = 'block';//Lo pongo en block ya que si he pulsado previamente el boton de nuevo valor, se oculta ese campo.
        } else { //En caso de que la tabla sea USERS
            console.log(response.id);
            console.log("Input: ", id_value);
            h3_form.textContent = 'Formulario para EDITAR al usuario: ' + response.username;
            id_value.value = response.id;
            label_value.textContent = 'Username'; value_inputValue.value = response.username;
            submitBtn.textContent = 'Editar';
            
            //Creamos toda la parte del password, ya que si no es la tabla users, no necesitamos esta parte
            var password_structure = document.createElement('div'); password_structure.classList = 'form-group';
            password_label = document.createElement('label'); password_label.classList = 'form-label'; password_structure.textContent = 'Contraseña';
            var password_input = document.createElement('input'); password_input.classList = 'form-control'; password_input.type = 'text'; password_input.id = 'password'; password_input.value = response.password;

            password_structure.appendChild(password_label);
            password_structure.appendChild(password_input);
            bothForms.append(password_structure);
        }
        //var submitBtn = document.createElement('btn')

        bothForms.style.display = 'block';
        btnSubmit.textContent = 'Editar';
    };
    
    var deleteButtonTD = document.createElement('td');
    var deleteButton = document.createElement('button');
    deleteButton.textContent = "Borrar";
    deleteButton.classList = 'btn btn-outline-success';
    deleteButton.onclick = function() {
        Swal.fire({
            title: "¿Estás seguro de que quieres BORRARLO?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Borrar",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                var xhr = new XMLHttpRequest();
                xhr.open("POST", 'tables.php?table=' + table + "&id=" + response.id + "&function=deleteValues", true);
                xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=utf-8");
                xhr.onreadystatechange = function() {
                    if (xhr.readyState === 4) {
                        if (xhr.status === 200) {
                            var response = JSON.parse(xhr.responseText);
                            Swal.fire({
                                position: 'center',
                                title: response.message,
                                icon: response.status,
                                showConfirmButton: false,
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
    };
    //Añadimos los botones a los td
    editButtonTD.appendChild(editButton);
    deleteButtonTD.appendChild(deleteButton);

    //Añadimos los td al tr
    tr.appendChild(editButtonTD);
    tr.appendChild(deleteButtonTD);

    //Añadimos el tr a la tabla
    tabla_bbdd.appendChild(tr);
}

function validateForm(id, value) {
    var title_notf; var submitButton;
    if (id == 1) { //Esto significa que el formulario está en modo añadir y no enviar
        title_notf = '¿Estás seguro de que quieres añadir estos datos?';
        submitButton = 'Añadir';
    } else {
        title_notf = "¿Estos son los datos que quieres EDITAR?";
        submitButton = 'Editar';
    }

    Swal.fire({
        title: title_notf,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: submitButton,
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            var xhr = new XMLHttpRequest();
            xhr.open("POST", 'tables.php?table=' + table + "&id=" + id + "&value=" + value, true);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=utf-8");
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        var response = JSON.parse(xhr.responseText);
                        Swal.fire({
                            position: 'center',
                            title: response.message,
                            icon: response.status,
                            showConfirmButton: false,
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
    return false; //Para que no se mande automaticamente el formulario
}

function form_nuevoValor() { //Funcion para cambiar lo visual de los formularios cuando quieres añadir un nuevo valor
    var h3_form = document.getElementById('h3_form');
    var form = document.getElementById('bothForms');
    var div_id = document.getElementById('div_id');
    var id_bothForms = document.getElementById('id_bothForms'); 
    var value_bothForms = document.getElementById('valor_bothForms');
    var btnSubmit = document.getElementById('btnSubmit');
    
    localStorage.setItem('form', 'new');
    h3_form.textContent = "Formulario para añadir NUEVOS valores a la tabla: " + capitalizeFirstLetter(table);
    btnSubmit.textContent = 'Añadir';
    id_bothForms.value = 1;  //Lo he puesto como 1 y no como null porque si no, no me dejaba seleccionar el valor del input
    div_id.style.display = 'none'; //Lo pongo en null y lo oculto ya que si vas a añadir uno, en la bbdd lo tengo como autoincrementable, no tienes que añadir id
    value_bothForms.value = null;
    
    form.style.display = 'block';
}