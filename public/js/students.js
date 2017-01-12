//before showing the modal:
$('#deleteModal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget) // Button that triggered the modal
    var id = button.data('id') // Extract info from data-* attributes

    var modal = $(this)
    modal.data('id', id); //put the id in the modal
})

$('#deleteStudent').click(function (e) {
    
    var id = Number($('#deleteModal').data('id'));
    $.post('/delete', {
        id: id
    }, function (data) {
        window.location.reload();
        console.log(data.title);
        if (data.error) {
            console.log(data.error);
        }
    });
});