function ajax_get_promise(url, callback) {
    return new Promise(function (resolve, reject) {
        xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", url, true);
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                resolve(xmlhttp.responseText);

                try {
                    var data = JSON.parse(xmlhttp.responseText);
                    // console.log(xmlhttp.responseText)
                } catch (err) {
                    reject(xmlhttp.responseText);
                    console.log(err.message + " in " + xmlhttp.responseText);
                    return;
                }

                callback(data);
            }
        }

        xmlhttp.send();
    });
}

function ajax_post(url, data, callback) {
    xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            try {
                let data_json = JSON.parse(xhr.responseText);
                // console.log(data_json);

                callback(data_json);
            } catch (err) {
                console.log(err.message + " in " + xhr.responseText);
                return;
            }
        }
    }

    xhr.send(data);
}
