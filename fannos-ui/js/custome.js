$(document).ready(function(){
    /* Hotels */
    var html = $('.new-rooms .row').first().html();
    $('.add-room').click(function(){
        row = $('.new-rooms .row').length + 1;
        if(row <= 5){
            $('.new-rooms').append("<div class='row'>" + html + "");
            $('.new-rooms .row:nth-child('+row+')').find('.rcount').html(row);
            $('.new-rooms .row:nth-child('+row+')').find('.custom-select option:selected').removeAttr("selected");
        } else {
            alert('Only Five rooms are selected');
        }
        $('.rcount').last().val(row);
        //$(newrow).find('.rcount').val(row);
    });

    $('.search-box').on('click', '.remove-room', function(){
        $(this).parent().remove();
    });

    /* Flights */
    $('#flight .nav-tabs .nav-item').click(function(){
        $('#ftype').val($(this).html());

        $('.returning').hide();
        $('.add-flight').hide();
        $('.new-flight').hide();
        $('.onewaysubmit').show();
        $('.multiplesubmit').hide();
        if($('#ftype').val() == "Return"){
            $('.returning').show();
            $('.multiplesubmit').hide();
            $('.onewaysubmit').show();
        } else if($('#ftype').val() == "One Way"){
            $('.onewaysubmit').show();
            $('.multiplesubmit').hide();
        } else {
            $('.add-flight').show();
            $('.new-flight').show();
            $('.multiplesubmit').show();
            $('.onewaysubmit').hide();
        }
    });

    var newflight = $('.new-flight').html();
    $('.add-flight').click(function(){
        $('.new-flight').append(newflight);
    });
});


$(function () {
        // $('#hcheckin').datepicker({
        //     minDate:new Date()
        // });

        // $('#hcheckout').datepicker({
        //     minDate:new Date(),
        // });

        $('#fdeparting').datepicker({
            minDate:new Date()
        });
        $('#fmulticitydeparting').datepicker({
            minDate:new Date()
        });
        $('#freturning').datepicker({
            minDate:new Date()
        });
        // $('#thingsFrom').datepicker({
        //     minDate:new Date()
        // });
        // $('#thingsTO').datepicker({
        //     minDate:new Date()
        // });
        
        // $('#insuranceForm').datepicker({
        //     minDate:new Date()
        // });
        // $('#insuranceTo').datepicker({
        //     minDate:new Date()
        // });
        
    });

    var min = new Date(),
    max = new Date(min.getFullYear(), min.getMonth() + 6, min.getDate());
                            
mobiscroll.datepicker('#start', {
    controls: ['calendar'],
    select: 'range',
    startInput: '#start',
    endInput: '#end',
    min: now,
    max: max
});


$('.input-daterange')
.datepicker({
    orientation: "auto",
    todayHighlight: true,
    autoclose: true,
    format: "d M yyyy",
    startView: "days",
    minViewDate: 0,
    maxViewDate: 0,
    weekStart: 1
});

$('#ArrivalDate').each(function () {
    $(this).on('changeDate', function(e) {
        CheckIn = $(this).datepicker('getDate');
        CheckOut = moment(CheckIn).add(1, 'day').toDate();
        $('#DepartDate').datepicker('update', CheckOut).focus();					
    });				
});