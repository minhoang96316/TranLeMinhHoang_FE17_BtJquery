var course="" ;
var getCourseFromDB = function(courseId){
    $.ajax({
        url: 'http://sv.myclass.vn/api/QuanLyTrungTam/ChiTietKhoaHoc/'+ courseId,
        type:'GET',
    }).done(function(res){
            course = res;
            console.log(res);
            renderCourse();
    }).fail(function(err){

    })
}
function getParamsFromURL(){
    var params = window.location.search.substr(1,).split('=');
    var courseId = params[1];
    getCourseFromDB(courseId);
}
function renderCourse(){
    var content ="";
        content += `
        <p>Mã Khóa học: ${course.MaKhoaHoc}</p>
        <p>Tên Khóa học: ${course.TenKhoaHoc}</p>
        <p>Lượt xem: ${course.LuotXem}</p>
        <span>Hình ảnh: <img src="${course.HinhAnh}" style="height:300px"/></span>
        <p>Mô tả: ${course.MoTa}</p>
        <p>Người tạo: ${course.NguoiTao}</p>
        `
    $('#chiTietKhoaHoc').html(content);
}
getParamsFromURL();


 