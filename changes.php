<?php  
    // Conexión a la base de datos
    $servername = "lldn637.servidoresdns.net";  
    $username = "qaik701";     
    $password = "Ant0n10Cabr0n";   
    $dbname = "qaik695";  

    $conn = mysqli_connect($servername, $username, $password, $dbname);
    mysqli_set_charset($conn, "utf8mb4");

    if (!$conn) {
        die("Error en la conexión: " . mysqli_connect_error()); 
    } else {
        session_start();
        // En el parámetro tiene que venir la tabla indicada y los datos de inicio de sesión o te tira para el menú principal.
        if (isset($_GET['table']) && isset($_SESSION['user']) && isset($_SESSION['password']) && isset($_SESSION['tipo_user'])) {
            $table = $_GET['table']; $user = $_SESSION['user']; $password = $_SESSION['password']; $tipo_user = $_SESSION['tipo_user'];

            $ruta_retorno = "administration_index.php?user=$user&password=$password&tipo_user=$tipo_user";

            $sql = "SELECT id, cast(AES_DECRYPT(valor,'xyz123') AS char) AS valor FROM $table ORDER BY id;";

            $formulario = "creación";
            $creacion = true; $edicion = false;    

            if (!isset($_POST['valor']))
                $valor = null;
            else 
                $valor = $_POST['valor'];

            if ($_SERVER["REQUEST_METHOD"] == "POST" && $_GET['funcion'] == 'edicion' && isset($_GET['id']) && !isset($_POST['valor'])) {
                // Cuando le das al botón de editar y busca los datos en función del id
                $formulario = "edición";
                $creacion = false; $edicion = true;
    
                $id = $_GET['id']; //echo "ID recibido cuando le das al boton de editar: " . $id . "<br>";
                $sql = "SELECT cast(aes_decrypt(valor, 'xyz123') AS char) AS valor FROM $table WHERE id = $id;";
                
                $result = $conn->query($sql);
                if ($result->num_rows > 0) {
                    while ($row = $result->fetch_assoc()) {
                        $valor = $row['valor'];
                    }
                }
            } else if (isset($_GET['table']) && isset($_GET['funcion']) && $_GET['funcion'] == 'borrar' && isset($_GET['id'])) {
                // Cuando le das al botón de borrar y busca el id 
                $table = $_GET['table'];
                $id = $_GET['id'];

                $consulta_fk = "SET foreign_key_checks = 0";
                $sql = "DELETE FROM $table WHERE id = $id";

                if ($conn->query($consulta_fk) === TRUE) { 
                    if ($conn->query($sql) === TRUE) {
                        echo "  <script>
                                    alert('¡Borrado ejecutado correctamente!');
                                    window.location.href = 'changes.php?table=$table';
                                </script>";
                        exit;
                    } else
                        echo "<script>alert('¡Fallo al ejecutar consulta de borrado!');</script>";
                } 
            } else if ($_SERVER["REQUEST_METHOD"] == "POST" && $_GET['funcion'] == 'creacion' && !isset($_POST['valor'])) {
                // Cuando le das al botón de nuevo valor y reinicia el formulario
                $valor = null;
                $creacion = true; $edicion = false;
            } else if ($_SERVER['REQUEST_METHOD'] == 'POST' && $_GET['funcion'] == 'creacion' && isset($_POST['valor'])) {
                // Cuando has introducido valores en el formulario de creación
                $valor = $_POST['valor'];
            
                $sql = "INSERT INTO $table (valor) VALUES (AES_ENCRYPT('$valor', 'xyz123'))";
                if ($conn->query($sql) === TRUE) {
                    echo "<script>alert('¡Inserción ejecutada correctamente!');</script>";

                    $valor = null;
                    $edicion = false; $creacion = true;
                }
                else
                    echo "<script>alert('¡Fallo al ejecutar consulta de inserción!');</script>";
            } else if ($_SERVER['REQUEST_METHOD'] == 'POST' && $_GET['funcion'] == 'edicion' && isset($_POST['id']) && isset($_POST['valor'])) {
                // Cuando el formulario de edición tiene valores
                $valor = $_POST['valor']; $id = $_POST['id'];
                
                $sql = "UPDATE $table SET valor = AES_ENCRYPT('$valor','xyz123') WHERE id = $id";
                //echo $sql;
                if ($conn->query($sql) === TRUE) {
                    echo "<script>alert('¡Edición ejecutada correctamente!');</script>";

                    $valor = null;
                    $edicion = false; $creacion = true;
                } else {
                    echo "<script>alert('¡Fallo al ejecutar consulta de edición!');</script>";
                }
            } else if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_GET['table']) && $_GET['funcion'] == 'borrado' && isset($_GET['id'])) {
                // Cuando borra el valor según el id 
                $id = $_GET['id'];
                $table = $_GET['table'];
    
                echo "  <script>
                            if (confirm('¿Estás seguro de que quieres borrar esta usuaria?')) {
                                window.location.href = 'changes.php?table=$table&funcion=borrar&id=$id';
                            } else {
                                window.location.href = '$ruta_retorno';
                            }
                        </script>";
            }
        } else {
            header("Location: $ruta_retorno");
            exit();
        }
    }
