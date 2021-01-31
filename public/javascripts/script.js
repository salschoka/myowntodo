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
      $("#lists").append("<p class='todo'>"+"タイトル:"+todo.todo_title+"<br>"+"todo:"+todo.what_todo+"<br>"+"追加した日:"+todo.addDate_todo+"</p>");
    })
//     JSON.parse(res);
//     $("#lists").append("<p class='todo'>"+res+"</p>");
  })
	.fail(function (err) {
			console.log("request failed");
			console.log("err: "+JSON.stringify(err));
	})
};