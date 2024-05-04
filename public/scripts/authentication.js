const Authentication = (function() {
    // This stores the current signed-in user
    let user = null;

    // This function gets the signed-in user
    const getUser = function() {
        return user;
    }

    // This function sends a sign-in request to the server
    // * `username`  - The username for the sign-in
    // * `password`  - The password of the user
    // * `onSuccess` - This is a callback function to be called when the
    //                 request is successful in this form `onSuccess()`
    // * `onError`   - This is a callback function to be called when the
    //                 request fails in this form `onError(error)`
    const signin = function(username, password, onSuccess, onError) {

        //
        // A. Preparing the user data
        //
        const data = JSON.stringify({username, password});
        //
        // B. Sending the AJAX request to the server
        //
        fetch("/signin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: data
        })
            .then((res) => {
                return res.json();
            })
            .then((json) => {
                if(json.status === "error"){
                    if(onError){
                        onError(json.error);
                    }
                }
                if(json.status === "success"){
                    if(onSuccess){
                        user = json.user;
                        onSuccess();
                    }
                }
            })
        //
        // F. Processing any error returned by the server
        //
        
        //
        // H. Handling the success response from the server
        //

        // Delete when appropriate
        //if (onError) onError("This function is not yet implemented.");
    };

    // This function sends a validate request to the server
    // * `onSuccess` - This is a callback function to be called when the
    //                 request is successful in this form `onSuccess()`
    // * `onError`   - This is a callback function to be called when the
    //                 request fails in this form `onError(error)`
    const validate = function(onSuccess, onError) {

        //
        // A. Sending the AJAX request to the server
        //
        fetch("/validate")
            .then((res) => {
                return res.json();
            })
            .then((json) => {
                if(json.status === "error"){
                    if(onError){
                        onError(json.error);
                    }
                }
                if(json.status === "success"){
                    if(onSuccess){
                        user = json.user;
                        onSuccess();
                    }
                }
            })
        //
        // C. Processing any error returned by the server
        //

        //
        // E. Handling the success response from the server
        //

        // Delete when appropriate
        if (onError) onError("This function is not yet implemented.");
    };

    // This function sends a sign-out request to the server
    // * `onSuccess` - This is a callback function to be called when the
    //                 request is successful in this form `onSuccess()`
    // * `onError`   - This is a callback function to be called when the
    //                 request fails in this form `onError(error)`
    const signout = function(onSuccess, onError) {
        // fetch("/signout", {
        //     method: "GET",
        //     headers: {
        //         "Content-Type": "application/json"
        //     },
        //     body: data
        // })
        fetch("/signout")
            .then((res) => {
                return res.json()
            })
            .then((json) => {
                if(json.status === "success"){
                    if(onSuccess){
                        user = null;
                        onSuccess();
                    }
                }
            })
        // Delete when appropriate
        if (onError) onError("This function is not yet implemented.");
    };

    return { getUser, signin, validate, signout };
})();
