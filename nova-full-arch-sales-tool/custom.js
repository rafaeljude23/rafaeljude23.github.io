$(document).ready(function(){
	function defVal() {
		$('[def-val]').each(function(){
			var v = $(this).attr('def-val');
			$(this).val(v);
		});		
	}
	defVal();
	

	// RESET INPUT
	$('.reset-btn').click(function(){
		$('select, input').val('');
		$('input[type="checkbox"]').prop('checked', false);
		$('.accordion-body .accordion').addClass('d-none');
		$('.added-item').remove();
		$('.anaesthetic-fee-wrap').addClass('d-none');
		$('.fee-table').addClass('d-none');
		$('.patient-require-checkbox').addClass('d-none');
		$('.patient-require-input').addClass('d-none');
		defVal();
	});

	// ADD ITEM
	$('.add-item').click(function(){
		var a = `<div class="added-item">
								<div class="mb-3">
								  <input class="form-check-input" type="checkbox" id="" value="">
								  <label class="form-check-label" contenteditable=""></label>
								</div>
								<div class="row">
				      		<div class="col-md-6">
				      			<div class="input-group mb-3">
										  <span class="input-group-text">ID</span>
										  <input type="text" class="form-control" placeholder="">
										</div>
				      		</div>
				      		<div class="col-md-6">
				      			<div class="input-group mb-3">
									  <span class="input-group-text">FEE</span>
									  <input type="text" class="form-control" placeholder="">
									</div>
				      		</div>
				      	</div>								
							</div>`;

		$(a).insertBefore($(this).prev('.discount-row'));
	});


	// COLLAPSE
	$('select').change(function(){
		// OPTION 1 AND DR 1
		if ($('#treatmentDetails').val() == '1' && 
			$('#treatmentCoordinator').val()  && 
			$('#defaultSurgeon').val()) {
			$('#accordion1').removeClass('d-none') 
		} else {
			$('#accordion1').addClass('d-none'); 
		}

		if ($('#treatmentDetails').val() == '2' && 
			$('#treatmentCoordinator').val()  && 
			$('#defaultSurgeon').val()) {
			$('#accordion2').removeClass('d-none') 
		} else {
			$('#accordion2').addClass('d-none'); 
		}

		if ($('#treatmentDetails').val() == '3' && 
			$('#treatmentCoordinator').val()  && 
			$('#defaultSurgeon').val()) {
			$('#accordion3').removeClass('d-none') 
		} else {
			$('#accordion3').addClass('d-none'); 
		}

		if ($('#treatmentDetails').val() == '4' && 
			$('#treatmentCoordinator').val()  && 
			$('#defaultSurgeon').val()) {
			$('#accordion4').removeClass('d-none') 
		} else {
			$('#accordion4').addClass('d-none'); 
		}

		if ($('#treatmentDetails').val() == '5' && 
			$('#treatmentCoordinator').val()  && 
			$('#defaultSurgeon').val()) {
			$('#accordion5').removeClass('d-none') 
		} else {
			$('#accordion5').addClass('d-none'); 
		}

		if ($('#treatmentDetails').val() && 
			$('#treatmentCoordinator').val()  && 
			$('#defaultSurgeon').val()) {
			$('#accordion6').removeClass('d-none') 
		} else {
			$('#accordion6').addClass('d-none'); 
		}

		
		// SURGICAL FACILITY
		if($('.surgical-facility-select').val().length !== 0) {
			$('.anaesthetic-fee-wrap').removeClass('d-none');
		} else {
			$('.anaesthetic-fee-wrap').addClass('d-none');
		}

	});

	// CHECKBOX FOCUS
	$('.form-check-label:not(.patient-require-label)').click(function(){
		var checkBoxes = $(this).prev('.form-check-input');
		$(this).prev('.form-check-input').prop("checked", !checkBoxes.prop("checked"));
	});

	// ESTIMATE
	$('.estimate-select, .surgical-facility-select').change(function(){
		if($('.surgical-facility-select').val().length !== 0 && $('.estimate-select').val()) {
			$('.fee-table').removeClass('d-none');
		} else {
			$('.fee-table').addClass('d-none');
		}

		if ($('.estimate-select').val() == 1 ) {
			$('.fee-table .td-1').show().siblings().hide();
		}
		if ($('.estimate-select').val() == 2 ) {
			$('.fee-table .td-2').show().siblings().hide();
		}
		if ($('.estimate-select').val() == 3 ) {
			$('.fee-table .td-3').show().siblings().hide();
		}
		if ($('.estimate-select').val() == 4 ) {
			$('.fee-table .td-4').show().siblings().hide();
		}
		if ($('.estimate-select').val() == 5 ) {
			$('.fee-table .td-5').show().siblings().hide();
		}
		if ($('.estimate-select').val() == 6 ) {
			$('.fee-table .td-6').show().siblings().hide();
		}
		if ($('.estimate-select').val() == 7 ) {
			$('.fee-table .td-7').show().siblings().hide();
		}
		if ($('.estimate-select').val() == 8 ) {
			$('.fee-table .td-8').show().siblings().hide();
		}
	});


	// REQUIRED
	$('.patient-require-select').change(function(){
		if($(this).val() === 'required') {
			$('.patient-require-checkbox').removeClass('d-none');
		} else {
			$('.patient-require-checkbox').addClass('d-none');
		}
	});

	$('.patient-require-other').change(function(){
		if($(this).is(':checked')) {
			$('.patient-require-input').removeClass('d-none');	
		} else {
			$('.patient-require-input').addClass('d-none');
		}
	});
});