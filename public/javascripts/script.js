let _data = "";

function submit() {
	console.log("function submit() called");
//   console.log("submit: "+ document.getElementById("add_todo").value);
//   $.post( './post', $('#add_todo').value );

//   var text = $("#add_todo").serialize();
  var text = document.getElementById("add_todo").value;
  console.log("add_todo:"+text);
  $.ajax({
    type: "POST",
    url: './post',
    type: 'POST',
    data: {
      'name': "tester",
      'data': text
    },
    dataType: 'text'
  }).done(function( data,/* textStatus, jqXHR */) {
    //成功
    console.log("submit done,");
    console.log("res: "+data);

    document.getElementById("add_todo").value = '';
  }).fail(function(/* jqXHR, textStatus,*/ errorThrown) {
    //失敗
    console.log("submit failed");
    console.log("Status: "+errorThrown)
  }).always(function(/* jqXHR, textStatus*/) {
    //通信終了
    console.log("end.")
    request();
  });
};

function request(misc) {
	console.log("function request() called");
    console.log("misc is "+misc);
	var request_include_closed = false;
    console.log("requesting list");
	if (misc == "closed") {
	  console.log("and include closed todo");
      request_include_closed = true;
	}

	$.ajax({
    url: "./getlist",
		type: "GET",
    data: {
      name: "tester",
      includeClose: request_include_closed,
    },
    dataType: "text",
// 		cache: false,
  })
  .done(function (res) {
    console.log("request success.");
    console.log("res: "+res);

    if (res === _data) {
      console.log("Data not changed, dom update skipped.");
      return;
    }
    else {
      console.log("Data updated.");
      data = res;
    }

    const _res = JSON.parse(res);

    $(".todo").remove();

    _res.forEach(todo => {
      $("#lists").append("<div class='todo' data-todoid='"+todo.id_todo+"'><span>"+"タイトル:"+todo.todo_title+"<br>"+"todo:"+todo.what_todo+"<br>"+"追加した日:"+todo.addDate_todo+"<br>内部処理用id:"+todo.id_todo+"</span><span class='fl_right'><span class='todo_button'><button class='todo_actualbutton' onclick=delete_todo($(this).parents('div.todo').attr('data-todoid'))>delete</button></span><span class='todo_button'><button class='todo_actualbutton' onclick=close_todo($(this).parents('div.todo').attr('data-todoid'))>close</button></span></span></div>");
    })
//     JSON.parse(res);
//     $("#lists").append("<p class='to_do'>"+res+"</p>");
  })
	.fail(function (err) {
			console.log("request failed");
			console.log("err: "+JSON.stringify(err));
	})
};

function close_todo(close_id) {
  console.log("close:"+close_id);
  $.ajax({
    type: "POST",
    url: './post',
    type: 'POST',
    data: {
      'name': "tester",
      'id': close_id,
      'do':"close",
    },
    dataType: 'text'
  }).done(function( data,/* textStatus, jqXHR */) {
    //成功
    console.log("submit close done,");
    console.log("res: "+data);

  }).fail(function(/* jqXHR, textStatus,*/ errorThrown) {
    //失敗
    console.log("submit close failed");
    console.log("Status: "+JSON.stringify(errorThrown))
  }).always(function(/* jqXHR, textStatus*/) {
    //通信終了
    console.log("todo close end.")
  });
  request();
}

function delete_todo(delete_id) {
  console.log("delete:"+delete_id);
  $.ajax({
    type: "POST",
    url: './post',
    type: 'POST',
    data: {
      'name': "tester",
      'id': delete_id,
      'do':"delete",
    },
    dataType: 'text'
  }).done(function( data,/* textStatus, jqXHR */) {
    //成功
    console.log("submit delete done,");
    console.log("res: "+data);

  }).fail(function(/* jqXHR, textStatus,*/ errorThrown) {
    //失敗
    console.log("submit delete failed");
    console.log("Status: "+errorThrown)
  }).always(function(/* jqXHR, textStatus*/) {
    //通信終了
    console.log("todo delete end.")
  });
  request();
}

function unclose_todo(unclose_id) {
  console.log("unclose:"+unclose_id);
  $.ajax({
    type: "POST",
    url: './post',
    type: 'POST',
    data: {
      'name': "tester",
      'id': unclose_id,
      'do':"unclose",
    },
    dataType: 'text'
  }).done(function( data,/* textStatus, jqXHR */) {
    //成功
    console.log("submit unclose done,");
    console.log("res: "+data);

  }).fail(function(/* jqXHR, textStatus,*/ errorThrown) {
    //失敗
    console.log("submit unclose failed");
    console.log("Status: "+JSON.stringify(errorThrown))
  }).always(function(/* jqXHR, textStatus*/) {
    //通信終了
    console.log("todo unclose end.")
  });
  request();
}

request();

// setInterval(request, 3000);