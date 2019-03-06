function ghiDanh(maKhoaHoc,taiKhoan){
    var model = JSON.stringify({MaKhoaHoc:maKhoaHoc,TaiKhoan:taiKhoan});
    console.log(model)
    urlAPI ='http://sv.myclass.vn/api/QuanLyTrungTam/GhiDanhKhoaHoc';
     $.ajax({
        url: 'http://sv.myclass.vn/api/QuanLyTrungTam/GhiDanhKhoaHoc',
        type:'POST',
        contentType:"application/json",
        dataType:"json",
        data: model
    }).done(function(res){
         console.log(res);
    }).fail(function(err){
            console.log(err);
    })
}
ghiDanh("12311","a")