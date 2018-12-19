window.addEventListener('load', () => {

	const el = $('#app');

	const bannerTemplate = Handlebars.compile($('#banner').html());
	const homeContentTemplate = Handlebars.compile($('#home-content').html());
	const errorTemplate = Handlebars.compile($('#errorTemplate').html());
	const aboutTemplate = Handlebars.compile($('#about').html());
	const storeTemplate = Handlebars.compile($('#store').html());
	const contactTemplate = Handlebars.compile($('#contact').html());

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
	}

	//Display Artwork
	router.add('/', async() => {
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
	})

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