?>
<html lang="es">
    <head>
        <meta charset="UTF-8">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
        <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js" integrity="sha384-I7E8VVD/ismYTF4hNIPjVp/Zjvgyol6VFvRkX/vR+Vc4jQkC+hVqc2pM8ODewa9r" crossorigin="anonymous"></script>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.min.js" integrity="sha384-BBtl+eGJRgqQAUMxJ7pMwbEyER4l1g+O15P+16Ep7Q9Q+zqX6gSbd85u4mG4QzX+" crossorigin="anonymous"></script>
    </head>
    <body>
        <div class="container">
            <button class="btn btn-link" onclick="window.location.href='<?php echo $ruta_retorno ?>'"><- Volver</button>
            <table class="table table-hover table-success" border="1px solid black">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Valor</th>
                        <th>Editar</th>
                        <th>Borrar</th>
                    </tr>
                </thead>
                <tbody>
                    <?php
                        $sql = "SELECT id, cast(aes_decrypt(valor,'xyz123') as char) as valor FROM $table ORDER BY id";

                        $result = $conn->query($sql);
                        if ($result->num_rows > 0) {
                            while ($row = $result->fetch_assoc()) {
                                $id_recibido = $row['id'];
                                echo "<tr>";
                                    echo "<td>" . $id_recibido . "</td>";
                                    echo "<td>" . ucfirst($row['valor']) . "</td>";
                                    echo "<td><form method='post' action='changes.php?table=$table&funcion=edicion&id=$id_recibido'><button type='submit' class='btn btn-primary'>Editar</button></form></td>";
                                    echo "<td><form method='post' action='changes.php?table=$table&funcion=borrado&id=$id_recibido'><button class='btn btn-outline-danger'>Borrar</button></form></td>";
                                echo "</tr>";
                            }
                        }
                    ?>
                </tbody>
            </table>

            <?php
                // Botón para reiniciar el formulario para crear valores nuevos
                echo "<form method='post' action='changes.php?table=$table&funcion=creacion'><button type='submit' class='btn btn-outline-primary'>Nuevo valor</button></form>";
            ?>

            <?php
                if ($edicion == true && $creacion == false) {
                    //Formulario de edición
                    echo "<form method='POST' action='changes.php?table=$table&funcion=edicion&id=$id'>
                            <h3>Formulario de $formulario de valores de la tabla: <strong>$table</strong></h3>
                            <input type='text' name='valor' id='valor' value='$valor' placeholder='Introduce el valor'><br><br>
                            <input type='hidden' name='id' value='$id'>
                            <button type='submit' class='btn btn-outline-success'>Enviar</button>
                        </form>";
                } else if ($edicion == false && $creacion == true) {
                    //Formulario de creación
                    echo "<form method='POST' action='changes.php?table=$table&funcion=creacion'>
                            <h3>Formulario de $formulario de valores de la tabla: <strong>$table</strong></h3>
                            <input type='text' name='valor' id='valor' value='$valor' placeholder='Introduce el valor'><br><br>
                            <button type='submit' class='btn btn-outline-success'>Enviar</button>
                        </form>";
                }
            ?>
        </div>
    </body>
</html>