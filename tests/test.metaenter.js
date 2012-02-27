module("MetaEnter Core");

test("Object initiation", function() {

	var obj = $("#message").metaenter();


	ok( typeof obj === "object", "Should return object, self." );
	ok( obj.hasClass("metabrag-init"), "Should have class set." );

	$("#message").metaenter("remove"); // Should reset

	// reset instance
	ok( !obj.hasClass("metabrag-init"), "Should have been reset." );
});


test("Object options", function() {

	var obj = $("#message").metaenter();
	ok( obj.metaenter('options').useDiv, "Should have standard options useDiv" );


	// Change option
	obj.metaenter('options', {
		useDiv: false
	});

	ok( !obj.metaenter('options').useDiv, "Options should be changed" );

	// Change option
	obj.metaenter('options', {
		test: false
	});

	ok( !obj.metaenter('options').useDiv, "Options set should not change other options" );

	// Change option
	obj.metaenter('options', {
		foo: "test"
	});

	ok( obj.metaenter('options').foo === "test", "Custom options should be able to be applied." );

	// Test chaining

	ok( obj.metaenter('options', { foo: "test"}) === obj, "Method should allow chaining" );

	// reset instance
	$("#message").metaenter("remove");
});

test("Input box", function() {

	var obj = $("#message").metaenter({
		useDiv: true,
		useFacebookStyle: true
	});

	ok( obj.parents("form").find(".metabrag-message-box").length , "Should create div with content editable" );
	ok( obj.parents("form").find(".metabrag-return-button").length , "Should create checkbox" );

	// reset instance
});
