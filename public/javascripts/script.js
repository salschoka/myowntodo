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
  });
};

function request() {
	console.log("function request() called");
	$.ajax({
    url: "./getlist",
		type: "GET",
    data: { name: "tester" },
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
      $("#lists").append("<div class='todo'><span>"+"タイトル:"+todo.todo_title+"<br>"+"todo:"+todo.what_todo+"<br>"+"追加した日:"+todo.addDate_todo+"</span><span class='fl_right'><span class='todo_button'><button class='todo_actualbutton' onclick=delete_todo()>delete</button></span><span class='todo_button'><button class='todo_actualbutton' onclick=close_todo()>close</button></span></span></div>");
    })
//     JSON.parse(res);
//     $("#lists").append("<p class='to_do'>"+res+"</p>");
  })
	.fail(function (err) {
			console.log("request failed");
			console.log("err: "+JSON.stringify(err));
	})
};

function close_todo(closeid) {
  $.ajax({
    type: "POST",
    url: './post',
    type: 'POST',
    data: {
      'name': "tester",
      'id': closeid,
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
    console.log("Status: "+errorThrown)
  }).always(function(/* jqXHR, textStatus*/) {
    //通信終了
    console.log("todo close end.")
  });
}

function delete_todo(deleteid) {
  $.ajax({
    type: "POST",
    url: './post',
    type: 'POST',
    data: {
      'name': "tester",
      'id': deleteid,
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
}

request();

// setInterval(request, 3000);