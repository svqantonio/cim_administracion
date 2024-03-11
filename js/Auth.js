var setIntervalStarted = false;

function checkTokenExpiration() {
    var tokenExpiration = localStorage.getItem('tokenExpiration');
    var currentTime = new Date();

    if (currentTime > tokenExpiration) {
        return [
            "status" = false,
            "message" = "Tienes que volver a loguearte!"
        ];
    }
}