window.addEventListener('load', () => {

    const el = $('#app');

    const bannerTemplate = Handlebars.compile($('#banner').html());
    const errorTemplate = Handlebars.compile($('#errorTemplate').html());
    const aboutTemplate = Handlebars.compile($('#about').html());
    const storeTemplate = Handlebars.compile($('#store').html());
    const contactTemplate = Handlebars.compile($('#contact').html());
    const addNewTemplate = Handlebars.compile($('#addNew').html());
    const loginTemplate = Handlebars.compile($('#loginTemplate').html());
    const registerTemplate = Handlebars.compile($('#registerTemplate').html());
    const editTemplate = Handlebars.compile($('#editTemplate').html());
    const editlistTemplate = Handlebars.compile($('#editlistTemplate').html());
    const messageTemplate = Handlebars.compile($('#messageTemplate').html());
    const deleteTemplate = Handlebars.compile($('#deleteArtworkTemplate').html());
    const cartTemplate = Handlebars.compile($('#cartTemplate').html());
    const cartTotalTemplate = Handlebars.compile($('#cartTotalTemplate').html());
    const userNavTemplate = Handlebars.compile($('#userNavTemplate').html());


    var cart = [];
    loadUserNav({username: $.cookie('user')});


    const router = new Router({
        mode: 'history',
        page404: (path) => {
            const html = errorTemplate({
                class: 'not-found',
                title: 'Error 404 - Page Not Found',
                message: `The path '/${path}' does not exist`,
            });

            el.html(html);
        },
    });

    const api = axios.create({
        baseURL: 'http://localhost:3000/api',
        timeout: 5000,
    });


    // Display error
    const showError = (error) => {
        const { title, message } = error.response.data;
        const html = errorTemplate({ class: "sdds", title, message });
        el.html(html);
    };

    //---------------------------------------------------------------------------------------

    //	Home Page

    //---------------------------------------------------------------------------------------

    router.add('/', async () => {

        let html = bannerTemplate();
        el.html(html);

        try {
            const response = await api.get('/artwork');
            const artwork = response.data;

            html = bannerTemplate(artwork);
            el.html(html);

        } catch (error) {

            showError(error);

        }

        handleAddToCart();
    });


    router.add('/about', () => {
        let html = aboutTemplate();
        el.html(html);
    });

    //---------------------------------------------------------------------------------------

    //	Store

    //---------------------------------------------------------------------------------------

    router.add('/store', async () => {
        let html = storeTemplate();
        el.html(html);

        try {
            const response = await api.get('/artwork');
            const artwork = response.data;

            html = storeTemplate(artwork);
            el.html(html);

        } catch (error) {

            showError(error);

        }
    });

    //---------------------------------------------------------------------------------------

    //	Contact

    //---------------------------------------------------------------------------------------

    router.add('/contact', () => {
        let html = contactTemplate();
        el.html(html);
    });

    //---------------------------------------------------------------------------------------

    //	Login

    //---------------------------------------------------------------------------------------

    router.add('/login', () => {

        let html = loginTemplate();
        el.html(html);
        let login = $('#login');
        let emw = $('#error-msg-wrapper');
        let username = $('#username');
        let pwd = $('#password');
        let errMsg = $('#error-msg');

        emw.addClass('hidden');

        login.on('click', async (ev) => {

            ev.preventDefault();

            let formData = {
                username: username.val(),
                password: pwd.val()
            };

            const response = await getUserData(formData.username);

            if (formData.password === response.password) {
                $.cookie('user', response.username);
                window.location.href = '/';
            } else {

                pwd.addClass('err');
                errMsg.html('Invalid password');
                emw.removeClass('hidden');
            }
        });
    });

     //---------------------------------------------------------------------------------------

    //	Logout

    //---------------------------------------------------------------------------------------

    router.add('/logout', () => {
    	$.removeCookie('user');
    	window.location.href = '/';
    });

    //---------------------------------------------------------------------------------------

    //	Register User

    //---------------------------------------------------------------------------------------

    router.add('/register', () => {

        let html = registerTemplate();
        el.html(html);

        let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let emw = $('#error-msg-wrapper');
        let username = $('#username');
        let email = $('#email');
        let pwd = $('#password');
        let pwdc = $('#password-confirm');
        let exists = $('#exists');
        let register = $('#register-form');
        let userExistsFlag = false;
        let error = {
            username: {
                hasError: true,
                msg: 'unique username is required'
            },
            email: {
                hasError: true,
                msg: 'valid email address is required'
            },
            password: {
                hasError: true,
                msg: 'password must be 8 characters or more'
            },
            passwordconf: {
                hasError: true,
                msg: 'passwords do not match'
            }
        };

        emw.addClass('hidden');

        username.on('focusout', () => {

            if (username.val().length <= 0 || userExistsFlag) {
                displayError(username, 'username');
            } else {
                removeError(username, 'username');
            }

        });

        username.on('keyup', async (ev) => {

            const res = await getUserData(ev.currentTarget.value);

            if (res && ev.currentTarget.value.length) {
                exists.html('username exists');
                username.removeClass('match').addClass('err');
                userExistsFlag = true;
            } else {
                username.removeClass('err').addClass('match');
                userExistsFlag = false;
                exists.html('');
                emw.addClass('hidden');
            }
        });

        email.on('focusout', () => {

            if (!email.val().match(regex)) {
                displayError(email, 'email');
            } else {
                removeError(email, 'email');
            }
        });

        pwd.on('focusout keyup', () => {

            if (pwd.val().length <= 8) {
                displayError(pwd, 'password');
            } else {
                removeError(pwd, 'password');
            }
        });

        pwdc.on('keyup', () => {

            if (pwd.val() !== pwdc.val()) {
                displayError(pwdc, 'passwordconf');
            } else {
                removeError(pwdc, 'passwordconf');
            }
        });

        register.on('click', (ev) => {

            ev.preventDefault();

            if (isValidForm()) {

                let postCount = 0;
                let formData = {
                    username: username.val(),
                    email: email.val(),
                    password: pwd.val()
                };

                const response = addNewUser(formData);

                if (response.status === 200 || postCount < 1) {
                    postCount += 1;
                    $('#registration-form')[0].reset();
                    window.location.href = '/login';
                }

            }

            return true;
        });

        function displayError(el, type) {

            el.removeClass('match').addClass('err');
            let errMsg = $('#error-msg');
            error[`${type}`].hasError = true;

            errMsg.html(error[`${type}`].msg);
            emw.removeClass('hidden');
        }

        function removeError(el, type) {
            el.removeClass('err').addClass('match');
            emw.addClass('hidden');
            error[`${type}`].hasError = false;
        }



        function isValidForm() {
            if (error.username.hasError || userExistsFlag) {
                displayError(username, 'username');
                return false;
            } else if (error.email.hasError) {
                displayError(email, 'email');
                return false;
            } else if (error.password.hasError) {
                displayError(pwd, 'password');
                return false;
            } else if (error.passwordconf.hasError) {
                displayError(pwdc, 'passwordconf');
                return false;
            } else {
                return true;
            }
        }

        async function addNewUser(data) {
            try {
                const response = await api.post('/users', data);
                return response;
            } catch (error) {
                showError(error);
            }
        }


    });

    // make it global
    async function getUserData(username) {
        try {
            if (username) {
                const response = await api.get(`/users/${username}`);
                return response.data;
            }
        } catch (error) {
            showError(error);
        }
    }


    //---------------------------------------------------------------------------------------

    //	Upload Artwork

    //---------------------------------------------------------------------------------------

    /* jshint ignore:start */
    const addNewArtwork = async () => {
        const formData = {
            title: $("#title").val(),
            status: $('#status').val(),
            medium: $('#medium').val(),
            subject: $('#subject').val(),
            type: $('#type').val(),
            size: $('#size').val(),
            orientation: $('#orientation').val(),
            price: $('#price').val(),
            url: $('#url').val()
        };

        try {

            const response = await api.post('/addnew', formData);

            if (response.status === 200) {

                $('.add-new-form-wrapper').hide();
                $('#figure').hide();
                updateMessage(formData, true);
                $('#artworkFile').val('');

            }

        } catch (error) {

            showError(error);
        }
    };

    const uploadArtwork = async () => {

        const figureTemplate = Handlebars.compile($('#uploadedImage').html());
        const imgWrapper = $('#figure');
        const artworkFile = $('#artworkFile')[0].files[0];
        const fileData = new FormData();

        if (!artworkFile) {

            updateMessage(null, false, "No file selected");
            $('#message-wrapper').show();
            return false;

        }


        imgWrapper.show();
        $('#message-wrapper').hide();
        fileData.append("artwork", artworkFile);

        try {

            const uploadResponse = await api.post('/upload', fileData, { headers: { 'Content-Type': 'multipart/form-data' } });

            if (uploadResponse.status === 200) {

                $('.add-new-form-wrapper').show();
                $('#url').val(artworkFile.name);
                let html = figureTemplate({ imgUrl: artworkFile.name });
                imgWrapper.html(html);

            }

        } catch (error) {

            showError(error);
        }
    }
    /* jshint ignore:end */


    router.add('/add', () => {

        let html = addNewTemplate();
        el.html(html);

        $('.button-upload-artwork').on('click', (event) => {

            event.preventDefault();

            uploadArtwork();

        });

        $('.add-new-form-wrapper').hide();

        $('.form-submit').click(addNewArtwork);

    });



    //---------------------------------------------------------------------------------------

    //	Edit Artwork

    //---------------------------------------------------------------------------------------

    /* jshint ignore:start */
    const getEditList = async () => {

        try {

            const editResponse = await api.get('/artwork');

            let html = editlistTemplate(editResponse.data);
            el.html(html);

        } catch (error) {

            showError(error);

        }

    };

    const getSelected = async (id) => {

        try {

            const formWrapper = $('#edit-artwork-form-wrapper');
            const response = await api.get(`/artwork/${id}`);
            let html = editTemplate(response.data);
            formWrapper.html(html);
            formWrapper.show();

            $('#update-artwork-button').on('click', (ev) => {

                const updateData = {
                    title: $("#title").val(),
                    status: $('#status').val(),
                    medium: $('#medium').val(),
                    subject: $('#subject').val(),
                    type: $('#type').val(),
                    size: $('#size').val(),
                    orientation: $('#orientation').val(),
                    price: $('#price').val(),
                    url: $('#url').val()
                };

                updateSelected(ev.currentTarget.dataset.id, updateData, formWrapper);

            });


        } catch (error) {

            showError(error);

        }

    };

    const updateSelected = async (id, data, el) => {

        try {

            const response = await api.put(`/artwork/${id}`, data);

            if (response.status === 200) {

                el.hide();
                updateMessage(data, true);

            } else {

                updateMessage(data, false, "fuck if i know what happened");
            }

        } catch (error) {

            showError(error);
        }

    };


    const updateMessage = (data, success, err) => {

        const msg = $('#message-wrapper');

        const message = {};

        if (success) {

            message.messageType = "success";
            message.message = `Artwork ${data.title} updated successfully`;



        } else {

            message.messageType = "error";
            message.message = `Error encounterd: ${err}`;

        }

        msg.show();
        let html = messageTemplate(message);
        msg.html(html);

    }
    /* jshint ignore:end */


    router.add('/edit', () => {

        getEditList()
            .then(() => {

                $('.button-edit.edit-art').on('click', (ev) => {
                    getSelected(ev.currentTarget.dataset.id);
                });

            });

    });

    //---------------------------------------------------------------------------------------

    //	Delete Artwork

    //---------------------------------------------------------------------------------------


    /* jshint ignore:start */
    const loadArtwork = async () => {

        const response = await api.get('/artwork');
        let html = deleteTemplate(response.data);
        el.html(html);

    };

    const handleDeleteRequest = () => {

        $('.button-delete.delete-art').on('click', async (ev) => {

            const deleteRequest = await api.delete(`/artwork/${ev.currentTarget.dataset.id}`);

            if (deleteRequest.status === 200) {

                loadArtwork()
                    .then(handleDeleteRequest)
                    .catch(error => {
                        showError(error);
                    });

            }

        });

    };


    router.add('/delete', () => {

        loadArtwork()
            .then(handleDeleteRequest)
            .catch(error => {
                showError(error);
            });

    });
    /* jshint ignore:end */

    //---------------------------------------------------------------------------------------

    //	Shopping Cart

    //---------------------------------------------------------------------------------------

    /* jshint ignore:start */
    const removeFromCart = (index) => {

        let cartData = $.cookie('cart');

        cartData.splice(index, index + 1);
        $.cookie('cart', cartData);
        $('#cart-count').html($.cookie('cart').length);
        loadCart();

        if ($.cookie('cart').length === 0)
            $('#cart-count').hide();

    };
    /* jshint ignore:end */

    const loadCart = () => {

        let cartData = {};

        if (typeof $.cookie('cart') === 'object') {

            cartData = $.cookie('cart');

        } else {

            cartData = JSON.parse($.cookie('cart'));

        }


        let html = cartTemplate(cartData);
        el.html(html);


        /* jshint ignore:start */
        const cartTotal = cartData.reduce((accumulator, currentValue) => {

            let x = (+currentValue.price);
            return accumulator + x;

        }, 0);
        /* jshint ignore:end */

        $.cookie('cartTotal', cartTotal);
        let total = cartTotalTemplate({ total: cartTotal });
        $('#cart-total').html(total);

        $('.remove').on('click', (ev) => removeFromCart(ev.currentTarget.dataset.index));

    };


    router.add('/cart', () => {

        loadCart();

    });



    const handleAddToCart = () => {

        $('.button-cart').on('click', (ev) => {

            ev.preventDefault();

            const item = {
                id: ev.currentTarget.dataset.id,
                price: ev.currentTarget.dataset.price,
                title: ev.currentTarget.dataset.title,
                url: ev.currentTarget.dataset.url
            };


            if ($.cookie('cart')) {

                cart = $.cookie('cart');

            } else {

                $.cookie('cart', []);
                cart = $.cookie('cart');

            }

            cart.push(item);
            $.cookie('cart', cart);
            $('#cart-count').html($.cookie('cart').length).show();

        });
    };

    // Load user navigation
    function loadUserNav(data) {
        let html = userNavTemplate(data);
        $('#user-login').html(html);
    }


    // Navigate to current url
    router.navigateTo(window.location.pathname);

    $.cookie.json = true;

    if ($.cookie('cart')) {

        $('#cart-count').html($.cookie('cart').length).show();

    } else {

        $('#cart-count').hide();

    }

    // Highlight Active Menu on Refresh/Page Reload
    const link = $(`a[href$='${window.location.pathname}']`);
    link.addClass('active');

    $('.link').on('click', (event) => {
        // Block browser page load
        event.preventDefault();

        // Highlight Active Menu on Click
        const target = $(event.target);
        $('.link').removeClass('active');
        target.addClass('active');

        // Navigate to clicked url
        const href = target.attr('href');
        const path = href.substr(href.lastIndexOf('/'));
        router.navigateTo(path);
    });
});