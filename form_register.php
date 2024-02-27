<!DOCTYPE html>
<html lang="es">

<head>
    <?php
    include 'header.php';
    ?>
    <link rel="stylesheet" href="index.css">
</head>

<body>
    <div class="formulario">
        <img src="../imgs/radio.png">
        <form id="registerForm" method="POST" onsubmit="return confirmRegister()">
            <h3>Registar usuaria - CIM</h3>
            <div class="form-control">
                <input type="text" required="" name="user">
                <label>
                    <span style="transition-delay:0ms">U</span><span style="transition-delay:50ms">s</span><span style="transition-delay:100ms">u</span><span style="transition-delay:150ms">a</span><span style="transition-delay:200ms">r</span><span style="transition-delay:250ms">i</span><span style="transition-delay:300ms">o</span>
                </label>
            </div>
            <div class="form-control">
                <input type="password" required="" name="password">
                <label>
                    <span style="transition-delay:0ms">C</span><span style="transition-delay:50ms">o</span><span style="transition-delay:100ms">n</span><span style="transition-delay:150ms">t</span><span style="transition-delay:200ms">r</span><span style="transition-delay:250ms">a</span><span style="transition-delay:300ms">s</span><span style="transition-delay:350ms">e</span><span style="transition-delay:400ms">ñ</span><span style="transition-delay:450ms">a</span>
                </label>
            </div>
            <button data-text="Awesome" type="submit" class="btnLogin">
                <span class="actual-text">&nbsp;Registrar&nbsp;</span>
                <span class="hover-text" aria-hidden="true">&nbsp;Registrar&nbsp;</span>
            </button>
        </form>
    </div>
    <script>
        function confirmRegister() {
            var user = document.forms['registerForm']['user'].value;
            var password = document.forms['registerForm']['password'].value;

            Swal.fire({
                title: "¿Los datos son correctos?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Registrar",
                cancelButtonText: "Cancelar"
            }).then((result) => {
                if (result.isConfirmed) {
                    var xhr = new XMLHttpRequest();
                    xhr.open("POST", "register.php", true);
                    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                    xhr.onreadystatechange = function() {
                        if (xhr.readyState === 4 && xhr.status === 200) {
                            // Aquí puedes manejar la respuesta del servidor si es necesario
                            Swal.fire({
                                title: "¡Registrado!",
                                text: "El usuario ha sido registrado correctamente.",
                                icon: "success",

                            });
                        }
                    };
                    xhr.send("user=" + user + "&password=" + password);
                }
            });
            // Devolver false para prevenir el envío predeterminado del formulario
            return false;
        }
    </script>
</body>

</html>