$('#display-details').click(() => {
    let d = $('#display-details');

    if( d.hasClass('fa-eye-slash') ) {
        d.removeClass('fa-eye-slash');
        d.addClass('fa-eye');

        $('#details').removeClass('details-closed');
        $('#details').addClass('details-open');
    } else {
        d.addClass('fa-eye-slash');
        d.removeClass('fa-eye');

        $('#details').addClass('details-closed');
        $('#details').removeClass('details-open');
    }
});