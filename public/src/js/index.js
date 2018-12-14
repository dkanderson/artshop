window.addEventListener('load', () => {

	const el = $('#app');

	const bannerTemplate = Handlebars.compile($('#banner').html());
	const homeContentTemplate = Handlebars.compile($('#home-content').html());
	const errorTemplate = Handlebars.compile($('#errorTemplate').html());

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

	router.add('/', () => {
		let html = bannerTemplate();
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

