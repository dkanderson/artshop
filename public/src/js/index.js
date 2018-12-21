window.addEventListener('load', () => {

	const el = $('#app');

	const bannerTemplate = Handlebars.compile($('#banner').html());
	const homeContentTemplate = Handlebars.compile($('#home-content').html());
	const errorTemplate = Handlebars.compile($('#errorTemplate').html());
	const aboutTemplate = Handlebars.compile($('#about').html());
	const storeTemplate = Handlebars.compile($('#store').html());
	const contactTemplate = Handlebars.compile($('#contact').html());
	const addNewTemplate = Handlebars.compile($('#addNew').html());

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

	//Display Artwork
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
	/* jshint ignore:end */

	router.add('/about', () => {
		let html = aboutTemplate();
		el.html(html);
	});

	router.add('/store', () => {
		let html = storeTemplate();
		el.html(html);
	});

	router.add('/contact', () => {
		let html = contactTemplate();
		el.html(html);
	});

	// Perform POST request and update page
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
		}

		try {
			
			const response = await api.post('/addnew', formData);
			
			if(response.statusText === 'created'){
				alert('Success!');
			}

		} catch (error) {
			
			showError(error);
		}
	};
	/* jshint ignore:end */

	const submitHandler = () => {
		addNewArtwork();
		return false;
	};

	router.add('/add', () => {
		
		let html = addNewTemplate();
		el.html(html);

		try{
		// $('.form.add-new').form({
		// 	fields: {

		// 	}
		// })

		$('.form-submit').click(submitHandler);

		} catch (error) {
			showError(error);
		}	 
	});
	

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

