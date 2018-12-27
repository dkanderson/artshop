window.addEventListener('load', () => {

	const el = $('#app');

	const bannerTemplate = Handlebars.compile($('#banner').html());
	const homeContentTemplate = Handlebars.compile($('#home-content').html());
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


	const imgUrl = "";

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
		const html = errorTemplate({class: "sdds", title, message});
		el.html(html);
	};

	//---------------------------------------------------------------------------------------

	//	Home Page

	//---------------------------------------------------------------------------------------

	/* jshint ignore:start */
	router.add( '/', async() => {
		
		let html = bannerTemplate();
		el.html(html);

		try{
			const response = await api.get('/artwork');
			const artwork = response.data;

			html = bannerTemplate(artwork);
			el.html(html);

		} catch (error) {
			
			showError(error);

		} finally {

			console.log('loaded');
			
		}
	});
	

	router.add('/about', () => {
		let html = aboutTemplate();
		el.html(html);
	});

	//---------------------------------------------------------------------------------------

	//	Store

	//---------------------------------------------------------------------------------------

	router.add('/store', async() => {
		let html = storeTemplate();
		el.html(html);

		try{
			const response = await api.get('/artwork');
			const artwork = response.data;

			html = storeTemplate(artwork);
			el.html(html);

		} catch (error) {
			
			showError(error);

		} finally {

			console.log('loaded');
			
		}
	});

	router.add('/contact', () => {
		let html = contactTemplate();
		el.html(html);
	});

	router.add('/login', () => {
		let html = loginTemplate();
		el.html(html);
	});

	router.add('/register', () => {
		let html = registerTemplate();
		el.html(html);
	});
	/* jshint ignore:end */

	
	//---------------------------------------------------------------------------------------

	//	Upload Artwork

	//---------------------------------------------------------------------------------------

	/* jshint ignore:start */
	const addNewArtwork = async() => {
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
			
			if (response.status === 200){
				
				$('.add-new-form-wrapper').hide();
				$('#figure').hide();
				updateMessage(formData, true);
				$('#artworkFile').val('');

			}

		} catch (error) {
			
			showError(error);
		}
	};

	const uploadArtwork = async() => {

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

		try{

			const uploadResponse = await api.post('/upload', fileData, {headers: {'Content-Type': 'multipart/form-data'}});
			
			if(uploadResponse.status === 200){
				
				$('.add-new-form-wrapper').show();
				$('#url').val(artworkFile.name);
				let html = figureTemplate({imgUrl: artworkFile.name});
				imgWrapper.html(html);

			}

		} catch ( error ) {

			showError ( error );
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

	//	End Upload Artwork

	//---------------------------------------------------------------------------------------


	//---------------------------------------------------------------------------------------

	//	Edit Artwork

	//---------------------------------------------------------------------------------------

	/* jshint ignore:start */
	const getEditList = async() => {

		try{
			
			const editResponse = await api.get('/artwork');

			let html = editlistTemplate(editResponse.data);
			el.html(html);
		
		} catch ( error ) {

			showError(error);

		}

	};

	const getSelected = async(id) => {

		try{
			
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

		
		} catch ( error ) {

			showError(error);

		}

	};

	const updateSelected = async(id, data, el) => {

		try {

			const response = await api.put(`/artwork/${id}`, data);
			
			if (response.status === 200) {
				
				el.hide();
				updateMessage(data, true);

			} else {

				updateMessage(data, false, "fuck if i know what happened");
			}

		} catch ( error ) {

			showError( error );
		}

	};


	const updateMessage = (data, success, err) => {

		const msg = $('#message-wrapper');

		const message = {};

		if ( success ) {

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

	
	router.add('/edit', () =>{

		getEditList()
		 .then(() => {

		 	$('.button-edit.edit-art').on('click', (ev) => {
		 		getSelected(ev.currentTarget.dataset.id);
		 	});

		 });

	});
	

	//---------------------------------------------------------------------------------------

	//	End Edit Artwork

	//---------------------------------------------------------------------------------------//


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
			
			if ( deleteRequest.status === 200 ) { 
				
				loadArtwork()
				.then(handleDeleteRequest)
				.catch (error => {
					showError(error);
				});

			}

		});

	};
	

	router.add('/delete', () => {

		loadArtwork()
		.then(handleDeleteRequest)
		.catch (error => {
			showError(error);
		});

	});
	/* jshint ignore:end */
		

	// Navigate to current url
	router.navigateTo(window.location.pathname);

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

